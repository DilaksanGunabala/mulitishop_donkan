import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminAnalytics({ products }) {
  const data = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const ts = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt || Date.now());
      const key = ts.toLocaleString('default', { month: 'short', year: '2-digit' });
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([month, count]) => ({ month, count }));
  }, [products]);

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">No data yet</p>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Products Added" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
