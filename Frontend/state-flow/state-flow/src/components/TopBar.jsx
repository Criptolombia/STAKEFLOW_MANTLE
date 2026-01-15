import { useState } from "react"

import DashboardIcon from "../assets/icons/Dashboard.svg"
import MarketplaceIcon from "../assets/icons/Marketplace.svg"
import AboutIcon from "../assets/icons/About.svg"

function TopBar({ wallet, setWallet, setScreen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shortAddress = wallet
    ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`
    : null

  return (
    <div style={styles.bar}>
      {/* LEFT */}
      <div style={styles.left}>
        <span style={styles.logo}>Stakeflow</span>
      </div>

      {/* CENTER */}
      <div style={styles.center}>
        <button
          style={styles.navButton}
          disabled={!wallet}
          onClick={() => setScreen("DASHBOARD")}
        >
          <img src={DashboardIcon} style={styles.icon} />
          Dashboard
        </button>

        <button
          style={styles.navButton}
          disabled={!wallet}
          onClick={() => setScreen("MARKETPLACE")}
        >
          <img src={MarketplaceIcon} style={styles.icon} />
          Marketplace
        </button>

        <button style={styles.navButton}>
      
          
        </button>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        {wallet ? (
          <div style={{ position: "relative" }}>
            <button
              style={styles.walletButton}
              onClick={() => setMenuOpen(v => !v)}
            >
              {shortAddress}
            </button>

            {menuOpen && (
              <div style={styles.dropdown}>
                <button
                  style={styles.dropdownItem}
                  onClick={() => {
                    window.open(
                      `https://explorer.mantle.xyz/address/${wallet.address}`,
                      "_blank"
                    )
                    setMenuOpen(false)
                  }}
                >
                  View on Explorer
                </button>

                <button
                  style={styles.dropdownItem}
                  onClick={() => {
                    navigator.clipboard.writeText(wallet.address)
                    setCopied(true)
                    setMenuOpen(false)
                    setTimeout(() => setCopied(false), 1500)
                  }}
                >
                  Copy Address
                </button>

                <div style={styles.separator} />

                <button
                  style={{ ...styles.dropdownItem, color: "#EF4444" }}
                  onClick={() => {
                    setMenuOpen(false)
                    setWallet(null)
                    setScreen("HOME")
                  }}
                >
                  Logout
                </button>
              </div>
            )}

            {copied && <div style={styles.toast}>Wallet copied</div>}
          </div>
        ) : (
          <span style={styles.disconnected}>Not connected</span>
        )}
      </div>
    </div>
  )
}

const styles = {
  bar: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    background: "rgba(10,11,13,0.85)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)"
  },
  left: {
    display: "flex",
    alignItems: "center"
  },
  center: {
    display: "flex",
    gap: "28px"
  },
  right: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    fontSize: "24px",   // ⬆ antes 18
    fontWeight: 700,
    color: "#F9FAFB"
  },
  navButton: {
    background: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#F9FAFB",
    fontSize: "14px",   // ⬆ antes 14px
    fontWeight: 600,
    cursor: "pointer",
    opacity: 0.95
  },
  icon: {
    width: 32,          // ⬆ antes 16
    height: 32,
    filter: "brightness(0) invert(1)",
    opacity: 0.95
  },
  walletButton: {
    background: "rgba(46,211,183,0.15)",
    border: "1px solid rgba(46,211,183,0.35)",
    color: "#E6FFFA",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer"
  },
  dropdown: {
    position: "absolute",
    top: "48px",
    right: 0,
    background: "rgba(17,19,23,0.98)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    zIndex: 20
  },
  dropdownItem: {
    background: "none",
    border: "none",
    padding: "12px 16px",
    textAlign: "left",
    color: "#F9FAFB",
    fontSize: "13px",
    cursor: "pointer"
  },
  separator: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "4px 0"
  },
  toast: {
    position: "absolute",
    top: "48px",
    right: 0,
    marginTop: "8px",
    background: "rgba(46,211,183,0.18)",
    color: "#E6FFFA",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    border: "1px solid rgba(46,211,183,0.35)"
  },
  disconnected: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)"
  }
}

export default TopBar
