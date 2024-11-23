import { toast } from "sonner";

export interface CreateInstancePayload {
  instanceName: string;
  evolution: string;
  user: string;
  project: string;
  device: string;
}

export interface InstanceResponse {
  qrcode: string;
  instancia: string;
}

const API_URL = 'https://ct103n8nwebhook.wpp-app.com/webhook';
const TIMEOUT_MS = 30000; // 30 seconds timeout

class InstanceApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstanceApiError';
  }
}

const timeoutPromise = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

export const instanceApi = {
  async createInstance(payload: CreateInstancePayload): Promise<InstanceResponse> {
    try {
      const response = await Promise.race([
        fetch(`${API_URL}/qrDast`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
        timeoutPromise(TIMEOUT_MS)
      ]);

      if (response instanceof Response) {
        if (!response.ok) {
          throw new InstanceApiError(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data.qrcode || !data.instancia) {
          throw new InstanceApiError('Invalid response format');
        }
        
        return data;
      } else {
        throw new InstanceApiError('Request timeout');
      }
    } catch (error) {
      if (error instanceof InstanceApiError) {
        throw error;
      }
      throw new InstanceApiError(error instanceof Error ? error.message : 'Unknown error');
    }
  }
};