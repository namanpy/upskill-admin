import { Banner, PremiumLearningExperience, Stat, Banner3, Banner4 } from "../types/index";

const API_BASE_URL = 'https://shark-app-ixo3s.ondigitalocean.app';

// export const fetchBanners = async (): Promise<Banner[]> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/banners`);
//       if (!response.ok) throw new Error('Failed to fetch banners');
//       const data = await response.json();
//       return data.banners || []; // Return the 'banners' array from the response
//     } catch (error) {
//       console.error('Error fetching banners:', error);
//       throw error;
//     }
//   };
  
//   export const createBanner = async (formData: FormData): Promise<Banner> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/banners`, {
//         method: 'POST',
//         body: formData,
//       });
//       if (!response.ok) throw new Error('Failed to create banner');
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating banner:', error);
//       throw error;
//     }
//   };



export const fetchBanners = async (): Promise<Banner[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners`);
    if (!response.ok) throw new Error('Failed to fetch banners');
    const data = await response.json();
    return data.banners || [];
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

export const updateBannerActive = async (id: string, active: boolean): Promise<Banner> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error('Failed to update banner status');
    return await response.json();
  } catch (error) {
    console.error('Error updating banner status:', error);
    throw error;
  }
};

// export const updateBanner = async (id: string, formData: FormData): Promise<Banner> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
//       method: 'PUT',
//       body: formData,
//     });
//     if (!response.ok) throw new Error('Failed to update banner');
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating banner:', error);
//     throw error;
//   }
// };

export const deleteBanner = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete banner');
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

export const updateBanner = async (id: string, formData: FormData): Promise<Banner> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update banner');
    return await response.json();
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};


// Premium Learning Experience-related functions
export const fetchPremiumLearningExperiences = async (): Promise<PremiumLearningExperience[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/premium-learning-experiences`);
    if (!response.ok) throw new Error('Failed to fetch premium learning experiences');
    const data = await response.json();
    return data.premiumLearningExperiences || []; // Adjust based on actual response structure
  } catch (error) {
    console.error('Error fetching premium learning experiences:', error);
    throw error;
  }
};

export const createPremiumLearningExperience = async (formData: FormData): Promise<PremiumLearningExperience> => {
  try {
    const response = await fetch(`${API_BASE_URL}/premium-learning-experiences`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create premium learning experience');
    return await response.json();
  } catch (error) {
    console.error('Error creating premium learning experience:', error);
    throw error;
  }
};

export const updatePremiumLearningExperience = async (id: string, formData: FormData): Promise<PremiumLearningExperience> => {
  try {
    const response = await fetch(`${API_BASE_URL}/premium-learning-experiences/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update premium learning experience');
    return await response.json();
  } catch (error) {
    console.error('Error updating premium learning experience:', error);
    throw error;
  }
};

export const updatePremiumLearningActive = async (id: string, active: boolean): Promise<PremiumLearningExperience> => {
  try {
    const response = await fetch(`${API_BASE_URL}/premium-learning-experiences/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error('Failed to update premium learning status');
    return await response.json();
  } catch (error) {
    console.error('Error updating premium learning status:', error);
    throw error;
  }
};

export const deletePremiumLearningExperience = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/premium-learning-experiences/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete premium learning experience');
  } catch (error) {
    console.error('Error deleting premium learning experience:', error);
    throw error;
  }
};  


// Stats-related functions
export const fetchStats = async (): Promise<Stat[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.stats || []; // Adjust based on actual response structure
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const createStat = async (formData: FormData): Promise<Stat> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create stat');
    return await response.json();
  } catch (error) {
    console.error('Error creating stat:', error);
    throw error;
  }
};

export const updateStat = async (id: string, formData: FormData): Promise<Stat> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update stat');
    return await response.json();
  } catch (error) {
    console.error('Error updating stat:', error);
    throw error;
  }
};

export const updateStatActive = async (id: string, active: boolean): Promise<Stat> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error('Failed to update stat status');
    return await response.json();
  } catch (error) {
    console.error('Error updating stat status:', error);
    throw error;
  }
};

export const deleteStat = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete stat');
  } catch (error) {
    console.error('Error deleting stat:', error);
    throw error;
  }
};

// Banner3-related functions
export const fetchBanner3s = async (): Promise<Banner3[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner3`);
    if (!response.ok) throw new Error('Failed to fetch banner3s');
    const data = await response.json();
    return data.banner3s || []; // Adjust if response is singular or different
  } catch (error) {
    console.error('Error fetching banner3s:', error);
    throw error;
  }
};

export const createBanner3 = async (formData: FormData): Promise<Banner3> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner3`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create banner3');
    return await response.json();
  } catch (error) {
    console.error('Error creating banner3:', error);
    throw error;
  }
};

export const updateBanner3 = async (id: string, formData: FormData): Promise<Banner3> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner3/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update banner3');
    return await response.json();
  } catch (error) {
    console.error('Error updating banner3:', error);
    throw error;
  }
};

export const updateBanner3Active = async (id: string, active: boolean): Promise<Banner3> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner3/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error('Failed to update banner3 status');
    return await response.json();
  } catch (error) {
    console.error('Error updating banner3 status:', error);
    throw error;
  }
};

export const deleteBanner3 = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner3/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete banner3');
  } catch (error) {
    console.error('Error deleting banner3:', error);
    throw error;
  }
};



// / Banner4-related functions
export const fetchBanner4s = async (): Promise<Banner4[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner4`);
    if (!response.ok) throw new Error('Failed to fetch banner4s');
    const data = await response.json();
    return data.banner4s || []; // Adjust if response is singular
  } catch (error) {
    console.error('Error fetching banner4s:', error);
    throw error;
  }
};

export const createBanner4 = async (formData: FormData): Promise<Banner4> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner4`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create banner4');
    return await response.json();
  } catch (error) {
    console.error('Error creating banner4:', error);
    throw error;
  }
};

export const updateBanner4 = async (id: string, formData: FormData): Promise<Banner4> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner4/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update banner4');
    return await response.json();
  } catch (error) {
    console.error('Error updating banner4:', error);
    throw error;
  }
};

export const updateBanner4Active = async (id: string, active: boolean): Promise<Banner4> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner4/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error('Failed to update banner4 status');
    return await response.json();
  } catch (error) {
    console.error('Error updating banner4 status:', error);
    throw error;
  }
};

export const deleteBanner4 = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner4/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete banner4');
  } catch (error) {
    console.error('Error deleting banner4:', error);
    throw error;
  }
};