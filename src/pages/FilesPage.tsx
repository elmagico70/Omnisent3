import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileArchive,
  Image,
  Music,
  Video,
  Download,
  Trash2,
  Copy,
  Move,
  Eye,
  Grid,
  List,
  Search,
  Filter,
  SortAsc,
  ChevronRight,
  HardDrive,
  Cloud,
  Shield,
  Star,
  MoreVertical,
  Upload,
  FolderPlus,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Tipos
interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  size: number;
  modified: Date;
  path: string;
  starred?: boolean;
  protected?: boolean;
}

// Mock data
const generateMockFiles = (): FileItem[] => [
  { id: '1', name: 'Documents', type: 'folder', size: 4096, modified: new Date('2024-01-15'), path: '/Documents' },
  { id: '2', name: 'Projects', type: 'folder', size: 4096, modified: new Date('2024-01-20'), path: '/Projects' },
  { id: '3', name: 'Downloads', type: 'folder', size: 4096, modified: new Date('2024-01-25'), path: '/Downloads' },
  { id: '4', name: 'system-config.json', type: 'file', extension: 'json', size: 2048, modified: new Date('2024-01-18'), path: '/system-config.json', protected: true },
  { id: '5', name: 'README.md', type: 'file', extension: 'md', size: 1024, modified: new Date('2024-01-22'), path: '/README.md', starred: true },
  { id: '6', name: 'backup-2024.zip', type: 'file', extension: 'zip', size: 1048576, modified: new Date('2024-01-10'), path: '/backup-2024.zip' },
  { id: '7', name: 'screenshot.png', type: 'file', extension: 'png', size: 524288, modified: new Date('2024-01-24'), path: '/screenshot.png' },
  { id: '8', name: 'main.tsx', type: 'file', extension: 'tsx', size: 8192, modified: new Date('2024-01-25'), path: '/main.tsx', starred: true },
  { id: '9', name: 'audio-track.mp3', type: 'file', extension: 'mp3', size: 3145728, modified: new Date('2024-01-12'), path: '/audio-track.mp3' },
  { id: '10', name: 'presentation.mp4', type: 'file', extension: 'mp4', size: 10485760, modified: new Date('2024-01-08'), path: '/presentation.mp4' },
];

// Utilidades
const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') return FolderOpen;
  
  switch (item.extension) {
    case 'txt':
    case 'md':
    case 'doc':
    case 'docx':
      return FileText;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'json':
    case 'xml':
    case 'html':
    case 'css':
      return FileCode;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
      return FileArchive;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return Image;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return Music;
    case 'mp4':
    case 'avi':
    case 'mov':
      return Video;
    default:
      return File;
  }
};

