// Tell a Whole Story in 32 Characters — make.fun entry.
// Writes one Wi-Fi network name (30 characters) to /output/entry.txt.
// Node 22+, stdlib only. The name is a fixed string: the program's job is
// to gate it against the bounty rules and write it byte-exact.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The story: a breakup, a move-out, and the petty victory of walking away
// with the one thing that still matters — the password. The narrator is
// gone, but they are still on the network.
const name = "I moved out, kept the password";

// Gate: the sealed scorer only accepts UTF-8 text of 1 to 32 characters,
// not only white space. Fail loudly here rather than submit an invalid file.
const chars = [...name].length;
const bytes = Buffer.byteLength(name, "utf8");
// Control characters would break the network list display, so reject them.
const hasControl = [...name].some((c) => c.codePointAt(0) < 0x20);
if (
  chars < 1 ||
  chars > 32 ||
  bytes > 32 ||
  hasControl ||
  name.includes("\n") ||
  name.trim().length === 0 ||
  name !== name.trim()
) {
  throw new Error(`name fails the gate (${chars} chars, ${bytes} bytes)`);
}

mkdirSync("/output", { recursive: true });
// No trailing newline: the file is exactly the name, nothing extra.
writeFileSync("/output/entry.txt", name, "utf8");

// Read back what was written: the file the judge sees must be the name,
// byte for byte, with nothing extra.
if (readFileSync("/output/entry.txt", "utf8") !== name) {
  throw new Error("entry.txt does not match the name");
}

console.log(`wrote ${chars} chars to /output/entry.txt: ${name}`);
