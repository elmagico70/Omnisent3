import { FileItem } from './filesStore';
import {
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileArchive,
  Image,
  Music,
  Video,
} from 'lucide-react';

export const getFileIcon = (item: FileItem) => {
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

export const getFileColor = (item: FileItem) => {
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

export const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const isImage = (item: FileItem) => item.mimeType?.startsWith('image/');
export const isText = (item: FileItem) => item.mimeType?.startsWith('text/');
