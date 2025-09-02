import React, { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
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

  // Get verified sellers (precious metals sellers)
  const verifiedProducts = products.filter(p => p.certification === "RBI Verified").slice(0, 2);
  
  // Get emergency/urgent products
  const emergencyProducts = products.filter(p => p.emergencyFund).slice(0, 2);
  
  // Get recent products
  const recentProducts = products.slice(0, 4);

  const handleSearch = () => {
    if (searchTerm.trim() || locationFilter.trim()) {
      onSearchSubmit(searchTerm.trim(), locationFilter.trim());
    }
  };

  const handleNearMeSearch = () => {
    setLocationFilter('Near Me');
    onSearchSubmit(searchTerm, 'Near Me');
  };

  const handleLocationToggle = () => {
    setShowLocationFilter(!showLocationFilter);
    if (showLocationFilter) {
      setLocationFilter('');
    }
  };

  const clearLocationFilter = () => {
    setLocationFilter('');
    setShowLocationFilter(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#426b1f] text-white flex-shrink-0">
        <button onClick={onMenuClick} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-white rounded-full"></div>
            <div className="w-full h-0.5 bg-white rounded-full"></div>
            <div className="w-full h-0.5 bg-white rounded-full"></div>
          </div>
        </button>
        
        <h1 className="text-lg font-medium">SecondMarket</h1>
        
        <div className="w-10"></div>
      </div>

      {/* Search Section */}
      <div className="p-4 bg-[#426b1f] text-white flex-shrink-0">
        <div className="space-y-3">
          {/* Main Search Bar */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-black outline-none text-sm placeholder:text-gray-500 min-w-0"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-3 bg-[#365a19] hover:bg-[#2d4a15] transition-colors flex-shrink-0 active:bg-[#254012]"
                disabled={!searchTerm.trim() && !locationFilter.trim()}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Location and Filter Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNearMeSearch}
              className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2 hover:bg-white hover:bg-opacity-90 hover:text-[#426b1f] active:bg-white transition-all flex-shrink-0"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap font-medium">Near Me</span>
            </button>

            <button
              onClick={handleLocationToggle}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all flex-shrink-0 ${
                showLocationFilter 
                  ? 'bg-white bg-opacity-90 text-[#426b1f]' 
                  : 'bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-90 hover:text-[#426b1f]'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap font-medium">Location</span>
            </button>

            {showLocationFilter && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Enter city"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-black text-sm outline-none placeholder:text-gray-500 min-w-0"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  autoFocus
                />
                {locationFilter && (
                  <button
                    onClick={clearLocationFilter}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Quick Actions Section - Above Categories */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-[#426b1f] to-[#365a19] rounded-xl p-4 text-white shadow-sm">
            <h3 className="font-medium mb-3 text-base">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={onViewAllProducts}
                className="bg-white bg-opacity-20 rounded-lg py-3 px-2 hover:bg-white hover:bg-opacity-90 hover:text-[#426b1f] active:bg-white active:text-[#426b1f] transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🛍️</div>
                  <span className="text-xs font-medium">Browse All</span>
                </div>
              </button>
              <button
                onClick={() => onCategoryClick('collectibles')}
                className="bg-white bg-opacity-20 rounded-lg py-3 px-2 hover:bg-white hover:bg-opacity-90 hover:text-[#426b1f] active:bg-white active:text-[#426b1f] transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🎯</div>
                  <span className="text-xs font-medium">Auctions</span>
                </div>
              </button>
              <button
                onClick={() => onCategoryClick('precious_metals')}
                className="bg-white bg-opacity-20 rounded-lg py-3 px-2 hover:bg-white hover:bg-opacity-90 hover:text-[#426b1f] active:bg-white active:text-[#426b1f] transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">🥇</div>
                  <span className="text-xs font-medium">Gold & Silver</span>
                </div>
              </button>
              <button
                onClick={() => onCategoryClick('electronics')}
                className="bg-white bg-opacity-20 rounded-lg py-3 px-2 hover:bg-white hover:bg-opacity-90 hover:text-[#426b1f] active:bg-white active:text-[#426b1f] transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1">📱</div>
                  <span className="text-xs font-medium">Electronics</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="px-4 pb-4">
          <h2 className="text-lg font-medium mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onCategoryClick('electronics')}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 active:bg-gray-150 transition-colors h-20 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📱</div>
                <h3 className="font-medium text-sm leading-tight">Electronics</h3>
                <p className="text-xs text-gray-600 mt-1 leading-tight">Phones, Laptops, Gadgets</p>
              </div>
            </button>

            <button
              onClick={() => onCategoryClick('precious_metals')}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 active:bg-gray-150 transition-colors h-20 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🥇</div>
                <h3 className="font-medium text-sm leading-tight">Gold & Silver</h3>
                <p className="text-xs text-gray-600 mt-1 leading-tight">Emergency Funds</p>
              </div>
            </button>

            <button
              onClick={() => onCategoryClick('collectibles')}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 active:bg-gray-150 transition-colors h-20 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <h3 className="font-medium text-sm leading-tight">Collectibles</h3>
                <p className="text-xs text-gray-600 mt-1 leading-tight">Auctions & Rare Items</p>
              </div>
            </button>

            <button
              onClick={onViewAllProducts}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 active:bg-gray-150 transition-colors h-20 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🛍️</div>
                <h3 className="font-medium text-sm leading-tight">All Products</h3>
                <p className="text-xs text-gray-600 mt-1 leading-tight">Browse Everything</p>
              </div>
            </button>
          </div>
        </div>

        {/* Verified Sellers Section */}
        {verifiedProducts.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Verified Sellers</h2>
              <button
                onClick={() => onCategoryClick('precious_metals')}
                className="text-[#426b1f] text-sm font-medium hover:text-[#365a19] transition-colors"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Emergency Funds Available</h2>
              <button
                onClick={() => onCategoryClick('precious_metals')}
                className="text-[#426b1f] text-sm font-medium hover:text-[#365a19] transition-colors"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
        <div className="px-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recently Added</h2>
            <button
              onClick={onViewAllProducts}
              className="text-[#426b1f] text-sm font-medium hover:text-[#365a19] transition-colors"
            >
              View All Products
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
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
}

function ProductCard({
  product,
  onClick,
  onToggleFavorite,
  showVerifiedBadge,
  showUrgentBadge
}: ProductCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(product.id);
  };

  const handleCardClick = () => {
    onClick();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all flex flex-col cursor-pointer">
      <div className="relative flex-shrink-0">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {showVerifiedBadge && (
            <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              ✓ Verified
            </span>
          )}
          {showUrgentBadge && (
            <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              🚨 Urgent
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all flex items-center justify-center shadow-sm z-10"
        >
          <span className={`text-sm ${product.isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            {product.isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex-1 mb-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-tight">{product.name}</h3>
          <p className="text-[#426b1f] font-semibold text-base mb-1">{product.price}</p>
          <p className="text-gray-600 text-xs line-clamp-1">{product.location}</p>
        </div>
        
        <button
          onClick={handleCardClick}
          className="w-full bg-[#426b1f] text-white py-3 rounded-lg hover:bg-[#365a19] active:bg-[#2d4a15] transition-colors text-sm font-medium shadow-sm mt-auto"
        >
          View Product
        </button>
      </div>
    </div>
  );
}