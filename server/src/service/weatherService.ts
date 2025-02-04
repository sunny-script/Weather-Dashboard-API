import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

class Weather {
  constructor(
    public city: string,
    public date: number,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

class WeatherService {
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';

  private async fetchLocationData(city: string): Promise<Coordinates | null> {
    console.log("In weather service");
    console.log("City: ", city);
    try {
      const query = `${this.baseURL}/geocode?apikey=${this.apiKey}&location=${city}`;
      console.log("Query: ", query);
      const response = await fetch(query);
      const data = await response.json();
      return data[0] ?? null;
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }

  private async fetchWeatherData({ lat, lon }: Coordinates): Promise<any> {
    const query = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
    const response = await fetch(query);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data.');
    }

    return await response.json();
  }

  private parseWeatherData(response: any): Weather {
    const { name: city, weather, main, wind, dt: date } = response;
    return new Weather(
      city,
      date * 1000, // Convert UNIX timestamp to milliseconds
      weather[0].icon,
      weather[0].description,
      main.temp,
      wind.speed,
      main.humidity
    );
  }

  private buildForecastArray(city: string, forecastData: any[]): Weather[] {
    return forecastData.map((item: any) => {
      const { dt: date, weather, main, wind } = item;
      return new Weather(
        city,
        date * 1000, // Convert UNIX timestamp to milliseconds
        weather[0].icon,
        weather[0].description,
        main.temp,
        wind.speed,
        main.humidity
      );
    });
  }

  async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchLocationData(city);

    if (!coordinates) {
      throw new Error('Unable to fetch location data for the specified city.');
    }

    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseWeatherData(weatherData);
    const forecast = this.buildForecastArray(coordinates.name, weatherData.list);

    return { currentWeather, forecast };
  }
}

export default new WeatherService();
