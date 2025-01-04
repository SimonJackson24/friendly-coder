import { BuildContext } from './types.ts';

export async function executeCommand(command: string, context: BuildContext): Promise<{ success: boolean; output: string }> {
  console.log(`Executing command: ${command}`);
  
  try {
    const process = new Deno.Command('sh', {
      args: ['-c', command],
      stdout: 'piped',
      stderr: 'piped',
    });

    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);

    if (code !== 0) {
      console.error(`Command failed with code ${code}:`, error);
      return { success: false, output: error };
    }

    return { success: true, output };
  } catch (error) {
    console.error('Command execution error:', error);
    return { success: false, output: error.message };
  }
}

export async function runTests(context: BuildContext, framework: string): Promise<{ success: boolean; output: string }> {
  const testCommands: Record<string, string> = {
    'jest': 'npx jest --ci',
    'vitest': 'npx vitest run',
    'mocha': 'npx mocha',
    'cypress': 'npx cypress run',
  };

  const command = testCommands[framework] || 'npm test';
  return executeCommand(command, context);
}

export async function runBuild(context: BuildContext): Promise<{ success: boolean; output: string }> {
  return executeCommand('npm run build', context);
}