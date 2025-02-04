import ENUMS from "./Enums";
import { version as uuidVersion, validate as validUniqueID, v1 as generateUniqueID } from 'uuid';

export default class DeviceID {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        const pdid = urlParams.get(ENUMS.PARAM_DID);
        if (pdid && this.validUniqueID(pdid) && !localStorage.getItem(ENUMS.DEVICE_ID)) {
            localStorage.setItem(ENUMS.DEVICE_ID, pdid);
        }
    }

    validUniqueID(pdid){
        return validUniqueID(pdid) && uuidVersion(pdid) === 1
    }

    // Metodo per ottenere l'ID del dispositivo
    getDeviceID() {
        // Controlla se esiste già un deviceID nel localStorage
        let deviceID = localStorage.getItem(ENUMS.DEVICE_ID) || localStorage.getItem(ENUMS.TMP_DID);
        if (!deviceID) {
            // Se non esiste, genera un nuovo deviceID e salvalo nel localStorage
            deviceID = generateUniqueID();
            localStorage.setItem(ENUMS.TMP_DID, deviceID);
        }
        return deviceID;
    }
}