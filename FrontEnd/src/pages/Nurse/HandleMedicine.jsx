import React, { useState } from 'react';
import '../../css/Nurse/HandleMedicine.css';

function HandleMedicine() {
  const [medicineSubmissions, setMedicineSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    instructions: '',
    notes: '',
  });

  // Loading states for different operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter submissions
  const filteredSubmissions = medicineSubmissions.filter(submission => {
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === '' || submission.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewSubmission = submission => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleAddMedicine = () => {
    setFormData({
      studentName: '',
      parentName: '',
      parentPhone: '',
      medicineName: '',
      medicineType: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: '',
      instructions: '',
    });
    setShowFormModal(true);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock submit functionality - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      alert('Đã lưu thông tin thuốc thành công!');
      setShowFormModal(false);
      setFormData({
        medicineName: '',
        dosage: '',
        instructions: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi lưu thông tin thuốc!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessSubmission = async submission => {
    setIsProcessing(true);
    try {
      // Mock processing functionality - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Update local state
      setMedicineSubmissions(prev =>
        prev.map(s =>
          s.id === submission.id ? { ...s, status: 'Đã xử lý' } : s
        )
      );

      alert('Đã xử lý yêu cầu thuốc thành công!');
    } catch (error) {
      console.error('Error processing submission:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu thuốc!');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'Đã xử lý':
        return 'status-processed';
      case 'Chờ xử lý':
        return 'status-pending';
      case 'Từ chối':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  // Statistics
  const stats = {
    total: medicineSubmissions.length,
    pending: medicineSubmissions.filter(s => s.status === 'Chờ xử lý').length,
    processed: medicineSubmissions.filter(s => s.status === 'Đã xử lý').length,
    today: medicineSubmissions.filter(
      s => s.submissionDate === new Date().toISOString().split('T')[0]
    ).length,
  };

  return (
    <div className="handle-medicine-container">
      <div className="handle-medicine-header">
        <h1>🏥 Xử Lý Thuốc Phụ Huynh</h1>
        <p>Quản lý thuốc được gửi bởi phụ huynh</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng yêu cầu</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chờ xử lý</p>
          </div>
        </div>
        <div className="stat-card processed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.processed}</h3>
            <p>Đã xử lý</p>
          </div>
        </div>
        <div className="stat-card today">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.today}</h3>
            <p>Hôm nay</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-filter-controls">
          <div className="search-controls">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên học sinh, phụ huynh..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
        </div>

        <button className="add-medicine-btn" onClick={handleAddMedicine}>
          ➕ Thêm thuốc mới
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Mã HS</th>
              <th>Học sinh</th>
              <th>Lớp</th>
              <th>Phụ huynh</th>
              <th>Ngày gửi</th>
              <th>Số loại thuốc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => (
              <tr key={submission.id}>
                <td className="student-id">{submission.studentId}</td>
                <td>
                  <div className="student-info">
                    <strong>{submission.studentName}</strong>
                  </div>
                </td>
                <td className="class-name">{submission.className}</td>
                <td>
                  <div className="parent-info">
                    <div>{submission.parentName}</div>
                    <small>{submission.parentPhone}</small>
                  </div>
                </td>
                <td>{submission.submissionDate}</td>
                <td>
                  <span className="count-badge">
                    {submission.medicines.length} loại
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(
                      submission.status
                    )}`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewSubmission(submission)}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleProcessSubmission(submission)}
                      className="process-btn"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="loading-spinner">⏳</span>
                          Đang xử lý...
                        </>
                      ) : (
                        '✅ Xử lý'
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubmissions.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy yêu cầu nào</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedSubmission && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết thuốc - {selectedSubmission.studentName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="submission-summary">
                <div className="summary-grid">
                  <div className="summary-item">
                    <label>Mã học sinh:</label>
                    <span>{selectedSubmission.studentId}</span>
                  </div>
                  <div className="summary-item">
                    <label>Lớp:</label>
                    <span>{selectedSubmission.className}</span>
                  </div>
                  <div className="summary-item">
                    <label>Phụ huynh:</label>
                    <span>{selectedSubmission.parentName}</span>
                  </div>
                  <div className="summary-item">
                    <label>Số điện thoại:</label>
                    <span>{selectedSubmission.parentPhone}</span>
                  </div>
                  <div className="summary-item">
                    <label>Ngày gửi:</label>
                    <span>{selectedSubmission.submissionDate}</span>
                  </div>
                  <div className="summary-item">
                    <label>Trạng thái:</label>
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="medicines-list">
                <h4>Danh sách thuốc ({selectedSubmission.medicines.length})</h4>
                {selectedSubmission.medicines.map((medicine, index) => (
                  <div key={index} className="medicine-detail-card">
                    <h5>{medicine.name}</h5>
                    <div className="medicine-details">
                      <div className="detail-row">
                        <span className="detail-label">Loại thuốc:</span>
                        <span>{medicine.type}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Liều dùng:</span>
                        <span>{medicine.dosage}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Tần suất:</span>
                        <span>{medicine.frequency}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Thời gian:</span>
                        <span>{medicine.duration}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Ghi chú:</span>
                        <span>{medicine.notes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Form Modal */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div
            className="modal-content large"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Thêm thông tin thuốc mới</h3>
              <button
                className="modal-close"
                onClick={() => setShowFormModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitForm} className="medicine-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tên học sinh *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tên phụ huynh *</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tên thuốc *</label>
                    <input
                      type="text"
                      name="medicineName"
                      value={formData.medicineName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Loại thuốc *</label>
                    <select
                      name="medicineType"
                      value={formData.medicineType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn loại thuốc</option>
                      <option value="Viên nang">Viên nang</option>
                      <option value="Viên nén">Viên nén</option>
                      <option value="Siro">Siro</option>
                      <option value="Thuốc bôi">Thuốc bôi</option>
                      <option value="Thuốc nhỏ mắt">Thuốc nhỏ mắt</option>
                      <option value="Thuốc xịt">Thuốc xịt</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Liều dùng *</label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      placeholder="VD: 5ml, 1 viên, 2 giọt"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tần suất sử dụng *</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn tần suất</option>
                      <option value="1 lần/ngày">1 lần/ngày</option>
                      <option value="2 lần/ngày">2 lần/ngày</option>
                      <option value="3 lần/ngày">3 lần/ngày</option>
                      <option value="Khi cần">Khi cần</option>
                      <option value="Trước ăn">Trước ăn</option>
                      <option value="Sau ăn">Sau ăn</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Thời gian sử dụng *</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="VD: 3 ngày, 1 tuần, theo triệu chứng"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Ghi chú</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Ghi chú đặc biệt về cách sử dụng..."
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Hướng dẫn sử dụng</label>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Hướng dẫn chi tiết cho giáo viên..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="cancel-btn"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner">⏳</span>
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu'
                    )}
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

export default HandleMedicine;
