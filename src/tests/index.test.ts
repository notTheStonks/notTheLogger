import { getLogger,removeLogger } from '../index';
import * as fs from 'fs';
import * as path from 'path';

describe('Logger', () => {
  const serviceName = 'testService';
  const moduleName = 'testModule';
  const logsDir = path.join(__dirname, './../logs');
  const jsonLogPath = path.join(logsDir, `${serviceName}.log.json`);
  const txtLogPath = path.join(logsDir, `${serviceName}.log.txt`);

  beforeEach(() => {
    // Ensure a new logger before each test
    removeLogger(serviceName, moduleName);
  });

  afterEach(() => {
    // Clean up test logs
    if (fs.existsSync(jsonLogPath)) {
      fs.unlinkSync(jsonLogPath);
    }
    if (fs.existsSync(txtLogPath)) {
      fs.unlinkSync(txtLogPath);
    }
    if (fs.existsSync(logsDir)) {
      fs.rmdirSync(logsDir);
    }
    removeLogger(serviceName,moduleName);
  });

  it('should gracefully handle invalid JSON when reading the log file', () => {
    // Create a logger with JSON mode
    const logger = getLogger(serviceName, moduleName, ['json']);
    // Write a valid entry so the file is created
    logger.info('Valid JSON entry');

    // Overwrite the file with invalid JSON to trigger the catch block
    fs.writeFileSync(jsonLogPath, 'Invalid JSON Content');

    // Spy on console just to avoid clutter
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { /* no-op */ });

    // Call logger again to force reading and parsing
    logger.fatal('Should fail to parse previous content');

    // If we reach here, it means the catch block was hit and it didn't throw an error
    expect(fs.existsSync(jsonLogPath)).toBe(true);
    consoleSpy.mockRestore();
  });

  it('should log to console only when mode is ["console"]', () => {
    const logger = getLogger(serviceName, moduleName, ['console']);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    logger.info('Testing console logger');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    expect(fs.existsSync(jsonLogPath)).toBe(false);
    expect(fs.existsSync(txtLogPath)).toBe(false);
  });

  it('should log to JSON file when mode includes "json"', () => {
    const logger = getLogger(serviceName, moduleName, ['console', 'json']);
    logger.error('Testing JSON logger');
    expect(fs.existsSync(jsonLogPath)).toBe(true);
    const contents = fs.readFileSync(jsonLogPath, 'utf-8');
    expect(contents).toContain('Testing JSON logger');
  });

  it('should log to TXT file when mode includes "txt"', () => {
    const logger = getLogger(serviceName, moduleName, ['console', 'txt']);
    logger.warn('Testing TXT logger');
    expect(fs.existsSync(txtLogPath)).toBe(true);
    const contents = fs.readFileSync(txtLogPath, 'utf-8');
    expect(contents).toContain('Testing TXT logger');
  });

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