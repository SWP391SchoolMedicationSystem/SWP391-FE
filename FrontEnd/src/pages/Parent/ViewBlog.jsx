import React, { useState } from "react";
import "../../css/Parent/ViewBlog.css";

function ViewBlog() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data cho blog
  const blogs = [
    {
      id: 1,
      title: "Cách phòng chống cúm mùa cho trẻ em",
      excerpt:
        "Những biện pháp hiệu quả để bảo vệ con em khỏi bệnh cúm mùa đang hoành hành...",
      content: "Nội dung chi tiết về cách phòng chống cúm mùa...",
      category: "health",
      author: "BS. Nguyễn Thị Lan",
      date: "2024-03-15",
      image: "/images/flu-prevention.jpg",
      readTime: "5 phút",
      tags: ["cúm mùa", "phòng bệnh", "trẻ em"],
    },
    {
      id: 2,
      title: "Dinh dưỡng cân bằng cho học sinh",
      excerpt:
        "Hướng dẫn cách xây dựng chế độ dinh dưỡng khoa học cho con em trong độ tuổi học đường...",
      content: "Nội dung chi tiết về dinh dưỡng...",
      category: "nutrition",
      author: "Ths. Phạm Văn Minh",
      date: "2024-03-12",
      image: "/images/nutrition.jpg",
      readTime: "7 phút",
      tags: ["dinh dưỡng", "học sinh", "sức khỏe"],
    },
    {
      id: 3,
      title: "Lịch tiêm chủng mở rộng năm 2024",
      excerpt:
        "Thông tin chi tiết về lịch tiêm chủng mở rộng dành cho học sinh các cấp...",
      content: "Nội dung chi tiết về lịch tiêm chủng...",
      category: "vaccination",
      author: "Y tá trưởng Lê Thị Hoa",
      date: "2024-03-10",
      image: "/images/vaccination.jpg",
      readTime: "4 phút",
      tags: ["tiêm chủng", "vaccine", "lịch"],
    },
    {
      id: 4,
      title: "Sự kiện: Ngày hội sức khỏe học đường",
      excerpt:
        "Thông báo về sự kiện Ngày hội sức khỏe học đường sắp diễn ra tại trường...",
      content: "Nội dung chi tiết về sự kiện...",
      category: "event",
      author: "Ban Tổ chức",
      date: "2024-03-08",
      image: "/images/health-event.jpg",
      readTime: "3 phút",
      tags: ["sự kiện", "sức khỏe", "học đường"],
    },
    {
      id: 5,
      title: "Chú ý về dịch tay chân miệng",
      excerpt:
        "Hướng dẫn nhận biết và cách phòng tránh bệnh tay chân miệng ở trẻ em...",
      content: "Nội dung chi tiết về tay chân miệng...",
      category: "health",
      author: "BS. Trần Văn Đức",
      date: "2024-03-05",
      image: "/images/hand-foot-mouth.jpg",
      readTime: "6 phút",
      tags: ["tay chân miệng", "trẻ em", "phòng bệnh"],
    },
  ];

  const categories = [
    { id: "all", name: "Tất cả", icon: "📚" },
    { id: "health", name: "Sức khỏe", icon: "🏥" },
    { id: "nutrition", name: "Dinh dưỡng", icon: "🥗" },
    { id: "vaccination", name: "Tiêm chủng", icon: "💉" },
    { id: "event", name: "Sự kiện", icon: "🎉" },
  ];

  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

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

      {/* Blog Grid */}
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
                <span className="date">📅 {blog.date}</span>
                <span className="read-time">⏱️ {blog.readTime}</span>
              </div>

              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>

              <div className="blog-tags">
                {blog.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="blog-actions">
                <button className="read-more-btn">Đọc tiếp</button>
                <button className="save-btn">💾 Lưu</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="featured-section">
        <h3>🌟 Bài viết nổi bật</h3>
        <div className="featured-blogs">
          {blogs.slice(0, 3).map((blog) => (
            <div key={blog.id} className="featured-item">
              <div className="featured-content">
                <h4>{blog.title}</h4>
                <p>
                  {blog.author} • {blog.date}
                </p>
              </div>
              <button className="featured-read-btn">Đọc</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewBlog;
