declare module "pptx-parser" {
  export function parsePptx(data: Uint8Array): Promise<any>;
}
