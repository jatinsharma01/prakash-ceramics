import React from "react";

export function CartIcon({ className = "w-5 h-5", strokeWidth = 7, ...props }: React.SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Top Handle: horizontal bar curving down into left support */}
      <path d="M12 23h12a3 3 0 0 1 3 2.7l5 37.3" />

      {/* Basket container */}
      <path d="M31 31h57l-6 32H35" />

      {/* Bottom Chassis: rounded loop at the left under the basket extending to the right */}
      <path d="M39 63H31a9 9 0 0 0-9 9c0 5 4 9 9 9h57" />

      {/* Front & Back Wheels */}
      <circle cx="44" cy="88" r="6.5" strokeWidth={strokeWidth} />
      <circle cx="74" cy="88" r="6.5" strokeWidth={strokeWidth} />
    </svg>
  );
}
