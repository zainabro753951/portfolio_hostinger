import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Handshake,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Calendar,
  DollarSign,
  Coffee,
  FileText,
  LayoutGrid,
  MessageSquare,
  Headphones,
  TrendingUp,
  Search,
  X,
  History,
} from "lucide-react";
import { useEmailTemplates } from "../../../../hooks/useEmailTemplates";

const iconMap = {
  Handshake,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Calendar,
  DollarSign,
  Coffee,
  FileText,
  LayoutGrid,
  MessageSquare,
  Headphones,
  TrendingUp,
};

const TemplateSelector = ({ onSelect, message }) => {
  const {
    templates,
    categories,
    recentTemplates,
    suggestions,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    applyTemplate,
  } = useEmailTemplates(message);

  const [showRecents, setShowRecents] = useState(true);

  const handleSelect = (template) => {
    const processed = applyTemplate(template.id);
    if (processed) {
      onSelect(processed);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-cyan-500/30">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || LayoutGrid;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                    : "bg-slate-800/50 text-slate-400 border border-white/10 hover:bg-slate-700/50 hover:text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && !searchQuery && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
          <h4 className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Suggested for this message
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {suggestions.map((template) => {
              const Icon = iconMap[template.icon] || MessageSquare;
              return (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(template)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/10 hover:border-purple-400/30 hover:bg-purple-500/10 transition-all text-left"
                >
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {template.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently Used */}
      {recentTemplates.length > 0 &&
        showRecents &&
        !searchQuery &&
        selectedCategory === "all" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recently Used
              </h4>
              <button
                onClick={() => setShowRecents(false)}
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                Hide
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500/30">
              {recentTemplates.map((template) => {
                const Icon = iconMap[template.icon] || MessageSquare;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/10 transition-all whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">
                      {template.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* All Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {templates.map((template) => {
            const Icon = iconMap[template.icon] || MessageSquare;
            return (
              <motion.button
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(template)}
                className="flex items-start gap-3 p-4 text-left rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/10 transition-all group"
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                    {template.category}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No templates found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default memo(TemplateSelector);
