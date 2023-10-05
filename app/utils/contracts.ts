import type { JsonRpcProvider } from "@ethersproject/providers";
import type { AnimatronikContractAbi as AnimatronikContract } from "contracts/types/contracts/Animatronik.sol/AnimatronikContractAbi";
import { useAtom } from "jotai";
import { signerAtom } from "~/atoms/signer";
import { AnimatronikContractAbi__factory as animatronikContract } from "contracts/types";
import type { ethers } from "ethers";

const ANIMATRONIK_OPTIMISM_GOERLI_ADDRESS =
  "0x16e91c951d1f0e861407c516da50f9230ea06f41";

export function useAnimatronikContract(): AnimatronikContract | undefined {
  const [signer] = useAtom(signerAtom);

  if (!signer) return undefined;

  return animatronikContract.connect(
    ANIMATRONIK_OPTIMISM_GOERLI_ADDRESS,
    signer as unknown as ethers.JsonRpcSigner,
  );
}

export function getAnimatronikContract({
  provider,
}: {
  provider: JsonRpcProvider;
}): AnimatronikContract {
  return animatronikContract.connect(
    ANIMATRONIK_OPTIMISM_GOERLI_ADDRESS,
    provider as unknown as ethers.JsonRpcProvider,
  );
}
