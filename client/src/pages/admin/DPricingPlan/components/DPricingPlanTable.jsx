import React, { useEffect, memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  CreditCard,
  DollarSign,
  Coins,
  Calendar,
  Crown,
  Hash,
  Clock,
  ArrowUpDown,
  Package,
  Sparkles,
  Zap,
  Shield,
  Building2,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import useCreatedAtSorted from "../../../../hooks/useCreatedAtSorted";

// ─── Plan Type Icons ──────────────────────────────────────────────
const PlanTypeIcon = memo(({ type }) => {
  const iconMap = {
    basic: {
      icon: Package,
      color: "#64748b",
      bg: "rgba(100,116,139,0.15)",
      border: "rgba(100,116,139,0.25)",
    },
    standard: {
      icon: Zap,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.15)",
      border: "rgba(6,182,212,0.25)",
    },
    premium: {
      icon: Sparkles,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.15)",
      border: "rgba(245,158,11,0.25)",
    },
    enterprise: {
      icon: Building2,
      color: "#a855f7",
      bg: "rgba(168,85,247,0.15)",
      border: "rgba(168,85,247,0.25)",
    },
  };

  const config = iconMap[type?.toLowerCase()] || iconMap.basic;
  const Icon = config.icon;

  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: 40,
        height: 40,
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={18} color={config.color} strokeWidth={2} />
    </div>
  );
});

// ─── Currency Badge ───────────────────────────────────────────────
const CurrencyBadge = memo(({ currency }) => {
  const currencyMap = {
    $: {
      label: "USD",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.25)",
    },
    Rs: {
      label: "PKR",
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.12)",
      border: "rgba(14,165,233,0.25)",
    },
    "€": {
      label: "EUR",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.12)",
      border: "rgba(139,92,246,0.25)",
    },
  };

  const config = currencyMap[currency] || {
    label: currency,
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.25)",
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <span style={{ fontSize: 10, opacity: 0.7 }}>{currency}</span>
      {config.label}
    </span>
  );
});

// ─── Billing Cycle Badge ──────────────────────────────────────────
const BillingCycleBadge = memo(({ cycle }) => {
  const cycleColors = {
    monthly: {
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.12)",
      border: "rgba(6,182,212,0.25)",
    },
    yearly: {
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.25)",
    },
    quarterly: {
      color: "#ec4899",
      bg: "rgba(236,72,153,0.12)",
      border: "rgba(236,72,153,0.25)",
    },
    lifetime: {
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.25)",
    },
  };

  const config = cycleColors[cycle?.toLowerCase()] || {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.25)",
  };

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize"
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      {cycle}
    </span>
  );
});

// ─── Date Display ─────────────────────────────────────────────────
const DateDisplay = memo(({ dateString }) => {
  if (!dateString) return <span className="text-slate-500 text-xs">—</span>;

  const date = new Date(dateString);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm text-slate-200 font-medium">{formatted}</span>
      <span className="text-xs text-slate-500">{time}</span>
    </div>
  );
});

// ─── ID Display ───────────────────────────────────────────────────
const IdDisplay = memo(({ id }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium tracking-wide"
    style={{
      color: "#64748b",
      background: "rgba(100,116,139,0.1)",
      border: "1px solid rgba(100,116,139,0.15)",
    }}
  >
    <Hash size={11} />
    {id?.toString().slice(0, 8)}...
  </span>
));

// ─── Action Buttons ───────────────────────────────────────────────
const ActionButtons = memo(({ item, onDelete }) => (
  <div className="flex items-center gap-2">
    <Link
      to={`/admin/pricing-plan/${item?.id}`}
      className="group/edit relative flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
      style={{
        width: 36,
        height: 36,
        background:
          "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))",
        border: "1px solid rgba(6,182,212,0.3)",
      }}
      title="Edit Plan"
    >
      <Pencil size={15} color="#22d3ee" strokeWidth={2} />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-800 text-xs text-white opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
        Edit
      </div>
    </Link>

    <button
      onClick={() => onDelete(item)}
      className="group/del relative flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
      style={{
        width: 36,
        height: 36,
        background:
          "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(239,68,68,0.15))",
        border: "1px solid rgba(244,63,94,0.3)",
      }}
      title="Delete Plan"
    >
      <Trash2 size={15} color="#f43f5e" strokeWidth={2} />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-800 text-xs text-white opacity-0 group-hover/del:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
        Delete
      </div>
    </button>
  </div>
));

