import { detectHermesContext, exportHadaraContext } from '../hermes/context-export';
import { createHermesDetectReport, createHermesExportContextReport } from './hermes-json';

export interface HermesCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleHermesCommand(input: HermesCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'detect') {
    if (input.jsonOutput) {
      console.log(JSON.stringify(createHermesDetectReport(input.projectRoot), null, 2));
    } else {
      console.log(JSON.stringify(detectHermesContext(input.projectRoot), null, 2));
    }
    return true;
  }

  if (sub === 'export-context') {
    if (input.jsonOutput) {
      console.log(JSON.stringify(createHermesExportContextReport(input.projectRoot), null, 2));
    } else {
      const filePath = exportHadaraContext(input.projectRoot);
      console.log(`[HADARA] Exported Hermes/Harness context: ${filePath}`);
    }
    return true;
  }

  return false;
}
