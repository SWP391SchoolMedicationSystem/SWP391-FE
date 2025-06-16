import React from "react";

const AdminPlaceholder = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>🚧</h1>
        <h2 style={{ marginBottom: "15px" }}>Trang Admin</h2>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Trang quản trị Admin đang được phát triển
        </p>
        <p style={{ fontSize: "0.9rem", opacity: 0.7, marginTop: "20px" }}>
          Vui lòng quay lại sau!
        </p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
