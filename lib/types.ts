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
  status: 'active' | 'inactive' | 'draft';
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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  content: string;
  videoUrl?: string;
}
