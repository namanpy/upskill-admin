import { Banner } from "../types/banner";

const API_BASE_URL = 'https://shark-app-ixo3s.ondigitalocean.app';

export const fetchBanners = async (): Promise<Banner[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners`);
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      return data.banners || []; // Return the 'banners' array from the response
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  };
  
  export const createBanner = async (formData: FormData): Promise<Banner> => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create banner');
      return await response.json();
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  };