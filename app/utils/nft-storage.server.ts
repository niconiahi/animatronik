import process from "node:process"

import * as dotenv from "dotenv"
import { NFTStorage } from "nft.storage"

dotenv.config()

export function getNftStorageClient() {
  return new NFTStorage({
    token: process.env.NFT_STORAGE_API_KEY as string,
  })
}
