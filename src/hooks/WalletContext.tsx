import React, { createContext, useContext } from "react";
import { infoWallet as useWalletImpl } from "./useWallet";

const WalletContext = createContext<ReturnType<typeof useWalletImpl> | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWalletImpl();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
};