/* Type definitions for the application */

export interface Agent {
  id: string;
  name: string;
  description: string;
  author: string;
  rating: number;
  users: number;
  behavior: string;
  capabilities: string[];
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface AgentConfig {
  name: string;
  description: string;
  behavior: string;
  capabilities: string[];
}

export interface Portfolio {
  agentId: string;
  performance: number;
  interactions: number;
  lastUpdated: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  content: string;
  videoUrl?: string;
}

// Stellar Wallet Types
export type StellarNetwork = "mainnet" | "testnet" | "futurenet";

export interface StellarNetworkConfig {
  name: StellarNetwork;
  displayName: string;
  horizonUrl: string;
  rpcUrl?: string;
  networkPassphrase: string;
  color: string;
  badge: string;
}

export interface WalletBalance {
  asset: string;
  balance: string;
  assetCode?: string;
  assetIssuer?: string;
}

export interface StellarWallet {
  publicKey: string;
  name: string;
  type: "freighter" | "albedo" | "ledger";
  isConnected: boolean;
  balances: WalletBalance[];
  network: StellarNetwork;
}

export interface WalletContextType {
  wallet: StellarWallet | null;
  network: StellarNetwork;
  isConnecting: boolean;
  error: string | null;
  connectWallet: (
    walletType: "freighter" | "albedo" | "ledger",
  ) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: StellarNetwork) => Promise<void>;
  getBalance: () => Promise<WalletBalance[]>;
  clearError: () => void;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export interface StellarAsset {
  code: string;
  issuer: string;
  name?: string;
}
