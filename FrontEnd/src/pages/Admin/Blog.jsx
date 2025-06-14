import React, { useState } from "react";
import "../../css/BlogManagement.css";

function Blog() {
  // Mock data for blog posts
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Hướng dẫn sử dụng hệ thống quản lý thuốc trường học",
      content:
        "Bài viết hướng dẫn chi tiết cách sử dụng hệ thống quản lý thuốc trong trường học để đảm bảo an toàn cho học sinh. Hệ thống này giúp theo dõi việc sử dụng thuốc, quản lý đơn thuốc và đảm bảo an toàn cho học sinh trong môi trường trường học.",
      author: "Nguyễn Văn An",
      category: "Hướng dẫn",
      status: "Published",
      createdDate: "2024-03-10",
      publishDate: "2024-03-12",
      views: 156,
      featured: true,
      approvalStatus: "Approved",
      approvedBy: "Admin",
      approvedDate: "2024-03-11",
    },
    {
      id: 2,
      title: "Tầm quan trọng của việc quản lý sức khỏe học sinh",
      content:
        "Sức khỏe học sinh là yếu tố quan trọng ảnh hưởng đến việc học tập và phát triển. Bài viết này sẽ chia sẻ những kinh nghiệm và phương pháp quản lý sức khỏe học sinh hiệu quả.",
      author: "Trần Thị Bình",
      category: "Sức khỏe",
      status: "Draft",
      createdDate: "2024-03-08",
      publishDate: null,
      views: 0,
      featured: false,
      approvalStatus: "Pending",
      approvedBy: null,
      approvedDate: null,
    },
    {
      id: 3,
      title: "Cập nhật tính năng mới: Theo dõi lịch uống thuốc",
      content:
        "Chúng tôi vừa ra mắt tính năng mới giúp phụ huynh và nhà trường có thể theo dõi lịch uống thuốc của học sinh một cách dễ dàng và chính xác.",
      author: "Lê Văn Cường",
      category: "Cập nhật",
      status: "Published",
      createdDate: "2024-03-05",
      publishDate: "2024-03-06",
      views: 89,
      featured: false,
      approvalStatus: "Approved",
      approvedBy: "Manager",
      approvedDate: "2024-03-05",
    },
    {
      id: 4,
      title: "Những lưu ý khi cho trẻ uống thuốc tại trường",
      content:
        "Việc cho trẻ uống thuốc tại trường cần tuân thủ nhiều quy định và lưu ý quan trọng để đảm bảo an toàn cho sức khỏe của các em.",
      author: "Phạm Thị Dung",
      category: "An toàn",
      status: "Published",
      createdDate: "2024-02-28",
      publishDate: "2024-03-01",
      views: 234,
      featured: true,
      approvalStatus: "Approved",
      approvedBy: "Admin",
      approvedDate: "2024-02-29",
    },
    {
      id: 5,
      title: "Hệ thống báo cáo và thống kê sức khỏe học sinh",
      content:
        "Giới thiệu về hệ thống báo cáo và thống kê giúp nhà trường nắm bắt tình hình sức khỏe học sinh một cách toàn diện và kịp thời.",
      author: "Hoàng Văn Em",
      category: "Báo cáo",
      status: "Scheduled",
      createdDate: "2024-03-12",
      publishDate: "2024-03-20",
      views: 0,
      featured: false,
      approvalStatus: "Pending",
      approvedBy: null,
      approvedDate: null,
    },
    {
      id: 6,
      title: "Quy trình xử lý tình huống khẩn cấp về sức khỏe",
      content:
        "Hướng dẫn quy trình xử lý các tình huống khẩn cấp liên quan đến sức khỏe học sinh tại trường học.",
      author: "Nguyễn Thị Hoa",
      category: "An toàn",
      status: "Draft",
      createdDate: "2024-03-13",
      publishDate: null,
      views: 0,
      featured: false,
      approvalStatus: "Rejected",
      approvedBy: "Manager",
      approvedDate: "2024-03-13",
      rejectionReason: "Nội dung cần bổ sung thêm thông tin chi tiết",
    },
  ]);

  // Available categories, statuses, and approval statuses
  const categories = [
    "Hướng dẫn",
    "Sức khỏe",
    "Cập nhật",
    "An toàn",
    "Báo cáo",
    "Thông báo",
  ];
  const statuses = ["Draft", "Published", "Scheduled", "Archived"];
  const approvalStatuses = ["Pending", "Approved", "Rejected"];

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view', 'approve'
  const [currentPost, setCurrentPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterApproval, setFilterApproval] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "Hướng dẫn",
    status: "Draft",
    featured: false,
    publishDate: "",
  });

  // Approval form data
  const [approvalData, setApprovalData] = useState({
    approvalStatus: "Pending",
    rejectionReason: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle approval form changes
  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApprovalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for adding new post
  const handleAddPost = () => {
    setModalMode("add");
    setFormData({
      title: "",
      content: "",
      author: "",
      category: "Hướng dẫn",
      status: "Draft",
      featured: false,
      publishDate: "",
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
      author: post.author,
      category: post.category,
      status: post.status,
      featured: post.featured,
      publishDate: post.publishDate || "",
    });
    setCurrentPost(post);
    setShowModal(true);
  };

  // Open modal for viewing post
  const handleViewPost = (post) => {
    setModalMode("view");
    setCurrentPost(post);
    setShowModal(true);
  };

  // Open modal for approving post
  const handleApprovePost = (post) => {
    setModalMode("approve");
    setCurrentPost(post);
    setApprovalData({
      approvalStatus: post.approvalStatus || "Pending",
      rejectionReason: post.rejectionReason || "",
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      const newPost = {
        id: blogPosts.length + 1,
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
        views: 0,
        approvalStatus: "Pending",
        approvedBy: null,
        approvedDate: null,
      };
      setBlogPosts((prev) => [newPost, ...prev]);
    } else if (modalMode === "edit") {
      setBlogPosts((prev) =>
        prev.map((post) =>
          post.id === currentPost.id ? { ...post, ...formData } : post
        )
      );
    }

    setShowModal(false);
  };

  // Handle approval submission
  const handleApprovalSubmit = (e) => {
    e.preventDefault();

    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === currentPost.id
          ? {
              ...post,
              approvalStatus: approvalData.approvalStatus,
              approvedBy: "Current User", // In real app, get from auth
              approvedDate: new Date().toISOString().split("T")[0],
              rejectionReason:
                approvalData.approvalStatus === "Rejected"
                  ? approvalData.rejectionReason
                  : null,
            }
          : post
      )
    );

    setShowModal(false);
  };

  // Handle delete post
  const handleDeletePost = (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  // Toggle featured status
  const handleToggleFeatured = (postId) => {
    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, featured: !post.featured } : post
      )
    );
  };

  // Filter posts based on search and filters
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || post.category === filterCategory;
    const matchesStatus = filterStatus === "" || post.status === filterStatus;
    const matchesApproval =
      filterApproval === "" || post.approvalStatus === filterApproval;

    return matchesSearch && matchesCategory && matchesStatus && matchesApproval;
  });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Published":
        return "status-published";
      case "Draft":
        return "status-draft";
      case "Scheduled":
        return "status-scheduled";
      case "Archived":
        return "status-archived";
      default:
        return "status-default";
    }
  };

  // Get approval status badge class
  const getApprovalBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "approval-approved";
      case "Pending":
        return "approval-pending";
      case "Rejected":
        return "approval-rejected";
      default:
        return "approval-default";
    }
  };

  // Truncate content for display
  const truncateContent = (content, maxLength = 100) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div className="blog-management-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Blog Management</h1>
          <p>Manage blog posts, articles, and content with approval workflow</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddPost}>
          <i className="icon-plus"></i>
          Add New Post
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
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
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filterApproval}
            onChange={(e) => setFilterApproval(e.target.value)}
            className="filter-select"
          >
            <option value="">All Approval</option>
            {approvalStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`post-card ${post.featured ? "featured" : ""}`}
          >
            {post.featured && <div className="featured-badge">Featured</div>}

            <div className="post-header">
              <div className="post-meta">
                <span className="category">{post.category}</span>
                <span className={`status ${getStatusBadgeClass(post.status)}`}>
                  {post.status}
                </span>
                <span
                  className={`approval-status ${getApprovalBadgeClass(
                    post.approvalStatus
                  )}`}
                >
                  {post.approvalStatus}
                </span>
              </div>
              <div className="post-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleToggleFeatured(post.id)}
                  title={
                    post.featured ? "Remove from featured" : "Add to featured"
                  }
                >
                  {post.featured ? "⭐" : "☆"}
                </button>
              </div>
            </div>

            <div className="post-content">
              <h3 className="post-title" onClick={() => handleViewPost(post)}>
                {post.title}
              </h3>
              <p className="post-excerpt">{truncateContent(post.content)}</p>

              <div className="post-info">
                <div className="author-info">
                  <span className="author">By {post.author}</span>
                  <span className="date">{post.createdDate}</span>
                </div>
                <div className="post-stats">
                  <span className="views">👁 {post.views}</span>
                </div>
              </div>

              {post.approvalStatus === "Rejected" && post.rejectionReason && (
                <div className="rejection-reason">
                  <strong>Rejection Reason:</strong> {post.rejectionReason}
                </div>
              )}
            </div>

            <div className="post-footer">
              <div className="action-buttons">
                <button
                  className="btn btn-sm btn-view"
                  onClick={() => handleViewPost(post)}
                >
                  View
                </button>
                <button
                  className="btn btn-sm btn-edit"
                  onClick={() => handleEditPost(post)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-approve"
                  onClick={() => handleApprovePost(post)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-data">
          <p>No blog posts found matching your criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">Total Posts:</span>
          <span className="stat-value">{blogPosts.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Published:</span>
          <span className="stat-value">
            {blogPosts.filter((p) => p.status === "Published").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending Approval:</span>
          <span className="stat-value">
            {blogPosts.filter((p) => p.approvalStatus === "Pending").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Featured:</span>
          <span className="stat-value">
            {blogPosts.filter((p) => p.featured).length}
          </span>
        </div>
      </div>

      {/* Modal for Add/Edit/View/Approve Post */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "add" && "Add New Blog Post"}
                {modalMode === "edit" && "Edit Blog Post"}
                {modalMode === "view" && "View Blog Post"}
                {modalMode === "approve" && "Blog Approval"}
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
                    <span className="category">{currentPost.category}</span>
                    <span
                      className={`status ${getStatusBadgeClass(
                        currentPost.status
                      )}`}
                    >
                      {currentPost.status}
                    </span>
                    <span
                      className={`approval-status ${getApprovalBadgeClass(
                        currentPost.approvalStatus
                      )}`}
                    >
                      {currentPost.approvalStatus}
                    </span>
                    {currentPost.featured && (
                      <span className="featured-tag">Featured</span>
                    )}
                  </div>
                </div>

                <div className="view-info">
                  <p>
                    <strong>Author:</strong> {currentPost.author}
                  </p>
                  <p>
                    <strong>Created:</strong> {currentPost.createdDate}
                  </p>
                  {currentPost.publishDate && (
                    <p>
                      <strong>Published:</strong> {currentPost.publishDate}
                    </p>
                  )}
                  <p>
                    <strong>Views:</strong> {currentPost.views}
                  </p>
                  {currentPost.approvedBy && (
                    <p>
                      <strong>Approved by:</strong> {currentPost.approvedBy}
                    </p>
                  )}
                  {currentPost.approvedDate && (
                    <p>
                      <strong>Approved on:</strong> {currentPost.approvedDate}
                    </p>
                  )}
                </div>

                <div className="view-content">
                  <h4>Content:</h4>
                  <p>{currentPost.content}</p>
                </div>

                {currentPost.rejectionReason && (
                  <div className="rejection-info">
                    <h4>Rejection Reason:</h4>
                    <p>{currentPost.rejectionReason}</p>
                  </div>
                )}

                <div className="view-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditPost(currentPost)}
                  >
                    Edit Post
                  </button>
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprovePost(currentPost)}
                  >
                    Manage Approval
                  </button>
                </div>
              </div>
            ) : modalMode === "approve" ? (
              <form onSubmit={handleApprovalSubmit} className="approval-form">
                <div className="approval-info">
                  <h4>Post: {currentPost.title}</h4>
                  <p>
                    <strong>Author:</strong> {currentPost.author}
                  </p>
                  <p>
                    <strong>Category:</strong> {currentPost.category}
                  </p>
                  <p>
                    <strong>Current Status:</strong>
                    <span
                      className={`approval-status ${getApprovalBadgeClass(
                        currentPost.approvalStatus
                      )}`}
                    >
                      {currentPost.approvalStatus}
                    </span>
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="approvalStatus">Approval Decision *</label>
                  <select
                    id="approvalStatus"
                    name="approvalStatus"
                    value={approvalData.approvalStatus}
                    onChange={handleApprovalChange}
                    className="form-select"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </div>

                {approvalData.approvalStatus === "Rejected" && (
                  <div className="form-group">
                    <label htmlFor="rejectionReason">Rejection Reason *</label>
                    <textarea
                      id="rejectionReason"
                      name="rejectionReason"
                      value={approvalData.rejectionReason}
                      onChange={handleApprovalChange}
                      rows="4"
                      className="form-textarea"
                      placeholder="Please provide a reason for rejection..."
                      required
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Approval Decision
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">Content *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="8"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">Author *</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status *</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="publishDate">Publish Date</label>
                    <input
                      type="date"
                      id="publishDate"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="form-checkbox"
                      />
                      <label htmlFor="featured">Featured Post</label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === "add" ? "Create Post" : "Save Changes"}
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

export default Blog;
