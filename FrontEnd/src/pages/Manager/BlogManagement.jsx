import React, { useState } from "react";
import "../../css/Manager/BlogManagement.css";

function BlogManagement() {
  // Mock data for blog posts
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Hướng dẫn chăm sóc trẻ em mùa đông",
      excerpt:
        "Những lưu ý quan trọng khi chăm sóc sức khỏe trẻ em trong mùa đông lạnh giá...",
      content: "Nội dung chi tiết về cách chăm sóc trẻ em mùa đông...",
      author: "Dr. Nguyễn Văn A",
      category: "Sức khỏe",
      status: "Published",
      approvalStatus: "Approved",
      featured: true,
      createdDate: "2024-03-10",
      publishedDate: "2024-03-12",
      views: 1250,
      approvedBy: "Manager",
      tags: ["sức khỏe", "trẻ em", "mùa đông"],
    },
    {
      id: 2,
      title: "Dinh dưỡng cân bằng cho trẻ mầm non",
      excerpt:
        "Cách xây dựng chế độ dinh dưỡng phù hợp cho trẻ em độ tuổi mầm non...",
      content: "Nội dung chi tiết về dinh dưỡng trẻ em...",
      author: "Y tá Trần Thị B",
      category: "Dinh dưỡng",
      status: "Published",
      approvalStatus: "Approved",
      featured: false,
      createdDate: "2024-03-08",
      publishedDate: "2024-03-09",
      views: 890,
      approvedBy: "Manager",
      tags: ["dinh dưỡng", "trẻ em"],
    },
    {
      id: 3,
      title: "Phòng ngừa các bệnh truyền nhiễm",
      excerpt:
        "Các biện pháp phòng ngừa hiệu quả để bảo vệ trẻ khỏi các bệnh truyền nhiễm...",
      content: "Nội dung chi tiết về phòng ngừa bệnh tật...",
      author: "Dr. Lê Văn C",
      category: "Phòng bệnh",
      status: "Draft",
      approvalStatus: "Pending",
      featured: false,
      createdDate: "2024-03-15",
      publishedDate: null,
      views: 0,
      approvedBy: null,
      tags: ["phòng bệnh", "truyền nhiễm"],
    },
    {
      id: 4,
      title: "Tầm quan trọng của việc tiêm chủng",
      excerpt:
        "Lý do tại sao việc tiêm chủng đầy đủ là cần thiết cho sức khỏe trẻ em...",
      content: "Nội dung chi tiết về tiêm chủng...",
      author: "Y tá Phạm Thị D",
      category: "Tiêm chủng",
      status: "Published",
      approvalStatus: "Approved",
      featured: true,
      createdDate: "2024-03-05",
      publishedDate: "2024-03-06",
      views: 2100,
      approvedBy: "Manager",
      tags: ["tiêm chủng", "vaccine"],
    },
    {
      id: 5,
      title: "Chăm sóc răng miệng cho trẻ nhỏ",
      excerpt:
        "Hướng dẫn chi tiết cách chăm sóc răng miệng cho trẻ em từ sớm...",
      content: "Nội dung chi tiết về chăm sóc răng miệng...",
      author: "Dr. Hoàng Văn E",
      category: "Nha khoa",
      status: "Published",
      approvalStatus: "Approved",
      featured: false,
      createdDate: "2024-03-01",
      publishedDate: "2024-03-02",
      views: 750,
      approvedBy: "Manager",
      tags: ["nha khoa", "răng miệng"],
    },
  ]);

  // Available categories and statuses
  const categories = [
    "Tiêm chủng",
    "Dinh dưỡng",
    "Phòng bệnh",
    "Sức khỏe tổng quát",
    "Chăm sóc trẻ em",
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
    category: "Tiêm chủng",
    status: "Draft",
    featured: false,
  });

  // Approval form data
  const [approvalData, setApprovalData] = useState({
    approvalStatus: "Approved",
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
      category: "Tiêm chủng",
      status: "Draft",
      featured: false,
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
      category: post.category,
      status: post.status,
      featured: post.featured,
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
      approvalStatus: "Approved",
      rejectionReason: "",
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
        author: "Current User",
        createdDate: new Date().toISOString().split("T")[0],
        views: 0,
        approvalStatus: "Pending",
        approvedBy: null,
        approvedDate: null,
      };
      setBlogPosts((prev) => [...prev, newPost]);
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
              approvedBy: "Current User",
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

  // Get approval badge class
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
          <h1>Quản Lý Blog</h1>
          <p>Manage blog posts, articles, and content with approval workflow</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddPost}>
          <i className="icon-plus"></i>➕ Add New Post
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts, authors, content..."
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
            {post.featured && <div className="featured-badge">⭐ Featured</div>}

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
            </div>

            <div className="post-content">
              <h3 className="post-title" onClick={() => handleViewPost(post)}>
                {post.title}
              </h3>
              <p className="post-excerpt">
                {truncateContent(post.content, 120)}
              </p>

              <div className="post-info">
                <div className="author-info">
                  <span className="author">👤 {post.author}</span>
                  <span className="date">📅 {post.createdDate}</span>
                </div>
                <div className="post-stats">
                  <span className="views">👁 {post.views} views</span>
                </div>
              </div>

              {post.approvalStatus === "Rejected" && post.rejectionReason && (
                <div className="rejection-reason">
                  <strong>❌ Rejection Reason:</strong> {post.rejectionReason}
                </div>
              )}
            </div>

            <div className="post-footer">
              <div className="action-buttons">
                <button
                  className="btn btn-sm btn-view"
                  onClick={() => handleViewPost(post)}
                >
                  👁 View
                </button>
                <button
                  className="btn btn-sm btn-edit"
                  onClick={() => handleEditPost(post)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-approve"
                  onClick={() => handleApprovePost(post)}
                >
                  ✅ Approve
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => handleDeletePost(post.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-data">
          <p>📝 No blog posts found matching your criteria.</p>
        </div>
      )}

      {/* Pending Approval Section */}
      {blogPosts.filter((p) => p.approvalStatus === "Pending").length > 0 && (
        <div className="pending-approval-section">
          <div className="section-header">
            <h2>⏳ Blog đang chờ được duyệt</h2>
            <p>Các bài viết cần được xem xét và phê duyệt</p>
            <span className="pending-count">
              {blogPosts.filter((p) => p.approvalStatus === "Pending").length}{" "}
              bài viết
            </span>
          </div>

          <div className="pending-posts-grid">
            {blogPosts
              .filter((post) => post.approvalStatus === "Pending")
              .map((post) => (
                <div key={post.id} className="pending-post-card">
                  <div className="pending-post-header">
                    <div className="pending-post-meta">
                      <span className="category">{post.category}</span>
                      <span className="pending-badge">⏳ Pending</span>
                    </div>
                    <div className="pending-post-date">
                      📅 {post.createdDate}
                    </div>
                  </div>

                  <div className="pending-post-content">
                    <h4
                      className="pending-post-title"
                      onClick={() => handleViewPost(post)}
                    >
                      {post.title}
                    </h4>
                    <p className="pending-post-excerpt">
                      {truncateContent(post.content, 80)}
                    </p>

                    <div className="pending-post-info">
                      <div className="pending-author">👤 {post.author}</div>
                      <div className="pending-status">🏷️ {post.status}</div>
                    </div>
                  </div>

                  <div className="pending-post-actions">
                    <button
                      className="btn btn-sm btn-approve-quick"
                      onClick={() => {
                        setBlogPosts((prev) =>
                          prev.map((p) =>
                            p.id === post.id
                              ? {
                                  ...p,
                                  approvalStatus: "Approved",
                                  approvedBy: "Current User",
                                  approvedDate: new Date()
                                    .toISOString()
                                    .split("T")[0],
                                }
                              : p
                          )
                        );
                      }}
                    >
                      ✅ Quick Approve
                    </button>
                    <button
                      className="btn btn-sm btn-view"
                      onClick={() => handleViewPost(post)}
                    >
                      👁 View
                    </button>
                    <button
                      className="btn btn-sm btn-approve"
                      onClick={() => handleApprovePost(post)}
                    >
                      ⚖️ Review
                    </button>
                  </div>
                </div>
              ))}
          </div>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "add" && "➕ Add New Blog Post"}
                {modalMode === "edit" && "✏️ Edit Blog Post"}
                {modalMode === "view" && "👁 View Blog Post"}
                {modalMode === "approve" && "✅ Blog Approval"}
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
                  <p>
                    <strong>Views:</strong> {currentPost.views}
                  </p>
                  {currentPost.approvedBy && (
                    <p>
                      <strong>Approved by:</strong> {currentPost.approvedBy} on{" "}
                      {currentPost.approvedDate}
                    </p>
                  )}
                </div>

                <div className="view-content">
                  <h4>Content:</h4>
                  <p>{currentPost.content}</p>
                </div>

                <div className="view-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditPost(currentPost)}
                  >
                    ✏️ Edit Post
                  </button>
                </div>
              </div>
            ) : modalMode === "approve" ? (
              <form className="approval-form" onSubmit={handleApprovalSubmit}>
                <div className="approval-info">
                  <h4>Post Information</h4>
                  <p>
                    <strong>Title:</strong> {currentPost.title}
                  </p>
                  <p>
                    <strong>Author:</strong> {currentPost.author}
                  </p>
                  <p>
                    <strong>Category:</strong> {currentPost.category}
                  </p>
                  <p>
                    <strong>Created:</strong> {currentPost.createdDate}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="approvalStatus">Approval Decision:</label>
                  <select
                    id="approvalStatus"
                    name="approvalStatus"
                    value={approvalData.approvalStatus}
                    onChange={handleApprovalChange}
                    className="form-select"
                    required
                  >
                    <option value="Approved">✅ Approve</option>
                    <option value="Rejected">❌ Reject</option>
                  </select>
                </div>

                {approvalData.approvalStatus === "Rejected" && (
                  <div className="form-group">
                    <label htmlFor="rejectionReason">Rejection Reason:</label>
                    <textarea
                      id="rejectionReason"
                      name="rejectionReason"
                      value={approvalData.rejectionReason}
                      onChange={handleApprovalChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Please provide a reason for rejection..."
                      required
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {approvalData.approvalStatus === "Approved"
                      ? "✅ Approve Post"
                      : "❌ Reject Post"}
                  </button>
                </div>
              </form>
            ) : (
              <form className="post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Post Title:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter post title..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="content">Content:</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="8"
                    required
                    placeholder="Write your blog post content here..."
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="featured">⭐ Mark as Featured Post</label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === "add" ? "➕ Create Post" : "💾 Update Post"}
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

export default BlogManagement;
