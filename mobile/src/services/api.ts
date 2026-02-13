import axios from 'axios';

// Android simulator 10.0.2.2 points to host localhost
// iOS simulator uses localhost
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  android: 'https://pet-care-ai-hazel.vercel.app',
  ios: 'https://pet-care-ai-hazel.vercel.app',
  default: 'https://pet-care-ai-hazel.vercel.app',
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
