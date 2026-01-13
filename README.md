# StakeFlow

StakeFlow is a liquid locked-staking protocol that allows users to earn higher yields through time-locked staking, while preserving liquidity via a secondary marketplace powered by NFTs.

Built for the Mantle Global Hackathon 2025.

---

## Problem

Staking protocols rely on user deposits to fund long-term financial operations.  
However, traditional staking presents a structural problem:

- Platforms cannot reliably predict how much liquidity will remain locked over time
- Users can withdraw capital at any moment, forcing protocols into short-term, low-risk strategies
- Long-term, higher-value financial decisions become risky or impossible

At the same time, users demand flexibility and liquidity, even when participating in long-term strategies.

---

## Solution

StakeFlow introduces **time-locked staking with transferable ownership**.

Users stake assets for a fixed period in exchange for higher rewards.  
In return, the staking position is represented by an **ERC-721 NFT**, which grants the right to claim the underlying stake once the lock period ends.

If a user needs liquidity before maturity, they can **sell their staking position** on a secondary marketplace by transferring the NFT to another user.

This creates:
- Predictable, long-term liquidity for protocols
- Flexibility and exit options for users
- A transparent, trustless transfer of staking rights

---

## How It Works

1. User locks assets in a staking contract for a fixed duration
2. An NFT representing the staking position is minted to the user’s wallet
3. The NFT can be:
   - Held until maturity to claim the stake
   - Listed on the marketplace and sold to another user
4. The NFT owner at maturity is the one entitled to claim the staked assets

---

## What Works Today

- Time-locked staking via smart contracts
- Automatic minting of ERC-721 NFTs representing staking positions
- NFT ownership determines staking claim rights
- Marketplace listing of staking positions
- Cross-wallet and cross-browser visibility of listed positions
- Off-chain listing logic powered by Supabase

---

## In Progress / Known Limitations

- **Marketplace purchase flow**  
  The final on-chain transaction for completing NFT purchases is currently under final integration (signature handling).

- **Token support**  
  Staking is currently limited to testnet tokens.  
  ERC-20 support on mainnet is planned.

- **Vault strategy**  
  The reward vault is currently pre-funded.  
  Yield-generating strategies for sustainable reward funding are part of the roadmap.

---

## Architecture

- **NFT Contract**  
  ERC-721 contract representing staking positions

- **Staking Vault Contract**  
  Manages locked assets, staking periods, and reward logic

- **Marketplace Contract**  
  Handles NFT listings and atomic transfers using off-chain signatures

---

## Tech Stack

- Frontend: React + Vite
- Smart Contracts: Solidity + Hardhat
- Blockchain: :contentReference[oaicite:0]{index=0}
- Wallet / Web3: ethers.js
- Backend / Sync Layer: Supabase

---

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Smart Contracts
```bash
cd contracts
npm install
npx hardhat test
```

### Hackathon Context
```bash
StakeFlow was developed under hackathon time constraints as a functional MVP.
The core architecture and design decisions already support the full staking lifecycle, including secondary market liquidity.
Further iterations will focus on completing the marketplace execution flow and expanding token support.
```