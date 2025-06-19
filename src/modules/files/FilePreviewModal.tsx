import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilesStore } from './filesStore';
import { formatFileSize, isImage, isText } from './fileUtils';
import { X } from 'lucide-react';

export const FilePreviewModal: React.FC = () => {
  const { selectedFileId, setSelectedFileId, files } = useFilesStore();
  const file = files.find((f) => f.id === selectedFileId);

  const close = () => setSelectedFileId(null);

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-omni-surface p-6 rounded-lg shadow-xl w-full max-w-lg relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 p-1 rounded hover:bg-omni-surface2"
            >
              <X className="w-4 h-4 text-omni-textDim" />
            </button>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-omni-text break-all">
                  {file.name}
                </h2>
                <p className="text-sm text-omni-textDim mt-1 flex gap-2">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{file.modified.toLocaleString()}</span>
                </p>
              </div>
              {file.data && isImage(file) && (
                <img
                  src={file.data}
                  alt={file.name}
                  className="max-h-80 w-full object-contain rounded border border-omni-border"
                />
              )}
              {file.data && isText(file) && (
                <pre className="bg-omni-surface2 p-3 rounded text-sm max-h-64 overflow-auto whitespace-pre-wrap">
                  {atob(file.data.split(',')[1] || '')}
                </pre>
              )}
              {!file.data && <p className="text-omni-textDim">No preview available.</p>}
              {file.data && (
                <a
                  href={file.data}
                  download={file.name}
                  className="omni-btn inline-flex"
                >
                  Download
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
