'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  StellarWallet,
  WalletContextType,
  StellarNetwork,
  WalletBalance,
} from '@/lib/types';
import {
  connectFreighter,
  connectAlbedo,
  connectLedger,
  disconnectWallet as disconnectWalletUtil,
  getAccountBalances,
  isValidStellarAddress,
} from '@/lib/stellar';
import { STORAGE_KEYS, DEFAULT_NETWORK, STELLAR_NETWORKS, ERROR_MESSAGES } from '@/lib/stellar-constants';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<StellarWallet | null>(null);
  const [network, setNetwork] = useState<StellarNetwork>(DEFAULT_NETWORK);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet state from localStorage on mount
  useEffect(() => {
    const savedNetwork = localStorage.getItem(STORAGE_KEYS.NETWORK) as StellarNetwork | null;
    const savedWalletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    const savedWalletType = localStorage.getItem(STORAGE_KEYS.WALLET_TYPE);

    if (savedNetwork && Object.keys(STELLAR_NETWORKS).includes(savedNetwork)) {
      setNetwork(savedNetwork);
    }

    if (savedWalletAddress && isValidStellarAddress(savedWalletAddress) && savedWalletType) {
      setWallet({
        publicKey: savedWalletAddress,
        name: savedWalletType,
        type: savedWalletType as 'freighter' | 'albedo' | 'ledger',
        isConnected: true,
        balances: [],
        network: savedNetwork || DEFAULT_NETWORK,
      });
    }
  }, []);

  // Persist network to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NETWORK, network);
  }, [network]);

  const connectWallet = useCallback(
    async (walletType: 'freighter' | 'albedo' | 'ledger') => {
      setIsConnecting(true);
      setError(null);

      try {
        let publicKey: string;

        switch (walletType) {
          case 'freighter':
            publicKey = await connectFreighter(network);
            break;
          case 'albedo':
            publicKey = await connectAlbedo(network);
            break;
          case 'ledger':
            publicKey = await connectLedger(network);
            break;
          default:
            throw new Error('Unknown wallet type');
        }

        if (!isValidStellarAddress(publicKey)) {
          throw new Error(ERROR_MESSAGES.INVALID_ADDRESS);
        }

        // Fetch balances
        const balances = await getAccountBalances(publicKey, network);

        const newWallet: StellarWallet = {
          publicKey,
          name: walletType.charAt(0).toUpperCase() + walletType.slice(1),
          type: walletType,
          isConnected: true,
          balances,
          network,
        };

        setWallet(newWallet);

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, publicKey);
        localStorage.setItem(STORAGE_KEYS.WALLET_TYPE, walletType);
        localStorage.setItem(STORAGE_KEYS.WALLET_STATE, JSON.stringify(newWallet));
      } catch (err: any) {
        const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
        setError(errorMessage);
        console.error('Wallet connection error:', err);
      } finally {
        setIsConnecting(false);
      }
    },
    [network]
  );

  const disconnectWallet = useCallback(() => {
    disconnectWalletUtil();
    setWallet(null);
    setError(null);
  }, []);

  const switchNetwork = useCallback(async (newNetwork: StellarNetwork) => {
    setNetwork(newNetwork);
    setError(null);

    // If wallet is connected, refresh balances for new network
    if (wallet?.publicKey) {
      try {
        const balances = await getAccountBalances(wallet.publicKey, newNetwork);
        setWallet((prev) =>
          prev
            ? {
                ...prev,
                balances,
                network: newNetwork,
              }
            : null
        );

        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.NETWORK, newNetwork);
      } catch (err: any) {
        setError(err.message || ERROR_MESSAGES.NETWORK_ERROR);
        console.error('Error switching network:', err);
      }
    }
  }, [wallet?.publicKey]);

  const getBalance = useCallback(async (): Promise<WalletBalance[]> => {
    if (!wallet?.publicKey) {
      throw new Error('No wallet connected');
    }

    try {
      const balances = await getAccountBalances(wallet.publicKey, network);
      setWallet((prev) =>
        prev
          ? {
              ...prev,
              balances,
            }
          : null
      );
      return balances;
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.NETWORK_ERROR);
      throw err;
    }
  }, [wallet?.publicKey, network]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: WalletContextType = {
    wallet,
    network,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getBalance,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useStellarWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useStellarWallet must be used within StellarWalletProvider');
  }
  return context;
}
