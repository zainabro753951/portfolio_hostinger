"use client";

import React, { memo } from "react";
import { motion } from "motion/react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import {
  TrendingUp,
  BarChart3,
  Target,
  PieChart,
  Activity,
  Users,
  Eye,
  Clock,
  MousePointer,
} from "lucide-react";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
);

const DAnalyticsPage = () => {
  // Chart colors - cyan theme
  const cyanColors = {
    primary: "#22d3ee", // cyan-400
    secondary: "#06b6d4", // cyan-500
    tertiary: "#67e8f9", // cyan-300
    quaternary: "#0891b2", // cyan-600
    light: "rgba(34, 211, 238, 0.3)",
    lighter: "rgba(34, 211, 238, 0.1)",
  };

  // Visitors Overview Data
  const visitorsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Visitors",
        data: [120, 180, 150, 200, 250, 300, 280],
        borderColor: cyanColors.primary,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, cyanColors.light);
          gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: cyanColors.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Project Engagement Data
  const projectsData = {
    labels: ["Portfolio", "Shopo", "Protect Harvest", "SchoolSite", "EduHome"],
    datasets: [
      {
        label: "Views",
        data: [400, 250, 380, 200, 300],
        backgroundColor: [
          "rgba(34, 211, 238, 0.8)", // cyan-400
          "rgba(6, 182, 212, 0.8)", // cyan-500
          "rgba(103, 232, 249, 0.8)", // cyan-300
          "rgba(8, 145, 178, 0.8)", // cyan-600
          "rgba(165, 243, 252, 0.8)", // cyan-200
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Skill Usage Data
  const skillsData = {
    labels: ["HTML", "CSS", "JS", "React", "GSAP", "Tailwind"],
    datasets: [
      {
        label: "Skill Strength",
        data: [95, 90, 85, 80, 70, 90],
        backgroundColor: cyanColors.light,
        borderColor: cyanColors.primary,
        borderWidth: 2,
        pointBackgroundColor: cyanColors.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: cyanColors.primary,
      },
    ],
  };

  // Traffic Source Data
  const trafficData = {
    labels: ["Organic", "Referral", "Social", "Direct"],
    datasets: [
      {
        data: [45, 20, 25, 10],
        backgroundColor: [
          "rgba(34, 211, 238, 0.8)", // cyan
          "rgba(59, 130, 246, 0.8)", // blue
          "rgba(168, 85, 247, 0.8)", // purple
          "rgba(236, 72, 153, 0.8)", // pink
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Performance Metrics Data
  const performanceData = {
    labels: ["Load Time", "Bounce Rate", "Conversion", "Engagement"],
    datasets: [
      {
        data: [2.3, 45, 12, 78],
        backgroundColor: [
          "rgba(34, 211, 238, 0.7)", // cyan
          "rgba(59, 130, 246, 0.7)", // blue
          "rgba(168, 85, 247, 0.7)", // purple
          "rgba(236, 72, 153, 0.7)", // pink
        ],
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
          font: { size: 12, family: "Inter, sans-serif" },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(34, 211, 238, 0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  // Chart Card Component
  const ChartCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden
        rounded-2xl 
        bg-gradient-to-br from-slate-900/80 to-slate-800/60
        border border-white/10 
        backdrop-blur-xl
        p-5 sm:p-6
        shadow-lg shadow-black/20
        hover:shadow-xl hover:shadow-cyan-500/10
        transition-all duration-300
        ${className}
      `}
    >
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/20">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      {/* Chart Container */}
      <div className="h-[250px] sm:h-[280px]">{children}</div>
    </motion.div>
  );

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Track your portfolio performance and visitor insights
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Total Visitors",
            value: "1,480",
            icon: Users,
            change: "+12%",
          },
          { label: "Page Views", value: "3,240", icon: Eye, change: "+8%" },
          {
            label: "Avg. Session",
            value: "2m 34s",
            icon: Clock,
            change: "+5%",
          },
          {
            label: "Bounce Rate",
            value: "42%",
            icon: MousePointer,
            change: "-3%",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span
                className={`text-xs ${stat.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Visitors Overview" icon={TrendingUp}>
          <Line
            data={visitorsData}
            options={{
              ...commonOptions,
              plugins: { ...commonOptions.plugins, legend: { display: false } },
            }}
          />
        </ChartCard>

        <ChartCard title="Project Engagement" icon={BarChart3}>
          <Bar
            data={projectsData}
            options={{
              ...commonOptions,
              plugins: { ...commonOptions.plugins, legend: { display: false } },
            }}
          />
        </ChartCard>

        <ChartCard title="Skill Usage" icon={Target}>
          <Radar
            data={skillsData}
            options={{
              ...commonOptions,
              scales: {
                r: {
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                  pointLabels: { color: "#94a3b8", font: { size: 11 } },
                  ticks: { display: false, backdropColor: "transparent" },
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard title="Traffic Source" icon={PieChart}>
          <Doughnut
            data={trafficData}
            options={{
              ...commonOptions,
              cutout: "60%",
              plugins: {
                ...commonOptions.plugins,
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#94a3b8",
                    padding: 15,
                    usePointStyle: true,
                  },
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard
          title="Performance Metrics"
          icon={Activity}
          className="md:col-span-2"
        >
          <PolarArea
            data={performanceData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                legend: {
                  position: "right",
                  labels: {
                    color: "#94a3b8",
                    padding: 15,
                    usePointStyle: true,
                  },
                },
              },
              scales: {
                r: {
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                  ticks: { display: false, backdropColor: "transparent" },
                },
              },
            }}
          />
        </ChartCard>
      </div>
    </motion.section>
  );
};

export default memo(DAnalyticsPage);
