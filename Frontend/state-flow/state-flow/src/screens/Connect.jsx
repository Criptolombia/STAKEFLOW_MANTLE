import { useState } from "react"
import { motion } from "framer-motion"
import { slide } from "../animations"
import { connectWallet } from "../web3/connectWallet"

function Connect({ setScreen, setWallet }) {
  const [connecting, setConnecting] = useState(false)

  return (
    <motion.div
      initial={slide.initial}
      animate={slide.animate}
      exit={slide.exit}
      transition={slide.transition}
      style={styles.container}
    >
      {/* 20% */}
      <h1 style={styles.title}>Stakeflow</h1>

      {/* 50% */}
      <p style={styles.description}>
        Stakeflow is a liquid staking protocol designed to let positions move
        freely between participants, without breaking yield continuity or lock
        conditions.
      </p>

      {/* espacio */}
      <div />

      {/* 80% */}
      <button
        style={{
          ...styles.cta,
          opacity: connecting ? 0.6 : 1,
          cursor: connecting ? "not-allowed" : "pointer"
        }}
        disabled={connecting}
        onClick={async () => {
          if (connecting) return

          setConnecting(true)

          try {
            const wallet = await connectWallet()
            setWallet(wallet)
            setScreen("DASHBOARD")
          } catch (err) {
            if (err?.code === 4001) {
              // Usuario cerró o rechazó MetaMask → UX normal
              console.log("User rejected connection")
            } else if (err?.code === -32002) {
              alert(
                "MetaMask is already processing a connection request. Please open MetaMask and finish or cancel it."
              )
            } else {
              alert(err?.message || "Failed to connect wallet")
            }
          } finally {
            // 🔒 siempre liberamos el lock
            setConnecting(false)
          }
        }}
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {/* 90% */}
      <div style={styles.faqSection}>
        <h3 style={styles.faqTitle}>FAQ</h3>

        <details style={styles.faqItem}>
          <summary>What is Stakeflow?</summary>
          <p>
            Stakeflow allows staking positions to be transferred or sold without
            exiting the underlying staking protocol.
          </p>
        </details>

        <details style={styles.faqItem}>
          <summary>Can I exit before the lock period?</summary>
          <p>
            Positions can be sold on the marketplace, allowing liquidity without
            breaking the lock.
          </p>
        </details>

        <details style={styles.faqItem}>
          <summary>Who is this protocol for?</summary>
          <p>
            Designed for users and organizations that require predictable yield
            with flexible liquidity.
          </p>
        </details>
      </div>
      <div style={styles.footerInfo}>
        Built on Mantle · Non-custodial protocol
      </div>
    </motion.div>
  )
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "grid",
    gridTemplateRows: "20% 30% 10% 20% 20%",
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
    padding: "0 24px"
  },
  title: {
    fontSize: "80px",        // ⬆ más presencia
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#F9FAFB"         // blanco limpio
  },
  description: {
    maxWidth: "760px",
    fontSize: "30px",        // ⬆ más legible
    lineHeight: 1.9,
    color: "#E5E7EB"         // blanco suave, no gris oscuro
  },
  cta: {
    background: "linear-gradient(180deg, #2ED3B7 0%, #1FA293 100%)",
    color: "#041B17",
    padding: "16px 44px",
    fontSize: "17px",
    fontWeight: 600,
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 8px 24px rgba(46, 211, 183, 0.25)"
  },
  faqSection: {
    width: "100%",
    maxWidth: "720px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left"
  },
  faqTitle: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "12px",
    color: "#ffffff"
  },
  faqItem: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "12px",
    padding: "16px 20px",
    border: "1px solid rgba(46, 211, 183, 0.25)",
    color: "#ffffff"
  },
    footerInfo: {
    position: "absolute",
    bottom: "24px",
    left: "32px",
    fontSize: "14px",
    letterSpacing: "0.02em",
    color: "rgba(255, 255, 255, 0.55)",
    userSelect: "none"
    },
}

export default Connect
