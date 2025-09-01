import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  category: string;
  condition?: string;
  seller: string;
  images: string[];
  location: string;
  emergencyFund?: boolean;
  certification?: string;
  isFavorite: boolean;
}

interface HomePageProps {
  onMenuClick: () => void;
  onSearchSubmit: (searchTerm: string, location?: string) => void;
  onCategoryClick: (category: string) => void;
  onProductClick: (product: Product) => void;
  onViewAllProducts: () => void;
  products: Product[];
  onToggleFavorite: (productId: number) => void;
}

export default function HomePage({
  onMenuClick,
  onSearchSubmit,
  onCategoryClick,
  onProductClick,
  onViewAllProducts,
  products,
  onToggleFavorite
}: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '📱',
      description: 'Phones, Laptops, Gadgets'
    },
    {
      id: 'precious_metals',
      name: 'Gold & Silver',
      icon: '🥇',
      description: 'Emergency Funds'
    },
    {
      id: 'collectibles',
      name: 'Collectibles',
      icon: '🎯',
      description: 'Auctions & Rare Items'
    },
    {
      id: 'all',
      name: 'All Products',
      icon: '🛍️',
      description: 'Browse Everything'
    }
  ];

  // Get verified sellers (precious metals sellers)
  const verifiedProducts = products.filter(p => p.certification === "RBI Verified").slice(0, 3);
  
  // Get emergency/urgent products
  const emergencyProducts = products.filter(p => p.emergencyFund).slice(0, 3);
  
  // Get recent products
  const recentProducts = products.slice(0, 4);

  const handleSearch = () => {
    onSearchSubmit(searchTerm, locationFilter);
  };

  const handleNearMeSearch = () => {
    setLocationFilter('Near Me');
    onSearchSubmit(searchTerm, 'Near Me');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#426b1f] text-white">
        <button onClick={onMenuClick} className="p-2">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
          </div>
        </button>
        
        <h1 className="text-lg font-medium">SecondMarket</h1>
        
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Search Section */}
      <div className="p-4 bg-[#426b1f] text-white">
        <div className="space-y-3">
          {/* Main Search Bar */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-black outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-3 bg-[#365a19] hover:bg-[#2d4a15] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Location and Filter Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNearMeSearch}
              className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2 hover:bg-opacity-30 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Near Me</span>
            </button>

            <button
              onClick={() => setShowLocationFilter(!showLocationFilter)}
              className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2 hover:bg-opacity-30 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Location</span>
            </button>

            {showLocationFilter && (
              <input
                type="text"
                placeholder="Enter city or area"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-black text-sm outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories Section */}
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => category.id === 'all' ? onViewAllProducts() : onCategoryClick(category.id)}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Verified Sellers Section */}
        {verifiedProducts.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Verified Sellers</h2>
              <button
                onClick={() => onCategoryClick('precious_metals')}
                className="text-[#426b1f] text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 px-1">
              {verifiedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  onToggleFavorite={onToggleFavorite}
                  showVerifiedBadge
                />
              ))}
            </div>
          </div>
        )}

        {/* Emergency Funds Section */}
        {emergencyProducts.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Emergency Funds Available</h2>
              <button
                onClick={() => onCategoryClick('precious_metals')}
                className="text-[#426b1f] text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 px-1">
              {emergencyProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  onToggleFavorite={onToggleFavorite}
                  showUrgentBadge
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Products Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recently Added</h2>
            <button
              onClick={onViewAllProducts}
              className="text-[#426b1f] text-sm font-medium"
            >
              View All Products
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                onToggleFavorite={onToggleFavorite}
                isGridView
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 pb-8">
          <div className="bg-gradient-to-r from-[#426b1f] to-[#365a19] rounded-xl p-4 text-white">
            <h3 className="font-medium mb-2">Quick Actions</h3>
            <div className="flex gap-3">
              <button
                onClick={onViewAllProducts}
                className="flex-1 bg-white bg-opacity-20 rounded-lg py-3 px-4 hover:bg-opacity-30 transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🛍️</div>
                  <span className="text-sm">Browse All</span>
                </div>
              </button>
              <button
                onClick={() => onCategoryClick('collectibles')}
                className="flex-1 bg-white bg-opacity-20 rounded-lg py-3 px-4 hover:bg-opacity-30 transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🎯</div>
                  <span className="text-sm">Live Auctions</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onToggleFavorite: (productId: number) => void;
  showVerifiedBadge?: boolean;
  showUrgentBadge?: boolean;
  isGridView?: boolean;
}

function ProductCard({
  product,
  onClick,
  onToggleFavorite,
  showVerifiedBadge,
  showUrgentBadge,
  isGridView
}: ProductCardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col ${
        isGridView ? 'w-full h-[280px]' : 'w-48 h-[280px] flex-shrink-0'
      }`}
    >
      <div className="relative flex-shrink-0">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {showVerifiedBadge && (
            <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              ✓ Verified
            </span>
          )}
          {showUrgentBadge && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              🚨 Urgent
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-2 right-2 w-6 h-6 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all flex items-center justify-center"
        >
          <span className={`text-sm ${product.isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            {product.isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
          <p className="text-[#426b1f] font-medium text-sm mb-1">{product.price}</p>
          <p className="text-gray-600 text-xs mb-2 line-clamp-1">{product.location}</p>
        </div>
        
        <button
          onClick={onClick}
          className="w-full bg-[#426b1f] text-white py-2 rounded-lg hover:bg-[#365a19] transition-colors text-sm font-medium mt-auto"
        >
          View Product
        </button>
      </div>
    </div>
  );
}