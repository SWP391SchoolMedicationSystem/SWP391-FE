import React, { useState } from "react";
import "../../css/Parent/ViewBlog.css";
import { useParentBlogs } from "../../utils/hooks/useParent";

function ViewBlog() {
  const [searchTerm, setSearchTerm] = useState("");

  // Use API hooks
  const { data: blogs, loading, error, refetch } = useParentBlogs();

  const categories = [
    { id: "health", name: "Sức khỏe", icon: "🏥" },
    { id: "nutrition", name: "Dinh dưỡng", icon: "🥗" },
    { id: "vaccination", name: "Tiêm chủng", icon: "💉" },
    { id: "event", name: "Sự kiện", icon: "🎉" },
  ];

  const filteredBlogs = (blogs || []).filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredBlogs = filteredBlogs.slice(0, 3);
  const otherBlogs = filteredBlogs.slice(3);

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

      {/* Search Bar */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Featured Section */}
      {!loading && !error && featuredBlogs.length > 0 && (
        <div className="featured-section">
          <h3>🌟 Bài viết nổi bật</h3>
          <div className="featured-articles">
            {featuredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="featured-article"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="featured-meta">
                  <span className="featured-category">
                    {getCategoryName(blog.category)}
                  </span>
                  <span>📅 {blog.date || blog.createdDate}</span>
                </div>
                <h4>{blog.title}</h4>
                <p>{blog.excerpt || blog.content?.substring(0, 120) + "..."}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
      {!loading && !error && otherBlogs.length > 0 && (
        <div className="blog-section">
          <h3>📰 Tất cả bài viết</h3>
          <div className="blog-grid">
            {otherBlogs.map((blog) => (
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
        </div>
      )}

      {/* No filtered results */}
      {!loading &&
        !error &&
        blogs &&
        blogs.length > 0 &&
        filteredBlogs.length === 0 && (
          <div className="empty-state">
            <p>📭 Không tìm thấy bài viết phù hợp</p>
          </div>
        )}
    </div>
  );
}

export default ViewBlog;
