import type { FC, ReactElement } from "react";
import { useInterpret, useActor } from "@xstate/react";
import { useContext, createContext } from "react";
import type {
  ContractReceipt,
  ContractTransaction,
} from "@ethersproject/contracts";
import type { TransactionMachineService } from "~/machines/transaction";
import { transactionMachine } from "~/machines/transaction";
import type { TransactionToastMessages } from "~/providers/transaction-toast-provider";
import { useTransactionToast } from "~/providers/transaction-toast-provider";

export type TransactionFunction = () => Promise<ContractTransaction>;
export enum TransactionStateType {
  Idle = "idle",
  Mined = "mined",
  Failed = "failed",
  Mining = "mining",
  Pending = "pending",
}

type TransactionStateMining = {
  transaction: ContractTransaction;
};
export type TransactionOnMining = (context: TransactionStateMining) => void;

type TransactionStateFailed = {
  error: Error;
};
export type TransactionOnFailed = (context: TransactionStateFailed) => void;

type TransactionStateMined = {
  receipt: ContractReceipt;
  transaction: ContractTransaction;
};
export type TransactionOnMined = (context: TransactionStateMined) => void;

export type TransactionOnPending = () => void;

export type TransactionOn = Partial<{
  [TransactionStateType.Mined]: TransactionOnMined;
  [TransactionStateType.Failed]: TransactionOnFailed;
  [TransactionStateType.Mining]: TransactionOnMining;
  [TransactionStateType.Pending]: TransactionOnPending;
}>;

export const TransactionContext = createContext<{
  sendTransaction: (transactionFunction: TransactionFunction) => Promise<void>;
  transactionService: TransactionMachineService;
  // @ts-expect-error It's a good practice not to give a default value even though the linter tells you so
}>({});

export const TransactionProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const transactionService = useInterpret(transactionMachine);
  const [, send] = useActor(transactionService);

  const sendTransaction = async (
    transactionFunction: TransactionFunction,
  ): Promise<void> => {
    try {
      send("START");

      const transaction = await transactionFunction();
      send({ type: "SIGNED", transaction });

      const receipt = await transaction.wait();
      send({ type: "MINED", receipt, transaction });
    } catch (error) {
      // @ts-expect-error correct this typing, should be fine
      send({ type: "FAILED", error });
    }
  };

  return (
    <TransactionContext.Provider
      value={{ transactionService, sendTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransaction({
  messages,
}: {
  messages?: Partial<TransactionToastMessages>;
} = {}): {
  sendTransaction: (transactionFunction: TransactionFunction) => Promise<void>;
  transactionService: TransactionMachineService;
} {
  const transactionContext = useContext(TransactionContext);

  if (!transactionContext) {
    throw new Error(
      "You forgot to use your useTransaction within a TransactionProvider",
    );
  }

  const { sendTransaction, transactionService } = transactionContext;

  useTransactionToast({ messages });

  return {
    sendTransaction,
    transactionService,
  };
}
