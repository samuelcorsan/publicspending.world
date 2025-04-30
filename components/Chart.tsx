// Will soon be used in the landing
"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", gdpPerCapita: 186 },
  { month: "February", gdpPerCapita: 305 },
  { month: "March", gdpPerCapita: 237 },
  { month: "April", gdpPerCapita: 73 },
  { month: "May", gdpPerCapita: 209 },
  { month: "June", gdpPerCapita: 214 },
];

const chartConfig = {
  gdpPerCapita: {
    label: "GDP/capita",
    color: "hsl(145, 70%, 50%)",
  },
} satisfies ChartConfig;

export function FeaturedCountryChart() {
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Area Chart - Gradient</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillGdpPerCapita" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gdpPerCapita)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gdpPerCapita)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="gdpPerCapita"
              type="natural"
              fill="url(#fillGdpPerCapita)"
              fillOpacity={0.4}
              stroke="var(--color-gdpPerCapita)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
