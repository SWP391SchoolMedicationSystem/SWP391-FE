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
      // Validate file type
      if (
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      ) {
        setImportFile(file);
        setImportError('');
      } else {
        setImportError('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        setImportFile(null);
      }
    }
  };

  const handleImportStudents = async () => {
    if (!importFile) {
      setImportError('Vui lòng chọn file để import');
      return;
    }

    setImportLoading(true);
    setImportError('');
    setImportSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/Student/ImportStudents',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setImportSuccess(
          `Import thành công! Đã thêm ${result.length || 0} học sinh mới.`
        );
        setImportFile(null);
        setShowImportModal(false);
        // Refresh student list
        fetchStudents();
      } else {
        const errorData = await response.json();
        setImportError(errorData.message || 'Có lỗi xảy ra khi import file');
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportError('Có lỗi xảy ra khi import file. Vui lòng thử lại.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowEditModal(true);
    setEditError('');
    setEditSuccess('');
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleUpdateStudent = async (updatedData) => {
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
        updatedAt: new Date().toISOString().split('T')[0]
      };

      console.log('📤 Update student request:', requestData);

      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/Student/UpdateStudent',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          body: JSON.stringify(requestData)
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
        setEditError(errorData.message || 'Có lỗi xảy ra khi cập nhật học sinh');
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
      window.confirm(
        `Bạn có chắc chắn muốn xóa học sinh ${student.fullname}?`
      )
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

  const handleDownloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        'Mã HS': 'HS001',
        'Họ và tên': 'Nguyễn Trần Minh Anh',
        'Lớp': 'Lớp Chồi A',
        'Phụ huynh': 'Nguyễn Văn An',
        'Email': 'phuhuynh.van.a@gmail.com',
        'Số điện thoại': '0123456789',
        'Ngày sinh': '2018-05-20',
        'Địa chỉ': '123 Đường ABC, Phường Cầu Ông Lãnh, Quận 1, TP.HCM'
      },
      {
        'Mã HS': 'HS002',
        'Họ và tên': 'Trần Thị Bình',
        'Lớp': 'Lớp Chồi B',
        'Phụ huynh': 'Trần Văn Bình',
        'Email': 'phuhuynh.van.b@gmail.com',
        'Số điện thoại': '0987654321',
        'Ngày sinh': '2018-03-15',
        'Địa chỉ': '456 Đường DEF, Phường Bến Nghé, Quận 1, TP.HCM'
      }
    ];

    // Convert to CSV format
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_hoc_sinh.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students based on search term and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const studentClass = student.classname || student.className || 'Không xác định';
    const matchesClass = !filterClass || studentClass === filterClass;
    
    return matchesSearch && matchesClass;
  });

  // Get unique classes for filter
  const uniqueClasses = [
    ...new Set(students.map(student => student.classname || student.className || 'Không xác định')),
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
            startIcon={<Download />}
            onClick={handleDownloadTemplate}
            className="template-btn"
          >
            Tải Template
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Lọc theo lớp"
          value={filterClass}
          onChange={(e) => {
            setFilterClass(e.target.value);
          }}
          className="filter-select"
          fullWidth
          style={{ 
            minWidth: '200px',
            marginRight: '10px',
            zIndex: 1000
          }}
          SelectProps={{
            style: { zIndex: 1000 }
          }}
        >
          <MenuItem value="">
            <em>Tất cả lớp ({students.length} học sinh)</em>
          </MenuItem>
          {uniqueClasses.map(className => (
            <MenuItem key={className} value={className}>
              {className} ({students.filter(s => (s.classname || s.className) === className).length} học sinh)
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
                        label={student.classname || student.className || 'Không xác định'}
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
                      <Chip
                        label="Hoạt động"
                        color="success"
                        size="small"
                      />
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
      <Modal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        className="detail-modal"
      >
        <Dialog
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <div className="modal-header">
              <Person className="modal-icon" />
              <span>Thông Tin Chi Tiết Học Sinh</span>
            </div>
          </DialogTitle>
          <DialogContent>
            {selectedStudent && (
              <div className="student-detail-content">
                <div className="detail-section">
                  <Typography variant="h6" className="section-title">
                    <School />
                    Thông tin học sinh
                  </Typography>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Mã học sinh:</label>
                      <span>{selectedStudent.studentCode}</span>
                    </div>
                    <div className="detail-item">
                      <label>Họ và tên:</label>
                      <span>{selectedStudent.fullname}</span>
                    </div>
                    <div className="detail-item">
                      <label>Tuổi:</label>
                      <span>{selectedStudent.age}</span>
                    </div>
                    <div className="detail-item">
                      <label>Giới tính:</label>
                      <span>{selectedStudent.gender ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Ngày sinh:</label>
                      <span>{selectedStudent.dob}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nhóm máu:</label>
                      <span>{selectedStudent.bloodType || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Lớp:</label>
                      <span>{selectedStudent.classname || selectedStudent.className || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <Typography variant="h6" className="section-title">
                    <Person />
                    Thông tin phụ huynh
                  </Typography>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Tên phụ huynh:</label>
                      <span>{selectedStudent.parent?.fullname || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedStudent.parent?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Số điện thoại:</label>
                      <span>{selectedStudent.parent?.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Địa chỉ:</label>
                      <span>{selectedStudent.parent?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowDetailModal(false)}
              variant="outlined"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>

      {/* Import Modal */}
      <Modal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        className="import-modal"
      >
        <Dialog
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
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
                  accept=".xlsx,.xls"
                  type="file"
                  onChange={handleFileChange}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <FileUpload className="upload-icon" />
                  <span>Chọn file Excel</span>
                  <small>Hỗ trợ: .xlsx, .xls</small>
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
                    File Excel phải có các cột: Mã HS, Họ và tên, Lớp, Phụ huynh,
                    Email, Số điện thoại, Ngày sinh, Địa chỉ
                  </li>
                  <li>Dòng đầu tiên phải là header (tên cột)</li>
                  <li>Dữ liệu bắt đầu từ dòng thứ 2</li>
                  <li>Không để trống các cột bắt buộc: Mã HS, Họ và tên, Lớp</li>
                  <li>Tải template mẫu để xem định dạng chuẩn</li>
                </ul>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowImportModal(false)}
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
    </div>
  );
};

export default StudentManagement;

// Edit Student Form Component
const EditStudentForm = ({ student, onUpdate, onCancel, loading, error, success }) => {
  const [formData, setFormData] = useState({
    studentCode: student?.studentCode || '',
    fullname: student?.fullname || '',
    age: student?.age || '',
    bloodType: student?.bloodType || '',
    gender: student?.gender || false,
    classid: student?.classid || 0,
    dob: student?.dob || ''
  });

  // Mock class data - in real app, this should come from API
  const classOptions = [
    { id: 1, name: 'Lớp Mầm A' },
    { id: 2, name: 'Lớp Mầm B' },
    { id: 3, name: 'Lớp Chồi A' },
    { id: 4, name: 'Lớp Chồi B' },
    { id: 5, name: 'Lớp Lá A' },
    { id: 6, name: 'Lớp Lá B' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Student Code */}
        <TextField
          label="Mã học sinh"
          value={formData.studentCode}
          onChange={(e) => handleInputChange('studentCode', e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        {/* Full Name */}
        <TextField
          label="Họ và tên"
          value={formData.fullname}
          onChange={(e) => handleInputChange('fullname', e.target.value)}
          fullWidth
          required
          disabled={loading}
        />

        {/* Age */}
        <TextField
          label="Tuổi"
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
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
            onChange={(e) => handleInputChange('bloodType', e.target.value)}
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
            onChange={(e) => handleInputChange('gender', e.target.value === 'male')}
          >
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="Nam"
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Nữ"
            />
          </RadioGroup>
        </FormControl>

        {/* Class Name */}
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={formData.classid}
            onChange={(e) => handleInputChange('classid', e.target.value)}
            label="Lớp"
          >
            {classOptions.map((cls) => (
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
          onChange={(e) => handleInputChange('dob', e.target.value)}
          fullWidth
          required
          disabled={loading}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      {/* Parent Information (Read-only) */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Thông tin phụ huynh (Chỉ đọc)
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
        >
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
