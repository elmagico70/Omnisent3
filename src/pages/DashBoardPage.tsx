import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  HardDrive,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Server as Memory,
  Wifi,
  Server,
  Terminal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Eye,
  Database,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Tipos
interface SystemStat {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  trend: number;
}

interface ActivityLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  module: string;
}

// Mock data generators
const generateSystemStats = (): SystemStat[] => [
  {
    label: 'CPU Usage',
    value: Math.floor(Math.random() * 40 + 30),
    unit: '%',
    icon: Cpu,
    color: 'from-omni-cyan to-blue-600',
    trend: Math.random() > 0.5 ? 1 : -1,
  },
  {
    label: 'Memory',
    value: Number((Math.random() * 64 + 32).toFixed(1)),
    unit: 'GB',
    icon: Memory,
    color: 'from-omni-green to-emerald-600',
    trend: Math.random() > 0.5 ? 1 : -1,
  },
  {
    label: 'Storage',
    value: Math.floor(Math.random() * 500 + 1500),
    unit: 'GB',
    icon: HardDrive,
    color: 'from-omni-purple to-pink-600',
    trend: -1,
  },
  {
    label: 'Network',
    value: Number((Math.random() * 100 + 50).toFixed(1)),
    unit: 'Mb/s',
    icon: Wifi,
    color: 'from-omni-yellow to-orange-600',
    trend: 1,
  },
];

const generateActivityLogs = (): ActivityLog[] => {
  const activities = [
    { type: 'info' as const, message: 'System scan completed', module: 'Security' },
    { type: 'success' as const, message: 'Database backup successful', module: 'Backup' },
    { type: 'warning' as const, message: 'High memory usage detected', module: 'Monitor' },
    { type: 'error' as const, message: 'Failed to connect to API', module: 'Network' },
    { type: 'info' as const, message: 'User authentication successful', module: 'Auth' },
    { type: 'success' as const, message: 'Cache cleared successfully', module: 'System' },
  ];

  return activities.slice(0, 5).map((act, idx) => ({
    ...act,
    id: `log-${idx}`,
    timestamp: new Date(Date.now() - idx * 60000 * Math.random() * 10),
  }));
};

