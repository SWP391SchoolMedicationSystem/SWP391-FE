import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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

  // Mock blog data - remove this when API is working
  const [mockBlogs] = useState([
    {
      id: 1,
      title: "Hướng dẫn chăm sóc trẻ bị sốt tại trường",
      content:
        "Khi trẻ bị sốt tại trường, y tá cần thực hiện các bước sau để đảm bảo an toàn cho trẻ...",
      author: "Y tá Nguyễn Thị Mai",
      createdDate: "2024-03-20",
      updatedDate: "2024-03-20",
      status: "Đã đăng",
      category: "Sức khỏe",
      tags: ["sốt", "chăm sóc", "y tế"],
      readCount: 45,
    },
    {
      id: 2,
      title: "Phòng ngừa dị ứng thức ăn ở trẻ mầm non",
      content:
        "Dị ứng thức ăn là một vấn đề phổ biến ở trẻ em. Để phòng ngừa và xử lý khi có dị ứng...",
      author: "Y tá Nguyễn Thị Mai",
      createdDate: "2024-03-18",
      updatedDate: "2024-03-19",
      status: "Chờ duyệt",
      category: "Dinh dưỡng",
      tags: ["dị ứng", "thức ăn", "phòng ngừa"],
      readCount: 32,
    },
    {
      id: 3,
      title: "Vệ sinh tay đúng cách cho trẻ em",
      content:
        "Vệ sinh tay là biện pháp đơn giản nhưng hiệu quả nhất để ngăn ngừa các bệnh truyền nhiễm...",
      author: "Y tá Nguyễn Thị Mai",
      createdDate: "2024-03-15",
      updatedDate: "2024-03-15",
      status: "Bản nháp",
      category: "Vệ sinh",
      tags: ["vệ sinh", "rửa tay", "phòng bệnh"],
      readCount: 0,
    },
    {
      id: 4,
      title: "Xử lý khi trẻ bị ngã tại trường",
      content:
        "Khi trẻ bị ngã hoặc va đập tại trường, y tá cần đánh giá tình trạng và xử lý phù hợp...",
      author: "Y tá Nguyễn Thị Mai",
      createdDate: "2024-03-10",
      updatedDate: "2024-03-10",
      status: "Từ chối",
      category: "An toàn",
      tags: ["an toàn", "xử lý", "chấn thương"],
      readCount: 0,
    },
  ]);

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

  // Available options (keep for mock data compatibility)
  const categories = [
    "Sức khỏe",
    "Dinh dưỡng",
    "Vệ sinh",
    "An toàn",
    "Phát triển",
  ];
  const statuses = ["Bản nháp", "Chờ duyệt", "Đã đăng", "Từ chối"];

  // Use real blogs or fallback to mock data
  const blogData = blogs || mockBlogs;

  // Debug API response
  console.log("API blogs response:", blogs);
  console.log("Using blogData:", blogData);

  // Filter blogs
  const filteredBlogs = blogData.filter((blog) => {
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

      console.log("Sending blog data:", blogData);

      if (isEditing) {
        const blogId =
          selectedBlog?.id ?? selectedBlog?.blogid ?? selectedBlog?.blogId;
        await updateBlog(blogId, blogData);
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
    switch (status?.toLowerCase()) {
      case "đã đăng":
      case "published":
        return "published";
      case "bản nháp":
      case "draft":
        return "draft";
      case "từ chối":
      case "rejected":
        return "rejected";
      case "chờ duyệt":
      case "pending":
        return "pending";
      default:
        return "draft";
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
    total: blogData.length,
    published: blogData.filter((b) => b.status === "Đã đăng").length,
    draft: blogData.filter((b) => b.status === "Bản nháp").length,
    totalReads: blogData.reduce((sum, blog) => sum + (blog.readCount || 0), 0),
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
            className="btn-toggle"
            onClick={() => setShowDeleted((prev) => !prev)}
          >
            {showDeleted ? "↩️ Hoạt động" : "🗑️ Đã xóa"}
          </button>
          <button className="create-blog-btn" onClick={handleCreateBlog}>
            ➕ Tạo blog mới
          </button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id} className={blog.isDeleted ? "deleted-row" : ""}>
                <td className="blog-title-cell">
                  <div className="blog-title-wrapper">
                    <h4>{blog.title}</h4>
                    <p className="blog-excerpt">
                      {blog.content.length > 120
                        ? blog.content.substring(0, 120) + "..."
                        : blog.content}
                    </p>
                    {blog.tags && Array.isArray(blog.tags) && (
                      <div className="blog-tags">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`category-badge ${getCategoryColor(
                      blog.category
                    )}`}
                  >
                    {blog.category}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(blog.status)}`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td>
                  <span className="read-count">👁️ {blog.readCount}</span>
                </td>
                <td>
                  <div className="date-info">
                    <span className="created-date">{blog.createdDate}</span>
                    {blog.updatedDate !== blog.createdDate && (
                      <span className="updated-date">
                        Sửa: {blog.updatedDate}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleViewBlog(blog)}
                        className="btn-view"
                        sx={{ color: "#6c757d" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => handleEditBlog(blog)}
                        className="btn-edit"
                        sx={{ color: "#6c757d" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteBlog(blog)}
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
