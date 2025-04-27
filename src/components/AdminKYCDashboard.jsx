import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminKYCPanel() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'reupload'
  const [rejectionReasons, setRejectionReasons] = useState({});

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/kyc-submissions`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching KYC submissions:', err);
    }
  };

  const approveKYC = async (userId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/approve/${userId}`);
    } catch (err) {
      console.error('Error approving KYC:', err);
    }
  };

  const rejectKYC = async (userId, reason) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/reject/${userId}`, { reason });
    } catch (err) {
      console.error('Error rejecting KYC:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await approveKYC(id);
    fetchData();
  };

  const handleReject = async (id) => {
    const reason = rejectionReasons[id] || '';
    if (!reason) return alert('Please enter a reason');
    await rejectKYC(id, reason);
    fetchData();
  };

  const filteredUsers = users.filter(user => {
    const status = user.kycStatus?.toLowerCase() || 'pending';
    return filter === status;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard - KYC Panel</h1>

      {/* FILTER TABS */}
      <div className="flex gap-4 mb-6">
        {['pending', 'approved', 'reupload'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* KYC LIST */}
      {filteredUsers.length > 0 ? filteredUsers.map((user) => (
        <div key={user._id} className="border p-4 mb-4 rounded shadow-sm">
          <h2 className="font-semibold text-lg">{user.email}</h2>
          <p className="text-sm mb-2 text-gray-500">Status: <span className="capitalize">{user.kycStatus}</span></p>
          <pre className="text-sm text-gray-600">{JSON.stringify(user.kycDetails, null, 2)}</pre>

          {filter === 'pending' && (
            <div className="flex items-center space-x-4 mt-2">
              <button onClick={() => handleApprove(user._id)} className="bg-green-500 text-white px-4 py-1 rounded">
                Approve
              </button>
              <input
                placeholder="Rejection reason"
                value={rejectionReasons[user._id] || ''}
                onChange={(e) => setRejectionReasons({ ...rejectionReasons, [user._id]: e.target.value })}
                className="border px-2 py-1 rounded w-60"
              />
              <button onClick={() => handleReject(user._id)} className="bg-red-500 text-white px-4 py-1 rounded">
                Reject
              </button>
            </div>
          )}
        </div>
      )) : (
        <p className="text-gray-600">No {filter} KYC submissions found.</p>
      )}
    </div>
  );
}
