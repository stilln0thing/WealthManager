const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:3000' 
  : 'http://localhost:3000';

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface AllocationData {
  bySector: Record<string, { value: number; percentage: number }>;
  byMarketCap: Record<string, { value: number; percentage: number }>;
}

export interface PerformanceData {
  timeline: Array<{
    date: string;
    portfolio: number;
    nifty50: number;
    gold: number;
  }>;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  topPerformer: {
    symbol: string;
    name: string;
    gainPercent: number;
  };
  worstPerformer: {
    symbol: string;
    name: string;
    gainPercent: number;
  };
  diversificationScore: number;
  riskLevel: string;
}

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api/portfolio${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getHoldings(): Promise<Holding[]> {
    return this.fetchApi<Holding[]>('/holdings');
  }

  async getAllocation(): Promise<AllocationData> {
    return this.fetchApi<AllocationData>('/allocation');
  }

  async getPerformance(): Promise<PerformanceData> {
    return this.fetchApi<PerformanceData>('/performance');
  }

  async getSummary(): Promise<PortfolioSummary> {
    return this.fetchApi<PortfolioSummary>('/summary');
  }
}

export const apiService = new ApiService(); 