import React, { useState } from "react";
import "../../css/Parent/ViewBlog.css";
import { useParentBlogs } from "../../utils/hooks/useParent";

function ViewBlog() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Use API hooks
  const { data: blogs, loading, error, refetch } = useParentBlogs();

  const categories = [
    { id: "all", name: "Tất cả", icon: "📚" },
    { id: "health", name: "Sức khỏe", icon: "🏥" },
    { id: "nutrition", name: "Dinh dưỡng", icon: "🥗" },
    { id: "vaccination", name: "Tiêm chủng", icon: "💉" },
    { id: "event", name: "Sự kiện", icon: "🎉" },
  ];

  const filteredBlogs = blogs
    ? selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory)
    : [];

  const getCategoryName = (category) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.name : category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      health: "#e8f5e8",
      nutrition: "#fff3e0",
      vaccination: "#e3f2fd",
      event: "#fce4ec",
    };
    return colors[category] || "#f5f5f5";
  };

  return (
    <div className="view-blog-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>📰 Blog Sức Khỏe</h1>
          <p>Những thông tin hữu ích về sức khỏe và dinh dưỡng cho con em</p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="categories-section">
        <h3>Danh mục:</h3>
        <div className="categories-list">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>⏳ Đang tải blog...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>❌ Lỗi khi tải blog: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!blogs || blogs.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có blog nào được đăng tải</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Blog Grid */}
      {!loading && !error && blogs && blogs.length > 0 && (
        <div className="blog-grid">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-image">
                <div className="image-placeholder">📷</div>
                <div
                  className="blog-category"
                  style={{ backgroundColor: getCategoryColor(blog.category) }}
                >
                  {getCategoryName(blog.category)}
                </div>
              </div>

              <div className="blog-content">
                <div className="blog-meta">
                  <span className="author">👨‍⚕️ {blog.author}</span>
                  <span className="date">
                    📅 {blog.date || blog.createdDate}
                  </span>
                  <span className="read-time">
                    ⏱️ {blog.readTime || "5 phút"}
                  </span>
                </div>

                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">
                  {blog.excerpt || blog.content?.substring(0, 100) + "..."}
                </p>

                {blog.tags && (
                  <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="blog-actions">
                  <button className="read-more-btn">Đọc tiếp</button>
                  <button className="save-btn">💾 Lưu</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No filtered results */}
      {!loading &&
        !error &&
        blogs &&
        blogs.length > 0 &&
        filteredBlogs.length === 0 && (
          <div className="empty-state">
            <p>
              📭 Không có blog nào trong danh mục "
              {getCategoryName(selectedCategory)}"
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="retry-btn"
            >
              📚 Xem tất cả
            </button>
          </div>
        )}
    </div>
  );
}

export default ViewBlog;
