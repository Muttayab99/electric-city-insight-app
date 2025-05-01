
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from '@/components/ui/chart';
import { ElectricityDemand, WeatherData } from '@/lib/mockData';

interface DataExplorerProps {
  demandData: ElectricityDemand[];
  weatherData: WeatherData[];
  cityName: string;
}

const DataExplorer: React.FC<DataExplorerProps> = ({ demandData, weatherData, cityName }) => {
  // Process data for charts
  const processTimeSeries = (data: (ElectricityDemand | WeatherData)[], key: string) => {
    // Group by day for readability
    const groupedByDay = data.reduce<Record<string, any[]>>((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
    
    // Calculate daily averages
    return Object.entries(groupedByDay).map(([date, items]) => {
      const sum = items.reduce((acc, item) => acc + (item as any)[key], 0);
      return {
        date,
        value: sum / items.length
      };
    });
  };
  
  const demandChartData = processTimeSeries(demandData, 'demand');
  const temperatureChartData = processTimeSeries(weatherData, 'temperature');
  const humidityChartData = processTimeSeries(weatherData, 'humidity');
  
  // Process for hourly pattern
  const hourlyDemand = Array(24).fill(0);
  const hourlyDemandCounts = Array(24).fill(0);
  
  demandData.forEach(item => {
    const hour = new Date(item.timestamp).getHours();
    hourlyDemand[hour] += item.demand;
    hourlyDemandCounts[hour]++;
  });
  
  const hourlyDemandAvg = hourlyDemand.map((total, index) => ({
    hour: index,
    demand: total / (hourlyDemandCounts[index] || 1)
  }));

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Data Explorer - {cityName}</CardTitle>
        <CardDescription>
          Analyze electricity demand and weather patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demand" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demand">Demand</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demand">
            <Card>
              <CardHeader>
                <CardTitle>Daily Average Demand</CardTitle>
                <CardDescription>Electricity demand over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={demandChartData}
                  categories={['value']}
                  index="date"
                  colors={['#0066CC']}
                  valueFormatter={(value) => `${value.toLocaleString()} kWh`}
                  showLegend={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weather">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature</CardTitle>
                  <CardDescription>Average daily temperature</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <LineChart
                    data={temperatureChartData}
                    categories={['value']}
                    index="date"
                    colors={['#E6B64C']}
                    valueFormatter={(value) => `${value.toFixed(1)}°F`}
                    showLegend={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Humidity</CardTitle>
                  <CardDescription>Average daily humidity</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <LineChart
                    data={humidityChartData}
                    categories={['value']}
                    index="date"
                    colors={['#8B9CC2']}
                    valueFormatter={(value) => `${value.toFixed(1)}%`}
                    showLegend={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Demand Pattern</CardTitle>
                <CardDescription>Average demand by hour of day</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={hourlyDemandAvg}
                  categories={['demand']}
                  index="hour"
                  colors={['#4DA6FF']}
                  valueFormatter={(value) => `${value.toLocaleString()} kWh`}
                  showLegend={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataExplorer;
