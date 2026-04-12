import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Coins,
  ListPlus,
  X,
  Plus,
  Loader2,
  Save,
  Tag,
  AlignLeft,
} from "lucide-react";
import { useAddPricePlan } from "../../../../Queries/AddPlan";
import { glassToast } from "../../Components/ToastMessage";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearPlan, planFindById } from "../../../../features/planSlice";

const DPricingPlanForm = () => {
  const { plans, plan } = useSelector((state) => state.plan);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);

  const defaultValues = useMemo(
    () => ({
      planName: "",
      billingCycle: "",
      price: "",
      currency: "",
      featurePoints: [],
      shortDesc: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Fetch plan for edit
  useEffect(() => {
    if (id && plans?.length > 0) {
      dispatch(planFindById(Number(id)));
    } else {
      dispatch(clearPlan());
      reset(defaultValues);
      setIsUpdate(false);
    }
  }, [id, dispatch, plans, reset, defaultValues]);

  // Populate form
  useEffect(() => {
    if (plan && id && plan.id === Number(id)) {
      reset({
        planName: plan?.planName || "",
        billingCycle: plan?.billingCycle || "",
        price: plan?.price || "",
        currency: plan?.currency || "",
        featurePoints: plan?.featurePoints || [],
        shortDesc: plan?.shortDesc || "",
      });
      setIsUpdate(true);
    }
  }, [plan, id, reset]);

  const {
    fields: featurePointField,
    append: appendFeaturePoint,
    remove: removeFeaturePoint,
  } = useFieldArray({
    control,
    name: "featurePoints",
  });

  const addFeaturePoint = useCallback(
    (e) => {
      e.preventDefault();
      const input = e.target.form.querySelector("#featurePoints");
      const value = input.value.trim();

      clearErrors("featurePoints");

      if (!value) {
        setError("featurePoints", {
          type: "required",
          message: "Feature point is required",
        });
        return;
      }

      if (value.length < 2) {
        setError("featurePoints", {
          type: "minLength",
          message: "Must be at least 2 characters",
        });
        return;
      }

      const isDuplicate = featurePointField.some(
        (t) => t.name.toLowerCase() === value.toLowerCase(),
      );
      if (isDuplicate) {
        setError("featurePoints", {
          type: "duplicate",
          message: "This feature already exists",
        });
        return;
      }

      appendFeaturePoint({ name: value });
      input.value = "";
    },
    [appendFeaturePoint, clearErrors, setError, featurePointField],
  );

  const { mutate, isPending, isSuccess, isError, data, error } =
    useAddPricePlan();

  const onSubmit = useCallback(
    (formData) => {
      mutate({ isUpdate, planId: id, ...formData });
    },
    [mutate, isUpdate, id],
  );

  // Toast feedback
  useEffect(() => {
    if (isSuccess && data) {
      glassToast.success(
        data?.message || `Plan ${isUpdate ? "updated" : "added"} successfully!`,
      );
      if (!isUpdate) {
        reset(defaultValues);
      }
    }
    if (isError && error) {
      glassToast.error(error?.response?.data?.message || "Failed to save plan");
    }
  }, [isSuccess, isError, data, error, isUpdate, reset, defaultValues]);

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

  const inputClasses = (hasError) =>
    `
    w-full bg-slate-800/50 border ${hasError ? "border-rose-500/50" : "border-white/10"} 
    rounded-xl outline-none text-white placeholder:text-slate-500 
    backdrop-blur-sm px-4 py-3 transition-all duration-200
    focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
    hover:border-white/20 hover:bg-slate-800/70
    text-sm sm:text-base
  `.trim();

  // Options
  const planNameOptions = [
    { value: "basic", label: "Basic", desc: "For individuals" },
    { value: "standard", label: "Standard", desc: "For small teams" },
    { value: "premium", label: "Premium", desc: "For professionals" },
    { value: "enterprise", label: "Enterprise", desc: "For large orgs" },
  ];

  const billingCycleOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "One-time", label: "One-time" },
    { value: "Lifetime", label: "Lifetime" },
  ];

  const currencyOptions = [
    { value: "$", label: "USD ($)" },
    { value: "Rs", label: "PKR (Rs)" },
    { value: "€", label: "EUR (€)" },
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
              {isUpdate ? "Edit Pricing Plan" : "Add Pricing Plan"}
            </h3>
            <p className="text-slate-400 text-sm">
              {isUpdate
                ? "Update plan details and features"
                : "Create a new pricing plan for your services"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          {/* Row 1: Plan Name & Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plan Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                Plan Name
              </label>
              <select
                className={inputClasses(errors.planName)}
                {...register("planName", {
                  required: "Please select a plan name",
                })}
              >
                <option value="">-- Select Plan --</option>
                {planNameOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>
              {errors.planName && (
                <p className="text-xs text-rose-400 animate-pulse">
                  {errors.planName.message}
                </p>
              )}
            </div>

            {/* Billing Cycle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Billing Cycle
              </label>
              <select
                className={inputClasses(errors.billingCycle)}
                {...register("billingCycle", {
                  required: "Please select billing cycle",
                })}
              >
                <option value="">-- Select Cycle --</option>
                {billingCycleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.billingCycle && (
                <p className="text-xs text-rose-400 animate-pulse">
                  {errors.billingCycle.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Price & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Price
              </label>
              <input
                type="number"
                min="1"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 1,
                    message: "Price must be greater than 0",
                  },
                })}
                placeholder="Enter price amount"
                className={inputClasses(errors.price)}
              />
              {errors.price && (
                <p className="text-xs text-rose-400 animate-pulse">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                Currency
              </label>
              <select
                className={inputClasses(errors.currency)}
                {...register("currency", {
                  required: "Please select currency",
                })}
              >
                <option value="">-- Select Currency --</option>
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.currency && (
                <p className="text-xs text-rose-400 animate-pulse">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          {/* Feature Points Section */}
          <div className="rounded-xl bg-slate-800/40 border border-white/10 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-cyan-400" />
                Feature Points
              </label>
              <span className="text-xs text-slate-500">
                Press Enter or click Add
              </span>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                id="featurePoints"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addFeaturePoint(e);
                }}
                placeholder="e.g., 24/7 Support, Unlimited Revisions..."
                className={`${inputClasses(errors.featurePoints)} flex-1`}
              />
              <motion.button
                type="button"
                onClick={addFeaturePoint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:from-cyan-500/50 hover:to-blue-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </motion.button>
            </div>

            {errors.featurePoints && (
              <p className="text-xs text-rose-400 animate-pulse mb-3">
                {errors.featurePoints.message}
              </p>
            )}

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2">
              {featurePointField.map((field, idx) => (
                <motion.span
                  key={field.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-100 text-sm flex items-center gap-2 group"
                >
                  {field.name}
                  <button
                    type="button"
                    onClick={() => removeFeaturePoint(idx)}
                    className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-rose-500/30 hover:text-rose-300 flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-cyan-400" />
              Short Description
            </label>
            <textarea
              rows={4}
              {...register("shortDesc", {
                required: "Description is required",
              })}
              placeholder="e.g., Perfect for individuals starting out with basic needs..."
              className={`${inputClasses(errors.shortDesc)} resize-none`}
            />
            {errors.shortDesc && (
              <p className="text-xs text-rose-400 animate-pulse">
                {errors.shortDesc.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full flex items-center justify-end pt-4">
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={isPending ? {} : { scale: 1.02 }}
              whileTap={isPending ? {} : { scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isUpdate ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isUpdate ? "Update Plan" : "Add Plan"}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default memo(DPricingPlanForm);
