import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { VAULT_ADDRESS, VAULT_EVENTS_ABI } from "./contracts"
import { getProvider } from "./provider"
import { supabase } from "./supabaseClient"

/* ─────────────────────────────
   ASSETS (ajustado a tu realidad)
───────────────────────────── */
const ASSET_LABELS = {
  0: "MNT"
}

// ABI mínimo del NFT
const NFT_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function nextTokenId() view returns (uint256)"
]

const NFT_ADDRESS = "0xA7fB0e4c6d3Ddb563f15AAAce484Cb025A52f799"

export function useStakingPositions(walletAddress) {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!walletAddress) {
      setPositions([])
      setLoading(false)
      return
    }

    async function loadPositions() {
      try {
        setLoading(true)

        const provider = getProvider()

        const vault = new ethers.Contract(
          VAULT_ADDRESS,
          VAULT_EVENTS_ABI,
          provider
        )

        const nft = new ethers.Contract(
          NFT_ADDRESS,
          NFT_ABI,
          provider
        )

        /* ─────────────────────────────
           1️⃣ Cargar NFTs listados (Supabase)
        ───────────────────────────── */

        const { data: listedOrders, error } = await supabase
          .from("orders")
          .select("token_id")
          .eq("status", "LISTED")

        if (error) {
          console.error("Supabase error:", error)
        }

        const listedMap = {}
        listedOrders?.forEach(o => {
          listedMap[o.token_id] = true
        })

        /* ─────────────────────────────
           2️⃣ Recorrer NFTs del usuario
        ───────────────────────────── */

        const nextTokenId = Number(await nft.nextTokenId())
        const found = []

        for (let tokenId = 0; tokenId < nextTokenId; tokenId++) {
          try {
            const owner = await nft.ownerOf(tokenId)
            if (owner.toLowerCase() !== walletAddress.toLowerCase()) continue

            const p = await vault.positions(tokenId)

            found.push({
              tokenId: tokenId.toString(),
              asset: ASSET_LABELS[p.asset] ?? "MNT",
              amount: ethers.formatEther(p.amount),
              startTime: Number(p.startTime),
              unlockTime: Number(p.unlockTime),
              claimed: p.claimed,
              isListed: !!listedMap[tokenId] // 🔥 CLAVE
            })
          } catch {
            // token inexistente / quemado → ignorar
          }
        }

        setPositions(found)
      } finally {
        setLoading(false)
      }
    }

    loadPositions()
  }, [walletAddress])

  return { positions, loading }
}
