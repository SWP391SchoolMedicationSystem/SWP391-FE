import React, { useState, useEffect } from 'react';
import { nurseMedicationService } from '../../services/nurseService';
import '../../css/Nurse/MedicineManagement.css';
import MedicationIcon from '@mui/icons-material/Medication';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Form data for add/edit medicine
  const [formData, setFormData] = useState({
    medicinename: '',
    medicinecategoryid: 1,
    type: '',
    quantity: 0,
  });

  // Medicine categories mapping
  const medicineCategories = {
    1: 'Thuốc giảm đau',
    2: 'Kháng sinh',
    3: 'Thuốc tiêu hóa',
    4: 'Thuốc ho',
    5: 'Thuốc tiểu đường',
    6: 'Vitamin & Khoáng chất',
    7: 'Thuốc hô hấp',
  };

  // Load medicines on component mount
  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await nurseMedicationService.getAllMedicines();
      setMedicines(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách thuốc. Vui lòng thử lại.');
      console.error('Error loading medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search medicines
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMedicines();
      return;
    }

    try {
      setLoading(true);
      const data = await nurseMedicationService.searchMedicinesByName(
        searchTerm
      );
      setMedicines(data);
      setError(null);
    } catch (err) {
      setError('Không thể tìm kiếm thuốc. Vui lòng thử lại.');
      console.error('Error searching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'medicinecategoryid'
          ? Number(value)
          : value,
    }));
  };

  // Add new medicine
  const handleAddMedicine = async e => {
    e.preventDefault();
    try {
      await nurseMedicationService.addMedicine(formData);
      setShowAddModal(false);
      setFormData({
        medicinename: '',
        medicinecategoryid: 1,
        type: '',
        quantity: 0,
      });
      loadMedicines();
      alert('Thêm thuốc thành công!');
    } catch (err) {
      alert('Không thể thêm thuốc. Vui lòng thử lại.');
      console.error('Error adding medicine:', err);
    }
  };

  // Edit medicine
  const handleEditMedicine = async e => {
    e.preventDefault();
    try {
      await nurseMedicationService.updateMedicine(
        selectedMedicine.id,
        formData
      );
      setShowEditModal(false);
      setSelectedMedicine(null);
      setFormData({
        medicinename: '',
        medicinecategoryid: 1,
        type: '',
        quantity: 0,
      });
      loadMedicines();
      alert('Cập nhật thuốc thành công!');
    } catch (err) {
      alert('Không thể cập nhật thuốc. Vui lòng thử lại.');
      console.error('Error updating medicine:', err);
    }
  };

  // Delete medicine
  const handleDeleteMedicine = async medicineId => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      return;
    }

    try {
      await nurseMedicationService.deleteMedicine(medicineId);
      loadMedicines();
      alert('Xóa thuốc thành công!');
    } catch (err) {
      alert('Không thể xóa thuốc. Vui lòng thử lại.');
      console.error('Error deleting medicine:', err);
    }
  };

  // Open edit modal
  const openEditModal = medicine => {
    setSelectedMedicine(medicine);
    setFormData({
      medicinename: medicine.originalData.medicinename,
      medicinecategoryid: medicine.originalData.medicinecategoryid,
      type: medicine.originalData.type,
      quantity: medicine.originalData.quantity,
    });
    setShowEditModal(true);
  };

  // Statistics (currently not displayed)
  // const stats = {
  //   total: medicines.length,
  //   inStock: medicines.filter(m => m.quantity > 0).length,
  //   lowStock: medicines.filter(m => m.quantity > 0 && m.quantity < 100).length,
  //   outOfStock: medicines.filter(m => m.quantity === 0).length,
  // };

  if (loading) {
    return (
      <div className="medicine-management-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="medicine-management-container">
      {/* Modern Header with Design System */}
      <div className="page-header">
        <div className="header-content">
          <h1
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: 0,
              color: '#ffffff',
              fontFamily: 'Satoshi, sans-serif',
            }}
          >
            <MedicationIcon
              sx={{
                color: '#ffffff',
                fontSize: '3rem',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
            />
            Quản lý thuốc
          </h1>
          <p
            style={{
              margin: '10px 0 0 0',
              fontSize: '1.1rem',
              color: '#ffffff',
              opacity: 0.9,
              fontFamily: 'Satoshi, sans-serif',
            }}
          >
            Theo dõi và quản lý kho thuốc trường học
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 500,
              fontFamily: 'Satoshi, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            <AddIcon sx={{ fontSize: '1.2rem' }} />
            Thêm thuốc mới
          </button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="filters-section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: '1',
              maxWidth: 'none',
              width: '100%',
            }}
          >
            <SearchIcon
              sx={{
                color: '#97a19b',
                fontSize: '1.5rem',
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm thuốc theo tên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              style={{
                paddingLeft: '50px',
                fontFamily: 'Satoshi, sans-serif',
                width: '100%',
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Satoshi, sans-serif',
              whiteSpace: 'nowrap',
              padding: '10px 16px',
              fontSize: '0.9rem',
              minWidth: '80px',
              maxWidth: '120px',
              background: '#2f5148',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
          >
            <SearchIcon sx={{ fontSize: '1.1rem' }} />
            Tìm
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

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
            <MedicationIcon sx={{ fontSize: '1.5rem' }} />
            Danh sách thuốc ({medicines.length})
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
                  Tên thuốc
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
                  Danh mục
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
                  Loại
                </th>
                <th
                  style={{
                    padding: '15px 20px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#2f5148',
                    borderRight: '1px solid #e9ecef',
                  }}
                >
                  Số lượng
                </th>
                <th
                  style={{
                    padding: '15px 20px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#2f5148',
                    borderRight: '1px solid #e9ecef',
                  }}
                >
                  Trạng thái
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
                  Ngày tạo
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
                  Người tạo
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
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr
                  key={medicine.id}
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
                      <div>
                        <div
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#2f5148',
                            marginBottom: '2px',
                          }}
                        >
                          {medicine.medicineName}
                        </div>
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
                    {medicineCategories[medicine.categoryId] || 'Khác'}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {medicine.type}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color:
                          medicine.quantity === 0
                            ? '#dc3545'
                            : medicine.quantity < 100
                            ? '#ffc107'
                            : '#28a745',
                        background:
                          medicine.quantity === 0
                            ? 'rgba(220, 53, 69, 0.1)'
                            : medicine.quantity < 100
                            ? 'rgba(255, 193, 7, 0.1)'
                            : 'rgba(40, 167, 69, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: `1px solid ${
                          medicine.quantity === 0
                            ? '#dc3545'
                            : medicine.quantity < 100
                            ? '#ffc107'
                            : '#28a745'
                        }`,
                      }}
                    >
                      {medicine.quantity}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor:
                          medicine.quantity === 0
                            ? 'rgba(220, 53, 69, 0.1)'
                            : medicine.quantity < 100
                            ? 'rgba(255, 193, 7, 0.1)'
                            : 'rgba(40, 167, 69, 0.1)',
                        color:
                          medicine.quantity === 0
                            ? '#dc3545'
                            : medicine.quantity < 100
                            ? '#ffc107'
                            : '#28a745',
                        border: `1px solid ${
                          medicine.quantity === 0
                            ? '#dc3545'
                            : medicine.quantity < 100
                            ? '#ffc107'
                            : '#28a745'
                        }`,
                      }}
                    >
                      {medicine.quantity === 0
                        ? 'Hết hàng'
                        : medicine.quantity < 100
                        ? 'Sắp hết'
                        : 'Còn hàng'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {medicine.createdAt}
                  </td>
                  <td
                    style={{
                      padding: '15px 20px',
                      borderRight: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      color: '#97a19b',
                    }}
                  >
                    {medicine.createdBy}
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
                        onClick={() => openEditModal(medicine)}
                        title="Chỉnh sửa"
                        style={{
                          background:
                            'linear-gradient(135deg, #73ad67 0%, #85b06d 100%)',
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
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(115, 173, 103, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine.id)}
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
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {medicines.length === 0 && !loading && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#97a19b',
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '20px',
                opacity: 0.5,
              }}
            >
              💊
            </div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#2f5148',
                margin: '0 0 10px 0',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Không tìm thấy thuốc nào
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#97a19b',
                margin: 0,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Hãy thêm thuốc mới hoặc thay đổi từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm thuốc mới</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleAddMedicine} className="medicine-form">
                <div className="form-group">
                  <label>Tên thuốc *</label>
                  <input
                    type="text"
                    name="medicinename"
                    value={formData.medicinename}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    name="medicinecategoryid"
                    value={formData.medicinecategoryid}
                    onChange={handleInputChange}
                    required
                  >
                    {Object.entries(medicineCategories).map(([id, name]) => (
                      <option key={id} value={Number(id)}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Loại thuốc *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại thuốc</option>
                    <option value="Tablet">Viên nén</option>
                    <option value="Capsule">Viên nang</option>
                    <option value="Syrup">Siro</option>
                    <option value="Inhaler">Thuốc xịt</option>
                    <option value="Injection">Thuốc tiêm</option>
                    <option value="Cream">Kem bôi</option>
                    <option value="Drops">Thuốc nhỏ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'flex-end',
                    marginTop: '25px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e9ecef',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      background:
                        'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(108, 117, 125, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      background:
                        'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(47, 81, 72, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    💊 Thêm thuốc
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && selectedMedicine && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chỉnh sửa thuốc</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleEditMedicine} className="medicine-form">
                <div className="form-group">
                  <label>Tên thuốc *</label>
                  <input
                    type="text"
                    name="medicinename"
                    value={formData.medicinename}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    name="medicinecategoryid"
                    value={formData.medicinecategoryid}
                    onChange={handleInputChange}
                    required
                  >
                    {Object.entries(medicineCategories).map(([id, name]) => (
                      <option key={id} value={Number(id)}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Loại thuốc *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại thuốc</option>
                    <option value="Tablet">Viên nén</option>
                    <option value="Capsule">Viên nang</option>
                    <option value="Syrup">Siro</option>
                    <option value="Inhaler">Thuốc xịt</option>
                    <option value="Injection">Thuốc tiêm</option>
                    <option value="Cream">Kem bôi</option>
                    <option value="Drops">Thuốc nhỏ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'flex-end',
                    marginTop: '25px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e9ecef',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      background:
                        'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(108, 117, 125, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      background:
                        'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(47, 81, 72, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    ✏️ Cập nhật thuốc
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

export default MedicineManagement;
