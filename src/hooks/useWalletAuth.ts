
import { useEffect, useState } from "react";
import { useAccount, useSignMessage,useDisconnect } from "wagmi";
import { useReduxActions, useReduxSelectors } from "./useReduxActions";

export const useWalletAuth = () => {
  const { auth: authSelectors } = useReduxSelectors();
  const { isAuthenticated } = authSelectors;
  const { auth } = useReduxActions();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [signature, setSignature] = useState("");

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (data) => {
        // console.log("✅ Signature Received:", data);
        setSignature(data);

        if (address) {
          // console.log("🚀 Sending API Request with:", {
          //   wallet_address: address,
          //   signature: data,
          // });

          auth
            .connectWallet({
              wallet_address: address,
              signature: data,
              message: "Sign this message to authenticate. Nonce: 123456",
            })
            .then((response) => console.log("✅ API Response:", response))
            .catch((error) => console.error("❌ API Error:", error));
        }
      },
      onError: (error) => {
        console.error("❌ Signing Failed:", error);
      },
    },
  });

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token") || "";
    
    if (isConnected && address && !signature && !isAuthenticated && !auth_token) {
      const message = `Sign this message to authenticate. Nonce: 123456`;
      signMessage({ message });
    }
  }, [isConnected, address]);

  const handleDisconnect = () => {
    console.log("🚨 Wallet disconnected!");
    // auth.logout(); 
    localStorage.removeItem("auth_token"); // Remove token
    setSignature(""); // Clear signature state
  };

  useEffect(() => {
    if (!isConnected) {
      handleDisconnect();
    }
  }, [isConnected]);

  return {
    isConnected,
    address,
    signature,
    handleDisconnect,
    disconnect,
  };
};
