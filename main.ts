import Tracker from "./src/Tracker";

// Esempio di utilizzo
window.Tracker = window.Tracker || {};
window.Tracker.events = window.Tracker.events || [];
const tracker = new Tracker(window.Tracker.client, window.Tracker.instance);
window.Tracker.events.forEach((evt: any) => tracker.send(evt[0], ...evt.slice(1)));
window.Tracker = tracker;