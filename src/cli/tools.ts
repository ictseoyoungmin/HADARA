import { createToolsListReport } from '../services/tools-list';

export interface ToolsCommandInput {
  args: string[];
  jsonOutput: boolean;
}

export function handleToolsCommand(input: ToolsCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'list') return false;

  const report = createToolsListReport();
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const surface of report.surfaces.cli) {
      console.log(`cli | ${surface.category} | ${surface.readOnly ? 'read-only' : 'writes-or-executes'} | ${surface.name}`);
    }
    for (const surface of report.surfaces.mcp) {
      console.log(`mcp | ${surface.category} | ${surface.readOnly ? 'read-only' : 'writes'} | ${surface.name}`);
    }
    for (const disabled of report.disabled) {
      console.log(`disabled | ${disabled.category} | ${disabled.name} | ${disabled.reason}`);
    }
  }
  return true;
}
