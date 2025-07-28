import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Manager/VaccinationEvents.css';
import { vaccinationEventService } from '../../services/vaccinationService';

function VaccinationEvents() {
  const navigate = useNavigate();

  // States for events management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Loading states for different operations
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
  });

  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch vaccination events on component mount
  useEffect(() => {
    fetchVaccinationEvents();
  }, []);

  // Fetch all vaccination events
  const fetchVaccinationEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await vaccinationEventService.getAllEvents();
      setEvents(response);
    } catch (error) {
      console.error('Error fetching vaccination events:', error);
      setError('Không thể tải danh sách sự kiện tiêm chủng');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create new event
  const handleCreateEvent = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      location: '',
    });
    clearFileData();
    setShowCreateModal(true);
  };

  // Handle edit event
  const handleEditEvent = event => {
    setSelectedEvent(event);
    // Convert date back to YYYY-MM-DD format for date input
    let dateValue = '';
    if (event.eventDate) {
      // If it's already in DD/MM/YYYY format, convert it
      const parts = event.eventDate.split('/');
      if (parts.length === 3) {
        dateValue = `${parts[2]}-${parts[1].padStart(
          2,
          '0'
        )}-${parts[0].padStart(2, '0')}`;
      }
    }

    setFormData({
      title: event.title || '',
      description: event.description || '',
      eventDate: dateValue,
      location: event.location || '',
    });
    setShowEditModal(true);
  };

  // Handle delete event
  const handleDeleteEvent = event => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  // Handle view students for event
  const handleViewStudents = event => {
    navigate(`/manager/vaccination-events/${event.id}/students`);
  };

  // Handle send email to all parents
  const handleSendEmailAll = event => {
    setSelectedEvent(event);
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

  // Handle file selection
  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (
        !file.type.startsWith('image/') &&
        !file.type.includes('pdf') &&
        !file.type.includes('document')
      ) {
        alert('Vui lòng chọn file hình ảnh, PDF hoặc tài liệu!');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File không được lớn hơn 10MB!');
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clear file data when modal closes
  const clearFileData = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit send email form
  const handleSubmitSendEmail = async e => {
    e.preventDefault();

    if (!selectedEvent) return;

    setIsSendingEmail(true);
    try {
      const emailData = {
        vaccinationEventId: selectedEvent.id,
        emailTemplateId: parseInt(emailFormData.emailTemplateId),
        customMessage: emailFormData.customMessage.trim() || 'string',
      };

      console.log('🚀 Sending email to all parents:', emailData);
      await vaccinationEventService.sendEmailToAll(emailData);
      setShowEmailModal(false);
      alert('Gửi email thành công tới tất cả phụ huynh!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Có lỗi xảy ra khi gửi email!');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Submit create form
  const handleSubmitCreate = async e => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề sự kiện!');
      return;
    }
    if (!formData.eventDate) {
      alert('Vui lòng chọn ngày tiêm!');
      return;
    }

    setIsCreating(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('VaccinationEventName', formData.title.trim());
      formDataToSend.append('Location', formData.location.trim() || 'string');
      formDataToSend.append('OrganizedBy', 'string');
      formDataToSend.append('EventDate', formData.eventDate + 'T00:00:00.000Z');
      formDataToSend.append(
        'Description',
        formData.description.trim() || 'string'
      );

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('DocumentFile', selectedFile);
      }

      console.log('🚀 Sending event data with file:', {
        title: formData.title.trim(),
        location: formData.location.trim() || 'string',
        eventDate: formData.eventDate,
        description: formData.description.trim() || 'string',
        hasFile: !!selectedFile,
        fileName: selectedFile?.name,
      });

      await vaccinationEventService.createEventWithFile(formDataToSend);
      await fetchVaccinationEvents();
      setShowCreateModal(false);
      clearFileData();
      alert('Tạo sự kiện tiêm chủng thành công!');
    } catch (error) {
      console.error('Error creating vaccination event:', error);
      alert('Có lỗi xảy ra khi tạo sự kiện tiêm chủng!');
    } finally {
      setIsCreating(false);
    }
  };

  // Submit edit form
  const handleSubmitEdit = async e => {
    e.preventDefault();

    if (!selectedEvent) return;

    setIsUpdating(true);
    try {
      // Format data according to API requirements for PUT
      const eventData = {
        vaccinationEventId: selectedEvent.id,
        vaccinationEventName: formData.title.trim(),
        location: formData.location.trim() || 'string',
        organizedBy: 'string', // As per API structure
        eventDate: formData.eventDate + 'T00:00:00.000Z', // Convert to ISO format
        description: formData.description.trim() || 'string',
      };

      console.log('🚀 Sending updated event data:', eventData);
      await vaccinationEventService.updateEvent(eventData);
      await fetchVaccinationEvents();
      setShowEditModal(false);
      alert('Cập nhật sự kiện tiêm chủng thành công!');
    } catch (error) {
      console.error('Error updating vaccination event:', error);
      alert('Có lỗi xảy ra khi cập nhật sự kiện tiêm chủng!');
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedEvent) return;

    setIsDeleting(true);
    try {
      await vaccinationEventService.deleteEvent(selectedEvent.id);
      await fetchVaccinationEvents();
      setShowDeleteModal(false);
      alert('Xóa sự kiện tiêm chủng thành công!');
    } catch (error) {
      console.error('Error deleting vaccination event:', error);
      alert('Có lỗi xảy ra khi xóa sự kiện tiêm chủng!');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="vaccination-events-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách sự kiện tiêm chủng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vaccination-events-container">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={fetchVaccinationEvents} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-events-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>💉 Quản Lý Sự Kiện Tiêm Chủng</h1>
          <p>Tạo và quản lý các đợt tiêm vaccine cho học sinh</p>
        </div>
        <div className="header-actions">
          <button onClick={handleCreateEvent} className="create-btn">
            ➕ Tạo sự kiện mới
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{events.length}</h3>
            <p>Tổng sự kiện</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="events-section">
        <h2>📋 Danh sách sự kiện</h2>

        {events.length > 0 ? (
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div
                  className="card-header"
                  onClick={() => handleViewStudents(event)}
                >
                  <h3>{event.title}</h3>
                  <span className="click-hint">👥 Xem danh sách học sinh</span>
                </div>

                <div className="card-body">
                  <div className="event-info">
                    <div className="info-row">
                      <span className="label">📅 Ngày tiêm:</span>
                      <span className="value">{event.eventDate}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📍 Địa điểm:</span>
                      <span className="value">
                        {event.location || 'Chưa có'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">👨‍💼 Tổ chức:</span>
                      <span className="value">
                        {event.organizedBy || 'admin'}
                      </span>
                    </div>
                  </div>

                  {event.description && (
                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditEvent(event)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="email-btn"
                    onClick={() => handleSendEmailAll(event)}
                  >
                    Gửi email
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteEvent(event)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <div className="no-events-icon">💉</div>
            <p>Chưa có sự kiện tiêm chủng nào</p>
            <button onClick={handleCreateEvent} className="create-first-btn">
              ➕ Tạo sự kiện đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowCreateModal(false);
            clearFileData();
          }}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Tạo Sự Kiện Tiêm Chủng Mới</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  clearFileData();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="modal-body">
              <div className="form-group">
                <label>Tên sự kiện tiêm chủng *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="VD: Tiêm vaccine COVID-19 đợt 1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả sự kiện</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về sự kiện tiêm chủng..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày tiêm *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Địa điểm tiêm</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="VD: Phòng y tế trường"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="form-group">
                <label>Tài liệu đính kèm (tùy chọn)</label>
                <div className="file-upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="file-select-btn"
                  >
                    📁 Chọn tài liệu
                  </button>
                  {selectedFile && (
                    <div className="file-preview">
                      <div className="file-info">
                        <span className="file-name">
                          📄 {selectedFile.name}
                        </span>
                        <span className="file-size">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          className="remove-file-btn"
                        >
                          ❌
                        </button>
                      </div>
                      {filePreview && (
                        <div className="image-preview">
                          <img src={filePreview} alt="Preview" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <small className="file-help">
                  Hỗ trợ: Hình ảnh, PDF, Word, Text. Tối đa 10MB
                </small>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    clearFileData();
                  }}
                  className="cancel-btn"
                  disabled={isCreating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="loading-spinner">⏳</span>
                      Đang tạo...
                    </>
                  ) : (
                    '➕ Tạo sự kiện'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Chỉnh Sửa Sự Kiện Tiêm Chủng</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="modal-body">
              <div className="form-group">
                <label>Tên sự kiện tiêm chủng *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả sự kiện</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày tiêm *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Địa điểm tiêm</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="cancel-btn"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="loading-spinner">⏳</span>
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content delete-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>🗑️ Xác Nhận Xóa</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa sự kiện tiêm chủng này?</p>
              <div className="delete-info">
                <strong>{selectedEvent.title}</strong>
                <br />
                <small>Ngày: {selectedEvent.eventDate}</small>
                <br />
                <small>Địa điểm: {selectedEvent.location}</small>
              </div>
              <p className="warning">⚠️ Hành động này không thể hoàn tác!</p>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-btn"
                disabled={isDeleting}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="delete-confirm-btn"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Đang xóa...
                  </>
                ) : (
                  '🗑️ Xóa'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showEmailModal && selectedEvent && (
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
                <h4>Sự kiện: {selectedEvent.title}</h4>
                <p>
                  📅 Ngày: {selectedEvent.eventDate} | 📍 Địa điểm:{' '}
                  {selectedEvent.location}
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
                  <strong>Đối tượng:</strong> Tất cả phụ huynh có con tham gia
                  sự kiện
                </p>
                <p>
                  <strong>Template:</strong> ID {emailFormData.emailTemplateId}
                </p>
                <p>
                  <strong>Sự kiện:</strong> {selectedEvent.title}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="cancel-btn"
                  disabled={isSendingEmail}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="send-email-btn"
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? (
                    <>
                      <span className="loading-spinner">⏳</span>
                      Đang gửi...
                    </>
                  ) : (
                    '📧 Gửi Email'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VaccinationEvents;
