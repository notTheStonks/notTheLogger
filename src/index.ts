import * as fs from 'fs';
import * as path from 'path';

/**
 * Possible log levels.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Possible logging modes.
 */
type LogMode = 'console' | 'json' | 'txt';

/**
 * A structure representing a single log entry.
 */
type LogEntry = {
  /**
   * The ISO timestamp for when the log entry was generated.
   */
  timestamp: string;
  /**
   * The name of the service that generated the log.
   */
  service: string;
  /**
   * The moedul within the service that generated the log.
   */
  module: string;
  /**
   * The method within the class that generated the log.
   */
  caller: string;
  /**
   * The severity level of the log.
   */
  level: LogLevel;
  /**
   * The actual message to be logged.
   */
  message: string;
};

/**
 * A Logger class providing console, JSON, and text logging functionality.
 */
class Logger {
  private logFilePath = '';
  private textLogFilePath = '';
  private logModes: LogMode[];
  private colorMap: Record<LogLevel, string> = {
    debug: '\x1b[32m',
    info: '\x1b[34m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    fatal: '\x1b[35m'
  };

  /**
   * Creates a new Logger instance.
   * @param service - The name of the service using the logger.
   * @param moduleName - The module within the service using the logger.
   * @param mode - The logging mode(s) to use. Supported modes: console, json, txt.
   */
  constructor(private service: string, private moduleName: string, mode: LogMode[]) {
    this.logModes = mode;
    // Only create logs folder if txt or json modes are included
    if (this.logModes.includes('txt') || this.logModes.includes('json')) {
      const logsDir = path.join(__dirname, 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      if (this.logModes.includes('json')) {
        this.logFilePath = path.join(logsDir, `${this.service}.log.json`);
      }
      if (this.logModes.includes('txt')) {
        this.textLogFilePath = path.join(logsDir, `${this.service}.log.txt`);
      }
    }
  }

  /**
   * Writes a log entry, accepting multiple message arguments and displaying them comma-separated.
   */
  private writeLog(caller:string,level: LogLevel, ...rawMessages: Array<string | object>) {
    const finalMessage = rawMessages
      .map(msg => typeof msg === 'object' ? JSON.stringify(msg) : msg)
      .join(', ');

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      service: this.service,
      module: this.moduleName,
      caller,
      level,
      message: finalMessage
    };

    // Console logging
    if (this.logModes.includes('console')) {
      // eslint-disable-next-line no-console
      console.log(`${this.colorMap[level]}[${level.toUpperCase()}]\x1b[0m`, entry);
    }

    // JSON logging
    if (this.logModes.includes('json') && this.logFilePath) {
      let logs: LogEntry[] = [];
      if (fs.existsSync(this.logFilePath)) {
        try {
          const contents = fs.readFileSync(this.logFilePath, 'utf-8');
          logs = JSON.parse(contents);
        } catch {
          logs = [];
        }
      }
      logs.push(entry);
      fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2));
    }

    // Text logging
    if (this.logModes.includes('txt') && this.textLogFilePath) {
      fs.appendFileSync(
        this.textLogFilePath,
        `${entry.timestamp} ${this.service} ${this.moduleName} ${caller} [${level.toUpperCase()}]: ${finalMessage}\n`
      );
    }
  }

  /**
   * Logs a debug-level message or object.
   * @param msg - The message or object to log.
   */
  public debug(...msgs: Array<string | object>) {
    this.writeLog(Logger.getCaller(),'debug', ...msgs);
  }

  /**
   * Logs an info-level message or object.
   * @param msg - The message or object to log.
   */
  public info(...msgs: Array<string | object>) {
    this.writeLog(Logger.getCaller(),'info', ...msgs);
  }

  /**
   * Logs a warn-level message or object.
   * @param msg - The message or object to log.
   */
  public warn(...msgs: Array<string | object>) {
    this.writeLog(Logger.getCaller(),'warn', ...msgs);
  }
  
  /**
   * Logs an error-level message or object.
   * @param msg - The message or object to log.
   */
  public error(...msgs: Array<string | object>) {
    this.writeLog(Logger.getCaller(),'error', ...msgs);
  }

  /**
   * Logs a fatal-level message or object.
   * @param msg - The message or object to log.
   */
  public fatal(...msgs: Array<string | object>) {
    this.writeLog(Logger.getCaller(),'fatal', ...msgs);
  }

  public static getCaller():string{
    // Retrieve call stack
    const stack = new Error().stack ?? '';
    // The third stack line typically points to the caller of writeLog;
    // adjust indexing as needed if the order changes
    return stack.split('\n')[3]?.trim() || '';
  }
}

/**
 * Caches and retrieves logger instances by a unique identifier.
 */
const instances: { [id: string]: Logger } = {};

/**
 * Retrieves or creates a Logger instance for the specified service, module, and log mode(s).
 * @param service - Name of the service requesting a logger.
 * @param moduleName - Name of the module requesting a logger.
 * @param mode - The logging mode(s) to use. Supported modes: console, json, txt.
 * @returns An existing or newly created Logger instance.
 */
export function getLogger(service: string, moduleName: string, mode: LogMode[]): Logger {
  const id = service + moduleName;
  if (!instances[id]) {
    instances[id] = new Logger(service, moduleName, mode);
  }
  return instances[id];
}

/**
 * Removes an existing Logger instance for the specified service and module.
 * @param service - Name of the service requesting logger removal.
 * @param moduleName - Name of the module requesting logger removal.
 */
export function removeLogger(service: string, moduleName: string): void {
  const id = service + moduleName;
  delete instances[id];
}