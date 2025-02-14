import Config from './Config';
import { version as uuidVersion, validate as validUniqueID, v4 as generateDeviceID, v1 as generateSessionID } from 'uuid';


export default class Device {
  private deviceId: string;
  private sessionId: string;

  constructor(switchCallback: Function) {
    this.deviceId = this.initDeviceId(switchCallback);
    this.sessionId = this.initSession();
  }

  private initDeviceId(switchCallback: Function): string {
    const urlParams = new URLSearchParams(window.location.search);
    const browserIdFromQueryParam = urlParams.get(Config.QUERY_PARAM_BROWSER_ID);
    const browserIdFromLocalStorage = localStorage.getItem(Config.LS_BROWSER_ID);
    const domainIdFromLocalStorage = localStorage.getItem(Config.LS_DOMAIN_ID);
        
    if (browserIdFromQueryParam) {
        urlParams.delete(Config.QUERY_PARAM_BROWSER_ID);
        window.history.replaceState({}, document.title, window.location.pathname + '?' + urlParams.toString());
    }
    if(browserIdFromQueryParam && this.validUniqueID(browserIdFromQueryParam)) {
      if(browserIdFromLocalStorage) {
        switchCallback(browserIdFromLocalStorage, browserIdFromQueryParam);
      }

      if(domainIdFromLocalStorage) {
        switchCallback(domainIdFromLocalStorage, browserIdFromQueryParam);
        localStorage.removeItem(Config.LS_DOMAIN_ID);
      }
      localStorage.setItem(Config.LS_BROWSER_ID, browserIdFromQueryParam);
      return browserIdFromQueryParam;
    } else if(browserIdFromLocalStorage) {
      if(domainIdFromLocalStorage) {
        switchCallback(domainIdFromLocalStorage, browserIdFromLocalStorage);
        localStorage.removeItem(Config.LS_DOMAIN_ID);
      }
      return browserIdFromLocalStorage;
    } else if(domainIdFromLocalStorage) {
      return domainIdFromLocalStorage;
    } else {
      const domainId = generateDeviceID();
      localStorage.setItem(Config.LS_DOMAIN_ID, domainId);
      return domainId;
    }
  }

  private validUniqueID(id: string): boolean {
    return validUniqueID(id) && uuidVersion(id) === 4
  }

  private initSession(): string {
    const sessionId = sessionStorage.getItem(Config.LS_SESSION_ID) || generateSessionID();
    sessionStorage.setItem(Config.LS_SESSION_ID, sessionId);
    return sessionId;
  }

  public getDeviceID(): string {
    return this.deviceId;
  }

  public getSession(): string {
    return this.sessionId;
  }
} 