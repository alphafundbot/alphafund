
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { time: "10:00", incoming: 186, outgoing: 80 },
  { time: "10:05", incoming: 305, outgoing: 200 },
  { time: "10:10", incoming: 237, outgoing: 120 },
  { time: "10:15", incoming: 73, outgoing: 190 },
  { time: "10:20", incoming: 209, outgoing: 130 },
  { time: "10:25", incoming: 214, outgoing: 140 },
  { time: "10:30", incoming: 423, outgoing: 210 },
  { time: "10:35", incoming: 350, outgoing: 250 },
  { time: "10:40", incoming: 280, outgoing: 180 },
  { time: "10:45", incoming: 390, outgoing: 290 },
]

const chartConfig = {
  signals: {
    label: "Signals",
  },
  incoming: {
    label: "Incoming",
    color: "hsl(var(--chart-2))",
  },
  outgoing: {
    label: "Outgoing",
    color: "hsl(var(--chart-1))",
  },
}

export function SignalChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={3}
         />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
            <linearGradient id="fillIncoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-incoming)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-incoming)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="fillOutgoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-outgoing)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-outgoing)" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          dataKey="incoming"
          type="natural"
          fill="url(#fillIncoming)"
          stroke="var(--color-incoming)"
          stackId="a"
        />
        <Area
          dataKey="outgoing"
          type="natural"
          fill="url(#fillOutgoing)"
          stroke="var(--color-outgoing)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
