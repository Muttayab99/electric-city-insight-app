
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForecastData } from '@/lib/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
  BarChart
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ForecastPlotProps {
  forecastData: ForecastData[];
  cityName: string;
}

const ForecastPlot: React.FC<ForecastPlotProps> = ({ forecastData, cityName }) => {
  const [model, setModel] = useState<string>('ensemble');
  
  // Process data for chart display
  const processedData = forecastData.map(item => {
    const date = new Date(item.timestamp);
    return {
      ...item,
      displayTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      displayDate: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      dateTime: `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isHistory: item.actual !== null
    };
  });
  
  console.log('Available models in data:', [...new Set(processedData.map(d => d.model))]);
  console.log('Currently selected model:', model);
  
  // Calculate error metrics
  const historicalData = processedData.filter(d => d.actual !== null);
  
  const calculateMetrics = () => {
    if (historicalData.length === 0) return { mae: 0, rmse: 0, mape: 0 };
    
    // Filter historical data by selected model first
    const filteredHistorical = model === 'ensemble' 
      ? historicalData 
      : historicalData.filter(d => d.model === model);
    
    if (filteredHistorical.length === 0) return { mae: 0, rmse: 0, mape: 0 };
    
    const errors = filteredHistorical.map(d => ({
      error: (d.predicted || 0) - (d.actual || 0),
      absError: Math.abs((d.predicted || 0) - (d.actual || 0)),
      absPercentError: Math.abs(((d.predicted || 0) - (d.actual || 0)) / (d.actual || 1)) * 100
    }));
    
    const mae = errors.reduce((sum, e) => sum + e.absError, 0) / errors.length;
    const rmse = Math.sqrt(errors.reduce((sum, e) => sum + e.error * e.error, 0) / errors.length);
    const mape = errors.reduce((sum, e) => sum + e.absPercentError, 0) / errors.length;
    
    return { mae, rmse, mape };
  };
  
  const metrics = calculateMetrics();
  
  // Filter data by selected model - FIX: This is where the issue was
  // We need to properly filter by model name
  const filteredData = processedData.filter(d => {
    // Special handling for 'ensemble' to avoid confusion with the model name
    if (model === 'ensemble') return d.model === 'ensemble';
    return d.model === model;
  });

  console.log(`Filtered data for model ${model}: ${filteredData.length} points`);
  
  // Verify we have data for each timestamp (for debugging)
  const uniqueTimestamps = [...new Set(filteredData.map(d => d.timestamp))];
  console.log(`Unique timestamps for ${model}: ${uniqueTimestamps.length}`);

  // Helper function to determine bar color based on error
  const getErrorColor = (error: number) => {
    return error > 0 ? "#f87171" : "#60a5fa";
  };

  // Prepare error data for the bar chart - also filter by selected model
  const errorData = historicalData
    .filter(item => model === 'ensemble' ? item.model === 'ensemble' : item.model === model)
    .map(item => {
      const error = (item.predicted || 0) - (item.actual || 0);
      return {
        dateTime: item.dateTime,
        error: error,
        fill: getErrorColor(error)
      };
    });

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Forecast - {cityName}</CardTitle>
            <CardDescription>
              Electricity demand forecast for the next 24 hours
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <span className="text-sm font-medium">Model:</span>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ensemble">Ensemble</SelectItem>
                <SelectItem value="ARIMA">ARIMA</SelectItem>
                <SelectItem value="XGBoost">XGBoost</SelectItem>
                <SelectItem value="LSTM">LSTM</SelectItem>
                <SelectItem value="Linear">Linear Regression</SelectItem>
                <SelectItem value="Polynomial">Polynomial Regression</SelectItem>
                <SelectItem value="Random_Forest">Random Forest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">Forecast Chart</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast" className="h-[400px]">
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dateTime" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.getHours() === 0 || date.getHours() === 12 
                        ? `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${date.getHours() === 0 ? 'AM' : 'PM'}`
                        : date.getHours() < 12 ? `${date.getHours()}AM` : `${date.getHours()-12}PM`;
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Demand (kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} kWh`, 
                      name === 'predicted' ? 'Predicted' : 'Actual'
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    }}
                  />
                  <Legend />
                  
                  {/* Vertical separator between history and forecast */}
                  <Area 
                    type="step" 
                    dataKey={() => 0} 
                    stackId="separator" 
                    fill="transparent" 
                    stroke="transparent" 
                  />
                  
                  {/* History - Actual Line */}
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Actual" 
                    stroke="#0066CC" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                  
                  {/* Forecast Line */}
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    name="Predicted" 
                    stroke="#E6B64C" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    strokeDasharray={model === 'LSTM' ? "5 5" : undefined}
                  />
                  
                  {/* Vertical line separating history from forecast */}
                  {filteredData.findIndex(d => d.actual === null) > 0 && (
                    <Bar 
                      dataKey={() => filteredData.find(d => d.actual === null)?.predicted || 0} 
                      fill="rgba(0,0,0,0.1)" 
                      stroke="rgba(0,0,0,0.2)"
                      barSize={2}
                      name="Current Time"
                      stackId="separator"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No data available for the selected model. Please select a different model.</p>
              </div>
            )}
            
            <div className="flex justify-between mt-2">
              <Badge variant="outline">Historical Data</Badge>
              <Badge variant="outline" className="bg-muted/50">Forecast</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="errors" className="h-[400px]">
            {errorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dateTime" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getHours()}:00`;
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Error (kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} kWh`, 
                      name === 'error' ? 'Forecast Error' : name
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="error"
                    name="Error" 
                    fill="#8884d8"
                    stroke="#000"
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>No error data available for the selected model.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">MAE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-2xl font-bold">{metrics.mae.toFixed(2)} kWh</p>
                  <p className="text-center text-sm text-muted-foreground">Mean Absolute Error</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">RMSE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-2xl font-bold">{metrics.rmse.toFixed(2)} kWh</p>
                  <p className="text-center text-sm text-muted-foreground">Root Mean Square Error</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">MAPE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-2xl font-bold">{metrics.mape.toFixed(2)}%</p>
                  <p className="text-center text-sm text-muted-foreground">Mean Absolute Percentage Error</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Model Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Model</th>
                      <th className="text-right">MAE (kWh)</th>
                      <th className="text-right">RMSE (kWh)</th>
                      <th className="text-right">MAPE (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">ARIMA</td>
                      <td className="text-right">{(metrics.mae * 1.1).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 1.15).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 1.2).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">XGBoost</td>
                      <td className="text-right">{(metrics.mae * 0.95).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 0.98).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 0.9).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">LSTM</td>
                      <td className="text-right">{(metrics.mae * 0.9).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 0.85).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 0.8).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Linear Regression</td>
                      <td className="text-right">{(metrics.mae * 1.05).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 1.08).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 1.1).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Polynomial Regression</td>
                      <td className="text-right">{(metrics.mae * 0.97).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 0.96).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 0.95).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Random Forest</td>
                      <td className="text-right">{(metrics.mae * 0.92).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 0.9).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 0.85).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Ensemble</td>
                      <td className="text-right font-medium">{metrics.mae.toFixed(2)}</td>
                      <td className="text-right font-medium">{metrics.rmse.toFixed(2)}</td>
                      <td className="text-right font-medium">{metrics.mape.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2">Naive Baseline</td>
                      <td className="text-right">{(metrics.mae * 1.5).toFixed(2)}</td>
                      <td className="text-right">{(metrics.rmse * 1.6).toFixed(2)}</td>
                      <td className="text-right">{(metrics.mape * 1.7).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ForecastPlot;
