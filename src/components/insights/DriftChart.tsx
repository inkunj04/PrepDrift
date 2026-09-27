import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { DailyDriftDistribution } from '@/types/analytics';

interface DriftChartProps {
  data: DailyDriftDistribution[];
}

export function DriftChart({ data }: DriftChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-8 rounded-xl border border-surface-border shadow-sm flex flex-col h-full min-w-0"
    >
      <div className="mb-8">
        <h3 className="text-[1.25rem] font-bold text-text-primary mb-1">Drift accumulation</h3>
        <p className="text-body-sm text-text-tertiary">User distribution over first 7 days</p>
      </div>

      <div className="flex-1 min-h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorWatch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D97706" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#71717A', fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#71717A', fontWeight: 600 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E4E4E7',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                fontSize: '12px',
                padding: '12px',
                fontWeight: 600
              }}
              itemStyle={{ paddingTop: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="stable"
              name="Stable"
              stackId="1"
              stroke="#16A34A"
              fill="url(#colorStable)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="watch"
              name="Watch"
              stackId="1"
              stroke="#D97706"
              fill="url(#colorWatch)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="drifting"
              name="Drifting"
              stackId="1"
              stroke="#DC2626"
              fill="url(#colorDrift)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              name="High Risk"
              stackId="1"
              stroke="#991B1B"
              fill="#991B1B"
              fillOpacity={0.2}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-8 mt-8 border-t border-surface-border pt-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-status-healthy" />
          <span className="text-[0.6875rem] font-bold text-text-secondary uppercase tracking-widest">Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-status-warning" />
          <span className="text-[0.6875rem] font-bold text-text-secondary uppercase tracking-widest">Watch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-status-critical" />
          <span className="text-[0.6875rem] font-bold text-text-secondary uppercase tracking-widest">Drifting</span>
        </div>
      </div>
    </motion.div>
  );
}
