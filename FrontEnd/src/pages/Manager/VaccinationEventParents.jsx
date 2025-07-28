import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Manager/VaccinationEventStudents.css';
import { vaccinationEventService } from '../../services/vaccinationService';
import { managerAccountService } from '../../services/managerService';

function VaccinationEventParents() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // States
  const [event, setEvent] = useState(null);
  const [parents, setParents] = useState([]);
  const [parentResponses, setParentResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Email modal states
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

  // Fetch data on component mount
  useEffect(() => {
    if (eventId) {
      fetchEventData();
      fetchParentsData();
      fetchParentResponses();
    }
  }, [eventId]);

  // Fetch event data
  const fetchEventData = async () => {
    try {
      const eventData = await vaccinationEventService.getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event data:', error);
      setError('Không thể tải thông tin sự kiện');
    }
  };

  // Fetch parents data
  const fetchParentsData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get all parents
      const allParents = await managerAccountService.getAllParents();

      // Map parent data to display format
      const mappedParents = allParents.map(parent => ({
        parentId: parent.parentid, // Use 'parentid' field from API
        parentName: parent.fullname || 'Chưa có tên',
        parentEmail: parent.email || 'Chưa có email',
        parentPhone: parent.phone || parent.phoneNumber || 'Chưa có',
      }));

      setParents(mappedParents);
    } catch (error) {
      console.error('Error fetching parents data:', error);
      setError('Không thể tải danh sách phụ huynh');
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

  // Handle send email to specific parent
  const handleSendEmailToParent = parent => {
    setSelectedParent(parent);
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

  // Get parent response status
  const getParentResponseStatus = parentId => {
    const parentResponse = parentResponses.find(
      response => response.parentId === parentId
    );

    if (!parentResponse) return { status: 'pending', text: 'Chưa phản hồi' };

    return { status: 'confirmed', text: 'Đã phản hồi' };
  };

  // Get status badge class
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      default:
        return 'status-pending';
    }
  };

  // Submit send email form
  const handleSubmitSendEmail = async e => {
    e.preventDefault();

    if (!selectedParent || !event) return;

    // Validate parentId
    if (!selectedParent.parentId) {
      alert('Không tìm thấy thông tin phụ huynh để gửi email!');
      return;
    }

    try {
      // Send email to specific parent (all their children)
      const emailData = {
        vaccinationEventId: parseInt(eventId),
        emailTemplateId: parseInt(emailFormData.emailTemplateId),
        customMessage: emailFormData.customMessage.trim() || 'string',
      };

      // Send parentId as array to the API
      await vaccinationEventService.sendEmailToSpecific(
        [selectedParent.parentId], // Pass parent ID as array
        emailData
      );

      setShowEmailModal(false);
      alert(`Gửi email thành công tới phụ huynh ${selectedParent.parentName}!`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Có lỗi xảy ra khi gửi email!');
    }
  };

  if (loading) {
    return (
      <div className="vaccination-event-students">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách phụ huynh...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vaccination-event-students">
        <div className="error-container">
          <h3>⚠️ Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-event-students">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Quay lại
          </button>
          <div className="header-info">
            <h1>👨‍👩‍👧‍👦 Danh Sách Phụ Huynh</h1>
            <p className="event-title">
              Sự kiện: <strong>{event?.title}</strong>
            </p>
            <p className="event-date">
              Ngày: <strong>{event?.eventDate}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="statistics-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{parents.length}</div>
            <div className="stat-label">Tổng phụ huynh</div>
          </div>
        </div>
      </div>

      {/* Parent List */}
      <div className="students-section">
        <div className="section-header">
          <h2>📋 Danh Sách Phụ Huynh</h2>
          <p>Gửi email thông báo tiêm chủng cho từng phụ huynh</p>
        </div>

        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Phụ Huynh</th>
                <th>Email</th>
                <th>Số Điện Thoại</th>
                <th>Trạng Thái Phản Hồi</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent, index) => (
                <tr key={parent.parentId || index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="student-info">
                      <strong>{parent.parentName}</strong>
                    </div>
                  </td>
                  <td>{parent.parentEmail || 'Chưa có'}</td>
                  <td>{parent.parentPhone || 'Chưa có'}</td>
                  <td>
                    {(() => {
                      const responseStatus = getParentResponseStatus(
                        parent.parentId
                      );
                      return (
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            responseStatus.status
                          )}`}
                        >
                          {responseStatus.text}
                        </span>
                      );
                    })()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn email-btn"
                        onClick={() => handleSendEmailToParent(parent)}
                        title="Gửi email thông báo tiêm chủng"
                      >
                        📧
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {parents.length === 0 && (
            <div className="no-data">
              <p>📭 Không có phụ huynh nào trong sự kiện này</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Email Modal */}
      {showEmailModal && selectedParent && (
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
              <div className="form-group">
                <label>Template Email:</label>
                <select
                  name="emailTemplateId"
                  value={emailFormData.emailTemplateId}
                  onChange={handleEmailInputChange}
                  className="template-select"
                >
                  {emailTemplateOptions.map(template => (
                    <option
                      key={template.id}
                      value={template.id}
                      disabled={template.id !== 3}
                    >
                      {template.name} (ID: {template.id})
                      {template.id !== 3 ? ' - Không khả dụng' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tin nhắn tùy chỉnh:</label>
                <textarea
                  name="customMessage"
                  value={emailFormData.customMessage}
                  onChange={handleEmailInputChange}
                  placeholder="Nhập tin nhắn tùy chỉnh (tùy chọn)"
                  className="custom-message-input"
                  rows="4"
                />
              </div>

              <div className="recipient-info">
                <h4>📋 Thông tin người nhận:</h4>
                <p>
                  <strong>Phụ huynh:</strong> {selectedParent.parentName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedParent.parentEmail}
                </p>
                <p>
                  <strong>Gửi cho:</strong> Tất cả học sinh của phụ huynh này
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEmailModal(false)}
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

export default VaccinationEventParents;
