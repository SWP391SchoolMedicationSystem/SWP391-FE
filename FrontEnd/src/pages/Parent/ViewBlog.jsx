import React, { useState } from 'react';
import '../../css/Parent/ViewBlog.css';
import { useOutletContext } from 'react-router-dom';
import { useParentBlogs } from '../../utils/hooks/useParent';

// Material-UI Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

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
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    transition: 'all 0.3s ease',
  };

  // Show loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
            gap: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            margin: '40px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
          }}
        >
          <LocalHospitalIcon sx={{ color: '#97a19b', fontSize: '3rem' }} />
          <p
            style={{
              color: '#2f5148',
              fontSize: '1.1rem',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Đang tải danh sách blog...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
            gap: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            margin: '40px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
          }}
        >
          <LocalHospitalIcon sx={{ color: '#dc3545', fontSize: '3rem' }} />
          <p
            style={{
              color: '#dc3545',
              fontSize: '1.1rem',
              fontWeight: 500,
              margin: 0,
              textAlign: 'center',
            }}
          >
            Lỗi khi tải blog: {error}
          </p>
          <button
            onClick={refetch}
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              fontFamily:
                'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshIcon sx={{ fontSize: '1.2rem' }} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
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
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: '3rem', color: 'white' }} />
            Blog Sức Khỏe
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              opacity: 0.95,
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              margin: 0,
            }}
          >
            Những thông tin hữu ích về sức khỏe và dinh dưỡng cho con em
          </p>
        </div>
      </div>

      {/* Statistics */}
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
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              {stats.total}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
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
            <EventIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              {stats.published}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              Đã đăng
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
            <VaccinesIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              {stats.draft}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              Bản nháp
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
            <RestaurantIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              {stats.totalReads}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              Lượt đọc
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '18px',
          boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
          border: '1px solid rgba(193, 203, 194, 0.3)',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: '1',
              minWidth: '300px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            >
              <SearchIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm blog..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 15px 15px 55px',
                border: '1px solid #c1cbc2',
                borderRadius: '12px',
                fontSize: '1rem',
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
                background: 'white',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#2f5148';
                e.target.style.boxShadow = '0 0 0 3px rgba(47, 81, 72, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#c1cbc2';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              minWidth: '200px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            >
              <FilterListIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
            </div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 15px 15px 55px',
                border: '1px solid #c1cbc2',
                borderRadius: '12px',
                fontSize: '1rem',
                fontFamily:
                  'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
                background: 'white',
                cursor: 'pointer',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#2f5148';
                e.target.style.boxShadow = '0 0 0 3px rgba(47, 81, 72, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#c1cbc2';
                e.target.style.boxShadow = 'none';
              }}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
            gap: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            margin: '40px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(193, 203, 194, 0.3)',
          }}
        >
          <LocalHospitalIcon sx={{ color: '#97a19b', fontSize: '3rem' }} />
          <p
            style={{
              color: '#2f5148',
              fontSize: '1.1rem',
              fontWeight: 500,
              margin: 0,
              textAlign: 'center',
            }}
          >
            Chưa có blog nào được đăng tải
          </p>
          <button
            onClick={refetch}
            style={{
              background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              fontFamily:
                'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshIcon sx={{ fontSize: '1.2rem' }} />
            Tải lại
          </button>
        </div>
      )}

      {/* Blog Feed - Facebook Style */}
      {!loading && !error && blogs && blogs.length > 0 && (
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
              </div>
            ))}
          {filteredBlogs.length === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                gap: '15px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '18px',
                margin: '20px 0',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(193, 203, 194, 0.3)',
              }}
            >
              <SearchIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
              <p
                style={{
                  color: '#2f5148',
                  fontSize: '1rem',
                  fontWeight: 500,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Không tìm thấy blog phù hợp với bộ lọc
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                }}
                style={{
                  background:
                    'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  fontFamily:
                    'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Blog Modal */}
      {showModal && selectedBlog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflow: 'hidden',
              border: '1px solid #c1cbc2',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              fontFamily:
                'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '25px',
                borderBottom: '1px solid #e9ecef',
                background:
                  'linear-gradient(135deg, #2f5148 0%, #4a7065 25%, #73ad67 75%, #85b373 100%)',
                color: 'white',
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
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <EventIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                {selectedBlog.title}
              </h3>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '8px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                }}
                onClick={() => setShowModal(false)}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                maxHeight: 'calc(90vh - 100px)',
                overflowY: 'auto',
                padding: '0',
              }}
            >
              {/* Blog Image */}
              {selectedBlog.image && (
                <div
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    maxHeight: '60vh',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '16px',
                      color: '#97a19b',
                      background: '#f8f9fa',
                    }}
                  >
                    <span style={{ fontSize: '4rem' }}>🖼️</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                      Không thể tải hình ảnh
                    </span>
                  </div>
                </div>
              )}

              {/* Blog Metadata */}
              <div
                style={{
                  padding: '25px',
                  borderBottom: '1px solid #e9ecef',
                  background: '#f8f9fa',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#2f5148',
                    }}
                  >
                    <LocalHospitalIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Tác giả:
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {selectedBlog.author || selectedBlog.createdByName}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#2f5148',
                    }}
                  >
                    <EventIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Ngày đăng:
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {selectedBlog.createdAt
                        ? new Date(selectedBlog.createdAt).toLocaleDateString(
                            'vi-VN'
                          )
                        : 'Không có'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#2f5148',
                    }}
                  >
                    <VaccinesIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Danh mục:
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        padding: '4px 12px',
                        background: 'rgba(115, 173, 103, 0.1)',
                        color: '#2f5148',
                        borderRadius: '12px',
                      }}
                    >
                      {getCategoryName(selectedBlog.category)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#2f5148',
                    }}
                  ></div>
                </div>
              </div>

              {/* Blog Content */}
              <div
                style={{
                  padding: '25px',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  color: '#2f5148',
                }}
              >
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {selectedBlog.content}
                  </p>
                </div>
              </div>

              {/* Tags Section */}
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div
                  style={{
                    padding: '20px 25px',
                    borderTop: '1px solid #e9ecef',
                    background: '#f8f9fa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: '#2f5148',
                        fontSize: '0.9rem',
                      }}
                    >
                      Tags:
                    </span>
                    {selectedBlog.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
                          background: 'rgba(115, 173, 103, 0.1)',
                          color: '#2f5148',
                          borderRadius: '16px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBlog;
