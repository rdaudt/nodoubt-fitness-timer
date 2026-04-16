import type { TimerRecordInput } from "../../timers/contracts/timer-record";

export const TEMP_TIMER_STORAGE_KEY = "ndft-temp-timer";

export interface GuestTempTimerDraft {
  tempId: string;
  timer: TimerRecordInput;
  updatedAt: string;
}

type GuestTempStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function getStorage(storage?: GuestTempStorage) {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readGuestTempTimer(storage?: GuestTempStorage) {
  const targetStorage = getStorage(storage);

  if (!targetStorage) {
    return null;
  }

  const rawValue = targetStorage.getItem(TEMP_TIMER_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as GuestTempTimerDraft;
  } catch {
    return null;
  }
}

export function writeGuestTempTimer(
  draft: GuestTempTimerDraft,
  storage?: GuestTempStorage,
) {
  const targetStorage = getStorage(storage);

  if (!targetStorage) {
    return draft;
  }

  const persistedDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };

  targetStorage.setItem(TEMP_TIMER_STORAGE_KEY, JSON.stringify(persistedDraft));

  return persistedDraft;
}

export function clearGuestTempTimer(storage?: GuestTempStorage) {
  const targetStorage = getStorage(storage);

  if (!targetStorage) {
    return;
  }

  targetStorage.removeItem(TEMP_TIMER_STORAGE_KEY);
}

export function hasGuestTempTimer(storage?: GuestTempStorage) {
  return Boolean(readGuestTempTimer(storage));
}
