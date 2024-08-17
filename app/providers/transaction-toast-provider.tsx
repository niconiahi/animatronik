import { Dialog, Transition } from "@headlessui/react"
import { useActor } from "@xstate/react"
import { atom, useAtom } from "jotai"
import type { FC, ReactElement } from "react"
import { createContext, useContext, useEffect, useRef } from "react"
import IconButton from "~/components/icon-button"
import X from "~/icons/x"
import type { TransactionMachineState } from "~/machines/transaction"
import { getErrorMessage } from "~/utils/error-message"
import {
  useTransaction,
} from "~/providers/transaction-provider"

const TRANSACTION_STATE = {
  Idle: "idle" as const,
  Mined: "mined" as const,
  Failed: "failed" as const,
  Mining: "mining" as const,
  Pending: "pending" as const,
}

interface Titles {
  [TRANSACTION_STATE.Mined]: string
  [TRANSACTION_STATE.Failed]: string
  [TRANSACTION_STATE.Mining]: string
  [TRANSACTION_STATE.Pending]: string
}
interface Descriptions {
  [TRANSACTION_STATE.Mined]: string
  [TRANSACTION_STATE.Failed]: string
  [TRANSACTION_STATE.Mining]: string
  [TRANSACTION_STATE.Pending]: string
}
export interface TransactionToastMessages {
  titles: Titles
  descriptions: Descriptions
}

const DEFAULT_OPTIONS = {
  titles: {
    [TRANSACTION_STATE.Mined]: "Transaction mined",
    [TRANSACTION_STATE.Failed]: "Transaction failed",
    [TRANSACTION_STATE.Mining]: "Transaction mining",
    [TRANSACTION_STATE.Pending]: "Transaction pending",
  },
  descriptions: {
    [TRANSACTION_STATE.Mined]: "Your transaction was mined by a miner",
    [TRANSACTION_STATE.Failed]: "Your transaction failed to be transacted",
    [TRANSACTION_STATE.Mining]: "Your transaction was sent to the blockchain",
    [TRANSACTION_STATE.Pending]: "Your transaction is pending to be signed",
  },
}

interface Value {
  composeMessages: (userOptions: Partial<TransactionToastMessages>) => void
}

export const TransactionToastContext = createContext<Value>(
  // @ts-expect-error It's a good practice not to give a default value even though the linter tells you so
  {},
)

const messagesAtom = atom(DEFAULT_OPTIONS)

export const TransactionToastProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [messages, setMessages] = useAtom(messagesAtom)

  const composeMessages = (nextMessages: Partial<TransactionToastMessages>) => {
    const getMessages = (
      defaultMessages: TransactionToastMessages,
      nextMessages: Partial<TransactionToastMessages>,
    ) => {
      const messages = {
        ...defaultMessages,
        ...nextMessages,
      }

      return messages
    }

    const messages = getMessages(DEFAULT_OPTIONS, nextMessages)

    setMessages(messages)
  }

  return (
    <TransactionToastContext.Provider value={{ composeMessages }}>
      {children}
      <Toast messages={messages} />
    </TransactionToastContext.Provider>
  )
}

export function useTransactionToast({
  messages,
}: {
  messages?: Partial<TransactionToastMessages>
} = {}): void {
  const hasSetMessages = useRef<boolean>(false)
  const transactionToastContext = useContext(TransactionToastContext)

  if (!transactionToastContext) {
    throw new Error(
      "You forgot to use your useTransactionToast within a TransactionToastProvider",
    )
  }

  const { composeMessages } = transactionToastContext

  useEffect(() => {
    if (!messages)
      return

    if (!hasSetMessages.current) {
      composeMessages(messages)
      hasSetMessages.current = true
    }
  }, [composeMessages, messages])
}

const visibilityAtom = atom(true)

function Toast({
  messages,
}: {
  messages: TransactionToastMessages
}): ReactElement | null {
  const { transactionService } = useTransaction()
  const [state] = useActor(transactionService)
  const [isOpen, setIsOpen] = useAtom(visibilityAtom)
  const { descriptions, titles } = messages

  function getTitle(
    state: TransactionMachineState,
    titles: Titles,
  ): string | undefined {
    if (state.value === "mined")
      return titles.mined

    if (state.value === "mining")
      return titles.mining

    if (state.value === "pending")
      return titles.pending

    if (state.value === "failed")
      return titles.failed

    return undefined
  }

  function getDescription(
    state: TransactionMachineState,
    descriptions: Descriptions,
  ): string | undefined {
    if (state.value === "mined")
      return descriptions.mined

    if (state.value === "mining")
      return descriptions.mining

    if (state.value === "pending")
      return descriptions.pending

    if (state.value === "failed") {
      const errorMessage = getErrorMessage(state.context?.error)

      if (errorMessage.includes("user rejected transaction"))
        return "The request was rejected by the user"

      return descriptions.failed
    }

    return undefined
  }

  if (state.value === TRANSACTION_STATE.Idle)
    return null

  const title = getTitle(state, titles)
  const description = getDescription(state, descriptions)

  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      show={isOpen}
    >
      <Dialog
        className="fixed bottom-4 right-4 rounded-md border-2 border-gray-900 bg-gray-50 p-2"
        onClose={() => setIsOpen(false)}
      >
        <div className="relative h-full w-full">
          <Dialog.Overlay />

          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <IconButton
            className="absolute top-0 right-0 p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </div>
      </Dialog>
    </Transition>
  )
}
