import React, { useState, useEffect } from 'react';
import { categories } from './questions';

const API_URL = '/api';

function App() {
  const [view, setView] = useState('login'); // login, employee, ceolist, ceoreview
  const [currentUser, setCurrentUser] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  
  const [scores, setScores] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);

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
    if (role === 'ceo' || role === 'council') setView('ceolist');
  };

  const handleScoreChange = (catIdx, itemIdx, val, type = 'scores') => {
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
    if (!currentUser || !currentDepartment) return alert("Vui lòng nhập đầy đủ họ tên và khoa phòng!");
    await fetch(`${API_URL}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_name: currentUser,
        employee_role: currentDepartment,
        scores
      })
    });
    alert("Đã gửi thành công!");
    setView('login');
  };

  const submitCEOReview = async () => {
    await fetch(`${API_URL}/evaluations/${selectedEval.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ceo_scores: selectedEval.ceo_scores,
        status: 'CEO_REVIEWED'
      })
    });
    alert("Đã lưu điểm duyệt!");
    setView('ceolist');
  };

  if (view === 'login') return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">HỆ THỐNG ĐÁNH GIÁ 2025</h1>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Nhập họ tên của bạn..." 
            className="w-full p-3 border rounded-lg"
            value={currentUser} onChange={e => setCurrentUser(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Nhập khoa phòng của bạn..." 
            className="w-full p-3 border rounded-lg"
            value={currentDepartment} onChange={e => setCurrentDepartment(e.target.value)}
          />
          <button onClick={() => {
            if (!currentUser || !currentDepartment) return alert("Vui lòng nhập đầy đủ họ tên và khoa phòng!");
            handleLogin('employee');
          }} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">Làm Khảo Sát Tự Đánh Giá</button>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button onClick={() => handleLogin('ceo')} className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-300">Dành cho Giám Đốc (CEO)</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'ceolist') return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-800">DANH SÁCH BÀI ĐÁNH GIÁ (CEO)</h1>
        <button onClick={() => setView('login')} className="bg-gray-500 text-white px-4 py-2 rounded">Đăng xuất</button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr><th className="p-4 border-b">ID</th><th className="p-4 border-b">Họ Tên</th><th className="p-4 border-b">Chức vụ</th><th className="p-4 border-b">Hành động</th></tr>
          </thead>
          <tbody>
            {evaluations.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">#{ev.id}</td>
                <td className="p-4 border-b font-bold">{ev.employee_name}</td>
                <td className="p-4 border-b">{ev.employee_role}</td>
                <td className="p-4 border-b">
                  <button onClick={() => { setSelectedEval(ev); setView('ceoreview'); }} className="bg-red-500 text-white px-4 py-1 rounded text-sm">Chấm điểm</button>
                </td>
              </tr>
            ))}
            {evaluations.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">Chưa có ai nộp bài</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Common Evaluation Form renderer
  const renderForm = (isCEO = false) => {
    const dataObj = isCEO ? selectedEval : null;
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
          <div>
            <h1 className="text-xl font-bold">{isCEO ? `DUYỆT BÀI: ${dataObj.employee_name}` : `PHIẾU TỰ ĐÁNH GIÁ: ${currentUser}`}</h1>
            <p className="text-gray-500">{isCEO ? "Tư cách: Giám Đốc (Quyền sửa điểm CEO)" : "Bạn chỉ được phép tự điền cột Tự Chấm"}</p>
          </div>
          <button onClick={() => setView(isCEO ? 'ceolist' : 'login')} className="bg-gray-500 text-white px-4 py-2 rounded">Quay lại</button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border p-2 w-12 text-center">TT</th>
                <th className="border p-2">CÁC NỘI DUNG ĐÁNH GIÁ</th>
                <th className="border p-2 w-24 text-center">TỰ CHẤM</th>
                <th className="border p-2 w-24 text-center">CEO</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, catIdx) => (
                <React.Fragment key={cat.title}>
                  <tr className="bg-gray-200 font-bold"><td className="p-2 border text-center">-</td><td colSpan="3" className="p-2 border">{cat.title}</td></tr>
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}_${itemIdx}`;
                    const empScore = isCEO ? dataObj.scores[key] : scores[key];
                    const ceoScore = isCEO ? dataObj.ceo_scores[key] : '';
                    
                    return (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="p-2 border text-center">{itemIdx + 1}</td>
                        <td className="p-2 border">{item}</td>
                        <td className="p-2 border text-center">
                          <input type="number" min="0" max="5" value={empScore || ''} onChange={e => !isCEO && handleScoreChange(catIdx, itemIdx, e.target.value, 'scores')} disabled={isCEO} className={`w-full text-center p-1 border rounded ${isCEO ? 'bg-gray-100' : 'bg-white'}`} placeholder="..."/>
                        </td>
                        <td className="p-2 border text-center bg-red-50">
                          <input type="number" min="0" max="5" value={ceoScore || ''} onChange={e => isCEO && handleScoreChange(catIdx, itemIdx, e.target.value, 'ceo_scores')} disabled={!isCEO} className={`w-full text-center p-1 border rounded font-bold text-red-700 ${!isCEO ? 'bg-gray-200' : 'bg-white border-red-300'}`} placeholder="GĐ"/>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          {isCEO ? 
            <button onClick={submitCEOReview} className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-700">LƯU ĐIỂM DUYỆT</button>
          : 
            <button onClick={submitEmployee} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700">NỘP BÀI ĐÁNH GIÁ</button>
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
