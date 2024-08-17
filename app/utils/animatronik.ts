import type { ethers } from "ethers"
import { useAtom } from "jotai"
import type { JsonRpcProvider } from "@ethersproject/providers"
import { AnimatronikContractAbi__factory as animatronikContract } from "~/generated/contracts/types"
import type { AnimatronikContractAbi as AnimatronikContract } from "~/generated/contracts/types/contracts/Animatronik.sol/AnimatronikContractAbi"
import { signerAtom } from "~/atoms/signer"

export function useAnimatronikContract({
  address,
}: {
  address: string
}): AnimatronikContract | undefined {
  const [signer] = useAtom(signerAtom)

  if (!signer)
    return undefined

  return animatronikContract.connect(
    address,
    signer as unknown as ethers.JsonRpcSigner,
  )
}

export function getAnimatronikContract({
  provider,
  address,
}: {
  provider: JsonRpcProvider
  address: string
}): AnimatronikContract {
  return animatronikContract.connect(
    address,
    provider as unknown as ethers.JsonRpcProvider,
  )
}
