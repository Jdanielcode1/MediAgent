"use client";

import { MoreVertical, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueForecast({ revenue }: { revenue: any[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Actual Revenue',
        data: [30000, 35000, 40000, 45000, 50000, 60000, null, null, null],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Forecast',
        data: [null, null, null, null, null, 60000, 70000, 75000, 80000],
        borderColor: 'rgba(209, 213, 219, 1)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.3,
      }
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Revenue Forecast</CardTitle>
          <p className="text-sm text-gray-500">WoundTrack Pro sales projection</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="bg-blue-50 border-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Monthly Revenue</div>
                  <div className="text-xl font-bold">$60,000</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Q3 Projection</div>
                  <div className="text-xl font-bold">$225,000</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Annual Target</div>
                  <div className="text-xl font-bold">$750,000</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-[250px]">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}