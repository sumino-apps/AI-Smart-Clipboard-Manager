import { useMemo } from "react";
import {
  BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { useClipboardStore } from "../store/clipboardStore";
import type { ClipboardCategory } from "../types/clipboard.types";
import { cn } from "../../../shared/lib/utils";
import { TrendingUp, Copy, Calendar, AlignLeft } from "lucide-react";

const CATEGORY_COLORS: Record<ClipboardCategory, string> = {
  link:    "#3b82f6",
  email:   "#8b5cf6",
  otp:     "#f97316",
  code:    "#10b981",
  phone:   "#14b8a6",
  text:    "#94a3b8",
  unknown: "#64748b",
};

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function ActivityHeatmap({ dailyActivity }: { dailyActivity: Record<string, number> }) {
  const days = useMemo(() => {
    const result: { date: string; count: number; label: string }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0] ?? "";
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      result.push({ date: key, count: dailyActivity[key] ?? 0, label });
    }
    return result;
  }, [dailyActivity]);

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-slate-200 dark:bg-slate-700";
    const ratio = count / maxCount;
    if (ratio < 0.25) return "bg-indigo-200 dark:bg-indigo-800";
    if (ratio < 0.5)  return "bg-indigo-400 dark:bg-indigo-600";
    if (ratio < 0.75) return "bg-indigo-600 dark:bg-indigo-500";
    return "bg-indigo-700 dark:bg-indigo-400";
  };

  return (
    <div className="flex flex-wrap gap-1">
      {days.map((day) => (
        <div
          key={day.date}
          title={`${day.label}: ${day.count} items`}
          className={cn("w-4 h-4 rounded-sm transition-colors", getIntensity(day.count))}
        />
      ))}
    </div>
  );
}

export function AnalyticsPanel() {
  const getAnalytics = useClipboardStore((s) => s.getAnalytics);
  const analytics = getAnalytics();

  const barData = useMemo(() => {
    return (Object.entries(analytics.categoryBreakdown) as [ClipboardCategory, number][])
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({ category, count }));
  }, [analytics.categoryBreakdown]);

  return (
    <div className="space-y-5 p-4 border-t border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        Analytics
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={TrendingUp} label="Total Items"  value={analytics.totalItems} />
        <StatCard icon={Copy}       label="Total Copies" value={analytics.totalCopies} />
        <StatCard icon={Calendar}   label="Today"        value={analytics.todayCount} />
        <StatCard icon={AlignLeft}  label="Avg Length"   value={`${analytics.avgCharLength} chars`} />
      </div>

      {/* Category Breakdown Bar Chart */}
      {barData.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">By Category</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map(({ category }) => (
                  <Cell key={category} fill={CATEGORY_COLORS[category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Activity Heatmap */}
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Last 30 Days</p>
        <ActivityHeatmap dailyActivity={analytics.dailyActivity} />
      </div>

      {/* Most Copied */}
      {analytics.mostCopiedItem && (
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Most Copied</p>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 font-mono break-all line-clamp-3">
            {analytics.mostCopiedItem.content.slice(0, 120)}
            {analytics.mostCopiedItem.content.length > 120 && "..."}
          </div>
          <p className="text-xs text-slate-400 mt-1">{analytics.mostCopiedItem.copyCount}× copied</p>
        </div>
      )}
    </div>
  );
}