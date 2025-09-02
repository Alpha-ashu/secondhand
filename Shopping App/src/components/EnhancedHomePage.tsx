import React, { useState } from 'react';
import { Product } from '../services/api';
import ResponsiveProductGrid from './ResponsiveProductGrid';

interface EnhancedHomePageProps {
  onMenuClick: () => void;
  onSearchSubmit: (searchTerm: string, location?: string) => void;
  onCategoryClick: (category: string) => void;
  onProductClick: (product: Product) => void;
  onViewAllProducts: () => void;
  products: Product[];
  onToggleFavorite: (productId: number) => void;
}

const EnhancedHomePage: React.FC<EnhancedHomePageProps> = ({
  onMenuClick,
  onSearchSubmit,
  onCategoryClick,
  onProductClick,
  onViewAllProducts,
  products,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Near Me');
  const [favorites] = useState<Set<number>>(new Set());

  const locations = ['Near Me', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];
  
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-800' },
    { id: 'precious_metals', name: 'Gold & Silver', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'collectibles', name: 'Collectibles', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
  ];

  const quickActions = [
    { id: 'sell', name: 'Sell Item', icon: '💼', color: 'bg-green-100 text-green-800' },
    { id: 'emergency', name: 'Emergency Fund', icon: '🚨', color: 'bg-red-100 text-red-800' },
    { id: 'auctions', name: 'Live Auctions', icon: '⚡', color: 'bg-orange-100 text-orange-800' },
    { id: 'verified', name: 'Verified Sellers', icon: '✅', color: 'bg-indigo-100 text-indigo-800' },
  ];

  const handleSearch = () => {
    onSearchSubmit(searchTerm, selectedLocation !== 'Near Me' ? selectedLocation : undefined);
  };

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">SecondHand</h1>
              <p className="text-sm text-gray-600">Find great deals nearby</p>
            </div>
            <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Location Selector - Always Visible */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">📍 Location:</span>
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedLocation === location
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions - Always Visible */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  if (action.id === 'emergency') onCategoryClick('precious_metals');
                  else if (action.id === 'auctions') onCategoryClick('collectibles');
                  else if (action.id === 'verified') onViewAllProducts();
                }}
                className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">{action.icon}</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${action.color}`}>
                    {action.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
            <button
              onClick={onViewAllProducts}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          
          <ResponsiveProductGrid
            products={featuredProducts}
            favorites={favorites}
            onProductClick={onProductClick}
            onToggleFavorite={onToggleFavorite}
          />
        </div>

        {/* Emergency Fund Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Need Emergency Cash?</h3>
              <p className="text-sm opacity-90">Convert gold/silver to cash instantly</p>
            </div>
            <button
              onClick={() => onCategoryClick('precious_metals')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Start Now
            </button>
          </div>
        </div>

        {/* Live Auctions Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Live Auctions 🔥</h3>
              <p className="text-sm opacity-90">Bid on rare collectibles now</p>
            </div>
            <button
              onClick={() => onCategoryClick('collectibles')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Join Auction
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default EnhancedHomePage;
