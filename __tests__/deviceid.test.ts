import Device from '../src/Device';
import Config from '../src/Config';

describe('Device ID Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState({}, '', '/');
  });

  test('should generate new domain ID if no IDs exist', () => {
    const device = new Device();
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBeDefined();
    expect(localStorage.getItem(Config.LS_DOMAIN_ID)).toBe(deviceId);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBeNull();
  });

  test('should use browser ID from query parameter', () => {
    const testBrowserId = '25d5e01c-ea49-4067-84d0-2df1e62886dd';
    window.history.pushState({}, '', `/?${Config.QUERY_PARAM_BROWSER_ID}=${testBrowserId}`);
    
    const device = new Device();
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBe(testBrowserId);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBe(testBrowserId);
  });

  test('should use existing browser ID from localStorage', () => {
    const testBrowserId = '123e4567-e89b-12d3-a456-426614174000';
    localStorage.setItem(Config.LS_BROWSER_ID, testBrowserId);
    
    const device = new Device();
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBe(testBrowserId);
  });

  test('should use existing domain ID if no browser ID exists', () => {
    const testDomainId = '123e4567-e89b-12d3-a456-426614174000';
    localStorage.setItem(Config.LS_DOMAIN_ID, testDomainId);
    
    const device = new Device();
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBe(testDomainId);
  });

  test('should ignore invalid browser ID from query parameter', () => {
    const invalidBrowserId = 'invalid-uuid';
    window.history.pushState({}, '', `/?${Config.QUERY_PARAM_BROWSER_ID}=${invalidBrowserId}`);
    
    const device = new Device();
    const deviceId = device.getDeviceID();
    
    expect(deviceId).not.toBe(invalidBrowserId);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBeNull();
    expect(localStorage.getItem(Config.LS_DOMAIN_ID)).toBe(deviceId);
  });

  test('should generate new session ID if none exists', () => {
    const device = new Device();
    const sessionId = device.getSession();
    
    expect(sessionId).toBeDefined();
    expect(sessionStorage.getItem(Config.LS_SESSION_ID)).toBe(sessionId);
  });

  test('should use existing session ID', () => {
    const testSessionId = '123e4567-e89b-12d3-a456-426614174000';
    sessionStorage.setItem(Config.LS_SESSION_ID, testSessionId);
    
    const device = new Device();
    const sessionId = device.getSession();
    
    expect(sessionId).toBe(testSessionId);
  });
}); 