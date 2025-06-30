import React, { useState, useEffect } from "react";
import { nurseMedicationService } from "../../services/nurseService";
import "../../css/Nurse/MedicineManagement.css";

function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Form data for add/edit medicine
  const [formData, setFormData] = useState({
    medicinename: "",
    medicinecategoryid: 1,
    type: "",
    quantity: 0,
  });

  // Medicine categories mapping
  const medicineCategories = {
    1: "Thuốc giảm đau",
    2: "Kháng sinh",
    3: "Thuốc tiêu hóa",
    4: "Thuốc ho",
    5: "Thuốc tiểu đường",
    6: "Vitamin & Khoáng chất",
    7: "Thuốc hô hấp",
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
      setError("Không thể tải danh sách thuốc. Vui lòng thử lại.");
      console.error("Error loading medicines:", err);
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
      setError("Không thể tìm kiếm thuốc. Vui lòng thử lại.");
      console.error("Error searching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "medicinecategoryid"
          ? Number(value)
          : value,
    }));
  };

  // Add new medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await nurseMedicationService.addMedicine(formData);
      setShowAddModal(false);
      setFormData({
        medicinename: "",
        medicinecategoryid: 1,
        type: "",
        quantity: 0,
      });
      loadMedicines();
      alert("Thêm thuốc thành công!");
    } catch (err) {
      alert("Không thể thêm thuốc. Vui lòng thử lại.");
      console.error("Error adding medicine:", err);
    }
  };

  // Edit medicine
  const handleEditMedicine = async (e) => {
    e.preventDefault();
    try {
      await nurseMedicationService.updateMedicine(
        selectedMedicine.id,
        formData
      );
      setShowEditModal(false);
      setSelectedMedicine(null);
      setFormData({
        medicinename: "",
        medicinecategoryid: 1,
        type: "",
        quantity: 0,
      });
      loadMedicines();
      alert("Cập nhật thuốc thành công!");
    } catch (err) {
      alert("Không thể cập nhật thuốc. Vui lòng thử lại.");
      console.error("Error updating medicine:", err);
    }
  };

  // Delete medicine
  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thuốc này?")) {
      return;
    }

    try {
      await nurseMedicationService.deleteMedicine(medicineId);
      loadMedicines();
      alert("Xóa thuốc thành công!");
    } catch (err) {
      alert("Không thể xóa thuốc. Vui lòng thử lại.");
      console.error("Error deleting medicine:", err);
    }
  };

  // Open edit modal
  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      medicinename: medicine.originalData.medicinename,
      medicinecategoryid: medicine.originalData.medicinecategoryid,
      type: medicine.originalData.type,
      quantity: medicine.originalData.quantity,
    });
    setShowEditModal(true);
  };

  // Get quantity status
  const getQuantityStatus = (quantity) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity < 100) return "low-stock";
    return "in-stock";
  };

  // Statistics
  const stats = {
    total: medicines.length,
    inStock: medicines.filter((m) => m.quantity > 0).length,
    lowStock: medicines.filter((m) => m.quantity > 0 && m.quantity < 100)
      .length,
    outOfStock: medicines.filter((m) => m.quantity === 0).length,
  };

  if (loading) {
    return (
      <div className="medicine-management-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="medicine-management-container">
      <div className="medicine-management-header">
        <h1>💊 Quản Lý Thuốc</h1>
        <p>Quản lý kho thuốc của trường</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng số thuốc</p>
          </div>
        </div>
        <div className="stat-card in-stock">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.inStock}</h3>
            <p>Còn hàng</p>
          </div>
        </div>
        <div className="stat-card low-stock">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.lowStock}</h3>
            <p>Sắp hết</p>
          </div>
        </div>
        <div className="stat-card out-of-stock">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.outOfStock}</h3>
            <p>Hết hàng</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Tìm kiếm thuốc theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            🔍 Tìm kiếm
          </button>
          <button className="refresh-btn" onClick={loadMedicines}>
            🔄 Làm mới
          </button>
        </div>

        <button
          className="add-medicine-btn"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Thêm thuốc mới
        </button>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Table */}
      <div className="table-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thuốc</th>
              <th>Danh mục</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Người tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td className="medicine-id">{medicine.id}</td>
                <td>
                  <div className="medicine-name">
                    <strong>{medicine.medicineName}</strong>
                  </div>
                </td>
                <td>{medicineCategories[medicine.categoryId] || "Khác"}</td>
                <td className="medicine-type">{medicine.type}</td>
                <td>
                  <span className="quantity">{medicine.quantity}</span>
                </td>
                <td>
                  <span
                    className={`status-badge ${getQuantityStatus(
                      medicine.quantity
                    )}`}
                  >
                    {medicine.quantity === 0
                      ? "Hết hàng"
                      : medicine.quantity < 100
                      ? "Sắp hết"
                      : "Còn hàng"}
                  </span>
                </td>
                <td>{medicine.createdAt}</td>
                <td>{medicine.createdBy}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(medicine)}
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {medicines.length === 0 && !loading && (
          <div className="no-data">
            <p>Không tìm thấy thuốc nào</p>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    Thêm thuốc
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    Cập nhật thuốc
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
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
