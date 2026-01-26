import React from "react";
import { Link } from "react-router-dom";
import { useCursorHoverContext } from "../context/CursorHover";

const GradientButton = ({
  text = "Button",
  link = "/",
  size = "md", // sm | md | lg
  variant = "primary", // primary | outline | ghost
  type = "button",
  onClick,
  disabled = false,
}) => {
  const { onCursorEnter, onCursorLeave } = useCursorHoverContext();

  /* ---------------- sizes ---------------- */
  const sizeStyles = {
    sm: "px-[clamp(14px,3vw,20px)] py-[clamp(8px,1.8vw,12px)] text-[clamp(13px,2.8vw,14px)]",
    md: "px-[clamp(18px,3.5vw,26px)] py-[clamp(10px,2vw,14px)] text-[clamp(14px,2.8vw,15px)]",
    lg: "px-[clamp(22px,4vw,34px)] py-[clamp(12px,2.4vw,18px)] text-[clamp(15px,3vw,17px)]",
  };

  /* ---------------- variants ---------------- */
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500
      text-white
      shadow-[0_10px_30px_-10px_rgba(168,85,247,0.6)]
      hover:shadow-[0_16px_40px_-12px_rgba(168,85,247,0.8)]
    `,
    outline: `
      border border-white/20
      text-white
      backdrop-blur-md
      hover:bg-white/10
    `,
    ghost: `
      text-cyan-400
      hover:bg-cyan-400/10
    `,
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium tracking-wide
    rounded-[clamp(10px,2vw,16px)]
    transition-all duration-300 ease-out
    will-change-transform
    overflow-hidden
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? "opacity-50 pointer-events-none" : ""}
    hover:-translate-y-[2px]
    active:translate-y-0
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-cyan-400/60
  `;

  /* ---------------- content ---------------- */
  const Content = () => (
    <span className="relative z-10 whitespace-nowrap">{text}</span>
  );

  /* ---------------- button ---------------- */
  if (type === "submit") {
    return (
      <button
        type="submit"
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={onCursorEnter}
        onMouseLeave={onCursorLeave}
        className={baseClasses}
      >
        <Content />
      </button>
    );
  }

  /* ---------------- link ---------------- */
  return (
    <Link
      to={link}
      onClick={onClick}
      onMouseEnter={onCursorEnter}
      onMouseLeave={onCursorLeave}
      className={baseClasses}
    >
      <Content />
    </Link>
  );
};

export default GradientButton;
