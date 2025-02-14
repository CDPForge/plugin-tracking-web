import Device from '../src/Device';
import Config from '../src/Config';

describe('Device ID Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState({}, '', '/');
  });

  test('should generate new domain ID if no IDs exist', () => {
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBeDefined();
    expect(localStorage.getItem(Config.LS_DOMAIN_ID)).toBe(deviceId);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBeNull();
    expect(switchCallback).not.toHaveBeenCalled();
  });

  test('should use browser ID from query parameter', () => {
    const testBrowserId = '25d5e01c-ea49-4067-84d0-2df1e62886dd';
    window.history.pushState({}, '', `/?${Config.QUERY_PARAM_BROWSER_ID}=${testBrowserId}`);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBe(testBrowserId);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBe(testBrowserId);
  });

  test('should use existing browser ID from localStorage', () => {
    const testBrowserId = '123e4567-e89b-12d3-a456-426614174000';
    localStorage.setItem(Config.LS_BROWSER_ID, testBrowserId);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBe(testBrowserId);
    expect(switchCallback).not.toHaveBeenCalled();
  });

  test('should use existing domain ID if no browser ID exists', () => {
    const testDomainId = '123e4567-e89b-12d3-a456-426614174000';
    localStorage.setItem(Config.LS_DOMAIN_ID, testDomainId);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const deviceId = device.getDeviceID();
    
    expect(deviceId).toBe(testDomainId);
    expect(switchCallback).not.toHaveBeenCalled();
  });

  test('should ignore invalid browser ID from query parameter', () => {
    const invalidBrowserId = 'invalid-uuid';
    window.history.pushState({}, '', `/?${Config.QUERY_PARAM_BROWSER_ID}=${invalidBrowserId}`);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const deviceId = device.getDeviceID();
    
    expect(deviceId).not.toBe(invalidBrowserId);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBeNull();
    expect(localStorage.getItem(Config.LS_DOMAIN_ID)).toBe(deviceId);
    expect(switchCallback).not.toHaveBeenCalled();
  });

  test('should generate new session ID if none exists', () => {
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const sessionId = device.getSession();
    
    expect(sessionId).toBeDefined();
    expect(sessionStorage.getItem(Config.LS_SESSION_ID)).toBe(sessionId);
  });

  test('should use existing session ID', () => {
    const testSessionId = '123e4567-e89b-12d3-a456-426614174000';
    sessionStorage.setItem(Config.LS_SESSION_ID, testSessionId);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const sessionId = device.getSession();
    
    expect(sessionId).toBe(testSessionId);
  });

  test('should call switchIdCallback if browserId is present and domainId is present', () => {
    const testBrowserId = '123e4567-e89b-12d3-a456-426614174000';
    const testDomainId = '123e3456-e89b-12d3-a456-426614174000';
    localStorage.setItem(Config.LS_BROWSER_ID, testBrowserId);
    localStorage.setItem(Config.LS_DOMAIN_ID, testDomainId);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    expect(localStorage.getItem(Config.LS_DOMAIN_ID)).toBeNull();
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBe(testBrowserId);
    expect(device.getDeviceID()).toBe(testBrowserId);
    expect(switchCallback).toHaveBeenCalledWith(testDomainId, testBrowserId);
  });

  test('should call switchIdCallback if queryParam browserId is present and browserId is present', () => {
    const paramBrowserId = '25d5e01c-ea49-4067-84d0-2df1e62886dd';
    window.history.pushState({}, '', `/?${Config.QUERY_PARAM_BROWSER_ID}=${paramBrowserId}`);
    const testBrowserId = '123e4567-e89b-12d3-a456-426614174000';
    
    localStorage.setItem(Config.LS_BROWSER_ID, testBrowserId);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBe(paramBrowserId);
    expect(device.getDeviceID()).toBe(paramBrowserId);
    expect(switchCallback).toHaveBeenCalledWith(testBrowserId, paramBrowserId);
  });

  test('should call switchIdCallback twice if queryParam browserId is present and browserId is present and domainId is present', () => {
    const paramBrowserId = '25d5e01c-ea49-4067-84d0-2df1e62886dd';
    window.history.pushState({}, '', `/?${Config.QUERY_PARAM_BROWSER_ID}=${paramBrowserId}`);
    const testBrowserId = '123e4567-e89b-12d3-a456-426614174000';
    const testDomainId = '123e3459-e89b-12d3-a456-426614174000';
    localStorage.setItem(Config.LS_BROWSER_ID, testBrowserId);
    localStorage.setItem(Config.LS_DOMAIN_ID, testDomainId);
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    expect(localStorage.getItem(Config.LS_BROWSER_ID)).toBe(paramBrowserId);
    expect(device.getDeviceID()).toBe(paramBrowserId);
    expect(switchCallback).toHaveBeenCalledWith(testBrowserId, paramBrowserId);
    expect(switchCallback).toHaveBeenCalledWith(testDomainId, paramBrowserId);
  });

  test('should use existing session ID', () => {
    const testSessionId = '123e4567-e89b-12d3-a456-426614174000';
    sessionStorage.setItem(Config.LS_SESSION_ID, testSessionId);
    
    const switchCallback = jest.fn();
    const device = new Device(switchCallback);
    const sessionId = device.getSession();
    
    expect(sessionId).toBe(testSessionId);
  });
}); 