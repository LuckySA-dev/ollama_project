"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useTheme } from "@/components/theme/ThemeProvider";

interface ProgressData {
  week: Date;
  focusScore: number;
  motivationScore: number;
  stressLevel: number;
  consistencyScore: number;
  sessionCount: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  metric: "focus" | "motivation" | "stress" | "consistency" | "all";
}

export default function ProgressChart({ data, metric }: ProgressChartProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";

  // Format data for chart
  const chartData = data.map((item) => ({
    date: format(new Date(item.week), "d MMM", { locale: th }),
    สมาธิ: item.focusScore,
    แรงจูงใจ: item.motivationScore,
    ความเครียด: item.stressLevel,
    ความสม่ำเสมอ: item.consistencyScore,
  }));

  // Define colors with dark mode variants
  const colors = {
    focus: isDark ? "#60a5fa" : "#3b82f6",      // blue
    motivation: isDark ? "#34d399" : "#10b981", // green
    stress: isDark ? "#f87171" : "#ef4444",     // red
    consistency: isDark ? "#a78bfa" : "#8b5cf6", // purple
  };

  // Chart styling based on theme
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const textColor = isDark ? "#d1d5db" : "#374151";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          style={{ fontSize: "12px", fill: textColor }}
          stroke={textColor}
        />
        <YAxis
          domain={[0, 100]}
          style={{ fontSize: "12px", fill: textColor }}
          stroke={textColor}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: "8px",
            color: textColor,
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />

        {(metric === "focus" || metric === "all") && (
          <Line
            type="monotone"
            dataKey="สมาธิ"
            stroke={colors.focus}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}

        {(metric === "motivation" || metric === "all") && (
          <Line
            type="monotone"
            dataKey="แรงจูงใจ"
            stroke={colors.motivation}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}

        {(metric === "stress" || metric === "all") && (
          <Line
            type="monotone"
            dataKey="ความเครียด"
            stroke={colors.stress}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}

        {(metric === "consistency" || metric === "all") && (
          <Line
            type="monotone"
            dataKey="ความสม่ำเสมอ"
            stroke={colors.consistency}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
