import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { healthCheckEventService } from '../../services/healthCheckEventService';
import { studentService } from '../../services/studentService';
import { healthCheckService } from '../../services/healthCheckService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../css/Nurse/HealthCheckEventStudents.css';

// Material-UI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';
import VisibilityIcon from '@mui/icons-material/Visibility';

const HealthCheckEventStudents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Add new health check modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventid: parseInt(eventId),
    studentid: '',
    staffid: 1, // Default staff ID
    checkdate: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    visionleft: '',
    visionright: '',
    bloodpressure: '',
    notes: ''
  });

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStudentDropdown && !event.target.closest('.student-dropdown-container')) {
        setShowStudentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStudentDropdown]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch health check records for the event
      const recordsData = await healthCheckEventService.getStudentsByEventId(eventId);
      console.log('Health check records from API:', recordsData);
      
      // Fetch all students to get their information
      const allStudents = await studentService.getAllStudents();
      console.log('All students from API:', allStudents);
      setAllStudents(allStudents || []);
      
      if (recordsData && recordsData.length > 0) {
        // Extract event info from the first record
        const firstRecord = recordsData[0];
        if (firstRecord.healthcheckevent) {
          setEventInfo(firstRecord.healthcheckevent);
        }
        
        // Combine health check records with student information
        const studentsList = recordsData.map(record => {
          const studentId = record.healthcheckrecord?.studentid;
          
          // Find student information from allStudents array
          const studentInfo = allStudents.find(student => student.studentId === studentId);
          
          const combinedInfo = {
            studentID: studentId || 'N/A',
            fullName: studentInfo?.fullname || 'Chưa có tên',
            className: studentInfo?.classname || 'Chưa có',
            dateOfBirth: studentInfo?.dob || null,
            age: studentInfo?.age || 'Chưa có',
            gender: studentInfo?.gender,
            bloodType: studentInfo?.bloodType || 'Chưa có',
            // Health check data
            checkDate: record.healthcheckrecord?.checkdate,
            height: record.healthcheckrecord?.height,
            weight: record.healthcheckrecord?.weight,
            visionLeft: record.healthcheckrecord?.visionleft,
            visionRight: record.healthcheckrecord?.visionright,
            bloodPressure: record.healthcheckrecord?.bloodpressure,
            notes: record.healthcheckrecord?.notes,
            recordID: record.healthcheckrecord?.checkid,
            // Parent information
            parent: studentInfo?.parent
          };
          return combinedInfo;
        });
        
        setStudents(studentsList);
      } else {
        setStudents([]);
        // Try to get event info separately if no records found
        try {
          const eventInfo = await healthCheckEventService.getHealthCheckEventById(eventId);
          setEventInfo(eventInfo);
        } catch (eventError) {
          console.error('Error fetching event info:', eventError);
        }
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      setError('Không thể tải danh sách học sinh cho sự kiện này');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEvents = () => {
    navigate('/nurse/health-check-events');
  };

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // Filter students for dropdown
  const filteredStudentsForDropdown = allStudents.filter(student =>
    student.fullname.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    setFormData(prev => ({
      ...prev,
      studentid: student.studentId.toString()
    }));
    setStudentSearchTerm(student.fullname);
    setShowStudentDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      eventid: parseInt(eventId),
      studentid: '',
      staffid: 1, // Default staff ID
      checkdate: new Date().toISOString().split('T')[0],
      height: '',
      weight: '',
      visionleft: '',
      visionright: '',
      bloodpressure: '',
      notes: ''
    });
    setStudentSearchTerm('');
    setShowStudentDropdown(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentid) {
      alert('Vui lòng chọn học sinh');
      return;
    }
    if (!formData.checkdate) {
      alert('Vui lòng nhập ngày khám');
      return;
    }
    if (!formData.staffid) {
      alert('Vui lòng nhập ID nhân viên');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await healthCheckService.addHealthCheck(formData);
      
      if (response) {
        alert('Thêm kiểm tra sức khỏe thành công!');
        setShowAddModal(false);
        resetForm();
        fetchEventData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating health check:', error);
      alert('Có lỗi xảy ra khi thêm kiểm tra sức khỏe');
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique classes for filter
  const uniqueClasses = [...new Set(students.map(student => student.className).filter(Boolean))];

  // Filter students based on search term and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentID.toString().includes(searchTerm);
    const matchesClass = classFilter === 'all' || student.className === classFilter;
    return matchesSearch && matchesClass;
  });

  // Calculate statistics
  const stats = {
    total: students.length,
    withHeight: students.filter(s => s.height > 0).length,
    withWeight: students.filter(s => s.weight > 0).length,
    withVision: students.filter(s => s.visionLeft > 0 || s.visionRight > 0).length,
    withBloodPressure: students.filter(s => s.bloodPressure && s.bloodPressure !== 'string').length
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="health-check-event-students-container">
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6c757d',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p>{error}</p>
          <button
            onClick={handleBackToEvents}
            style={{
              background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              marginTop: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBackIcon sx={{ fontSize: '1.2rem', marginRight: '8px' }} />
            Quay lại danh sách sự kiện
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="health-check-event-students-container">
      {/* Header */}
      <div className="header" style={{
        background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)',
        padding: '32px 40px',
        borderRadius: '24px',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '2rem', fontWeight: '600' }}>
              <i className="fas fa-calendar-medical" style={{ marginRight: '12px' }}></i>
              Kết quả khám sức khỏe của học sinh
            </h1>
            <p style={{ color: 'white', opacity: 0.95, margin: '8px 0 0 0', fontSize: '1.1rem' }}>
              {eventInfo?.healthcheckeventname || 'Sự kiện khám sức khỏe'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={openAddModal}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>➕</span>
              Thêm kiểm tra mới
            </button>
            <button
              onClick={fetchEventData}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <RefreshIcon sx={{ fontSize: '1.2rem' }} />
              Tải lại
            </button>
            <button
              onClick={handleBackToEvents}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ArrowBackIcon sx={{ fontSize: '1.2rem' }} />
              Quay lại
            </button>
          </div>
        </div>
      </div>

      {/* Event Information */}
      {eventInfo && (
        <div style={{
          background: '#e8f5e8',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(115, 173, 103, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2f5148',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-info-circle" style={{ color: '#73ad67' }}></i>
            Thông tin sự kiện
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CalendarTodayIcon sx={{ color: '#73ad67', fontSize: '20px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500' }}>Ngày khám</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                  {eventInfo.eventdate ? new Date(eventInfo.eventdate).toLocaleDateString('vi-VN') : 'Chưa có'}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <LocationOnIcon sx={{ color: '#73ad67', fontSize: '20px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500' }}>Địa điểm</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                  {eventInfo.location || 'Chưa có'}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <PersonIcon sx={{ color: '#73ad67', fontSize: '20px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500' }}>Tổ chức</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                  {eventInfo.createdby || 'Chưa có'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
          border: '1px solid #c1cbc2',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{
            padding: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(191, 239, 161, 0.3)'
          }}>
            <GroupIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              margin: 0,
              color: '#2f5148',
              fontWeight: 700,
              fontFamily: 'Satoshi, sans-serif'
            }}>
              {stats.total}
            </h3>
            <p style={{
              margin: '5px 0 0 0',
              color: '#97a19b',
              fontFamily: 'Satoshi, sans-serif'
            }}>
              Tổng học sinh
            </p>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
          border: '1px solid #c1cbc2',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{
            padding: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 193, 7, 0.3)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>📏</span>
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              margin: 0,
              color: '#2f5148',
              fontWeight: 700,
              fontFamily: 'Satoshi, sans-serif'
            }}>
              {stats.withHeight}
            </h3>
            <p style={{
              margin: '5px 0 0 0',
              color: '#97a19b',
              fontFamily: 'Satoshi, sans-serif'
            }}>
              Có chiều cao
            </p>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
          border: '1px solid #c1cbc2',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{
            padding: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(40, 167, 69, 0.3)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>⚖️</span>
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              margin: 0,
              color: '#2f5148',
              fontWeight: 700,
              fontFamily: 'Satoshi, sans-serif'
            }}>
              {stats.withWeight}
            </h3>
            <p style={{
              margin: '5px 0 0 0',
              color: '#97a19b',
              fontFamily: 'Satoshi, sans-serif'
            }}>
              Có cân nặng
            </p>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
          border: '1px solid #c1cbc2',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{
            padding: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(13, 110, 253, 0.3)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>👁️</span>
          </div>
          <div>
            <h3 style={{
              fontSize: '2rem',
              margin: 0,
              color: '#2f5148',
              fontWeight: 700,
              fontFamily: 'Satoshi, sans-serif'
            }}>
              {stats.withVision}
            </h3>
            <p style={{
              margin: '5px 0 0 0',
              color: '#97a19b',
              fontFamily: 'Satoshi, sans-serif'
            }}>
              Có thị lực
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '1.3rem',
          fontWeight: '600',
          color: '#2f5148',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fas fa-filter" style={{ color: '#73ad67' }}></i>
          Bộ lọc tìm kiếm
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#6c757d'
            }}>
              Tìm kiếm học sinh:
            </label>
            <input
              type="text"
              placeholder="Nhập tên học sinh hoặc ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#6c757d'
            }}>
              Lớp học:
            </label>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                backgroundColor: 'white'
              }}
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
      </div>

      {/* Students Table */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #c1cbc2',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{
          margin: '0 0 30px 0',
          color: '#2f5148',
          fontFamily: 'Satoshi, sans-serif',
          fontSize: '1.5rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <SchoolIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
          Kết quả khám sức khỏe của học sinh ({filteredStudents.length})
        </h2>

        {filteredStudents.length > 0 ? (
          <div style={{
            overflowX: 'auto',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>STT</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Tên học sinh</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Lớp</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Ngày sinh</th>
                  {/* Ngày khám column - Hidden */}
                  {/* <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Ngày khám</th> */}
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Chiều cao</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Cân nặng</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Thị lực</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Huyết áp</th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.studentID || index} style={{
                    borderBottom: '1px solid #e9ecef',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d',
                      fontWeight: '500'
                    }}>{index + 1}</td>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#2f5148'
                    }}>{student.fullName}</td>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>{student.className}</td>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </td>
                    {/* Ngày khám data - Hidden */}
                    {/* <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>
                      {student.checkDate ? new Date(student.checkDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </td> */}
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>
                      {student.height > 0 ? `${student.height}cm` : 'Chưa có'}
                    </td>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>
                      {student.weight > 0 ? `${student.weight}kg` : 'Chưa có'}
                    </td>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>
                      {student.visionLeft > 0 || student.visionRight > 0 
                        ? `T:${student.visionLeft || '-'} P:${student.visionRight || '-'}`
                        : 'Chưa có'
                      }
                    </td>
                    <td style={{
                      padding: '16px 12px',
                      fontSize: '0.9rem',
                      color: '#6c757d'
                    }}>
                      {student.bloodPressure && student.bloodPressure !== 'string' 
                        ? student.bloodPressure 
                        : 'Chưa có'
                      }
                    </td>
                    <td style={{
                      padding: '16px 12px'
                    }}>
                      <button
                        onClick={() => handleViewDetail(student)}
                        style={{
                          background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(47, 81, 72, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: '14px' }} />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#97a19b'
          }}>
            <InboxIcon sx={{ fontSize: '4rem', marginBottom: '20px', color: '#97a19b' }} />
            <p style={{
              margin: '0 0 10px 0',
              fontSize: '1.2rem',
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: 600
            }}>
              Không có kết quả khám sức khỏe nào
            </p>
            <p style={{
              margin: 0,
              fontSize: '1rem',
              fontFamily: 'Satoshi, sans-serif'
            }}>
              Kết quả khám sức khỏe sẽ được hiển thị khi có học sinh tham gia khám
            </p>
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
            backdropFilter: 'blur(4px)',
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
                <PersonIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
                Chi Tiết Kết Quả Khám Sức Khỏe
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
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
                             {/* Student Information */}
               <div style={{
                 background: '#f8f9fa',
                 borderRadius: '12px',
                 padding: '20px',
                 marginBottom: '20px',
                 border: '1px solid #e9ecef'
               }}>
                 <h4 style={{
                   margin: '0 0 15px 0',
                   color: '#2f5148',
                   fontSize: '1.2rem',
                   fontWeight: '600'
                 }}>
                   Thông tin học sinh
                 </h4>
                 <div style={{
                   display: 'grid',
                   gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                   gap: '15px'
                 }}>
                   <div>
                     <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Tên học sinh:</span>
                     <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                       {selectedStudent.fullName}
                     </div>
                   </div>
                   <div>
                     <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>ID học sinh:</span>
                     <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                       {selectedStudent.studentID}
                     </div>
                   </div>
                   <div>
                     <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Lớp:</span>
                     <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                       {selectedStudent.className}
                     </div>
                   </div>
                 
                   
                   <div>
                     <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Ngày sinh:</span>
                     <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                       {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa có'}
                     </div>
                   </div>

                 </div>
               </div>

              {/* Health Check Results */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{
                  margin: '0 0 15px 0',
                  color: '#2f5148',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  Kết quả khám sức khỏe
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Ngày khám:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                      {selectedStudent.checkDate ? new Date(selectedStudent.checkDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Chiều cao:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                      {selectedStudent.height > 0 ? `${selectedStudent.height}cm` : 'Chưa có'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Cân nặng:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                      {selectedStudent.weight > 0 ? `${selectedStudent.weight}kg` : 'Chưa có'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Thị lực trái:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                      {selectedStudent.visionLeft > 0 ? selectedStudent.visionLeft : 'Chưa có'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Thị lực phải:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                      {selectedStudent.visionRight > 0 ? selectedStudent.visionRight : 'Chưa có'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Huyết áp:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                      {selectedStudent.bloodPressure && selectedStudent.bloodPressure !== 'string' 
                        ? selectedStudent.bloodPressure 
                        : 'Chưa có'
                      }
                    </div>
                  </div>
                </div>
                {selectedStudent.notes && (
                  <div style={{ marginTop: '15px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Ghi chú:</span>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: '#2f5148',
                      marginTop: '5px',
                      padding: '10px',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      {selectedStudent.notes}
                    </div>
                  </div>
                )}
              </div>
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
                onClick={() => setShowDetailModal(false)}
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

      {/* Add New Health Check Modal */}
      {showAddModal && (
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
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '600px',
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
                <span style={{ fontSize: '1.5rem' }}>➕</span>
                Thêm Kiểm Tra Sức Khỏe Mới
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
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Row 1: Student Selection */}
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70,position:'relative'}}>
                  <i className="fas fa-user" style={{color:'#73ad67',fontSize:24}}></i>
                  <div className="student-dropdown-container" style={{width:'100%',position:'relative'}}>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>HỌC SINH:</div>
                    <input
                      type="text"
                      placeholder="Gõ tên học sinh để tìm..."
                      value={studentSearchTerm}
                      onChange={(e) => {
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
                        outline: 'none'
                      }}
                    />
                    {showStudentDropdown && (
                      <div style={{
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
                        marginTop: '4px'
                      }}>
                        {filteredStudentsForDropdown.length > 0 ? (
                          filteredStudentsForDropdown.map((student) => (
                            <div
                              key={student.id}
                              onClick={() => handleStudentSelect(student)}
                              style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                fontSize: '14px',
                                color: '#2f5148',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                              }}
                            >
                              <div style={{ fontWeight: '600' }}>{student.fullname}</div>
                              <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                                ID: {student.studentId} | {student.classname || 'Chưa có lớp'}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#6c757d'
                          }}>
                            Không tìm thấy học sinh
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Check Date */}
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <i className="fas fa-calendar-alt" style={{color:'#73ad67',fontSize:24}}></i>
                  <div style={{width:'100%'}}>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>NGÀY KHÁM:</div>
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
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Row 3: Height - Weight */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                  <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                    <i className="fas fa-ruler-vertical" style={{color:'#73ad67',fontSize:24}}></i>
                    <div style={{width:'100%'}}>
                      <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>CHIỀU CAO (cm):</div>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="Nhập chiều cao"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                    <i className="fas fa-weight" style={{color:'#73ad67',fontSize:24}}></i>
                    <div style={{width:'100%'}}>
                      <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>CÂN NẶNG (kg):</div>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="Nhập cân nặng"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Vision */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                  <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                    <i className="fas fa-eye" style={{color:'#73ad67',fontSize:24}}></i>
                    <div style={{width:'100%'}}>
                      <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>THỊ LỰC TRÁI:</div>
                      <input
                        type="number"
                        name="visionleft"
                        value={formData.visionleft}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="Nhập thị lực trái"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                    <i className="fas fa-eye" style={{color:'#73ad67',fontSize:24}}></i>
                    <div style={{width:'100%'}}>
                      <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>THỊ LỰC PHẢI:</div>
                      <input
                        type="number"
                        name="visionright"
                        value={formData.visionright}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="Nhập thị lực phải"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2f5148',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 5: Blood Pressure */}
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <i className="fas fa-heartbeat" style={{color:'#73ad67',fontSize:24}}></i>
                  <div style={{width:'100%'}}>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>HUYẾT ÁP:</div>
                    <input
                      type="text"
                      name="bloodpressure"
                      value={formData.bloodpressure}
                      onChange={handleInputChange}
                      placeholder="VD: 120/80"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#2f5148',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Row 6: Notes */}
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'flex-start',gap:12,minHeight:100}}>
                  <i className="fas fa-sticky-note" style={{color:'#73ad67',fontSize:24,marginTop:4}}></i>
                  <div style={{width:'100%'}}>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>GHI CHÚ:</div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Nhập ghi chú (nếu có)"
                      rows="3"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#2f5148',
                        width: '100%',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: '#f8f9fa',
                  color: '#6c757d',
                  border: '1px solid #e9ecef',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: submitting ? '#6c757d' : 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
              >
                {submitting ? 'Đang thêm...' : 'Thêm kiểm tra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckEventStudents; 