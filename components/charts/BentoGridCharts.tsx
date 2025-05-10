"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const areaChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
];

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(215, 70%, 50%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(25, 70%, 50%)",
  },
} satisfies ChartConfig;

const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "hsl(215, 70%, 50%)" },
  { browser: "safari", visitors: 200, fill: "hsl(25, 70%, 50%)" },
  { browser: "firefox", visitors: 287, fill: "hsl(145, 70%, 50%)" },
  { browser: "edge", visitors: 173, fill: "hsl(280, 70%, 50%)" },
  { browser: "other", visitors: 190, fill: "hsl(355, 70%, 50%)" },
];

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(215, 70%, 50%)",
  },
  safari: {
    label: "Safari",
    color: "hsl(25, 70%, 50%)",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(145, 70%, 50%)",
  },
  edge: {
    label: "Edge",
    color: "hsl(280, 70%, 50%)",
  },
  other: {
    label: "Other",
    color: "hsl(355, 70%, 50%)",
  },
} satisfies ChartConfig;

export function BentoGridCharts() {
  const totalVisitors = React.useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto mb-12">
      <Card>
        <CardHeader>
          <CardTitle>Platform Usage</CardTitle>
          <CardDescription>Desktop vs Mobile Traffic</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart data={areaChartData} className="h-5">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing platform distribution for the last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* Pie Chart - Donut with Text */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Browser Distribution</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieChartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Browser usage statistics for all visitors
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
