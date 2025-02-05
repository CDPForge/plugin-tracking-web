import {jest} from '@jest/globals';
import SendRoutine from "../src/SendRoutine.js";
import ENUMS from "../src/Enums.js";

jest.useFakeTimers();

global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
global.localStorage = {
  getItem: jest.fn(() => JSON.stringify([{ event: "test" }])),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

describe("SendRoutine", () => {
  let sendRoutine;

  beforeEach(() => {
    sendRoutine = new SendRoutine(false);
    jest.spyOn(global, "setInterval");
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    sendRoutine.stop();
    jest.clearAllMocks();
  });

  test("should start the interval when start() is called", () => {
    sendRoutine.start();
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 10000);
  });

  test("should stop the interval when stop() is called", () => {
    sendRoutine.start();
    sendRoutine.stop();
    expect(clearInterval).toHaveBeenCalledWith(expect.any(Object));
  });

  test("should call flushQueue at start", () => {
    sendRoutine.start();
    expect(fetch).toHaveBeenCalledWith(ENUMS.SERVER_URL, expect.any(Object));
  });

  test("should call flushQueue at regular intervals", () => {
    sendRoutine.start();
    jest.advanceTimersByTime(ENUMS.SEND_INTERVAL + 1);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(ENUMS.SERVER_URL, expect.any(Object));
  });

  test("should remove events from queue after successful flush", async () => {
    await sendRoutine.flushQueue();
    expect(localStorage.removeItem).toHaveBeenCalledWith(ENUMS.EVENTS_QUEUE);
  });

  test("should not flushQueue if queue is empty", async () => {
    localStorage.getItem.mockReturnValueOnce(JSON.stringify([]));
    await sendRoutine.flushQueue();
    expect(fetch).not.toHaveBeenCalled();
  });
});
