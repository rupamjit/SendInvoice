"use client";
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";

interface iAppProps {
  data: {
    date: string;
    paid: number;
    pending: number;
    draft: number;
  }[];
}

const Graph = ({ data }: iAppProps) => {
  return (
    <ChartContainer
      config={{
        paid: {
          label: "Paid",
          color: "#22c55e", // Green
        },
        pending: {
          label: "Pending",
          color: "#f59e0b", // Orange
        },
        draft: {
          label: "Draft",
          color: "#6b7280", // Gray
        },
      }}
      className="min-h-[300px]"
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        
        {/* Multiple Lines for each status */}
        <Line
          type="monotone"
          dataKey="paid"
          stroke="var(--color-paid)"
          strokeWidth={2}
          dot={{ fill: "var(--color-paid)" }}
        />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="var(--color-pending)"
          strokeWidth={2}
          dot={{ fill: "var(--color-pending)" }}
        />
        <Line
          type="monotone"
          dataKey="draft"
          stroke="var(--color-draft)"
          strokeWidth={2}
          dot={{ fill: "var(--color-draft)" }}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default Graph;
