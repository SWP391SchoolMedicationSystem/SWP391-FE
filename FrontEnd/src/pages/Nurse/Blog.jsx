/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import '../../css/Nurse/NurseBlog.css';
import { useNurseBlogs, useNurseActions } from '../../utils/hooks/useNurse';
import { nurseBlogService } from '../../services/nurseService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
  const statuses = ['Draft', 'Published', 'Rejected'];

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
          imageFile: selectedImage, // Add imageFile to update data
        };

        await updateBlog(blogId, updateData);
        createdBlogId = blogId;
        alert('Đã cập nhật blog thành công!');
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

  // Helper function to convert status to Vietnamese
  const getStatusText = status => {
    switch (status) {
      case 'Published':
        return 'Đã duyệt';
      case 'Draft':
        return 'Chưa duyệt';
      case 'Rejected':
        return 'Bị từ chối';
      case 'Pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'Published':
        return {
          backgroundColor: '#4caf50',
          color: 'white',
        };
      case 'Draft':
        return {
          backgroundColor: '#ff9800',
          color: 'white',
        };
      case 'Rejected':
        return {
          backgroundColor: '#f44336',
          color: 'white',
        };
      case 'Pending':
        return {
          backgroundColor: '#2196f3',
          color: 'white',
        };
      default:
        return {
          backgroundColor: '#9e9e9e',
          color: 'white',
        };
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
    published: (blogs || []).filter(b => b.status === 'Published').length,
    draft: (blogs || []).filter(b => b.status === 'Draft').length,
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
      {/* Modern Header */}
      <div
        style={{
          background:
            'linear-gradient(135deg, #2f5148 0%, #4a7065 25%, #73ad67 75%, #85b373 100%)',
          borderRadius: '24px',
          padding: '40px 35px',
          boxShadow:
            '0 20px 40px rgba(47, 81, 72, 0.2), 0 8px 16px rgba(47, 81, 72, 0.15)',
          textAlign: 'center',
          color: 'white',
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        ></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              marginBottom: '12px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: '3rem', color: 'white' }} />
            Quản Lý Blog Y Tế
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              opacity: 0.95,
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              margin: 0,
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Tạo và quản lý các bài viết sức khỏe cho phụ huynh
          </p>
        </div>
      </div>

      {/* Modern Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <LocalHospitalIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {stats.total}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Tổng bài viết
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <CheckCircleIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {stats.published}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Đã duyệt
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <CancelIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {stats.draft}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Chưa duyệt
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <VisibilityIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {stats.totalReads}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Lượt đọc
            </p>
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
                  {getStatusText(status)}
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
        {filteredBlogs
          .slice()
          .reverse()
          .map(blog => (
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

                {/* Status Badge */}
                <div style={{ marginBottom: '10px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      ...getStatusClass(blog.status),
                    }}
                  >
                    {blog.status === 'Draft' && '📝 Chưa duyệt'}
                    {blog.status === 'Published' && '✅ Đã duyệt'}
                    {blog.status === 'Pending' && '⏳ Chờ duyệt'}
                    {blog.status === 'Rejected' && '❌ Bị từ chối'}
                  </span>
                </div>

                <div className="blog-meta-fb">
                  {blog.author} ·{' '}
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : ''}{' '}
                </div>
                <div className="blog-body-fb">
                  {blog.content?.length > 120
                    ? blog.content.substring(0, 120) + '...'
                    : blog.content}
                </div>
              </div>

              {/* Action buttons */}
              <div className="blog-actions-fb">
                <button
                  className="action-btn-fb edit"
                  onClick={() => handleEditBlog(blog)}
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
                  <EditIcon sx={{ fontSize: '1.2rem', color: '#97a19b' }} />
                  Chỉnh sửa
                </button>
                <button
                  className="action-btn-fb reject"
                  onClick={() => handleDeleteBlog(blog)}
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
                  <DeleteIcon sx={{ fontSize: '1.2rem', color: '#97a19b' }} />
                  Xóa
                </button>
                <button
                  className="action-btn-fb"
                  onClick={() => handleViewBlog(blog)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: '#f0f2f5',
                    color: '#65676b',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#e4e6ea';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = '#f0f2f5';
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
                    style={{
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      ...getStatusClass(selectedBlog.status),
                    }}
                  >
                    {selectedBlog.status === 'Draft' && '📝 Chưa duyệt'}
                    {selectedBlog.status === 'Published' && '✅ Đã duyệt'}
                    {selectedBlog.status === 'Pending' && '⏳ Chờ duyệt'}
                    {selectedBlog.status === 'Rejected' && '❌ Bị từ chối'}
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
              </div>

              <div className="blog-content">
                <p>{selectedBlog.content}</p>
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
                        <small>Hỗ trợ: JPG, PNG, JPEG (tối đa 2MB)</small>
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
