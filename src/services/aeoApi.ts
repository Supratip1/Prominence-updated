const API_BASE_URL = 'http://localhost:8000';

export interface AnalysisRequest {
  url: string;
  max_pages?: number;
}

export interface AnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AEOApiService {
  private static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async analyzeWebsite(request: AnalysisRequest): Promise<AnalysisResponse> {
    return this.makeRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async analyzeWebsiteWithCompetitors(request: AnalysisRequest): Promise<AnalysisResponse> {
    return this.makeRequest('/analyze_with_competitors', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async healthCheck(): Promise<{ status: string; service: string }> {
    return this.makeRequest('/health');
  }

  static async isServerRunning(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default AEOApiService; 