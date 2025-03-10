/**
 * Test suite for the NotTheLogger functionality, covering multiple logging modes and input types.
 */
import { getLogger, removeLogger } from '../index';
import * as fs from 'fs';
import * as path from 'path';

describe('Logger', () => {
  /**
   * The service name used for testing.
   */
  const serviceName = 'testService';

  /**
   * The module name used for testing.
   */
  const moduleName = 'testModule';

  /**
   * The path to the logs directory used for testing.
   */
  const logsDir = path.join(__dirname, '../logs');

  /**
   * The path to the JSON log file used for testing.
   */
  const jsonLogPath = path.join(logsDir, `${serviceName}.log.json`);

  /**
   * The path to the TXT log file used for testing.
   */
  const txtLogPath = path.join(logsDir, `${serviceName}.log.txt`);

  /**
   * Runs before each test, removing the logger and any existing logs.
   */
  beforeEach(() => {
    removeLogger(serviceName, moduleName);
    if (fs.existsSync(txtLogPath)) { fs.unlinkSync(txtLogPath); }
    if (fs.existsSync(jsonLogPath)) { fs.unlinkSync(jsonLogPath); }
    if (fs.existsSync(logsDir)) { fs.rmdirSync(logsDir); }
  });

  /**
   * Runs after each test, removing any created logs.
   */
  afterEach(() => {
    if (fs.existsSync(jsonLogPath)) {
      fs.unlinkSync(jsonLogPath);
    }
    if (fs.existsSync(txtLogPath)) {
      fs.unlinkSync(txtLogPath);
    }
    if (fs.existsSync(logsDir)) {
      fs.rmdirSync(logsDir);
    }
    removeLogger(serviceName, moduleName);
  });

  /**
   * Validates behavior when JSON parse fails, ensuring the logger recovers gracefully.
   */
  it('should gracefully handle invalid JSON when reading the log file', () => {
    const logger = getLogger(serviceName, moduleName, ['json']);
    logger.info('Valid JSON entry');

    // Overwrite the file with invalid JSON to trigger the catch block
    fs.writeFileSync(jsonLogPath, 'Invalid JSON Content');

    // Spy on console to avoid spamming test output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { /* no-op */ });

    // Attempt another log to invoke the try/catch
    logger.fatal('Should fail to parse previous content');

    expect(fs.existsSync(jsonLogPath)).toBe(true);

    consoleSpy.mockRestore();
  });

  /**
   * Tests the logger with a single string argument (TXT mode).
   */
  it('should log a single string argument', () => {
    const logger = getLogger(serviceName, moduleName, ['txt']);
    logger.info('Single string argument');
    expect(fs.existsSync(txtLogPath)).toBe(true);
    const content = fs.readFileSync(txtLogPath, 'utf-8');
    expect(content).toContain('Single string argument');
  });

  /**
   * Tests the logger with a single object argument (TXT mode).
   */
  it('should log a single object argument', () => {
    const logger = getLogger(serviceName, moduleName, ['txt']);
    logger.warn({ foo: 'bar' });
    expect(fs.existsSync(txtLogPath)).toBe(true);
    const content = fs.readFileSync(txtLogPath, 'utf-8');
    expect(content).toContain('{"foo":"bar"}');
  });

  /**
   * Tests the logger with multiple arguments, both strings and objects, comma-separated (TXT mode).
   */
  it('should log multiple arguments (strings and objects) comma-separated', () => {
    const logger = getLogger(serviceName, moduleName, ['txt']);
    logger.error('First message', { second: true }, 'Third message');
    expect(fs.existsSync(txtLogPath)).toBe(true);
    const content = fs.readFileSync(txtLogPath, 'utf-8');
    expect(content).toContain('First message, {"second":true}, Third message');
  });

  /**
   * Verifies console-only logging mode creates no files but does produce console output.
   */
  it('should log to console only when mode is ["console"]', () => {
    const logger = getLogger(serviceName, moduleName, ['console']);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    logger.info('Testing console logger');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    expect(fs.existsSync(jsonLogPath)).toBe(false);
    expect(fs.existsSync(txtLogPath)).toBe(false);
  });

  /**
   * Verifies JSON logging mode creates a JSON file.
   */
  it('should log to JSON file when mode includes "json"', () => {
    const logger = getLogger(serviceName, moduleName, ['console', 'json']);
    logger.error('Testing JSON logger');
    expect(fs.existsSync(jsonLogPath)).toBe(true);
    const contents = fs.readFileSync(jsonLogPath, 'utf-8');
    expect(contents).toContain('Testing JSON logger');
  });

  /**
   * Verifies TXT logging mode creates a text file.
   */
  it('should log to TXT file when mode includes "txt"', () => {
    const logger = getLogger(serviceName, moduleName, ['console', 'txt']);
    logger.warn('Testing TXT logger');
    expect(fs.existsSync(txtLogPath)).toBe(true);
    const contents = fs.readFileSync(txtLogPath, 'utf-8');
    expect(contents).toContain('Testing TXT logger');
  });

  /**
   * Verifies that enabling both "json" and "txt" modes creates and updates both files.
   */
  it('should log to both JSON and TXT files when mode includes both', () => {
    const logger = getLogger(serviceName, moduleName, ['json', 'txt']);
    logger.debug('Testing multiple modes');
    expect(fs.existsSync(jsonLogPath)).toBe(true);
    expect(fs.existsSync(txtLogPath)).toBe(true);

    const jsonContents = fs.readFileSync(jsonLogPath, 'utf-8');
    const txtContents = fs.readFileSync(txtLogPath, 'utf-8');
    expect(jsonContents).toContain('Testing multiple modes');
    expect(txtContents).toContain('Testing multiple modes');
  });
});