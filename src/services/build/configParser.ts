import { BuildConfig } from "./types";

export class WorkflowConfigParser {
  static validateConfig(config: any): BuildConfig {
    if (!config.steps || !Array.isArray(config.steps)) {
      throw new Error('Invalid config: steps must be an array');
    }

    // Validate each step
    config.steps.forEach((step: any, index: number) => {
      if (!step.name) {
        throw new Error(`Step ${index} must have a name`);
      }
      if (!step.type || !['install', 'test', 'build', 'deploy'].includes(step.type)) {
        throw new Error(`Step ${index} must have a valid type`);
      }
      if (!step.command) {
        throw new Error(`Step ${index} must have a command`);
      }
    });

    return config as BuildConfig;
  }

  static parseYaml(yamlContent: string): BuildConfig {
    try {
      // For now, we'll use a simple JSON parse
      // In the next iteration, we'll add proper YAML parsing
      const config = JSON.parse(yamlContent);
      return this.validateConfig(config);
    } catch (error) {
      throw new Error(`Failed to parse workflow config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static generateDefaultConfig(): BuildConfig {
    return {
      steps: [
        {
          name: 'Install Dependencies',
          type: 'install',
          command: 'npm install'
        },
        {
          name: 'Run Tests',
          type: 'test',
          command: 'npm test'
        },
        {
          name: 'Build',
          type: 'build',
          command: 'npm run build'
        }
      ],
      environment: {
        NODE_ENV: 'production'
      }
    };
  }
}