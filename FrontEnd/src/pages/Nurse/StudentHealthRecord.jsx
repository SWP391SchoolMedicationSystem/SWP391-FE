import React from "react";
import "../../css/Nurse/StudentHealthRecord.css";

function StudentHealthRecord() {
  return (
    <div className="health-record-container">
      <div className="health-record-header">
        <h1>📋 Hồ Sơ Sức Khỏe Học Sinh</h1>
        <p>Quản lý hồ sơ sức khỏe và theo dõi tình trạng y tế của học sinh</p>
      </div>

      <div className="placeholder-content">
        <div className="placeholder-card">
          <div className="placeholder-icon">🚧</div>
          <h2>Trang đang được phát triển</h2>
          <p>
            Chức năng quản lý hồ sơ sức khỏe học sinh đang trong quá trình xây
            dựng.
          </p>
          <p>Sẽ bao gồm các tính năng:</p>
          <ul className="feature-list">
            <li>📊 Theo dõi chỉ số sức khỏe (chiều cao, cân nặng, BMI)</li>
            <li>🩺 Lịch sử khám sức khỏe định kỳ</li>
            <li>💉 Lịch sử tiêm chủng</li>
            <li>🏥 Hồ sơ bệnh án</li>
            <li>💊 Lịch sử dùng thuốc</li>
            <li>🚨 Dị ứng và cảnh báo y tế</li>
            <li>📈 Biểu đồ phát triển thể chất</li>
            <li>📝 Ghi chú y tế từ y tá và bác sĩ</li>
          </ul>
          <div className="coming-soon">
            <span className="badge">Sắp ra mắt</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHealthRecord;
