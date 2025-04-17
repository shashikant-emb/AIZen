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
