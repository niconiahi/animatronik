/* eslint-disable camelcase */
import type { InterpreterFrom } from "xstate";
import { createMachine, assign } from "xstate";
import type {
  ContractReceipt,
  ContractTransaction,
} from "@ethersproject/contracts";

import type { TransactionOn } from "~/providers/transaction-provider";

export type TransactionMachineSend = InterpreterFrom<
  typeof transactionMachine
>["send"];
export type TransactionMachineState = InterpreterFrom<
  typeof transactionMachine
>["state"];
export type TransactionMachineService = InterpreterFrom<
  typeof transactionMachine
>;

type TransactionMachineEvent =
  | {
      type: "START";
    }
  | {
      type: "SIGNED";
      transaction: ContractTransaction;
    }
  | {
      type: "MINED";
      receipt: ContractReceipt;
      transaction: ContractTransaction;
    }
  | {
      type: "FAILED";
      error: Error;
    }
  | {
      type: "SET_ON";
      on: TransactionOn;
    };

type TransactionMachineContext = {
  on: TransactionOn;
  error?: Error;
  receipt?: ContractReceipt;
  transaction?: ContractTransaction;
};

type TransactionMachineTypestate =
  | {
      value: "idle";
      context: TransactionMachineContext;
    }
  | {
      value: "pending";
      context: TransactionMachineContext;
    }
  | {
      value: "mining";
      context: TransactionMachineContext & {
        transaction: ContractTransaction;
      };
    }
  | {
      value: "mined";
      context: TransactionMachineContext & {
        receipt: ContractReceipt;
        transaction: ContractTransaction;
      };
    }
  | {
      value: "failed";
      context: TransactionMachineContext & {
        error: Error;
      };
    };

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
      entry: [(context) => context.on.pending?.()],
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
        (context) =>
          context.on.mining?.({
            transaction: context.transaction as ContractTransaction,
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
        (context) =>
          context.on.mined?.({
            receipt: context.receipt as ContractReceipt,
            transaction: context.transaction as ContractTransaction,
          }),
      ],
    },
    failed: {
      type: "final",
      entry: [
        (context) =>
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
});
