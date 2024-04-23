import { JsonRpcProvider } from "@ethersproject/providers"

import { ChainReference } from "~/ethereum/chain"

export function getRpcProvider({
  chainReference,
}: {
  chainReference?: ChainReference
}): JsonRpcProvider {
  switch (chainReference) {
    case ChainReference.Mainnet: {
      return new JsonRpcProvider(
        "https://eth-mainnet.alchemyapi.io/v2/a5n7e0kB6LJg5nDUx2cFqEYeDoa8aeqP",
        chainReference,
      )
    }
    case ChainReference.OptimismGoerli: {
      return new JsonRpcProvider(
        "https://opt-goerli.g.alchemy.com/v2/BBYbDq6HCJ5YNwERxUQqtsO9Uy6_c-UU",
        chainReference,
      )
    }
    case ChainReference.Localhost: {
      return new JsonRpcProvider()
    }
    default: {
      return new JsonRpcProvider(
        "https://eth-mainnet.alchemyapi.io/v2/a5n7e0kB6LJg5nDUx2cFqEYeDoa8aeqP",
        chainReference,
      )
    }
  }
}
