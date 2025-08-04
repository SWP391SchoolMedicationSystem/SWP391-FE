import React, { useState, useEffect } from 'react';
import { healthCheckService } from '../../services/healthCheckService';
import { nurseStudentService } from '../../services/nurseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import {
  getCurrentDateStringGMT7,
  getTomorrowDateStringGMT7,
} from '../../utils/dateUtils';
import '../../css/Nurse/HealthCheck.css';

const HealthCheck = () => {
  const [healthChecks, setHealthChecks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHealthCheck, setEditingHealthCheck] = useState(null);
  const [formData, setFormData] = useState({
    eventid: 1, // Default event ID
    studentid: '',
    checkdate: getCurrentDateStringGMT7(),
    height: '',
    weight: '',
    visionleft: '',
    visionright: '',
    bloodpressure: '',
    notes: '',
  });
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        showStudentDropdown &&
        !event.target.closest('.student-dropdown-container')
      ) {
        setShowStudentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStudentDropdown]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthChecksData, studentsData] = await Promise.all([
        healthCheckService.getAllHealthChecks(),
        nurseStudentService.getAllStudents(),
      ]);

      // Filter out soft deleted records and sort by date (newest first)
      const filteredHealthChecks = (healthChecksData || []).filter(
        check => !check.isdeleted || check.isdeleted === false
      );

      const sortedHealthChecks = filteredHealthChecks.sort((a, b) => {
        return new Date(b.checkdate) - new Date(a.checkdate);
      });

      setHealthChecks(sortedHealthChecks);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const selectedStudent = students.find(
        s => s.id.toString() === formData.studentid
      );

      // Validate required fields and convert to proper data types
      const healthCheckData = {
        eventid: parseInt(formData.eventid),
        studentid: parseInt(formData.studentid),
        checkdate: getTomorrowDateStringGMT7(), // Use tomorrow's date to avoid past date issues
        staffid: userInfo?.id || 1, // Provide fallback staff ID
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        visionleft: parseFloat(formData.visionleft) || 0,
        visionright: parseFloat(formData.visionright) || 0,
        bloodpressure: formData.bloodpressure || 'string',
        notes: formData.notes || 'string',
      };

      // Debug: Log the data being sent
      console.log('Form Data:', formData);
      console.log('Health Check Data being sent:', healthCheckData);

      // Validate that required fields are not empty
      if (!formData.studentid) {
        alert('Vui lòng chọn học sinh');
        return;
      }

      if (!formData.eventid) {
        alert('Vui lòng nhập ID sự kiện');
        return;
      }

      if (
        !formData.height ||
        !formData.weight ||
        !formData.visionleft ||
        !formData.visionright
      ) {
        alert('Vui lòng điền đầy đủ thông tin chiều cao, cân nặng và thị lực');
        return;
      }

      // Validate that all numeric fields are valid numbers
      if (
        isNaN(parseFloat(formData.height)) ||
        isNaN(parseFloat(formData.weight)) ||
        isNaN(parseFloat(formData.visionleft)) ||
        isNaN(parseFloat(formData.visionright))
      ) {
        alert(
          'Vui lòng nhập đúng định dạng số cho các trường chiều cao, cân nặng và thị lực'
        );
        return;
      }

      if (editingHealthCheck) {
        // For update, ensure we have the correct data structure
        const updateData = {
          ...healthCheckData,
          studentName: selectedStudent?.fullName || 'string',
        };
        await healthCheckService.updateHealthCheck(
          editingHealthCheck.checkid,
          updateData
        );
      } else {
        await healthCheckService.addHealthCheck(healthCheckData);
      }

      setShowModal(false);
      setEditingHealthCheck(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving health check:', error);
      alert('Có lỗi xảy ra khi lưu kiểm tra sức khỏe. Vui lòng thử lại.');
    }
  };

  const handleEdit = healthCheck => {
    setEditingHealthCheck(healthCheck);
    const studentName = getStudentName(healthCheck.studentid);
    setFormData({
      eventid: healthCheck.eventid || 1, // Include eventid from existing data
      studentid: healthCheck.studentid.toString(),
      checkdate: healthCheck.checkdate.split('T')[0],
      height: healthCheck.height.toString(),
      weight: healthCheck.weight.toString(),
      visionleft: healthCheck.visionleft.toString(),
      visionright: healthCheck.visionright.toString(),
      bloodpressure: healthCheck.bloodpressure,
      notes: healthCheck.notes,
    });
    setStudentSearchTerm(studentName);
    setShowStudentDropdown(false);
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kiểm tra sức khỏe này?')) {
      try {
        await healthCheckService.deleteHealthCheck(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting health check:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      eventid: 1, // Default event ID
      studentid: '',
      checkdate: getCurrentDateStringGMT7(),
      height: '',
      weight: '',
      visionleft: '',
      visionright: '',
      bloodpressure: '',
      notes: '',
    });
    setStudentSearchTerm('');
    setShowStudentDropdown(false);
  };

  const openAddModal = () => {
    setEditingHealthCheck(null);
    resetForm();
    setStudentSearchTerm('');
    setShowStudentDropdown(false);
    setShowModal(true);
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.fullName : 'Unknown Student';
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const handleStudentSelect = student => {
    setFormData(prev => ({
      ...prev,
      studentid: student.id.toString(),
    }));
    setStudentSearchTerm(student.fullName);
    setShowStudentDropdown(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="review-requests-container">
      {/* Header */}
      <div
        className="review-requests-header"
        style={{
          background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)',
          padding: '32px 40px',
          borderRadius: '24px',
        }}
      >
        <div>
          <h1 style={{ color: 'white' }}>
            <i
              className="fas fa-stethoscope"
              style={{ marginRight: '12px' }}
            ></i>
            Kiểm tra sức khỏe học sinh
          </h1>
          <p style={{ color: 'white', opacity: 0.95 }}>
            Quản lý và theo dõi tình trạng sức khỏe của học sinh
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={openAddModal}
            className="refresh-button"
            style={{
              color: 'white',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(47,81,72,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fas fa-plus"></i>
            Thêm kiểm tra mới
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{healthChecks.length}</h3>
            <p>Tổng kiểm tra</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{students.length}</h3>
            <p>Học sinh</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>
              {
                healthChecks.filter(
                  check => new Date(check.checkdate) >= new Date()
                ).length
              }
            </h3>
            <p>Kiểm tra gần đây</p>
          </div>
        </div>
        <div className="stat-card declined">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>
              {healthChecks.length > 0
                ? Math.round(
                    (healthChecks.reduce(
                      (sum, check) => sum + (check.height || 0),
                      0
                    ) /
                      healthChecks.length) *
                      100
                  ) / 100
                : 0}
            </h3>
            <p>Chiều cao TB (m)</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên học sinh..."
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <button
            onClick={fetchData}
            className="refresh-button"
            style={{
              background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(47, 81, 72, 0.3)',
            }}
          >
            <i className="fas fa-sync-alt"></i>
            Làm mới
          </button>
        </div>
      </div>

      {/* Enhanced Modern Table */}
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
            <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
            Danh sách kiểm tra sức khỏe ({healthChecks.length})
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
              <tr
                style={{
                  background: '#f8f9fa',
                  borderBottom: '2px solid #e9ecef',
                }}
              >
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
                  HỌC SINH
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
                  NGÀY KIỂM TRA
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
                  CHIỀU CAO (m)
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
                  CÂN NẶNG (kg)
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
                  THỊ LỰC TRÁI
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
                  THỊ LỰC PHẢI
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
                  HUYẾT ÁP
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
                  GHI CHÚ
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
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody>
              {healthChecks.map((check, index) => (
                <tr
                  key={check.checkid}
                  style={{
                    borderBottom: '1px solid #e9ecef',
                    transition: 'all 0.2s ease',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#73ad67',
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: '#2f5148',
                          marginBottom: '2px',
                        }}
                      >
                        {getStudentName(check.studentid)}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {new Date(check.checkdate).toLocaleDateString('vi-VN')}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {check.height}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {check.weight}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {check.visionleft}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {check.visionright}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {check.bloodpressure}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                      maxWidth: '200px',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
                      }}
                      title={check.notes}
                    >
                      {check.notes}
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
                      }}
                    >
                      <button
                        onClick={() => handleEdit(check)}
                        title="Chỉnh sửa"
                        style={{
                          background:
                            'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          minWidth: '36px',
                          height: '36px',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(40, 167, 69, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <i
                          className="fas fa-edit"
                          style={{ fontSize: '14px' }}
                        ></i>
                      </button>
                      <button
                        onClick={() => handleDelete(check.checkid)}
                        title="Xóa"
                        style={{
                          background:
                            'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          minWidth: '36px',
                          height: '36px',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(220, 53, 69, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ fontSize: '14px' }}
                        ></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {healthChecks.length === 0 && (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#97a19b',
                fontSize: '1rem',
              }}
            >
              <p>Không có dữ liệu kiểm tra sức khỏe nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Health Check Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i
                  className="fas fa-stethoscope"
                  style={{ marginRight: '10px', color: '#73ad67' }}
                ></i>
                {editingHealthCheck
                  ? 'Chỉnh sửa kiểm tra sức khỏe'
                  : 'Thêm kiểm tra sức khỏe mới'}
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="health-check-form">
              <div className="modal-body">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  {/* Row 1: Event ID - Student */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-calendar-alt"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        ID SỰ KIỆN:
                      </div>
                      <input
                        type="number"
                        name="eventid"
                        value={formData.eventid}
                        onChange={handleInputChange}
                        min="1"
                        required
                        placeholder="Nhập ID sự kiện"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                      position: 'relative',
                    }}
                  >
                    <i
                      className="fas fa-user-graduate"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div
                      className="student-dropdown-container"
                      style={{ width: '100%', position: 'relative' }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        HỌC SINH:
                      </div>
                      <input
                        type="text"
                        placeholder="Gõ tên học sinh để tìm..."
                        value={studentSearchTerm}
                        onChange={e => {
                          setStudentSearchTerm(e.target.value);
                          setShowStudentDropdown(true);
                          if (!e.target.value) {
                            setFormData(prev => ({ ...prev, studentid: '' }));
                          }
                        }}
                        onFocus={() => setShowStudentDropdown(true)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                      {showStudentDropdown && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            marginTop: '4px',
                          }}
                        >
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                              <div
                                key={student.id}
                                onClick={() => handleStudentSelect(student)}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f0f0f0',
                                  fontSize: '14px',
                                  color: '#2f5148',
                                  transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                  e.target.style.backgroundColor = '#f8f9fa';
                                }}
                                onMouseLeave={e => {
                                  e.target.style.backgroundColor =
                                    'transparent';
                                }}
                              >
                                {student.fullName}
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                color: '#6c757d',
                                textAlign: 'center',
                              }}
                            >
                              Không tìm thấy học sinh
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Check Date - Height */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-calendar-check"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        NGÀY KIỂM TRA:
                      </div>
                      <input
                        type="date"
                        name="checkdate"
                        value={formData.checkdate}
                        onChange={handleInputChange}
                        required
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-ruler-vertical"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        CHIỀU CAO (m):
                      </div>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0.5"
                        max="3"
                        required
                        placeholder="VD: 1.20"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Weight - Vision Left */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-weight"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        CÂN NẶNG (kg):
                      </div>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.01"
                        min="1"
                        max="200"
                        required
                        placeholder="VD: 25.5"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-eye"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        THỊ LỰC TRÁI:
                      </div>
                      <input
                        type="number"
                        name="visionleft"
                        value={formData.visionleft}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        max="10"
                        required
                        placeholder="VD: 8.5"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 4: Vision Right - Blood Pressure */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-eye"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        THỊ LỰC PHẢI:
                      </div>
                      <input
                        type="number"
                        name="visionright"
                        value={formData.visionright}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        max="10"
                        required
                        placeholder="VD: 9.0"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '18px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 70,
                    }}
                  >
                    <i
                      className="fas fa-heartbeat"
                      style={{ color: '#73ad67', fontSize: 24 }}
                    ></i>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#888',
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        HUYẾT ÁP:
                      </div>
                      <input
                        type="text"
                        name="bloodpressure"
                        value={formData.bloodpressure}
                        onChange={handleInputChange}
                        placeholder="VD: 120/80 mmHg"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes Section (Full Width) */}
                <div
                  style={{
                    gridColumn: '1/3',
                    background: '#f8fafc',
                    borderRadius: 12,
                    padding: '18px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <i
                    className="fas fa-sticky-note"
                    style={{ color: '#73ad67', fontSize: 24, marginTop: 2 }}
                  ></i>
                  <div style={{ width: '100%' }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: '#888',
                        fontWeight: 500,
                        marginBottom: 2,
                      }}
                    >
                      GHI CHÚ:
                    </div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Nhập ghi chú về tình trạng sức khỏe..."
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#2f5148',
                        width: '100%',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '60px',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="action-buttons"
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  padding: '20px',
                  borderTop: '1px solid #e0e0e0',
                }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    background: '#f8f9fa',
                    color: '#6c757d',
                    border: '1px solid #dee2e6',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  style={{
                    background:
                      'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {editingHealthCheck ? 'Cập nhật' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;
