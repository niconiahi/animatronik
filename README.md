### Expectations
In this repo you'll learn how to setup a [ERC721 contract](https://docs.openzeppelin.com/contracts/3.x/erc721) starting from [Remix's @cloudflare/pages template](https://remix.run/docs/en/main/guides/vite#cloudflare). You will find the use of state machines to control state flow of the transaction sent to the blockchain. You will also see that the use of React's useState is minimal and instead the use Jotai which is an implementation of signals for React, including atoms states and derived states from those atoms.

### Demo
In this demo you can see the Animatronik creation flow and also see a page where all of them are showcased - [demo](https://animatronik.pages.dev/)

### Files to pay attention
1. [atoms/signer.tsx](./app/atoms/signer.ts)
2. [atoms/account.tsx](./app/atoms/account.ts)
3. [atoms/provider.tsx](./app/atoms/provider.ts)
4. [atoms/chainReference.tsx](./app/atoms/chainReference.ts)
5. [machines/transaction.tsx](./app/machines/transaction.ts)
6. [routes/_dapp.tsx](./app/routes/_dapp.tsx)
7. [routes/_dapp.add.tsx](./app/routes/_dapp.add.tsx)
8. [routes/_dapp.showcase.tsx](./app/routes/_dapp.showcase.tsx)
9. [utils/hashing.ts](./app/utils/hashing.ts)
10. [utils/style.ts](./app/utils/style.ts)
11. [utils/animatronik.ts](./app/utils/animatronik.ts)
12. [utils/metamask.ts](./app/utils/metamask.ts)
13. [utils/provide.ts](./app/utils/provider.ts)

### Links
- [ERC721 contract](https://docs.openzeppelin.com/contracts/3.x/erc721/)
- [Jotai](https://jotai.org/)
