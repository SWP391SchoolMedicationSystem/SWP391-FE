import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  FileUpload,
  Download,
  Refresh,
  School,
  Person,
  Email,
  Phone,
  Visibility,
  Info,
  Close,
  Cake,
  Wc,
  Class,
  Bloodtype,
  HealthAndSafety,
  FamilyRestroom,
} from '@mui/icons-material';

import '../../css/Admin/StudentManagement.css';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/Student/GetAllStudents'
      );
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      console.log(
        '📁 Selected file:',
        file.name,
        'Type:',
        file.type,
        'Size:',
        file.size
      );

      // Clear previous messages
      setImportError('');
      setImportSuccess('');

      // Validate file type - only .xlsx
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      ];

      const isValidType =
        allowedTypes.includes(file.type) || file.name.endsWith('.xlsx');

      if (!isValidType) {
        setImportError(
          '❌ File không đúng định dạng. Chỉ chấp nhận file Excel (.xlsx)'
        );
        setImportFile(null);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setImportError('❌ File quá lớn. Kích thước tối đa là 5MB');
        setImportFile(null);
        return;
      }

      // Validate file is not empty
      if (file.size === 0) {
        setImportError('❌ File rỗng. Vui lòng chọn file có dữ liệu');
        setImportFile(null);
        return;
      }

      // All validations passed
      setImportFile(file);
      setImportSuccess('✅ File hợp lệ! Bạn có thể tiến hành import.');
    }
  };

  const handleImportStudents = async () => {
    if (!importFile) {
      setImportError('❌ Vui lòng chọn file để import');
      return;
    }

    // Validate file type - only .xlsx
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    if (!allowedTypes.includes(importFile.type)) {
      setImportError(
        '❌ File không đúng định dạng. Chỉ chấp nhận file Excel (.xlsx)'
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (importFile.size > maxSize) {
      setImportError('❌ File quá lớn. Kích thước tối đa là 5MB');
      return;
    }

    setImportLoading(true);
    setImportError('');
    setImportSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      console.log(
        '📤 Importing file:',
        importFile.name,
        'Size:',
        importFile.size
      );

      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/Student/student',
        {
          method: 'POST',
          body: formData,
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('📊 Import response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Import result:', result);

        const successMessage =
          result.length > 0
            ? `Import thất bại.`
            : 'Import thành công! Đã thêm học sinh mới.';

        setSuccessMessage(successMessage);
        setShowSuccessModal(true);
        setImportFile(null);
        setShowImportModal(false);
        // Refresh student list
        fetchStudents();
      } else {
        let errorMessage = '❌ Có lỗi xảy ra khi import file';

        try {
          const errorData = await response.json();
          console.log('📊 Import error data:', errorData);

          if (errorData.message) {
            errorMessage = `❌ ${errorData.message}`;
          } else if (errorData.error) {
            errorMessage = `❌ ${errorData.error}`;
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = `❌ ${errorData.errors.join(', ')}`;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorMessage = `❌ Lỗi server (${response.status}): ${response.statusText}`;
        }

        setImportError(errorMessage);
      }
    } catch (error) {
      console.error('❌ Import error:', error);

      let errorMessage = '❌ Có lỗi xảy ra khi import file. Vui lòng thử lại.';

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage =
          '❌ Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }

      setImportError(errorMessage);
    } finally {
      setImportLoading(false);
    }
  };

  const handleEditStudent = student => {
    setEditingStudent(student);
    setShowEditModal(true);
    setEditError('');
    setEditSuccess('');
  };

  const handleViewStudent = student => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleUpdateStudent = async updatedData => {
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      const requestData = {
        id: editingStudent.studentId,
        studentCode: updatedData.studentCode,
        fullname: updatedData.fullname,
        age: parseInt(updatedData.age),
        bloodType: updatedData.bloodType,
        gender: updatedData.gender === 'true' || updatedData.gender === true,
        classid: parseInt(updatedData.classid),
        parentid: editingStudent.parent?.parentid || 0,
        dob: updatedData.dob,
        updatedAt: new Date().toISOString().split('T')[0],
      };

      console.log('📤 Update student request:', requestData);

      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/Student/UpdateStudent',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Update student response:', result);
        setEditSuccess('Cập nhật học sinh thành công!');
        setShowEditModal(false);
        // Refresh student list
        fetchStudents();
      } else {
        const errorData = await response.json();
        console.error('❌ Update student error:', errorData);
        setEditError(
          errorData.message || 'Có lỗi xảy ra khi cập nhật học sinh'
        );
      }
    } catch (error) {
      console.error('❌ Update student error:', error);
      setEditError('Có lỗi xảy ra khi cập nhật học sinh. Vui lòng thử lại.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteStudent = async student => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa học sinh ${student.fullname}?`)
    ) {
      try {
        const response = await fetch(
          `https://api-schoolhealth.purintech.id.vn/api/Student/delete/${student.studentId}`,
          {
            method: 'DELETE',
          }
        );
        if (response.ok) {
          alert('Xóa học sinh thành công!');
          fetchStudents();
        } else {
          alert('Có lỗi xảy ra khi xóa học sinh');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Có lỗi xảy ra khi xóa học sinh');
      }
    }
  };

  // Filter students based on search term and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const studentClass =
      student.classname || student.className || 'Không xác định';
    const matchesClass = !filterClass || studentClass === filterClass;

    return matchesSearch && matchesClass;
  });

  // Get unique classes for filter
  const uniqueClasses = [
    ...new Set(
      students.map(
        student => student.classname || student.className || 'Không xác định'
      )
    ),
  ].filter(Boolean);

  return (
    <div className="student-management-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>👨‍🎓 Quản Lý Học Sinh</h1>
          <p>Quản lý danh sách học sinh và import dữ liệu từ file Excel</p>
        </div>
        <div className="header-actions">
          <Button
            variant="contained"
            startIcon={<FileUpload />}
            onClick={() => setShowImportModal(true)}
            className="import-btn"
          >
            Import Excel
          </Button>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchStudents}
            className="refresh-btn"
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{students.length}</h3>
            <p>Tổng học sinh</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>{uniqueClasses.length}</h3>
            <p>Lớp học</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-content">
            <h3>{new Set(students.map(s => s.parent?.parentid)).size}</h3>
            <p>Phụ huynh</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <TextField
          placeholder="Tìm kiếm theo tên, mã học sinh, phụ huynh..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <TextField
          select
          label="Lọc theo lớp"
          value={filterClass}
          onChange={e => {
            setFilterClass(e.target.value);
          }}
          className="filter-select"
          fullWidth
          style={{
            minWidth: '200px',
            marginRight: '10px',
            zIndex: 1000,
          }}
          SelectProps={{
            style: { zIndex: 1000 },
          }}
        >
          <MenuItem value="">
            <em>Tất cả lớp ({students.length} học sinh)</em>
          </MenuItem>
          {uniqueClasses.map(className => (
            <MenuItem key={className} value={className}>
              {className} (
              {
                students.filter(s => (s.classname || s.className) === className)
                  .length
              }{' '}
              học sinh)
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Students Table */}
      <div className="table-section">
        {loading ? (
          <div className="loading-state">
            <CircularProgress />
            <p>Đang tải danh sách học sinh...</p>
          </div>
        ) : (
          <TableContainer component={Paper} className="students-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã HS</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Lớp</TableCell>
                  <TableCell>Phụ huynh</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map(student => (
                  <TableRow key={student.studentId} className="student-row">
                    <TableCell>
                      <div className="student-id">
                        <School className="student-icon" />
                        {student.studentCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="student-name">
                        <Person className="student-icon" />
                        {student.fullname}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          student.classname ||
                          student.className ||
                          'Không xác định'
                        }
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="parent-info">
                        <span className="parent-name">
                          {student.parent?.fullname || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="contact-info">
                        <Email className="contact-icon" />
                        {student.parent?.email || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="contact-info">
                        <Phone className="contact-icon" />
                        {student.parent?.phone || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip label="Hoạt động" color="success" size="small" />
                    </TableCell>
                    <TableCell>
                      <div className="action-buttons">
                        <IconButton
                          onClick={() => handleViewStudent(student)}
                          className="btn-view"
                          title="Xem chi tiết"
                          sx={{ color: '#2196f3' }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditStudent(student)}
                          className="btn-edit"
                          title="Chỉnh sửa"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteStudent(student)}
                          className="btn-delete"
                          title="Xóa"
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Edit Student Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        className="edit-modal"
      >
        <Dialog
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <div className="modal-header">
              <Edit className="modal-icon" />
              <span>Chỉnh Sửa Thông Tin Học Sinh</span>
            </div>
          </DialogTitle>
          <DialogContent>
            {editingStudent && (
              <EditStudentForm
                student={editingStudent}
                onUpdate={handleUpdateStudent}
                onCancel={() => setShowEditModal(false)}
                loading={editLoading}
                error={editError}
                success={editSuccess}
              />
            )}
          </DialogContent>
        </Dialog>
      </Modal>

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
                <Info sx={{ color: 'white', fontSize: '1.5rem' }} />
                Thông Tin Chi Tiết Học Sinh
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
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
                <Close sx={{ fontSize: '1.5rem' }} />
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
                  <Person sx={{ color: '#97a19b', fontSize: '1.8rem' }} />
                  {selectedStudent.fullname}
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
                  Mã học sinh: {selectedStudent.studentCode}
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
                    <Person sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
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
                        <Cake sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
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
                        {selectedStudent.dob}
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
                        <Wc sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
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
                        {selectedStudent.gender ? 'Nam' : 'Nữ'}
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
                        <Bloodtype
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
                        {selectedStudent.bloodType || 'N/A'}
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
                    <School sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
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
                        <Class sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
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
                        {selectedStudent.classname ||
                          selectedStudent.className ||
                          'N/A'}
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
                        <FamilyRestroom
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
                        {selectedStudent.parent?.fullname || 'N/A'}
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
                        <Phone sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
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
                        {selectedStudent.parent?.phone || 'N/A'}
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
                    <HealthAndSafety
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
                        <HealthAndSafety
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
                        Bình thường
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
                    <Email sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
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
                        <Email sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Email:
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
                        {selectedStudent.parent?.email || 'N/A'}
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
                        <Info sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
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
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {selectedStudent.parent?.address || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '15px',
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

      {/* Import Modal */}
      <Modal
        open={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportError('');
          setImportSuccess('');
          setImportFile(null);
        }}
        className="import-modal"
      >
        <Dialog
          open={showImportModal}
          onClose={() => {
            setShowImportModal(false);
            setImportError('');
            setImportSuccess('');
            setImportFile(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <div className="modal-header">
              <FileUpload className="modal-icon" />
              <span>Import Học Sinh từ File Excel</span>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="import-content">
              {importError && (
                <Alert severity="error" className="import-alert">
                  {importError}
                </Alert>
              )}
              {importSuccess && (
                <Alert severity="success" className="import-alert">
                  {importSuccess}
                </Alert>
              )}

              <div className="file-upload-section">
                <input
                  accept=".xlsx"
                  type="file"
                  onChange={handleFileChange}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <FileUpload className="upload-icon" />
                  <span>Chọn file Excel</span>
                  <small>Chỉ hỗ trợ: .xlsx</small>
                </label>
                {importFile && (
                  <div className="file-info">
                    <span>📄 {importFile.name}</span>
                    <span>📏 {(importFile.size / 1024).toFixed(2)} KB</span>
                  </div>
                )}
              </div>

              <div className="import-instructions">
                <h4>📋 Hướng dẫn:</h4>
                <ul>
                  <li>
                    File Excel phải có các cột: fullName, bloodType, className,
                    parentName, parentphone, birthDate, gender, healthStatus
                  </li>
                  <li>Dòng đầu tiên phải là header (tên cột)</li>
                  <li>Dữ liệu bắt đầu từ dòng thứ 2</li>
                  <li>
                    Không để trống các cột bắt buộc: fullName, className,
                    parentName, parentphone, birthDate
                  </li>
                  <li>Chỉ hỗ trợ file định dạng .xlsx</li>
                </ul>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowImportModal(false);
                setImportError('');
                setImportSuccess('');
                setImportFile(null);
              }}
              disabled={importLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleImportStudents}
              variant="contained"
              disabled={!importFile || importLoading}
              startIcon={
                importLoading ? <CircularProgress size={20} /> : <FileUpload />
              }
            >
              {importLoading ? 'Đang import...' : 'Import'}
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        className="success-modal"
      >
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="success-modal-header">
              <div className="success-icon">✅</div>
              <h3>Thành công!</h3>
            </div>
            <div className="success-modal-body">
              <p>{successMessage}</p>
            </div>
            <div className="success-modal-footer">
              <Button
                onClick={() => setShowSuccessModal(false)}
                variant="contained"
                className="success-ok-btn"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentManagement;

// Edit Student Form Component
const EditStudentForm = ({
  student,
  onUpdate,
  onCancel,
  loading,
  error,
  success,
}) => {
  const [formData, setFormData] = useState({
    studentCode: student?.studentCode || '',
    fullname: student?.fullname || '',
    age: student?.age || '',
    bloodType: student?.bloodType || '',
    gender: student?.gender || false,
    classid: student?.classid || 0,
    dob: student?.dob || '',
  });

  // Mock class data - in real app, this should come from API
  const classOptions = [
    { id: 1, name: 'Lớp Mầm A' },
    { id: 2, name: 'Lớp Mầm B' },
    { id: 3, name: 'Lớp Chồi A' },
    { id: 4, name: 'Lớp Chồi B' },
    { id: 5, name: 'Lớp Lá A' },
    { id: 6, name: 'Lớp Lá B' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px 0' }}>
      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" style={{ marginBottom: '20px' }}>
          {success}
        </Alert>
      )}

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* Student Code */}
        <TextField
          label="Mã học sinh"
          value={formData.studentCode}
          onChange={e => handleInputChange('studentCode', e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        {/* Full Name */}
        <TextField
          label="Họ và tên"
          value={formData.fullname}
          onChange={e => handleInputChange('fullname', e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        {/* Age */}
        <TextField
          label="Tuổi"
          type="number"
          value={formData.age}
          onChange={e => handleInputChange('age', e.target.value)}
          fullWidth
          required
          disabled={loading}
          inputProps={{ min: 0, max: 100 }}
        />

        {/* Blood Type */}
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Nhóm máu</InputLabel>
          <Select
            value={formData.bloodType}
            onChange={e => handleInputChange('bloodType', e.target.value)}
            label="Nhóm máu"
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </Select>
        </FormControl>

        {/* Gender - Radio Buttons */}
        <FormControl component="fieldset" disabled={loading}>
          <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
            Giới tính *
          </Typography>
          <RadioGroup
            row
            value={formData.gender ? 'male' : 'female'}
            onChange={e =>
              handleInputChange('gender', e.target.value === 'male')
            }
          >
            <FormControlLabel value="male" control={<Radio />} label="Nam" />
            <FormControlLabel value="female" control={<Radio />} label="Nữ" />
          </RadioGroup>
        </FormControl>

        {/* Class Name */}
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={formData.classid}
            onChange={e => handleInputChange('classid', e.target.value)}
            label="Lớp"
          >
            {classOptions.map(cls => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date of Birth */}
        <TextField
          label="Ngày sinh"
          type="date"
          value={formData.dob}
          onChange={e => handleInputChange('dob', e.target.value)}
          fullWidth
          required
          disabled={loading}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      {/* Parent Information (Read-only) */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Thông tin phụ huynh (Chỉ đọc)
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <TextField
            label="Tên phụ huynh"
            value={student?.parent?.fullname || 'N/A'}
            fullWidth
            disabled
          />
          <TextField
            label="Email"
            value={student?.parent?.email || 'N/A'}
            fullWidth
            disabled
          />
          <TextField
            label="Số điện thoại"
            value={student?.parent?.phone || 'N/A'}
            fullWidth
            disabled
          />
          <TextField
            label="Địa chỉ"
            value={student?.parent?.address || 'N/A'}
            fullWidth
            disabled
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onCancel} disabled={loading} variant="outlined">
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Edit />}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
};
