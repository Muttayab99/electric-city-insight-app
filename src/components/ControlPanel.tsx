
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calendar } from 'lucide-react';

interface ControlPanelProps {
  onRefresh: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onRefresh 
}) => {
  // Add state for all control parameters
  const [forecastModel, setForecastModel] = useState('ensemble');
  const [forecastHorizon, setForecastHorizon] = useState<number[]>([24]);
  const [useTemperature, setUseTemperature] = useState(true);
  const [useHumidity, setUseHumidity] = useState(true);
  const [useWind, setUseWind] = useState(true);
  const [useTimeOfDay, setUseTimeOfDay] = useState(true);

  // Function to handle the run analysis action
  const handleRunAnalysis = () => {
    // Package all parameters to pass to the refresh handler
    const params = {
      model: forecastModel,
      horizon: forecastHorizon[0],
      features: {
        temperature: useTemperature,
        humidity: useHumidity,
        wind: useWind,
        timeOfDay: useTimeOfDay
      }
    };
    
    console.log('Analysis parameters:', params);
    
    // Call the parent's refresh handler with the parameters
    onRefresh();
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Analysis Controls</CardTitle>
        <CardDescription>
          Configure parameters for data analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="forecast-model">Forecast Model</Label>
            <Select 
              value={forecastModel} 
              onValueChange={setForecastModel}
            >
              <SelectTrigger id="forecast-model">
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
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="forecast-horizon">Forecast Horizon</Label>
              <span className="text-sm">{forecastHorizon[0]} hours</span>
            </div>
            <Slider
              id="forecast-horizon"
              value={forecastHorizon}
              onValueChange={setForecastHorizon}
              max={72}
              min={8}
              step={8}
              className="mt-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-temperature" 
                checked={useTemperature}
                onCheckedChange={setUseTemperature}
              />
              <Label htmlFor="use-temperature">Temperature</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-humidity" 
                checked={useHumidity}
                onCheckedChange={setUseHumidity}
              />
              <Label htmlFor="use-humidity">Humidity</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-wind" 
                checked={useWind}
                onCheckedChange={setUseWind}
              />
              <Label htmlFor="use-wind">Wind Speed</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-tod" 
                checked={useTimeOfDay}
                onCheckedChange={setUseTimeOfDay}
              />
              <Label htmlFor="use-tod">Time-of-Day</Label>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <Label>Date Range</Label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground cursor-help">
                      Last 7 days - Today
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Click to choose different date range for analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="mr-2">
                    Documentation
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Read more about clustering and forecasting methods</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button onClick={handleRunAnalysis}>
              Run Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
