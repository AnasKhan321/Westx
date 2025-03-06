import axios from 'axios';

const API_URL = 'https://believe-in-fun-backend.onrender.com/api';

export const api = {
  
  prepareLaunchTransaction: async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${API_URL}/transactions/prepare-launch-transaction`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error preparing launch transaction:', error);
      throw error;
    }
  },
  
  confirmTokenCreation: async (tokenMint: string, transactionSignature: string, tokenDetails: any) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/confirm-token-creation`, {
        tokenMint,
        transactionSignature,
        tokenDetails
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming token creation:', error);
      throw error;
    }
  },
  
  prepareBuyTransaction: async (tokenMint: string, amount: number, minReceive: number, publicKey: string) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/prepare-buy-transaction`, {
        tokenMint,
        amount,
        minReceive,
        publicKey
      });
      return response.data;
    } catch (error) {
      console.error('Error preparing buy transaction:', error);
      throw error;
    }
  },
  
  confirmBuyTransaction: async (tokenMint: string, transactionSignature: string) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/confirm-buy-transaction`, {
        tokenMint,
        transactionSignature
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming buy transaction:', error);
      throw error;
    }
  },
  
  prepareSellTransaction: async (tokenMint: string, amount: number, minReceive: number, publicKey: string) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/prepare-sell-transaction`, {
        tokenMint,
        amount: String(amount),
        minReceive: String(minReceive),
        publicKey
      });
      return response.data;
    } catch (error) {
      console.error('Error preparing sell transaction:', error);
      throw error;
    }
  },
  
  confirmSellTransaction: async (tokenMint: string, transactionSignature: string) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/confirm-sell-transaction`, {
        tokenMint,
        transactionSignature
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming sell transaction:', error);
      throw error;
    }
  }
}; 