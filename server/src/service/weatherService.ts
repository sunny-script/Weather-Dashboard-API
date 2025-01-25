import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: number;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: number,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

interface Coordinates {
    lat: number;
    lon: number;
    name: string;
    country: string;
    state: string;
  };

// TODO: Complete the WeatherService class DONE
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties DONE
  private baseURL?: string;
  private apiKey?: string;
  private city?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method DONE
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      return data[0];
    }
    catch (error) {
      console.error(error);
    }
  }

  // TODO: Define an interface for the Location object

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates { 
    const { lat, lon, name, country, state } = locationData;
    return { lat, lon, name, country, state};
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string { 
    return `${this.baseURL}/geocode?apikey=${this.apiKey}&location=${this.city}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string { }
  // Similar to above, but with the weather vs geocode

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() { }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) { }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) { }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) { }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) { }
}

export default new WeatherService();


