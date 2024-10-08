import type { Getter, SetStateAction, Setter } from "jotai"
import { atom, useSetAtom } from "jotai"
import { useEffect } from "react"

type Callback<Value> = (
// eslint-disable-next-line no-unused-vars
  get: Getter,
// eslint-disable-next-line no-unused-vars
  set: Setter,
// eslint-disable-next-line no-unused-vars
  newVal: Value,
// eslint-disable-next-line no-unused-vars
  prevVal: Value,
) => void

export function atomWithListeners<Value>(initialValue: Value) {
  const baseAtom = atom(initialValue)
  const listenersAtom = atom([] as Callback<Value>[])
  const anAtom = atom(
    get => get(baseAtom),
    (get, set, arg: SetStateAction<Value>) => {
      const prevVal = get(baseAtom)
      set(baseAtom, arg)
      const newVal = get(baseAtom)
      get(listenersAtom).forEach((callback) => {
        callback(get, set, newVal, prevVal)
      })
    },
  )
  const useListener = (callback: Callback<Value>) => {
    const setListeners = useSetAtom(listenersAtom)
    useEffect(() => {
      setListeners(prev => [...prev, callback])
      return () =>
        setListeners((prev) => {
          const index = prev.indexOf(callback)
          return [...prev.slice(0, index), ...prev.slice(index + 1)]
        })
    }, [setListeners, callback])
  }
  return [anAtom, useListener] as const
}
