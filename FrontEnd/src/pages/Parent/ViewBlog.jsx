import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useParentBlogs } from "../../utils/hooks/useParent";

// Material-UI Icons
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import EventIcon from "@mui/icons-material/Event";

function ViewBlog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Get theme from parent layout
  const context = useOutletContext();
  const { theme } = context || { theme: null };

  // Use API hooks
  const { data: blogs, loading, error, refetch } = useParentBlogs();

  const categories = [
    {
      id: "health",
      name: "Sức khỏe",
      icon: <LocalHospitalIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
    {
      id: "nutrition",
      name: "Dinh dưỡng",
      icon: <RestaurantIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
    {
      id: "vaccination",
      name: "Tiêm chủng",
      icon: <VaccinesIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
    {
      id: "event",
      name: "Sự kiện",
      icon: <EventIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
  ];

  // Filter blogs
  const filteredBlogs = (blogs || []).filter((blog) => {
    const matchesSearch =
      (blog.title &&
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.content &&
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.tags &&
        Array.isArray(blog.tags) &&
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesCategory =
      filterCategory === "" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const getCategoryName = (category) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.name : category;
  };

  // Statistics
  const stats = {
    total: filteredBlogs.length,
    published: filteredBlogs.filter((b) => b.status === "Published").length,
    draft: filteredBlogs.filter((b) => b.status === "Draft").length,
    totalReads: filteredBlogs.reduce(
      (sum, blog) => sum + (blog.readCount || 0),
      0
    ),
  };

  // Common styles
  const containerStyle = {
    padding: "20px",
    background: theme ? theme.background : "#f2f6f3",
    minHeight: "100vh",
    fontFamily:
      "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    transition: "all 0.3s ease",
  };

  // Show loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div className="loading-state">
          <p>⏳ Đang tải danh sách blog...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={containerStyle}>
        <div className="error-state">
          <p>❌ Lỗi khi tải blog: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div className="blog-header">
        <h1>📝 Blog Sức Khỏe</h1>
        <p>Những thông tin hữu ích về sức khỏe và dinh dưỡng cho con em</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng bài viết</p>
          </div>
        </div>
        <div className="stat-card published">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.published}</h3>
            <p>Đã đăng</p>
          </div>
        </div>
        <div className="stat-card draft">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.draft}</h3>
            <p>Bản nháp</p>
          </div>
        </div>
        <div className="stat-card reads">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>{stats.totalReads}</h3>
            <p>Lượt đọc</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-filter-controls">
          <div className="search-controls">
            <input
              type="text"
              placeholder="Tìm kiếm blog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && !error && (!blogs || blogs.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có blog nào được đăng tải</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Blog Feed - Facebook Style */}
      {!loading && !error && blogs && blogs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e4e6ea",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Post Header */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f0f2f5",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {/* Author Avatar */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "#73ad67",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "16px",
                      boxShadow: "0 2px 6px rgba(115, 173, 103, 0.3)",
                    }}
                  >
                    {(blog.createdByName || blog.author || "P")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1c1e21",
                        fontSize: "15px",
                        marginBottom: "2px",
                      }}
                    >
                      {blog.createdByName || blog.author || "Phụ huynh"}
                    </div>
                    <div
                      style={{
                        color: "#65676b",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>
                        {new Date(
                          blog.createdAt || blog.createdDate
                        ).toLocaleDateString("vi-VN")}
                      </span>
                      {blog.updatedAt &&
                        blog.updatedAt !== blog.createdDate && (
                          <>
                            <span>•</span>
                            <span>Đã chỉnh sửa</span>
                          </>
                        )}
                    </div>
                  </div>
                </div>
                {/* Category */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {blog.category && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: "500",
                        backgroundColor: "#e7f3ff",
                        color: "#1877f2",
                      }}
                    >
                      {getCategoryName(blog.category)}
                    </span>
                  )}
                </div>
              </div>
              {/* Post Content */}
              <div style={{ padding: "0 20px 16px" }}>
                <h3
                  style={{
                    margin: "12px 0 8px",
                    color: "#1c1e21",
                    fontSize: "18px",
                    fontWeight: "600",
                    lineHeight: "1.4",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewBlog(blog)}
                >
                  {blog.title}
                </h3>
                <p
                  style={{
                    color: "#65676b",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    margin: "0 0 12px",
                  }}
                >
                  {blog.content?.length > 120
                    ? blog.content.substring(0, 120) + "..."
                    : blog.content}
                </p>
                {/* Tags */}
                {blog.tags &&
                  Array.isArray(blog.tags) &&
                  blog.tags.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "12px",
                      }}
                    >
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "2px 8px",
                            backgroundColor: "#f0f2f5",
                            color: "#65676b",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                {/* Post Image */}
                {blog.image && (
                  <div
                    style={{
                      marginTop: "16px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      backgroundColor: "#f0f2f5",
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleViewBlog(blog)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        minHeight: "380px",
                        maxHeight: "650px",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      style={{
                        display: "none",
                        width: "100%",
                        height: "380px",
                        backgroundColor: "#f0f2f5",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "12px",
                        color: "#65676b",
                      }}
                    >
                      <span style={{ fontSize: "48px" }}>🖼️</span>
                      <span style={{ fontSize: "16px", fontWeight: "500" }}>
                        Không thể tải hình ảnh
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {/* Engagement Bar */}
              {(blog.readCount || 0) > 0 && (
                <div
                  style={{
                    padding: "8px 20px",
                    borderTop: "1px solid #f0f2f5",
                    borderBottom: "1px solid #f0f2f5",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                    color: "#65676b",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    👁️ {blog.readCount} lượt xem
                  </span>
                </div>
              )}
              {/* Action Buttons */}
              <div
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => handleViewBlog(blog)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    backgroundColor: "#f0f2f5",
                    border: "none",
                    borderRadius: "8px",
                    color: "#65676b",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e4e6ea")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f0f2f5")
                  }
                >
                  👁️ Xem chi tiết
                </button>
              </div>
            </div>
          ))}
          {filteredBlogs.length === 0 && (
            <div className="no-data">
              <p>Không tìm thấy blog phù hợp với bộ lọc</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                }}
                className="retry-btn"
              >
                🔄 Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Blog Modal */}
      {showModal && selectedBlog && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{selectedBlog.title}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Hiển thị hình ảnh nếu có */}
              {selectedBlog.image && (
                <div className="blog-detail-image">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      minHeight: "450px",
                      maxHeight: "600px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      marginBottom: "24px",
                      border: "none",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{
                      display: "none",
                      width: "100%",
                      height: "450px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "16px",
                      border: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "16px",
                      color: "#65676b",
                      marginBottom: "24px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <span style={{ fontSize: "4rem" }}>🖼️</span>
                    <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                      Không thể tải hình ảnh
                    </span>
                  </div>
                </div>
              )}

              <div className="blog-content">
                <p>{selectedBlog.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBlog;
