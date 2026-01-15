import { useEffect, useState } from "react"
import { supabase } from "../web3/supabaseClient"
import { buyOrder } from "../web3/marketplaceBuy"

/* ───────── Constants ───────── */

const NFT_ADDRESS = "0xA7fB0e4c6d3Ddb563f15AAAce484Cb025A52f799"
const EXPLORER_BASE = "https://sepolia.mantlescan.xyz/token"

/* ───────── APY Logic ───────── */

function getApy(days) {
  if (days <= 30) return 0.05
  if (days <= 90) return 0.06
  if (days <= 180) return 0.07
  return 0.09
}

function enrichOrder(order) {
  const created = new Date(order.created_at).getTime() / 1000
  const expiry = Number(order.expiry)
  const now = Date.now() / 1000

  const duration = expiry - created
  const elapsed = Math.max(0, Math.min(now - created, duration))

  const days = duration / 86400
  const apy = getApy(days)

  const principal = Number(order.price) / 1e18
  const rewards = principal * apy * (elapsed / duration)

  return {
    ...order,
    principal,
    apy,
    rewards,
    locked: now < expiry,
    hoursLeft: Math.max(0, Math.floor((expiry - now) / 3600))
  }
}

function Marketplace({ wallet }) {
  const [myListings, setMyListings] = useState([])
  const [otherListings, setOtherListings] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadListings() {
    if (!wallet?.address) return

    setLoading(true)

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "LISTED")

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const mine = []
    const others = []

    data.forEach(o => {
      const enriched = enrichOrder(o)

      if (o.seller.toLowerCase() === wallet.address.toLowerCase()) {
        mine.push(enriched)
      } else {
        others.push(enriched)
      }
    })

    setMyListings(mine)
    setOtherListings(others)
    setLoading(false)
  }

  useEffect(() => {
    loadListings()
  }, [wallet?.address])

  if (loading) {
    return <div style={styles.empty}>Loading marketplace…</div>
  }

  return (
    <div style={styles.page}>
      {/* ───────── My Listings ───────── */}
      <h2 style={styles.sectionTitle}>My Listings</h2>

      {myListings.length === 0 && (
        <div style={styles.empty}>No active listings.</div>
      )}

      {myListings.length > 0 && (
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <div>ID</div>
            <div>Amount</div>
            <div>APY</div>
            <div>Rewards</div>
            <div>Status</div>
            <div />
          </div>

          {myListings.map(l => (
            <div key={l.token_id} style={styles.row}>
              <div style={styles.tokenId}>
                #{l.token_id}
                <a
                  href={`${EXPLORER_BASE}/${NFT_ADDRESS}?a=${l.token_id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.explorerLink}
                >
                  View
                </a>
              </div>

              <div>{l.principal.toFixed(4)} MNT</div>
              <div>{(l.apy * 100).toFixed(1)}%</div>
              <div>{l.rewards.toFixed(4)} MNT</div>
              <div style={styles.listed}>LISTED</div>
              <div />
            </div>
          ))}
        </div>
      )}

      {/* ───────── Available Listings ───────── */}
      <h2 style={styles.sectionTitle}>Available Listings</h2>

      {otherListings.length === 0 && (
        <div style={styles.empty}>No listings available.</div>
      )}

      {otherListings.length > 0 && (
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <div>ID</div>
            <div>Amount</div>
            <div>APY</div>
            <div>Rewards</div>
            <div>Lock</div>
            <div />
          </div>

          {otherListings.map(l => (
            <div key={l.token_id} style={styles.row}>
              <div style={styles.tokenId}>
                #{l.token_id}
                <a
                  href={`${EXPLORER_BASE}/${NFT_ADDRESS}?a=${l.token_id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.explorerLink}
                >
                  View
                </a>
              </div>

              <div>{l.principal.toFixed(4)} MNT</div>
              <div>{(l.apy * 100).toFixed(1)}%</div>
              <div>{l.rewards.toFixed(4)} MNT</div>
              <div>
                {l.locked ? `${l.hoursLeft}h left` : "Unlocked"}
              </div>

              <button
                style={styles.buyButton}
                onClick={() =>
                  buyOrder({
                    wallet,
                    order: {
                      seller: l.seller,
                      tokenId: l.token_id,
                      paymentToken:
                        "0x0000000000000000000000000000000000000000",
                      price: l.price,
                      expiry: l.expiry,
                      nonce: l.nonce,
                      signature: l.signature
                    }
                  })
                }
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────── Styles ───────── */

const styles = {
  page: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#ffffff"
  },

  empty: {
    opacity: 0.5,
    marginBottom: "24px"
  },

  table: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "14px",
    overflow: "hidden"
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr 1fr 120px",
    padding: "14px 20px",
    fontSize: "13px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr 1fr 120px",
    padding: "16px 20px",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "#fff"
  },

  tokenId: {
    fontWeight: 600,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  explorerLink: {
    fontSize: "11px",
    color: "#2ED3B7",
    textDecoration: "none"
  },

  buyButton: {
    background: "linear-gradient(180deg, #2ED3B7, #1FA293)",
    border: "none",
    padding: "10px 22px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
    color: "#000"
  },

  listed: {
    color: "#2ED3B7",
    fontWeight: 600
  }
}

export default Marketplace
