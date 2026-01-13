import { useState } from "react"
import { ethers } from "ethers"
import { useBalances } from "../web3/useBalances"
import { useStakingPositions } from "../web3/useStakingPositions"
import StakeModal from "../components/StakeModal"
import SellModal from "../components/SellModal"
import { STAKING_VAULT_ABI } from "../web3/abis/StakingVaultABI"
import toast from "react-hot-toast"

// Mantle Sepolia
const VAULT_ADDRESS = "0x3A822a83105CbeA806d6329A7D3AE18F5b8dC9ED"
const NFT_ADDRESS = "0xA7fB0e4c6d3Ddb563f15AAAce484Cb025A52f799"
const EXPLORER_BASE = "https://sepolia.mantlescan.xyz/token"

/* ───────── Helpers ───────── */

function getAPY(days) {
  if (days >= 365) return 9
  if (days >= 180) return 7
  if (days >= 90) return 6
  if (days >= 30) return 5
  return 3
}

function getLockDays(start, unlock) {
  return Math.round((unlock - start) / 86400)
}

function isTokenListed(userAddress, tokenId) {
  const data = JSON.parse(
    localStorage.getItem("stakeflow_orders") || "{}"
  )
  const orders = data[userAddress] || []

  return orders.some(
    o =>
      o.order.tokenId === tokenId.toString() &&
      o.status === "LISTED"
  )
}

import { supabase } from "../web3/supabaseClient"

export async function cancelListing(userAddress, tokenId) {
  const { error } = await supabase
    .from("orders")
    .update({ status: "CANCELLED" })
    .eq("seller", userAddress)
    .eq("token_id", tokenId)
    .eq("status", "LISTED")

  if (error) {
    console.error("Cancel listing failed:", error)
    throw error
  }

  return true
}

/* ───────── Component ───────── */

