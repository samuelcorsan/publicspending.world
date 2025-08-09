"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
import { useTranslations } from "next-intl";

const chartColors = [
  "hsl(215, 70%, 50%)", // Blue
  "hsl(25, 70%, 50%)", // Orange
  "hsl(145, 70%, 50%)", // Green
  "hsl(280, 70%, 50%)", // Purple
  "hsl(355, 70%, 50%)", // Red
  "hsl(55, 70%, 50%)", // Yellow
  "hsl(185, 70%, 50%)", // Cyan
  "hsl(325, 70%, 50%)", // Pink
  "hsl(95, 70%, 50%)", // Lime
  "hsl(245, 70%, 50%)", // Indigo
];

interface RevenueItem {
  name: string;
  amount: number;
  subtype: string;
}

interface CountryData {
  name: string;
  currency: string;
  revenue: RevenueItem[];
}

export function RevenuePieChart({ countryData }: { countryData: CountryData }) {
  const t = useTranslations("CountryPage");

  const chartData = React.useMemo(() => {
    return countryData.revenue
      .filter((item) => item.subtype !== "total")
      .map((item, index) => ({
        name: item.name,
        value: item.amount / 1e9, // Convert to billions
        fill: chartColors[index % chartColors.length],
      }));
  }, [countryData]);

  const totalRevenue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const chartConfig = chartData.reduce((acc, curr, index) => {
    acc[curr.name] = {
      label: curr.name,
      color: chartColors[index % chartColors.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("overview.revenueTitle")}</CardTitle>
        <CardDescription>Fiscal Year 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
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
                          {totalRevenue.toFixed(0)}B
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {countryData.currency}
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
        <div className="leading-none text-muted-foreground">
          {t("overview.revenueBreakdown")}
        </div>
      </CardFooter>
    </Card>
  );
}