// Componentes
const SystemStatCard: React.FC<{ stat: SystemStat; index: number }> = ({ stat, index }) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setCurrentValue(stat.value), index * 100);
    return () => clearTimeout(timer);
  }, [stat.value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="omni-card group relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            {stat.trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-omni-green" />
            ) : (
              <TrendingUp className="w-4 h-4 text-omni-red rotate-180" />
            )}
            <span className={cn(
              "text-xs font-medium",
              stat.trend > 0 ? "text-omni-green" : "text-omni-red"
            )}>
              {stat.trend > 0 ? '+' : ''}{(Math.random() * 10).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-omni-text tabular-nums">
            {currentValue}
            <span className="text-lg font-normal text-omni-textDim ml-1">{stat.unit}</span>
          </h3>
          <p className="text-sm text-omni-textDim">{stat.label}</p>
          
          {/* Progress bar */}
          <div className="h-1 bg-omni-surface2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentValue / 100) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full bg-gradient-to-r ${stat.color}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityFeed: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => {
  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Activity;
    }
  };

  const getColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success': return 'text-omni-green';
      case 'error': return 'text-omni-red';
      case 'warning': return 'text-omni-yellow';
      default: return 'text-omni-cyan';
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {logs.map((log, index) => {
          const Icon = getIcon(log.type);
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-omni-surface/50 border border-omni-border hover:border-omni-cyan/30 transition-all"
            >
              <Icon className={cn("w-5 h-5 mt-0.5", getColor(log.type))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-omni-cyan">
                    {log.module}
                  </span>
                  <span className="text-xs text-omni-textDim">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-omni-text">{log.message}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const LiveChart: React.FC = () => {
  const [data, setData] = useState<number[]>(Array(20).fill(0));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [...prev.slice(1), Math.random() * 100]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const max = Math.max(...data);
  const points = data.map((d, i) => `${i * 5},${100 - (d / max) * 100}`).join(' ');

  return (
    <div className="relative h-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#00D9FF"
          strokeWidth="2"
          points={points}
          className="drop-shadow-[0_0_5px_rgba(0,217,255,0.5)]"
        />
        <polygon
          fill="url(#gradient)"
          points={`${points} 100,100 0,100`}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-omni-cyan to-transparent" />
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState(generateSystemStats());
  const [activities, setActivities] = useState(generateActivityLogs());
  const [systemHealth, setSystemHealth] = useState(98);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateSystemStats());
      setSystemHealth(Math.floor(Math.random() * 10 + 90));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as any,
        message: 'New system event occurred',
        timestamp: new Date(),
        module: ['System', 'Network', 'Security', 'Database'][Math.floor(Math.random() * 4)],
      };
      setActivities(prev => [newLog, ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <h1 className="text-4xl font-bold text-omni-text mb-2">
          System Overview
        </h1>
        <p className="text-omni-textDim">
          Real-time monitoring and control center
        </p>
        
        {/* Live indicator */}
        <div className="absolute top-0 right-0 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-omni-green animate-pulse" />
          <span className="text-xs text-omni-textDim">Live</span>
        </div>
      </motion.div>

      {/* System Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="omni-card p-6 bg-gradient-to-br from-omni-surface to-omni-surface2"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-omni-text mb-1">System Health</h2>
            <p className="text-3xl font-bold text-omni-cyan">{systemHealth}%</p>
          </div>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-omni-surface2"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - systemHealth / 100)}`}
                className="text-omni-cyan transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <Shield className="absolute inset-0 w-12 h-12 m-auto text-omni-cyan" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <SystemStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Performance Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 omni-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-omni-text flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-omni-cyan" />
              Live Performance
            </h2>
            <div className="flex items-center gap-4 text-xs text-omni-textDim">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-omni-cyan" />
                CPU
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-omni-green" />
                Memory
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-omni-purple" />
                Network
              </span>
            </div>
          </div>
          <div className="h-64">
            <LiveChart />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="omni-card"
        >
          <h2 className="text-lg font-semibold text-omni-text mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="omni-btn w-full justify-start hover:translate-x-1 transition-transform">
              <Terminal className="w-4 h-4 mr-2" />
              Open Terminal
            </button>
            <button className="omni-btn w-full justify-start hover:translate-x-1 transition-transform">
              <Database className="w-4 h-4 mr-2" />
              Database Manager
            </button>
            <button className="omni-btn w-full justify-start hover:translate-x-1 transition-transform">
              <Eye className="w-4 h-4 mr-2" />
              System Monitor
            </button>
            <button className="omni-btn w-full justify-start hover:translate-x-1 transition-transform">
              <Server className="w-4 h-4 mr-2" />
              Server Status
            </button>
            <button className="omni-btn-primary w-full justify-start hover:translate-x-1 transition-transform">
              <Zap className="w-4 h-4 mr-2" />
              AI Assistant
            </button>
          </div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="omni-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-omni-text flex items-center gap-2">
            <Activity className="w-5 h-5 text-omni-cyan" />
            Recent Activity
          </h2>
          <button className="text-xs text-omni-cyan hover:text-omni-cyan/80">
            View all →
          </button>
        </div>
        <ActivityFeed logs={activities} />
      </motion.div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between p-4 bg-omni-surface rounded-lg border border-omni-border"
      >
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-omni-textDim" />
            <span className="text-omni-textDim">
              {new Date().toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-omni-green animate-pulse" />
            <span className="text-omni-textDim">All systems operational</span>
          </div>
          <div className="text-omni-textDim">
            Uptime: 99.98%
          </div>
        </div>
        <button className="text-xs text-omni-cyan hover:text-omni-cyan/80">
          System logs →
        </button>
      </motion.div>
    </div>
  );
};

export default DashboardPage;