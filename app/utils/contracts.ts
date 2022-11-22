import type { JsonRpcProvider } from "@ethersproject/providers";
import { AnimatronikContract__factory as animatronikContract } from "../../typechain-types/factories/contracts/Animatronik.sol";
import type { AnimatronikContract } from "../../typechain-types/contracts/Animatronik.sol/AnimatronikContract";
import { useAtom } from "jotai";
import { signerAtom } from "~/atoms/signer";
export type { AnimatronikContract as Animatronik } from "../../typechain-types/contracts/Animatronik.sol/AnimatronikContract";

const ANIMATRONIK_OPTIMISM_GOERLI_ADDRESS =
  "0xfa69459bFBff37E818498af01Ff0ADe85A8083c6";

export function useAnimatronikContract(): AnimatronikContract | undefined {
  const [signer] = useAtom(signerAtom);

  if (!signer) return undefined;

  return animatronikContract.connect(
    ANIMATRONIK_OPTIMISM_GOERLI_ADDRESS,
    signer
  );
}

export function getAnimatronikContract({
  provider,
}: {
  provider: JsonRpcProvider;
}): AnimatronikContract {
  return animatronikContract.connect(
    ANIMATRONIK_OPTIMISM_GOERLI_ADDRESS,
    provider
  );
}
