import { NFTStorage } from "nft.storage";
import * as dotenv from "dotenv";

dotenv.config();

export function getNftStorageClient() {
  return new NFTStorage({
    token: process.env.NFT_STORAGE_API_KEY as string,
  });
}
