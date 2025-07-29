import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Manager/StudentList.css';
import {
  useManagerStudents,
  // useManagerActions, // Comment out unused actions for now
} from '../../utils/hooks/useManager';

// Material-UI Icons
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import NotesIcon from '@mui/icons-material/Notes';
import BadgeIcon from '@mui/icons-material/Badge';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

function StudentList() {
  // Use hooks
  const navigate = useNavigate();
  const { data: students, loading, error, refetch } = useManagerStudents();
  // Uncomment when implementing CRUD operations
  // const { createStudent, updateStudent, deleteStudent, loading: actionLoading } = useManagerActions();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Available classes for preschool (updated to match API classid)
  const classes = [
    { value: '', label: 'Tất cả lớp' },
    { value: 'Lớp Mầm A', label: 'Lớp Mầm A' },
    { value: 'Lớp Mầm B', label: 'Lớp Mầm B' },
    { value: 'Lớp Mầm C', label: 'Lớp Mầm C' },
    { value: 'Lớp Chồi A', label: 'Lớp Chồi A' },
    { value: 'Lớp Chồi B', label: 'Lớp Chồi B' },
    { value: 'Lớp Chồi C', label: 'Lớp Chồi C' },
    { value: 'Lớp Lá A', label: 'Lớp Lá A' },
    { value: 'Lớp Lá B', label: 'Lớp Lá B' },
    { value: 'Lớp Lá C', label: 'Lớp Lá C' },
  ];

  // API endpoint - để trống theo yêu cầu
  const API_ENDPOINT = ''; // Thêm đường dẫn API ở đây

  // Filter students based on search and class filter
  const filteredStudents = students
    ? students.filter(student => {
        const matchesSearch =
          student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.parentName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass =
          filterClass === '' || student.className === filterClass;
        return matchesSearch && matchesClass;
      })
    : [];

  // Handle viewing student information
  const handleViewStudent = student => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Handle viewing student health records
  const handleViewHealthRecords = student => {
    // Navigate to health record detail page
    navigate(`/manager/student-health-record/${student.id}`);
  };

  // Validate file type and size
  const validateFile = file => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV (.csv)';
    }

    if (file.size > maxSize) {
      return 'File quá lớn. Vui lòng chọn file nhỏ hơn 10MB';
    }

    return null;
  };

  // API call to import file
  const importStudentFile = async file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'student_import');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header, let browser set it with boundary for multipart/form-data
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token nếu cần
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  };

  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous messages
    setImportError('');
    setImportSuccess('');

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setImportError(validationError);
      event.target.value = '';
      return;
    }

    // Start importing
    setIsImporting(true);

    try {
      const result = await importStudentFile(file);

      // Handle success
      setImportSuccess(
        `Import thành công! Đã thêm ${result.importedCount || 0} học sinh.`
      );

      // Refresh student list
      refetch();
    } catch (error) {
      // Handle error
      setImportError(`Lỗi import file: ${error.message}`);
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Clear messages after some time
  React.useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => {
        setImportSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  React.useEffect(() => {
    if (importError) {
      const timer = setTimeout(() => {
        setImportError('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [importError]);

  // Get health status badge class (commented out as not used currently)
  // const getHealthStatusClass = (status) => {
  //   switch (status) {
  //     case "Bình thường":
  //       return "status-normal";
  //     case "Cần theo dõi":
  //       return "status-watch";
  //     case "Có dị ứng":
  //       return "status-allergy";
  //     default:
  //       return "status-normal";
  //   }
  // };

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h1>Danh Sách Học Sinh</h1>
        <p>Quản lý thông tin học sinh trường mầm non</p>
      </div>

      {/* Import Messages */}
      {(importError || importSuccess || isImporting) && (
        <div className="import-messages">
          {isImporting && (
            <div className="message importing">
              <span className="loading-spinner">⏳</span>
              Đang import file, vui lòng đợi...
            </div>
          )}
          {importSuccess && (
            <div className="message success">✅ {importSuccess}</div>
          )}
          {importError && <div className="message error">❌ {importError}</div>}
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã học sinh, tên phụ huynh..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
            >
              {classes.map(classOption => (
                <option key={classOption.value} value={classOption.value}>
                  {classOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* <button
            className={`import-btn ${isImporting ? "importing" : ""}`}
            onClick={handleFileImport}
            disabled={isImporting}
          >
            {isImporting ? "⏳ Đang import..." : "📁 Import File"}
          </button> */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            disabled={isImporting}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>⏳ Đang tải danh sách học sinh...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>❌ Lỗi khi tải danh sách học sinh: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!students || students.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có học sinh nào trong hệ thống</p>
        </div>
      )}

      {/* Modern Student Table */}
      {!loading && !error && students && students.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid #c1cbc2',
            overflow: 'hidden',
            marginBottom: '30px',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
              color: 'white',
              padding: '20px 25px',
              borderBottom: '1px solid #e9ecef',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: 600,
                fontFamily: 'Satoshi, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <SchoolIcon sx={{ fontSize: '1.5rem' }} />
              Danh Sách Học Sinh ({filteredStudents.length} học sinh)
            </h3>
          </div>

          {/* Table Content */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Mã HS
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Họ tên
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Lớp
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Tuổi
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Ngày sinh
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Giới tính
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    Nhóm máu
                  </th>
                  <th
                    style={{
                      padding: '15px 20px',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#2f5148',
                    }}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    style={{
                      background: index % 2 === 0 ? 'white' : '#f8f9fa',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.target.closest('tr').style.background = '#e8f5e8';
                      e.target.closest('tr').style.transform =
                        'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.target.closest('tr').style.background =
                        index % 2 === 0 ? 'white' : '#f8f9fa';
                      e.target.closest('tr').style.transform = 'translateY(0)';
                    }}
                  >
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                        fontSize: '0.9rem',
                        color: '#2f5148',
                        fontWeight: 600,
                      }}
                    >
                      {student.studentId}
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: '#2f5148',
                            fontSize: '0.95rem',
                            marginBottom: '2px',
                          }}
                        >
                          {student.fullName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#97a19b',
                          }}
                        >
                          ID: {student.id}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                        fontSize: '0.9rem',
                        color: '#2f5148',
                        fontWeight: 500,
                      }}
                    >
                      {student.className}
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                        fontSize: '0.9rem',
                        color: '#2f5148',
                        fontWeight: 500,
                      }}
                    >
                      {student.age} tuổi
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                        fontSize: '0.9rem',
                        color: '#2f5148',
                        fontWeight: 500,
                      }}
                    >
                      {student.dateOfBirth}
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                        fontSize: '0.9rem',
                        color: '#2f5148',
                        fontWeight: 500,
                      }}
                    >
                      {student.gender}
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        borderRight: '1px solid #e9ecef',
                      }}
                    >
                      <span
                        style={{
                          background: '#fff3cd',
                          color: '#856404',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid #ffeaa7',
                        }}
                      >
                        {student.bloodType}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '15px 20px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <button
                          onClick={() => handleViewStudent(student)}
                          title="Xem chi tiết"
                          style={{
                            background:
                              'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontFamily: 'Satoshi, sans-serif',
                          }}
                          onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow =
                              '0 4px 12px rgba(47, 81, 72, 0.3)';
                          }}
                          onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <PersonIcon sx={{ fontSize: '1rem' }} />
                          Chi tiết
                        </button>
                        <button
                          onClick={() => handleViewHealthRecords(student)}
                          title="Xem hồ sơ sức khỏe"
                          style={{
                            background:
                              'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontFamily: 'Satoshi, sans-serif',
                          }}
                          onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow =
                              '0 4px 12px rgba(23, 162, 184, 0.3)';
                          }}
                          onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <LocalHospitalIcon sx={{ fontSize: '1rem' }} />
                          Sức khỏe
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty Filter Results */}
          {filteredStudents.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#97a19b',
              }}
            >
              <SchoolIcon sx={{ fontSize: '4rem', marginBottom: '20px' }} />
              <p
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  margin: '0 0 20px 0',
                  fontFamily: 'Satoshi, sans-serif',
                }}
              >
                Không tìm thấy học sinh phù hợp với bộ lọc
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterClass('');
                }}
                style={{
                  background:
                    'linear-gradient(135deg, #97a19b 0%, #7a8580 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow =
                    '0 4px 12px rgba(151, 161, 155, 0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <CloseIcon sx={{ fontSize: '1.2rem' }} />
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {showModal && currentStudent && (
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
              overflow: 'auto',
              border: '1px solid #c1cbc2',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
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
                background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                color: 'white',
                borderRadius: '20px 20px 0 0',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: 'white',
                  fontFamily:
                    "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <InfoIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                Thông Tin Chi Tiết Học Sinh
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '30px' }}>
              {/* Student Name Header */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  padding: '20px',
                  borderRadius: '15px',
                  marginBottom: '25px',
                  textAlign: 'center',
                  border: '1px solid #e9ecef',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <PersonIcon sx={{ color: '#97a19b', fontSize: '1.8rem' }} />
                  {currentStudent.fullName}
                </h4>
                <p
                  style={{
                    margin: '8px 0 0 0',
                    color: '#97a19b',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  Mã học sinh: {currentStudent.studentId}
                </p>
              </div>

              {/* Student Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px',
                }}
              >
                {/* Basic Information */}
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <PersonIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Thông tin cơ bản
                  </h5>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Ngày sinh:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.dateOfBirth}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Tuổi:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.age} tuổi
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <WcIcon sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Giới tính:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.gender}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <BloodtypeIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Nhóm máu:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.bloodType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* School Information */}
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <SchoolIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Thông tin học tập
                  </h5>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <SchoolIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Lớp:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.className}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Ngày nhập học:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.enrollmentDate}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <FamilyRestroomIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Tên phụ huynh:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.parentName || currentStudent.parent?.fullname || 'Chưa có thông tin'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <ContactEmergencyIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Số điện thoại:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.parentPhone || currentStudent.parent?.phone || 'Chưa có thông tin'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <HealthAndSafetyIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    Thông tin sức khỏe
                  </h5>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <HealthAndSafetyIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Tình trạng sức khỏe:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.healthStatus}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <LocalHospitalIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Dị ứng:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.allergies}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <ContactEmergencyIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Liên hệ khẩn cấp:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentStudent.emergencyContact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <HomeIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Thông tin liên hệ
                  </h5>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <div
                      style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <HomeIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Địa chỉ:
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          lineHeight: 1.5,
                        }}
                      >
                        {currentStudent.address}
                      </p>
                    </div>

                    {currentStudent.notes && (
                      <div
                        style={{
                          padding: '15px',
                          background: 'white',
                          borderRadius: '10px',
                          border: '1px solid #e9ecef',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <NotesIcon
                            sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                          />
                          <span
                            style={{
                              color: '#97a19b',
                              fontFamily: 'Satoshi, sans-serif',
                              fontSize: '0.9rem',
                              fontWeight: 500,
                            }}
                          >
                            Ghi chú:
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            color: '#2f5148',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            lineHeight: 1.5,
                          }}
                        >
                          {currentStudent.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 30px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#bfefa1',
                  color: '#1a3a2e',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
