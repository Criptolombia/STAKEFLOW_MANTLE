import { useState } from "react"
import { ethers } from "ethers"
import toast from "react-hot-toast"

import { supabase } from "../web3/supabaseClient"
import { ERC721_APPROVAL_ABI } from "../web3/abis/ERC721ApprovalABI"
import { MARKETPLACE_DOMAIN, ORDER_TYPES } from "../web3/abis/MarketplaceABI"

const NFT_ADDRESS = "0xA7fB0e4c6d3Ddb563f15AAAce484Cb025A52f799"
const MARKETPLACE_ADDRESS = "0x3458383B0063282a86B5Ad8e26F03799AAbc4574"

function SellModal({ wallet, tokenId, onClose, onSuccess }) {
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSell = async () => {
    try {
      setLoading(true)

      const signer = wallet.signer

      /* ─────────────────────────────
         1️⃣ APROBAR NFT AL MARKETPLACE
      ───────────────────────────── */

      const nft = new ethers.Contract(
        NFT_ADDRESS,
        ERC721_APPROVAL_ABI,
        signer
      )

      const isApproved = await nft.isApprovedForAll(
        wallet.address,
        MARKETPLACE_ADDRESS
      )

      if (!isApproved) {
        toast.loading("Approving NFT…", { id: "approve" })

        const tx = await nft.setApprovalForAll(
          MARKETPLACE_ADDRESS,
          true
        )
        await tx.wait()

        toast.success("NFT approved", { id: "approve" })
      }

      /* ─────────────────────────────
         2️⃣ CONSTRUIR ORDEN
      ───────────────────────────── */

      const nonce = Date.now() // simple, seguro y único
      const expiry =
        Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 días

      const order = {
        seller: wallet.address,
        tokenId: Number(tokenId),
        paymentToken:
          "0x0000000000000000000000000000000000000000", // MNT
        price: ethers.parseEther(price).toString(),
        expiry,
        nonce
      }

      /* ─────────────────────────────
         3️⃣ FIRMAR ORDEN (EIP-712)
      ───────────────────────────── */

      toast.loading("Signing order…", { id: "sign" })

      const signature = await signer.signTypedData(
        MARKETPLACE_DOMAIN,
        ORDER_TYPES,
        order
      )

      toast.success("Order signed", { id: "sign" })

      /* ─────────────────────────────
         4️⃣ GUARDAR EN SUPABASE
      ───────────────────────────── */

      console.log("⏺️ Inserting order into Supabase:", {
        seller: order.seller,
        token_id: order.tokenId,
        price: order.price,
        expiry: order.expiry,
        nonce: order.nonce,
        signature
      })
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            seller: order.seller,
            token_id: order.tokenId,
            price: order.price,
            expiry: order.expiry,
            nonce: order.nonce,
            signature,
            status: "LISTED"
          }
        ])
        .select()

        console.log("✅ Supabase insert result:", data)

      if (error) throw error

      toast.success("NFT listed for sale")

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error("Sell failed:", err)
      toast.error("Sell failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Sell NFT #{tokenId}</h2>

        <input
          type="number"
          placeholder="Price in MNT"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />

        <div style={styles.actions}>
          <button
            style={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            style={styles.confirm}
            onClick={handleSell}
            disabled={loading || !price}
          >
            {loading ? "Processing…" : "Confirm Sell"}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#0b0f14",
    borderRadius: "16px",
    padding: "24px",
    width: "360px",
    border: "1px solid rgba(255,255,255,0.15)"
  },
  title: {
    color: "#fff",
    marginBottom: "16px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "#111",
    color: "#fff",
    marginBottom: "20px"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px"
  },
  cancel: {
    flex: 1,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer"
  },
  confirm: {
    flex: 1,
    background: "linear-gradient(180deg, #2ED3B7, #1FA293)",
    border: "none",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer"
  }
}

export default SellModal
