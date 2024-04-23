import type {
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers"
import type { InterpreterFrom } from "xstate"
import { assign, createMachine } from "xstate"

import type { TransactionOn } from "~/providers/transaction-provider"

export type TransactionMachineSend = InterpreterFrom<
  typeof transactionMachine
>["send"]
export type TransactionMachineState = InterpreterFrom<
  typeof transactionMachine
>["state"]
export type TransactionMachineService = InterpreterFrom<
  typeof transactionMachine
>

type TransactionMachineEvent =
  | {
    type: "START"
  }
  | {
    type: "SIGNED"
    transaction: ContractTransactionResponse
  }
  | {
    type: "MINED"
    receipt: ContractTransactionReceipt
    transaction: ContractTransactionResponse
  }
  | {
    type: "FAILED"
    error: Error
  }
  | {
    type: "SET_ON"
    on: TransactionOn
  }

interface TransactionMachineContext {
  on: TransactionOn
  error?: Error
  receipt?: ContractTransactionReceipt
  transaction?: ContractTransactionResponse
}

type TransactionMachineTypestate =
  | {
    value: "idle"
    context: TransactionMachineContext
  }
  | {
    value: "pending"
    context: TransactionMachineContext
  }
  | {
    value: "mining"
    context: TransactionMachineContext & {
      transaction: ContractTransactionResponse
    }
  }
  | {
    value: "mined"
    context: TransactionMachineContext & {
      receipt: ContractTransactionReceipt
      transaction: ContractTransactionResponse
    }
  }
  | {
    value: "failed"
    context: TransactionMachineContext & {
      error: Error
    }
  }

export const transactionMachine = createMachine<
  TransactionMachineContext,
  TransactionMachineEvent,
  TransactionMachineTypestate
>({
  predictableActionArguments: true,
  id: "transaction",
  context: {
    on: {
      mined: undefined,
      mining: undefined,
      failed: undefined,
      pending: undefined,
    },
    error: undefined,
    receipt: undefined,
    transaction: undefined,
  },
  initial: "idle",
  states: {
    idle: {
      type: "atomic",
      on: {
        START: {
          target: "pending",
        },
      },
    },
    pending: {
      type: "atomic",
      entry: [context => context.on.pending?.()],
      on: {
        SIGNED: {
          actions: [assign({ transaction: (_, event) => event.transaction })],
          target: "mining",
        },
        FAILED: {
          actions: [assign({ error: (_, event) => event.error })],
          target: "failed",
        },
      },
    },
    mining: {
      type: "atomic",
      entry: [
        context =>
          context.on.mining?.({
            transaction: context.transaction as ContractTransactionResponse,
          }),
      ],
      on: {
        MINED: {
          actions: [assign({ receipt: (_, event) => event.receipt })],
          target: "mined",
        },
        FAILED: {
          actions: [assign({ error: (_, event) => event.error })],
          target: "failed",
        },
      },
    },
    mined: {
      type: "final",
      entry: [
        context =>
          context.on.mined?.({
            receipt: context.receipt as ContractTransactionReceipt,
            transaction: context.transaction as ContractTransactionResponse,
          }),
      ],
    },
    failed: {
      type: "final",
      entry: [
        context =>
          context.on.failed?.({
            error: context.error as Error,
          }),
      ],
    },
  },
  on: {
    SET_ON: {
      actions: [assign({ on: (_, event) => event.on })],
    },
  },
})
