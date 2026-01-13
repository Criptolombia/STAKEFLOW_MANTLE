import { ethers } from "ethers"

// Mantle Sepolia
export const CHAIN_ID = 5003

export const VAULT_ADDRESS =
  "0x3A822a83105CbeA806d6329A7D3AE18F5b8dC9ED"

export const NFT_ADDRESS =
  "0xA7fB0e4c6d3Ddb563f15AAAce484Cb025A52f799"

// ⚠️ PON AQUÍ la dirección real del MNT cuando la tengas
export const MNT_TOKEN_ADDRESS =
  "0x0000000000000000000000000000000000000000"

// ABI mínimo ERC20 (solo balance)
export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
]

export const VAULT_ABI = [
  "function stake(uint8 asset, uint256 amount, uint256 lockDuration) payable"
]

export const VAULT_EVENTS_ABI = [
  "event Staked(address indexed user, uint256 indexed tokenId, uint8 asset, uint256 amount, uint256 unlockTime)",
  "function positions(uint256) view returns (uint8 asset, uint256 amount, uint256 startTime, uint256 unlockTime, bool claimed)"
]