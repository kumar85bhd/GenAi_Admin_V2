import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Activity, 
  Users, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const data = [
    { name: 'Mon', usage: 4000, errors: 2400, active: 2400 },
    { name: 'Tue', usage: 3000, errors: 1398, active: 2210 },
    { name: 'Wed', usage: 2000, errors: 9800, active: 2290 },
    { name: 'Thu', usage: 2780, errors: 3908, active: 2000 },
    { name: 'Fri', usage: 1890, errors: 4800, active: 2181 },
    { name: 'Sat', usage: 2390, errors: 3800, active: 2500 },
    { name: 'Sun', usage: 3490, errors: 4300, active: 2100 },
  ];

  const services = [
    { name: 'Gemini API', status: 'operational', latency: '120ms', uptime: '99.9%' },
    { name: 'User Auth', status: 'operational', latency: '45ms', uptime: '99.99%' },
    { name: 'Image Gen', status: 'degraded', latency: '850ms', uptime: '98.5%' },
    { name: 'Vector DB', status: 'operational', latency: '200ms', uptime: '99.9%' },
    { name: 'Analytics', status: 'maintenance', latency: '-', uptime: '-' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Requests</h3>
            <Activity className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">1.2M</p>
          <p className="text-xs text-green-500 mt-1 flex items-center">
            <span className="mr-1">↑</span> 12% from last week
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
            <Users className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">8,432</p>
          <p className="text-xs text-green-500 mt-1 flex items-center">
            <span className="mr-1">↑</span> 5% from last week
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Server Load</h3>
            <Server className="text-orange-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">42%</p>
          <p className="text-xs text-muted-foreground mt-1">Stable</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Errors</h3>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">0.05%</p>
          <p className="text-xs text-green-500 mt-1 flex items-center">
            <span className="mr-1">↓</span> 2% from last week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="active" stroke="var(--secondary-foreground)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Service Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-secondary-foreground uppercase bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-l-lg">Service Name</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Latency</th>
                  <th scope="col" className="px-6 py-3 rounded-r-lg">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.name} className="bg-card border-b border-border hover:bg-secondary transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {service.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {service.status === 'operational' && <CheckCircle className="text-green-500 mr-2" size={16} />}
                        {service.status === 'degraded' && <AlertTriangle className="text-yellow-500 mr-2" size={16} />}
                        {service.status === 'maintenance' && <Clock className="text-blue-500 mr-2" size={16} />}
                        {service.status === 'down' && <XCircle className="text-red-500 mr-2" size={16} />}
                        <span className="capitalize">{service.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{service.latency}</td>
                    <td className="px-6 py-4 font-mono text-xs">{service.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
