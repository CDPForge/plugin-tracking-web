
import ENUMS from './Enums.js';
import SendRoutine from './SendRoutine.js';
import DeviceID from './DeviceID.js'

export default class Tracker {
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
        case "view":
          this.trackPageView();
          break;
        case "click":
          this.trackClick(params);
          break;
        case "purchase":
          this.trackPurchase(...params);
          break;
        case "switchid":
          this.trackSwitchId(...params);
          break;
        case "externalid":
          this.trackExternalId(...params);
          break;  
      }
    }

    // type mail è reserved per le mail in sha256
    trackExternalId(type, externalid) {
      this.sendEvent("click", type, externalid);
    }

    trackSwitchId(oldid, newid) {
      this.sendEvent("switchid", oldid, newid);
    }
  
    trackPageView() {
      this.sendEvent("view");
    }
  
    trackClick(extraData = {}) {
      const eventData = {
        ...extraData,
      };
      this.sendEvent("click", eventData);
    }
  
    trackPurchase(productId, price, currency = "EUR") {
      this.sendEvent("purchase", { product: {productId, price, currency}});
    }
}