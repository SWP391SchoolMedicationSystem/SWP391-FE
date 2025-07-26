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
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FileUpload,
  Download,
  Refresh,
  School,
  Person,
  Email,
  Phone,
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

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api-schoolhealth.purintech.id.vn/api/Student/getAll'
      );
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
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
        'https://api-schoolhealth.purintech.id.vn/api/Student/student',
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

  const handleViewStudent = student => {
    navigate(`/admin/student-detail/${student.id}`);
  };

  const handleEditStudent = student => {
    navigate(`/admin/edit-student/${student.id}`);
  };

  const handleDeleteStudent = async student => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa học sinh ${student.studentName}?`
      )
    ) {
      try {
        const response = await fetch(
          `https://api-schoolhealth.purintech.id.vn/api/Student/delete/${student.id}`,
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
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || student.className === filterClass;
    return matchesSearch && matchesClass;
  });

  // Get unique classes for filter
  const uniqueClasses = [
    ...new Set(students.map(student => student.className)),
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
            <h3>{new Set(students.map(s => s.parentId)).size}</h3>
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
          onChange={e => setFilterClass(e.target.value)}
          className="filter-select"
        >
          <option value="">Tất cả lớp</option>
          {uniqueClasses.map(className => (
            <option key={className} value={className}>
              {className}
            </option>
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
                  <TableRow key={student.id} className="student-row">
                    <TableCell>
                      <div className="student-id">
                        <School className="student-icon" />
                        {student.studentId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="student-name">
                        <Person className="student-icon" />
                        {student.studentName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.className}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="parent-info">
                        <span className="parent-name">
                          {student.parentName}
                        </span>
                        <small className="parent-id">
                          ID: {student.parentId}
                        </small>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="contact-info">
                        <Email className="contact-icon" />
                        {student.email || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="contact-info">
                        <Phone className="contact-icon" />
                        {student.phoneNumber || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          student.isActive ? 'Hoạt động' : 'Không hoạt động'
                        }
                        color={student.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="action-buttons">
                        <IconButton
                          onClick={() => handleViewStudent(student)}
                          className="btn-view"
                          title="Xem chi tiết"
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
                    File Excel phải có các cột: Mã HS, Họ tên, Lớp, Phụ huynh,
                    Email, SĐT
                  </li>
                  <li>Dòng đầu tiên phải là header (tên cột)</li>
                  <li>Dữ liệu bắt đầu từ dòng thứ 2</li>
                  <li>Không để trống các cột bắt buộc</li>
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
