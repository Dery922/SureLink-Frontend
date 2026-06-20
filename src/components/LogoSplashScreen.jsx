// components/LogoSplashScreen.jsx
import React from "react";

export const LogoSplashScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {/* 🚀 Replace this path with your explicit logo asset location */}
      <img
        src="/splash.png"
        alt="SureLink Logo"
        style={{
          width: "180px",
          height: "150px",
          marginBottom: "20px",
          animate: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
