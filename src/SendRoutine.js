import Config from './Config.js';

export default class SendRoutine {
    constructor(start = true) {
        this.interval = null;
        if (start) this.start();
    }

    start() {
        if (this.interval == null) this.flushQueue();
        this.interval = this.interval || setInterval(() => {
            this.flushQueue();
        }, Config.SEND_INTERVAL);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    sendTopics(ctx) {
        return fetch(Config.SERVER_URL + "/browsingTopics", {
            browsingTopics: true,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ctx),
            keepalive: true
        });
    }

    async flushQueue() {
        const queue = JSON.parse(localStorage.getItem(Config.EVENTS_QUEUE) || "[]");
        if (queue.length === 0) return;
        localStorage.removeItem(Config.EVENTS_QUEUE);

        fetch(Config.SERVER_URL + "/events", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events: queue }),
            keepalive: true
        }).catch(error => {
            console.error("Error sending events:", error);
            const newQueue = JSON.parse(localStorage.getItem(Config.EVENTS_QUEUE) || "[]");
            localStorage.setItem(Config.EVENTS_QUEUE, JSON.stringify(queue.concat(newQueue)));
        });
    }
}