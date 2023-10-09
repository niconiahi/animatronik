### Expectations
In this repository you'll learn see a proof of concept (POC) for an application which lets you add a collectible to the Ethereum network (an NFT). This NFT is some HTML with some CSS applied to it. The idea here is that the CSS animates the HTML and you have a moving figure that is yours and yours only, which will exists for the eternity. You'll see code examples of [state machines](https://stately.ai/docs/xstate) and [atoms](https://jotai.org/docs/introduction) 

### Demo
In this demo you would be able to see other Animatroniks from other people and add one. Right now, I'm migrating this repository from Netlify to Clodflare Pages as I only intend to work within the Edge runtime from now on. This repository is currently building upon [ethers.js](https://github.com/ethers-io/ethers.js) which is built upon Node, thus, it's not compatible with Coudflare

### Files to pay attention
1. [signer.ts](/app/atoms/signer.ts)
2. [account.ts](/app/atoms/account.ts)
3. [provider.ts](/app/atoms/provider.ts)
4. [chainReference.ts](/app/atoms/chainReference.ts)
5. [transaction.ts](/app/machines/transaction.ts)
6. [animatronik.server.ts](/app/models/animatronik.server.ts)
7. [transaction-provider.tsx](/app/providers/transaction-provider.tsx)
8. [transaction-toast-provider.tsx](/app/providers/transaction-toast-provider.tsx.tsx)
9. [_dapp.tsx](/app/routes/_dapp.tsx)
10. [_dapp.add.tsx](/___routes/_dapp.add.tsx)
11. [_dapp.showcase.tsx](/app/routes/_dapp.showcase.tsx)
12. [contracts.ts](/app/utils/contracts.ts)
13. [metamask.ts](/app/utils/metamask.ts)
14. [hashing.ts](/app/utils/hashing.ts)
15. [nft-storage.server.ts](/app/utils/nft-storage.server.ts)
16. [provider.ts](/app/utils/provider.ts)
17. [style.ts](/app/utils/style.ts)
18. [package.json](/package.json)

### Instructions

#### Handling transactions
- Visit the file [transaction.ts](/app/machines/transaction.ts) and see how I use represent a Ethereum transaction flow with a state machine
- Visit the file [transaction-provider.tsx](/app/providers/transaction-provider.tsx) and see the system I implemented to handle Ethereum transactions
- Visit the file [transaction-provider-toast.tsx](/app/providers/transaction-provider.tsx) and see the notification system I implemented that announces as transactions change states

#### Ethereum building blocks
- Visit the file [metamask.ts](/app/utils/metamask.ts) and see how I implement the method to connect to Metamask
- Visit the file [signer.ts](/app/atoms/signer.ts) and see how I implement the code to get the signer from the current provider
- Visit the file [account.ts](/app/atoms/account.ts) and see how I implement the code to get and set an account
- Visit the file [provider.ts](/app/atoms/provider.ts) and see how I create a provider from Metamask (a `Web3Provider`)
- Visit the file [nft-storage.server.ts](/app/utils/nft-storage.server.ts) and see how I instance a NFTStorage client to save the Animatronik
- Visit the file [contracts.ts](/app/utils/contracts.ts) and see how I implement the code for reading contracts in a type-safe manner, having generated the contract typing with [TypeChain](https://github.com/dethcrypto/TypeChain) with [this script](package.json#L10) 

#### Creating Animatroniks
- Visit the file [_dapp.tsx](/app/routes/_dapp.tsx) and see how I compute all the provider dependant values once it's connected. It also provides a button to connect Metamask
- Visit the file [_dapp.add.tsx](/___routes/_dapp.add.tsx) and see the code for adding an Animatronik. Including: all state comes from the `action` (no use of `useState`), all transaction related stuff is handled with the already presented [Ethereum building blocks](#ethereum-building-blocks) and it gives a nice UX for the using presenting an example as a way of trying out the flow very quickly, instead of having to actually create an Animatronik to test it
- Visit the file [_dapp.showcase.tsx](/app/routes/_dapp.showcase.tsx) and get the list of Animatroniks from the database and render them in the page

#### Type-safe contracts
- I have downloaded the artifacts (aka ABIs) for the contracts that my Animatronik contract needs [here](contracts/artifacts/)
- After having the artifacts in your codebase, you can run the `gen:contracts` command found [here](package.json#L10)
- You'll get types after running the command. The output folder I have it set it up is [here](contracts/types/)

#### Ethereum base
- Visit the file [chain.tsx](/app/ethereum/chain.ts) and see the low level API to manipulate Ethereum's network
- Visit the file [eip-1102.tsx](/app/ethereum/eip-1102.ts) and see the low level API to instance an EIP-1102 compliant client
- Visit the file [eip-1193.tsx](/app/ethereum/eip-1193.ts) and see the low level API to instance an EIP-1193 compliant client
- Visit the file [json-rpc.tsx](/app/ethereum/json-rpc.ts) and see the low level API to instance an JSON-RPC compliant client