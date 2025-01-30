import ENUMS from './Enums.js';

const SEND_INTERVAL = 10000;

export default class SendRoutine {
    constructor(start = true) {
        this.interval = null;
        if(start) this.start();
    }

    start() {
        this.interval = this.interval || setInterval(() => {
            this.flushQueue();
        }, SEND_INTERVAL);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    async flushQueue() {
        const queue = JSON.parse(localStorage.getItem(ENUMS.EVENTS_QUEUE) || "[]");
        if (queue.length === 0) return;

        try {
            const response = await fetch(ENUMS.SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(queue),
            });

            if (response.ok) {
                localStorage.removeItem(ENUMS.EVENTS_QUEUE);
            }
        } catch (error) {
            console.error("Errore nell'invio della coda di tracking:", error);
        }
    }
}