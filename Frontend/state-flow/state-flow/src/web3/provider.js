import { ethers } from "ethers"

export function getProvider() {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found")
  }
  return new ethers.BrowserProvider(window.ethereum)
}

export async function getSigner() {
  const provider = getProvider()
  return await provider.getSigner()
}
