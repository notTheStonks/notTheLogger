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
   * The module within the service that generated the log.
   */
  module: string;
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
      console.log(logsDir)
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
   * Writes a log entry to console, JSON file, or text file based on the specified modes.
   * @param level - The severity level of the log.
   * @param message - The text message to be logged.
   */
  private writeLog(level: LogLevel, message: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      service: this.service,
      module: this.moduleName,
      level,
      message
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
        `${entry.timestamp} [${level.toUpperCase()}]: ${entry.message}\n`
      );
    }
  }

  /**
   * Logs a debug-level message.
   * @param msg - The message to log.
   */
  public debug(msg: string) {
    this.writeLog('debug', msg);
  }

  /**
   * Logs an info-level message.
   * @param msg - The message to log.
   */
  public info(msg: string) {
    this.writeLog('info', msg);
  }

  /**
   * Logs a warn-level message.
   * @param msg - The message to log.
   */
  public warn(msg: string) {
    this.writeLog('warn', msg);
  }

  /**
   * Logs an error-level message.
   * @param msg - The message to log.
   */
  public error(msg: string) {
    this.writeLog('error', msg);
  }

  /**
   * Logs a fatal-level message.
   * @param msg - The message to log.
   */
  public fatal(msg: string) {
    this.writeLog('fatal', msg);
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