import { printCommandRemovedReport } from './removed-command';

export interface WritePreflightCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleWriteCommand(input: WritePreflightCommandInput): boolean {
  if (input.args[0] !== 'write') return false;
  const sub = input.args[1];
  if (sub !== 'preflight') return false;
  return printCommandRemovedReport(
    {
      commandId: 'write.preflight',
      removedCommand: 'hadara write preflight',
      replacementCommand: 'hadara policy preflight-shell <command> --json',
      note: 'The standalone write-preflight surface duplicated policy preflight guidance and is no longer part of the public CLI.'
    },
    input.jsonOutput
  );
}
