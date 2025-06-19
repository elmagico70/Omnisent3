import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Database,
  Globe,
  FileText,
  Mail,
  Key,
  User,
  CreditCard,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/utils/cn";

interface SearchFilter {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  color: string;
}

const filters: SearchFilter[] = [
  { id: "all", label: "All", icon: Database, color: "text-omni-cyan" },
  { id: "emails", label: "Emails", icon: Mail, count: 342, color: "text-blue-400" },
  { id: "passwords", label: "Passwords", icon: Key, count: 89, color: "text-omni-red" },
  { id: "users", label: "Usernames", icon: User, count: 156, color: "text-omni-green" },
  { id: "cards", label: "Credit Cards", icon: CreditCard, count: 12, color: "text-omni-yellow" },
  { id: "phones", label: "Phone Numbers", icon: Phone, count: 67, color: "text-purple-400" },
  { id: "urls", label: "URLs", icon: Globe, count: 234, color: "text-orange-400" },
  { id: "files", label: "Files", icon: FileText, count: 1205, color: "text-pink-400" },
];

interface SearchResult {
  id: string;
  type: string;
  content: string;
  source: string;
  date: string;
  risk: "low" | "medium" | "high";
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "email",
    content: "admin@example.com",
    source: "Database Leak 2024",
    date: "2024-01-15",
    risk: "high",
  },
  {
    id: "2",
    type: "password",
    content: "P@ssw0rd123!",
    source: "Breach Compilation",
    date: "2024-01-10",
    risk: "high",
  },
  {
    id: "3",
    type: "url",
    content: "https://secure-bank.example.com/login",
    source: "Phishing Database",
    date: "2024-01-08",
    risk: "medium",
  },
];

export const SearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1000); // Simulación
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-omni-text mb-2">
          Advanced Search Engine
        </h1>
        <p className="text-omni-textDim">
          Search through millions of records with fuzzy matching and filters
        </p>
      </div>

      {/* Input de búsqueda */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-omni-textDim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for emails, passwords, usernames, IPs, domains..."
            className="omni-input pl-12 pr-32 py-3 text-lg"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded hover:bg-omni-surface2 transition-colors"
            >
              <Filter className="w-4 h-4 text-omni-textDim" />
            </button>
            <button
              type="submit"
              className="omni-btn-primary px-4 py-1.5 text-sm"
              disabled={isSearching}
            >
              {isSearching ? (
                <span className="loading-dots">Searching</span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200",
              activeFilter === filter.id
                ? "bg-omni-cyan/20 border-omni-cyan text-omni-cyan"
                : "border-omni-border hover:border-omni-cyan/50 text-omni-textDim hover:text-omni-text"
            )}
          >
            <filter.icon className={cn("w-4 h-4", filter.color)} />
            <span className="text-sm font-medium">{filter.label}</span>
            {filter.count && (
              <span className="text-xs opacity-70">({filter.count})</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Resultados */}
      <div className="space-y-3">
        {searchQuery &&
          mockResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="omni-card hover:border-omni-cyan/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full font-medium",
                        result.type === "email" &&
                          "bg-blue-400/20 text-blue-400",
                        result.type === "password" &&
                          "bg-omni-red/20 text-omni-red",
                        result.type === "url" &&
                          "bg-orange-400/20 text-orange-400"
                      )}
                    >
                      {result.type}
                    </span>
                    <span className="text-xs text-omni-textDim">
                      {result.source}
                    </span>
                    <span className="text-xs text-omni-textDim">
                      {result.date}
                    </span>
                  </div>
                  <p className="font-mono text-omni-text mb-1">
                    {result.content}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                    result.risk === "high" &&
                      "bg-omni-red/20 text-omni-red",
                    result.risk === "medium" &&
                      "bg-omni-yellow/20 text-omni-yellow",
                    result.risk === "low" &&
                      "bg-omni-green/20 text-omni-green"
                  )}
                >
                  <AlertCircle className="w-3 h-3" />
                  {result.risk} risk
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Estado vacío */}
      {!searchQuery && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Search className="w-16 h-16 text-omni-textDim mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-omni-text mb-2">
            Start searching
          </h3>
          <p className="text-omni-textDim max-w-md">
            Enter any email, password, username, IP address, or domain to search
            through our extensive database.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 p-4 bg-omni-surface rounded-lg border border-omni-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-omni-cyan">12.5M</p>
            <p className="text-xs text-omni-textDim">Total Records</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-omni-green">342K</p>
            <p className="text-xs text-omni-textDim">Unique Emails</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-omni-yellow">89K</p>
            <p className="text-xs text-omni-textDim">Passwords</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-omni-purple">1.2K</p>
            <p className="text-xs text-omni-textDim">New Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};
