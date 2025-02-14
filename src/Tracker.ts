import Config from './Config';
import SendRoutine from './SendRoutine';
import Device from './Device';
import { Event, GDPRConsent, EventData, Product } from './types'; 

export default class Tracker {
  private client: number;
  private instance: number;
  private device: Device;
  private sendroutine?: SendRoutine;
  private consentString?: string;

  constructor(client: number, instance: number) {
    this.client = client;
    this.instance = instance;
    this.sendroutine = new SendRoutine(false);
    this.device = new Device(this.trackSwitchId);
    if (window[Config.GDPR_CONSENT_VAR]?.status === "granted") {
      this.sendroutine.start();
      this.trackTopics();
    } else {
      window[Config.GDPR_CONSENT_VAR] = window[Config.GDPR_CONSENT_VAR] || {};
      window[Config.GDPR_CONSENT_VAR] = new Proxy<GDPRConsent>(window[Config.GDPR_CONSENT_VAR], {
        set: (target: GDPRConsent, prop: keyof GDPRConsent, value: string): boolean => {
          if (prop === 'status') {
            if (value === "granted") {
              this.sendroutine?.start();
              this.trackTopics();
            } else {
              this.sendroutine?.stop();
            }
          }

          if (prop === "consentString") {
            this.consentString = value;
          }

          target[prop] = value;
          return true;
        }
      });
    }
  }

  private enqueueEvent(event: Event): void {
    const queue: Event[] = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || "[]");
    queue.push(event);
    localStorage.setItem(Config.LS_EVENTS_QUEUE, JSON.stringify(queue));
  }

  private sendEvent(eventType: string, eventData: EventData = {}): void {
    const event: Event = this.createEvent(eventType, eventData);
    this.enqueueEvent(event);
  }

  public send(action: string, ...params: any[]): void {
    switch(action) {
      case "view":
        this.trackPageView();
        break;
      case "click":
        this.trackClick(params[0]);
        break;
      case "purchase":
        this.trackPurchase(params[0], params[1]);
        break;
      case "switchid":
        this.trackSwitchId(params[0], params[1]);
        break;
      case "externalid":
        this.trackExternalId(params[0], params[1]);
        break;
    }
  }

  private async trackTopics(): Promise<void> {
    if (sessionStorage.getItem(Config.LS_TOPICS_SENT_FLAG)) {
      return;
    }

    await this.sendroutine?.sendTopics(this.createEvent("topics"));
    sessionStorage.setItem(Config.LS_TOPICS_SENT_FLAG, Date.now().toString());
  }

  public trackExternalId(type: string, externalId: string): void {
    this.sendEvent("externalid", { type, externalId });
  }

  public trackSwitchId(oldId: string, newId: string): void {
    this.sendEvent("switchid", { oldId, newId });
  }

  public trackPageView(): void {
    this.sendEvent("view");
  }

  public trackClick(target: string | null): void {
    if (target == null) {
      console.warn("Target is null, click event skipped !");
      return;
    }
    this.sendEvent("click", { target });
  }

  public trackPurchase(orderId: string, products: Product | Product[]): void {
    const productsArray = Array.isArray(products) ? products : [products];
    const hasInvalidProducts = productsArray.some(product => {
      if (product.id == null || product.price == null || product.quantity == null) {
        console.warn("Product is missing required fields, purchase event skipped !");
        return true;
      }
      product.currency = product.currency || "EUR";
      return false;
    });

    if (hasInvalidProducts) return;
    
    this.sendEvent("purchase", { order: orderId, products: productsArray });
  }

  private createEvent(eventType: string, eventData: EventData = {}): Event {
    return {
      client: this.client,
      instance: this.instance,
      event: eventType,
      href: window.location.href,
      pageTitle: document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content || document.title,
      pageDescription: document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content,
      pageImage: document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content,
      pageType: document.querySelector<HTMLMetaElement>('meta[property="og:type"]')?.content,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      did: this.device.getDeviceID(),
      session: this.device.getSession(),
      gdpr: this.consentString,
      ...eventData,
    };
  }
} 