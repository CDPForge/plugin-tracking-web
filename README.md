# Tracker Library

A TypeScript library for tracking user events, device IDs, sessions, and GDPR consent in the browser.  
Includes support for Google Topics API and advanced ID management.

## Features

- Device and session ID management (with switch callback)
- GDPR consent handling (with Proxy)
- Event queueing and sending (pageview, click, purchase, external ID, switch ID)
- Google Topics API support (browsingTopics)
- Written in TypeScript
- Fully tested with Jest

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Development

```bash
npm run dev
```

## Start Dev Server

```bash
npm start
```

## Type Checking

```bash
npm run type-check
```

## Run Tests

```bash
npm test
```

or in watch mode:

```bash
npm run test:watch
```

## Usage Example

```typescript
import Tracker from './src/Tracker';

const tracker = new Tracker(123, 456);

// Track a page view
tracker.trackPageView();

// Track a click
tracker.trackClick('button#subscribe');

// Track a purchase
tracker.trackPurchase('order-123', [
  { id: 'prod-1', price: 10, quantity: 2 }
]);

// Track an external ID
tracker.trackExternalId('email', 'user@example.com');
```

## Device Switch Callback

You can pass a callback to the `Device` constructor to be notified when the device ID changes (for example, when a browser ID is switched):

```typescript
import Device from './src/Device';

const onSwitchId = (oldId: string | null, newId: string) => {
  console.log(`Device ID switched from ${oldId} to ${newId}`);
};

const device = new Device(onSwitchId);
```

This callback is also used internally by the `Tracker` class to automatically track switch events.

## Testing

Tests are written in TypeScript using Jest and cover all main classes (`Device`, `SendRoutine`, `Tracker`).  
To run all tests:

```bash
npm test
```

## Configuration

- All configuration keys (localStorage/sessionStorage keys, query params, etc.) are defined in `src/Config.ts`.
- Types and interfaces are defined in `src/types.ts`.

## Google Topics API

The library supports the [Google Topics API](https://developer.chrome.com/docs/privacy-sandbox/topics/) via the `browsingTopics` fetch option (Chrome only).

## License

MIT