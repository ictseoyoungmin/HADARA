import { getFlag, getIntegerOption } from './args';
import { createTuiReadModel } from '../tui/read-model';
import { renderTuiSnapshot } from '../tui/snapshot';
import { createTuiTerminalSession, TuiTerminalInput, TuiTerminalOutput } from '../tui/terminal';

export interface TuiCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
  input?: TuiTerminalInput;
  output?: TuiTerminalOutput;
}

export function handleTuiCommand(input: TuiCommandInput): boolean {
  if (input.args[0] !== 'tui') return false;
  const sub = input.args[1];
  if (sub && sub !== '--snapshot' && sub !== '--compact' && sub !== '--json' && !sub.startsWith('--')) return false;

  const widthPolicy = getFlag(input.args, '--compact') ? 'compact' : undefined;
  const width = getIntegerOption(input.args, '--width', { min: 20, max: 300 });
  const height = getIntegerOption(input.args, '--height', { min: 10, max: 120 });
  const output = input.output ?? (process.stdout as TuiTerminalOutput);
  const terminalInput = input.input ?? (process.stdin as TuiTerminalInput);

  if (getFlag(input.args, '--snapshot')) {
    const snapshot = renderTuiSnapshot(createTuiReadModel(input.projectRoot), { width, height, widthPolicy });
    if (input.jsonOutput) {
      output.write(`${JSON.stringify({ schemaVersion: 'hadara.tui.snapshot.cli.v1', command: 'tui.snapshot', ok: true, text: snapshot.text }, null, 2)}\n`);
    } else {
      output.write(snapshot.text);
    }
    return true;
  }

  if (!terminalInput.isTTY) {
    output.write('[HADARA] TUI requires an interactive terminal. Use hadara tui --snapshot for a read-only smoke render.\n');
    process.exitCode = 1;
    return true;
  }

  const session = createTuiTerminalSession({
    projectRoot: input.projectRoot,
    input: terminalInput,
    output,
    width,
    height,
    widthPolicy
  });
  const stop = (): void => session.stop();
  process.once('SIGINT', stop);
  process.once('exit', stop);
  session.start();
  return true;
}
