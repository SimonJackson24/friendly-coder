type LogLevel = 'info' | 'warn' | 'error' | 'build';
type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
};

class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000; // Keep last 1000 logs

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

    // Also log to console
    switch (level) {
      case 'warn':
        console.warn(`[${entry.timestamp}] ${message}`, context || '');
        break;
      case 'error':
        console.error(`[${entry.timestamp}] ${message}`, context || '');
        break;
      case 'build':
        console.log(`[BUILD][${entry.timestamp}] ${message}`, context || '');
        break;
      default:
        console.log(`[${entry.timestamp}] ${message}`, context || '');
    }
  }

  static getLogs() {
    return this.logs;
  }

  static getLastBuildError() {
    return this.logs
      .filter(log => log.level === 'error' || log.level === 'build')
      .pop();
  }

  static clearLogs() {
    this.logs = [];
  }
}

export default Logger;