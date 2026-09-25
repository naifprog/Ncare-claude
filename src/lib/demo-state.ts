"use client";

/**
 * Client-side demo state. Deliberately tiny: in-memory stores that last until the
 * page is reloaded, plus the signed-in demo account id in localStorage. None of this
 * is persistence or authentication — a backend will replace it.
 */
import { useSyncExternalStore } from "react";
import { EMPTY_OVERRIDES, type AccessOverrides } from "@/lib/access/access";

interface Store<T> {
  get: () => T;
  set: (update: T | ((state: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  initial: T;
}

function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    initial,
    get: () => state,
    set(update) {
      state = typeof update === "function" ? (update as (s: T) => T)(state) : update;
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}

// ---------------------------------------------------------------------------
// Demo session (DEMO ONLY — the stored value is just a mock user id)
// ---------------------------------------------------------------------------

const SESSION_KEY = "ncare-demo-session";
const sessionListeners = new Set<() => void>();

function readSession() {
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function subscribeSession(listener: () => void) {
  sessionListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    sessionListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

let memorySession: string | null = null;
let signedOutByUser = false;

function writeSession(userId: string | null) {
  try {
    if (userId) window.localStorage.setItem(SESSION_KEY, userId);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable (private mode): the session then lasts until reload only.
  }
  memorySession = userId;
  sessionListeners.forEach((l) => l());
}

/** Signed-in demo user id; `undefined` while not yet known (server render / hydration). */
export function useSessionUserId(): string | null | undefined {
  return useSyncExternalStore(
    subscribeSession,
    () => readSession() ?? memorySession,
    () => undefined,
  );
}

export function signIn(userId: string) {
  signedOutByUser = false;
  writeSession(userId);
}

export function signOut() {
  signedOutByUser = true;
  writeSession(null);
}

/** True after "Log out" (the login screen then opens without a `?next=` return path). */
export function isSignedOutByUser() {
  return signedOutByUser;
}

// ---------------------------------------------------------------------------
// Session-only powers edits (Powers / Positions / Users screens)
// ---------------------------------------------------------------------------

const overridesStore = createStore<AccessOverrides>(EMPTY_OVERRIDES);

export function useAccessOverrides() {
  return useStore(overridesStore);
}

export function updateAccessOverrides(update: (o: AccessOverrides) => AccessOverrides) {
  overridesStore.set(update);
}

// ---------------------------------------------------------------------------
// Records removed during this session (so list and detail deletes agree)
// ---------------------------------------------------------------------------

const removedStore = createStore<ReadonlySet<string>>(new Set());

export function useRemovedIds() {
  return useStore(removedStore);
}

export function removeRecord(id: string) {
  removedStore.set((s) => new Set(s).add(id));
}

// ---------------------------------------------------------------------------
// Toasts: short confirmations after demo saves / deletes
// ---------------------------------------------------------------------------

export interface Toast {
  id: number;
  message: string;
}

const toastStore = createStore<Toast[]>([]);
let toastSeq = 0;

export function useToasts() {
  return useStore(toastStore);
}

export function toast(message: string) {
  const id = ++toastSeq;
  toastStore.set((list) => [...list, { id, message }]);
  setTimeout(() => dismissToast(id), 4500);
}

export function dismissToast(id: number) {
  toastStore.set((list) => list.filter((t) => t.id !== id));
}

/** Suffix used in toasts so nobody mistakes the demo for saved data. */
export const DEMO_NOTE = "Demo only: changes are not saved.";
