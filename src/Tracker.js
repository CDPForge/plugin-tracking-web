
import ENUMS from './Enums.js';
import SendRoutine from './SendRoutine.js';
import DeviceID from './DeviceID.js'

class Tracker {
    constructor(client, instance) {
      this.client = client;
      this.instance = instance;
      this.deviceid = new DeviceID();
      this.sendroutine = new SendRoutine();
    }

    enqueueEvent(event) {
      const queue = JSON.parse(localStorage.getItem(ENUMS.EVENTS_QUEUE) || "[]");
      queue.push(event);
      localStorage.setItem(ENUMS.EVENTS_QUEUE, JSON.stringify(queue));
    }
  
    sendEvent(eventType, eventData = {}) {
      const event = {
        client: this.client,
        instance: this.instance,
        action: eventType,
        url: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString(),
        did: this.deviceid.getDeviceID(),
        ua: navigator.userAgent,
        ...eventData,
      };
  
      this.enqueueEvent(event);
    }

    send(action, ...params) {
      switch(action){
        case "vi":
          this.trackPageView();
          break;
        case "cl":
          this.trackClick(params);
          break;
        case "ac":
          this.trackPurchase(...params);
          break;
      }
    }
  
    trackPageView() {
      this.sendEvent("vi");
    }
  
    trackClick(element, extraData = {}) {
      const eventData = {
        text: element.innerText || null,
        id: element.id || null,
        className: element.className || null,
        ...extraData,
      };
      this.sendEvent("cl", eventData);
    }
  
    trackPurchase(productId, price, currency = "EUR") {
      this.sendEvent("ac", { product: {productId, price, currency}});
    }
  }
  
  // Esempio di utilizzo
  window.Tracker = window.Tracker || {};
  window.Tracker.events = window.Tracker.events || [];
  const tracker = new Tracker(window.Tracker.client,window.Tracker.instance);
  window.Tracker.events.forEach(evt => tracker.send(...evt));
  window.Tracker = tracker;