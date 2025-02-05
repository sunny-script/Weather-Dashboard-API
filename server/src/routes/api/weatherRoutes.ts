import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data DONE
router.post('/', async (req: Request, res: Response) => {
  console.log("Incoming Data: ", req.body);   // 
  const { cityName } = req.body;
  const city = cityName
  console.log("City: ", city);
  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get weather data from WeatherService DONE
    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log("Weather Data: ", weatherData);
    // Save city to search history using HistoryService DONE
    await HistoryService.addCity(city);

    // Respond with weather data
    return res.json(weatherData);
  } catch (error) {
    console.error('Error getting weather data:', error);
    return res.status(500).json({ error: 'Error getting weather data' });
  }
});

// GET search history DONE
router.get('/history', async (_req: Request, res: Response) => {
  console.log("Hit History Route");
  try {
    // Get search history from HistoryService
    const history = await HistoryService.getCities();

    // Respond with search history
    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Error fetching search history' });
  }
});

// DELETE city from search history DONE
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Remove city from search history using HistoryService DONE
    const success = await HistoryService.removeCity(id);

    if (success) {
      res.status(200).json({ message: 'City removed successfully.' });
    } else {
      res.status(404).json({ error: 'City not found.' });
    }
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Error deleting city.' });
  }
});

export default router;
