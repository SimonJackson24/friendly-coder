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
        }
        console.log(`[BUILD][${entry.timestamp}] ${message}`, context || '');
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

  static getLastBuildError() {
    return this.buildErrors[this.buildErrors.length - 1];
  }

  static getContextSummary() {
    return {
      recentBuildErrors: this.buildErrors.slice(-5),
      recentSchemaChanges: this.schemaChanges.slice(-5),
      recentPackageOperations: this.packageOperations.slice(-5),
    };
  }

  static clearLogs() {
    this.logs = [];
    this.buildErrors = [];
    this.schemaChanges = [];
    this.packageOperations = [];
  }
}

export default Logger;