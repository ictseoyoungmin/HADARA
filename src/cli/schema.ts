import { getStringOption } from './args';
import { createVocabularyReport } from '../services/controlled-vocabulary';

export interface SchemaCommandInput {
  args: string[];
  jsonOutput: boolean;
}

export function handleSchemaCommand(input: SchemaCommandInput): boolean {
  const domain = getStringOption(input.args, '--domain') ?? positionalDomain(input.args);
  const report = createVocabularyReport(domain);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
    return true;
  }
  if (!report.ok) {
    for (const issue of report.issues) {
      console.error(`${issue.severity}: ${issue.message}`);
    }
    process.exitCode = 1;
    return true;
  }
  if (report.filter) {
    const entry = report.domains[0];
    console.log(`${entry.domain} (${entry.surface})`);
    console.log(`  allowed: ${entry.allowed.join(', ')}`);
    return true;
  }
  console.log('Controlled vocabulary domains (use `hadara schema --domain <id>` or `hadara schema <id>`):');
  for (const entry of report.domains) {
    console.log(`  ${entry.domain.padEnd(30)} ${entry.allowed.join(', ')}`);
  }
  return true;
}

function positionalDomain(args: string[]): string | undefined {
  const candidate = args[1];
  if (!candidate || candidate.startsWith('-')) return undefined;
  return candidate;
}
