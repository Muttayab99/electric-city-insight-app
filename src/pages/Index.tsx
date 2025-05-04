
import React, { useState, useEffect } from 'react';
import { getCityData, cities } from '@/lib/mockData';
import CitySelector from '@/components/CitySelector';
import DataExplorer from '@/components/DataExplorer';
import ClusteringVisualization from '@/components/ClusteringVisualization';
import ForecastPlot from '@/components/ForecastPlot';
import ControlPanel from '@/components/ControlPanel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState('nyc');
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modelParams, setModelParams] = useState({
    model: 'ensemble',
    horizon: 24,
    features: {
      temperature: true,
      humidity: true,
      wind: true,
      timeOfDay: true
    }
  });
  
  // Load data for the selected city
  useEffect(() => {
    setLoading(true);
    
    // Simulate data loading with a small delay
    setTimeout(() => {
      const data = getCityData(selectedCity);
      setCityData(data);
      setLoading(false);
    }, 500);
  }, [selectedCity]);
  
  // Handle city selection
  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
  };
  
  // Handle refresh request
  const handleRefresh = () => {
    setLoading(true);
    toast.info("Refreshing data analysis...");
    
    // Simulate processing with updated parameters
    setTimeout(() => {
      const data = getCityData(selectedCity);
      setCityData(data);
      setLoading(false);
      toast.success("Analysis complete!");
    }, 1000);
  };
  
  // Get city name for display
  const getCityDisplayName = () => {
    const city = cities.find(c => c.id === selectedCity);
    return city ? `${city.name}, ${city.state}` : '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Electric City Insights</h1>
              <p className="text-sm opacity-90">
                Electricity demand analysis and forecasting
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Select City:</span>
              <CitySelector 
                selectedCity={selectedCity}
                onSelectCity={handleSelectCity}
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="h-16 w-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-lg">Loading data for {getCityDisplayName()}...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Tabs View for Small Screens */}
            <div className="block md:hidden">
              <Tabs defaultValue="data">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="clusters">Clusters</TabsTrigger>
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                </TabsList>
                <TabsContent value="data" className="mt-4 space-y-4">
                  <ControlPanel onRefresh={handleRefresh} />
                  <DataExplorer 
                    demandData={cityData.demandData} 
                    weatherData={cityData.weatherData}
                    cityName={getCityDisplayName()}
                  />
                </TabsContent>
                <TabsContent value="clusters" className="mt-4">
                  <ClusteringVisualization 
                    clusterData={cityData.clusterData}
                    cityName={getCityDisplayName()}
                  />
                </TabsContent>
                <TabsContent value="forecast" className="mt-4">
                  <ForecastPlot 
                    forecastData={cityData.forecastData}
                    cityName={getCityDisplayName()}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden md:block space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ControlPanel onRefresh={handleRefresh} />
                </div>
                <div className="lg:col-span-2">
                  <DataExplorer 
                    demandData={cityData.demandData} 
                    weatherData={cityData.weatherData}
                    cityName={getCityDisplayName()}
                  />
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <ClusteringVisualization 
                clusterData={cityData.clusterData}
                cityName={getCityDisplayName()}
              />
              
              <Separator className="my-8" />
              
              <ForecastPlot 
                forecastData={cityData.forecastData}
                cityName={getCityDisplayName()}
              />
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Data Preprocessing</h4>
                  <p className="text-muted-foreground">
                    Hourly demand and weather data is cleaned, normalized, and preprocessed. Missing values are imputed using forward-fill for demand and median for weather parameters.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Clustering Method</h4>
                  <p className="text-muted-foreground">
                    Dimensionality reduction via PCA, followed by K-means clustering with silhouette score optimization to identify electricity demand patterns.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Forecasting Models</h4>
                  <p className="text-muted-foreground">
                    Ensemble model combining ARIMA, XGBoost and LSTM for short-term load forecasting. Weather variables (temperature, humidity) are used as exogenous inputs.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-muted py-4 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
            <div>
              <p>Electric City Insights Dashboard</p>
            </div>
            <div>
              <p>Data source: US Top 10 Cities – Electricity and Weather Data (Kaggle)</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
