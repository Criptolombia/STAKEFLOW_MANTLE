import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { getProvider } from "./provider"
import { ERC20_ABI, MNT_TOKEN_ADDRESS } from "./contracts"

export function useBalances(walletAddress) {
  const [ethBalance, setEthBalance] = useState(null)
  const [mntBalance, setMntBalance] = useState(null)

  useEffect(() => {
    if (!walletAddress) return

    async function loadBalances() {
      const provider = getProvider()

      // ETH balance
      const eth = await provider.getBalance(walletAddress)
      setEthBalance(ethers.formatEther(eth))

      // MNT balance (opcional)
      if (
        MNT_TOKEN_ADDRESS &&
        MNT_TOKEN_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        const token = new ethers.Contract(
          MNT_TOKEN_ADDRESS,
          ERC20_ABI,
          provider
        )

        const [raw, decimals] = await Promise.all([
          token.balanceOf(walletAddress),
          token.decimals()
        ])

        setMntBalance(ethers.formatUnits(raw, decimals))
      }
    }

    loadBalances()
  }, [walletAddress])

  return {
    ethBalance,
    mntBalance
  }
}
