import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
      </div>
      
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-600 mb-4">Admin Dashboard coming soon!</h2>
        <p className="text-gray-500">This will include product management, order tracking, user management, and analytics.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;