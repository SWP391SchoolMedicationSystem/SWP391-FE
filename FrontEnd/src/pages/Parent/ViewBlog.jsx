import React, { useState } from 'react';
import '../../css/Parent/ViewBlog.css';
import { useOutletContext } from 'react-router-dom';
import { useParentBlogs } from '../../utils/hooks/useParent';

// Material-UI Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EventIcon from '@mui/icons-material/Event';

function ViewBlog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Get theme from parent layout
  const context = useOutletContext();
  const { theme } = context || { theme: null };

  // Use API hooks
  const { data: blogs, loading, error, refetch } = useParentBlogs();

  const categories = [
    {
      id: 'health',
      name: 'Sức khỏe',
      icon: <LocalHospitalIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />,
    },
    {
      id: 'nutrition',
      name: 'Dinh dưỡng',
      icon: <RestaurantIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />,
    },
    {
      id: 'vaccination',
      name: 'Tiêm chủng',
      icon: <VaccinesIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />,
    },
    {
      id: 'event',
      name: 'Sự kiện',
      icon: <EventIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />,
    },
  ];

  // Filter blogs
  const filteredBlogs = (blogs || []).filter(blog => {
    const matchesSearch =
      (blog.title &&
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.content &&
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (blog.tags &&
        Array.isArray(blog.tags) &&
        blog.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesCategory =
      filterCategory === '' || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewBlog = blog => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const getCategoryName = category => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  // Statistics
  const stats = {
    total: filteredBlogs.length,
    published: filteredBlogs.filter(b => b.status === 'Published').length,
    draft: filteredBlogs.filter(b => b.status === 'Draft').length,
    totalReads: filteredBlogs.reduce(
      (sum, blog) => sum + (blog.readCount || 0),
      0
    ),
  };

  // Common styles
  const containerStyle = {
    padding: '20px',
    background: theme ? theme.background : '#f2f6f3',
    minHeight: '100vh',
    fontFamily:
      "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    transition: 'all 0.3s ease',
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
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBlogs.map(blog => (
            <div key={blog.id} className="blog-card-fb">
              {blog.image && (
                <div
                  className="blog-image"
                  onClick={() => handleViewBlog(blog)}
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-image-img"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="blog-image-fallback">
                    <span>🖼️</span>
                    <span>Không thể tải hình ảnh</span>
                  </div>
                </div>
              )}
              <div className="blog-content-fb">
                <div className="blog-title-fb">{blog.title}</div>
                <div className="blog-meta-fb">
                  {blog.author} ·{' '}
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : ''}{' '}
                  · 👁️ {blog.readCount || 0}
                </div>
                <div className="blog-body-fb">
                  {blog.content?.length > 120
                    ? blog.content.substring(0, 120) + '...'
                    : blog.content}
                </div>
              </div>
            </div>
          ))}
          {filteredBlogs.length === 0 && (
            <div className="no-data">
              <p>Không tìm thấy blog phù hợp với bộ lọc</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
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
            onClick={e => e.stopPropagation()}
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
                <div className="blog-image blog-detail-image">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="blog-image-img"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="blog-image-fallback">
                    <span>🖼️</span>
                    <span>Không thể tải hình ảnh</span>
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
