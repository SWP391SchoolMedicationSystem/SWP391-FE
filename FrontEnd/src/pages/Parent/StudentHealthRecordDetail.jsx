import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { parentService } from '../../services/parentService';
import '../../css/Manager/StudentHealthRecordDetail.css';

const StudentHealthRecordDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [healthRecord, setHealthRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    studentID: parseInt(studentId),
    healthCategoryID: 1,
    healthRecordDate: new Date().toISOString(),
    healthrecordtitle: '',
    healthrecorddescription: '',
    staffid: 3,
    isConfirm: true,
    createdBy: '3',
    createdDate: new Date().toISOString(),
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  var item = {
    studentId: 1,
    studentName: 'Nguyễn Văn A',
    healthRecordTitle: 'Hồ sơ sức khỏe',
    healthRecordDate: '2021-01-01',
    healthCategory: 'Sức khỏe',
  };

  useEffect(() => {
    fetchHealthRecord();
  }, [studentId]);

  const fetchHealthRecord = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `https://api-schoolhealth.purintech.id.vn/api/HealthRecord/fullhealthrecordByStudentId?studentId=${studentId}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 500) {
          // Show create option when API returns 500
          setError('Chưa có hồ sơ sức khỏe. Vui lòng tạo mới.');
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setHealthRecord(data);
    } catch (err) {
      console.error('❌ Error fetching health record:', err);
      setError('chưa có thông tin hồ sơ sức khỏe chi tiết');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case true:
        return 'Đã xác nhận';
      case false:
        return 'Chưa xác nhận';
      default:
        return 'Không xác định';
    }
  };

  // CRUD Functions for Health Record
  const handleCreateHealthRecord = async e => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/HealthRecord/healthrecord',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      alert('Tạo hồ sơ sức khỏe thành công!');
      setShowCreateModal(false);
      setFormData({
        studentID: parseInt(studentId),
        healthCategoryID: 1,
        healthRecordDate: new Date().toISOString(),
        healthrecordtitle: '',
        healthrecorddescription: '',
        staffid: 3,
        isConfirm: true,
        createdBy: '3',
        createdDate: new Date().toISOString(),
      });
      fetchHealthRecord(); // Refresh data
    } catch (error) {
      console.error('Error creating health record:', error);
      alert('Không thể tạo hồ sơ sức khỏe. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'healthCategoryID' ? parseInt(value) : value,
    }));
  };

  // Delete Health Record Function
  const handleDeleteHealthRecord = async () => {
    setDeleteLoading(true);

    try {
      const response = await fetch(
        `https://api-schoolhealth.purintech.id.vn/api/HealthRecord/delete?id=${healthRecord.healthRecordId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      alert('Xóa hồ sơ sức khỏe thành công!');
      setShowDeleteModal(false);
      navigate('/parent/health-records'); // Redirect to health records list
    } catch (error) {
      console.error('Error deleting health record:', error);
      alert('Không thể xóa hồ sơ sức khỏe. Vui lòng thử lại.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <IconButton
          onClick={() => navigate('/parent/health-records')}
          className="back-icon-btn"
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
        <div>{error}</div>
        <div className="error-actions">
          <button
            onClick={() => setShowCreateModal(true)}
            className="create-btn"
          >
            ➕ Tạo hồ sơ sức khỏe
          </button>
        </div>

        {/* Create Health Record Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Tạo Hồ Sơ Sức Khỏe Mới</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateHealthRecord}>
                <div className="form-group">
                  <label htmlFor="healthCategoryID">Bệnh đặc biệt *</label>
                  <select
                    id="healthCategoryID"
                    name="healthCategoryID"
                    value={formData.healthCategoryID}
                    onChange={handleFormChange}
                    required
                  >
                    <option value={1}>Dị ứng</option>
                    <option value={2}>Bệnh mãn tính</option>
                    <option value={3}>Thị lực</option>
                    <option value={4}>Tiền sử bệnh án</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="healthrecordtitle">Tiêu đề hồ sơ *</label>
                  <input
                    type="text"
                    id="healthrecordtitle"
                    name="healthrecordtitle"
                    value={formData.healthrecordtitle}
                    onChange={handleFormChange}
                    placeholder="Nhập tiêu đề hồ sơ"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="healthRecordDate">Ngày ghi nhận *</label>
                  <input
                    type="datetime-local"
                    id="healthRecordDate"
                    name="healthRecordDate"
                    value={formData.healthRecordDate.slice(0, 16)}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="healthrecorddescription">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    id="healthrecorddescription"
                    name="healthrecorddescription"
                    value={formData.healthrecorddescription}
                    onChange={handleFormChange}
                    placeholder="Nhập mô tả chi tiết"
                    rows="4"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="cancel-btn"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitLoading}
                  >
                    {submitLoading ? '⏳ Đang tạo...' : '➕ Tạo hồ sơ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!healthRecord) {
    return (
      <div className="error-state">
        <div>Không tìm thấy hồ sơ sức khỏe</div>
        <button
          onClick={() => navigate('/parent/health-records')}
          className="back-button"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const vaccinationCount = healthRecord.vaccinationRecords?.length || 0;
  const healthCheckCount = healthRecord.healthChecks?.length || 0;

  return (
    <div className="student-health-record-detail">
      {/* Row 1: Student Name */}
      <div className="student-header">
        <h1>{healthRecord.studentName}</h1>
        <p>{healthRecord.healthrecordtitle}</p>
      </div>

      {/* Row 2: Detailed Information */}
      <div className="section-card">
        <div className="section-header">
          <h2
            style={{
              fontFamily:
                "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <span className="material-icons">person</span>
            Thông tin chi tiết
          </h2>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="delete-btn"
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              boxShadow: '0 3px 12px rgba(220, 53, 69, 0.3)',
            }}
          >
            🗑️ Xóa hồ sơ
          </button>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <div
              className="detail-label"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Danh mục sức khỏe
            </div>
            <div
              className="detail-value"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {healthRecord.healthCategory}
            </div>
          </div>
          <div className="detail-item">
            <div
              className="detail-label"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Ngày ghi nhận
            </div>
            <div
              className="detail-value"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {new Date(healthRecord.healthRecordDate).toLocaleDateString(
                'vi-VN'
              )}
            </div>
          </div>
          <div className="detail-item">
            <div
              className="detail-label"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Nhân viên phụ trách
            </div>
            <div
              className="detail-value"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {healthRecord.staffName}
            </div>
          </div>
          <div className="detail-item">
            <div
              className="detail-label"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Trạng thái xác nhận
            </div>
            <div className="detail-value">
              <span
                className={`status-badge ${
                  healthRecord.isConfirm ? 'confirmed' : 'pending'
                }`}
                style={{
                  fontFamily:
                    "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                {healthRecord.isConfirm ? 'Đã xác nhận' : 'Chờ xác nhận'}
              </span>
            </div>
          </div>
          <div className="detail-item description">
            <div
              className="detail-label"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              Mô tả chi tiết
            </div>
            <div
              className="detail-value"
              style={{
                fontFamily:
                  "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {healthRecord.healthrecorddescription}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Vaccination History */}
      <div className="section-card">
        <div className="section-header">
          <h2>
            <span className="material-icons">vaccines</span>
            Lịch sử tiêm chủng
          </h2>
          <span className="count-badge">{vaccinationCount} lần tiêm</span>
        </div>
        {vaccinationCount > 0 ? (
          <div className="record-grid">
            {healthRecord.vaccinationRecords.map((vaccination, index) => (
              <div key={index} className="record-card">
                <div className="record-header">
                  <h3 className="record-title">{vaccination.vaccinename}</h3>
                  <span className="vaccination-status completed">Đã tiêm</span>
                </div>
                <div className="record-info">
                  <div className="record-info-item">
                    <div className="record-info-label">Ngày tiêm</div>
                    <div className="record-info-value">
                      {new Date(vaccination.vaccinationdate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </div>
                  </div>
                  <div className="record-info-item">
                    <div className="record-info-label">Số liều</div>
                    <div className="record-info-value">
                      Liều {vaccination.dosenumber}
                    </div>
                  </div>
                  <div className="record-info-item">
                    <div className="record-info-label">Mã sự kiện</div>
                    <div className="record-info-value">
                      #{vaccination.vaccinationeventid}
                    </div>
                  </div>
                </div>
                {vaccination.notes && (
                  <div className="notes-section">
                    <div className="notes-label">Ghi chú</div>
                    <div className="notes-text">{vaccination.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-icons">vaccines</span>
            <p>Chưa có lịch sử tiêm chủng</p>
          </div>
        )}
      </div>

      {/* Row 4: Health Checks */}
      <div className="section-card">
        <div className="section-header">
          <h2>
            <span className="material-icons">assessment</span>
            Lịch sử khám sức khỏe
          </h2>
          <span className="count-badge">{healthCheckCount} lần khám</span>
        </div>
        {healthCheckCount > 0 ? (
          <div className="record-grid">
            {healthRecord.healthChecks.map((check, index) => (
              <div key={index} className="record-card">
                <div className="record-header">
                  <h3 className="record-title">
                    Khám sức khỏe #{check.checkid}
                  </h3>
                  <span className="record-info-value">
                    {new Date(check.checkdate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="health-metrics">
                  <div className="metric-card height">
                    <div className="metric-label">Chiều cao</div>
                    <div className="metric-value">{check.height} m</div>
                  </div>
                  <div className="metric-card weight">
                    <div className="metric-label">Cân nặng</div>
                    <div className="metric-value">{check.weight} kg</div>
                  </div>
                  <div className="metric-card left-vision">
                    <div className="metric-label">Thị lực trái</div>
                    <div className="metric-value">{check.visionleft}/10</div>
                  </div>
                  <div className="metric-card right-vision">
                    <div className="metric-label">Thị lực phải</div>
                    <div className="metric-value">{check.visionright}/10</div>
                  </div>
                  <div className="metric-card blood-pressure">
                    <div className="metric-label">Huyết áp</div>
                    <div className="metric-value">{check.bloodpressure}</div>
                  </div>
                </div>

                {check.notes && (
                  <div className="notes-section">
                    <div className="notes-label">Ghi chú</div>
                    <div className="notes-text">{check.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-icons">assessment</span>
            <p>Chưa có lịch sử khám sức khỏe</p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <IconButton
          onClick={() => navigate('/parent/health-records')}
          className="back-icon-btn"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 15px rgba(47, 81, 72, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
              boxShadow: '0 6px 20px rgba(47, 81, 72, 0.3)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      </div>

      {/* Delete Health Record Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xác nhận xóa hồ sơ</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.1rem',
                  color: '#2f5148',
                  textAlign: 'center',
                }}
              >
                Bạn có chắc chắn muốn xóa hồ sơ sức khỏe này không?
              </p>
              <p
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '0.9rem',
                  color: '#97a19b',
                  textAlign: 'center',
                }}
              >
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-btn"
                disabled={deleteLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteHealthRecord}
                className="submit-btn"
                disabled={deleteLoading}
                style={{
                  background: '#dc3545',
                  '&:hover': { background: '#c82333' },
                  '&:disabled': { background: '#6c757d' },
                }}
              >
                {deleteLoading ? '⏳ Đang xóa...' : '🗑️ Xóa hồ sơ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHealthRecordDetail;
