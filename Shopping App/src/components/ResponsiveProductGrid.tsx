import React from 'react';
import { Product } from '../services/api';

interface ResponsiveProductGridProps {
  products: Product[];
  favorites: Set<number>;
  onProductClick: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  onChatClick?: (product: Product) => void;
  onCollectibleClick?: (product: Product) => void;
}

const ResponsiveProductGrid: React.FC<ResponsiveProductGridProps> = ({
  products,
  favorites,
  onProductClick,
  onToggleFavorite,
  onChatClick,
  onCollectibleClick,
}) => {
  const handleProductClick = (product: Product) => {
    if (product.category === 'collectibles' && onCollectibleClick) {
      onCollectibleClick(product);
    } else {
      onProductClick(product);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Product Image */}
          <div className="relative aspect-square">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => handleProductClick(product)}
            />
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
            >
              <svg
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                }`}
                fill={favorites.has(product.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.category === 'electronics' 
                  ? 'bg-blue-100 text-blue-800'
                  : product.category === 'precious_metals'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {product.category === 'electronics' ? 'Tech' : 
                 product.category === 'precious_metals' ? 'Gold' : 'Auction'}
              </span>
            </div>

            {/* Emergency Fund Badge */}
            {product.emergencyFund && (
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Emergency
                </span>
              </div>
            )}

            {/* Auction Timer */}
            {product.category === 'collectibles' && product.auctionEnd && (
              <div className="absolute bottom-2 right-2">
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {product.auctionEnd}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 md:p-4">
            <h3 
              className="font-semibold text-sm md:text-base text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
              onClick={() => handleProductClick(product)}
            >
              {product.name}
            </h3>
            
            <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-1">
              {product.condition}
            </p>

            {/* Price */}
            <div className="mb-3">
              {product.category === 'collectibles' ? (
                <div>
                  <p className="text-lg md:text-xl font-bold text-green-600">
                    {product.currentBid}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.bidCount} bids
                  </p>
                </div>
              ) : (
                <p className="text-lg md:text-xl font-bold text-green-600">
                  {product.price}
                </p>
              )}
            </div>

            {/* Location */}
            <p className="text-xs text-gray-500 mb-3 line-clamp-1">
              📍 {product.location}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleProductClick(product)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-xs md:text-sm font-medium transition-colors"
              >
                {product.category === 'collectibles' ? 'Bid Now' : 'View'}
              </button>
              
              {onChatClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatClick(product);
                  }}
                  className="p-2 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Seller Info */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center">
                <span className="truncate">{product.seller}</span>
                {product.certification === 'RBI Verified' && (
                  <svg className="w-3 h-3 text-green-500 ml-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResponsiveProductGrid;
