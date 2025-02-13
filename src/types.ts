export interface GDPRConsent {
  status: string;
  consentString?: string;
}

export interface EventData {
  [key: string]: any;
}

export interface Product {
  id: string;
  price: number;
  brand?: string;
  category?: string;
  quantity: number;
  currency?: string;
}

export interface Event {
  client: number;
  instance: number;
  event: string;
  href: string;
  pageTitle: string;
  pageDescription: string | undefined;
  pageImage: string | undefined;
  pageType: string | undefined;
  referrer: string | undefined;
  timestamp: string;
  did: string;
  session: string;
  [key: string]: any;
}

export interface ExtendedRequestInit extends RequestInit {
  browsingTopics?: boolean;
}

declare global {
  interface Window {
    gdprConsent: GDPRConsent;
    [key: string]: any;
  }
} 