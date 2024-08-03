import React, { useState, useEffect } from 'react';
import '../index.css'; // Ensure this path is correct

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    image: '',
    title: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users for admin dashboard
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Error fetching users: ' + error.message);
    }
  };

  // Handle role change for users
  const handleRoleChange = async (userId, isAdmin) => {
    try {
      const response = await fetch(`http://localhost:5000/update-role/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ isAdmin }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => (user._id === userId ? updatedUser : user)));
    } catch (error) {
      setError('Error updating user role: ' + error.message);
    }
  };

  // Handle input changes for adding new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  // Handle product addition
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const product = await response.json();
      alert('Product added successfully');
      setNewProduct({
        image: '',
        title: '',
        price: '',
        description: ''
      });
    } catch (error) {
      setError('Error adding product: ' + error.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      
      {/* User Management */}
      <div className="user-management">
        <h2>User Management</h2>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                <td>
                  <button onClick={() => handleRoleChange(user._id, !user.isAdmin)}>
                    Set as {user.isAdmin ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add New Product */}
      <div className="add-product">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct}>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={newProduct.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
