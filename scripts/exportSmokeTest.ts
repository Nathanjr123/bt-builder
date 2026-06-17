import { exportTree } from '../src/hooks/useTreeExporter.ts';
import { EXAMPLE_PRESETS } from '../src/exampleTree.ts';

let ok = true;

for (const preset of EXAMPLE_PRESETS) {
  const { yaml, validation } = exportTree(preset.nodes, preset.edges, 'en');
  console.log(`\n=== ${preset.id} ===`);
  console.log(yaml);
  console.log('Warnings:', validation.warnings);

  const checks: [string, boolean][] = [
    ['root is Selector', yaml.startsWith('type: "Selector"')],
    ['has children block', yaml.includes('children:')],
    ['groups conditions', yaml.includes('conditions:')],
    ['groups actions', yaml.includes('actions:')],
    ['no validation warnings', validation.warnings.length === 0],
  ];
  for (const [name, pass] of checks) {
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}`);
    if (!pass) ok = false;
  }
}

process.exit(ok ? 0 : 1);
