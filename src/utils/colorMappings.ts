export const chainColorMap: Record<string, string> = {
  "eip155:56": "bg-yellow-600", // Binance Smart Chain - BSC often uses yellow or gold
  "eip155:100": "bg-teal-600", // Gnosis Chain - Gnosis often uses a teal or turquoise
  "eip155:137": "bg-purple-700", // Polygon - Polygon (formerly Matic) commonly uses purple
  "bip122:000000000019d6689c085ae165831e93": "bg-yellow-600", // Bitcoin - Bitcoin is commonly associated with gold or yellow
  "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ": "bg-orange-500", // Solana - Solana uses orange in its branding
  "eip155:8453": "bg-gray-400", // Base Mainnet - A generic gray for lesser-known chains
  "eip155:42161": "bg-green-500", // Arbitrum One - Arbitrum uses green in some of its branding
  "eip155:1284": "bg-indigo-500", // Moonbeam - A shade of blue
  "eip155:59144": "bg-gray-500", // Linea - A generic gray for lesser-known chains
  "eip155:10": "bg-blue-300", // Optimism - Using a lighter blue
  "eip155:250": "bg-green-700", // Fantom Opera - Fantom uses a darker green in its branding
  "eip155:1285": "bg-indigo-600", // Moonriver - Being related to Moonbeam, can use a shade of indigo
  "eip155:43114": "bg-red-600", // Avalanche C-Chain - Avalanche branding often has red
  "eip155:25": "bg-green-400", // Cronos Mainnet - A lighter shade of green
  "eip155:199": "bg-red-500", // BitTorrent Chain Mainnet - BitTorrent's primary color is red
  "eip155:1101": "bg-purple-500", // Polygon zkEVM - Slightly lighter shade of Polygon's purple
  "eip155:1111": "bg-gray-600", // WEMIX3.0 Mainnet - A darker generic gray for differentiation
  "eip155:534352": "bg-gray-700", // Scroll - Another shade of gray to differentiate
  "eip155:42220": "bg-green-600", // Celo - Celo uses green in its branding
  "eip155:1": "bg-blue-500", // Ethereum Mainnet - Ethereum's color is commonly a shade of blue
};

export const statusColorMap: Record<string, string> = {
  Registered: "bg-green-500",
  RegistrationRequested: "bg-orange-500",
  ClearingRequested: "bg-yellow-500",
  Absent: "bg-gray-500",
};
