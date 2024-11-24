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

const API_URL = 'https://n8n-hot.wpp-app.com/webhook/qrcodedast';
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
      console.log('Sending request to:', API_URL);
      console.log('Request payload:', payload);

      const response = await Promise.race([
        fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
        }),
        timeoutPromise(TIMEOUT_MS)
      ]);

      if (response instanceof Response) {
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);

        if (!response.ok) {
          throw new InstanceApiError(`HTTP error! status: ${response.status}`);
        }

        try {
          const data = JSON.parse(responseText);
          if (!data.qrcode || !data.instancia) {
            throw new InstanceApiError('Invalid response format');
          }
          return data;
        } catch (e) {
          throw new InstanceApiError('Invalid JSON response');
        }
      } else {
        throw new InstanceApiError('Request timeout');
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof InstanceApiError) {
        throw error;
      }
      throw new InstanceApiError(error instanceof Error ? error.message : 'Unknown error');
    }
  }
};