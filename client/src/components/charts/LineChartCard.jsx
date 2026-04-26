import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../common/Card";

export const LineChartCard = ({ title, data, dataKey, color = "#1a87ff" }) => (
  <Card>
    <h3 className="mb-5 font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.45} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill="url(#chartFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