const getFileColor = (item: FileItem) => {
  if (item.type === 'folder') return 'text-omni-cyan';
  
  switch (item.extension) {
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return 'text-yellow-400';
    case 'json':
    case 'xml':
      return 'text-orange-400';
    case 'html':
    case 'css':
      return 'text-blue-400';
    case 'md':
    case 'txt':
      return 'text-gray-400';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'text-green-400';
    case 'zip':
    case 'rar':
    case '7z':
      return 'text-purple-400';
    case 'mp3':
    case 'wav':
      return 'text-pink-400';
    case 'mp4':
    case 'avi':
      return 'text-red-400';
    default:
      return 'text-omni-textDim';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Componentes
const FileGridItem: React.FC<{ item: FileItem; onAction: (action: string, item: FileItem) => void }> = ({ item, onAction }) => {
  const Icon = getFileIcon(item);
  const color = getFileColor(item);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className="omni-card p-4 cursor-pointer hover:border-omni-cyan/50 transition-all">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <Icon className={cn("w-12 h-12", color)} />
            {item.starred && (
              <Star className="absolute -top-2 -right-2 w-4 h-4 text-omni-yellow fill-current" />
            )}
            {item.protected && (
              <Shield className="absolute -bottom-2 -right-2 w-4 h-4 text-omni-green" />
            )}
          </div>
          <div className="w-full">
            <p className="text-sm font-medium text-omni-text truncate">{item.name}</p>
            <p className="text-xs text-omni-textDim">
              {item.type === 'folder' ? 'Folder' : formatFileSize(item.size)}
            </p>
          </div>
        </div>
        
        {/* Action menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-omni-surface2 transition-all"
        >
          <MoreVertical className="w-4 h-4 text-omni-textDim" />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-8 right-2 bg-omni-surface2 border border-omni-border rounded-lg shadow-xl z-10 py-1 min-w-[150px]"
            >
              <button
                onClick={() => onAction('open', item)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-omni-surface hover:text-omni-cyan transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Open
              </button>
              <button
                onClick={() => onAction('copy', item)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-omni-surface hover:text-omni-cyan transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button
                onClick={() => onAction('move', item)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-omni-surface hover:text-omni-cyan transition-colors flex items-center gap-2"
              >
                <Move className="w-4 h-4" /> Move
              </button>
              <button
                onClick={() => onAction('download', item)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-omni-surface hover:text-omni-cyan transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <hr className="my-1 border-omni-border" />
              <button
                onClick={() => onAction('delete', item)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-omni-surface hover:text-omni-red text-omni-red transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FileListItem: React.FC<{ item: FileItem; onAction: (action: string, item: FileItem) => void }> = ({ item, onAction }) => {
  const Icon = getFileIcon(item);
  const color = getFileColor(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group"
    >
      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-omni-surface2 transition-all cursor-pointer">
        <div className="relative">
          <Icon className={cn("w-5 h-5", color)} />
          {item.starred && (
            <Star className="absolute -top-2 -right-2 w-3 h-3 text-omni-yellow fill-current" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-omni-text truncate">{item.name}</p>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-omni-textDim">
          <span className="w-20 text-right">{formatFileSize(item.size)}</span>
          <span className="w-32">{item.modified.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAction('open', item)}
            className="p-1 rounded hover:bg-omni-surface hover:text-omni-cyan transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAction('download', item)}
            className="p-1 rounded hover:bg-omni-surface hover:text-omni-cyan transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAction('delete', item)}
            className="p-1 rounded hover:bg-omni-surface hover:text-omni-red transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState(generateMockFiles());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'starred' | 'protected'>('all');

  // Filtrar archivos
  const filteredFiles = useMemo(() => {
    let filtered = files;
    
    // Búsqueda
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtros
    if (selectedFilter === 'starred') {
      filtered = filtered.filter(file => file.starred);
    } else if (selectedFilter === 'protected') {
      filtered = filtered.filter(file => file.protected);
    }
    
    // Ordenar: carpetas primero, luego archivos
    return filtered.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [files, searchQuery, selectedFilter]);

  const handleAction = (action: string, item: FileItem) => {
    console.log(`Action: ${action} on ${item.name}`);
    
    if (action === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== item.id));
    } else if (action === 'open' && item.type === 'folder') {
      setCurrentPath(item.path);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-omni-text mb-2">File Manager</h1>
        <div className="flex items-center gap-2 text-sm text-omni-textDim">
          <HardDrive className="w-4 h-4" />
          <span>Local Storage</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-omni-cyan">{currentPath}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-omni-textDim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files and folders..."
            className="omni-input pl-10 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              "px-3 py-2 rounded-lg border transition-all",
              selectedFilter === 'all'
                ? "bg-omni-cyan/20 border-omni-cyan text-omni-cyan"
                : "border-omni-border hover:border-omni-cyan/50"
            )}
          >
            All Files
          </button>
          <button
            onClick={() => setSelectedFilter('starred')}
            className={cn(
              "px-3 py-2 rounded-lg border transition-all flex items-center gap-1",
              selectedFilter === 'starred'
                ? "bg-omni-yellow/20 border-omni-yellow text-omni-yellow"
                : "border-omni-border hover:border-omni-yellow/50"
            )}
          >
            <Star className="w-4 h-4" /> Starred
          </button>
          <button
            onClick={() => setSelectedFilter('protected')}
            className={cn(
              "px-3 py-2 rounded-lg border transition-all flex items-center gap-1",
              selectedFilter === 'protected'
                ? "bg-omni-green/20 border-omni-green text-omni-green"
                : "border-omni-border hover:border-omni-green/50"
            )}
          >
            <Shield className="w-4 h-4" /> Protected
          </button>
          
          <div className="h-8 w-px bg-omni-border mx-2" />
          
          <div className="flex items-center border border-omni-border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 transition-all",
                viewMode === 'grid'
                  ? "bg-omni-cyan/20 text-omni-cyan"
                  : "hover:text-omni-cyan"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 transition-all",
                viewMode === 'list'
                  ? "bg-omni-cyan/20 text-omni-cyan"
                  : "hover:text-omni-cyan"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-4">
        <button className="omni-btn flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </button>
        <button className="omni-btn flex items-center gap-2">
          <FolderPlus className="w-4 h-4" />
          New Folder
        </button>
      </div>

      {/* File list/grid */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file) => (
                <FileGridItem key={file.id} item={file} onAction={handleAction} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-1">
            {/* List header */}
            <div className="flex items-center gap-4 px-3 py-2 text-xs text-omni-textDim border-b border-omni-border">
              <div className="w-5"></div>
              <div className="flex-1">Name</div>
              <div className="w-20 text-right">Size</div>
              <div className="w-32">Modified</div>
              <div className="w-24"></div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file) => (
                <FileListItem key={file.id} item={file} onAction={handleAction} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="mt-4 p-3 bg-omni-surface rounded-lg border border-omni-border flex items-center justify-between text-xs text-omni-textDim">
        <div className="flex items-center gap-4">
          <span>{filteredFiles.length} items</span>
          <span>•</span>
          <span>{formatFileSize(filteredFiles.reduce((acc, f) => acc + f.size, 0))} total</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          <span>Auto-sync enabled</span>
        </div>
      </div>
    </div>
  );
};