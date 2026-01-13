import { ethers } from "ethers"
import toast from "react-hot-toast"
import { MARKETPLACE_ABI } from "./abis/SimpleMarketplaceABI"

const MARKETPLACE_ADDRESS =
  "0x3458383B0063282a86B5Ad8e26F03799AAbc4574"

export async function buyOrder({ wallet, order }) {
  try {
    if (!wallet || !order) {
      throw new Error("Wallet or order missing")
    }

    console.log("BUY ORDER:", order)

    const {
      seller,
      tokenId,
      paymentToken,
      price,
      expiry,
      nonce,
      signature
    } = order

    if (
      !seller ||
      tokenId === undefined ||
      !price ||
      !expiry ||
      nonce === undefined ||
      !signature
    ) {
      throw new Error("Order fields missing")
    }

    const contract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      wallet.signer
    )

    toast.loading("Confirm purchase in wallet…", { id: "buy" })

    const tx = await contract.buyWithSignature(
      {
        seller,
        tokenId: BigInt(tokenId),
        paymentToken,
        price: BigInt(price),
        expiry: BigInt(expiry),
        nonce: BigInt(nonce)
      },
      signature,
      {
        value: BigInt(price)
      }
    )

    await tx.wait()

    toast.success("NFT purchased successfully", { id: "buy" })
  } catch (err) {
    console.error("Buy failed:", err)
    toast.error(err.message || "Buy failed", { id: "buy" })
  }
}