// ─── Main Component ───────────────────────────────────────────────
const DPricingPlanTable = () => {
  const { plans } = useSelector((state) => state.plan);
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();

  // Sorted Plans
  const { sortedData: sortedPlans } = useCreatedAtSorted(plans);

  // Set query key for delete context
  useEffect(() => {
    setQueryKey("pricePlan");
  }, [setQueryKey]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.06,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  // Format price with currency
  const formatPrice = useCallback((price, currency) => {
    const symbols = { $: "$", Rs: "₨", "€": "€" };
    return `${symbols[currency] || currency}${Number(price).toLocaleString("en-US")}`;
  }, []);

  // Handle delete
  const handleDelete = useCallback(
    (item) => {
      setRoute(`/plan/delete/${item?.id}`);
      setIsOpen(true);
      setQueryKey("pricePlan");
    },
    [setRoute, setIsOpen, setQueryKey],
  );

  // Table headers configuration
  const headers = [
    { key: "id", label: "Plan ID", icon: Hash, width: 140 },
    { key: "planName", label: "Plan Name", icon: Crown, width: 220 },
    { key: "price", label: "Price", icon: DollarSign, width: 140 },
    { key: "currency", label: "Currency", icon: Coins, width: 130 },
    { key: "billingCycle", label: "Billing Cycle", icon: Calendar, width: 150 },
    { key: "createdAt", label: "Created", icon: Clock, width: 160 },
    { key: "updatedAt", label: "Updated", icon: ArrowUpDown, width: 160 },
    { key: "actions", label: "Actions", icon: null, width: 120 },
  ];

  const planCount = sortedPlans?.length || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {/* ── Main Card ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        }}
      >
        {/* ── Header Section ────────────────────────────────────── */}
        <div
          className="flex items-center justify-between mb-8 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 52,
                height: 52,
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))",
                border: "1px solid rgba(6,182,212,0.25)",
              }}
            >
              <CreditCard size={24} color="#22d3ee" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                All Pricing Plans
              </h3>
              <p className="text-slate-400 text-sm mt-0.5">
                <span className="text-cyan-400 font-semibold">{planCount}</span>{" "}
                {planCount === 1 ? "plan" : "plans"} available in your catalog
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.15)",
              }}
            >
              <Shield size={14} color="#22d3ee" />
              <span className="text-xs text-cyan-300 font-medium">
                Active Plans
              </span>
              <span className="text-sm text-white font-bold">{planCount}</span>
            </div>
          </div>
        </div>

        {/* ── Table Container ───────────────────────────────────── */}
        <div
          className="w-full rounded-xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(15,23,42,0.4)",
          }}
        >
          {/* Scrollable Wrapper */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full" style={{ minWidth: 1100 }}>
              {/* ── Table Header ────────────────────────────────── */}
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {headers.map((head) => (
                    <th
                      key={head.key}
                      className="py-4 px-4 text-left text-xs font-bold uppercase tracking-widest"
                      style={{
                        color: "#22d3ee",
                        width: head.width,
                        background:
                          "linear-gradient(90deg, rgba(6,182,212,0.06), rgba(59,130,246,0.06))",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {head.icon && (
                          <head.icon
                            size={14}
                            color="#22d3ee"
                            strokeWidth={2}
                          />
                        )}
                        {head.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── Table Body ──────────────────────────────────── */}
              <tbody style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                {planCount > 0 ? (
                  sortedPlans.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="show"
                      className="group transition-all duration-300"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                      whileHover={{
                        background:
                          "linear-gradient(90deg, rgba(6,182,212,0.04), rgba(59,130,246,0.04))",
                      }}
                    >
                      {/* ── Plan ID ───────────────────────────── */}
                      <td className="py-4 px-4">
                        <IdDisplay id={item?.id} />
                      </td>

                      {/* ── Plan Name ─────────────────────────── */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <PlanTypeIcon type={item?.planName} />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-white font-semibold capitalize tracking-wide">
                              {item?.planName}
                            </span>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[160px] truncate">
                              {item?.shortDesc || "No description available"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ── Price ─────────────────────────────── */}
                      <td className="py-4 px-4">
                        <span
                          className="text-lg font-bold tracking-tight"
                          style={{ color: "#22d3ee" }}
                        >
                          {formatPrice(item?.price, item?.currency)}
                        </span>
                      </td>

                      {/* ── Currency ──────────────────────────── */}
                      <td className="py-4 px-4">
                        <CurrencyBadge currency={item?.currency} />
                      </td>

                      {/* ── Billing Cycle ─────────────────────── */}
                      <td className="py-4 px-4">
                        <BillingCycleBadge cycle={item?.billingCycle} />
                      </td>

                      {/* ── Created At ────────────────────────── */}
                      <td className="py-4 px-4">
                        <DateDisplay dateString={item?.createdAt} />
                      </td>

                      {/* ── Updated At ────────────────────────── */}
                      <td className="py-4 px-4">
                        <DateDisplay dateString={item?.updatedAt} />
                      </td>

                      {/* ── Actions ───────────────────────────── */}
                      <td className="py-4 px-4">
                        <ActionButtons item={item} onDelete={handleDelete} />
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-5"
                      >
                        <div
                          className="flex items-center justify-center rounded-2xl"
                          style={{
                            width: 72,
                            height: 72,
                            background:
                              "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))",
                            border: "1px solid rgba(6,182,212,0.2)",
                          }}
                        >
                          <CreditCard
                            size={32}
                            color="#22d3ee"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-slate-300 text-lg font-semibold">
                            No pricing plans found
                          </p>
                          <p className="text-slate-500 text-sm max-w-[280px]">
                            Create your first pricing plan to start managing
                            your subscription tiers
                          </p>
                        </div>
                        <Link
                          to="/admin/pricing-plan/create"
                          className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(59,130,246,0.3))",
                            border: "1px solid rgba(6,182,212,0.4)",
                          }}
                        >
                          Create New Plan
                        </Link>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        {planCount > 0 && (
          <div
            className="mt-5 flex items-center justify-between px-2"
            style={{ color: "#64748b" }}
          >
            <span className="text-xs">
              Showing{" "}
              <span className="text-slate-300 font-semibold">{planCount}</span>{" "}
              plans
            </span>
            <span className="text-xs">
              Last updated:{" "}
              <span className="text-slate-300">
                {new Date().toLocaleDateString()}
              </span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(DPricingPlanTable);
