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
    public date: String,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) { }

  static formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}

class WeatherService {
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';

  // Helper method: Build the geocode API query
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`;
  }

  // Helper method: Build the weather API query
  private buildWeatherQuery({ lat, lon }: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Fetch and return location data
  private async fetchLocationData(city: string): Promise<any> {
    console.log("Fetching location data for:", city);
    const query = this.buildGeocodeQuery(city);

    try {
      const response = await fetch(query);
      const data = await response.json();
      if (!data || data.length === 0) {
        throw new Error("No location data found.");
      }
      return data[0]; // Return the first location match
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }

  // Extract relevant fields from API response
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
      name: locationData.name,
      country: locationData.country,
      state: locationData.state
    };
  }

  //  Fetch location data and return formatted coordinates
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates | null> {
    const locationData = await this.fetchLocationData(city);
    return locationData ? this.destructureLocationData(locationData) : null;
  }

  //  Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    console.log("Fetching weather data:", query);

    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }

  // Parse the first entry in the API response as the current weather
  private parseCurrentWeather(response: any): Weather {
    console.log("Parsing current weather data...");

    if (!response.list || response.list.length === 0) {
      throw new Error("Weather data list is missing or empty.");
    }

    const firstEntry = response.list[0];
    if (!firstEntry.weather || firstEntry.weather.length === 0) {
      throw new Error("Weather information is missing.");
    }

    return new Weather(
      response.city.name,
      Weather.formatDate(new Date(firstEntry.dt * 1000)),
      firstEntry.weather[0].icon,
      firstEntry.weather[0].description,
      firstEntry.main.temp,
      firstEntry.wind.speed,
      firstEntry.main.humidity
    );
  }

  // Build a 5-day forecast (one entry per day at 12:00 PM)
  private buildForecastArray(city: string, forecastData: any[]): Weather[] {
    console.log("Building 5-day forecast...");

    const dailyForecast: Weather[] = [];
    const addedDates = new Set<string>();

    for (const item of forecastData) {
      const [date, time] = item.dt_txt.split(" "); // Extract date & time

      if (!addedDates.has(date) && time === "12:00:00") {
        addedDates.add(date); // Mark this date as added

        dailyForecast.push(new Weather(
          city,
          Weather.formatDate(new Date(item.dt * 1000)),
          item.weather[0].icon,
          item.weather[0].description,
          item.main.temp,
          item.wind.speed,
          item.main.humidity
        ));
      }

      // Stop when we have exactly 5 days
      if (dailyForecast.length === 5) break;
    }

    console.log("Final 5-day forecast:", dailyForecast);
    return dailyForecast;
  }

  // Fetch current weather and 5-day forecast for a given city
  async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
    console.log(`Getting weather for city: ${city}`);

    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      if (!coordinates) {
        throw new Error('Unable to fetch location data for the specified city.');
      }

      const weatherData = await this.fetchWeatherData(coordinates);

      // Ensure API response is valid
      if (!weatherData || !weatherData.list || !weatherData.city) {
        throw new Error('Invalid weather API response.');
      }

      const currentWeather = this.parseCurrentWeather(weatherData);
      console.log("Current Weather: ", currentWeather);
      const forecast = this.buildForecastArray(coordinates.name, weatherData.list);

      return { currentWeather, forecast };
    } catch (error) {
      console.error("Error getting weather data:", error);
      return {
        currentWeather: new Weather('', Weather.formatDate(new Date()), '', '', 0, 0, 0),
        forecast: []
      };
    }
  }

}

export default new WeatherService();

