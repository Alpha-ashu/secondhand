import React, { useState } from 'react';
import { ArrowLeft, Grid, List, Search, Filter, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: string;
  currentBid?: string;
  priceValue: number;
  category: string;
  condition?: string;
  seller: string;
  images: string[];
  location: string;
  emergencyFund?: boolean;
  certification?: string;
  isFavorite: boolean;
  bidCount?: number;
  auctionEnd?: string;
}

type SortOption = "default" | "a-z" | "price" | "category";
type CategoryFilter = "all" | "electronics" | "precious_metals" | "collectibles";

interface ProductListPageProps {
  products: Product[];
  favorites: Set<number>;
  searchTerm: string;
  sortOption: SortOption;
  onSearchChange: (term: string) => void;
  onSortChange: (sort: SortOption) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  onToggleFavorite: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onMenuClick: () => void;
  onChatClick: (product: Product) => void;
  onCollectibleClick: (product: Product) => void;
  onBack: () => void;
}

export default function ProductListPage({
  products,
  favorites,
  searchTerm,
  sortOption,
  onSearchChange,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  onToggleFavorite,
  onProductClick,
  onMenuClick,
  onChatClick,
  onCollectibleClick,
  onBack
}: ProductListPageProps) {
  const [isGridView, setIsGridView] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: '🛍️' },
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'precious_metals', label: 'Gold & Silver', icon: '🥇' },
    { value: 'collectibles', label: 'Collectibles', icon: '🎯' }
  ];

  const sortOptions = [
    { value: 'default', label: 'Relevance' },
    { value: 'a-z', label: 'Name A-Z' },
    { value: 'price', label: 'Price Low to High' },
    { value: 'category', label: 'Category' }
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#426b1f] text-white flex-shrink-0">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg font-medium">Products</h1>
        
        <button onClick={onMenuClick} className="p-2">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-gray-50 flex-shrink-0">
        {/* Search Bar */}
        <div className="relative mb-3">
          <div className="flex items-center bg-white rounded-lg border border-gray-200">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 px-4 py-3 text-sm outline-none min-w-0"
            />
            <Search className="w-5 h-5 mx-3 text-gray-400" />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 mb-3">
          {/* Category Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowCategoryFilter(!showCategoryFilter);
                setShowSortOptions(false);
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
            >
              <span className="text-sm">
                {categoryOptions.find(cat => cat.value === categoryFilter)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {showCategoryFilter && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onCategoryChange(option.value as CategoryFilter);
                      setShowCategoryFilter(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowSortOptions(!showSortOptions);
                setShowCategoryFilter(false);
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
            >
              <span className="text-sm">
                {sortOptions.find(sort => sort.value === sortOption)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {showSortOptions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value as SortOption);
                      setShowSortOptions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="bg-white border border-gray-200 rounded-lg p-2"
          >
            {isGridView ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600">
          {products.length} products found
        </p>
      </div>

      {/* Products Grid/List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`p-4 ${isGridView ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
                onChatClick={onChatClick}
                onCollectibleClick={onCollectibleClick}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.has(product.id)}
                isGridView={isGridView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onChatClick: (product: Product) => void;
  onCollectibleClick: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite: boolean;
  isGridView: boolean;
}

function ProductCard({
  product,
  onProductClick,
  onChatClick,
  onCollectibleClick,
  onToggleFavorite,
  isFavorite,
  isGridView
}: ProductCardProps) {
  const getActionButton = () => {
    if (product.category === 'collectibles') {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCollectibleClick(product);
          }}
          className={`w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition-colors text-sm font-medium shadow-sm ${
            isGridView ? 'py-2.5' : 'py-2'
          }`}
        >
          Place Bid
        </button>
      );
    }
    
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onProductClick(product);
        }}
        className={`w-full bg-[#426b1f] hover:bg-[#365a19] active:bg-[#2d4a15] text-white rounded-lg transition-colors text-sm font-medium shadow-sm ${
          isGridView ? 'py-2.5' : 'py-2'
        }`}
      >
        View Product
      </button>
    );
  };

  if (!isGridView) {
    // List View
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all">
        <div className="flex">
          <div className="relative w-32 flex-shrink-0">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            
            {/* Badges for list view */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {product.certification === "RBI Verified" && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium text-center leading-none">
                  ✓
                </span>
              )}
              {product.emergencyFund && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium text-center leading-none">
                  🚨
                </span>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className="absolute top-1 right-1 w-6 h-6 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all flex items-center justify-center shadow-sm z-10"
            >
              <span className={`text-xs ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>
          
          <div className="flex-1 p-3 flex flex-col min-w-0">
            <div className="flex-1 mb-2">
              <h3 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[#426b1f] font-semibold text-sm">
                  {product.category === 'collectibles' ? product.currentBid : product.price}
                </span>
                {product.category === 'collectibles' && product.bidCount && (
                  <span className="text-gray-500 text-xs">
                    ({product.bidCount} bids)
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-xs line-clamp-1">{product.location}</p>
              {product.auctionEnd && (
                <div className="text-xs text-orange-600 font-medium">
                  ⏰ {product.auctionEnd}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <div className="flex-1">
                {getActionButton()}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChatClick(product);
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-250 text-gray-700 rounded-lg transition-colors text-sm font-medium flex-shrink-0"
              >
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all flex flex-col">
      <div className="relative flex-shrink-0">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.certification === "RBI Verified" && (
            <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              ✓ Verified
            </span>
          )}
          {product.emergencyFund && (
            <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              🚨 Urgent
            </span>
          )}
          {product.condition && (
            <Badge variant="outline" className="text-xs px-3 py-1.5 bg-white shadow-sm border-gray-300">
              {product.condition}
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all flex items-center justify-center shadow-sm z-10"
        >
          <span className={`text-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex-1 mb-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[#426b1f] font-semibold text-base">
              {product.category === 'collectibles' ? product.currentBid : product.price}
            </span>
            {product.category === 'collectibles' && product.bidCount && (
              <span className="text-gray-500 text-xs">
                ({product.bidCount} bids)
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-xs mb-1 line-clamp-1">{product.seller}</p>
          
          {product.auctionEnd && (
            <div className="text-xs text-orange-600 font-medium mb-1">
              ⏰ {product.auctionEnd}
            </div>
          )}
        </div>
        
        <div className="space-y-2 flex-shrink-0">
          {getActionButton()}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChatClick(product);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-250 text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Chat with Seller
          </button>
        </div>
      </div>
    </div>
  );
}