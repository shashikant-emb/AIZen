// import { useEffect, useState } from "react";
// import { BigNumber, ethers } from "ethers";
// import { useProvider } from "wagmi";

// interface MaxWithdrawResult {
//   maxWithdrawable: BigNumber | null;
//   formatted: string | null;
//   isLoading: boolean;
//   error?: string | null;
// }

// export const useMaxWithdrawableAmount = (
//   walletAddress: `0x${string}` | undefined,
//   walletBalance: BigNumber | null
// ): MaxWithdrawResult => {
//   const provider = useProvider();
//   const [maxWithdrawable, setMaxWithdrawable] = useState<BigNumber | null>(null);
//   const [formatted, setFormatted] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const calculateMaxWithdraw = async () => {
//       if (!walletAddress || !walletBalance) return;

//       setIsLoading(true);
//       setError(null);

//       try {
//         const gasPrice = await provider.getGasPrice();
//         const gasLimit = BigNumber.from(21000); // standard ETH transfer
//         const gasCost = gasLimit.mul(gasPrice);

//         if (walletBalance.lte(gasCost)) {
//           setMaxWithdrawable(BigNumber.from(0));
//           setFormatted("0");
//         } else {
//           const withdrawable = walletBalance.sub(gasCost);
//           setMaxWithdrawable(withdrawable);
//           setFormatted(ethers.utils.formatEther(withdrawable));
//         }
//       } catch (err: any) {
//         setError(err.message);
//         setMaxWithdrawable(null);
//         setFormatted(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     calculateMaxWithdraw();
//   }, [walletAddress, walletBalance, provider]);

//   return { maxWithdrawable, formatted, isLoading, error };
// };

// import { useEffect, useState } from "react";
// import { formatEther, parseEther } from "viem";
// import { usePublicClient } from "wagmi";
// import { Address } from "wagmi";

// interface MaxWithdrawResult {
//   maxWithdrawable: bigint | null;
//   formatted: string | null;
//   isLoading: boolean;
//   error?: string | null;
// }

// export const useMaxWithdrawableAmount = (
//   walletAddress: Address | undefined,
//   walletBalance: bigint | null
// ): MaxWithdrawResult => {
//   const publicClient = usePublicClient();
//   const [maxWithdrawable, setMaxWithdrawable] = useState<bigint | null>(null);
//   const [formatted, setFormatted] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const calculate = async () => {
//       if (!walletAddress || walletBalance === null) return;
//       setIsLoading(true);
//       setError(null);

//       try {
//         const gasPrice = await publicClient.getGasPrice();
//         const gasLimit = BigInt(21000); // standard ETH transfer
//         const gasCost = gasLimit * gasPrice;

//         if (walletBalance <= gasCost) {
//           setMaxWithdrawable(0n);
//           setFormatted("0");
//         } else {
//           const max = walletBalance - gasCost;
//           setMaxWithdrawable(max);
//           setFormatted(formatEther(max));
//         }
//       } catch (err: any) {
//         setError(err.message);
//         setMaxWithdrawable(null);
//         setFormatted(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     calculate();
//   }, [walletAddress, walletBalance]);

//   return { maxWithdrawable, formatted, isLoading, error };
// };

// import { useEffect, useState } from "react";
// import { formatEther } from "viem";
// import { usePublicClient } from "wagmi";

// type Address = `0x${string}`;

// interface MaxWithdrawResult {
//   maxWithdrawable: bigint | null;
//   formatted: string | null;
//   isLoading: boolean;
//   error?: string | null;
// }

// export const useMaxWithdrawableAmount = (
//   walletAddress: Address | undefined,
//   walletBalance: bigint | null
// ): MaxWithdrawResult => {
//   const publicClient = usePublicClient();
//   const [maxWithdrawable, setMaxWithdrawable] = useState<bigint | null>(null);
//   const [formatted, setFormatted] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const calculate = async () => {
//       if (!walletAddress || walletBalance === null || !publicClient) return;

//       setIsLoading(true);
//       setError(null);

//       try {
//         const gasPrice = await publicClient.getGasPrice();
//         const gasLimit = BigInt(21000); // Standard ETH transfer
//         const gasCost = gasLimit * gasPrice;

//         if (walletBalance <= gasCost) {
//           setMaxWithdrawable(0n);
//           setFormatted("0");
//         } else {
//           const max = walletBalance - gasCost;
//           setMaxWithdrawable(max);
//           setFormatted(formatEther(max));
//         }
//       } catch (err: any) {
//         setError(err.message || "Error fetching gas");
//         setMaxWithdrawable(null);
//         setFormatted(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     calculate();
//   }, [walletAddress, walletBalance, publicClient]);

//   return { maxWithdrawable, formatted, isLoading, error };
// };

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { ethers } from "ethers";

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);

type Address = `0x${string}`;

interface MaxWithdrawResult {
  maxWithdrawable: bigint | null;
  formatted: string | null;
  isLoading: boolean;
  error?: string | null;
}

export const useMaxWithdrawableAmount = (
  walletAddress: Address | undefined,
  walletBalance: bigint | null
): MaxWithdrawResult => {
  const [maxWithdrawable, setMaxWithdrawable] = useState<bigint | null>(null);
  const [formatted, setFormatted] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculate = async () => {
      if (!walletAddress || walletBalance === null) return;

      setIsLoading(true);
      setError(null);

      try {
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice ?? ethers.toBigInt("10000000000"); // fallback: 10 Gwei
        const gasLimit = ethers.toBigInt(21000); // Standard ETH transfer
        const gasCost = gasLimit * gasPrice;

        if (walletBalance <= gasCost) {
          setMaxWithdrawable(0n);
          setFormatted("0");
        } else {
          const max = walletBalance - gasCost;
          setMaxWithdrawable(max);
          setFormatted(formatEther(max));
        }
      } catch (err: any) {
        setError(err.message || "Error fetching gas data");
        setMaxWithdrawable(null);
        setFormatted(null);
      } finally {
        setIsLoading(false);
      }
    };

    calculate();
  }, [walletAddress, walletBalance]);

  return { maxWithdrawable, formatted, isLoading, error };
};
