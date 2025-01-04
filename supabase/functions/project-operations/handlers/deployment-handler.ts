import { handleDeployment } from '../deployment.ts';

export async function handleDeploymentOperations(operation: string, data: any) {
  switch (operation) {
    case 'deploy': {
      const { platform, config } = data;
      return await handleDeployment(platform, config);
    }
    default:
      throw new Error(`Unknown deployment operation: ${operation}`);
  }
}