import React, { useState, useEffect } from 'react';
import { ROLE_TYPES, QUESTIONS, calcGrade } from './data/questions';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './index.css';

const API_URL = '/api';

export default function App() {
  const [view, setView] = useState('login'); // login, manager-login, employee, dashboard, review
  const [user, setUser] = useState(null); // Trạng thái auth cho Leader/CEO

  // Form nhân viên
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [positionType, setPositionType] = useState('DR');
  const [scores, setScores] = useState({});
  const [selfComment, setSelfComment] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Dashboard & Review state
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Lấy danh sách phiếu khi vào dashboard
  useEffect(() => {
    if (view === 'dashboard') fetchEvaluations();
  }, [view]);

  const fetchEvaluations = async () => {
    try {
      const res = await fetch(`${API_URL}/evaluations`);
      const data = await res.json();
      setEvaluations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleManagerLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setView('dashboard');
      } else alert(data.message);
    } catch (err) {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleScoreChange = (catIdx, itemIdx, val, type) => {
    if (val !== '') {
      const num = Number(val);
      if (isNaN(num) || num < 0 || num > 5) return alert('Chỉ nhập số từ 0 đến 5!');
    }
    const key = `${catIdx}_${itemIdx}`;
    
    if (type === 'scores') setScores({ ...scores, [key]: val });
    else {
      // Cho Leader và Council
      setSelectedEval({
        ...selectedEval,
        [type]: { ...selectedEval[type], [key]: val }
      });
    }
  };

  // Keyboard navigation for scores
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.score-input:not([disabled])'));
      const index = inputs.indexOf(e.target);
      if (index > -1 && index + 1 < inputs.length) {
        inputs[index + 1].focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.score-input:not([disabled])'));
      const index = inputs.indexOf(e.target);
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  };

  const submitEmployee = async () => {
    if (!empName || !empRole) return alert('Vui lòng nhập họ tên và khoa phòng!');
    const qs = QUESTIONS[positionType];
    let isMissing = false;
    qs.forEach((cat, ci) => {
      cat.items.forEach((_, ii) => {
        const v = scores[`${ci}_${ii}`];
        if (v === undefined || v === '') isMissing = true;
      });
    });
    if (isMissing) {
      setShowErrors(true);
      return alert('Vui lòng chấm điểm đầy đủ cho TẤT CẢ tiêu chí!');
    }

    try {
      await fetch(`${API_URL}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_name: empName,
          employee_role: empRole,
          position_type: positionType,
          scores,
          self_comment: selfComment
        })
      });
      alert('Nộp phiếu thành công!');
      setView('login');
      // Reset form
      setEmpName(''); setEmpRole(''); setScores({}); setSelfComment(''); setShowErrors(false);
    } catch (e) {
      alert('Lỗi gửi dữ liệu!');
    }
  };

  const submitReview = async () => {
    const isCouncil = user.role === 'council';
    const qs = QUESTIONS[selectedEval.position_type];
    const scoreField = isCouncil ? 'council_scores' : 'leader_scores';
    const scoreData = selectedEval[scoreField] || {};
    
    let isMissing = false;
    qs.forEach((cat, ci) => {
      cat.items.forEach((_, ii) => {
        const v = scoreData[`${ci}_${ii}`];
        if (v === undefined || v === '') isMissing = true;
      });
    });
    if (isMissing) {
      setShowErrors(true);
      return alert(`Vui lòng chấm điểm CỦA ${isCouncil ? 'HỘI ĐỒNG' : 'LÃNH ĐẠO'} đầy đủ!`);
    }

    const finalResult = calcGrade(scoreData, qs);

    const payload = isCouncil ? {
      council_scores: scoreData,
      status: 'COUNCIL_REVIEWED',
      council_notes: selectedEval.council_notes,
      strengths: selectedEval.strengths,
      weaknesses: selectedEval.weaknesses,
      skills_needed: selectedEval.skills_needed,
      final_grade: finalResult.grade,
      council_reviewed_by: user.fullName,
      council_reviewed_at: new Date().toISOString()
    } : {
      leader_scores: scoreData,
      status: 'LEADER_REVIEWED',
      leader_notes: selectedEval.leader_notes,
      leader_reviewed_by: user.fullName,
      leader_reviewed_at: new Date().toISOString()
    };

    try {
      await fetch(`${API_URL}/evaluations/${selectedEval.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      alert('Đã lưu đánh giá & duyệt thành công!');
      setView('dashboard');
    } catch (e) {
      alert('Lỗi lưu đánh giá!');
    }
  };

  const exportExcel = async (ev) => {
    const qs = QUESTIONS[ev.position_type];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('DanhGia', {
      pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 } }
    });

    sheet.columns = [
      { width: 6 }, { width: 75 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }
    ];

    // Row 1
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `PHIẾU ĐÁNH GIÁ NĂNG LỰC NHÂN SỰ CÁ NHÂN: ${ROLE_TYPES[ev.position_type].label.toUpperCase()}`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Row 2
    sheet.mergeCells('A2:F2');
    const yearCell = sheet.getCell('A2');
    yearCell.value = `NĂM ${new Date().getFullYear()}`;
    yearCell.font = { bold: true, size: 12 };
    yearCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Row 3
    sheet.mergeCells('A3:B3');
    sheet.getCell('A3').value = `HỌ TÊN: ${ev.employee_name}`;
    sheet.getCell('A3').font = { bold: true };
    
    sheet.mergeCells('C3:D3');
    sheet.getCell('C3').value = `VỊ TRÍ CÔNG VIỆC: ${ev.employee_role}`;
    sheet.getCell('C3').font = { bold: true };

    sheet.mergeCells('E3:F3');
    const submitDate = ev.submitted_at || new Date().toISOString();
    sheet.getCell('E3').value = `NGÀY ĐÁNH GIÁ: ${new Date(submitDate).toLocaleDateString('vi-VN')}`;
    sheet.getCell('E3').font = { bold: true };

    const applyBorders = (row) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= 6) { // Ensure columns A to F are bordered
          cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
        }
      });
    };

    // Row 4: Header
    const hr = sheet.addRow(['TT', 'CÁC NỘI DUNG ĐÁNH GIÁ', 'TỰ CHẤM', 'CEO', 'HỘI ĐỒNG', 'GHI CHÚ']);
    hr.font = { bold: true };
    hr.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    applyBorders(hr);

    qs.forEach((cat, ci) => {
      const cr = sheet.addRow(['', cat.title, '', '', '', '']);
      cr.font = { bold: true };
      applyBorders(cr);

      cat.items.forEach((item, ii) => {
        const key = `${ci}_${ii}`;
        const row = sheet.addRow([
          ii + 1, item,
          (ev.scores || {})[key] || '',
          (ev.leader_scores || {})[key] || '',
          (ev.council_scores || ev.ceo_scores || {})[key] || '',
          '' // Ghi chú column
        ]);
        
        row.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
        row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(6).alignment = { wrapText: true, vertical: 'middle' };

        applyBorders(row);
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `DanhGia_${ev.employee_name}.xlsx`);
  };

  // 1. Employee Login
  if (view === 'login') return (
    <div className="auth-container">
      <button className="auth-manager-btn" onClick={() => setView('manager-login')}>🔐 Đăng nhập Quản lý</button>
      <div className="auth-card">
        <h1 className="auth-title">Hệ Thống Đánh Giá 2025</h1>
        <p className="auth-subtitle">Phiếu Tự Chấm Cho Nhân Viên Bệnh Viện</p>
        <div className="input-group">
          <label>Họ và tên</label>
          <input className="input-control" value={empName} onChange={e=>setEmpName(e.target.value)} placeholder="Nguyễn Văn A" />
        </div>
        <div className="input-group">
          <label>Khoa / Phòng</label>
          <input className="input-control" value={empRole} onChange={e=>setEmpRole(e.target.value)} placeholder="Khoa Tái tạo..." />
        </div>
        <div className="input-group">
          <label>Chức danh đánh giá</label>
          <select className="input-control select-control" value={positionType} onChange={e=>setPositionType(e.target.value)}>
            {Object.values(ROLE_TYPES).map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}} onClick={() => {
          if(!empName||!empRole) return alert("Vui lòng nhập tên và khoa");
          setView('employee');
        }}>📝 Bắt đầu đánh giá</button>
      </div>
    </div>
  );

  // 2. Manager Login
  if (view === 'manager-login') return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Đăng Nhập Quản Lý</h1>
        <p className="auth-subtitle">Dành cho Trưởng Khoa, Trưởng Phòng, Giám Đốc</p>
        <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem'}}>
          <strong>Gợi ý Test Tài Khoản Quản Lý:</strong>
          <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)'}}>
            <li>Hội đồng / Giám đốc: <strong>ceo</strong> / <strong>ceo@2025</strong></li>
            <li>Trưởng khoa: <strong>leader1</strong> / <strong>leader@2025</strong></li>
            <li>Trưởng phòng: <strong>leader2</strong> / <strong>leader@2025</strong></li>
          </ul>
        </div>
        <form onSubmit={handleManagerLogin} style={{marginTop: '1rem'}}>
          <div className="input-group">
            <label>Tài khoản</label>
            <input className="input-control" name="username" required />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input className="input-control" type="password" name="password" required />
          </div>
          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" className="btn btn-secondary" onClick={()=>setView('login')} style={{flex: 1}}>Quay lại</button>
            <button type="submit" className="btn btn-primary" style={{flex: 1}}>Đăng nhập</button>
          </div>
        </form>
      </div>
    </div>
  );

  // 3. Employee Eval Form / 4. Review Form
  const isReview = view === 'review';
  const isCouncil = isReview && user?.role === 'council';
  const isLeader = isReview && user?.role === 'leader';
  
  const dObj = isReview ? selectedEval : null;
  const pType = isReview ? dObj.position_type : positionType;
  const qs = QUESTIONS[pType];

  if (view === 'employee' || isReview) {
    // Current scores for calculation display
    const currentViewScores = isCouncil ? dObj.council_scores : (isLeader ? dObj.leader_scores : scores);
    const gradeInfo = calcGrade(currentViewScores, qs);

    return (
      <div className="dashboard-layout">
        <div className="navbar">
          <div className="navbar-brand">📝 {isReview ? 'Duyệt Phiếu' : 'Phiếu Tự Đánh Giá'}</div>
          <button className="btn btn-secondary" onClick={() => setView(isReview ? 'dashboard' : 'login')}>Quay Lại</button>
        </div>
        <div className="main-content">
          <div className="form-header">
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Họ và tên</span><span className="info-value">{isReview ? dObj.employee_name : empName}</span></div>
              <div className="info-item"><span className="info-label">Khoa phòng</span><span className="info-value">{isReview ? dObj.employee_role : empRole}</span></div>
              <div className="info-item"><span className="info-label">Vị trí Evaluate</span><span className="info-value" style={{color: ROLE_TYPES[pType].color}}>{ROLE_TYPES[pType].label}</span></div>
            </div>
            {isReview && (
              <div style={{textAlign: 'right'}}>
                <div style={{color: gradeInfo.gradeColor, fontSize: '2rem', fontWeight: 800}}>{gradeInfo.pct}% - L. {gradeInfo.grade}</div>
                <div style={{color: 'var(--text-muted)'}}>{gradeInfo.gradeLabel}</div>
              </div>
            )}
          </div>

          {!isReview && (
            <div className="alert alert-warning">
              <strong>Chú ý:</strong> Chấm điểm từ 0-5. 5: Vượt mong đợi nhất, 4: Luôn đáp ứng, 3: Đáp ứng không rớt, 2: &gt;50%, 1: {'<'}50%, 0: Không mong đợi.
            </div>
          )}

          <div className="table-wrapper">
            <table className="eval-table">
              <thead>
                <tr>
                  <th className="col-tt">TT</th>
                  <th className="col-content">NỘI DUNG TIÊU CHÍ ({qs.length} phần)</th>
                  <th className="col-score">TỰ CHẤM</th>
                  {(isLeader || isCouncil) && <th className="col-score">LÃNH ĐẠO</th>}
                  {isCouncil && <th className="col-score" style={{color:'var(--success)'}}>HỘI ĐỒNG</th>}
                </tr>
              </thead>
              <tbody>
                {qs.map((cat, ci) => (
                  <React.Fragment key={ci}>
                    <tr className="row-category"><td className="col-tt">-</td><td colSpan={isCouncil ? 4 : (isLeader ? 3 : 2)}>{cat.title}</td></tr>
                    {cat.items.map((item, ii) => {
                      const key = `${ci}_${ii}`;
                      const empV = isReview ? dObj.scores[key] : scores[key];
                      const ldrV = isReview ? (dObj.leader_scores || {})[key] : '';
                      const cncV = isReview ? ((dObj.council_scores || dObj.ceo_scores) || {})[key] : '';
                      
                      return (
                        <tr key={key}>
                          <td className="col-tt">{ii+1}</td>
                          <td>{item}</td>
                          <td className="col-score">
                            <input className={`score-input ${(!isReview && showErrors && (empV === undefined || empV === '')) ? 'invalid' : ''}`} type="number" min="0" max="5" 
                              value={empV !== undefined ? empV : ''} 
                              onChange={e => !isReview && handleScoreChange(ci, ii, e.target.value, 'scores')}
                              onKeyDown={handleInputKeyDown}
                              disabled={isReview} />
                          </td>
                          {(isLeader || isCouncil) && (
                            <td className="col-score">
                              <input className={`score-input ${isLeader ? 'active-input' : ''} ${(isLeader && showErrors && (ldrV === undefined || ldrV === '')) ? 'invalid' : ''}`} type="number" min="0" max="5"
                                value={ldrV !== undefined ? ldrV : ''}
                                onChange={e => isLeader && handleScoreChange(ci, ii, e.target.value, 'leader_scores')}
                                onKeyDown={handleInputKeyDown}
                                disabled={!isLeader} />
                            </td>
                          )}
                          {isCouncil && (
                            <td className="col-score">
                              <input className={`score-input active-input ${(isCouncil && showErrors && (cncV === undefined || cncV === '')) ? 'invalid' : ''}`} style={{borderColor:'var(--success)', color:'var(--success)'}} type="number" min="0" max="5"
                                value={cncV !== undefined ? cncV : ''}
                                onChange={e => isCouncil && handleScoreChange(ci, ii, e.target.value, 'council_scores')}
                                onKeyDown={handleInputKeyDown} />
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="feedback-section">
            {!isReview ? (
              <div style={{gridColumn: '1 / -1'}}>
                <label style={{display:'block', fontWeight:600, marginBottom:'0.5rem'}}>Ý kiến cá nhân tự nhận xét:</label>
                <textarea className="input-control" style={{width:'100%'}} value={selfComment} onChange={e=>setSelfComment(e.target.value)} placeholder="Tôi nhận thấy..."></textarea>
              </div>
            ) : (
              <>
                <div>
                  <label style={{display:'block', fontWeight:600, marginBottom:'0.5rem'}}>Nhận xét của Cấp Quản Lý trực tiếp:</label>
                  <textarea className="input-control" style={{width:'100%'}} 
                    value={dObj.leader_notes || ''} 
                    onChange={e=>isLeader && setSelectedEval({...dObj, leader_notes: e.target.value})}
                    disabled={!isLeader} placeholder="Leader note..."></textarea>
                </div>
                {isCouncil && (
                  <div>
                    <label style={{display:'block', fontWeight:600, marginBottom:'0.5rem', color:'var(--success)'}}>Đánh giá của Hội Đồng (CEO):</label>
                    <textarea className="input-control" style={{width:'100%'}} 
                      value={dObj.council_notes || ''} 
                      onChange={e=>setSelectedEval({...dObj, council_notes: e.target.value})}
                      placeholder="Council note..."></textarea>
                  </div>
                )}
                {isCouncil && (
                  <div style={{gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                    <div><label>ĐIỂM MẠNH</label><textarea className="input-control" style={{width:'100%'}} value={dObj.strengths||''} onChange={e=>setSelectedEval({...dObj, strengths: e.target.value})}></textarea></div>
                    <div><label>ĐIỂM YẾU</label><textarea className="input-control" style={{width:'100%'}} value={dObj.weaknesses||''} onChange={e=>setSelectedEval({...dObj, weaknesses: e.target.value})}></textarea></div>
                    <div><label>KỸ NĂNG CẦN PT</label><textarea className="input-control" style={{width:'100%'}} value={dObj.skills_needed||''} onChange={e=>setSelectedEval({...dObj, skills_needed: e.target.value})}></textarea></div>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{textAlign: 'right', marginTop: '2rem'}}>
            {!isReview 
              ? <button className="btn btn-primary" onClick={submitEmployee}>NỘP PHIẾU ĐÁNH GIÁ</button>
              : <button className="btn btn-success" onClick={submitReview}>LƯU & DUYỆT PHIẾU</button>}
          </div>
        </div>
      </div>
    );
  }

  // 5. Dashboard List
  if (view === 'dashboard') {
    const list = evaluations.filter(e => 
      e.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.employee_role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="dashboard-layout">
        <div className="navbar">
          <div className="navbar-brand">📊 Dashboard Quản Lý</div>
          <div className="navbar-user">
            <span className="user-badge">{user?.fullName} ({user?.role})</span>
            <button className="btn btn-secondary" onClick={()=>{setUser(null); setView('login')}}>Đăng xuất</button>
          </div>
        </div>
        <div className="main-content">
          <div className="header-actions">
            <input className="input-control search-box" placeholder="🔍 Tìm kiếm nhân viên..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
            {user?.role === 'council' && (
              <button className="btn btn-primary" onClick={()=>alert('Xuất tất cả (đang phát triển)')}>⬇️ Xuất Tổng Hợp (Excel)</button>
            )}
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>HỌ TÊN</th>
                  <th>KHOA PHÒNG</th>
                  <th>VỊ TRÍ</th>
                  <th>NGÀY NỘP</th>
                  <th>TRẠNG THÁI</th>
                  {user?.role === 'council' && <th>XẾP LOẠI</th>}
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {list.map(e => (
                  <tr key={e.id}>
                    <td style={{color:'var(--text-muted)'}}>#{e.id}</td>
                    <td style={{fontWeight:600}}>{e.employee_name}</td>
                    <td>{e.employee_role}</td>
                    <td><span style={{fontSize:'0.8rem', color: ROLE_TYPES[e.position_type]?.color||'#000', fontWeight:600}}>{ROLE_TYPES[e.position_type]?.shortLabel||e.position_type}</span></td>
                    <td style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{new Date(e.submitted_at).toLocaleDateString('vi')}</td>
                    <td>
                      <span className={`status-badge status-${e.status.split('_')[0].toLowerCase()}`}>
                        {e.status === 'SUBMITTED' ? 'Chờ Leader' : e.status === 'LEADER_REVIEWED' ? 'Chờ H.Đồng' : 'Đã Hoàn Thành'}
                      </span>
                    </td>
                    {user?.role === 'council' && (
                      <td>
                        {e.final_grade && <span className="grade-badge" style={{background: e.final_grade==='A'?'#16a34a':e.final_grade==='B'?'#2563eb':e.final_grade==='C'?'#d97706':'#dc2626'}}>{e.final_grade}</span>}
                      </td>
                    )}
                    <td>
                      <div style={{display:'flex', gap:'0.5rem'}}>
                        <button className="btn btn-secondary" style={{padding:'0.4rem 0.8rem', fontSize:'0.85rem'}} onClick={()=>{setSelectedEval(e); setView('review')}}>Xem & Duyệt</button>
                        {user?.role === 'council' && <button className="btn btn-secondary" style={{padding:'0.4rem 0.8rem', fontSize:'0.85rem'}} onClick={()=>exportExcel(e)}>⬇ Tải Phiếu</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length===0 && <tr><td colSpan="8" style={{textAlign:'center', padding:'3rem', color:'var(--text-muted)'}}>Không có dữ liệu phiếu đánh giá.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
