import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
interface ListItem {
  name: string;
}

interface CreateListRequest {
  name: string;
  items: ListItem[];
}

export const create = async (data: CreateListRequest) => {
  try {
    console.log('API isteği:', JSON.stringify(data, null, 2));
    const response = await axios.post(
      `${API_URL}/api/v1/shlists/create`,
      data
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error('Sunucu yanıtı:', error.response.data);
      console.error('Durum kodu:', error.response.status);
    }
    throw error;
  }
};

export const listCompleted = async (id: number) => {
  try {
    const requestBody = {
      enabled: false
    };

    const response = await axios.put(
      `${API_URL}/api/v1/shlists/${id}/update`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getActiveLists = async (page = 0) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/shlists/active-list`, { params: { page, size: 5 } });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const completedLists = async (page = 0) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/shlists/history-list`, {
      params: { page, size: 5 }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 