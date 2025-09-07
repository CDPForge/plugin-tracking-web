import Config from './Config';
import { Event, ExtendedRequestInit } from './types';

export default class SendRoutine {
  private interval: undefined | number | NodeJS.Timeout;

  constructor(start: boolean = false) {
    this.interval = undefined;
    if (start) this.start();
  }

  public start(): void {
    if (this.interval == undefined) this.processQueue();
    this.interval = this.interval || setInterval(() => {
      this.processQueue();
    }, Config.SEND_INTERVAL);
  }

  public stop(): void {
    clearInterval(this.interval);
    this.interval = undefined;
  }


  private async processQueue(): Promise<void> {
    const queue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || "[]");
    if (queue.length === 0) return;
    localStorage.removeItem(Config.LS_EVENTS_QUEUE);

    this.sendEvents(queue)
      .catch(error => {
        console.error("Error sending events:", error);
        const newQueue = JSON.parse(localStorage.getItem(Config.LS_EVENTS_QUEUE) || "[]");
        localStorage.setItem(Config.LS_EVENTS_QUEUE, JSON.stringify(queue.concat(newQueue)));
      });
  }

  private async sendEvents(events: Event[]): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Config.SEND_INTERVAL);

    return fetch(Config.SERVER_URL + "/events", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events: events }),
      keepalive: true,
      mode: 'cors',
      signal: controller.signal
    }).then(res => {
      clearTimeout(timeoutId)
      return res;
    });
  }

  public async sendTopics(event: Event): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Config.SEND_INTERVAL);

    const options: ExtendedRequestInit = {
      browsingTopics: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events: [event] }),
      keepalive: true,
      mode: 'cors',
      signal: controller.signal
    };

    return fetch(Config.SERVER_URL + "/events", options).then(res => {
      clearTimeout(timeoutId)
      return res;
    });
  }
}