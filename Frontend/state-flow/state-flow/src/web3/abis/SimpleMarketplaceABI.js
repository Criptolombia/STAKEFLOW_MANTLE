export const MARKETPLACE_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "seller", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "address", "name": "paymentToken", "type": "address" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "uint256", "name": "expiry", "type": "uint256" },
          { "internalType": "uint256", "name": "nonce", "type": "uint256" }
        ],
        "internalType": "struct SimpleMarketplace.Order",
        "name": "order",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "buyWithSignature",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]
