"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function RevenueForecast({ revenue }: { revenue: any[] }) {
  // Prepare chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  // Get the last 9 months of data
  const labels = [];
  for (let i = 0; i < 9; i++) {
    const monthIndex = (currentMonth - 8 + i + 12) % 12;
    labels.push(months[monthIndex]);
  }
  
  // Map revenue data to months
  const revenueData = labels.map(month => {
    const monthData = revenue.find((r: any) => r.month === month);
    return monthData ? monthData.amount : 0;
  });
  
  const data = {
    labels,
    datasets: [
      {
        data: revenueData,
        backgroundColor: "#7E57C2", // Purple
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          callback: function(value: any) {
            return `$${value/1000}k`;
          }
        }
      },
    },
  };
  
  // Calculate summary statistics
  const monthlyRevenue = revenue.reduce((sum, item) => sum + item.amount, 0) / revenue.length;
  const closedDealsValue = revenue.reduce((sum, item) => sum + (item.closedDeals || 0), 0);
  const targetGap = revenue[revenue.length - 1]?.targetGap || 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Revenue Forecast</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="h-64">
            <Bar data={data} options={options} />
          </div>
        </div>
        <div className="space-y-4 min-w-48">
          <div>Monthly Revenue this Month: ${monthlyRevenue.toLocaleString()}</div>
          <div>Closed Deals Value: {closedDealsValue.toLocaleString()}</div>
          <div>Amount Missing to Hit Month Target: {targetGap}</div>
        </div>
      </CardContent>
    </Card>
  );
}