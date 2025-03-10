# NotTheLogger

A lightweight TypeScript logging utility supporting console, JSON, and text modes.

## Installation

1. Clone this repository.
2. Install dependencies:

```bash
npm install
```
or

```bash
npm install https://github.com/notTheStonks/notTheLogger
```

3. Build:

```bash
npm run build
```

## Usage

1. Import the logger
```bash
import { getLogger } from './index';
```

2. Create and configure a logger with desired modes
```bash
const logger = getLogger('myService', 'myModule', ['console', 'json', 'txt']);
logger.info('Information message');
logger.error('Error message');
```

3. Run your code
```bash
ts-node src/example.ts
```
You will see console logs, and logs will be stored in ./src/logs/myService.log.json and ./src/logs/myService.log.txt, if those modes are enabled.

## Logging Modes

- console - Prints colored logs to the console.
- json - Appends log entries in JSON format to a .json file.
- txt - Appends log entries in plain text to a .txt file.

## Testing

Tests are created using Jest. Run them with:

```bash
npm test
```

## License
Apache License License (see LICENSE for more details).