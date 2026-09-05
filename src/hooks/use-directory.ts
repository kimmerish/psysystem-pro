import { useSyncExternalStore } from "react";
import { locations as initialLocations, units as initialUnits } from "@/data/mock";

export type UnitRow = (typeof initialUnits)[number];
export type LocationRow = (typeof initialLocations)[number];

const UNITS_KEY = "psy.units";
const LOCATIONS_KEY = "psy.locations";

type Store<T> = {
  data: T[];
  listeners: Set<() => void>;
  loaded: boolean;
};

const unitStore: Store<UnitRow> = { data: initialUnits, listeners: new Set(), loaded: false };
const locationStore: Store<LocationRow> = { data: initialLocations, listeners: new Set(), loaded: false };

function load<T>(store: Store<T>, key: string) {
  if (store.loaded || typeof window === "undefined") return;
  store.loaded = true;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) store.data = JSON.parse(raw) as T[];
  } catch {
    /* ignore */
  }
}

function emit<T>(store: Store<T>) {
  store.listeners.forEach((l) => l());
}

function persist<T>(store: Store<T>, key: string, next: T[]) {
  store.data = next;
  store.loaded = true;
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit(store);
}

function subscribe<T>(store: Store<T>, key: string) {
  return (listener: () => void) => {
    load(store, key);
    store.listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      store.loaded = false;
      load(store, key);
      emit(store);
    };
    window.addEventListener("storage", onStorage);
    // Перше читання після монтування, щоб уникнути розбіжності з SSR.
    listener();
    return () => {
      store.listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };
}

const subscribeUnits = subscribe(unitStore, UNITS_KEY);
const subscribeLocations = subscribe(locationStore, LOCATIONS_KEY);

export function useUnits() {
  const data = useSyncExternalStore(
    subscribeUnits,
    () => unitStore.data,
    () => initialUnits,
  );
  return [data, (next: UnitRow[]) => persist(unitStore, UNITS_KEY, next)] as const;
}

export function useLocations() {
  const data = useSyncExternalStore(
    subscribeLocations,
    () => locationStore.data,
    () => initialLocations,
  );
  return [data, (next: LocationRow[]) => persist(locationStore, LOCATIONS_KEY, next)] as const;
}
