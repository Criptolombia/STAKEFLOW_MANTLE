import { useEffect, useState } from "react"
import { supabase } from "../web3/supabaseClient"
import { buyOrder } from "../web3/marketplaceBuy"

function Marketplace({ wallet, setScreen }) {
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
      console.error("Failed to load listings:", error)
      setLoading(false)
      return
    }

    const mine = []
    const others = []

    data.forEach(l => {
      if (l.seller.toLowerCase() === wallet.address.toLowerCase()) {
        mine.push(l)
      } else {
        others.push(l)
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

  console.log("MARKETPLACE WALLET:", wallet)
  return (
    <div style={styles.page}>
      {/* 🔹 MIS LISTINGS */}
      <h2 style={styles.sectionTitle}>My Listings</h2>

      {myListings.length === 0 && (
        <div style={styles.empty}>No active listings.</div>
      )}

      {myListings.length > 0 && (
        <div style={styles.table}>
          {myListings.map(l => (
            <div key={l.token_id} style={styles.row}>
              <div>#{l.token_id}</div>
              <div>{Number(l.price) / 1e18} MNT</div>
              <div>
                {Math.max(
                  0,
                  Math.floor((l.expiry - Date.now() / 1000) / 3600)
                )}h left
              </div>
              <div style={styles.listed}>Listed</div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 OTROS LISTINGS */}
      <h2 style={styles.sectionTitle}>Available Listings</h2>

      {otherListings.length === 0 && (
        <div style={styles.empty}>No listings available.</div>
      )}

      {otherListings.length > 0 && (
        <div style={styles.table}>
          {otherListings.map(l => (
            <div key={l.token_id} style={styles.row}>
              <div>#{l.token_id}</div>
              <div>{Number(l.price) / 1e18} MNT</div>
              <div>
                {Math.max(
                  0,
                  Math.floor((l.expiry - Date.now() / 1000) / 3600)
                )}h left
              </div>

              <button
                style={styles.buyButton}
                onClick={() =>
                  buyOrder({
                    wallet,
                    order: {
                      seller: l.seller,
                      tokenId: l.token_id,
                      paymentToken: "0x0000000000000000000000000000000000000000",
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

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 120px",
    padding: "16px 20px",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "#fff"
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
