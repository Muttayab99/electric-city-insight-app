
export interface CityData {
  id: string;
  name: string;
  state: string;
}

export interface ElectricityDemand {
  timestamp: string;
  demand: number;
  city: string;
}

export interface WeatherData {
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  city: string;
}

export interface ClusterData {
  id: number;
  x: number;
  y: number;
  cluster: number;
  demand: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  timestamp: string;
  city: string;
}

export interface ForecastData {
  timestamp: string;
  actual: number | null;
  predicted: number | null;
  city: string;
  model: string;
}

export const cities: CityData[] = [
  { id: 'nyc', name: 'New York', state: 'NY' },
  { id: 'chi', name: 'Chicago', state: 'IL' },
  { id: 'la', name: 'Los Angeles', state: 'CA' },
  { id: 'hou', name: 'Houston', state: 'TX' },
  { id: 'phx', name: 'Phoenix', state: 'AZ' },
  { id: 'phi', name: 'Philadelphia', state: 'PA' },
  { id: 'san', name: 'San Antonio', state: 'TX' },
  { id: 'sd', name: 'San Diego', state: 'CA' },
  { id: 'dal', name: 'Dallas', state: 'TX' },
  { id: 'sj', name: 'San Jose', state: 'CA' }
];

// Generate mock electricity demand data
export const generateMockDemandData = (city: string, days: number = 7): ElectricityDemand[] => {
  const data: ElectricityDemand[] = [];
  const now = new Date();
  
  for (let day = 0; day < days; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setDate(now.getDate() - days + day);
      date.setHours(hour, 0, 0, 0);
      
      // Create a daily pattern with peak at midday and seasonality
      const baseLoad = 500 + Math.random() * 100;
      const timeOfDay = Math.sin((hour - 6) * Math.PI / 12) * 300;
      const weekendFactor = (date.getDay() === 0 || date.getDay() === 6) ? 0.8 : 1;
      const randomVariation = Math.random() * 50 - 25;
      
      const demand = Math.max(0, (baseLoad + timeOfDay) * weekendFactor + randomVariation);
      
      data.push({
        timestamp: date.toISOString(),
        demand: Number(demand.toFixed(2)),
        city
      });
    }
  }
  
  return data;
};

// Generate mock weather data
export const generateMockWeatherData = (city: string, days: number = 7): WeatherData[] => {
  const data: WeatherData[] = [];
  const now = new Date();
  
  for (let day = 0; day < days; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setDate(now.getDate() - days + day);
      date.setHours(hour, 0, 0, 0);
      
      // Create weather patterns
      const baseTemp = 60 + Math.sin((day * 24 + hour) * Math.PI / 84) * 15; // Temperature cycle
      const hourlyVariation = Math.sin((hour - 6) * Math.PI / 12) * 10; // Daily temperature cycle
      const temperature = baseTemp + hourlyVariation + (Math.random() * 5 - 2.5);
      
      const humidity = 50 + Math.sin((day * 24 + hour) * Math.PI / 72) * 20 + (Math.random() * 10 - 5);
      const windSpeed = 5 + Math.sin((day * 24 + hour) * Math.PI / 48) * 3 + (Math.random() * 3);
      const precipitation = Math.max(0, Math.sin((day * 24 + hour) * Math.PI / 60) * 2 + (Math.random() * 0.5));
      
      data.push({
        timestamp: date.toISOString(),
        temperature: Number(temperature.toFixed(1)),
        humidity: Number(Math.min(100, Math.max(0, humidity)).toFixed(1)),
        windSpeed: Number(Math.max(0, windSpeed).toFixed(1)),
        precipitation: Number(precipitation.toFixed(2)),
        city
      });
    }
  }
  
  return data;
};

// Generate mock cluster data (PCA visualization)
export const generateMockClusterData = (city: string, clusterCount: number = 4): ClusterData[] => {
  const clusters = [];
  
  // Generate cluster centers
  const centers = Array.from({ length: clusterCount }, (_, i) => ({
    x: Math.random() * 8 - 4,
    y: Math.random() * 8 - 4
  }));
  
  for (let i = 0; i < 200; i++) {
    const clusterIndex = i % clusterCount;
    const center = centers[clusterIndex];
    
    // Generate point around cluster center
    const x = center.x + (Math.random() * 2 - 1);
    const y = center.y + (Math.random() * 2 - 1);
    
    // Create a timestamp
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    
    const demand = 500 + Math.random() * 500;
    const temperature = 50 + Math.random() * 40;
    const humidity = 30 + Math.random() * 60;
    const windSpeed = Math.random() * 15;
    const precipitation = Math.random() * 0.5;
    
    clusters.push({
      id: i,
      x,
      y,
      cluster: clusterIndex,
      demand,
      temperature,
      humidity,
      windSpeed,
      precipitation,
      timestamp: date.toISOString(),
      city
    });
  }
  
  return clusters;
};

