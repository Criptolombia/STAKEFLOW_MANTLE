import { ethers } from "ethers"
import { MANTLE_SEPOLIA } from "./networks"

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet detected")
  }

  // 1️⃣ Provider inicial
  let provider = new ethers.BrowserProvider(window.ethereum)

  // 2️⃣ Pedir cuentas
  await provider.send("eth_requestAccounts", [])

  // 3️⃣ Verificar red
  const network = await provider.getNetwork()

  // Mantle Sepolia = 5003
  if (network.chainId !== 5003n) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MANTLE_SEPOLIA.chainId }]
      })
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [MANTLE_SEPOLIA]
        })
      } else {
        throw err
      }
    }

    // 🔑 MUY IMPORTANTE: recrear provider tras cambiar de red
    provider = new ethers.BrowserProvider(window.ethereum)
  }

  // 4️⃣ Signer y address YA en Mantle Sepolia
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return {
    provider,
    signer,
    address
  }
}
