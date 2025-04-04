import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "../components/Toast/Toast";

const useWallet = () => {
   const { showToast } = useToast();
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      showToast("MetaMask not detected!","error")
      return;
    }
    
    // console.log(window.ethereum);

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance)); // Convert balance from wei to ETH
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return { account, balance, connectWallet };
};

export default useWallet;