// Generate mock forecast data
export const generateMockForecastData = (city: string): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  const models = ['ARIMA', 'XGBoost', 'LSTM', 'Linear', 'Polynomial', 'Random_Forest', 'ensemble'];
  
  // Historical data (with actuals and predictions)
  for (let hour = -72; hour < 0; hour++) {
    const date = new Date(now);
    date.setHours(now.getHours() + hour);
    
    const baseValue = 500 + Math.sin((hour + 24) * Math.PI / 12) * 300;
    const actual = baseValue + (Math.random() * 100 - 50);
    
    // Create a prediction for each model
    models.forEach(model => {
      // Different models have slightly different error characteristics
      let errorFactor = 0.1; // Default 10% error range
      
      if (model === 'ARIMA') errorFactor = 0.12;
      else if (model === 'XGBoost') errorFactor = 0.09;
      else if (model === 'LSTM') errorFactor = 0.08;
      else if (model === 'Linear') errorFactor = 0.11;
      else if (model === 'Polynomial') errorFactor = 0.095;
      else if (model === 'Random_Forest') errorFactor = 0.085;
      else if (model === 'ensemble') errorFactor = 0.07;
      
      const predicted = actual * (1 + (Math.random() * 2 * errorFactor - errorFactor)); 
      
      data.push({
        timestamp: date.toISOString(),
        actual: Number(actual.toFixed(2)),
        predicted: Number(predicted.toFixed(2)),
        city,
        model
      });
    });
  }
  
  // Future data (only predictions, no actuals)
  for (let hour = 0; hour < 24; hour++) {
    const date = new Date(now);
    date.setHours(now.getHours() + hour);
    
    const baseValue = 500 + Math.sin((hour + 24) * Math.PI / 12) * 300;
    
    // Create a prediction for each model with different patterns
    models.forEach(model => {
      let variationFactor = 1.0;
      let predicted;
      
      if (model === 'ARIMA') {
        // ARIMA tends to follow the pattern more closely but with some noise
        variationFactor = 0.8;
        predicted = baseValue + (Math.random() * 100 - 50) * variationFactor;
      } else if (model === 'XGBoost') {
        // XGBoost might be more accurate for certain patterns
        variationFactor = 0.7;
        predicted = baseValue + (Math.sin(hour * 0.5) * 50) + (Math.random() * 80 - 40) * variationFactor;
      } else if (model === 'LSTM') {
        // LSTM might capture longer-term dependencies
        variationFactor = 0.6;
        predicted = baseValue + (Math.cos(hour * 0.3) * 70) + (Math.random() * 60 - 30) * variationFactor;
      } else if (model === 'Linear') {
        // Linear regression tends to be simpler with more consistent error
        variationFactor = 0.75;
        predicted = baseValue + (Math.random() * 90 - 45) * variationFactor;
      } else if (model === 'Polynomial') {
        // Polynomial regression better fits curves but can overfit
        variationFactor = 0.65;
        predicted = baseValue + (Math.sin(hour * 0.7) * 60) + (Math.random() * 70 - 35) * variationFactor;
      } else if (model === 'Random_Forest') {
        // Random Forest is often accurate but can have step-like predictions
        variationFactor = 0.68;
        predicted = baseValue + (Math.floor(hour/4) * 10) + (Math.random() * 65 - 32.5) * variationFactor;
      } else {
        // Ensemble is the average of other models plus a small smoothing factor
        predicted = baseValue + (Math.random() * 50 - 25) * 0.5;
      }
      
      data.push({
        timestamp: date.toISOString(),
        actual: null,
        predicted: Number(predicted.toFixed(2)),
        city,
        model
      });
    });
  }
  
  return data;
};

// Generate all data for a city
export const getCityData = (cityId: string) => {
  const city = cities.find(c => c.id === cityId);
  if (!city) return null;
  
  return {
    city,
    demandData: generateMockDemandData(cityId),
    weatherData: generateMockWeatherData(cityId),
    clusterData: generateMockClusterData(cityId),
    forecastData: generateMockForecastData(cityId)
  };
};
