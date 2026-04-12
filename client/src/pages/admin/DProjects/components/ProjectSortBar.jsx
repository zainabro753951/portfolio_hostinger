import React, { memo, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useDispatch } from "react-redux";
import { Plus, FolderKanban, ArrowUpDown } from "lucide-react";
import CustomSelect from "../../Components/CustomSelect";
import { sortProjects } from "../../../../features/projectSlice";
import { Link } from "react-router-dom";

const ProjectSortBar = () => {
  const options = ["Sort By", "Newest", "Oldest", "Most Popular"];
  const [selected, setSelected] = useState("Sort By");
  const dispatch = useDispatch();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (selected !== "Sort By") {
      dispatch(sortProjects(selected));
    }
  }, [selected, dispatch]);

  const handleSelect = useCallback((value) => {
    setSelected(value);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
    >
      {/* Project Info */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
          <FolderKanban className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Projects
          </h3>
          <p className="text-slate-400 text-sm">Manage all project entries</p>
        </div>
      </motion.div>

      {/* Project Sorting */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
      >
        {/* Custom Select with Icon */}
        <div className="relative flex-1 sm:flex-initial">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <CustomSelect
            options={options}
            selected={selected}
            setSelected={handleSelect}
            className="pl-10"
          />
        </div>

        {/* Add Project Button */}
        <Link to={"/admin/add-project"}>
          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default memo(ProjectSortBar);
