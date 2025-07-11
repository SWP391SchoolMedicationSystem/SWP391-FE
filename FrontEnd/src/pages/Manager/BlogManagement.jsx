import React, { useState } from "react";
import "../../css/Manager/BlogManagement.css";
import {
  useManagerBlogs,
  useManagerActions,
} from "../../utils/hooks/useManager";

function BlogManagement() {
  // Use API hooks
  const { data: blogs, loading, error, refetch } = useManagerBlogs();
  const {
    approveBlog,
    rejectBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    loading: actionLoading,
  } = useManagerActions();

  // Available statuses
  const statuses = ["Draft", "Published", "Rejected"];

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view', 'approve'
  const [currentPost, setCurrentPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "Draft",
    featured: false,
  });

  // Approval form data
  const [approvalData, setApprovalData] = useState({
    approvalStatus: "Approved",
    rejectionReason: "",
  });

  // Filter blogs based on search and filters
  const filteredBlogs = (blogs || []).filter((blog) => {
        const matchesSearch =
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === "" || blog.status === filterStatus;
        const matchesDeleted = showDeleted ? blog.isDeleted : !blog.isDeleted;
        return matchesSearch && matchesStatus && matchesDeleted;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle approval form changes
  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApprovalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for adding new post
  const handleAddPost = () => {
    setModalMode("add");
    setFormData({
      title: "",
      content: "",
      status: "Draft",
      featured: false,
    });
    setCurrentPost(null);
    setShowModal(true);
  };

  // Open modal for editing post
  const handleEditPost = (post) => {
    setModalMode("edit");
    setFormData({
      title: post.title,
      content: post.content,
      status: post.status,
      featured: post.featured,
    });
    setCurrentPost(post);
    setShowModal(true);
  };

  // Open modal for viewing post
  const handleViewPost = async (post) => {
    setModalMode("view");
    try {
      // Get fresh data from API for viewing
      const blogData = await getBlogById(post.id);
      setCurrentPost(blogData || post);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setCurrentPost(post); // Fallback to current data
    }
    setShowModal(true);
  };

  // Open modal for approving post
  const handleApprovePost = (post) => {
    setModalMode("approve");
    setCurrentPost(post);
    setApprovalData({
      approvalStatus: "Approved",
      rejectionReason: "",
    });
    setShowModal(true);
  };

  // Open modal for rejecting post
  const handleRejectPost = (post) => {
    setModalMode("approve");
    setCurrentPost(post);
    setApprovalData({
      approvalStatus: "Rejected",
      rejectionReason: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        // Create new post via API
        await createBlog(formData);
        alert("Tạo bài viết thành công!");
      } else if (modalMode === "edit") {
        // Update existing post via API (fallback các field id khác)
        const blogId =
          currentPost?.id ?? currentPost?.blogid ?? currentPost?.blogId;
        await updateBlog(blogId, formData);
        alert("Cập nhật bài viết thành công!");
      }
      setShowModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại!");
    }
  };

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogId = currentPost.blogId || currentPost.id;

      if (approvalData.approvalStatus === "Approved") {
        await approveBlog(blogId);
        alert(
          "✅ Phê duyệt thành công! Bài viết đã được xuất bản và hiển thị công khai."
        );
      } else if (approvalData.approvalStatus === "Rejected") {
        await rejectBlog(blogId, approvalData.rejectionReason);
        alert("❌ Từ chối bài viết thành công!");
      }
      setShowModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error("Error processing approval:", error);
      alert("Có lỗi xảy ra khi xử lý phê duyệt. Vui lòng thử lại!");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const idValue = postId ?? postId?.blogid ?? postId?.blogId;
        await deleteBlog(idValue);
        alert("Xóa bài viết thành công!");
        refetch(); // Refresh data from API
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại!");
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Published":
      case "Đã đăng":
        return "status-published";
      case "Draft":
      case "Bản nháp":
        return "status-draft";
      case "Rejected":
      case "Từ chối":
        return "status-rejected";
      case "Pending":
      case "Chờ duyệt":
        return "status-pending";
      case "Scheduled":
        return "status-scheduled";
      case "Archived":
        return "status-archived";
      default:
        return "status-draft";
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return "";
    return content.length <= maxLength
      ? content
      : content.substring(0, maxLength) + "...";
  };

  return (
    <div className="blog-management-container">
      {/* Header */}
      <div className="blog-header">
          <h1>📝 Quản Lý Blog</h1>
          <p>Quản lý các bài viết blog sức khỏe và thông tin y tế</p>
        </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{filteredBlogs.length}</h3>
            <p>Tổng bài viết</p>
          </div>
        </div>
        <div className="stat-card published">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>
              {filteredBlogs.filter((b) => b.status === "Published").length}
            </h3>
            <p>Đã đăng</p>
          </div>
        </div>
        <div className="stat-card draft">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{filteredBlogs.filter((b) => b.status === "Draft").length}</h3>
            <p>Bản nháp</p>
          </div>
        </div>
        <div className="stat-card reads">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>
              {filteredBlogs.reduce(
                (sum, blog) => sum + (blog.readCount || 0),
                0
              )}
            </h3>
            <p>Lượt đọc</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>⏳ Đang tải danh sách blog...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>❌ Lỗi khi tải danh sách blog: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!blogs || blogs.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có blog nào trong hệ thống</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Controls */}
      {!loading && !error && blogs && blogs.length > 0 && (
        <>
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
                onClick={handleAddPost}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: "#2f5148",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(47, 81, 72, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#1e342a";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(47, 81, 72, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#2f5148";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(47, 81, 72, 0.3)";
                }}
              >
                ➕ Tạo bài viết mới
              </button>
            </div>
          </div>

          {/* Blog Posts Cards - Facebook Style */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
                {filteredBlogs.map((post) => (
              <div
                    key={post.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e4e6ea",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  opacity: post.isDeleted ? 0.7 : 1,
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {/* Author Avatar */}
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        backgroundColor: "#2f5148",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "16px",
                        boxShadow: "0 2px 6px rgba(47, 81, 72, 0.2)",
                      }}
                    >
                      {(post.createdByName || post.author || "A")
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
                        {post.createdByName || post.author || "Quản lý"}
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
                            post.createdAt || post.createdDate
                          ).toLocaleDateString("vi-VN")}
                        </span>
                        {post.updatedAt &&
                          post.updatedAt !== post.createdDate && (
                            <>
                              <span>•</span>
                              <span>Đã chỉnh sửa</span>
                            </>
                          )}
                        <span>•</span>
                        <span>ID: {post.blogId || post.id}</span>
                        {post.isDeleted && (
                          <>
                            <span>•</span>
                            <span
                              style={{ color: "#e41e3f", fontWeight: "500" }}
                            >
                              Đã xóa
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Status & Category */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {post.category && (
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
                        {post.category}
                      </span>
                    )}
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor:
                          post.status === "Published"
                            ? "#d4edda"
                            : post.status === "Draft"
                            ? "#fff3cd"
                            : post.status === "Rejected"
                            ? "#f8d7da"
                            : "#f0f2f5",
                        color:
                          post.status === "Published"
                            ? "#155724"
                            : post.status === "Draft"
                            ? "#856404"
                            : post.status === "Rejected"
                            ? "#721c24"
                            : "#65676b",
                      }}
                      >
                        {post.status}
                      </span>
                    {post.approvedBy ? (
                        <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: "#d4edda",
                          color: "#155724",
                        }}
                      >
                        ✅ Đã duyệt
                        </span>
                    ) : (
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: "#fff3cd",
                          color: "#856404",
                        }}
                      >
                        ⏳ Chờ duyệt
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
                    onClick={() => handleViewPost(post)}
                  >
                    {post.title}
                    {post.featured && (
                      <span
                        style={{
                          marginLeft: "8px",
                          padding: "2px 8px",
                          backgroundColor: "#fff3cd",
                          color: "#856404",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        ⭐ Nổi bật
                      </span>
                    )}
                  </h3>
                  <p
                    style={{
                      color: "#65676b",
                      fontSize: "15px",
                      lineHeight: "1.5",
                      margin: "0 0 12px",
                    }}
                  >
                    {truncateContent(post.excerpt || post.content, 150)}
                  </p>
                  {/* Tags */}
                  {post.tags &&
                    Array.isArray(post.tags) &&
                    post.tags.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginBottom: "12px",
                        }}
                      >
                        {post.tags.map((tag, index) => (
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
                  {post.status === "Rejected" && post.rejectionReason && (
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
                        {post.rejectionReason}
                      </div>
                    </div>
                  )}
                  {/* Post Image */}
                  {post.image && (
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
                      onClick={() => handleViewPost(post)}
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
                        src={post.image}
                        alt={post.title}
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
                {(post.readCount || 0) > 0 && (
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
                      👁️ {post.readCount} lượt xem
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
                          onClick={() => handleViewPost(post)}
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
                          onClick={() => handleEditPost(post)}
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
                  {/* Approval Buttons */}
                        {(post.status === "Draft" ||
                          post.status === "Pending" ||
                          !post.approvedBy) &&
                          !post.isDeleted && (
                            <>
                              <button
                                onClick={() => handleApprovePost(post)}
                                disabled={actionLoading}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            backgroundColor: "#d4edda",
                            border: "none",
                            borderRadius: "8px",
                            color: "#155724",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: actionLoading ? "not-allowed" : "pointer",
                            opacity: actionLoading ? 0.6 : 1,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!actionLoading)
                              e.target.style.backgroundColor = "#c3e6cb";
                          }}
                          onMouseLeave={(e) => {
                            if (!actionLoading)
                              e.target.style.backgroundColor = "#d4edda";
                          }}
                        >
                          {actionLoading ? "⏳" : "✅"} Phê duyệt
                              </button>
                              <button
                                onClick={() => handleRejectPost(post)}
                                disabled={actionLoading}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            backgroundColor: "#f8d7da",
                            border: "none",
                            borderRadius: "8px",
                            color: "#721c24",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: actionLoading ? "not-allowed" : "pointer",
                            opacity: actionLoading ? 0.6 : 1,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!actionLoading)
                              e.target.style.backgroundColor = "#f1b0b7";
                          }}
                          onMouseLeave={(e) => {
                            if (!actionLoading)
                              e.target.style.backgroundColor = "#f8d7da";
                          }}
                        >
                          {actionLoading ? "⏳" : "❌"} Từ chối
                              </button>
                            </>
                          )}
                        <button
                    onClick={() => handleDeletePost(post.blogId || post.id)}
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
                {/* Approval Details */}
                {post.approvedBy && (
                  <div
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#f8f9fa",
                      borderTop: "1px solid #f0f2f5",
                      fontSize: "13px",
                      color: "#65676b",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>
                      Đã được phê duyệt bởi:
                    </span>{" "}
                    {post.approvedByName}
                    <span style={{ margin: "0 8px" }}>•</span>
                    <span>
                      {new Date(post.approvedOn).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {filteredBlogs.length === 0 && (
              <div className="no-data">
                <p>Không tìm thấy blog phù hợp với bộ lọc</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                  }}
                  className="retry-btn"
                >
                  🔄 Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {modalMode === "add" && "➕ Thêm bài viết mới"}
                {modalMode === "edit" && "✏️ Chỉnh sửa bài viết"}
                {modalMode === "view" && currentPost?.title}
                {modalMode === "approve" && "✅ Phê duyệt & Xuất bản"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {modalMode === "view" ? (
              <div className="modal-body">
                {/* Hiển thị hình ảnh nếu có */}
                {currentPost?.image && (
                  <div className="blog-detail-image">
                    <img
                      src={currentPost.image}
                      alt={currentPost.title}
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
                    <span className="category-badge">
                      {currentPost?.category || "Không phân loại"}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Trạng thái:</span>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        currentPost?.status
                      )}`}
                    >
                      {currentPost?.status}
                    </span>
                  </div>
                  {currentPost?.status === "Rejected" &&
                    currentPost?.rejectionReason && (
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
                            ❌ {currentPost.rejectionReason}
                          </p>
                          {currentPost.rejectedByName && (
                            <small
                              style={{ color: "#6b7280", fontSize: "0.8rem" }}
                            >
                              Từ chối bởi: {currentPost.rejectedByName}
                              {currentPost.rejectedOn &&
                                ` - ${new Date(
                                  currentPost.rejectedOn
                                ).toLocaleDateString("vi-VN")}`}
                            </small>
                          )}
                </div>
                </div>
                    )}
                  <div className="meta-row">
                    <span className="meta-label">Tác giả:</span>
                    <span>
                      {currentPost?.createdByName || currentPost?.author}
                    </span>
                </div>
                  <div className="meta-row">
                    <span className="meta-label">Ngày tạo:</span>
                    <span>
                      {new Date(
                        currentPost?.createdAt || currentPost?.createdDate
                      ).toLocaleDateString("vi-VN")}
                    </span>
              </div>
                  <div className="meta-row">
                    <span className="meta-label">Lượt đọc:</span>
                    <span>{currentPost?.readCount || 0}</span>
                  </div>
                  {currentPost?.approvedBy && (
                    <div className="meta-row">
                      <span className="meta-label">Đã phê duyệt bởi:</span>
                      <span>{currentPost.approvedByName}</span>
                    </div>
                  )}
                  {currentPost?.approvedOn && (
                    <div className="meta-row">
                      <span className="meta-label">Ngày phê duyệt:</span>
                      <span>
                        {new Date(currentPost.approvedOn).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="blog-content">
                  <p>{currentPost?.content}</p>
                </div>

                <div className="blog-tags-section">
                  <span className="tags-label">Tags:</span>
                  {currentPost?.tags &&
                    Array.isArray(currentPost.tags) &&
                    currentPost.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            ) : modalMode === "approve" ? (
              <div className="modal-body">
                <form onSubmit={handleApprovalSubmit} className="approval-form">
                <div className="form-group">
                    <label>Trạng thái phê duyệt *</label>
                  <select
                    name="approvalStatus"
                    value={approvalData.approvalStatus}
                    onChange={handleApprovalChange}
                    required
                  >
                      <option value="Approved">✅ Phê duyệt</option>
                    <option value="Rejected">❌ Từ chối</option>
                  </select>
                </div>

                {approvalData.approvalStatus === "Rejected" && (
                  <div className="form-group">
                      <label>Lý do từ chối *</label>
                    <textarea
                      name="rejectionReason"
                      value={approvalData.rejectionReason}
                      onChange={handleApprovalChange}
                      required
                        rows="4"
                        placeholder="Nhập lý do từ chối..."
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                      className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                      Hủy
                  </button>
                    <button type="submit" className="btn-save">
                    {approvalData.approvalStatus === "Approved"
                        ? "Phê duyệt"
                        : "Từ chối"}
                  </button>
                </div>
              </form>
              </div>
            ) : (
              <div className="modal-body">
                <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-group">
                    <label>Tiêu đề *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                      placeholder="Nhập tiêu đề bài viết..."
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
                      placeholder="Nhập nội dung bài viết..."
                  />
                </div>

                  <div className="form-group">
                    <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                      Đánh dấu bài viết nổi bật
                    </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                      className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                      Hủy
                  </button>
                    <button type="submit" className="btn-save">
                      {modalMode === "add" ? "Tạo bài viết" : "Cập nhật"}
                  </button>
                </div>
              </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogManagement;
