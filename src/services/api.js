import axios from 'axios';

export const apiClima = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/',
  params: {
    appid: process.env.EXPO_PUBLIC_API_KEY, 
    units: 'metric',
    lang: 'pt_br',
  },
});