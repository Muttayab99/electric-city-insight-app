
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
  
  // Historical data (with actuals and predictions)
  for (let hour = -72; hour < 0; hour++) {
    const date = new Date(now);
    date.setHours(now.getHours() + hour);
    
    const baseValue = 500 + Math.sin((hour + 24) * Math.PI / 12) * 300;
    const actual = baseValue + (Math.random() * 100 - 50);
    const predicted = actual * (1 + (Math.random() * 0.2 - 0.1)); // Up to ±10% error
    
    data.push({
      timestamp: date.toISOString(),
      actual: Number(actual.toFixed(2)),
      predicted: Number(predicted.toFixed(2)),
      city,
      model: Math.random() > 0.5 ? 'ARIMA' : 'LSTM'
    });
  }
  
  // Future data (only predictions, no actuals)
  for (let hour = 0; hour < 24; hour++) {
    const date = new Date(now);
    date.setHours(now.getHours() + hour);
    
    const baseValue = 500 + Math.sin((hour + 24) * Math.PI / 12) * 300;
    const predicted = baseValue + (Math.random() * 100 - 50);
    
    data.push({
      timestamp: date.toISOString(),
      actual: null,
      predicted: Number(predicted.toFixed(2)),
      city,
      model: Math.random() > 0.5 ? 'ARIMA' : 'LSTM'
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
