import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties DONE
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4(); // Generate a unique ID for each city
    this.name = name;
  }
}
// TODO: Complete the HistoryService class DONE
class HistoryService {
  private filePath: string;

  constructor() {
  this.filePath = path.join(process.cwd(), 'searchHistory.json');
  }
  // TODO: Define a read method that reads from the searchHistory.json file DONE
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
  }
}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file DONE
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects DONE
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file DONE
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
  
    // Check for duplicate city names (case-insensitive)
    if (cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      throw new Error('City already exists in the search history.');
    }
  
    const newCity = new City(cityName);
    cities.push(newCity);
  
    await this.write(cities);
  
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file DONE
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
  
    const filteredCities = cities.filter(city => city.id !== id);
  
    if (filteredCities.length === cities.length) {
      return false; // No city was removed
    }
  
    await this.write(filteredCities);
  
    return true;
  }
}
export default new HistoryService();
