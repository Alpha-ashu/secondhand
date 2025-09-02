import React, { useState, useEffect } from 'react';
import { AuthForm } from './Auth/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { productsAPI, Product } from '../services/api';

const BackendTest: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedProducts = await productsAPI.getAll();
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        const data = await response.json();
        alert(`Backend connected! Status: ${data.status}, Environment: ${data.environment}`);
      } else {
        alert('Backend connection failed');
      }
    } catch (error) {
      alert('Backend connection failed - make sure server is running on port 5000');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Backend Connection Test</h1>
        
        {/* Connection Test */}
        <div className="mb-8 text-center">
          <button
            onClick={testBackendConnection}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Test Backend Connection
          </button>
        </div>

        {/* Authentication Section */}
        {!isAuthenticated ? (
          <AuthForm 
            mode={authMode} 
            onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username}!</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sample Products from Backend</h2>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Products'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <div key={product._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                  <p className="text-xs text-gray-500">Category: {product.category}</p>
                  {product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-32 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && !loading && !error && (
            <p className="text-gray-500 text-center py-8">
              Click "Fetch Products" to load sample data from the backend
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
