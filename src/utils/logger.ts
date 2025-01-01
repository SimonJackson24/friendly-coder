type LogLevel = 'info' | 'warn' | 'error' | 'build' | 'package' | 'schema';
type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
};

class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;
  private static buildErrors: LogEntry[] = [];
  private static schemaChanges: LogEntry[] = [];
  private static packageOperations: LogEntry[] = [];
  private static fileSystemOperations: LogEntry[] = [];

  static log(level: LogLevel, message: string, context?: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    // Store log
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Categorize specific logs
    switch (level) {
      case 'build':
        if (context?.error) {
          this.buildErrors.push(entry);
          console.error(`[BUILD][${entry.timestamp}] ${message}`, context || '');
        } else {
          console.log(`[BUILD][${entry.timestamp}] ${message}`, context || '');
        }
        break;
      case 'package':
        this.packageOperations.push(entry);
        console.log(`[PACKAGE][${entry.timestamp}] ${message}`, context || '');
        break;
      case 'schema':
        this.schemaChanges.push(entry);
        console.log(`[SCHEMA][${entry.timestamp}] ${message}`, context || '');
        break;
      case 'error':
        console.error(`[${entry.timestamp}] ${message}`, context || '');
        break;
      case 'warn':
        console.warn(`[${entry.timestamp}] ${message}`, context || '');
        break;
      default:
        console.log(`[${entry.timestamp}] ${message}`, context || '');
    }
  }

  static getLogs() {
    return this.logs;
  }

  static getBuildErrors() {
    return this.buildErrors;
  }

  static getSchemaChanges() {
    return this.schemaChanges;
  }

  static getPackageOperations() {
    return this.packageOperations;
  }

  static getFileSystemOperations() {
    return this.fileSystemOperations;
  }

  static getLastBuildError() {
    return this.buildErrors[this.buildErrors.length - 1];
  }

  static getContextSummary() {
    const recentBuildErrors = this.buildErrors.slice(-5);
    const recentSchemaChanges = this.schemaChanges.slice(-5);
    const recentPackageOps = this.packageOperations.slice(-5);
    const recentFileOps = this.fileSystemOperations.slice(-5);

    return {
      recentBuildErrors,
      recentSchemaChanges,
      recentPackageOperations: recentPackageOps,
      recentFileOperations: recentFileOps,
      buildErrorCount: this.buildErrors.length,
      schemaChangeCount: this.schemaChanges.length,
      packageOperationCount: this.packageOperations.length,
      fileOperationCount: this.fileSystemOperations.length,
    };
  }

  static clearLogs() {
    this.logs = [];
    this.buildErrors = [];
    this.schemaChanges = [];
    this.packageOperations = [];
    this.fileSystemOperations = [];
  }

  static logFileOperation(operation: string, path: string, details?: any) {
    this.fileSystemOperations.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `File ${operation}: ${path}`,
      context: details
    });
  }

  static logSchemaChange(table: string, operation: string, details?: any) {
    this.log('schema', `Schema ${operation} on table ${table}`, details);
  }

  static logPackageOperation(operation: string, packageName: string, version?: string) {
    this.log('package', `Package ${operation}: ${packageName}${version ? `@${version}` : ''}`, { version });
  }

  static logBuildError(error: Error | string, file?: string) {
    this.log('build', typeof error === 'string' ? error : error.message, {
      error: typeof error === 'string' ? { message: error } : error,
      file
    });
  }
}

export default Logger;