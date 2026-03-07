const fs = require("fs");

function patchFile(path, replacements) {
  let text = fs.readFileSync(path, "utf8");
  for (const [from, to, label] of replacements) {
    if (!text.includes(from)) {
      throw new Error(`Missing expected snippet for ${label} in ${path}`);
    }
    text = text.replace(from, to);
  }
  fs.writeFileSync(path, text, "utf8");
  console.log(`Patched ${path}`);
}

patchFile("src/pages/WizardProgress.tsx", [
  [
    '            transform: "rotate(-1deg)",\r\n',
    '',
    'remove rotated now-open card'
  ]
]);

patchFile("src/pages/InputsPage.tsx", [
  [
    '    transform: "rotate(-1.2deg)",\r\n',
    '',
    'remove rotated pinned notes'
  ],
  [
    '              gridTemplateColumns: "minmax(0, 1.45fr) minmax(250px, 0.8fr)",\r\n',
    '              gridTemplateColumns: "1fr",\r\n',
    'stack standards note below group notes'
  ],
  [
    "you'll",
    "you'll",
    'noop-safe apostrophe check'
  ]
]);

patchFile("src/pages/MaterialsPage.tsx", [
  [
    '    transform: "rotate(-1deg)",\r\n',
    '',
    'remove rotated pinned notes'
  ]
]);

console.log("All orchard straightening patches applied.");
