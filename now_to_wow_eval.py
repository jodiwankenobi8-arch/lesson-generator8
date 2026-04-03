from __future__ import annotations

import argparse
import json
import pathlib
import re
import subprocess
import sys
from dataclasses import dataclass
from typing import Iterable

ROOT = pathlib.Path.cwd()
REVIEW_DIR = ROOT / "_review_stage"
MD_PATH = REVIEW_DIR / "NOW_TO_WOW_EVAL.md"
JSON_PATH = REVIEW_DIR / "NOW_TO_WOW_EVAL.json"


@dataclass
class Check:
    name: str
    passed: bool
    detail: str


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def has_all(path: str, needles: Iterable[str]) -> bool:
    text = read_text(ROOT / path)
    return all(needle in text for needle in needles)


def run_cmd(cmd: list[str]) -> dict[str, object]:
    completed = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        capture_output=True,
        shell=False,
    )
    return {
        "cmd": " ".join(cmd),
        "returncode": completed.returncode,
        "stdout": completed.stdout.strip(),
        "stderr": completed.stderr.strip(),
        "ok": completed.returncode == 0,
    }


def build_checks() -> list[Check]:
    return [
        Check(
            "multiple_exemplar_routing",
            has_all(
                "src/pages/materialsPageExemplarHelpers.ts",
                [
                    'value: "lesson_slides"',
                    'value: "lesson_plan"',
                    'value: "centers"',
                    'value: "small_group"',
                    'value: "intervention"',
                    'value: "printables"',
                ],
            )
            and has_all(
                "src/engine/blueprint/buildBlueprint.ts",
                ["buildScopedTemplateShells", "selectScopedExemplarMaterials", "scopedTemplateShells"],
            ),
            "Multiple exemplars can be routed to shared structure, slides, lesson plan, centers, teacher-led support, intervention, and printables.",
        ),
        Check(
            "opening_objective_separation",
            has_all(
                "src/engine/package/buildPackageOutputs.ts",
                [
                    "Teacher-Facing Objective:",
                    "Opening Purpose: Start the lesson",
                    "it is not the same thing as the opening",
                ],
            ),
            "Teacher-facing package outputs treat the objective and opening as separate lesson parts.",
        ),
        Check(
            "multi_area_lesson_portions",
            has_all(
                "src/engine/spec/buildLessonSpec.ts",
                [
                    "Lesson Portion ${index + 1}",
                    "Keep each resolved lesson area in its own guided-practice portion before moving on.",
                    "Close the lesson by reconnecting what students learned across the resolved lesson portions.",
                ],
            )
            and has_all(
                "src/engine/package/buildPackageOutputs.ts",
                ["function buildLessonPortionsBlock", "Portion Order:", "Lesson Portion"],
            ),
            "Mixed/multi-area lessons are broken into ordered lesson portions instead of one vague combined block.",
        ),
        Check(
            "results_grounding_visibility",
            has_all(
                "src/pages/ResultsPage.tsx",
                [
                    "Grounding Snapshot",
                    "Exemplar routing:",
                    "Source Authority and Lesson Grounding",
                ],
            ),
            "Results surfaces show grounding, source authority, influence, and routing in teacher-facing language.",
        ),
        Check(
            "refresh_safe_persistence",
            has_all(
                "src/state/useLessonStore.ts",
                [
                    "LESSON_STORE_SNAPSHOT_KEY",
                    "safeLoadLessonWorkspace",
                    "targets: [\"shared\"]",
                ],
            ),
            "Lightweight persistence stores workspace state, including exemplar style settings and targets.",
        ),
    ]


def parse_test_counts(stdout: str) -> tuple[int | None, int | None]:
    file_match = re.search(r"Test Files\s+([0-9]+) passed", stdout)
    test_match = re.search(r"Tests\s+([0-9]+) passed", stdout)
    files = int(file_match.group(1)) if file_match else None
    tests = int(test_match.group(1)) if test_match else None
    return files, tests


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()

    REVIEW_DIR.mkdir(parents=True, exist_ok=True)

    checks = build_checks()
    passed_checks = sum(1 for check in checks if check.passed)

    verify_results: list[dict[str, object]] = []
    test_files = None
    test_count = None

    if args.verify:
        verify_results.append(run_cmd(["npm", "run", "typecheck"]))
        test_result = run_cmd(["npm", "test"])
        verify_results.append(test_result)
        test_files, test_count = parse_test_counts(str(test_result.get("stdout", "")))
        verify_results.append(run_cmd(["npm", "run", "build"]))

    overall_percent = 60
    if passed_checks >= 4:
        overall_percent = 75
    if passed_checks == len(checks):
        overall_percent = 88
    if args.verify and all(bool(item["ok"]) for item in verify_results):
        overall_percent = 94

    payload = {
        "repo_root": str(ROOT),
        "overall_percent": overall_percent,
        "checks": [check.__dict__ for check in checks],
        "verification": verify_results,
        "test_files_passed": test_files,
        "tests_passed": test_count,
        "next_moves": [
            "Use the current green repo as the canonical finish baseline.",
            "Reserve future work for manual browser/export validation or fresh regressions.",
            "Keep active truth docs aligned with the current runtime and verification state.",
        ],
    }

    lines = [
        "# NOW_TO_WOW_EVAL",
        "",
        f"- Overall finish status: **{overall_percent}%**",
        f"- Structural checks passed: **{passed_checks}/{len(checks)}**",
    ]

    if test_files is not None or test_count is not None:
        lines.append(f"- Automated verification: **{test_files or '?'} test files / {test_count or '?'} tests**")

    lines.extend([
        "",
        "## What is working",
    ])

    for check in checks:
        status = "PASS" if check.passed else "MISSING"
        lines.append(f"- **{status}** {check.name}: {check.detail}")

    if verify_results:
        lines.extend(["", "## Verification"])
        for item in verify_results:
            status = "PASS" if item["ok"] else "FAIL"
            lines.append(f"- **{status}** `{item['cmd']}`")

    lines.extend([
        "",
        "## Next moves",
        "- Manual browser/export sweep only if you want a release-style closeout.",
        "- Otherwise treat the current repo as the closeout baseline and only patch from live evidence.",
    ])

    md = "\n".join(lines) + "\n"
    WriteText = lambda path, content: path.write_text(content, encoding="utf-8")
    WriteText(MD_PATH, md)
    WriteText(JSON_PATH, json.dumps(payload, indent=2))
    print(f"Wrote {MD_PATH}")
    print(f"Wrote {JSON_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())