import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Nurse/StudentList.css';
import { useNurseStudents } from '../../utils/hooks/useNurse';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import ClassIcon from '@mui/icons-material/Class';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function StudentList() {
  const navigate = useNavigate();
  const { data: students, loading, error, refetch } = useNurseStudents();

  // Mock data for fallback
  const [mockStudents] = useState([
    {
      id: 1,
      studentId: 'MN001',
      fullName: 'Nguyễn Văn An',
      dateOfBirth: '2020-05-15',
      gender: 'Nam',
      className: 'Mầm',
      parentName: 'Nguyễn Thị Hoa',
      parentPhone: '0912345678',
      healthStatus: 'Tốt',
      allergies: 'Không',
      emergencyContact: 'Nguyễn Văn Nam - 0987654321',
      enrollmentDate: '2024-01-15',
      bloodType: 'A+',
      height: '95cm',
      weight: '14kg',
      notes: 'Trẻ hoạt bát, thích vận động',
      age: 4,
    },
    {
      id: 2,
      studentId: 'MN002',
      fullName: 'Trần Thị Bình',
      dateOfBirth: '2020-08-22',
      gender: 'Nữ',
      className: 'Chồi',
      parentName: 'Trần Văn Nam',
      parentPhone: '0923456789',
      healthStatus: 'Bình thường',
      allergies: 'Dị ứng tôm cua',
      emergencyContact: 'Trần Thị Lan - 0976543210',
      enrollmentDate: '2024-01-20',
      bloodType: 'B+',
      height: '92cm',
      weight: '13kg',
      notes: 'Trẻ nhút nhát, cần khuyến khích',
      age: 4,
    },
    {
      id: 3,
      studentId: 'MN003',
      fullName: 'Lê Minh Cường',
      dateOfBirth: '2019-12-10',
      gender: 'Nam',
      className: 'Lá 1',
      parentName: 'Lê Thị Mai',
      parentPhone: '0934567890',
      healthStatus: 'Tốt',
      allergies: 'Không',
      emergencyContact: 'Lê Văn Cường - 0965432109',
      enrollmentDate: '2024-01-10',
      bloodType: 'O+',
      height: '98cm',
      weight: '15kg',
      notes: 'Trẻ thông minh, ham học hỏi',
      age: 5,
    },
    {
      id: 4,
      studentId: 'MN004',
      fullName: 'Phạm Thị Diệu',
      dateOfBirth: '2019-03-08',
      gender: 'Nữ',
      className: 'Lá 2',
      parentName: 'Phạm Văn Hùng',
      parentPhone: '0945678901',
      healthStatus: 'Yếu',
      allergies: 'Dị ứng phấn hoa',
      emergencyContact: 'Phạm Thị Hương - 0954321098',
      enrollmentDate: '2024-02-01',
      bloodType: 'AB+',
      height: '100cm',
      weight: '16kg',
      notes: 'Trẻ hay ốm, cần chú ý sức khỏe',
      age: 5,
    },
    {
      id: 5,
      studentId: 'MN005',
      fullName: 'Hoàng Văn Em',
      dateOfBirth: '2019-07-30',
      gender: 'Nam',
      className: 'Lá 3',
      parentName: 'Hoàng Thị Lan',
      parentPhone: '0956789012',
      healthStatus: 'Bình thường',
      allergies: 'Dị ứng đậu phộng',
      emergencyContact: 'Hoàng Văn Tú - 0943210987',
      enrollmentDate: '2024-01-25',
      bloodType: 'A-',
      height: '102cm',
      weight: '17kg',
      notes: 'Trẻ năng động, thích khám phá',
      age: 5,
    },
    {
      id: 6,
      studentId: 'MN006',
      fullName: 'Võ Thị Phượng',
      dateOfBirth: '2020-11-18',
      gender: 'Nữ',
      className: 'Chồi',
      parentName: 'Võ Văn Giang',
      parentPhone: '0967890123',
      healthStatus: 'Tốt',
      allergies: 'Không',
      emergencyContact: 'Võ Thị Kim - 0932109876',
      enrollmentDate: '2024-02-10',
      bloodType: 'B-',
      height: '90cm',
      weight: '12kg',
      notes: 'Trẻ ngoan ngoãn, dễ bảo',
      age: 4,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterHealthStatus, setFilterHealthStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const classes = [
    { value: '', label: 'Tất cả lớp' },
    { value: 'Mầm', label: 'Mầm' },
    { value: 'Chồi', label: 'Chồi' },
    { value: 'Lá 1', label: 'Lá 1' },
    { value: 'Lá 2', label: 'Lá 2' },
    { value: 'Lá 3', label: 'Lá 3' },
  ];

  const healthStatuses = [
    { value: '', label: 'Tất cả sức khỏe' },
    { value: 'Tốt', label: 'Tốt' },
    { value: 'Bình thường', label: 'Bình thường' },
    { value: 'Yếu', label: 'Yếu' },
  ];

  const studentData = students || mockStudents;

  const filteredStudents = studentData.filter(student => {
    const matchesSearch =
      (student.fullName &&
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentId &&
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.parentName &&
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass =
      filterClass === '' || student.className === filterClass;
    const matchesHealthStatus =
      filterHealthStatus === '' || student.healthStatus === filterHealthStatus;

    return matchesSearch && matchesClass && matchesHealthStatus;
  });

  const handleViewStudent = student => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleViewHealthRecords = student => {
    navigate(`/nurse/student-health-record/${student.id}`);
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách học sinh...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list-container">
        <div className="error-state">
          <p>❌ Lỗi khi tải danh sách học sinh: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <div>
          <h1>Danh Sách Học Sinh</h1>
          <p>Quản lý thông tin sức khỏe học sinh trường mầm non</p>
        </div>
      </div>

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

            <select
              value={filterHealthStatus}
              onChange={e => setFilterHealthStatus(e.target.value)}
            >
              {healthStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
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
      {!loading && !error && (!studentData || studentData.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có học sinh nào trong hệ thống</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Student Table */}
      {!loading && !error && studentData && studentData.length > 0 && (
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                <th>Tuổi</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Nhóm máu</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td className="student-id">{student.studentId}</td>
                  <td>
                    <div className="student-info">
                      <strong>{student.fullName}</strong>
                      <small>ID: {student.id}</small>
                    </div>
                  </td>
                  <td className="class-name">{student.className}</td>
                  <td>{student.age} tuổi</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.gender}</td>
                  <td>
                    <span className="blood-type">{student.bloodType}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewStudent(student)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-health"
                        onClick={() => handleViewHealthRecords(student)}
                        title="Xem hồ sơ sức khỏe"
                      >
                        🏥
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="no-data">
              <p>Không tìm thấy dữ liệu phù hợp với bộ lọc</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterClass('');
                  setFilterHealthStatus('');
                }}
                className="retry-btn"
              >
                🔄 Đặt lại bộ lọc
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
                Thông Tin Chi Tiết Học Sinh
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
                onClick={() => setShowModal(false)}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Student Name Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                padding: '20px',
                borderRadius: '15px',
                margin: '25px 25px 0 25px',
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

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
              {/* Basic Information Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '15px',
                }}
              >
                {/* Basic Information Cards */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 15px',
                    background: '#f8f9fa',
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
                      gap: '8px',
                    }}
                  >
                    <CakeIcon sx={{ fontSize: '1rem' }} />
                    Ngày sinh:
                  </span>
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
                    padding: '12px 15px',
                    background: '#f8f9fa',
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
                      gap: '8px',
                    }}
                  >
                    <WcIcon sx={{ fontSize: '1rem' }} />
                    Giới tính:
                  </span>
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
                    padding: '12px 15px',
                    background: '#f8f9fa',
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
                      gap: '8px',
                    }}
                  >
                    <ClassIcon sx={{ fontSize: '1rem' }} />
                    Lớp:
                  </span>
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
                    padding: '12px 15px',
                    background: '#f8f9fa',
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
                      gap: '8px',
                    }}
                  >
                    <BloodtypeIcon sx={{ fontSize: '1rem' }} />
                    Nhóm máu:
                  </span>
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 15px',
                    background: '#f8f9fa',
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
                      gap: '8px',
                    }}
                  >
                    <HealthAndSafetyIcon sx={{ fontSize: '1rem' }} />
                    Tình trạng sức khỏe:
                  </span>
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
                    padding: '12px 15px',
                    background: '#f8f9fa',
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
                      gap: '8px',
                    }}
                  >
                    <FamilyRestroomIcon sx={{ fontSize: '1rem' }} />
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
                    {currentStudent.parentName}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  handleViewHealthRecords(currentStudent);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#2f5148',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
              >
                <LocalHospitalIcon sx={{ fontSize: '1.2rem' }} />
                Xem Hồ Sơ Sức Khỏe
              </button>
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
