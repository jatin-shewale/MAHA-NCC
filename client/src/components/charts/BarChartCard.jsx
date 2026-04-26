import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../common/Card";

export const BarChartCard = ({ title, data, dataKey }) => (
  <Card>
    <h3 className="mb-5 font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#b88a2f" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
