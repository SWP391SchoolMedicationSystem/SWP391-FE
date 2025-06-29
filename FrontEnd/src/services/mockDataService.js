// Mock Data Service - For testing while waiting for backend API
// Remove this file when backend implements GetStudentsByParentId

export const mockParentStudentsService = {
  // Mock data for testing parent-student relationship
  getStudentsByParentId: (parentId) => {
    const mockStudents = {
      // Parent ID 1 (for testing user "levanhung")
      1: [
        {
          studentid: 1,
          fullname: "Lê Thị Bé An",
          age: 5,
          dob: "2019-03-15",
          gender: true, // true = Nam, false = Nữ (theo backend)
          classid: 1,
          parentid: 1,
          studentCode: "HS001",
          bloodType: "A+",
          isDeleted: false,
          className: "Lớp Mầm",
          listparent: [],
        },
        {
          studentid: 2,
          fullname: "Lê Văn Minh",
          age: 4,
          dob: "2020-07-22",
          gender: true,
          classid: 1,
          parentid: 1,
          studentCode: "HS002",
          bloodType: "O+",
          isDeleted: false,
          className: "Lớp Chồi",
          listparent: [],
        },
      ],
      // Parent ID 2 (for other tests)
      2: [
        {
          studentid: 3,
          fullname: "Nguyễn Thị Hoa",
          age: 6,
          dob: "2018-05-10",
          gender: false,
          classid: 2,
          parentid: 2,
          studentCode: "HS003",
          bloodType: "B+",
          isDeleted: false,
          className: "Lớp Lá",
          listparent: [],
        },
      ],
    };

    return mockStudents[parentId] || [];
  },

  // Mock health records for students
  getHealthRecordsByStudentId: (studentId) => {
    const mockHealthRecords = {
      1: [
        // For "Lê Thị Bé An"
        {
          id: 1,
          type: "Khám định kỳ",
          title: "Kiểm tra sức khỏe tổng quát",
          description: "Kiểm tra sức khỏe định kỳ cho trẻ mầm non",
          severity: "Bình thường",
          date: "2024-03-15",
          checkDate: "2024-03-15",
          doctor: "BS. Nguyễn Thị Lan",
          checkedBy: "BS. Nguyễn Thị Lan",
          medications: [],
          notes: "Trẻ phát triển bình thường, cần chú ý dinh dưỡng",
          status: "Hoàn thành",
          createdAt: "2024-03-15T08:00:00",
        },
        {
          id: 2,
          type: "Tiêm chủng",
          title: "Tiêm vaccine phòng bệnh",
          description: "Tiêm vaccine phòng bệnh theo lịch",
          severity: "Bình thường",
          date: "2024-02-20",
          checkDate: "2024-02-20",
          doctor: "Y tá Mai",
          checkedBy: "Y tá Mai",
          medications: ["Vaccine MMR"],
          notes: "Đã tiêm đủ vaccine theo độ tuổi",
          status: "Hoàn thành",
          createdAt: "2024-02-20T09:30:00",
        },
      ],
      2: [
        // For "Lê Văn Minh"
        {
          id: 3,
          type: "Khám định kỳ",
          title: "Kiểm tra tăng trưởng",
          description: "Kiểm tra chiều cao, cân nặng",
          severity: "Bình thường",
          date: "2024-03-10",
          checkDate: "2024-03-10",
          doctor: "BS. Trần Văn Nam",
          checkedBy: "BS. Trần Văn Nam",
          medications: [],
          notes: "Tăng trưởng tốt, khuyến khích vận động nhiều hơn",
          status: "Hoàn thành",
          createdAt: "2024-03-10T10:15:00",
        },
      ],
      3: [
        // For "Nguyễn Thị Hoa"
        {
          id: 4,
          type: "Dị ứng",
          title: "Dị ứng thức ăn",
          description: "Dị ứng với hải sản",
          severity: "Trung bình",
          date: "2024-01-25",
          checkDate: "2024-01-25",
          doctor: "BS. Lê Thị Hương",
          checkedBy: "BS. Lê Thị Hương",
          medications: ["Thuốc chống dị ứng"],
          notes: "Cần tránh các loại hải sản, mang theo thuốc dự phòng",
          status: "Đang theo dõi",
          createdAt: "2024-01-25T14:20:00",
        },
      ],
    };

    return mockHealthRecords[studentId] || [];
  },
};

// Export for use in components during testing
export default mockParentStudentsService;
