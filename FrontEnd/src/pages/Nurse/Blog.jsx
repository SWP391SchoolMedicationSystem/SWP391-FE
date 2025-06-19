import React, { useState } from "react";
import "../../css/Nurse/NurseBlog.css";
import { useNurseBlogs, useNurseActions } from "../../utils/hooks/useNurse";

function Blog() {
  // Use API hooks
  const { data: blogs, loading, error, refetch } = useNurseBlogs();
  const { createBlog, updateBlog, loading: actionLoading } = useNurseActions();

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
      status: "Đã đăng",
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
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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
  const statuses = ["Bản nháp", "Đã đăng"];

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
    return matchesSearch && matchesCategory && matchesStatus;
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
        createdBy: userId,
        createdAt: new Date().toISOString(),
      };

      console.log("Sending blog data:", blogData);

      if (isEditing) {
        await updateBlog(selectedBlog.id, blogData);
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Đã đăng":
        return "status-published";
      case "Bản nháp":
        return "status-draft";
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

        <button className="create-blog-btn" onClick={handleCreateBlog}>
          ➕ Tạo blog mới
        </button>
      </div>

      {/* Blog List */}
      <div className="blog-list">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div className="blog-header-section">
              <div className="blog-meta">
                <span
                  className={`category-badge ${getCategoryColor(
                    blog.category
                  )}`}
                >
                  {blog.category}
                </span>
                <span className={`status-badge ${getStatusClass(blog.status)}`}>
                  {blog.status}
                </span>
              </div>
              <div className="blog-stats">
                <span className="read-count">👁️ {blog.readCount}</span>
              </div>
            </div>

            <div className="blog-content-section">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">
                {blog.content.length > 100
                  ? blog.content.substring(0, 100) + "..."
                  : blog.content}
              </p>

              <div className="blog-tags">
                {blog.tags &&
                  Array.isArray(blog.tags) &&
                  blog.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>

            <div className="blog-footer-section">
              <div className="blog-info">
                <span className="author">{blog.author}</span>
                <span className="date">{blog.createdDate}</span>
                {blog.updatedDate !== blog.createdDate && (
                  <span className="updated">Cập nhật: {blog.updatedDate}</span>
                )}
              </div>

              <div className="blog-actions">
                <button
                  className="btn-view"
                  onClick={() => handleViewBlog(blog)}
                  title="Xem chi tiết"
                >
                  👁️
                </button>
                <button
                  className="btn-edit"
                  onClick={() => handleEditBlog(blog)}
                  title="Chỉnh sửa"
                >
                  ✏️
                </button>
              </div>
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
