import React, { FC, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, BarChart, Clock } from 'lucide-react';

const MetricCard = ({ title, value, unit = '', icon, valueClassName }: any) => (
  <Card className="flex-1 bg-slate-900/40 border-white/10 backdrop-blur-md">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-black ${valueClassName || 'text-white'}`}>
        {unit}{value.toLocaleString()}
      </div>
    </CardContent>
  </Card>
);

const RealtimeChart = ({ data, title, dataKey, lineColor }: any) => (
  <Card className="flex-1 bg-slate-900/40 border-white/10 backdrop-blur-md p-6">
    <div className="flex items-center gap-2 mb-4">
      <BarChart className="h-4 w-4 text-blue-400" />
      <h3 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h3>
    </div>
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
          <Line type="monotone" dataKey={dataKey} stroke={lineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export const SalesDashboard: FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [rev, setRev] = useState(1240500);

  useEffect(() => {
    const interval = setInterval(() => {
      const val = Math.floor(Math.random() * 800) + 100;
      setRev(p => p + val);
      setData(p => [...p.slice(-15), { time: new Date().toLocaleTimeString(), sales: val }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Revenue Stream" value={rev} unit="$" icon={<DollarSign className="h-4 w-4 text-emerald-400" />} valueClassName="text-emerald-400" />
        <MetricCard title="System Node Velocity" value={rev / 340} icon={<TrendingUp className="h-4 w-4 text-blue-400" />} valueClassName="text-blue-400" />
        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-md p-4">
          <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase">Uplink</span><Clock className="h-3 w-3 text-emerald-500 animate-pulse" /></div>
          <div className="text-xl font-black text-emerald-400 mt-2 tracking-tighter uppercase">Active_Link</div>
        </Card>
      </div>
      <RealtimeChart data={data} title="Transactional Flux" dataKey="sales" lineColor="#6366f1" />
    </div>
  );
};