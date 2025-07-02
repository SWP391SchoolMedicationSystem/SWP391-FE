import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  MedicalServices,
  Vaccines,
  Assessment,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import { managerHealthService } from "../../services/managerService";
import "../../css/Manager/StudentHealthRecordDetail.css";

const StudentHealthRecordDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [healthRecord, setHealthRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthRecord();
  }, [studentId]);

  const fetchHealthRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await managerHealthService.getFullHealthRecord(studentId);
      setHealthRecord(data);
    } catch (err) {
      console.error("Error fetching health record:", err);
      setError("Không thể tải thông tin hồ sơ sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case true:
        return "Đã xác nhận";
      case false:
        return "Chưa xác nhận";
      default:
        return "Không xác định";
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
        <div>{error}</div>
      </div>
    );
  }

  if (!healthRecord) {
    return (
      <div className="error-state">
        <div>Không tìm thấy hồ sơ sức khỏe</div>
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
          <h2>
            <span className="material-icons">person</span>
            Thông tin chi tiết
          </h2>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Danh mục sức khỏe</div>
            <div className="detail-value">{healthRecord.healthCategory}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Ngày ghi nhận</div>
            <div className="detail-value">
              {new Date(healthRecord.healthRecordDate).toLocaleDateString(
                "vi-VN"
              )}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Nhân viên phụ trách</div>
            <div className="detail-value">{healthRecord.staffName}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Trạng thái xác nhận</div>
            <div className="detail-value">
              <span
                className={`status-badge ${
                  healthRecord.isConfirm ? "confirmed" : "pending"
                }`}
              >
                {healthRecord.isConfirm ? "Đã xác nhận" : "Chờ xác nhận"}
              </span>
            </div>
          </div>
          <div className="detail-item description">
            <div className="detail-label">Mô tả chi tiết</div>
            <div className="detail-value">
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
                        "vi-VN"
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
                    {new Date(check.checkdate).toLocaleDateString("vi-VN")}
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
    </div>
  );
};

export default StudentHealthRecordDetail;
