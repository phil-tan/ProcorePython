import React from "react";

const LoadingSpinner = () => {
  const spinnerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    fontSize: "1.2rem",
  };

  const spinnerInnerStyles = {
    display: "flex",
    justifyContent: "space-between",
    width: "8rem",
    height: "0.4rem",
    borderRadius: "0.2rem",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  };

  const spinnerBarStyles = {
    width: "1rem",
    height: "100%",
    backgroundColor: "#333",
    animation: "spinner-progress 1s infinite ease-in-out",
  };

  const spinnerAnimation = `
    @keyframes spinner-progress {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }
  `;

  const wrapperStyles = {
    height: "60vh",
    position: "relative",
  };

  const containerStyles = {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    bottom: 0,
  };

  return (
    <div style={wrapperStyles}>
      <div style={containerStyles}>
        <div style={spinnerStyles}>
          <style>{spinnerAnimation}</style>
          <div style={spinnerInnerStyles}>
            <div style={spinnerBarStyles}></div>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
