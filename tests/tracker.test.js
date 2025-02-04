import Tracker from '../src/Tracker'; // Importa la classe che vuoi testare
import ENUMS from '../src/Enums'; // Importa l'enum
import DeviceID from '../src/DeviceID'; // Importa la dipendenza DeviceID
import SendRoutine from '../src/SendRoutine'; // Importa la dipendenza SendRoutine

// Mock delle dipendenze
jest.mock('../src/DeviceID');
jest.mock('../src/SendRoutine');

describe('Tracker class', () => {
  let tracker;
  let mockClient = 1;
  let mockInstance = 1;
  let localStorageMock;

  beforeEach(() => {
    // Mock dell'oggetto window.location
    global.window = {
        location: {
            search: "",
        },
    };

    global.document = { };

    global.navigator = { 
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    };
    
    // Mock di localStorage
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    global.localStorage = localStorageMock;
    
    // Creazione istanza della classe Tracker
    tracker = new Tracker(mockClient, mockInstance);

    // Mock delle funzioni di DeviceID e SendRoutine
    DeviceID.mockImplementation(() => {
      return { getDeviceID: jest.fn().mockReturnValue('mockDeviceId') };
    });

    SendRoutine.mockImplementation(() => {
      return { send: jest.fn() };
    });

    // Mock dei metodi del DOM
    global.document.title = 'Test Page';
    global.document.referrer = 'https://referrer.com';
    global.window.location.href = 'https://example.com';
  });

  test('should initialize Tracker with client and instance', () => {
    expect(tracker.client).toBe(mockClient);
    expect(tracker.instance).toBe(mockInstance);
  });

  test('should enqueue event to localStorage', () => {
    const event = { type: 'click', data: {} };
    tracker.enqueueEvent(event);
    expect(localStorage.setItem).toHaveBeenCalledWith(ENUMS.EVENTS_QUEUE, JSON.stringify([event]));
  });

  test('should track page view event', () => {
    tracker.trackPageView();
    expect(localStorage.setItem).toHaveBeenCalledWith(ENUMS.EVENTS_QUEUE, expect.stringContaining("view"));
  });

  test('should track click event', () => {
    tracker.trackClick();
    expect(localStorage.setItem).toHaveBeenCalledWith(ENUMS.EVENTS_QUEUE, expect.stringContaining("click"));
  });

  test('should track purchase event', () => {
    tracker.trackPurchase('1234', 99.99, 'USD');
    expect(localStorage.setItem).toHaveBeenCalledWith(ENUMS.EVENTS_QUEUE, expect.stringContaining("purchase"));
  });
});