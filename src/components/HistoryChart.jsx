"use client";

import React, { useContext, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardContext from "@/context/DashboardContext";

export function HistoryChart() {
  const { history } = useContext(DashboardContext); // Fetch history data from context

  // Process data to show top 5 products by percentage of units sold
  const formattedData = useMemo(() => {
    if (!history || history.length === 0) return [];

    // Sort products by the percentage of units sold (unitsSold / totalStock) in descending order and pick the top 5
    const topProducts = [...history]
      .map((product) => ({
        ...product,
        percentageSold:
          product["Total Stock"] > 0 ? (product["Unit Sold"] / product["Total Stock"]) * 100 : 0,
      }))
      .sort((a, b) => b.percentageSold - a.percentageSold)
      .slice(0, 5);

    // Transform data to fit the chart format
    return topProducts.map((product) => ({
      month: product.Month,
      name: product["Product Name"],
      stock: product["Total Stock"] || 0,
      sold: product["Unit Sold"] || 0,
      percentageSold: product.percentageSold || 0,
    }));
  }, [history]);

  // Fallback if no data is available
  if (!formattedData || formattedData.length === 0) {
    return <div className="text-center text-gray-500">No historical data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Products - Monthly Overview</CardTitle>
        <CardDescription>Stock and Sales for Top Products by Percentage Sold</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          width={800}
          height={400}
          data={formattedData}
          layout="vertical" // Switch to a vertical bar chart
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" /> {/* Numeric axis for stock/sales */}
          <YAxis
            type="category"
            dataKey="name" // Use product name on Y-axis
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" name="Total Stock" fill="#3182CE" />
          <Bar dataKey="sold" name="Units Sold" fill="#E53E3E" />
          <Bar dataKey="percentageSold" name="Percentage Sold" fill="#48BB78" /> {/* New bar for percentage sold */}
        </BarChart>
      </CardContent>
    </Card>
  );
}
