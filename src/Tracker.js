
import Config from './Config.js';
import SendRoutine from './SendRoutine.js';
import Device from './Device.js'

export default class Tracker {
    constructor(client, instance) {
      this.client = client;
      this.instance = instance;
      this.device = new Device();
      if(window[Config.GDPR_CONSENT_VAR] != null && window[Config.GDPR_CONSENT_VAR].status == "granted") {
        this.sendroutine = new SendRoutine();
        this.trackTopics();
      } else {
        window.gdprConsent = new Proxy(window.gdprConsent, {
          set(target, prop, value) {
            if (prop === 'status') {
              if(value == "granted") {
                this.sendroutine = new SendRoutine();
                this.trackTopics();
              } else {
                this.sendroutine.stop();
              }
            }

            if(prop == "consentString") {
              this.consentSring = value;
            }

            target[prop] = value;
            return true;
          }
        });
      }
    }

    enqueueEvent(event) {
      const queue = JSON.parse(localStorage.getItem(Config.EVENTS_QUEUE) || "[]");
      queue.push(event);
      localStorage.setItem(Config.EVENTS_QUEUE, JSON.stringify(queue));
    }

    // TODO: add session key
    sendEvent(eventType, eventData = {}) {
      const event = {
        client: this.client,
        instance: this.instance,
        event: eventType,
        href: window.location.href,
        pageTitle:  document.querySelector('meta[property="og:title"]')?.content || document.title,
        pageDescription: document.querySelector('meta[property="og:description"]')?.content || document.description,
        pageImage: document.querySelector('meta[property="og:image"]')?.content,
        pageType: document.querySelector('meta[property="og:type"]')?.content,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString(),
        did: this.device.getDeviceID(),
        session: this.device.getSession(),
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
          this.trackClick(...params);
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

    trackTopics() {
      if (sessionStorage.getItem(Config.TOPICS_SENT_FLAG)) {
        return;
      }

      const ctx = {
        client: this.client,
        instance: this.instance,
        event: "topics",
        href: window.location.href,
        pageTitle:  document.querySelector('meta[property="og:title"]')?.content || document.title,
        pageDescription: document.querySelector('meta[property="og:description"]')?.content || document.description,
        pageImage: document.querySelector('meta[property="og:image"]')?.content,
        pageType: document.querySelector('meta[property="og:type"]')?.content,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString(),
        did: this.device.getDeviceID(),
        session: this.device.getSession()
      };

      this.sendroutine.sendTopics(ctx).then(() => sessionStorage.setItem(Config.TOPICS_SENT_FLAG, Date.now().toString()));
    }

    // type mail è reserved per le mail in sha256
    trackExternalId(type, externalid) {
      this.sendEvent("externalid", type, externalid);
    }

    trackSwitchId(oldid, newid) {
      this.sendEvent("switchid", oldid, newid);
    }

    trackSwitchId(oldid, newid) {
      this.sendEvent("switchid", oldid, newid);
    }
  
    trackPageView() {
      this.sendEvent("view");
    }
  
    trackClick(target) {
      if(target == null) {
        console.warn("Target is null, click event skipped !");
        return;
      }
      this.sendEvent("click", {target});
    }
  
    /**
     * 
     * @param {string} orderId 
     * @param {Array<{id: string, price: number, brand: string, category: string, quantity: number, currency: string}>} products 
     */
    trackPurchase(orderId, products) {
      const productsArray = Array.isArray(products) ? products : [products];
      const hasInvalidProducts = productsArray.some(product => {
        if(product.id == null || product.price == null || product.quantity == null) {
          console.warn("Product is missing required fields, purchase event skipped !");
          return true;
        }
        product.currency = product.currency || "EUR";
        return false;
      });

      if(hasInvalidProducts) return;
      
      this.sendEvent("purchase", { order: orderId, products: productsArray});
    }
}