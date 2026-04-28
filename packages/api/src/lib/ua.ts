import { UAParser } from 'ua-parser-js';

export function parseUserAgent(ua: string) {
  const parser = new UAParser(ua);
  const result = parser.getResult();
  return {
    device: result.device.type || 'desktop',
    browser: `${result.browser.name || 'Unknown'} ${result.browser.major || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
  };
}
