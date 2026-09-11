import React from "react";

export type IconName =
  | "dashboard"
  | "monitoring"
  | "inventory"
  | "groups"
  | "description"
  | "mail"
  | "event"
  | "settings"
  | "shield"
  | "hub"
  | "rocket"
  | "architecture"
  | "visibility";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName | string;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  filled?: boolean;
}

export default function Icon({
  name,
  width = 16, 
  height = 20,
  color = "#003D9B", 
  className = "",
  filled = false,
  ...props
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined inline-flex items-center justify-center select-none transition-all ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${height}px`, 
        color: color,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
      {...props}
    >
      {name}
    </span>
  );
}