import { analyzeDependencies } from '../dependencies.ts';

export async function handleDependencyOperations(operation: string, data: any) {
  switch (operation) {
    case 'analyze-dependencies':
      return await analyzeDependencies(data);
    default:
      throw new Error(`Unknown dependency operation: ${operation}`);
  }
}