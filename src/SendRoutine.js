import ENUMS from './Enums.js';

export default class SendRoutine {
    constructor(start = true) {
        this.interval = null;
        if (start) this.start();
    }

    start() {
        if (this.interval == null) this.flushQueue();
        this.interval = this.interval || setInterval(() => {
            this.flushQueue();
        }, ENUMS.SEND_INTERVAL);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    async flushQueue() {
        const queue = JSON.parse(localStorage.getItem(ENUMS.EVENTS_QUEUE) || "[]");
        if (queue.length === 0) return;
        localStorage.removeItem(ENUMS.EVENTS_QUEUE);

        fetch(ENUMS.SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events: queue }),
            keepalive: true
        }).catch(error => {
            console.error("Error sending events:", error);
            const newQueue = JSON.parse(localStorage.getItem(ENUMS.EVENTS_QUEUE) || "[]");
            localStorage.setItem(ENUMS.EVENTS_QUEUE, JSON.stringify(queue.concat(newQueue)));
        });
    }
}