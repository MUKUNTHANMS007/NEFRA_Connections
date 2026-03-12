import React, { FC, useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DollarSign, Repeat2, TrendingUp, BarChart, Clock } from 'lucide-react';

// --- SUB-COMPONENT 1: METRIC CARD ---
const MetricCard = ({ title, value, unit = '', icon, description, valueClassName }: any) => (
  <Card className="flex-1 min-w-[250px] bg-slate-900/40 border-white/10 backdrop-blur-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${valueClassName || 'text-white'}`}>
        {unit}{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      {description && <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{description}</p>}
    </CardContent>
  </Card>
);

// --- SUB-COMPONENT 2: REALTIME CHART ---
const RealtimeChart = ({ data, title, dataKey, lineColor, legendName }: any) => (
  <Card className="flex-1 min-w-[300px] bg-slate-900/40 border-white/10 backdrop-blur-md p-4">
    <CardHeader className="px-2">
      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white">
        <BarChart className="h-4 w-4 text-blue-400" /> {title}
      </CardTitle>
    </CardHeader>
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${val}`} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={lineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

// --- MAIN DASHBOARD COMPONENT ---
export const SalesDashboard: FC = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(45200);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const newAmount = Math.floor(Math.random() * 500) + 100;
      setRevenue(prev => prev + newAmount);
      setSalesData(prev => [...prev.slice(-15), { time: timeStr, sales: newAmount }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Total Revenue" value={revenue} unit="$" icon={<DollarSign className="h-4 w-4 text-emerald-400" />} valueClassName="text-emerald-400" />
        <MetricCard title="Avg. Transaction" value={revenue / 124} unit="$" icon={<TrendingUp className="h-4 w-4 text-blue-400" />} valueClassName="text-blue-400" />
        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">System Link</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white uppercase tracking-tighter">Live_Uplink</div>
            <p className="text-[10px] text-emerald-500 mt-1 font-mono uppercase">Streaming data active</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <RealtimeChart data={salesData} title="Market Velocity" dataKey="sales" lineColor="#3b82f6" />
      </div>
    </div>
  );
};