import { ethers } from "ethers"
import { STAKING_VAULT_ABI } from "./abis/StakingVaultABI"

const VAULT_ADDRESS = "0x3A822a83105CbeA806d6329A7D3AE18F5b8dC9ED"

export function useClaimPosition(wallet) {
  const claim = async (tokenId) => {
    if (!wallet?.provider || !wallet?.signer) {
      throw new Error("Wallet not connected")
    }

    const contract = new ethers.Contract(
      VAULT_ADDRESS,
      STAKING_VAULT_ABI,
      wallet.signer
    )

    const tx = await contract.claim(tokenId)
    await tx.wait()
  }

  return { claim }
}
