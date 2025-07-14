import React, { useState, useRef } from 'react';
import '../../css/Nurse/NurseBlog.css';
import { useNurseBlogs, useNurseActions } from '../../utils/hooks/useNurse';
import { nurseBlogService } from '../../services/nurseService';

function Blog() {
  // Use API hooks
  const { data: blogs, loading, error, refetch } = useNurseBlogs();
  const { createBlog, updateBlog, deleteBlog } = useNurseActions();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Available options
  const categories = [
    'Sức khỏe',
    'Dinh dưỡng',
    'Vệ sinh',
    'An toàn',
    'Phát triển',
  ];
  const statuses = ['Draft', 'Published', 'Pending', 'Rejected'];

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
    const matchesStatus = filterStatus === '' || blog.status === filterStatus;
    const matchesDeleted = showDeleted ? blog.isDeleted : !blog.isDeleted;
    return matchesSearch && matchesCategory && matchesStatus && matchesDeleted;
  });

  const handleViewBlog = blog => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleCreateBlog = () => {
    setFormData({
      title: '',
      content: '',
    });
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const handleEditBlog = blog => {
    setFormData({
      title: blog.title,
      content: blog.content,
    });
    setSelectedBlog(blog);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image upload functions
  const handleImageSelect = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh không được lớn hơn 5MB!');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async blogId => {
    if (!selectedImage) return;

    try {
      setUploadingImage(true);
      await nurseBlogService.uploadBlogImage(blogId, selectedImage);
      alert('Upload ảnh thành công!');

      // Clear image data
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại!');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitForm = async e => {
    e.preventDefault();
    try {
      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const userId = userInfo.userId || userInfo.id || 1;

      const blogData = {
        title: formData.title,
        content: formData.content,
        createdBy: parseInt(userId), // Ensure it's an integer
      };

      let createdBlogId = null;

      if (isEditing) {
        const blogId =
          selectedBlog?.blogId ?? selectedBlog?.id ?? selectedBlog?.blogid;

        // Format data for update API (need blogID in body)
        const updateData = {
          blogID: blogId,
          title: formData.title,
          content: formData.content,
          updatedBy: userId,
          status: 'Draft',
          isDeleted: false,
        };

        await updateBlog(blogId, updateData);
        createdBlogId = blogId;
        alert('Đã cập nhật blog thành công!');

        // Upload image if selected for update
        if (selectedImage && createdBlogId) {
          await handleImageUpload(createdBlogId);
        }
      } else {
        // Create new blog with image included
        const result = await createBlog(blogData, selectedImage);
        createdBlogId = result?.blogId || result?.id || result?.blogid;
        alert('Đã tạo blog mới thành công!');
      }

      // Clear image data
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setShowCreateModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Có lỗi xảy ra khi lưu blog. Vui lòng thử lại!');
    }
  };

  const handleDeleteBlog = async blog => {
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      try {
        const blogId = blog?.id ?? blog?.blogid ?? blog?.blogId;
        await deleteBlog(blogId);
        alert('Đã xóa blog thành công!');
        refetch();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Có lỗi xảy ra khi xóa blog.');
      }
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'Đã đăng':
      case 'Published':
        return 'status-published';
      case 'Bản nháp':
      case 'Draft':
        return 'status-draft';
      case 'Rejected':
      case 'Từ chối':
        return 'status-rejected';
      case 'Pending':
      case 'Chờ duyệt':
        return 'status-pending';
      default:
        return 'status-draft';
    }
  };

  const getCategoryColor = category => {
    const colors = {
      'Sức khỏe': 'category-health',
      'Dinh dưỡng': 'category-nutrition',
      'Vệ sinh': 'category-hygiene',
      'An toàn': 'category-safety',
      'Phát triển': 'category-development',
    };
    return colors[category] || 'category-default';
  };

  // Statistics
  const stats = {
    total: (blogs || []).length,
    published: (blogs || []).filter(b => b.status === 'Đã đăng').length,
    draft: (blogs || []).filter(b => b.status === 'Bản nháp').length,
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
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowDeleted(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: showDeleted ? '#fff3cd' : '#f0f2f5',
              border: 'none',
              borderRadius: '10px',
              color: showDeleted ? '#856404' : '#65676b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = showDeleted
                ? '#fff8dc'
                : '#e4e6ea';
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = showDeleted
                ? '#fff3cd'
                : '#f0f2f5';
            }}
          >
            {showDeleted ? '↩️ Hoạt động' : '🗑️ Đã xóa'}
          </button>
          <button
            onClick={handleCreateBlog}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#42b883',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(66, 184, 131, 0.3)',
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = '#369970';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(66, 184, 131, 0.4)';
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = '#42b883';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(66, 184, 131, 0.3)';
            }}
          >
            ➕ Tạo blog mới
          </button>
        </div>
      </div>

      {/* Blog Feed - Facebook Style */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredBlogs.map(blog => (
          <div key={blog.id} className="blog-card-fb">
            {blog.image && (
              <div className="blog-image" onClick={() => handleViewBlog(blog)}>
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
            <p>Không tìm thấy blog nào</p>
          </div>
        )}
      </div>

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
                {selectedBlog.status === 'Rejected' &&
                  selectedBlog.rejectionReason && (
                    <div className="meta-row rejection-info">
                      <span className="meta-label">Lý do từ chối:</span>
                      <div className="rejection-reason">
                        <p
                          style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '12px',
                            margin: '8px 0',
                            color: '#dc2626',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                          }}
                        >
                          ❌ {selectedBlog.rejectionReason}
                        </p>
                        {selectedBlog.rejectedByName && (
                          <small
                            style={{ color: '#6b7280', fontSize: '0.8rem' }}
                          >
                            Từ chối bởi: {selectedBlog.rejectedByName}
                            {selectedBlog.rejectedOn &&
                              ` - ${new Date(
                                selectedBlog.rejectedOn
                              ).toLocaleDateString('vi-VN')}`}
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
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{isEditing ? 'Chỉnh sửa blog' : 'Tạo blog mới'}</h3>
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

                {/* Image Upload Section */}
                <div className="form-group">
                  <label>Hình ảnh (tùy chọn)</label>
                  <div className="image-upload-section">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />

                    {!imagePreview ? (
                      <div
                        className="image-upload-placeholder"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span style={{ fontSize: '2rem' }}>📷</span>
                        <p>Click để chọn ảnh</p>
                        <small>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</small>
                      </div>
                    ) : (
                      <div className="image-preview-container">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                        <div className="image-actions">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-change-image"
                          >
                            🔄 Đổi ảnh
                          </button>
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="btn-remove-image"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={uploadingImage}
                  >
                    {uploadingImage
                      ? '⏳ Đang xử lý...'
                      : isEditing
                      ? 'Cập nhật'
                      : 'Tạo blog'}
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
