import { Dialog, Transition } from "@headlessui/react";
import { useActor } from "@xstate/react";
import type { FC, ReactElement } from "react";
import { useRef, useState, useEffect, useContext, createContext } from "react";
import IconButton from "~/components/icon-button";
import X from "~/icons/x";
import type { TransactionMachineState } from "~/machines/transaction";
import { useTransaction } from "./transaction-provider";
import { TransactionStateType } from "./transaction-provider";

type Titles = {
  [TransactionStateType.Mined]: string;
  [TransactionStateType.Failed]: string;
  [TransactionStateType.Mining]: string;
  [TransactionStateType.Pending]: string;
};
type Descriptions = {
  [TransactionStateType.Mined]: string;
  [TransactionStateType.Failed]: string;
  [TransactionStateType.Mining]: string;
  [TransactionStateType.Pending]: string;
};
export type TransactionToastMessages = {
  titles: Titles;
  descriptions: Descriptions;
};

const DEFAULT_OPTIONS = {
  titles: {
    [TransactionStateType.Mined]: "Transaction mined",
    [TransactionStateType.Failed]: "Transaction failed",
    [TransactionStateType.Mining]: "Transaction mining",
    [TransactionStateType.Pending]: "Transaction pending",
  },
  descriptions: {
    [TransactionStateType.Mined]: "Your transaction was mined by a miner",
    [TransactionStateType.Failed]: "Your transaction failed to be transacted",
    [TransactionStateType.Mining]:
      "Your transaction was sent to the blockchain",
    [TransactionStateType.Pending]: "Your transaction is pending to be signed",
  },
};

type Value = {
  composeMessages: (userOptions: Partial<TransactionToastMessages>) => void;
};

export const TransactionToastContext = createContext<Value>(
  // @ts-expect-error It's a good practice not to give a default value even though the linter tells you so
  {}
);

export const TransactionToastProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [messages, setMessages] =
    useState<TransactionToastMessages>(DEFAULT_OPTIONS);

  const composeMessages = (nextMessages: Partial<TransactionToastMessages>) => {
    const getMessages = (
      defaultMessages: TransactionToastMessages,
      nextMessages: Partial<TransactionToastMessages>
    ) => {
      const messages = {
        ...defaultMessages,
        ...nextMessages,
      };

      return messages;
    };

    const messages = getMessages(DEFAULT_OPTIONS, nextMessages);

    setMessages(messages);
  };

  return (
    <TransactionToastContext.Provider value={{ composeMessages }}>
      {children}
      <Toast messages={messages} />
    </TransactionToastContext.Provider>
  );
};

export const useTransactionToast = ({
  messages,
}: {
  messages?: Partial<TransactionToastMessages>;
} = {}): void => {
  const hasSetMessages = useRef<boolean>(false);
  const transactionToastContext = useContext(TransactionToastContext);

  if (!transactionToastContext) {
    throw new Error(
      "You forgot to use your useTransactionToast within a TransactionToastProvider"
    );
  }

  const { composeMessages } = transactionToastContext;

  useEffect(() => {
    if (!messages) return;

    if (!hasSetMessages.current) {
      composeMessages(messages);
      hasSetMessages.current = true;
    }
  }, [composeMessages, messages]);
};

function Toast({
  messages,
}: {
  messages: TransactionToastMessages;
}): ReactElement | null {
  const { transactionService } = useTransaction();
  const [state] = useActor(transactionService);

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { descriptions, titles } = messages;

  function getTitle(
    state: TransactionMachineState,
    titles: Titles
  ): string | undefined {
    if (state.value === TransactionStateType.Mined)
      return titles[TransactionStateType.Mined];
    if (state.value === TransactionStateType.Mining)
      return titles[TransactionStateType.Mining];
    if (state.value === TransactionStateType.Pending)
      return titles[TransactionStateType.Pending];
    if (state.value === TransactionStateType.Failed)
      return titles[TransactionStateType.Failed];

    return undefined;
  }

  function getDescription(
    state: TransactionMachineState,
    descriptions: Descriptions
  ): string | undefined {
    if (state.value === TransactionStateType.Mined)
      return descriptions[TransactionStateType.Mined];
    if (state.value === TransactionStateType.Mining)
      return descriptions[TransactionStateType.Mining];
    if (state.value === TransactionStateType.Pending)
      return descriptions[TransactionStateType.Pending];
    if (state.value === TransactionStateType.Failed)
      return descriptions[TransactionStateType.Failed];

    return undefined;
  }

  if (state.value === TransactionStateType.Idle) return null;

  const title = getTitle(state, titles);
  const description = getDescription(state, descriptions);

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
  );
}
