// Funniest Autocorrect Fail — make.fun entry
// Writes one line to /output/entry.txt: a text message where autocorrect
// swapped one ordinary word for a wildly wrong one.
//
// The line: a guest complimenting Mom's cooking, except autocorrect turned
// the pasta shape "penne" into "penis". One word wrong, whole compliment
// derailed — clear slip, surprising wrong word, reads like a real text.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "Dinner was great, tell Mom her pasta was amazing, especially the penis.";

const OUTPUT_PATH = "/output/entry.txt";

function main(): void {
  const bytes = Buffer.byteLength(ENTRY, "utf8");
  if (bytes < 1 || bytes > 199) {
    throw new Error(`entry must be 1-199 bytes, got ${bytes}`);
  }
  if (ENTRY.trim().length === 0 || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  // No trailing newline: the gate counts every character.
  writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  verify(OUTPUT_PATH, ENTRY);
  console.log(`wrote ${bytes} bytes to ${OUTPUT_PATH}`);
}

// Re-read what was written and hold it to the same gate the scorer uses:
// UTF-8, 1-199 characters, not only whitespace, exactly one line, and no
// trailing newline. A mismatch here is a loud failure, never a silent one.
function verify(path: string, expected: string): void {
  const actual = readFileSync(path, "utf8");
  if (actual !== expected) {
    throw new Error("verification failed: file content differs from entry");
  }
  const chars = [...actual].length;
  if (chars < 1 || chars > 199) {
    throw new Error(`verification failed: ${chars} characters, need 1-199`);
  }
  if (actual.trim().length === 0 || actual.includes("\n")) {
    throw new Error("verification failed: entry is blank or multi-line");
  }
  if (actual.endsWith("\n")) {
    throw new Error("verification failed: trailing newline present");
  }
}

main();
