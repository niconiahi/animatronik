import { useEffect } from "react";
import type { Getter, Setter, SetStateAction } from "jotai";
import { atom } from "jotai";
import { useUpdateAtom } from "jotai/utils";

type Callback<Value> = (
  get: Getter,
  set: Setter,
  nextValue: Value,
  prevValue: Value
) => void;

export function atomWithListeners<Value>(initialValue: Value) {
  const baseAtom = atom(initialValue);
  const listenersAtom = atom(<Callback<Value>[]>[]);
  const anAtom = atom(
    (get) => get(baseAtom),
    (get, set, arg: SetStateAction<Value>) => {
      const prevValue = get(baseAtom);
      set(baseAtom, arg);
      const nextValue = get(baseAtom);
      get(listenersAtom).forEach((callback) => {
        callback(get, set, nextValue, prevValue);
      });
    }
  );

  function useListener(callback: Callback<Value>) {
    const setListeners = useUpdateAtom(listenersAtom);

    useEffect(() => {
      setListeners((prev) => [...prev, callback]);

      return () =>
        setListeners((prev) => {
          const index = prev.indexOf(callback);

          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    }, [setListeners, callback]);
  }

  return [anAtom, useListener] as const;
}
