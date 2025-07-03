import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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

  // State for blog posts (for local updates)
  const [localBlogPosts, setLocalBlogPosts] = useState([]);

  // Update local posts when API data changes
  React.useEffect(() => {
    if (blogs) {
      setLocalBlogPosts(blogs);
    }
  }, [blogs]);

  // Available statuses for Manager
  const statuses = ["Draft", "Published", "Rejected"];

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view'
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
    approvalMessage: "", // Thêm field cho message approve/reject
  });

  // Filter blogs based on search and filters
  const filteredBlogs = localBlogPosts
    ? localBlogPosts.filter((blog) => {
        const matchesSearch =
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === "" || blog.status === filterStatus;
        const matchesDeleted = showDeleted ? blog.isDeleted : !blog.isDeleted;
        return matchesSearch && matchesStatus && matchesDeleted;
      })
    : [];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      approvalMessage: "",
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
      approvalMessage: "", // Reset message khi edit
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        // Create new post via API
        await createBlog(formData);
        alert("✅ Tạo bài viết thành công!");
      } else if (modalMode === "edit") {
        // Get blogId from current post (support multiple field names)
        const blogId =
          currentPost?.blogId || currentPost?.id || currentPost?.blogid;

        // Check if status changed to Published or Rejected (approval actions)
        const oldStatus = currentPost?.status?.toLowerCase();
        const newStatus = formData.status?.toLowerCase();

        if (
          oldStatus !== newStatus &&
          (newStatus === "published" || newStatus === "rejected")
        ) {
          // Handle approval/rejection
          if (newStatus === "published") {
            await approveBlog(blogId, formData.approvalMessage);
            alert("✅ Blog đã được duyệt và xuất bản thành công!");
          } else if (newStatus === "rejected") {
            await rejectBlog(blogId, formData.approvalMessage);
            alert("❌ Blog đã bị từ chối!");
          }
        } else {
          // Regular update
          await updateBlog(blogId, formData);
          alert("✅ Cập nhật bài viết thành công!");
        }
      }
      setShowModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("❌ Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại!");
    }
  };

  const handleDeletePost = async (post) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        // Get blogId from post object (support multiple field names)
        const blogId = post?.blogId || post?.id || post?.blogid || post;
        await deleteBlog(blogId);
        alert("✅ Xóa bài viết thành công!");
        refetch(); // Refresh data from API
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("❌ Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại!");
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "published";
      case "draft":
        return "draft";
      case "rejected":
        return "rejected";
      case "pending":
        return "pending";
      case "scheduled":
        return "pending";
      case "archived":
        return "draft";
      default:
        return "draft";
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
      <div className="page-header">
        <div className="header-content">
          <h1>📝 Quản Lý Blog</h1>
          <p>Quản lý các bài viết blog sức khỏe và thông tin y tế</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-sm btn-toggle"
            onClick={() => setShowDeleted((prev) => !prev)}
          >
            {showDeleted ? "↩️ Hoạt động" : "🗑️ Đã xóa"}
          </button>
          <button className="btn btn-primary" onClick={handleAddPost}>
            ➕ Tạo Bài Viết Mới
          </button>
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

      {/* Filters and Search */}
      {!loading && !error && blogs && blogs.length > 0 && (
        <>
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, tác giả, nội dung..."
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

          {/* Blog Posts Table */}
          <div className="table-container">
            <table className="blog-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Đã xóa</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((post) => (
                  <tr
                    key={post.id}
                    className={post.isDeleted ? "deleted-row" : ""}
                  >
                    <td>{post.id}</td>
                    <td className="blog-title-cell">
                      <div className="blog-title-wrapper">
                        <h4>{post.title}</h4>
                        <p className="blog-excerpt">
                          {truncateContent(post.excerpt || post.content)}
                        </p>
                        {post.featured && (
                          <span className="featured-badge">⭐ Nổi bật</span>
                        )}
                      </div>
                    </td>
                    <td>{post.author}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td>{post.createdDate}</td>
                    <td>
                      <span
                        className={`deleted-badge ${
                          post.isDeleted ? "deleted-true" : "deleted-false"
                        }`}
                      >
                        {post.isDeleted ? "Đã xóa" : "Hoạt động"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleViewPost(post)}
                            className="btn-view"
                            sx={{ color: "#6c757d" }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleEditPost(post)}
                            className="btn-edit"
                            sx={{ color: "#6c757d" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa Blog">
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePost(post)}
                            className="btn-delete"
                            sx={{ color: "#6c757d" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "add" && "➕ Tạo Bài Viết Mới"}
                {modalMode === "edit" && "✏️ Chỉnh Sửa Blog"}
                {modalMode === "view" && "👁 Xem Chi Tiết Blog"}
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {modalMode === "view" ? (
              <div className="post-view">
                <div className="view-header">
                  <h3>{currentPost.title}</h3>
                  <div className="view-meta">
                    <span
                      className={`status ${getStatusBadgeClass(
                        currentPost.status
                      )}`}
                    >
                      {currentPost.status}
                    </span>
                  </div>
                </div>

                <div className="view-info">
                  <p>
                    <strong>ID:</strong> {currentPost.id}
                  </p>
                  <p>
                    <strong>Author:</strong> {currentPost.author}
                  </p>
                  <p>
                    <strong>Created:</strong> {currentPost.createdDate}
                  </p>
                  <p>
                    <strong>Deleted:</strong>{" "}
                    {currentPost.isDeleted ? "Đã xóa" : "Hoạt động"}
                  </p>
                  {currentPost.approvedBy && (
                    <p>
                      <strong>Approved by:</strong> {currentPost.approvedBy} on{" "}
                      {currentPost.approvedDate}
                    </p>
                  )}
                </div>

                <div className="view-content">
                  <h4>Content:</h4>
                  <p>{currentPost.content}</p>
                </div>

                <div className="view-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditPost(currentPost)}
                  >
                    ✏️ Edit Post
                  </button>
                </div>
              </div>
            ) : (
              <form className="post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">📝 Tiêu đề bài viết:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">🔄 Trạng thái:</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status === "Draft" && "📝 Draft (Bản nháp)"}
                          {status === "Published" && "✅ Published (Đã duyệt)"}
                          {status === "Rejected" && "❌ Rejected (Từ chối)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Approval Message Field - chỉ hiển thị khi status là Published hoặc Rejected */}
                {(formData.status === "Published" ||
                  formData.status === "Rejected") && (
                  <div className="form-group">
                    <label htmlFor="approvalMessage">
                      💬{" "}
                      {formData.status === "Published"
                        ? "Ghi chú duyệt (tùy chọn):"
                        : "Lý do từ chối:"}
                    </label>
                    <textarea
                      id="approvalMessage"
                      name="approvalMessage"
                      value={formData.approvalMessage}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                      placeholder={
                        formData.status === "Published"
                          ? "Nhập ghi chú cho việc duyệt blog..."
                          : "Vui lòng cung cấp lý do từ chối..."
                      }
                      required={formData.status === "Rejected"}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="content">📄 Nội dung bài viết:</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="8"
                    required
                    placeholder="Viết nội dung bài viết tại đây..."
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="featured">
                    ⭐ Đánh dấu là bài viết nổi bật
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    ❌ Hủy
                  </button>
                  <button
                    type="submit"
                    className={`btn ${
                      formData.status === "Published"
                        ? "btn-approve"
                        : formData.status === "Rejected"
                        ? "btn-reject"
                        : "btn-primary"
                    }`}
                  >
                    {modalMode === "add"
                      ? "➕ Tạo Bài Viết"
                      : formData.status === "Published"
                      ? "✅ Duyệt & Lưu"
                      : formData.status === "Rejected"
                      ? "❌ Từ Chối & Lưu"
                      : "💾 Cập Nhật"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogManagement;
