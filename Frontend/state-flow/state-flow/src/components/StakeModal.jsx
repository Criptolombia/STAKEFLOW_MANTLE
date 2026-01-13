import { useState } from "react"
import { ethers } from "ethers"
import { VAULT_ADDRESS } from "../web3/contracts"
import { VAULT_ABI } from "../web3/contracts"

const LOCK_OPTIONS = [
  { label: "30 days", days: 30, apy: 5 },
  { label: "90 days", days: 90, apy: 6 },
  { label: "180 days", days: 180, apy: 7 },
  { label: "365 days", days: 365, apy: 9 }
]

function StakeModal({ onClose,wallet }) {
  const [amount, setAmount] = useState("")
  const [lock, setLock] = useState(LOCK_OPTIONS[0])

  const parsedAmount = parseFloat(amount) || 0
  const reward =
    parsedAmount * (lock.apy / 100) * (lock.days / 365)


    async function handleStake() {
    try {
        const signer = wallet.signer

        const vault = new ethers.Contract(
        VAULT_ADDRESS,
        VAULT_ABI,
        signer
        )

        const amountWei = ethers.parseEther(amount)
        const lockDuration = lock.days * 24 * 60 * 60

        const tx = await vault.stake(
        0, // Asset.ETH
        amountWei,
        lockDuration,
        { value: amountWei }
        )

        await tx.wait()

        onClose()
        } catch (err) {
            console.error("Stake failed:", err)
            alert("Stake transaction failed")
        }
    }  
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Stake MNT</h2>

        {/* Amount */}
        <label style={styles.label}>Amount</label>
        <input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={styles.input}
        />

        {/* Lock duration */}
        <label style={styles.label}>Lock duration</label>
        <select
          value={lock.label}
          onChange={e =>
            setLock(
              LOCK_OPTIONS.find(o => o.label === e.target.value)
            )
          }
          style={styles.select}
        >
          {LOCK_OPTIONS.map(o => (
            <option key={o.label} value={o.label}>
              {o.label} — {o.apy}% APY
            </option>
          ))}
        </select>

        {/* Summary */}
        <div style={styles.summary}>
          <div>
            <span>APY</span>
            <strong>{lock.apy}%</strong>
          </div>
          <div>
            <span>Estimated reward</span>
            <strong>
              {reward > 0 ? reward.toFixed(4) : "—"} MNT
            </strong>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.confirm}
            disabled={!parsedAmount}
            onClick={handleStake}
            >
            Confirm Stake
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
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50
  },

  modal: {
    background: "#0B0F14",
    borderRadius: "18px",
    padding: "36px",
    width: "440px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    color: "#ffffff",
    fontFamily: "inherit"
  },

  title: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "4px",
    color: "#ffffff"
  },

  label: {
    fontSize: "14px",
    opacity: 0.8,
    color: "#ffffff"
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #1F2933",
    background: "rgba(255,255,255,0.02)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none"
  },

  select: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #1F2933",
    background: "rgba(255,255,255,0.02)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    appearance: "none"
  },

  summary: {
    marginTop: "16px",
    padding: "18px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px"
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "14px",
    marginTop: "18px"
  },

  cancel: {
    background: "transparent",
    border: "1px solid #374151",
    padding: "12px 22px",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "15px",
    cursor: "pointer"
  },

  confirm: {
    background: "linear-gradient(180deg, #2ED3B7, #1FA293)",
    border: "none",
    padding: "12px 22px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    color: "#0B0F14"
  }
}


export default StakeModal
