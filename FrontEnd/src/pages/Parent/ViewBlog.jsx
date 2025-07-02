import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useParentBlogs } from "../../utils/hooks/useParent";

// Material-UI Icons
import ArticleIcon from "@mui/icons-material/Article";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RefreshIcon from "@mui/icons-material/Refresh";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import InboxIcon from "@mui/icons-material/Inbox";

function ViewBlog() {
  const [searchTerm, setSearchTerm] = useState("");

  // Get theme from parent layout
  const context = useOutletContext();
  const { theme, isDarkMode } = context || { theme: null, isDarkMode: false };

  // Use API hooks
  const { data: blogs, loading, error, refetch } = useParentBlogs();

  const categories = [
    {
      id: "health",
      name: "Sức khỏe",
      icon: <LocalHospitalIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
    {
      id: "nutrition",
      name: "Dinh dưỡng",
      icon: <RestaurantIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
    {
      id: "vaccination",
      name: "Tiêm chủng",
      icon: <VaccinesIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
    {
      id: "event",
      name: "Sự kiện",
      icon: <EventIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
    },
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
    <div
      style={{
        padding: "20px",
        background: theme ? theme.background : "#f2f6f3",
        minHeight: "100vh",
        fontFamily:
          "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "30px",
          borderRadius: "20px",
          background: theme
            ? isDarkMode
              ? "linear-gradient(135deg, #2a2a2a 0%, #333333 100%)"
              : "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)"
            : "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(47, 81, 72, 0.3)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              margin: 0,
              fontWeight: 700,
              fontFamily: "Satoshi, sans-serif",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <ArticleIcon sx={{ color: "white", fontSize: "2.5rem" }} />
            Blog Sức Khỏe
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              margin: "10px 0 0 0",
              opacity: 0.9,
              fontFamily: "Satoshi, sans-serif",
              color: "white",
            }}
          >
            Những thông tin hữu ích về sức khỏe và dinh dưỡng cho con em
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: theme ? theme.cardBg : "white",
          borderRadius: "20px",
          padding: "25px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: "500px",
          }}
        >
          <SearchIcon
            sx={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#97a19b",
              fontSize: "1.5rem",
            }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 20px 15px 50px",
              border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
              borderRadius: "15px",
              fontSize: "1rem",
              fontFamily: "Satoshi, sans-serif",
              background: theme ? (isDarkMode ? "#333333" : "white") : "white",
              color: theme ? theme.textPrimary : "#2f5148",
              outline: "none",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Featured Section */}
      {!loading && !error && featuredBlogs.length > 0 && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
            transition: "all 0.3s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              color: theme ? theme.textPrimary : "#2f5148",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ArticleIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            Bài viết nổi bật
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {featuredBlogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: theme
                    ? isDarkMode
                      ? "#333333"
                      : "#f8f9fa"
                    : "#f8f9fa",
                  borderRadius: "15px",
                  padding: "20px",
                  border: theme
                    ? `1px solid ${theme.border}`
                    : "1px solid #e9ecef",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  },
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <span
                    style={{
                      background: theme
                        ? isDarkMode
                          ? "#4a5568"
                          : "#bfefa1"
                        : "#bfefa1",
                      color: theme
                        ? isDarkMode
                          ? "#ffffff"
                          : "#1a3a2e"
                        : "#1a3a2e",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      fontFamily: "Satoshi, sans-serif",
                    }}
                  >
                    {getCategoryName(blog.category)}
                  </span>
                  <span
                    style={{
                      color: theme ? theme.textSecondary : "#97a19b",
                      fontSize: "0.8rem",
                      fontFamily: "Satoshi, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ color: "#97a19b", fontSize: "0.8rem" }}
                    />
                    {blog.date || blog.createdDate}
                  </span>
                </div>
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    color: theme ? theme.textPrimary : "#2f5148",
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {blog.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: theme ? theme.textSecondary : "#97a19b",
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  {blog.excerpt || blog.content?.substring(0, 120) + "..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          }}
        >
          <HourglassEmptyIcon
            sx={{ color: "#97a19b", fontSize: "3rem", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: 0,
              color: theme ? theme.textSecondary : "#97a19b",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Đang tải blog...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          }}
        >
          <ErrorIcon
            sx={{ color: "#c3555c", fontSize: "3rem", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: "0 0 20px 0",
              color: theme ? theme.textPrimary : "#2f5148",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Lỗi khi tải blog: {error}
          </p>
          <button
            onClick={refetch}
            style={{
              background: theme
                ? isDarkMode
                  ? "#2d4739"
                  : "#2f5148"
                : "#2f5148",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
              transition: "all 0.3s ease",
            }}
          >
            <RefreshIcon sx={{ fontSize: "1.2rem" }} />
            Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!blogs || blogs.length === 0) && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          }}
        >
          <InboxIcon
            sx={{ color: "#97a19b", fontSize: "3rem", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: "0 0 20px 0",
              color: theme ? theme.textSecondary : "#97a19b",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Chưa có blog nào được đăng tải
          </p>
          <button
            onClick={refetch}
            style={{
              background: theme
                ? isDarkMode
                  ? "#3a3a3a"
                  : "#bfefa1"
                : "#bfefa1",
              color: theme ? (isDarkMode ? "#ffffff" : "#1a3a2e") : "#1a3a2e",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
              transition: "all 0.3s ease",
            }}
          >
            <RefreshIcon sx={{ fontSize: "1.2rem" }} />
            Tải lại
          </button>
        </div>
      )}

      {/* Blog Grid */}
      {!loading && !error && otherBlogs.length > 0 && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
            transition: "all 0.3s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 30px 0",
              color: theme ? theme.textPrimary : "#2f5148",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ArticleIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            Tất cả bài viết
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
            }}
          >
            {otherBlogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: theme
                    ? isDarkMode
                      ? "#2a2a2a"
                      : "white"
                    : "white",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  border: theme
                    ? `1px solid ${theme.border}`
                    : "1px solid #e9ecef",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "180px",
                    background: theme
                      ? isDarkMode
                        ? "#333333"
                        : "#f8f9fa"
                      : "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArticleIcon sx={{ color: "#97a19b", fontSize: "4rem" }} />
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      background: theme
                        ? isDarkMode
                          ? "#4a5568"
                          : "#bfefa1"
                        : "#bfefa1",
                      color: theme
                        ? isDarkMode
                          ? "#ffffff"
                          : "#1a3a2e"
                        : "#1a3a2e",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      fontFamily: "Satoshi, sans-serif",
                    }}
                  >
                    {getCategoryName(blog.category)}
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : "#97a19b",
                        fontSize: "0.8rem",
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <PersonIcon
                        sx={{ color: "#97a19b", fontSize: "0.9rem" }}
                      />
                      {blog.author}
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textSecondary : "#97a19b",
                        fontSize: "0.8rem",
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ color: "#97a19b", fontSize: "0.9rem" }}
                      />
                      {blog.date || blog.createdDate}
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textSecondary : "#97a19b",
                        fontSize: "0.8rem",
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ color: "#97a19b", fontSize: "0.9rem" }}
                      />
                      {blog.readTime || "5 phút"}
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: theme ? theme.textPrimary : "#2f5148",
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {blog.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 15px 0",
                      color: theme ? theme.textSecondary : "#97a19b",
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {blog.excerpt || blog.content?.substring(0, 100) + "..."}
                  </p>

                  {blog.tags && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "15px",
                      }}
                    >
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            background: theme
                              ? isDarkMode
                                ? "#3a3a3a"
                                : "#f0f2f5"
                              : "#f0f2f5",
                            color: theme ? theme.textSecondary : "#97a19b",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontFamily: "Satoshi, sans-serif",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <button
                      style={{
                        background: theme
                          ? isDarkMode
                            ? "#2d4739"
                            : "#2f5148"
                          : "#2f5148",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        fontFamily: "Satoshi, sans-serif",
                        flex: 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      Đọc tiếp
                    </button>
                    <button
                      style={{
                        background: theme
                          ? isDarkMode
                            ? "#3a3a3a"
                            : "#bfefa1"
                          : "#bfefa1",
                        color: theme
                          ? isDarkMode
                            ? "#ffffff"
                            : "#1a3a2e"
                          : "#1a3a2e",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <BookmarkIcon sx={{ fontSize: "1rem" }} />
                      Lưu
                    </button>
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
          <div
            style={{
              background: theme ? theme.cardBg : "white",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
            }}
          >
            <SearchIcon
              sx={{ color: "#97a19b", fontSize: "3rem", marginBottom: "15px" }}
            />
            <p
              style={{
                margin: 0,
                color: theme ? theme.textSecondary : "#97a19b",
                fontFamily: "Satoshi, sans-serif",
                fontSize: "1.1rem",
              }}
            >
              Không tìm thấy bài viết phù hợp
            </p>
          </div>
        )}
    </div>
  );
}

export default ViewBlog;
