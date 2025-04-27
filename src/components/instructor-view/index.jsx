import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [totalReferrals, setTotalReferrals] = useState(0);

    console.log("Backend: ", process.env.REACT_APP_BACKEND_URL)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/student/course/allusers`);
                setUsers(data);

                // Calculate total referrals
                const total = data.reduce((acc, user) => acc + (user.totalReferrals || 0), 0);
                setTotalReferrals(total);

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            {/* Total Users and Referrals */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
                    <h2 className="text-xl font-semibold">Total Users</h2>
                    <p className="text-3xl mt-2 text-blue-700">{users.length}</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg shadow text-center">
                    <h2 className="text-xl font-semibold">Total Referrals</h2>
                    <p className="text-3xl mt-2 text-green-700">{totalReferrals}</p>
                </div>
            </div>

            <div className="p-8 w-screen h-screen overflow-scroll">

                <h1 className="text-2xl font-bold mb-6">Users Overview</h1>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-4 border text-left">Name</th>
                                <th className="p-4 border text-left">Phone Number</th>
                                <th className="p-4 border text-left">Total Referrals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="p-4 border">{user.name}</td>
                                    <td className="p-4 border">{user.mobileNumber}</td>
                                    <td className="p-4 border">{user.totalReferrals || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminUsersPage;
