import React, { useState } from 'react';

const SimpleBackendTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(`✅ Connected! Status: ${data.status}, Environment: ${data.environment}`);
      } else {
        setConnectionStatus('❌ Connection failed');
      }
    } catch (error) {
      setConnectionStatus('❌ Backend not running - make sure server is on port 5000');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser' + Date.now(),
          email: 'test' + Date.now() + '@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Registration successful! User: ${data.user.username}`);
      } else {
        const error = await response.json();
        alert(`❌ Registration failed: ${error.message}`);
      }
    } catch (error) {
      alert('❌ Registration error - check if backend is running');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testConnection}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mr-4"
        >
          Test Connection
        </button>
        
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mr-4 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Products'}
        </button>
        
        <button
          onClick={testRegistration}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          Test Registration
        </button>
      </div>

      {connectionStatus && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          {connectionStatus}
        </div>
      )}

      {products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Sample Products ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                <p className="text-xs text-gray-500">Category: {product.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleBackendTest;
