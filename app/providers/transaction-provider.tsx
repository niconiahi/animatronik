import { useActor, useInterpret } from "@xstate/react"
import type {
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers"
import type { FC, ReactElement } from "react"
import { createContext, useContext } from "react"

import type { TransactionMachineService } from "~/machines/transaction"
import { transactionMachine } from "~/machines/transaction"
import type { TransactionToastMessages } from "~/providers/transaction-toast-provider"
import { useTransactionToast } from "~/providers/transaction-toast-provider"

export type TransactionFunction = () => Promise<ContractTransactionResponse>
const TRANSACTION_STATE = {
  Idle: "idle" as const,
  Mined: "mined" as const,
  Failed: "failed" as const,
  Mining: "mining" as const,
  Pending: "pending" as const,
}

type ObjectValues<T> = T[keyof T]
export type TransactionStateType = ObjectValues<typeof TRANSACTION_STATE>

interface TransactionStateMining {
  transaction: ContractTransactionResponse
}
// eslint-disable-next-line no-unused-vars
export type TransactionOnMining = (context: TransactionStateMining) => void

interface TransactionStateFailed {
  error: Error
}
// eslint-disable-next-line no-unused-vars
export type TransactionOnFailed = (context: TransactionStateFailed) => void

interface TransactionStateMined {
  receipt: ContractTransactionReceipt
  transaction: ContractTransactionResponse
}
// eslint-disable-next-line no-unused-vars
export type TransactionOnMined = (context: TransactionStateMined) => void

export type TransactionOnPending = () => void

export type TransactionOn = Partial<{
  [TRANSACTION_STATE.Mined]: TransactionOnMined
  [TRANSACTION_STATE.Failed]: TransactionOnFailed
  [TRANSACTION_STATE.Mining]: TransactionOnMining
  [TRANSACTION_STATE.Pending]: TransactionOnPending
}>

export const TransactionContext = createContext<{
  // eslint-disable-next-line no-unused-vars
  sendTransaction: (transactionFunction: TransactionFunction) => Promise<void>
  transactionService: TransactionMachineService
}>({})

export const TransactionProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const transactionService = useInterpret(transactionMachine)
  const [, send] = useActor(transactionService)

  const sendTransaction = async (
    transactionFunction: TransactionFunction,
  ): Promise<void> => {
    try {
      send("START")

      const transaction = await transactionFunction()
      send({ type: "SIGNED", transaction })
      // console.log("transaction", transaction)

      const receipt = await transaction.wait()
      // console.log("receipt", receipt)

      if (receipt) {
        send({ type: "MINED", receipt, transaction })
      }
    } catch (error) {
      // console.log(error, "error")
      send({ type: "FAILED", error })
    }
  }

  return (
    <TransactionContext.Provider
      value={{ transactionService, sendTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransaction({
  messages,
}: {
  messages?: Partial<TransactionToastMessages>
} = {}): {
    // eslint-disable-next-line no-unused-vars
    sendTransaction: (transactionFunction: TransactionFunction) => Promise<void>
    transactionService: TransactionMachineService
  } {
  const transactionContext = useContext(TransactionContext)

  if (!transactionContext) {
    throw new Error(
      "You forgot to use your useTransaction within a TransactionProvider",
    )
  }

  const { sendTransaction, transactionService } = transactionContext

  useTransactionToast({ messages })

  return {
    sendTransaction,
    transactionService,
  }
}
