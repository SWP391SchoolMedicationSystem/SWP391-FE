import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Manager/VaccinationEventStudents.css';
import { vaccinationEventService } from '../../services/vaccinationService';

// Material-UI Icons
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import DescriptionIcon from '@mui/icons-material/Description';

function VaccinationEventStudents() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // States
  const [event, setEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [parentResponses, setParentResponses] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Email modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    emailTemplateId: 3,
    customMessage: '',
  });

  // Email template options
  const emailTemplateOptions = [
    { id: 1, name: 'YÊU CẦU ĐẶT LẠI MẬT KHẨU' },
    { id: 2, name: 'THÔNG BÁO BẢO MẬT' },
    { id: 3, name: 'THÔNG BÁO SỰ KIỆN TIÊM CHỦNG' },
  ];

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  // Fetch data on component mount
  useEffect(() => {
    if (eventId) {
      fetchEventData();
      fetchStudentResponses();
      fetchParentResponses();
    }
  }, [eventId]);

  // Combine student and parent response data
  useEffect(() => {
    if (students.length > 0 && parentResponses.length > 0) {
      const combined = students.map(student => {
        const parentResponse = parentResponses.find(
          response => response.studentId === student.studentId
        );

        return {
          ...student,
          // Use parentId from parent response if available, otherwise use from student data
          parentId: parentResponse?.parentId || student.parentId,
          willAttend: parentResponse?.willAttend ?? null,
          reasonForDecline: parentResponse?.reasonForDecline || '',
          parentConsent: parentResponse?.parentConsent ?? false,
          status: parentResponse?.status || 'Chưa phản hồi',
          statusClass: parentResponse?.statusClass || 'pending',
        };
      });
      setCombinedData(combined);
    } else {
      setCombinedData(students);
    }
  }, [students, parentResponses]);

  // Fetch event details
  const fetchEventData = async () => {
    try {
      const eventData = await vaccinationEventService.getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event data:', error);
      setError('Không thể tải thông tin sự kiện');
    }
  };

  // Fetch student responses
  const fetchStudentResponses = async () => {
    try {
      setLoading(true);
      setError('');
      const responses = await vaccinationEventService.getEventResponses(
        eventId
      );
      setStudents(responses);
    } catch (error) {
      console.error('Error fetching student responses:', error);
      setError('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  // Fetch parent responses
  const fetchParentResponses = async () => {
    try {
      const responses = await vaccinationEventService.getParentResponses(
        eventId
      );
      setParentResponses(responses);
    } catch (error) {
      console.error('Error fetching parent responses:', error);
      // Don't set error for parent responses as it's supplementary data
    }
  };

  // Handle view student detail
  const handleViewDetail = student => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // Handle send email to specific parent
  const handleSendEmailToParent = student => {
    setSelectedStudent(student);
    setEmailFormData({
      emailTemplateId: 3,
      customMessage: '',
    });
    setShowEmailModal(true);
  };

  // Handle email form input changes
  const handleEmailInputChange = e => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit send email form
  const handleSubmitSendEmail = async e => {
    e.preventDefault();

    if (!selectedStudent || !event) return;

    // Validate studentId
    if (!selectedStudent.studentId) {
      alert('Không tìm thấy thông tin học sinh để gửi email!');
      return;
    }

    try {
      // Updated structure for the new API - send email to specific students
      const emailData = {
        vaccinationEventId: parseInt(eventId),
        emailTemplateId: parseInt(emailFormData.emailTemplateId),
        customMessage: emailFormData.customMessage.trim() || 'string',
      };

      // Send studentId as array to the new API structure
      await vaccinationEventService.sendEmailToSpecificStudents(
        [selectedStudent.studentId], // Pass student ID as array
        emailData
      );

      setShowEmailModal(false);
      alert(
        `Gửi email thành công tới phụ huynh của học sinh ${selectedStudent.studentName}!`
      );
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Có lỗi xảy ra khi gửi email!');
    }
  };

  // Filter students based on status and class
  const filteredStudents = combinedData.filter(student => {
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && student.willAttend === null) ||
      (statusFilter === 'confirmed' && student.willAttend === true) ||
      (statusFilter === 'declined' && student.willAttend === false);
    const classMatch =
      classFilter === 'all' || student.className === classFilter;
    return statusMatch && classMatch;
  });

  // Get unique classes for filter
  const uniqueClasses = [
    ...new Set(combinedData.map(student => student.className)),
  ];

  // Get status statistics
  const getStatusStats = () => {
    const total = combinedData.length;
    const confirmed = combinedData.filter(s => s.willAttend === true).length;
    const declined = combinedData.filter(s => s.willAttend === false).length;
    const pending = combinedData.filter(s => s.willAttend === null).length;

    return { total, confirmed, declined, pending };
  };

  const stats = getStatusStats();

  // Get status badge class
  const getStatusBadge = student => {
    if (student.willAttend === true) return 'status-confirmed';
    if (student.willAttend === false) return 'status-declined';
    return 'status-pending';
  };

  // Get status text
  const getStatusText = student => {
    if (student.willAttend === true) return 'Đồng ý';
    if (student.willAttend === false) return 'Từ chối';
    return 'Chưa phản hồi';
  };

  if (loading) {
    return (
      <div className="vaccination-students-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách học sinh...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vaccination-students-container">
        <div className="error-state">
          <p>❌ {error}</p>
          <button
            onClick={() => {
              fetchStudentResponses();
              fetchParentResponses();
            }}
            className="retry-btn"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-students-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Quay lại
          </button>
          <div className="event-info">
            <h1>👥 Danh Sách Học Sinh Tiêm Chủng</h1>
            {event && (
              <div className="event-details">
                <h2>{event.title}</h2>
                <p>
                  📅 Ngày: {event.eventDate} | 📍 Địa điểm: {event.location}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={() =>
              navigate(`/manager/vaccination-event-parents/${eventId}`)
            }
            className="parents-btn"
            title="Xem danh sách phụ huynh để gửi email cho tất cả con"
          >
            👨‍👩‍👧‍👦 Danh sách phụ huynh
          </button>
          <button
            onClick={() => {
              fetchStudentResponses();
              fetchParentResponses();
            }}
            className="refresh-btn"
          >
            🔄 Tải lại
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng học sinh</p>
          </div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.confirmed}</h3>
            <p>Đồng ý tiêm</p>
          </div>
        </div>
        <div className="stat-card declined">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.declined}</h3>
            <p>Từ chối tiêm</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chưa phản hồi</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chưa phản hồi</option>
            <option value="confirmed">Đồng ý</option>
            <option value="declined">Từ chối</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Lớp học:</label>
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả lớp</option>
            {uniqueClasses.map(className => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="students-section">
        <h3>📋 Danh sách học sinh ({filteredStudents.length})</h3>

        {filteredStudents.length > 0 ? (
          <div className="students-table">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên học sinh</th>
                  <th>Lớp</th>
                  <th>Phụ huynh</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th>Ngày phản hồi</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{index + 1}</td>
                    <td className="student-name">{student.studentName}</td>
                    <td>{student.className}</td>
                    <td>{student.parentName}</td>
                    <td>{student.parentEmail}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadge(student)}`}
                      >
                        {getStatusText(student)}
                      </span>
                    </td>
                    <td>{student.responseDate || 'Chưa có'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn detail-btn"
                          onClick={() => handleViewDetail(student)}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button
                          className="action-btn email-btn"
                          onClick={() => handleSendEmailToParent(student)}
                          title="Gửi email"
                        >
                          📧
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-students">
            <div className="no-students-icon">👥</div>
            <p>Không có học sinh nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
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
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
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
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#2f5148',
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <InfoIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
                Chi Tiết Phản Hồi
              </h3>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#97a19b',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '5px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowDetailModal(false)}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
              {/* Basic Information */}
              <div
                style={{
                  marginBottom: '20px',
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 15px 0',
                    color: '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <PersonIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                  Thông tin học sinh
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <PersonIcon sx={{ color: '#97a19b', fontSize: '1rem' }} />
                      Tên học sinh:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedStudent.studentName}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <SchoolIcon sx={{ color: '#97a19b', fontSize: '1rem' }} />
                      Lớp học:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedStudent.className}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <PersonIcon sx={{ color: '#97a19b', fontSize: '1rem' }} />
                      Phụ huynh:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedStudent.parentName}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <EmailIcon sx={{ color: '#97a19b', fontSize: '1rem' }} />
                      Email:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedStudent.parentEmail}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <DateRangeIcon
                        sx={{ color: '#97a19b', fontSize: '1rem' }}
                      />
                      Ngày phản hồi:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedStudent.responseDate || 'Chưa có'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Response Status */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background:
                    selectedStudent.willAttend === true
                      ? '#e8f5e8'
                      : selectedStudent.willAttend === false
                      ? '#ffebee'
                      : '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {selectedStudent.willAttend === true ? (
                    <CheckCircleIcon
                      sx={{ color: '#2e7d32', fontSize: '1.2rem' }}
                    />
                  ) : selectedStudent.willAttend === false ? (
                    <CancelIcon sx={{ color: '#c62828', fontSize: '1.2rem' }} />
                  ) : (
                    <WarningIcon
                      sx={{ color: '#ed6c02', fontSize: '1.2rem' }}
                    />
                  )}
                  <span
                    style={{
                      color: '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    Trạng thái phản hồi:
                  </span>
                </div>
                <span
                  style={{
                    color:
                      selectedStudent.willAttend === true
                        ? '#2e7d32'
                        : selectedStudent.willAttend === false
                        ? '#c62828'
                        : '#ed6c02',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '16px',
                    backgroundColor:
                      selectedStudent.willAttend === true
                        ? '#c8e6c9'
                        : selectedStudent.willAttend === false
                        ? '#ffcdd2'
                        : '#fff3cd',
                  }}
                >
                  {getStatusText(selectedStudent)}
                </span>
              </div>

              {/* Decline Reason */}
              {selectedStudent.willAttend === false && (
                <div
                  style={{
                    marginBottom: '20px',
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 15px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <DescriptionIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    Lý do từ chối
                  </h4>
                  <div
                    style={{
                      background: 'rgba(195, 85, 92, 0.1)',
                      padding: '15px',
                      borderRadius: '12px',
                      border: '1px solid rgba(195, 85, 92, 0.3)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#c3555c',
                        fontSize: '0.9rem',
                        fontFamily: 'Satoshi, sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedStudent.reasonForDecline ||
                        'Phụ huynh chưa cung cấp lý do cụ thể'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
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
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showEmailModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📧 Gửi Email Thông Báo</h3>
              <button
                className="modal-close"
                onClick={() => setShowEmailModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitSendEmail} className="modal-body">
              <div className="email-info">
                <h4>Gửi email cho phụ huynh</h4>
                <p>
                  <strong>👤 Học sinh:</strong> {selectedStudent.studentName}
                </p>
                <p>
                  <strong>👨‍👩‍👧‍👦 Phụ huynh:</strong> {selectedStudent.parentName}
                </p>
                <p>
                  <strong>📧 Email:</strong> {selectedStudent.parentEmail}
                </p>
                <p>
                  <strong>🏫 Lớp:</strong> {selectedStudent.className}
                </p>
              </div>

              <div className="form-group">
                <label>Chọn Template Email *</label>
                <select
                  name="emailTemplateId"
                  value={emailFormData.emailTemplateId}
                  onChange={handleEmailInputChange}
                  required
                  className="template-select"
                >
                  {emailTemplateOptions.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} (ID: {template.id})
                    </option>
                  ))}
                </select>
                <small>Chọn template phù hợp cho thông báo</small>
              </div>

              <div className="form-group">
                <label>Tin nhắn tùy chỉnh</label>
                <textarea
                  name="customMessage"
                  value={emailFormData.customMessage}
                  onChange={handleEmailInputChange}
                  placeholder="Nhập tin nhắn bổ sung cho phụ huynh..."
                  rows="4"
                />
              </div>

              <div className="email-preview">
                <h5>📋 Thông tin gửi:</h5>
                <p>
                  <strong>Sự kiện:</strong> {event?.title} (ID: {eventId})
                </p>
                <p>
                  <strong>Đối tượng:</strong> {selectedStudent.parentName} (
                  {selectedStudent.parentEmail})
                </p>
                <p>
                  <strong>Template:</strong> ID {emailFormData.emailTemplateId}
                </p>
                <p>
                  <strong>Về học sinh:</strong> {selectedStudent.studentName} -{' '}
                  {selectedStudent.className}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="cancel-btn"
                >
                  Hủy
                </button>
                <button type="submit" className="send-email-btn">
                  📧 Gửi Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VaccinationEventStudents;
