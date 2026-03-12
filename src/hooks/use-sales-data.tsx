import { useState, useEffect } from 'react';

export function useSalesData(initialValue: number = 0) {
  const [data, setData] = useState(initialValue);
  const [trend, setTrend] = useState(0);

  useEffect(() => {
    // This simulates a real-time data stream (WebSockets/Polling)
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.4) * 100; // Random up/down
      setData((prev) => Math.max(0, prev + fluctuation));
      setTrend(fluctuation);
    }, 3000); // Updates every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return { 
    currentValue: data.toLocaleString(undefined, { maximumFractionDigits: 0 }), 
    trend: trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`,
    isPositive: trend > 0 
  };
}