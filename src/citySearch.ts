import axios from 'axios';

export interface GeoCity {
  name: string;
  countryCode: string;
  countryName: string;
  lat: number;
  lon: number;
}

const CITIES_API_KEY = '8d2de98e089f1c28e1a22fc19a24ef04';
const CITIES_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export const searchCities = async (query: string): Promise<GeoCity[]> => {
  if (!query || query.length < 2) return [];

  try {
    const response = await axios.get(
      `${CITIES_API_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${CITIES_API_KEY}`
    );

    return response.data.map((city: any) => ({
      name: city.name,
      countryCode: city.country,
      countryName: new Intl.DisplayNames(['en'], { type: 'region' }).of(city.country) || city.country,
      lat: city.lat,
      lon: city.lon
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};