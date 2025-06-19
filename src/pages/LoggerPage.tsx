import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  Search,
  Copy,
  Check,
  Clock,
  Activity,
  Zap,
  Database,
  Server,
  Shield,
  Wifi,
  Bug,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Tipos
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  module: string;
  message: string;
  details?: string;
  stack?: string;
}

// Mock log generator
const modules = ['System', 'Network', 'Database', 'Security', 'API', 'Auth', 'Cache', 'Storage'];
const logTemplates = {
  info: [
    'Service started successfully',
    'Configuration loaded',
    'Cache cleared',
    'Connection established',
    'Request processed',
  ],
  warning: [
    'High memory usage detected',
    'Slow query performance',
    'Rate limit approaching',
    'Deprecated API usage',
    'Connection timeout',
  ],
  error: [
    'Failed to connect to service',
    'Authentication failed',
    'Database query error',
    'File not found',
    'Permission denied',
  ],
  success: [
    'Deployment completed',
    'Backup successful',
    'Security scan passed',
    'Update installed',
    'Sync completed',
  ],
  debug: [
    'Variable state changed',
    'Function called',
    'Event triggered',
    'Cache hit',
    'Query executed',
  ],
};

const generateRandomLog = (): LogEntry => {
  const levels = Object.keys(logTemplates) as Array<keyof typeof logTemplates>;
  const level = levels[Math.floor(Math.random() * levels.length)];
  const messages = logTemplates[level];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const module = modules[Math.floor(Math.random() * modules.length)];

  return {
    id: `log-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    level,
    module,
    message,
    details: Math.random() > 0.7 ? `Additional details for ${message.toLowerCase()}` : undefined,
    stack: level === 'error' && Math.random() > 0.5 
      ? `at Function.Module._load (module.js:469:23)\nat Module.require (module.js:568:17)\nat require (internal/module.js:11:18)`
      : undefined,
  };
};

// Componentes
const LogIcon: React.FC<{ level: LogEntry['level'] }> = ({ level }) => {
  switch (level) {
    case 'info':
      return <Info className="w-4 h-4" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4" />;
    case 'error':
      return <XCircle className="w-4 h-4" />;
    case 'success':
      return <CheckCircle className="w-4 h-4" />;
    case 'debug':
      return <Bug className="w-4 h-4" />;
  }
};

const LogEntryComponent: React.FC<{ log: LogEntry; onCopy: (text: string) => void }> = ({ log, onCopy }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getLevelColor = () => {
    switch (log.level) {
      case 'info': return 'text-omni-cyan border-omni-cyan/20 bg-omni-cyan/5';
      case 'warning': return 'text-omni-yellow border-omni-yellow/20 bg-omni-yellow/5';
      case 'error': return 'text-omni-red border-omni-red/20 bg-omni-red/5';
      case 'success': return 'text-omni-green border-omni-green/20 bg-omni-green/5';
      case 'debug': return 'text-omni-purple border-omni-purple/20 bg-omni-purple/5';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "border rounded-lg p-3 transition-all cursor-pointer",
        getLevelColor(),
        expanded && "bg-opacity-10"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <LogIcon level={log.level} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs opacity-70">
              {formatTimestamp(log.timestamp)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-current bg-opacity-10 font-medium">
              {log.module}
            </span>
          </div>
          <p className="text-sm">{log.message}</p>
          
          <AnimatePresence>
            {expanded && (log.details || log.stack) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {log.details && (
                  <p className="text-xs opacity-70">{log.details}</p>
                )}
                {log.stack && (
                  <pre className="text-xs font-mono bg-black bg-opacity-20 p-2 rounded overflow-x-auto">
                    {log.stack}
                  </pre>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(`[${formatTimestamp(log.timestamp)}] [${log.level.toUpperCase()}] [${log.module}] ${log.message}`);
          }}
          className="p-1 hover:bg-current hover:bg-opacity-10 rounded transition-colors"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export const LoggerPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<'all' | LogEntry['level']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Generate initial logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 20 }, () => {
      const log = generateRandomLog();
      log.timestamp = new Date(Date.now() - Math.random() * 3600000);
      return log;
    }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    setLogs(initialLogs);
  }, []);

  // Live log generation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog = generateRandomLog();
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    success: logs.filter(l => l.level === 'success').length,
    debug: logs.filter(l => l.level === 'debug').length,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportLogs = () => {
    const content = filteredLogs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.module}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-omni-text mb-2">System Logs</h1>
        <p className="text-omni-textDim">Real-time system monitoring and log analysis</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        <div className="omni-card p-3">
          <div className="flex items-center justify-between">
            <Activity className="w-4 h-4 text-omni-cyan" />
            <span className="text-lg font-bold text-omni-text">{stats.total}</span>
          </div>
          <p className="text-xs text-omni-textDim mt-1">Total</p>
        </div>
        <div className="omni-card p-3">
          <div className="flex items-center justify-between">
            <Info className="w-4 h-4 text-omni-cyan" />
            <span className="text-lg font-bold text-omni-cyan">{stats.info}</span>
          </div>
          <p className="text-xs text-omni-textDim mt-1">Info</p>
        </div>
        <div className="omni-card p-3">
          <div className="flex items-center justify-between">
            <AlertCircle className="w-4 h-4 text-omni-yellow" />
            <span className="text-lg font-bold text-omni-yellow">{stats.warning}</span>
          </div>
          <p className="text-xs text-omni-textDim mt-1">Warning</p>
        </div>
        <div className="omni-card p-3">
          <div className="flex items-center justify-between">
            <XCircle className="w-4 h-4 text-omni-red" />
            <span className="text-lg font-bold text-omni-red">{stats.error}</span>
          </div>
          <p className="text-xs text-omni-textDim mt-1">Error</p>
        </div>
        <div className="omni-card p-3">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-4 h-4 text-omni-green" />
            <span className="text-lg font-bold text-omni-green">{stats.success}</span>
          </div>
          <p className="text-xs text-omni-textDim mt-1">Success</p>
        </div>
        <div className="omni-card p-3">
          <div className="flex items-center justify-between">
            <Bug className="w-4 h-4 text-omni-purple" />
            <span className="text-lg font-bold text-omni-purple">{stats.debug}</span>
          </div>
          <p className="text-xs text-omni-textDim mt-1">Debug</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-omni-textDim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="omni-input pl-10 text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['all', 'info', 'warning', 'error', 'success', 'debug'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-sm transition-all",
                filter === level
                  ? level === 'all'
                    ? "bg-omni-cyan/20 border-omni-cyan text-omni-cyan"
                    : level === 'info'
                    ? "bg-omni-cyan/20 border-omni-cyan text-omni-cyan"
                    : level === 'warning'
                    ? "bg-omni-yellow/20 border-omni-yellow text-omni-yellow"
                    : level === 'error'
                    ? "bg-omni-red/20 border-omni-red text-omni-red"
                    : level === 'success'
                    ? "bg-omni-green/20 border-omni-green text-omni-green"
                    : "bg-omni-purple/20 border-omni-purple text-omni-purple"
                  : "border-omni-border hover:border-omni-cyan/50"
              )}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "omni-btn flex items-center gap-2",
              isLive && "bg-omni-green/20 border-omni-green text-omni-green"
            )}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLive ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              "omni-btn",
              autoScroll && "bg-omni-cyan/20 border-omni-cyan text-omni-cyan"
            )}
          >
            Auto-scroll
          </button>
          <button
            onClick={() => setLogs([])}
            className="omni-btn hover:border-omni-red hover:text-omni-red"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={exportLogs}
            className="omni-btn"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log viewer */}
      <div className="flex-1 omni-card p-4 overflow-hidden flex flex-col">
        {/* Terminal header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-omni-border">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-omni-cyan" />
            <span className="text-sm font-mono text-omni-textDim">
              system.log
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-omni-textDim">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString()}
            </span>
            <span>{filteredLogs.length} entries</span>
          </div>
        </div>

        {/* Logs */}
        <div
          ref={logContainerRef}
          className="flex-1 overflow-auto space-y-2 pr-2"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
            if (!isAtBottom && autoScroll) {
              setAutoScroll(false);
            }
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredLogs.map((log) => (
              <LogEntryComponent key={log.id} log={log} onCopy={handleCopy} />
            ))}
          </AnimatePresence>
          
          {filteredLogs.length === 0 && (
            <div className="flex items-center justify-center h-full text-omni-textDim">
              <div className="text-center">
                <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No logs match your criteria</p>
              </div>
            </div>
          )}
        </div>

        {/* Status line */}
        <div className="mt-3 pt-3 border-t border-omni-border flex items-center justify-between text-xs text-omni-textDim">
          <span className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-omni-green animate-pulse" />
                Live
              </span>
            )}
            <span>Showing {filteredLogs.length} of {logs.length} logs</span>
          </span>
          {copied && (
            <span className="flex items-center gap-1 text-omni-green">
              <Check className="w-3 h-3" />
              Copied to clipboard
            </span>
          )}
        </div>
      </div>
    </div>
  );
};