# Animatronik

An NFT dApp where each token is an animated SVG — the CSS and SVG markup are compressed and stored on-chain, and the gallery decompresses and renders them in the browser.

Animatronik is built end-to-end on [Ethernauta](https://github.com/niconiahi/ethernauta) and is the most complete public reference for consuming the library.

## What it demonstrates

- **ABI generator** — every contract method under `app/generated/animatronik/methods/` is emitted by `ethernauta abi` from the Foundry artifact. View / pure methods are `Callable<T>`; state-changing methods are `Signable<Bytes>`.
- **`create_contract`** — view reads (`totalSupply`, `tokenByIndex`, `get_data`) go through a contract resolver and use `eth_call`. See [`app/routes/dapp.showcase.tsx`](https://github.com/niconiahi/animatronik/blob/main/app/routes/dapp.showcase.tsx).
- **`create_signer` + `create_writer`** — minting goes through the wallet to produce a signed raw transaction, then `eth_sendRawTransaction` broadcasts it. See [`app/routes/dapp.add.tsx`](https://github.com/niconiahi/animatronik/blob/main/app/routes/dapp.add.tsx).
- **`@ethernauta/eip/1102`** — `eth_requestAccounts` is used to connect the wallet. See [`app/routes/dapp.tsx`](https://github.com/niconiahi/animatronik/blob/main/app/routes/dapp.tsx).
- **`@ethernauta/transaction`** — `register_transaction` + `watch_transaction` track the mint from `pending` → `mined`.

The Ethernauta extension is the only wallet Animatronik talks to. There is no `viem` / `ethers` / `web3.js` dependency anywhere.

## Contract

A minimal `ERC721Enumerable` ([OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)) where each token stores a compressed JSON blob containing `{ css, svg }`:

- [`contracts/src/AnimatronikContract.sol`](https://github.com/niconiahi/animatronik/blob/main/contracts/src/AnimatronikContract.sol)

Deployed on Sepolia. The ABI artifact at `contracts/out/AnimatronikContract.sol/AnimatronikContract.json` is the input to the Ethernauta generator.

## Project layout

```
app/
├── routes/
│   ├── dapp.tsx          # wallet connect + outlet
│   ├── dapp.add.tsx      # mint flow (signer → writer → tracker)
│   └── dapp.showcase.tsx # gallery (contract resolver + eth_call)
├── generated/
│   └── animatronik/methods/  # generated from the ABI by `ethernauta abi`
contracts/                # Foundry project
```

## Running locally

```bash
pnpm install
pnpm dev
```

Available at `http://localhost:5173`. You'll need the [Ethernauta extension](https://chromewebstore.google.com/detail/ethernauta/lpjalkakmdgkepcogmaoipjjeahnpdjp) to mint.

### Regenerate contract methods

After changing the contract, recompile with Foundry then regenerate the TypeScript bindings:

```bash
forge build
pnpm regen:methods
```

This runs `ethernauta abi --in contracts/out/AnimatronikContract.sol/AnimatronikContract.json --out app/generated/animatronik`.

## Deployment

Deployed to Cloudflare Workers via Wrangler:

```bash
pnpm deploy
```

## Stack

- [Ethernauta](https://github.com/niconiahi/ethernauta) — Ethereum client + wallet extension
- [React Router 7](https://reactrouter.com/) — app framework
- [Cloudflare Workers](https://workers.cloudflare.com/) — hosting
- [Tailwind CSS 4](https://tailwindcss.com/) — styling
- [Foundry](https://book.getfoundry.sh/) — smart contract development
