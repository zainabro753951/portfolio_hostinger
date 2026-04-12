import React, { useEffect, memo, useCallback } from "react";
import { motion } from "motion/react";
import {
  Pencil,
  Trash2,
  CreditCard,
  DollarSign,
  Coins,
  Calendar,
  Tag,
  Crown,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";

const DPricingPlanTable = () => {
  const { plans } = useSelector((state) => state.plan);
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext();

  // Set query key for delete context
  useEffect(() => {
    setQueryKey("pricePlan");
  }, [setQueryKey]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Get plan icon based on name
  const getPlanIcon = useCallback((planName) => {
    const icons = {
      basic: (
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400" />
      ),
      standard: (
        <div className="w-8 h-8 rounded-lg bg-cyan-900/50 flex items-center justify-center text-cyan-400" />
      ),
      premium: (
        <div className="w-8 h-8 rounded-lg bg-amber-900/50 flex items-center justify-center text-amber-400" />
      ),
      enterprise: (
        <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-400" />
      ),
    };
    return icons[planName?.toLowerCase()] || icons.basic;
  }, []);

  // Format price with currency
  const formatPrice = useCallback((price, currency) => {
    const symbols = { $: "$", Rs: "₨", "€": "€" };
    return `${symbols[currency] || currency}${price}`;
  }, []);

  // Table headers configuration
  const headers = [
    { key: "planName", label: "Plan Name", icon: Crown },
    { key: "price", label: "Price", icon: DollarSign },
    { key: "currency", label: "Currency", icon: Coins },
    { key: "billingCycle", label: "Billing Cycle", icon: Calendar },
    { key: "actions", label: "Actions", icon: null },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full "
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              All Pricing Plans
            </h3>
            <p className="text-slate-400 text-sm">
              {plans?.length || 0} {plans?.length === 1 ? "plan" : "plans"}{" "}
              available
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full rounded-xl border border-white/10 bg-slate-800/30 overflow-hidden">
          {/* Scrollable Wrapper */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[800px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
                  {headers.map((head) => (
                    <th
                      key={head.key}
                      className="py-4 px-4 text-left text-xs sm:text-sm font-semibold text-cyan-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        {head.icon && (
                          <head.icon className="w-4 h-4 text-cyan-400" />
                        )}
                        {head.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/5">
                {plans?.length > 0 ? (
                  plans.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-300"
                    >
                      {/* Plan Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {getPlanIcon(item?.planName)}
                          <div>
                            <span className="text-sm text-white font-medium capitalize">
                              {item?.planName}
                            </span>
                            <p className="text-xs text-slate-500">
                              {item?.shortDesc || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-cyan-400">
                          {formatPrice(item?.price, item?.currency)}
                        </span>
                      </td>

                      {/* Currency */}
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium border border-white/10">
                          {item?.currency === "$" && "USD"}
                          {item?.currency === "Rs" && "PKR"}
                          {item?.currency === "€" && "EUR"}
                          {!["$", "Rs", "€"].includes(item?.currency) &&
                            item?.currency}
                        </span>
                      </td>

                      {/* Billing Cycle */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">
                          {item?.billingCycle}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/pricing-plan/${item?.id}`}
                            className="p-2 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => {
                              setRoute(`/plan/delete/${item?.id}`);
                              setIsOpen(true);
                              setQueryKey("pricePlan");
                            }}
                            className="p-2 rounded-lg bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-500/40 text-rose-300 hover:from-rose-500/50 hover:to-red-500/50 hover:text-white transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                          <CreditCard className="w-8 h-8 text-cyan-400" />
                        </div>
                        <p className="text-slate-400 text-lg">
                          No pricing plans found
                        </p>
                        <p className="text-slate-500 text-sm">
                          Create your first pricing plan to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(DPricingPlanTable);
