import React, { useState } from "react";
import "../../css/Nurse/NurseBlog.css";
import { useNurseBlogs, useNurseActions } from "../../utils/hooks/useNurse";

function Blog() {
  // Use API hooks
  const { data: blogs, loading, error, refetch } = useNurseBlogs();
  const {
    createBlog,
    updateBlog,
    deleteBlog,
    loading: actionLoading,
  } = useNurseActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Available options
  const categories = [
    "Sức khỏe",
    "Dinh dưỡng",
    "Vệ sinh",
    "An toàn",
    "Phát triển",
  ];
  const statuses = ["Draft", "Published", "Pending", "Rejected"];

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
    const matchesStatus = filterStatus === "" || blog.status === filterStatus;
    const matchesDeleted = showDeleted ? blog.isDeleted : !blog.isDeleted;
    return matchesSearch && matchesCategory && matchesStatus && matchesDeleted;
  });

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleCreateBlog = () => {
    setFormData({
      title: "",
      content: "",
    });
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const handleEditBlog = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
    });
    setSelectedBlog(blog);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userId = userInfo.userId || userInfo.id || 1;

      const blogData = {
        title: formData.title,
        content: formData.content,
        status: "Draft",
        isDeleted: false,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      };

      if (isEditing) {
        const blogId =
          selectedBlog?.blogId ?? selectedBlog?.id ?? selectedBlog?.blogid;

        // Format data for update API (need blogID in body)
        const updateData = {
          blogID: blogId,
          title: formData.title,
          content: formData.content,
          updatedBy: userId,
          status: "Draft",
          isDeleted: false,
        };

        await updateBlog(blogId, updateData);
        alert("Đã cập nhật blog thành công!");
      } else {
        await createBlog(blogData);
        alert("Đã tạo blog mới thành công!");
      }

      setShowCreateModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Có lỗi xảy ra khi lưu blog. Vui lòng thử lại!");
    }
  };

  const handleDeleteBlog = async (blog) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa blog này?")) {
      try {
        const blogId = blog?.id ?? blog?.blogid ?? blog?.blogId;
        await deleteBlog(blogId);
        alert("Đã xóa blog thành công!");
        refetch();
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Có lỗi xảy ra khi xóa blog.");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Đã đăng":
      case "Published":
        return "status-published";
      case "Bản nháp":
      case "Draft":
        return "status-draft";
      case "Rejected":
      case "Từ chối":
        return "status-rejected";
      case "Pending":
      case "Chờ duyệt":
        return "status-pending";
      default:
        return "status-draft";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Sức khỏe": "category-health",
      "Dinh dưỡng": "category-nutrition",
      "Vệ sinh": "category-hygiene",
      "An toàn": "category-safety",
      "Phát triển": "category-development",
    };
    return colors[category] || "category-default";
  };

  // Statistics
  const stats = {
    total: (blogs || []).length,
    published: (blogs || []).filter((b) => b.status === "Đã đăng").length,
    draft: (blogs || []).filter((b) => b.status === "Bản nháp").length,
    totalReads: (blogs || []).reduce(
      (sum, blog) => sum + (blog.readCount || 0),
      0
    ),
  };

  // Show loading state
  if (loading) {
    return (
      <div className="nurse-blog-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách blog...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="nurse-blog-container">
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
    <div className="nurse-blog-container">
      <div className="blog-header">
        <h1>📝 Quản Lý Blog Y Tế</h1>
        <p>Tạo và quản lý các bài viết sức khỏe cho phụ huynh</p>
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
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowDeleted((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: showDeleted ? "#fff3cd" : "#f0f2f5",
              border: "none",
              borderRadius: "10px",
              color: showDeleted ? "#856404" : "#65676b",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = showDeleted
                ? "#fff8dc"
                : "#e4e6ea";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = showDeleted
                ? "#fff3cd"
                : "#f0f2f5";
            }}
          >
            {showDeleted ? "↩️ Hoạt động" : "🗑️ Đã xóa"}
          </button>
          <button
            onClick={handleCreateBlog}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: "#42b883",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(66, 184, 131, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#369970";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 6px 16px rgba(66, 184, 131, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#42b883";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(66, 184, 131, 0.3)";
            }}
          >
            ➕ Tạo blog mới
          </button>
        </div>
      </div>

      {/* Blog Feed - Facebook Style */}
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
              opacity: blog.isDeleted ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
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
                    backgroundColor: "#42b883",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "16px",
                    boxShadow: "0 2px 6px rgba(66, 184, 131, 0.3)",
                  }}
                >
                  {(blog.createdByName || blog.author || "Y")
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
                    {blog.createdByName || blog.author || "Y tá"}
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
                    {blog.updatedAt && blog.updatedAt !== blog.createdDate && (
                      <>
                        <span>•</span>
                        <span>Đã chỉnh sửa</span>
                      </>
                    )}
                    {blog.isDeleted && (
                      <>
                        <span>•</span>
                        <span style={{ color: "#e41e3f", fontWeight: "500" }}>
                          Đã xóa
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Category */}
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
                    {blog.category}
                  </span>
                )}

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor:
                      blog.status === "Published"
                        ? "#d4edda"
                        : blog.status === "Draft"
                        ? "#fff3cd"
                        : blog.status === "Rejected"
                        ? "#f8d7da"
                        : "#f0f2f5",
                    color:
                      blog.status === "Published"
                        ? "#155724"
                        : blog.status === "Draft"
                        ? "#856404"
                        : blog.status === "Rejected"
                        ? "#721c24"
                        : "#65676b",
                  }}
                >
                  {blog.status}
                </span>
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

              {/* Rejection Notice */}
              {blog.status === "Rejected" && blog.rejectionReason && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "12px",
                    margin: "12px 0",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      color: "#dc2626",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    ❌ Lý do từ chối:
                  </div>
                  <div style={{ color: "#7f1d1d", lineHeight: "1.4" }}>
                    {blog.rejectionReason}
                  </div>
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
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
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

              <button
                onClick={() => handleEditBlog(blog)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  backgroundColor: "#e7f3ff",
                  border: "none",
                  borderRadius: "8px",
                  color: "#1877f2",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#d0e8ff")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#e7f3ff")
                }
              >
                ✏️ Chỉnh sửa
              </button>

              <button
                onClick={() => handleDeleteBlog(blog)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  backgroundColor: "#ffebee",
                  border: "none",
                  borderRadius: "8px",
                  color: "#c62828",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#ffcdd2")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ffebee")
                }
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy blog nào</p>
          </div>
        )}
      </div>

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
              <div className="blog-detail-meta">
                <div className="meta-row">
                  <span className="meta-label">Danh mục:</span>
                  <span
                    className={`category-badge ${getCategoryColor(
                      selectedBlog.category
                    )}`}
                  >
                    {selectedBlog.category}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Trạng thái:</span>
                  <span
                    className={`status-badge ${getStatusClass(
                      selectedBlog.status
                    )}`}
                  >
                    {selectedBlog.status}
                  </span>
                </div>
                {selectedBlog.status === "Rejected" &&
                  selectedBlog.rejectionReason && (
                    <div className="meta-row rejection-info">
                      <span className="meta-label">Lý do từ chối:</span>
                      <div className="rejection-reason">
                        <p
                          style={{
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "12px",
                            margin: "8px 0",
                            color: "#dc2626",
                            fontSize: "0.9rem",
                            lineHeight: "1.5",
                          }}
                        >
                          ❌ {selectedBlog.rejectionReason}
                        </p>
                        {selectedBlog.rejectedByName && (
                          <small
                            style={{ color: "#6b7280", fontSize: "0.8rem" }}
                          >
                            Từ chối bởi: {selectedBlog.rejectedByName}
                            {selectedBlog.rejectedOn &&
                              ` - ${new Date(
                                selectedBlog.rejectedOn
                              ).toLocaleDateString("vi-VN")}`}
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                <div className="meta-row">
                  <span className="meta-label">Tác giả:</span>
                  <span>{selectedBlog.author}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Ngày tạo:</span>
                  <span>{selectedBlog.createdDate}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Lượt đọc:</span>
                  <span>{selectedBlog.readCount}</span>
                </div>
              </div>

              <div className="blog-content">
                <p>{selectedBlog.content}</p>
              </div>

              <div className="blog-tags-section">
                <span className="tags-label">Tags:</span>
                {selectedBlog.tags &&
                  Array.isArray(selectedBlog.tags) &&
                  selectedBlog.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Blog Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{isEditing ? "Chỉnh sửa blog" : "Tạo blog mới"}</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitForm} className="blog-form">
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tiêu đề blog..."
                  />
                </div>

                <div className="form-group">
                  <label>Nội dung *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="12"
                    placeholder="Nhập nội dung blog..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-save">
                    {isEditing ? "Cập nhật" : "Tạo blog"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
