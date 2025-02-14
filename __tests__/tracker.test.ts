import Tracker from '../src/Tracker';
import Config from '../src/Config';
import { Product } from '../src/types';


describe('Tracker Tests', () => {
  let tracker: Tracker;
  
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    tracker = new Tracker(1, 1);
  });

  test('should enqueue page view event', () => {
    tracker.trackPageView();
    
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({
      client: 1,
      instance: 1,
      event: 'view'
    });
  });

  test('should enqueue click event with target', () => {
    const target = 'target';
    tracker.trackClick(target);
    
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({
      event: 'click',
      target
    });
  });

  test('should not enqueue click event with null target', () => {
    tracker.trackClick(null);
    
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue).toHaveLength(0);
  });

  test('should enqueue purchase event', () => {
    const orderId = 'order123';
    const products: Product[] = [{
      id: 'prod1',
      price: 10,
      quantity: 1,
      currency: "EUR"
    }];
    
    tracker.trackPurchase(orderId, products);
    
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({
      event: 'purchase',
      order: orderId,
      products
    });
  });

  test('should not enqueue invalid purchase event', () => {
    const orderId = 'order123';
    const products = [{
      id: 'prod1',
      // missing price and quantity
    }];
    
    tracker.trackPurchase(orderId, products as Product[]);
    
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue).toHaveLength(0);
  });

  test('should handle GDPR consent changes', () => {
    window[Config.GDPR_CONSENT_VAR] = { status: 'denied' };
    
    window[Config.GDPR_CONSENT_VAR].status = 'granted';
    
    tracker.trackPageView();
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue).toHaveLength(1);
  });

  test('should include meta tags in events when available', () => {
    const metaTitle = document.createElement('meta');
    metaTitle.setAttribute('property', 'og:title');
    metaTitle.setAttribute('content', 'Test Title');
    document.head.appendChild(metaTitle);

    tracker.trackPageView();
    
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || '[]');
    expect(queue[0].pageTitle).toBe('Test Title');
    
    document.head.removeChild(metaTitle);
  });
}); 