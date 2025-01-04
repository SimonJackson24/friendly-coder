import { z } from "zod";

// Define schema for workflow triggers
export const triggerSchema = z.object({
  events: z.array(z.enum(['push', 'pull_request', 'manual', 'scheduled'])),
  branches: z.array(z.string()).optional(),
  schedule: z.string().optional(), // cron format
});

// Define schema for environment variables
export const environmentSchema = z.object({
  name: z.string(),
  variables: z.record(z.string()),
  secrets: z.array(z.string()),
});

// Define schema for build steps
export const buildStepSchema = z.object({
  name: z.string(),
  type: z.enum(['install', 'test', 'build', 'deploy']),
  command: z.string(),
  environment: z.record(z.string()).optional(),
  condition: z.string().optional(),
  timeout: z.number().optional(),
  retries: z.number().optional(),
});

// Define schema for deployment configuration
export const deploymentConfigSchema = z.object({
  platform: z.enum(['vercel', 'netlify', 'cloudflare']),
  environment: z.enum(['development', 'staging', 'production']),
  domain: z.string().optional(),
  buildCommand: z.string().optional(),
  outputDirectory: z.string().optional(),
});

// Define the complete workflow schema
export const workflowSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  triggers: triggerSchema,
  environments: z.array(environmentSchema),
  steps: z.array(buildStepSchema),
  deployment: deploymentConfigSchema.optional(),
  notifications: z.object({
    slack: z.string().optional(),
    email: z.array(z.string()).optional(),
  }).optional(),
});

export type WorkflowConfig = z.infer<typeof workflowSchema>;
export type BuildStep = z.infer<typeof buildStepSchema>;
export type DeploymentConfig = z.infer<typeof deploymentConfigSchema>;
export type Environment = z.infer<typeof environmentSchema>;