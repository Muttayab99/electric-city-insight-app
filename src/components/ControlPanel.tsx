
import React from 'react';
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
            <Select defaultValue="ensemble">
              <SelectTrigger id="forecast-model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arima">ARIMA</SelectItem>
                <SelectItem value="xgboost">XGBoost</SelectItem>
                <SelectItem value="lstm">LSTM</SelectItem>
                <SelectItem value="ensemble">Ensemble</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="forecast-horizon">Forecast Horizon</Label>
              <span className="text-sm">24 hours</span>
            </div>
            <Slider
              id="forecast-horizon"
              defaultValue={[24]}
              max={72}
              min={8}
              step={8}
              className="mt-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="use-temperature" defaultChecked />
              <Label htmlFor="use-temperature">Temperature</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="use-humidity" defaultChecked />
              <Label htmlFor="use-humidity">Humidity</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="use-wind" defaultChecked />
              <Label htmlFor="use-wind">Wind Speed</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="use-tod" defaultChecked />
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
            
            <Button onClick={onRefresh}>
              Run Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
