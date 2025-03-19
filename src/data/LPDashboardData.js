// interface Pool {
//   id: string
//   token1: string
//   token2: string
//   chain: string
//   protocol: string
//   value: string
//   apy: number
//   il: number
//   earnings: string
// }

// interface Reward {
//   protocol: string
//   chain: string
//   name: string
//   rate: string
//   claimable: string
//   value: string
// }

// interface LPDashboardData {
//   overview: {
//     tvl: string
//     tvlChange: number
//     earnings: string
//     earningsChange: number
//     avgApy: number
//     apyChange: number
//     impermanentLoss: number
//     ilChange: number
//   }
//   pools: Pool[]
//   rewards: Reward[]
// }

export const lpDashboardData = {
  overview: {
    tvl: "124,580",
    tvlChange: 8.2,
    earnings: "3,245",
    earningsChange: 12.5,
    avgApy: 18.4,
    apyChange: 2.1,
    impermanentLoss: 1.8,
    ilChange: 0.4,
  },
  pools: [
    {
      id: "p1",
      token1: "ETH",
      token2: "USDC",
      chain: "Ethereum",
      protocol: "Uniswap V3",
      value: "42,500",
      apy: 12.8,
      il: 1.2,
      earnings: "+$245.80",
    },
    {
      id: "p2",
      token1: "WBTC",
      token2: "ETH",
      chain: "Ethereum",
      protocol: "Curve",
      value: "28,750",
      apy: 8.4,
      il: 2.1,
      earnings: "+$120.45",
    },
    {
      id: "p3",
      token1: "ARB",
      token2: "ETH",
      chain: "Arbitrum",
      protocol: "SushiSwap",
      value: "15,200",
      apy: 24.6,
      il: 3.8,
      earnings: "+$185.30",
    },
    {
      id: "p4",
      token1: "USDC",
      token2: "USDT",
      chain: "Optimism",
      protocol: "Velodrome",
      value: "18,400",
      apy: 6.2,
      il: 0.3,
      earnings: "+$58.20",
    },
    {
      id: "p5",
      token1: "OP",
      token2: "ETH",
      chain: "Optimism",
      protocol: "Uniswap V3",
      value: "8,750",
      apy: 18.9,
      il: 2.8,
      earnings: "+$82.40",
    },
    {
      id: "p6",
      token1: "SOL",
      token2: "USDC",
      chain: "Solana",
      protocol: "Raydium",
      value: "10,980",
      apy: 15.2,
      il: 1.9,
      earnings: "+$84.60",
    },
  ],
  rewards: [
    {
      protocol: "Uniswap",
      chain: "Ethereum",
      name: "ETH-USDC Fee Rewards",
      rate: "0.08 ETH",
      claimable: "0.24 ETH",
      value: "580",
    },
    {
      protocol: "Curve",
      chain: "Ethereum",
      name: "CRV Emissions",
      rate: "12.5 CRV",
      claimable: "87.5 CRV",
      value: "120",
    },
    {
      protocol: "Velodrome",
      chain: "Optimism",
      name: "VELO Rewards",
      rate: "45 VELO",
      claimable: "315 VELO",
      value: "95",
    },
    {
      protocol: "Arbitrum",
      chain: "Arbitrum",
      name: "ARB Incentives",
      rate: "8.2 ARB",
      claimable: "57.4 ARB",
      value: "75",
    },
  ],
}

