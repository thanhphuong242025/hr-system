import React, { useState, useEffect } from 'react';
import { categories } from './questions';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const API_URL = '/api';

// CEO credentials (simple hardcoded auth)
const CEO_ACCOUNTS = [
  { username: 'it@123', password: 'it@123' }
];

function App() {
  const [view, setView] = useState('login'); // login, ceologin, employee, ceolist, ceoreview
  const [currentUser, setCurrentUser] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [currentRole, setCurrentRole] = useState('');

  // CEO login fields
  const [ceoUsername, setCeoUsername] = useState('it@123');
  const [ceoPassword, setCeoPassword] = useState('it@123');
  const [ceoLoginError, setCeoLoginError] = useState('');

  const [scores, setScores] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync evaluations for CEO
  useEffect(() => {
    if (view === 'ceolist') {
      fetch(`${API_URL}/evaluations`)
        .then(res => res.json())
        .then(data => setEvaluations(data));
    }
  }, [view]);

  const handleLogin = (role) => {
    setCurrentRole(role);
    if (role === 'employee') setView('employee');
    if (role === 'ceo') setView('ceolist');
  };

  const handleCeoLogin = () => {
    const match = CEO_ACCOUNTS.find(
      acc => acc.username === ceoUsername && acc.password === ceoPassword
    );
    if (match) {
      setCeoLoginError('');
      handleLogin('ceo');
    } else {
      setCeoLoginError('Sai tài khoản hoặc mật khẩu!');
    }
  };

  const handleScoreChange = (catIdx, itemIdx, val, type = 'scores') => {
    if (val !== '') {
      const num = Number(val);
      if (isNaN(num) || num < 0 || num > 5) {
        alert('Chỉ được nhập số từ 0 đến 5!');
        return;
      }
    }
    const key = `${catIdx}_${itemIdx}`;
    if (type === 'scores') setScores({ ...scores, [key]: val });
    else if (type === 'ceo_scores') {
      setSelectedEval({
        ...selectedEval,
        ceo_scores: { ...selectedEval.ceo_scores, [key]: val }
      });
    }
  };

  const submitEmployee = async () => {
    if (!currentUser || !currentDepartment) return alert('Vui lòng nhập đầy đủ họ tên và khoa phòng!');

    let isMissingScore = false;
    let hasInvalidScore = false;
    categories.forEach((cat, catIdx) => {
      cat.items.forEach((_, itemIdx) => {
        const key = `${catIdx}_${itemIdx}`;
        const val = scores[key];
        if (val === undefined || val === null || val === '') {
          isMissingScore = true;
        } else if (Number(val) < 0 || Number(val) > 5) {
          hasInvalidScore = true;
        }
      });
    });

    if (isMissingScore || hasInvalidScore) {
      return alert('Vui lòng chấm điểm đầy đủ cho TẤT CẢ các tiêu chí (từ 0 đến 5)! Không được bỏ trống hoặc nhập sai phạm vi.');
    }

    await fetch(`${API_URL}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_name: currentUser,
        employee_role: currentDepartment,
        scores
      })
    });
    alert('Đã gửi thành công!');
    setView('login');
  };

  const exportToExcelFormat = async (dataList, filename) => {
    const workbook = new ExcelJS.Workbook();

    dataList.forEach((ev, idx) => {
      let sheetName = ev.employee_name.replace(/[\\/*?:[\]]/g, '').substring(0, 30) || 'Sheet';
      if (dataList.length > 1) sheetName = `${idx + 1}. ${sheetName}`;
      const sheet = workbook.addWorksheet(sheetName);

      sheet.columns = [
        { width: 5 },
        { width: 70 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 15 }
      ];

      let submittedAt = ev.submitted_at ? new Date(ev.submitted_at).toLocaleDateString('vi-VN') : '';

      sheet.mergeCells('A1:F1');
      sheet.getCell('A1').value = 'PHIẾU ĐÁNH GIÁ NĂNG LỰC NHÂN SỰ CÁ NHÂN';
      sheet.getCell('A1').font = { bold: true, size: 14 };
      sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

      sheet.mergeCells('A2:F2');
      sheet.getCell('A2').value = 'NĂM 2025';
      sheet.getCell('A2').font = { bold: true, size: 12 };
      sheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

      sheet.mergeCells('A3:B3');
      sheet.getCell('A3').value = `HỌ TÊN: ${ev.employee_name}`;
      sheet.getCell('A3').font = { bold: true };
      
      sheet.mergeCells('C3:D3');
      sheet.getCell('C3').value = `VỊ TRÍ CÔNG VIỆC: ${ev.employee_role}`;
      sheet.getCell('C3').font = { bold: true };

      sheet.mergeCells('E3:F3');
      sheet.getCell('E3').value = `NGÀY ĐÁNH GIÁ: ${submittedAt}`;
      sheet.getCell('E3').font = { bold: true };

      const headerRow = sheet.addRow(['TT', 'CÁC NỘI DUNG ĐÁNH GIÁ', 'TỰ CHẤM', 'CEO', 'HỘI ĐỒNG', 'GHI CHÚ']);
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      });

      categories.forEach((cat, catIdx) => {
        const catRow = sheet.addRow(['', cat.title, '', '', '', '']);
        sheet.mergeCells(`B${catRow.number}:F${catRow.number}`);
        catRow.getCell(2).font = { bold: true };
        catRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
        catRow.eachCell(cell => {
          cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
        });

        cat.items.forEach((item, itemIdx) => {
          const key = `${catIdx}_${itemIdx}`;
          const nvScore = ev.scores && ev.scores[key] !== undefined ? ev.scores[key] : '';
          const ceoScore = ev.ceo_scores && ev.ceo_scores[key] !== undefined ? ev.ceo_scores[key] : '';
          const dataRow = sheet.addRow([itemIdx + 1, item, nvScore, ceoScore, '', '']);
          
          dataRow.getCell(1).alignment = { horizontal: 'center', vertical: 'top' };
          dataRow.getCell(2).alignment = { wrapText: true, vertical: 'top' };
          dataRow.getCell(3).alignment = { horizontal: 'center', vertical: 'top' };
          dataRow.getCell(4).alignment = { horizontal: 'center', vertical: 'top' };
          
          dataRow.eachCell(cell => {
            cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
          });
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename.replace('.xls', '.xlsx').replace('.csv', '.xlsx'));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.score-input'));
      const index = inputs.indexOf(e.target);
      if (index > -1) {
        for (let i = index + 1; i < inputs.length; i++) {
          if (!inputs[i].disabled) {
            inputs[i].focus();
            break;
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.score-input'));
      const index = inputs.indexOf(e.target);
      if (index > 0) {
        for (let i = index - 1; i >= 0; i--) {
          if (!inputs[i].disabled) {
            inputs[i].focus();
            break;
          }
        }
      }
    }
  };

  const submitCEOReview = async () => {
    let isMissingScore = false;
    let hasInvalidScore = false;
    categories.forEach((cat, catIdx) => {
      cat.items.forEach((_, itemIdx) => {
        const key = `${catIdx}_${itemIdx}`;
        const val = selectedEval.ceo_scores && selectedEval.ceo_scores[key];
        if (val === undefined || val === null || val === '') {
          isMissingScore = true;
        } else if (Number(val) < 0 || Number(val) > 5) {
          hasInvalidScore = true;
        }
      });
    });

    if (isMissingScore || hasInvalidScore) {
      return alert('Vui lòng chấm điểm CỦA CEO đầy đủ cho TẤT CẢ các tiêu chí (từ 0 đến 5)! Không được bỏ trống và không được nhập sai phạm vi.');
    }

    await fetch(`${API_URL}/evaluations/${selectedEval.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ceo_scores: selectedEval.ceo_scores,
        status: 'CEO_REVIEWED'
      })
    });
    alert('Đã lưu điểm duyệt!');
    setView('ceolist');
  };

  // ── CEO LOGIN PAGE ──────────────────────────────────────────────
  if (view === 'ceologin') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#1a1a2e', padding: '1rem' }}>
      <div style={{ background: '#16213e', border: '1px solid #e63946', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(230,57,70,0.2)' }}>
        <h1 style={{ color: '#e63946', fontWeight: 'bold', fontSize: '1.4rem', textAlign: 'center', marginBottom: '0.25rem' }}>🔒 ĐĂNG NHẬP GIÁM ĐỐC</h1>
        <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Chỉ dành cho cán bộ quản lý</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Tài khoản..."
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #444', background: '#0f3460', color: '#fff', outline: 'none' }}
            value={ceoUsername}
            onChange={e => setCeoUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCeoLogin()}
          />
          <input
            type="password"
            placeholder="Mật khẩu..."
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #444', background: '#0f3460', color: '#fff', outline: 'none' }}
            value={ceoPassword}
            onChange={e => setCeoPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCeoLogin()}
          />
          {ceoLoginError && <p style={{ color: '#e63946', fontSize: '0.85rem', textAlign: 'center' }}>{ceoLoginError}</p>}
          <button
            onClick={handleCeoLogin}
            style={{ padding: '0.75rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >Đăng nhập</button>
          <button
            onClick={() => { setView('login'); setCeoUsername(''); setCeoPassword(''); setCeoLoginError(''); }}
            style={{ padding: '0.5rem', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }}
          >← Quay lại</button>
        </div>
      </div>
    </div>
  );

  // ── MAIN LOGIN PAGE ─────────────────────────────────────────────
  if (view === 'login') return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f4f8', padding: '1rem' }}>
      {/* CEO Login Button - ABSOLUTE TOP RIGHT */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button
          onClick={() => setView('ceologin')}
          style={{ padding: '0.5rem 1rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(230,57,70,0.4)' }}
        >🔐 Đăng nhập Giám Đốc</button>
      </div>

      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: '440px', width: '100%' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d3557', textAlign: 'center', marginBottom: '0.5rem' }}>HỆ THỐNG ĐÁNH GIÁ 2025</h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Phiếu tự đánh giá dành cho nhân viên</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Nhập họ tên của bạn..."
            style={{ padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
            value={currentUser}
            onChange={e => setCurrentUser(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nhập khoa phòng của bạn..."
            style={{ padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
            value={currentDepartment}
            onChange={e => setCurrentDepartment(e.target.value)}
          />
          <button
            onClick={() => {
              if (!currentUser || !currentDepartment) return alert('Vui lòng nhập đầy đủ họ tên và khoa phòng!');
              handleLogin('employee');
            }}
            style={{ padding: '0.85rem', background: '#1d6fc4', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
          >📋 Làm Khảo Sát Tự Đánh Giá</button>
        </div>
      </div>
    </div>
  );

  // ── CEO LIST PAGE ───────────────────────────────────────────────
  if (view === 'ceolist') {
    const filtered = evaluations.filter(ev =>
      ev.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.employee_role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ color: '#c62828', fontWeight: 'bold', fontSize: '1.5rem' }}>📋 DANH SÁCH BÀI ĐÁNH GIÁ</h1>
          <button
            onClick={() => { setView('login'); setCeoUsername(''); setCeoPassword(''); }}
            style={{ padding: '0.5rem 1rem', background: '#666', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >Đăng xuất</button>
        </div>

        {/* Search Bar & Export */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="🔍 Tìm theo tên hoặc khoa phòng..."
            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => exportToExcelFormat(evaluations, 'DanhSachDanhGia_ToanBo.xls')}
            style={{ padding: '0 1.5rem', background: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >📥 Xuất All (Mẫu Bảng)</button>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead style={{ background: '#c62828', color: '#fff' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Họ Tên</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Khoa Phòng</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Trạng thái</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <tr key={ev.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#999' }}>#{ev.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{ev.employee_name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{ev.employee_role}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: ev.status === 'CEO_REVIEWED' ? '#d4edda' : '#fff3cd', color: ev.status === 'CEO_REVIEWED' ? '#155724' : '#856404' }}>
                      {ev.status === 'CEO_REVIEWED' ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedEval(ev);
                          setView('ceoreview');
                        }}
                        style={{ padding: '0.4rem 0.8rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                      >Xem & Duyệt</button>
                      <button
                        onClick={() => exportToExcelFormat([ev], `DanhGia_${ev.employee_name.replace(/\s+/g, '')}.xls`)}
                        style={{ padding: '0.4rem 0.8rem', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                      >Xuất Mẫu Bảng</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                  {evaluations.length === 0 ? 'Chưa có ai nộp bài' : 'Không tìm thấy kết quả'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── COMMON EVALUATION FORM ──────────────────────────────────────
  const renderForm = (isCEO = false) => {
    const dataObj = isCEO ? selectedEval : null;
    return (
      <div style={{ padding: '1rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div>
            <h1 style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
              {isCEO ? `DUYỆT BÀI: ${dataObj.employee_name}` : `PHIẾU TỰ ĐÁNH GIÁ: ${currentUser}`}
            </h1>
            <p style={{ color: '#666', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              {isCEO ? 'Tư cách: Giám Đốc (Quyền sửa điểm CEO)' : `Khoa phòng: ${currentDepartment}`}
            </p>
          </div>
          <button
            onClick={() => setView(isCEO ? 'ceolist' : 'login')}
            style={{ padding: '0.5rem 1rem', background: '#666', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >Quay lại</button>
        </div>

        {/* CHÚ Ý - Only show for employee */}
        {!isCEO && (
          <div style={{ background: '#fffde7', border: '1px solid #f9a825', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 'bold', color: '#e65100', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>📌 CHÚ Ý: CÁCH CHẤM ĐIỂM NHƯ SAU</p>
            <p style={{ margin: '0 0 0.35rem', fontSize: '0.88rem', color: '#333' }}>Mỗi nội dung của các tiêu chí trên được đánh giá theo thang điểm từ <strong>0 đến 5 điểm</strong>, cho điểm ưu tiên căn cứ vào con số định lượng.</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#333', lineHeight: '1.8' }}>
              <li><strong>5 điểm:</strong> Luôn vượt mức mong đợi cao nhất.</li>
              <li><strong>4 điểm:</strong> Luôn luôn đáp ứng mong đợi và có đôi lúc vượt mức mong đợi được ghi nhận.</li>
              <li><strong>3 điểm:</strong> Đáp ứng mong đợi, không có khi nào không đạt.</li>
              <li><strong>2 điểm:</strong> Chưa đáp ứng đầy đủ những mong đợi, lúc được lúc không ({'>'} 50%).</li>
              <li><strong>1 điểm:</strong> Đạt được mong đợi từ mức tối thiểu đến mức {'<'} 50%.</li>
              <li><strong>0 điểm:</strong> 100% không như mong đợi.</li>
            </ul>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#1d3557', color: '#fff' }}>
                <th style={{ padding: '0.6rem', width: '40px', textAlign: 'center', border: '1px solid #ccc' }}>TT</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', border: '1px solid #ccc' }}>CÁC NỘI DUNG ĐÁNH GIÁ</th>
                <th style={{ padding: '0.6rem', width: '90px', textAlign: 'center', border: '1px solid #ccc' }}>TỰ CHẤM</th>
                <th style={{ padding: '0.6rem', width: '90px', textAlign: 'center', border: '1px solid #ccc' }}>CEO</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, catIdx) => (
                <React.Fragment key={cat.title}>
                  <tr style={{ background: '#e8eaf6' }}>
                    <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ccc', fontWeight: 'bold' }}>-</td>
                    <td colSpan="3" style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold', color: '#1d3557' }}>{cat.title}</td>
                  </tr>
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}_${itemIdx}`;
                    const empScore = isCEO ? dataObj.scores[key] : scores[key];
                    const ceoScore = isCEO ? dataObj.ceo_scores[key] : '';
                    
                    const isEmpEmptyOrInvalid = empScore === undefined || empScore === null || empScore === '' || Number(empScore) < 0 || Number(empScore) > 5;
                    const isCeoEmptyOrInvalid = isCEO && (ceoScore === undefined || ceoScore === null || ceoScore === '' || Number(ceoScore) < 0 || Number(ceoScore) > 5);

                    return (
                      <tr key={key} style={{ background: itemIdx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                        <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>{itemIdx + 1}</td>
                        <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{item}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>
                          <input className="score-input" type="number" min="0" max="5" value={empScore || ''} onChange={e => !isCEO && handleScoreChange(catIdx, itemIdx, e.target.value, 'scores')} onKeyDown={handleInputKeyDown} disabled={isCEO} style={{ width: '60px', textAlign: 'center', padding: '0.25rem', border: !isCEO && isEmpEmptyOrInvalid ? '2px solid red' : '1px solid #ccc', borderRadius: '4px', background: !isCEO && isEmpEmptyOrInvalid ? '#ffe6e6' : (isCEO ? '#f0f0f0' : '#fff'), color: isCEO ? '#333' : '#000' }} placeholder="..." />
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd', background: '#ffeef0' }}>
                          <input className="score-input" type="number" min="0" max="5" value={ceoScore || ''} onChange={e => isCEO && handleScoreChange(catIdx, itemIdx, e.target.value, 'ceo_scores')} onKeyDown={handleInputKeyDown} disabled={!isCEO} style={{ width: '60px', textAlign: 'center', padding: '0.25rem', border: isCEO && isCeoEmptyOrInvalid ? '2px solid red' : '1px solid #f99', borderRadius: '4px', fontWeight: 'bold', color: '#c62828', background: isCEO && isCeoEmptyOrInvalid ? '#ffe6e6' : (!isCEO ? '#eee' : '#fff') }} placeholder="GĐ" />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          {isCEO
            ? <button onClick={submitCEOReview} style={{ padding: '0.75rem 2rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>💾 LƯU ĐIỂM DUYỆT</button>
            : <button onClick={submitEmployee} style={{ padding: '0.75rem 2rem', background: '#1d6fc4', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>📤 NỘP BÀI ĐÁNH GIÁ</button>
          }
        </div>
      </div>
    );
  };

  if (view === 'employee') return renderForm(false);
  if (view === 'ceoreview') return renderForm(true);

  return null;
}

export default App;
