"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BehaviorChartProps {
  data: Array<{
    date: string;
    focus: number;
    motivation: number;
    stress: number;
  }>;
}

export default function BehaviorChart({ data }: BehaviorChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Behavior Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="focus"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Focus"
            />
            <Line
              type="monotone"
              dataKey="motivation"
              stroke="#10b981"
              strokeWidth={2}
              name="Motivation"
            />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#ef4444"
              strokeWidth={2}
              name="Stress"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
