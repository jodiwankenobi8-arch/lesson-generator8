import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const createWorkerMock = vi.fn()

vi.mock("tesseract.js", () => ({
  createWorker: (...args: unknown[]) => createWorkerMock(...args),
}))

import { extractImageTextWithOcr } from "./extractImageOcr"

describe("extractImageTextWithOcr runtime hardening", () => {
  const originalWindow = globalThis.window
  const originalUrl = globalThis.URL
  let createObjectUrlMock: ReturnType<typeof vi.fn>
  let revokeObjectUrlMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    createWorkerMock.mockReset()
    createObjectUrlMock = vi.fn()
    revokeObjectUrlMock = vi.fn()

    Object.defineProperty(globalThis, "window", {
      value: {},
      configurable: true,
      writable: true,
    })

    Object.defineProperty(globalThis, "URL", {
      value: {
        createObjectURL: createObjectUrlMock,
        revokeObjectURL: revokeObjectUrlMock,
      },
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      configurable: true,
      writable: true,
    })

    Object.defineProperty(globalThis, "URL", {
      value: originalUrl,
      configurable: true,
      writable: true,
    })
  })

  it("revokes the object URL even when worker startup fails", async () => {
    createObjectUrlMock.mockReturnValueOnce("blob:ocr-1")
    createWorkerMock.mockRejectedValueOnce(new Error("Worker init failed"))

    await expect(
      extractImageTextWithOcr(new TextEncoder().encode("fake-image").buffer)
    ).rejects.toThrow("Worker init failed")

    expect(createObjectUrlMock).toHaveBeenCalledTimes(1)
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:ocr-1")
  })

  it("serializes screenshot OCR jobs so the second worker waits for the first job to finish", async () => {
    let resolveFirstRecognize: ((value: { data: { text: string; confidence: number } }) => void) | null = null

    const firstWorker = {
      recognize: vi.fn(
        () =>
          new Promise<{ data: { text: string; confidence: number } }>((resolve) => {
            resolveFirstRecognize = resolve
          })
      ),
      terminate: vi.fn().mockResolvedValue(undefined),
    }

    const secondWorker = {
      recognize: vi.fn().mockResolvedValue({
        data: {
          text: "Second screenshot line",
          confidence: 81,
        },
      }),
      terminate: vi.fn().mockResolvedValue(undefined),
    }

    createObjectUrlMock
      .mockReturnValueOnce("blob:ocr-1")
      .mockReturnValueOnce("blob:ocr-2")

    createWorkerMock
      .mockResolvedValueOnce(firstWorker)
      .mockResolvedValueOnce(secondWorker)

    const firstPromise = extractImageTextWithOcr(
      new TextEncoder().encode("first-image").buffer
    )
    const secondPromise = extractImageTextWithOcr(
      new TextEncoder().encode("second-image").buffer
    )

    await vi.waitFor(() => {
      expect(createWorkerMock).toHaveBeenCalledTimes(1)
    })
    expect(secondWorker.recognize).not.toHaveBeenCalled()

    const finishFirstRecognize =
      resolveFirstRecognize as unknown as
        | ((value: { data: { text: string; confidence: number } }) => void)
        | undefined

    if (!finishFirstRecognize) {
      throw new Error("Expected first OCR recognize resolver to be captured.")
    }

    finishFirstRecognize({
      data: {
        text: "First screenshot line",
        confidence: 72,
      },
    })

    await expect(firstPromise).resolves.toEqual({
      lines: ["First screenshot line"],
      averageConfidence: 0.72,
      notes: [
        "OCR processed 1 image source.",
        "Average OCR confidence: 72%.",
      ],
    })

    await expect(secondPromise).resolves.toEqual({
      lines: ["Second screenshot line"],
      averageConfidence: 0.81,
      notes: [
        "OCR processed 1 image source.",
        "Average OCR confidence: 81%.",
      ],
    })

    expect(createWorkerMock).toHaveBeenCalledTimes(2)
    expect(secondWorker.recognize).toHaveBeenCalledWith("blob:ocr-2")
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:ocr-1")
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:ocr-2")
    expect(firstWorker.terminate).toHaveBeenCalledTimes(1)
    expect(secondWorker.terminate).toHaveBeenCalledTimes(1)
  })
})




