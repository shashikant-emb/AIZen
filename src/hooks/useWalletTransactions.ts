import { useAccount,useBalance, useDisconnect } from 'wagmi';
import { parseEther } from 'viem';
import { useToast } from '../components/Toast/Toast';
import { ethers } from 'ethers';
import { useReduxActions, useReduxSelectors } from './useReduxActions';
import { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { getWalletClient } from "@wagmi/core";
import { config } from '../wagmi';

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;


const useWalletTransactions = () => {
  const Navigate= useNavigate()
  const { showToast } = useToast();
  const [progress,setIsProgress]=useState(false)
  const { address: connectedWallet, isConnected } = useAccount();
   const { address } = useAccount();
    // const { data: balance } = useBalance({ address });
  const { auth } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const {userID, isAuthenticated, loading, error } = authSelectors
  // Get backend wallet details from localStorage
  const backendWallet = localStorage.getItem("wallet_address");
  const { disconnect } = useDisconnect();
  const depositETH = async (amount: string) => {

    setIsProgress(true)
    if (!isConnected || !connectedWallet || !backendWallet) {
      showToast("Please connect your wallet or check backend wallet details!", "error");
      return;
    }

    try {
      if (window.ethereum) {
        const walletClient = await getWalletClient(config);
        if (!walletClient) {
          console.error("Wallet client not found");
          showToast("Wallet client not found","error")
          return;
        }
        // const provider = new ethers.BrowserProvider(window.ethereum);
        const provider = new ethers.BrowserProvider(walletClient.transport);
        // console.log("prodivder",provider)
        const signer = await provider.getSigner();       
        const signerAddress = await signer.getAddress();
        // console.log("Signer Wallet Address:", signerAddress);
       if (signerAddress.toLowerCase() !== connectedWallet.toLowerCase()) {
        showToast("Signer wallet does not match connected wallet!", "error");
        return;
      }
        const tx = await signer.sendTransaction({
          // from:connectedWallet,
          to: backendWallet,
          value: parseEther(amount), // Convert ETH to wei (bigint is correct here)
          gasLimit: ethers.toBigInt(21000),
        });

        // console.log("Deposit TX Hash:", tx.hash);
        showToast(`Deposit successful! TX Hash: ${tx.hash}`, "success");
      } else {
        showToast("Ethereum wallet not detected!", "error");
      }
    } catch (error) {
      console.error("Deposit Error:", error);
     // Check for "INSUFFICIENT_FUNDS" error
     if (error.code === "INSUFFICIENT_FUNDS") {
        showToast("Insufficient balance! Please add more ETH to your wallet.", "error");
      } else if (error.message.includes("insufficient funds")) {
        showToast("Insufficient funds to cover gas fees and transaction amount.", "error");
      } else {
        showToast("Transaction failed. Please try again.", "error");
      }
    }
    setIsProgress(false)
  };

  

  const withdrawETH = async (amount: string) => {
    if(!userID){
        showToast("kindly login again", "error");
        Navigate("/login")
        return;
    }
    setIsProgress(true)
    const privatekey= await auth.getUserPrivatekey(userID)
    // console.log("payload.private_key",privatekey.payload.private_key)
    const backPvtKey=privatekey.payload.private_key
    // console.log("backPvtKey",backPvtKey)
    if (!backendWallet || !backPvtKey || !connectedWallet) {
      showToast("Backend wallet or connected wallet missing.", "error");
      return;
    }

    try {
    const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      const wallet = new ethers.Wallet(backPvtKey, provider);
      const tx = await wallet.sendTransaction({
        to: connectedWallet,
        value: ethers.parseEther(amount),
      });

      // console.log("Withdraw TX Hash:", tx.hash);
      showToast(`Withdrawal successful! TX Hash: ${tx.hash}`, "success");
    } catch (error) {
      console.error("Withdrawal Error:", error);
    //   showToast("Withdrawal failed!", "error");
    if (error.code === "INSUFFICIENT_FUNDS") {
        showToast("Insufficient balance! Please add more ETH to your wallet.", "error");
      } else if (error.message.includes("insufficient funds")) {
        showToast("Insufficient funds to cover gas fees and transaction amount.", "error");
      } else {
        showToast("Transaction failed. Please try again.", "error");
      }
    }
    setIsProgress(false)
  };

  return { depositETH, withdrawETH,progress };
};

export default useWalletTransactions;
