import { useEffect, useState } from "react";
import { ethers } from "ethers";

const INFURA_API = "https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY"; 

const useTransactionTracker = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const backendWallet = localStorage.getItem("walletAdrress");

  useEffect(() => {
    if (!backendWallet) {
      console.warn("No backend wallet found in localStorage");
      return;
    }

    const provider = new ethers.JsonRpcProvider(INFURA_API);

    // Track Incoming Transactions (Deposits)
    provider.on("pending", async (txHash) => {
      try {
        const tx = await provider.getTransaction(txHash);
        if (tx && tx.to && tx.to.toLowerCase() === backendWallet.toLowerCase()) {
          // console.log("Deposit detected:", tx);
          setTransactions((prev) => [...prev, { ...tx, type: "Deposit" }]);
        }
      } catch (error) {
        console.error("Error tracking deposit:", error);
      }
    });

    // Track Outgoing Transactions (Withdrawals)
    provider.on("block", async (blockNumber) => {
      try {
        const block = await provider.getBlockWithTransactions(blockNumber);
        const outgoingTxs = block.transactions.filter(
          (tx) => tx.from.toLowerCase() === backendWallet.toLowerCase()
        );

        if (outgoingTxs.length > 0) {
          // console.log("Withdrawal detected:", outgoingTxs);
          setTransactions((prev) => [
            ...prev,
            ...outgoingTxs.map((tx) => ({ ...tx, type: "Withdrawal" })),
          ]);
        }
      } catch (error) {
        console.error("Error tracking withdrawal:", error);
      }
    });

    return () => {
      provider.removeAllListeners();
    };
  }, [backendWallet]);

  return { transactions };
};

export default useTransactionTracker;
