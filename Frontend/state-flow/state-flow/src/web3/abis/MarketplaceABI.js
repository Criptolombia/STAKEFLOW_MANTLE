export const MARKETPLACE_DOMAIN = {
  name: "SimpleMarketplace",
  version: "1",
  chainId: 5003, // Mantle Sepolia
  verifyingContract: "0x3458383B0063282a86B5Ad8e26F03799AAbc4574"
}

export const ORDER_TYPES = {
  Order: [
    { name: "seller", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "paymentToken", type: "address" },
    { name: "price", type: "uint256" },
    { name: "expiry", type: "uint256" },
    { name: "nonce", type: "uint256" }
  ]
}
