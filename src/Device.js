import Config from "./Config";
import { version as uuidVersion, validate as validUniqueID, v4 as generateUniqueID, v1 as generateSessionID } from 'uuid';

export default class Device {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        const bid = urlParams.get(Config.QUERY_PARAM_BROWSER_ID);
        if (bid && this.validUniqueID(bid) && !localStorage.getItem(Config.BROWSER_ID)) {
            localStorage.setItem(Config.BROWSER_ID, bid);
        }
    }

    validUniqueID(id){
        return validUniqueID(id) && uuidVersion(id) === 4
    }

    // Metodo per ottenere l'ID del dispositivo
    getDeviceID() {
        // Controlla se esiste già un deviceID nel localStorage
        let deviceID = localStorage.getItem(Config.BROWSER_ID) || localStorage.getItem(Config.DOMAIN_ID);
        if (!deviceID) {
            // Se non esiste, genera un nuovo deviceID e salvalo nel localStorage
            deviceID = generateUniqueID();
            localStorage.setItem(Config.DOMAIN_ID, deviceID);
        }
        return deviceID;
    }

    // Metodo per ottenere l'ID del dispositivo
    getSession() {
        // Controlla se esiste già un deviceID nel localStorage
        let sessionID = sessionStorage.getItem(Config.SESSION_ID);
        if (!sessionID) {
            // Se non esiste, genera un nuovo deviceID e salvalo nel localStorage
            sessionID = generateSessionID();
            sessionStorage.setItem(Config.SESSION_ID, sessionID);
        }
        return sessionID;
    }
}