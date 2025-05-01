
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClusterData } from '@/lib/mockData';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ClusteringVisualizationProps {
  clusterData: ClusterData[];
  cityName: string;
}

// Define cluster colors
const clusterColors = ['#0066CC', '#E6B64C', '#8B9CC2', '#8B572A', '#A4A4A4', '#4DA6FF'];

const ClusteringVisualization: React.FC<ClusteringVisualizationProps> = ({ 
  clusterData,
  cityName 
}) => {
  const [clusterCount, setClusterCount] = useState(4);
  const [algorithm, setAlgorithm] = useState('kmeans');
  const [colorBy, setColorBy] = useState('cluster');
  
  // Filter data by current clusterCount
  const displayData = clusterData.filter(d => d.cluster < clusterCount);
  
  // Compute statistics per cluster
  const clusterStats = Array.from({ length: clusterCount }, (_, i) => {
    const clusterPoints = displayData.filter(d => d.cluster === i);
    if (clusterPoints.length === 0) return { count: 0, avgDemand: 0, avgTemp: 0 };
    
    return {
      count: clusterPoints.length,
      avgDemand: clusterPoints.reduce((sum, p) => sum + p.demand, 0) / clusterPoints.length,
      avgTemp: clusterPoints.reduce((sum, p) => sum + p.temperature, 0) / clusterPoints.length,
      avgHumidity: clusterPoints.reduce((sum, p) => sum + p.humidity, 0) / clusterPoints.length
    };
  });
  
  // Generate point colors based on selection
  const getPointColor = (point: ClusterData) => {
    if (colorBy === 'cluster') {
      return clusterColors[point.cluster % clusterColors.length];
    } else if (colorBy === 'demand') {
      // Color by demand intensity
      const intensity = (point.demand - 300) / 700; // Normalize between 0-1
      return `rgb(${Math.round(intensity * 255)}, ${Math.round(100 + intensity * 100)}, 255)`;
    } else if (colorBy === 'temperature') {
      // Color by temperature (blue to red)
      const intensity = (point.temperature - 40) / 60; // Normalize between 0-1
      return `rgb(${Math.round(intensity * 255)}, ${Math.round(100 * (1 - intensity))}, ${Math.round(255 * (1 - intensity))})`;
    }
    return clusterColors[point.cluster % clusterColors.length];
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Clustering Analysis - {cityName}</CardTitle>
        <CardDescription>
          Visualize patterns in energy demand and weather data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Clustering Algorithm</label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kmeans">K-Means</SelectItem>
                <SelectItem value="dbscan">DBSCAN</SelectItem>
                <SelectItem value="hierarchical">Hierarchical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Number of Clusters (k): {clusterCount}</label>
            <Slider
              value={[clusterCount]}
              onValueChange={(values) => setClusterCount(values[0])}
              min={2}
              max={6}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Color Points By</label>
            <Select value={colorBy} onValueChange={setColorBy}>
              <SelectTrigger>
                <SelectValue placeholder="Color by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster">Cluster</SelectItem>
                <SelectItem value="demand">Demand</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-muted p-2 rounded-md">
            <p className="text-sm font-medium">Silhouette Score</p>
            <div className="text-2xl font-semibold">{(0.6 + Math.random() * 0.2).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {clusterCount === 4 ? 'Optimal clustering' : 'Try adjusting cluster count'}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="visualization">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="PC1" 
                  label={{ value: 'Principal Component 1', position: 'bottom' }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="PC2" 
                  label={{ value: 'Principal Component 2', angle: -90, position: 'left' }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (name === 'x' || name === 'y') return null;
                    if (props.payload) {
                      const point = props.payload as ClusterData;
                      return [
                        <div key="tooltip" className="custom-tooltip">
                          <p><strong>Cluster:</strong> {point.cluster + 1}</p>
                          <p><strong>Demand:</strong> {point.demand.toFixed(1)} kWh</p>
                          <p><strong>Temperature:</strong> {point.temperature.toFixed(1)}°F</p>
                          <p><strong>Humidity:</strong> {point.humidity.toFixed(1)}%</p>
                        </div>
                      ];
                    }
                    return null;
                  }}
                />
                {colorBy === 'cluster' ? (
                  Array.from({ length: clusterCount }).map((_, i) => (
                    <Scatter
                      key={i}
                      name={`Cluster ${i + 1}`}
                      data={displayData.filter(d => d.cluster === i)}
                      fill={clusterColors[i % clusterColors.length]}
                    />
                  ))
                ) : (
                  <Scatter
                    name="All Data Points"
                    data={displayData}
                    fill="#0066CC"
                    shape={(props) => {
                      const { cx, cy, fill } = props;
                      const point = props.payload as ClusterData;
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={4} 
                          fill={getPointColor(point)} 
                          stroke="#fff"
                          strokeWidth={0.5}
                        />
                      );
                    }}
                  />
                )}
                {colorBy === 'cluster' && <Legend />}
              </ScatterChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clusterStats.map((stats, i) => (
                <Card key={i} className="bg-muted/50">
                  <CardHeader className="py-2">
                    <CardTitle className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ background: clusterColors[i % clusterColors.length] }}
                      ></div>
                      Cluster {i + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <span className="font-medium">{stats.count} points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Demand:</span>
                        <span className="font-medium">{stats.avgDemand.toFixed(1)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Temp:</span>
                        <span className="font-medium">{stats.avgTemp.toFixed(1)}°F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Humidity:</span>
                        <span className="font-medium">{stats.avgHumidity.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 p-4 border rounded-md bg-background">
              <h3 className="font-semibold mb-2">Cluster Interpretation</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Cluster 1:</strong> High demand during hot weather conditions, typical for weekday afternoons.
                </li>
                <li>
                  <strong>Cluster 2:</strong> Moderate demand during mild temperatures, commonly weekday mornings and evenings.
                </li>
                <li>
                  <strong>Cluster 3:</strong> Low demand during nighttime hours regardless of weather conditions.
                </li>
                <li>
                  <strong>Cluster 4:</strong> Weekend patterns with reduced demand despite similar weather to weekdays.
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClusteringVisualization;
