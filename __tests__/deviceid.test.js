import DeviceID from "../src/Device.js";
import ENUMS from "../src/Config.js";
import { v1 as generateUniqueID } from "uuid";

jest.mock("uuid", () => ({
    v1: jest.fn(() => "mocked-uuid-v1"),
    validate: jest.fn((uuid) => uuid === "valid-uuid"),
    version: jest.fn((uuid) => (uuid === "valid-uuid" ? 1 : 4)),
}));

describe("DeviceID", () => {
    let localStorageMock;

    beforeEach(() => {
        // Mock dell'oggetto window.location
        global.window = {
            location: {
                search: "",
            },
        };

        // Mock di localStorage
        localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        };

        global.localStorage = localStorageMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should store a valid UUID from URL param if not already in localStorage", () => {
        window.location.search = `?${ENUMS.QUERY_PARAM_BROWSER_ID}=valid-uuid`;
        localStorageMock.getItem.mockReturnValue(null);

        new DeviceID();

        expect(localStorageMock.setItem).toHaveBeenCalledWith(ENUMS.BROWSER_ID, "valid-uuid");
    });

    test("should not store an invalid UUID from URL param", () => {
        window.location.search = `?${ENUMS.QUERY_PARAM_BROWSER_ID}=invalid-uuid`;
        localStorageMock.getItem.mockReturnValue(null);

        new DeviceID();

        expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("should not overwrite existing device ID in localStorage", () => {
        localStorageMock.getItem.mockReturnValue("existing-uuid");

        new DeviceID();

        expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("should return existing device ID from localStorage", () => {
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === ENUMS.BROWSER_ID) return "stored-uuid";
            return null;
        });

        const deviceID = new DeviceID().getDeviceID();

        expect(deviceID).toBe("stored-uuid");
    });

    test("should generate a new device ID if none exists and store it as TMP_DID", () => {
        localStorageMock.getItem.mockReturnValue(null);

        const deviceID = new DeviceID().getDeviceID();

        expect(deviceID).toBe("mocked-uuid-v1");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(ENUMS.DOMAIN_ID, "mocked-uuid-v1");
    });
});
