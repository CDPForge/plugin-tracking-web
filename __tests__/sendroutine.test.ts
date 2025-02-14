import SendRoutine from '../src/SendRoutine';
import Config from '../src/Config';
import { Event } from '../src/types';

describe('SendRoutine Tests', () => {
  let sendRoutine: SendRoutine;
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    localStorage.clear();
    mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.resolve(new Response())
    );
    sendRoutine = new SendRoutine(false);
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  test('should not start processing queue on initialization when start=false', () => {
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('should process queue when started', () => {
    const mockEvent: Event = {
      client: 1,
      instance: 1,
      event: 'test',
      href: 'http://test.com',
      pageTitle: 'Test',
      pageDescription: undefined,
      pageImage: undefined,
      pageType: undefined,
      referrer: undefined,
      timestamp: new Date().toISOString(),
      did: 'test-did',
      gdpr: undefined,
      session: 'test-session'
    };

    localStorage.setItem(Config.LS_EVENTS_QUEUE, JSON.stringify([mockEvent]));
    sendRoutine.start();

    expect(mockFetch).toHaveBeenCalledWith(
      Config.SERVER_URL + "/events",
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ events: [mockEvent] })
      })
    );
  });

  test('should not process empty queue', () => {
    sendRoutine.start();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('should send topics', async () => {
    const mockContext: Event = {
      client: 1,
      instance: 1,
      event: 'topics',
      href: 'http://test.com',
      pageTitle: 'Test',
      pageDescription: undefined,
      pageImage: undefined,
      pageType: undefined,
      referrer: undefined,
      timestamp: new Date().toISOString(),
      did: 'test-did',
      session: 'test-session',
      gdpr: undefined
    };

    await sendRoutine.sendTopics(mockContext);

    expect(mockFetch).toHaveBeenCalledWith(
      Config.SERVER_URL + "/browsingTopics",
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockContext),
        browsingTopics: true
      })
    );
  });

  test('should handle fetch errors by restoring queue', async () => {
    const mockEvent: Event = {
      client: 1,
      instance: 1,
      event: 'test',
      href: 'http://test.com',
      pageTitle: 'Test',
      pageDescription: undefined,
      pageImage: undefined,
      pageType: undefined,
      referrer: undefined,
      timestamp: new Date().toISOString(),
      did: 'test-did',
      session: 'test-session',
      gdpr: undefined
    };

    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    localStorage.setItem(Config.LS_EVENTS_QUEUE, JSON.stringify([mockEvent]));
    
    sendRoutine.start();
    
    await new Promise(process.nextTick);
    
    expect(JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]'))
      .toEqual([mockEvent]);
  });
}); 