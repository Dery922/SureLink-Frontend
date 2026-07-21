import React from "react";

export const PaystackIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://w3.org"
  >
    {/* Paystack's official dual-chevron / ribbon path */}
    <path d="M2 8.5L12 3.5L22 8.5L12 13.5L2 8.5Z" fill="#3BB75E" />
    <path
      d="M2 15.5L12 20.5L22 15.5L12 10.5L2 15.5Z"
      fill="#011B33"
      opacity="0.8"
    />
  </svg>
);
