
import React from "react";

export const UtilityPole: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v20"></path>
      <path d="M2 5h20"></path>
      <path d="M3 3v2"></path>
      <path d="M21 3v2"></path>
      <path d="M7 14l-4 4"></path>
      <path d="M17 14l4 4"></path>
      <path d="M7 9l-3-3"></path>
      <path d="M17 9l3-3"></path>
    </svg>
  );
};
