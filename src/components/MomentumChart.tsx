import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { momentumData } from '@/data/metrics';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-surface-border rounded-[10px] px-3.5 py-2.5 shadow-card-elevated">
      <p className="text-caption font-medium text-text-primary mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-caption text-text-secondary">
                {entry.dataKey === 'planned' ? 'Planned' : 'Actual'}
              </span>
            </div>
            <span className="text-caption font-semibold text-text-primary">
              {entry.value} min
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MomentumChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white p-6 rounded-xl border border-surface-border shadow-sm"
    >
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h3 className="text-[1.25rem] font-bold text-text-primary">Study momentum</h3>
          <p className="text-body-sm text-text-tertiary mt-1">Last 14 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-caption font-medium uppercase tracking-wider text-text-tertiary">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent/30" />
            <span className="text-caption font-medium uppercase tracking-wider text-text-tertiary">Actual</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={momentumData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradientPlanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#A1A1AA', fontFamily: 'Inter' }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#A1A1AA', fontFamily: 'Inter' }}
              dx={-4}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E4E4E7', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="planned"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#gradientPlanned)"
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#93C5FD"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#gradientActual)"
              dot={false}
              activeDot={{ r: 4, fill: '#93C5FD', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