export default function Dashboard({ wallet }) {
  const [showStake, setShowStake] = useState(false)
  const [sellTokenId, setSellTokenId] = useState(null)
  const [claimingId, setClaimingId] = useState(null)

  const { ethBalance } = useBalances(wallet?.address)
  const { positions, loading } = useStakingPositions(wallet?.address)

  async function handleClaim(tokenId) {
    try {
      if (!wallet?.signer) return

      const contract = new ethers.Contract(
        VAULT_ADDRESS,
        STAKING_VAULT_ABI,
        wallet.signer
      )

      setClaimingId(tokenId)
      const tx = await contract.claim(tokenId)
      await tx.wait()
    } catch (err) {
      console.error("Claim failed:", err)
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <div style={styles.page}>
      {/* ───────── HEADER ───────── */}
      <div style={styles.dashboardHeader}>
        <div style={styles.balanceAndAction}>
          <div style={styles.balanceGroup}>
            <div style={styles.balanceLabel}>MNT Balance</div>
            <div style={styles.balanceValue}>
              {ethBalance ? Number(ethBalance).toFixed(4) : "—"}
            </div>
          </div>

          <button
            style={styles.stakeButton}
            onClick={() => setShowStake(true)}
          >
            Stake
          </button>
        </div>
      </div>

      {/* ───────── MODALS ───────── */}
      {showStake && (
        <StakeModal
          wallet={wallet}
          onClose={() => setShowStake(false)}
        />
      )}

      {sellTokenId !== null && (
        <SellModal
          wallet={wallet}
          tokenId={sellTokenId}
          onSuccess={() => {
            toast.success("NFT listed. Refresh to see changes.")
          }}
          onClose={() => setSellTokenId(null)}
        />

      )}

      {/* ───────── STATES ───────── */}
      {loading && (
        <div style={styles.empty}>Loading positions…</div>
      )}

      {!loading && positions.length === 0 && (
        <div style={styles.empty}>No staking positions yet.</div>
      )}

      {/* ───────── TABLE ───────── */}
      {positions.length > 0 && (
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <div>ID</div>
            <div>Asset</div>
            <div>Amount</div>
            <div>Staked on</div>
            <div>Lock</div>
            <div>Est. Rewards</div>
            <div>Status</div>
            <div />
          </div>

          {positions.map(p => {
            const lockDays = getLockDays(p.startTime, p.unlockTime)
            const apy = getAPY(lockDays)
            const estRewards =
              (Number(p.amount) * apy * lockDays) /
              365 /
              100

            const isClaimable =
              !p.claimed &&
              Date.now() / 1000 >= p.unlockTime

            const listed = isTokenListed(
              wallet.address,
              p.tokenId
            )

            {p.isListed
              ? "LISTED"
              : p.claimed
              ? "Claimed"
              : Date.now() / 1000 >= p.unlockTime
              ? "Claimable"
              : "Active"}

            return (
              <div key={p.tokenId} style={styles.row}>
                <div style={styles.tokenId}>
                  #{p.tokenId}
                  <a
                    href={`${EXPLORER_BASE}/${NFT_ADDRESS}?a=${p.tokenId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.explorerLink}
                  >
                    View
                  </a>
                </div>

                <div>MNT</div>
                <div>{Number(p.amount).toFixed(4)}</div>

                <div>
                  {new Date(
                    p.startTime * 1000
                  ).toLocaleDateString()}
                </div>

                <div>{lockDays} days</div>

                <div style={styles.accent}>
                  {estRewards.toFixed(4)}
                </div>

                  <div>
                    {p.claimed
                      ? "CLAIMED"
                      : p.isListed
                      ? "LISTED"
                      : Date.now() / 1000 >= p.unlockTime
                      ? "CLAIMABLE"
                      : "ACTIVE"}
                  </div>

                <div style={styles.actionButtons}>
                  <button
                    style={{
                      ...styles.claimButton,
                      ...(isClaimable && !listed
                        ? {}
                        : styles.disabledButton)
                    }}
                    disabled={
                      !isClaimable ||
                      listed ||
                      claimingId === p.tokenId
                    }
                    onClick={() => handleClaim(p.tokenId)}
                  >
                    {p.claimed
                      ? "Claimed"
                      : claimingId === p.tokenId
                      ? "Claiming…"
                      : isClaimable
                      ? "Claim"
                      : "Locked"}
                  </button>

                  {p.isListed ? (
                    <button
                      style={styles.undoButton}
                      onClick={() => {
                        cancelListing(wallet.address, p.tokenId)
                        toast.success(
                          "Listing cancelled. Refresh the page to update the dashboard state."
                        )
                      }}
                    >
                      Undo Sell
                    </button>
                  ) : (
                    <button
                      style={styles.sellButton}
                      onClick={() => setSellTokenId(p.tokenId)}
                    >
                      Sell
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ───────── INFO SECTION ───────── */}
      <div style={styles.infoSection}>
        <p>
          <strong>Smart contracts used by Stakeflow:</strong><br />
          The Vault contract manages locked assets and reward distribution.
          Each staking position is represented by an NFT, which can later
          be claimed or listed for sale on the marketplace.
        </p>

        <p>
          <strong>Estimated APY:</strong><br />
          Rewards shown in the dashboard are calculated off-chain using
          the same tiered APY logic defined in the smart contracts.
          Final rewards are always computed and enforced on-chain.
        </p>

        <div style={styles.contracts}>
          <div>Vault: {VAULT_ADDRESS}</div>
          <div>NFT: {NFT_ADDRESS}</div>
          <div>Marketplace: 0x3458383B0063282a86B5Ad8e26F03799AAbc4574</div>
        </div>
      </div>
    </div>
  )
}

/* ───────── Styles ───────── */

const styles = {
  page: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    color: "#ffffff"
  },

  dashboardHeader: {
    background: "rgba(0,0,0,0.35)",
    padding: "24px",
    borderRadius: "16px"
  },

  balanceAndAction: {
    display: "flex",
    alignItems: "center",
    gap: "32px"
  },

  balanceGroup: {
    display: "flex",
    flexDirection: "column"
  },

  balanceLabel: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)",
    marginBottom: "6px"
  },

  balanceValue: {
    fontSize: "40px",
    fontWeight: 700
  },

  stakeButton: {
    background: "linear-gradient(180deg, #2ED3B7, #1FA293)",
    border: "none",
    padding: "14px 36px",
    borderRadius: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "16px"
  },

  empty: {
    marginTop: "80px",
    opacity: 0.5,
    fontSize: "16px"
  },

  table: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.03)"
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns:
      "90px 1fr 1fr 1.4fr 1fr 1.4fr 1fr 200px",
    padding: "16px 20px",
    fontSize: "13px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "90px 1fr 1fr 1.4fr 1fr 1.4fr 1fr 200px",
    padding: "18px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: "16px",
    alignItems: "center"
  },

  tokenId: {
    fontWeight: 600,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  explorerLink: {
    fontSize: "11px",
    color: "var(--accent)",
    textDecoration: "none"
  },

  accent: {
    color: "var(--accent)",
    fontWeight: 600
  },

  actionButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end"
  },

  claimButton: {
    background: "linear-gradient(180deg, #2ED3B7, #1FA293)",
    border: "none",
    color: "#000",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px"
  },

  sellButton: {
    background: "linear-gradient(180deg, #E55353, #C0392B)",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px"
  },

  undoButton: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px"
  },

  disabledButton: {
    opacity: 0.45,
    cursor: "not-allowed"
  },

  infoSection: {
    marginTop: "48px",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.75)",
    maxWidth: "900px"
  },

  contracts: {
    marginTop: "16px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  }
}
