# Tracker Library

A TypeScript library for tracking user events, device IDs, sessions, and GDPR consent in the browser.  
Includes support for Google Topics API and advanced ID management.

## Features

- Device and session ID management (with switch callback)
- GDPR consent handling (with Proxy)
- Event queueing and sending (pageview, click, purchase, external ID, switch ID)
- Google Topics API support (browsingTopics)

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


## Google Topics API Integration (Privacy Sandbox)

This library supports the [Google Topics API](https://developer.chrome.com/docs/privacy-sandbox/topics/) to retrieve user interests for contextual advertising, based on recent browsing activity.

### How It Works

When a client-side request is made with:

```ts
fetch('https://yourdomain.com/events', {
  browsingTopics: true,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... }),
});
```

If supported by the browser (e.g., Chrome) and allowed by the page’s permissions, the browser will include a `Sec-Browsing-Topics` HTTP header with topics relevant to the user.

### Requirements for Topics to Work

1. **HTTPS is required** for both the requesting site and your server.
2. The site embedding your library must **explicitly grant access via `Permissions-Policy`**.
3. The browser must support and have **Topics enabled**.

### Permissions-Policy Header

To receive topics, the host website **must set** the following HTTP header:

```http
Permissions-Policy: browsing-topics=(self "https://yourdomain.com")
```

This allows both the first-party site and your domain (`yourdomain.com`) to receive Topics. If the site does not include this header, **you will not receive any topics**, even if the `fetch()` request includes `browsingTopics: true`.

⚠️ **Generic or wildcard usage like `browsing-topics=*` is not valid.**


### Examples

| Goal                           | Header Value                                      |
| ------------------------------ | ------------------------------------------------- |
| Only first-party gets Topics   | `browsing-topics=(self)`                          |
| First-party and your domain    | `browsing-topics=(self "https://yourdomain.com")` |
| Only your domain (third-party) | `browsing-topics=("https://yourdomain.com")`      |
| Omitted or incorrect header    | ❌ No topics sent                                  |

### Observability

Your domain is considered "observed" (i.e., eligible to receive topics) if:

* A resource from your domain (e.g., script or image) is loaded on a third-party site.
* The third-party site has properly set the `Permissions-Policy` header.

### Global Observability
To accurately infer user interests using the Google Topics API, it is essential to observe user browsing behavior across a diverse set of websites. The broader the reach of observability, the more representative and valuable the generated topics become.

To support this, CDP Forge will soon launch a shared domain infrastructure where participating websites can:

Register themselves as observed domains, allowing CDP Forge Website Network to observe the domain.

In return, gain access to the aggregated observability network, benefiting from a much wider pool of topic data than what their own site could collect in isolation.

This creates a mutual value exchange:
By contributing to the network (i.e., allowing your site's Topics to be observed), you also receive insights driven by global user behavior across all participating properties.

🔄 It's a win-win model: each site contributes its visibility and gains from the collective intelligence of the network — enabling more effective and privacy-compliant interest-based targeting via Topics.


## License

MIT