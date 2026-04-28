import axios from 'axios';

// Free WeatherAPI.com Key (usually valid for 1 month)
// Users should replace this with their own key
const API_KEY = '449bd06d80144314a4c42550262804'; 
const BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeather = async (city = 'Hanoi') => {
    try {
        const response = await axios.get(`${BASE_URL}/current.json`, {
            params: {
                key: API_KEY,
                q: city,
                aqi: 'no'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
};

export const fetchForecast = async (city = 'Hanoi', days = 3) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: city,
                days: days,
                aqi: 'no',
                alerts: 'no'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
};
