import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { healthCheckEventService } from '../../services/healthCheckEventService';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import '../../css/Manager/HealthCheckEventStudents.css';

const HealthCheckEventStudents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data for event ID:', eventId);
      
      // Fetch event details
      const eventDetails = await healthCheckEventService.getHealthCheckEventById(eventId);
      console.log('Event details:', eventDetails);
      setEventData(eventDetails);
      
      // Fetch students who participated in this event
      const recordsData = await healthCheckEventService.getStudentsByEventId(eventId);
      console.log('Health check records from API:', recordsData);
      
      // Fetch all students to get their information
      const allStudents = await studentService.getAllStudents();
      console.log('All students from API:', allStudents);
      
      if (recordsData && recordsData.length > 0) {
        // Combine health check records with student information
        const studentsList = recordsData.map(record => {
          const studentId = record.healthcheckrecord?.studentid;
          
          // Find student information from allStudents array
          const studentInfo = allStudents.find(student => student.studentId === studentId);
          
          return {
            studentId: studentId || 'N/A',
            fullname: studentInfo?.fullname || 'Chưa có tên',
            studentCode: studentInfo?.studentCode || 'Chưa có',
            classname: studentInfo?.classname || 'Chưa có',
            dob: studentInfo?.dob || null,
            age: studentInfo?.age || 'Chưa có',
            gender: studentInfo?.gender,
            bloodType: studentInfo?.bloodType || 'Chưa có',
            parent: studentInfo?.parent,
            // Health check data
            checkDate: record.healthcheckrecord?.checkdate,
            height: record.healthcheckrecord?.height,
            weight: record.healthcheckrecord?.weight,
            visionLeft: record.healthcheckrecord?.visionleft,
            visionRight: record.healthcheckrecord?.visionright,
            bloodPressure: record.healthcheckrecord?.bloodpressure,
            notes: record.healthcheckrecord?.notes,
            recordID: record.healthcheckrecord?.checkid
          };
        });
        
        console.log('Combined students list:', studentsList);
        setStudents(studentsList);
      } else {
        console.log('No students found for this event');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      setEventData(null);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedStudent(null);
  };

  const handleBack = () => {
    navigate('/manager/health-check-events');
  };

  const handleRefresh = () => {
    fetchEventData();
  };

  // Filter students based on search term and class
  const filteredStudents = students.filter(student => {
    const studentName = student.fullname || '';
    const studentCode = student.studentCode || '';
    const studentClass = student.classname || '';
    
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || studentClass === classFilter;
    
    return matchesSearch && matchesClass;
  });

  // Calculate statistics
  const stats = {
    total: students.length,
    hasHeight: students.filter(s => s.height && s.height !== 'Chưa có').length,
    hasWeight: students.filter(s => s.weight && s.weight !== 'Chưa có').length,
    hasVision: students.filter(s => (s.visionLeft && s.visionLeft !== 'Chưa có') || (s.visionRight && s.visionRight !== 'Chưa có')).length
  };

  // Get unique classes for filter
  const uniqueClasses = [...new Set(students.map(s => s.classname).filter(Boolean))];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!eventData) {
    return (
      <div className="health-check-event-students-container">
        <div className="error-message">
          <h2>Không tìm thấy sự kiện</h2>
          <p>Sự kiện khám sức khỏe không tồn tại hoặc đã bị xóa.</p>
          <button onClick={handleBack} className="back-button">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="health-check-event-students-container" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
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
             {eventData.healthcheckeventname || 'Sự kiện khám sức khỏe'}
           </p>
         </div>
         <div style={{ display: 'flex', gap: '12px' }}>
                     <button
             onClick={handleRefresh}
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
             <span style={{ fontSize: '1.2rem' }}>🔄</span>
             Tải lại
           </button>
           <button
             onClick={handleBack}
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
             <span style={{ fontSize: '1.2rem' }}>←</span>
             Quay lại
           </button>
         </div>
       </div>
      </div>

                   {/* Event Information */}
       {eventData && (
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
               <span style={{ color: '#73ad67', fontSize: '20px' }}>📅</span>
               <div>
                 <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500' }}>Ngày khám</div>
                 <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                   {eventData.eventdate ? new Date(eventData.eventdate).toLocaleDateString('vi-VN') : 'Chưa có'}
                 </div>
               </div>
             </div>
             <div style={{
               display: 'flex',
               alignItems: 'center',
               gap: '12px'
             }}>
               <span style={{ color: '#73ad67', fontSize: '20px' }}>📍</span>
               <div>
                 <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500' }}>Địa điểm</div>
                 <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                   {eventData.location || 'Chưa có'}
                 </div>
               </div>
             </div>
             <div style={{
               display: 'flex',
               alignItems: 'center',
               gap: '12px'
             }}>
               <span style={{ color: '#73ad67', fontSize: '20px' }}>👤</span>
               <div>
                 <div style={{ fontSize: '0.9rem', color: '#6c757d', fontWeight: '500' }}>Tổ chức</div>
                 <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2f5148' }}>
                   {eventData.createdby || 'Chưa có'}
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
             <span style={{ fontSize: '2.5rem' }}>👥</span>
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
               {stats.hasHeight}
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
               {stats.hasWeight}
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
               {stats.hasVision}
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

             {/* Search Filter */}
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
               onChange={(e) => setSearchTerm(e.target.value)}
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
               onChange={(e) => setClassFilter(e.target.value)}
               style={{
                 width: '100%',
                 padding: '12px 16px',
                 border: '1px solid #e9ecef',
                 borderRadius: '8px',
                 fontSize: '0.9rem',
                 backgroundColor: 'white',
                 outline: 'none',
                 transition: 'border-color 0.2s ease'
               }}
             >
               <option value="all">Tất cả lớp</option>
               {uniqueClasses.map(className => (
                 <option key={className} value={className}>{className}</option>
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
           <i className="fas fa-school" style={{ color: '#97a19b', fontSize: '1.5rem' }}></i>
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
                   <th style={{
                     padding: '16px 12px',
                     textAlign: 'left',
                     fontWeight: '600',
                     fontSize: '0.9rem',
                     borderBottom: '1px solid #e9ecef'
                   }}>Ngày khám</th>
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
                   <tr key={student.studentId} style={{
                     borderBottom: '1px solid #e9ecef',
                     transition: 'background-color 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = '#f8f9fa';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = 'white';
                   }}
                   >
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>{index + 1}</td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontWeight: '500',
                       fontSize: '0.9rem'
                     }}>{student.fullname || 'Chưa có tên'}</td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>{student.classname || 'Chưa có'}</td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>
                       {student.dob 
                         ? new Date(student.dob).toLocaleDateString('vi-VN')
                         : 'Chưa có'
                       }
                     </td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>
                       {student.checkDate 
                         ? new Date(student.checkDate).toLocaleDateString('vi-VN')
                         : 'Chưa có'
                       }
                     </td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>{student.height ? `${student.height} cm` : 'Chưa có'}</td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>{student.weight ? `${student.weight} kg` : 'Chưa có'}</td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>
                       {student.visionLeft && student.visionRight 
                         ? `${student.visionLeft}/${student.visionRight}`
                         : student.visionLeft || student.visionRight || 'Chưa có'
                       }
                     </td>
                     <td style={{
                       padding: '16px 12px',
                       color: '#495057',
                       fontSize: '0.9rem'
                     }}>{student.bloodPressure || 'Chưa có'}</td>
                     <td style={{ padding: '16px 12px' }}>
                       <button
                         onClick={() => handleViewDetail(student)}
                         title="Xem chi tiết"
                         style={{
                           background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                           color: 'white',
                           border: 'none',
                           padding: '10px 16px',
                           borderRadius: '8px',
                           cursor: 'pointer',
                           fontSize: '0.85rem',
                           fontWeight: '500',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '6px',
                           transition: 'all 0.2s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.transform = 'translateY(-1px)';
                           e.currentTarget.style.boxShadow = '0 4px 8px rgba(47, 81, 72, 0.3)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.transform = 'translateY(0)';
                           e.currentTarget.style.boxShadow = 'none';
                         }}
                       >
                         👁️ Chi tiết
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         ) : (
           <div style={{
             padding: '60px 20px',
             textAlign: 'center',
             color: '#6c757d',
             backgroundColor: '#f8f9fa',
             borderRadius: '12px',
             border: '1px solid #e9ecef'
           }}>
             <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}>📋</div>
             <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>Không có dữ liệu học sinh nào</p>
             <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>Hãy kiểm tra lại bộ lọc hoặc thử lại sau</p>
           </div>
         )}
       </div>

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <Modal
          isOpen={showDetailModal}
          onClose={handleCloseModal}
          title="Chi tiết thông tin học sinh"
          size="large"
        >
          <div className="student-detail-content">
            <div className="detail-section">
              <h3>Thông tin học sinh</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Họ và tên:</span>
                  <span className="value">
                    {selectedStudent.fullname || 'Không có'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Mã học sinh:</span>
                  <span className="value">
                    {selectedStudent.studentCode || 'Không có'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Lớp:</span>
                  <span className="value">
                    {selectedStudent.classname || 'Không có'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Ngày sinh:</span>
                  <span className="value">
                    {selectedStudent.dob 
                      ? new Date(selectedStudent.dob).toLocaleDateString('vi-VN')
                      : 'Không có'
                    }
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Tuổi:</span>
                  <span className="value">
                    {selectedStudent.age || 'Không có'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Giới tính:</span>
                  <span className="value">
                    {selectedStudent.gender ? 'Nam' : 'Nữ'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Nhóm máu:</span>
                  <span className="value">
                    {selectedStudent.bloodType || 'Không có'}
                  </span>
                </div>
              </div>
            </div>

            {selectedStudent.parent && (
              <div className="detail-section">
                <h3>Thông tin phụ huynh</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Họ và tên phụ huynh:</span>
                    <span className="value">
                      {selectedStudent.parent.fullname || 'Không có'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span className="value">
                      {selectedStudent.parent.email || 'Không có'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Số điện thoại:</span>
                    <span className="value">
                      {selectedStudent.parent.phone || 'Không có'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Địa chỉ:</span>
                    <span className="value">
                      {selectedStudent.parent.address || 'Không có'}
                    </span>
                  </div>
                </div>
              </div>
            )}

                         <div className="detail-section">
               <h3>Thông tin khám sức khỏe</h3>
               <div className="detail-grid">
                 <div className="detail-item">
                   <span className="label">Ngày khám:</span>
                   <span className="value">
                     {selectedStudent.checkDate 
                       ? new Date(selectedStudent.checkDate).toLocaleDateString('vi-VN')
                       : 'Chưa có'
                     }
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Chiều cao:</span>
                   <span className="value">
                     {selectedStudent.height ? `${selectedStudent.height} cm` : 'Chưa có'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Cân nặng:</span>
                   <span className="value">
                     {selectedStudent.weight ? `${selectedStudent.weight} kg` : 'Chưa có'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Thị lực trái:</span>
                   <span className="value">
                     {selectedStudent.visionLeft || 'Chưa có'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Thị lực phải:</span>
                   <span className="value">
                     {selectedStudent.visionRight || 'Chưa có'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Huyết áp:</span>
                   <span className="value">
                     {selectedStudent.bloodPressure || 'Chưa có'}
                   </span>
                 </div>
               </div>
               
               <div className="detail-item full-width">
                 <span className="label">Ghi chú:</span>
                 <div className="value description">
                   {selectedStudent.notes || 'Không có ghi chú'}
                 </div>
               </div>
             </div>

             <div className="detail-section">
               <h3>Thông tin sự kiện</h3>
               <div className="detail-grid">
                 <div className="detail-item">
                   <span className="label">Tên sự kiện:</span>
                   <span className="value">
                     {eventData.healthcheckeventname || 'Không có'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Ngày sự kiện:</span>
                   <span className="value">
                     {eventData.eventdate 
                       ? new Date(eventData.eventdate).toLocaleDateString('vi-VN')
                       : 'Không có'
                     }
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Địa điểm:</span>
                   <span className="value">
                     {eventData.location || 'Không có'}
                   </span>
                 </div>
                 <div className="detail-item">
                   <span className="label">Tổ chức:</span>
                   <span className="value">
                     {eventData.createdby || 'Không có'}
                   </span>
                 </div>
               </div>
               
               <div className="detail-item full-width">
                 <span className="label">Mô tả sự kiện:</span>
                 <div className="value description">
                   {eventData.healthcheckeventdescription || 'Không có mô tả'}
                 </div>
               </div>
             </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HealthCheckEventStudents; 