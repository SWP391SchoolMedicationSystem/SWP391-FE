/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import '../../css/Manager/BlogManagement.css';
import {
  useManagerBlogs,
  useManagerActions,
} from '../../utils/hooks/useManager';
import { managerBlogService } from '../../services/managerService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const statuses = ['Draft', 'Published', 'Rejected'];

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'approve'
  const [currentPost, setCurrentPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'Draft',
    featured: false,
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Approval form data
  const [approvalData, setApprovalData] = useState({
    approvalStatus: 'Approved',
    rejectionReason: '',
  });

  // Filter blogs based on search and filters
  const filteredBlogs = (blogs || []).filter(blog => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || blog.status === filterStatus;
    const matchesDeleted = showDeleted ? blog.isDeleted : !blog.isDeleted;
    return matchesSearch && matchesStatus && matchesDeleted;
  });

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle approval form changes
  const handleApprovalChange = e => {
    const { name, value } = e.target;
    setApprovalData(prev => ({
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
      await managerBlogService.uploadBlogImage(blogId, selectedImage);
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

  // Open modal for adding new post
  const handleAddPost = () => {
    setModalMode('add');
    setFormData({
      title: '',
      content: '',
      status: 'Draft',
      featured: false,
    });
    setCurrentPost(null);
    setShowModal(true);
  };

  // Open modal for editing post
  const handleEditPost = post => {
    setModalMode('edit');
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
  const handleViewPost = async post => {
    setModalMode('view');
    try {
      // Get fresh data from API for viewing
      const blogData = await getBlogById(post.id);
      setCurrentPost(blogData || post);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      setCurrentPost(post); // Fallback to current data
    }
    setShowModal(true);
  };

  // Open modal for approving post
  const handleApprovePost = post => {
    setModalMode('approve');
    setCurrentPost(post);
    setApprovalData({
      approvalStatus: 'Approved',
      rejectionReason: '',
    });
    setShowModal(true);
  };

  // Open modal for rejecting post
  const handleRejectPost = post => {
    setModalMode('approve');
    setCurrentPost(post);
    setApprovalData({
      approvalStatus: 'Rejected',
      rejectionReason: '',
    });
    setShowModal(true);
  };

  // Quick approve function
  const handleQuickApprove = async post => {
    try {
      const blogId = post.blogId || post.id;
      const approvalData = {}; // Additional data if needed

      await managerBlogService.approveBlog(blogId, approvalData);
      console.log('✅ Blog approved successfully');
      refetch(); // Refresh data
    } catch (error) {
      console.error('❌ Error approving blog:', error);
      alert('Có lỗi khi phê duyệt blog. Vui lòng thử lại!');
    }
  };

  // Quick reject function
  const handleQuickReject = async post => {
    const reason = prompt('Lý do từ chối:');
    if (!reason) return;

    try {
      const blogId = post.blogId || post.id;

      await managerBlogService.rejectBlog(blogId, reason);
      console.log('❌ Blog rejected successfully');
      refetch(); // Refresh data
    } catch (error) {
      console.error('❌ Error rejecting blog:', error);
      alert('Có lỗi khi từ chối blog. Vui lòng thử lại!');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let createdBlogId = null;

      if (modalMode === 'add') {
        // Get user info from localStorage for CreatedBy field
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const userId = userInfo.userId || userInfo.id || 1;

        const blogData = {
          title: formData.title,
          content: formData.content,
          createdBy: parseInt(userId), // Ensure it's an integer
        };

        // Create new post with image included
        const result = await createBlog(blogData, selectedImage);
        createdBlogId = result?.blogId || result?.id || result?.blogid;
        alert('Tạo bài viết thành công!');
      } else if (modalMode === 'edit') {
        // Update existing post via API (fallback các field id khác)
        const blogId =
          currentPost?.id ?? currentPost?.blogid ?? currentPost?.blogId;

        // Include imageFile in the update data
        const updateData = {
          ...formData,
          imageFile: selectedImage, // Add imageFile to update data
        };

        await updateBlog(blogId, updateData);
        createdBlogId = blogId;
        alert('Cập nhật bài viết thành công!');
      }

      // Clear image data
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setShowModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại!');
    }
  };

  const handleApprovalSubmit = async e => {
    e.preventDefault();
    try {
      const blogId = currentPost.blogId || currentPost.id;

      if (approvalData.approvalStatus === 'Approved') {
        await approveBlog(blogId);
        alert(
          '✅ Phê duyệt thành công! Bài viết đã được xuất bản và hiển thị công khai.'
        );
      } else if (approvalData.approvalStatus === 'Rejected') {
        await rejectBlog(blogId, approvalData.rejectionReason);
        alert('❌ Từ chối bài viết thành công!');
      }
      setShowModal(false);
      refetch(); // Refresh data from API
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Có lỗi xảy ra khi xử lý phê duyệt. Vui lòng thử lại!');
    }
  };

  const handleDeletePost = async postId => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const idValue = postId ?? postId?.blogid ?? postId?.blogId;
        await deleteBlog(idValue);
        alert('Xóa bài viết thành công!');
        refetch(); // Refresh data from API
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại!');
      }
    }
  };

  const getStatusBadgeClass = status => {
    switch (status) {
      case 'Published':
      case 'Đã đăng':
        return 'status-published';
      case 'Draft':
      case 'Bản nháp':
        return 'status-draft';
      case 'Rejected':
      case 'Từ chối':
        return 'status-rejected';
      case 'Pending':
      case 'Chờ duyệt':
        return 'status-pending';
      case 'Scheduled':
        return 'status-scheduled';
      case 'Archived':
        return 'status-archived';
      default:
        return 'status-draft';
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    return content.length <= maxLength
      ? content
      : content.substring(0, maxLength) + '...';
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
              {filteredBlogs.filter(b => b.status === 'Published').length}
            </h3>
            <p>Đã đăng</p>
          </div>
        </div>
        <div className="stat-card draft">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{filteredBlogs.filter(b => b.status === 'Draft').length}</h3>
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
                  onChange={e => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
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
                onClick={handleAddPost}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#2f5148',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(47, 81, 72, 0.3)',
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#1e342a';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(47, 81, 72, 0.4)';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#2f5148';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(47, 81, 72, 0.3)';
                }}
              >
                ➕ Tạo bài viết mới
              </button>
            </div>
          </div>

          {/* Blog Posts Cards - Facebook Style */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {filteredBlogs.map(post => (
              <div key={post.id} className="blog-card-fb">
                {post.image && (
                  <div
                    className="blog-image"
                    onClick={() => handleViewPost(post)}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
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
                  <div className="blog-title-fb">{post.title}</div>
                  <div className="blog-meta-fb">
                    {post.author} ·{' '}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : ''}{' '}
                    · 👁️ {post.readCount || 0}·{' '}
                    <span
                      className={`status-badge ${
                        post.status === 'Published'
                          ? 'status-published'
                          : post.status === 'Rejected'
                          ? 'status-rejected'
                          : post.status === 'Pending'
                          ? 'status-pending'
                          : 'status-draft'
                      }`}
                    >
                      {post.status || 'Draft'}
                    </span>
                  </div>
                  <div className="blog-body-fb">
                    {post.content?.length > 120
                      ? post.content.substring(0, 120) + '...'
                      : post.content}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="blog-actions-fb">
                  {(post.status === 'Pending' || post.status === 'Draft') && (
                    <>
                      <button
                        className="action-btn-fb approve"
                        onClick={() => handleQuickApprove(post)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          backgroundColor: '#e8f5e8',
                          color: '#2e7d32',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.target.style.backgroundColor = '#c8e6c9';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.backgroundColor = '#e8f5e8';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <CheckCircleIcon
                          sx={{ fontSize: '1.2rem', color: '#97a19b' }}
                        />
                        Phê duyệt
                      </button>
                      <button
                        className="action-btn-fb reject"
                        onClick={() => handleQuickReject(post)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.target.style.backgroundColor = '#ffcdd2';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.backgroundColor = '#ffebee';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <CancelIcon
                          sx={{ fontSize: '1.2rem', color: '#97a19b' }}
                        />
                        Từ chối
                      </button>
                    </>
                  )}

                  {(post.status === 'Published' ||
                    post.status === 'Rejected') && (
                    <button
                      className="action-btn-fb"
                      onClick={() => handleDeletePost(post.blogId || post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = '#ffcdd2';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = '#ffebee';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <DeleteIcon
                        sx={{ fontSize: '1.2rem', color: '#97a19b' }}
                      />
                      Xóa
                    </button>
                  )}

                  <button
                    className="action-btn-fb"
                    onClick={() => handleViewPost(post)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.target.style.backgroundColor = '#bbdefb';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.backgroundColor = '#e3f2fd';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <VisibilityIcon
                      sx={{ fontSize: '1.2rem', color: '#97a19b' }}
                    />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && (
              <div className="no-data">
                <p>Không tìm thấy blog phù hợp với bộ lọc</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
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
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && '➕ Thêm bài viết mới'}
                {modalMode === 'edit' && '✏️ Chỉnh sửa bài viết'}
                {modalMode === 'view' && currentPost?.title}
                {modalMode === 'approve' && '✅ Phê duyệt & Xuất bản'}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="modal-body">
                {/* Hiển thị hình ảnh nếu có */}
                {currentPost?.image && (
                  <div className="blog-image blog-detail-image">
                    <img
                      src={currentPost.image}
                      alt={currentPost.title}
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
                    <span className="category-badge">
                      {currentPost?.category || 'Không phân loại'}
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
                  {currentPost?.status === 'Rejected' &&
                    currentPost?.rejectionReason && (
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
                            ❌ {currentPost.rejectionReason}
                          </p>
                          {currentPost.rejectedByName && (
                            <small
                              style={{ color: '#6b7280', fontSize: '0.8rem' }}
                            >
                              Từ chối bởi: {currentPost.rejectedByName}
                              {currentPost.rejectedOn &&
                                ` - ${new Date(
                                  currentPost.rejectedOn
                                ).toLocaleDateString('vi-VN')}`}
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
                      ).toLocaleDateString('vi-VN')}
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
                          'vi-VN'
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
            ) : modalMode === 'approve' ? (
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

                  {approvalData.approvalStatus === 'Rejected' && (
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
                      {approvalData.approvalStatus === 'Approved'
                        ? 'Phê duyệt'
                        : 'Từ chối'}
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
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={uploadingImage}
                    >
                      {uploadingImage
                        ? '⏳ Đang xử lý...'
                        : modalMode === 'add'
                        ? 'Tạo bài viết'
                        : 'Cập nhật'}
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
