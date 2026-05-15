import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  Award, 
  Clock, 
  TrendingUp, 
  Activity,
  ChevronRight,
  Shield
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import useAuthStore from '../store/useAuthStore';

const data = [
  { name: 'Mon', attendance: 85, drill: 70 },
  { name: 'Tue', attendance: 88, drill: 75 },
  { name: 'Wed', attendance: 92, drill: 80 },
  { name: 'Thu', attendance: 90, drill: 85 },
  { name: 'Fri', attendance: 95, drill: 90 },
  { name: 'Sat', attendance: 87, drill: 88 },
  { name: 'Sun', attendance: 94, drill: 92 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    'accent-gold': 'text-accent-gold bg-accent-gold/10',
    'primary-green': 'text-primary-green bg-primary-green/10',
    'blue': 'text-blue-400 bg-blue-400/10',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClasses[color]?.split(' ')[0]}`}>
        <Icon size={80} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon size={20} />
          </div>
          <h4 className="text-xs font-orbitron text-slate-400 uppercase tracking-widest">{title}</h4>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-3xl font-orbitron font-bold text-white">{value}</p>
          <span className="text-xs text-green-400 font-poppins flex items-center gap-1 mb-1">
            <TrendingUp size={12} /> {trend}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const isAno = user?.role === 'ano';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">
            {isAno ? 'Command Center Dashboard' : 'Cadet Operational Dossier'}
          </h1>
          <p className="text-sm text-slate-500 font-poppins uppercase tracking-widest">
            Unit: {user?.unit || '1 Maharashtra Bn'} | Status: <span className="text-green-500">Active Duty</span>
          </p>
        </div>
        <button className="military-btn flex items-center gap-2 text-sm px-4 py-2">
          GENERATE OPS REPORT <Activity size={16} />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title={isAno ? "Total Cadets" : "Attendance Score"} 
          value={isAno ? "1,248" : "94%"} 
          icon={isAno ? Users : CheckCircle} 
          color="accent-gold" 
          trend="+12%" 
        />
        <StatCard 
          title="Camp Medals" 
          value="12" 
          icon={Award} 
          color="accent-gold" 
          trend="+2" 
        />
        <StatCard 
          title="Drill Proficiency" 
          value="A+" 
          icon={Shield} 
          color="accent-gold" 
          trend="Elite" 
        />
        <StatCard 
          title="Service Hours" 
          value="420" 
          icon={Clock} 
          color="accent-gold" 
          trend="+40h" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-slate-400">Unit Performance Analytics</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-[10px] text-accent-gold font-orbitron">
                <div className="w-2 h-2 rounded-full bg-accent-gold" /> ATTENDANCE
              </span>
              <span className="flex items-center gap-2 text-[10px] text-primary-green font-orbitron">
                <div className="w-2 h-2 rounded-full bg-primary-green" /> DRILL SCORE
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#D4AF37" fillOpacity={1} fill="url(#colorAtt)" />
                <Area type="monotone" dataKey="drill" stroke="#1F6F50" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed / Radar */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-slate-400 mb-6">Unit activity Feed</h3>
          <div className="flex-1 space-y-6">
            {[
              { type: 'CAMP', msg: 'CATC-I registration is now open for Alpha Unit.', time: '2h ago' },
              { type: 'AWARD', msg: 'Cdt. Rahul Sharma promoted to Sergeant.', time: '5h ago' },
              { type: 'DRILL', msg: 'Morning Parade attendance finalized.', time: '8h ago' },
              { type: 'SYSTEM', msg: 'Geo-fencing radius updated for Parade Ground.', time: '1d ago' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="w-1 h-10 bg-accent-gold/20 rounded-full group-hover:bg-accent-gold transition-colors" />
                <div className="space-y-1">
                  <p className="text-[10px] font-orbitron text-accent-gold">{activity.type}</p>
                  <p className="text-xs text-slate-300 font-poppins">{activity.msg}</p>
                  <p className="text-[10px] text-slate-600 uppercase">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 text-[10px] font-orbitron text-accent-gold hover:underline flex items-center gap-2 uppercase tracking-widest">
            View All Intel <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
