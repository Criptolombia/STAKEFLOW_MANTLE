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

## Deployment Instructions

This section explains how to deploy and run the project locally, including smart contracts and frontend setup.

---

### Prerequisites

Make sure you have the following installed and configured:

- Node.js >= 18
- npm or yarn
- MetaMask browser extension
- Mantle Sepolia testnet added to MetaMask
- Supabase account (free tier is sufficient)

---

### Network Configuration

This project runs on **Mantle Sepolia Testnet**.

- **Chain ID:** 5003  
- **Currency:** MNT  
- **RPC URL:** https://rpc.sepolia.mantle.xyz  
- **Block Explorer:** https://sepolia.mantlescan.xyz  

Ensure your wallet is connected to Mantle Sepolia before interacting with the app.

---

### Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
## Deployment Instructions
```

This section explains how to deploy and run the project locally, including smart contracts and frontend setup.

---

### Prerequisites

Make sure you have the following installed and configured:

- Node.js >= 18
- npm or yarn
- MetaMask browser extension
- Mantle Sepolia testnet added to MetaMask
- Supabase account (free tier is sufficient)

---

### Network Configuration

This project runs on **Mantle Sepolia Testnet**.

- **Chain ID:** 5003  
- **Currency:** MNT  
- **RPC URL:** https://rpc.sepolia.mantle.xyz  
- **Block Explorer:** https://sepolia.mantlescan.xyz  

Ensure your wallet is connected to Mantle Sepolia before interacting with the app.

---

### Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


These values can be obtained from your Supabase project settings.

### Smart Contract Deployment

Smart contracts are deployed using Hardhat.
Contracts are already deployed on Mantle Sepolia, but the steps below allow redeployment if needed.

cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network mantleSepolia

After deployment, update the contract addresses in:

src/web3/contracts.js

src/web3/abis/

## Compliance Declaration

This project was developed exclusively for educational and hackathon purposes.

The authors declare that:

- The codebase is original work or uses open-source libraries under compatible licenses.
- The project does not intentionally violate any applicable laws or regulations.
- No custodial control over user funds is exercised at any point; all interactions are executed directly via smart contracts.
- The platform does not guarantee profits, yields, or financial returns of any kind.
- Users interact with the protocol at their own risk and responsibility.
- No personal user data is collected, stored, or processed beyond publicly available blockchain data.
- The project is not intended for production use in its current form.

All smart contracts and frontend components are provided "as is" without warranty of any kind.