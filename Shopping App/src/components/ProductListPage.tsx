import React from 'react';
import StatusBar from './shared/StatusBar';
import svgPaths from "../imports/svg-s5y93igtx2";
import clsx from "clsx";
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Product {
  id: number;
  name: string;
  price?: string;
  currentBid?: string;
  priceValue: number;
  category: string;
  condition?: string;
  purity?: string;
  seller: string;
  certification?: string;
  auctionEnd?: string;
  bidCount?: number;
  images: string[];
  isFavorite: boolean;
  description: string;
  location: string;
  specifications?: string[];
  warranty?: string;
  emergencyFund?: boolean;
  processingTime?: string;
  rarity?: string;
}

type SortOption = 'default' | 'a-z' | 'price' | 'category';
type CategoryFilter = 'all' | 'electronics' | 'precious_metals' | 'collectibles';
type ViewMode = 'list' | 'grid';

interface ProductListPageProps {
  products: Product[];
  favorites: Set<number>;
  searchTerm: string;
  sortOption: SortOption;
  categoryFilter: CategoryFilter;
  onSearchChange: (term: string) => void;
  onSortChange: (option: SortOption) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onToggleFavorite: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onMenuClick: () => void;
  onChatClick?: (product: Product) => void;
  onCollectibleClick?: (product: Product) => void;
  onBack?: () => void;
}

export default function ProductListPage({
  products,
  favorites,
  searchTerm,
  sortOption,
  categoryFilter,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  onToggleFavorite,
  onProductClick,
  onMenuClick,
  onChatClick,
  onCollectibleClick,
  onBack
}: ProductListPageProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('list');

  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <Header 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortOption={sortOption}
        onSortChange={onSortChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        onMenuClick={onMenuClick}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBack={onBack}
      />
      
      {/* Content */}
      <Content 
        products={products}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onProductClick={onProductClick}
        onChatClick={onChatClick}
        onCollectibleClick={onCollectibleClick}
        viewMode={viewMode}
      />
    </div>
  );
}

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  onMenuClick: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onBack?: () => void;
}

function Header({ searchTerm, onSearchChange, sortOption, onSortChange, categoryFilter, onCategoryChange, onMenuClick, viewMode, onViewModeChange, onBack }: HeaderProps) {
  return (
    <div className="absolute bg-[#ffffff] h-[260px] left-0 right-0 top-0">
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]" />
      
      {/* Mobile Nav */}
      <div className="absolute bg-[#ffffff] h-16 left-0 overflow-clip right-0 top-[31px]">
        <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[393px]" />
        <div
          className="absolute css-v5bt0j flex flex-col font-['Newsreader:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#426b1f] text-[24px] text-center text-nowrap top-9 tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]"
          style={{ left: "calc(50% - 0.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-none whitespace-pre text-[24px]">SecondLife Market</p>
        </div>
        
        {/* Wishlist Icon */}
        <div className="absolute right-5 rounded-2xl size-8 top-[18px] flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        {/* Back/Menu Icon */}
        <button 
          onClick={onBack || onMenuClick}
          className="absolute left-5 rounded-2xl size-8 top-[18px] flex items-center justify-center"
        >
          {onBack ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          ) : (
            <div className="h-1.5 w-[18px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
                <g>
                  <line stroke="var(--stroke-0, black)" strokeWidth="1.5" x2="18" y1="1.25" y2="1.25" />
                  <line stroke="var(--stroke-0, black)" strokeWidth="1.5" x2="18" y1="7.25" y2="7.25" />
                </g>
              </svg>
            </div>
          )}
        </button>
      </div>
      
      {/* Sub Nav */}
      <div className="absolute left-6 right-4 top-[103px]">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
          {/* Breadcrumb and Search */}
          <div className="relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative w-full">
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                <div className="box-border content-stretch flex flex-row font-['Newsreader:Regular',_sans-serif] font-normal gap-0.5 items-start justify-start leading-[0] p-0 relative text-[24px] text-left text-nowrap tracking-[-0.48px] w-full">
                  <div className="css-eomsl1 flex flex-col justify-center relative shrink-0 text-[#757575]">
                    <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre text-[24px]">All Categories</p>
                  </div>
                  <div className="css-eomsl1 flex flex-col justify-center relative shrink-0 text-[#757575]">
                    <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre text-[24px]">/</p>
                  </div>
                  <div className="css-ip39ex flex flex-col justify-center relative shrink-0 text-[#000000]">
                    <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre text-[24px]">
                      {categoryFilter === 'all' ? 'All' : 
                       categoryFilter === 'electronics' ? 'Electronics' :
                       categoryFilter === 'precious_metals' ? 'Precious Metals' : 'Collectibles'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="size-8 relative shrink-0">
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="absolute right-0 top-0 w-8 h-8 p-0 border-0 bg-transparent text-transparent placeholder:text-transparent focus:w-[200px] focus:text-black focus:placeholder:text-gray-400 transition-all duration-200 ease-in-out focus:bg-white focus:border focus:border-gray-200 focus:rounded-md focus:px-3"
                />
                <svg className="absolute inset-0 size-8 pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                  <g>
                    <path d={svgPaths.p14ffce80} fill="var(--fill-0, black)" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => onCategoryChange('all')}
                className={clsx(
                  "relative rounded-xl shrink-0 whitespace-nowrap",
                  categoryFilter === 'all' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-1.5 relative">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <div className={clsx(
                    "text-[12px] font-medium",
                    categoryFilter === 'all' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    All Items
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onCategoryChange('electronics')}
                className={clsx(
                  "relative rounded-xl shrink-0 whitespace-nowrap",
                  categoryFilter === 'electronics' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-1.5 relative">
                  <div className={clsx(
                    "text-[12px] font-medium",
                    categoryFilter === 'electronics' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    Electronics
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onCategoryChange('precious_metals')}
                className={clsx(
                  "relative rounded-xl shrink-0 whitespace-nowrap",
                  categoryFilter === 'precious_metals' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-1.5 relative">
                  <div className={clsx(
                    "text-[12px] font-medium",
                    categoryFilter === 'precious_metals' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    Gold & Silver
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onCategoryChange('collectibles')}
                className={clsx(
                  "relative rounded-xl shrink-0 whitespace-nowrap",
                  categoryFilter === 'collectibles' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-1.5 relative">
                  <div className={clsx(
                    "text-[12px] font-medium",
                    categoryFilter === 'collectibles' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    Collectibles
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Sort Options and View Toggle */}
          <div className="relative shrink-0 flex flex-row items-center justify-between w-full">
            <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative">
              <button
                onClick={() => onSortChange('default')}
                className={clsx(
                  "relative rounded-xl shrink-0",
                  sortOption === 'default' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative">
                  <div className={clsx(
                    "css-79j43w flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px]",
                    sortOption === 'default' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">Default</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onSortChange('a-z')}
                className={clsx(
                  "relative rounded-xl shrink-0",
                  sortOption === 'a-z' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative">
                  <div className={clsx(
                    "css-k6fayy flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px]",
                    sortOption === 'a-z' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">A-Z</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onSortChange('price')}
                className={clsx(
                  "relative rounded-xl shrink-0",
                  sortOption === 'price' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative">
                  <div className={clsx(
                    "css-k6fayy flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px]",
                    sortOption === 'price' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">Price</p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex flex-row gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('list')}
                className={clsx(
                  "rounded-md p-2 transition-colors",
                  viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={clsx(
                  "rounded-md p-2 transition-colors",
                  viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContentProps {
  products: Product[];
  favorites: Set<number>;
  onToggleFavorite: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onChatClick?: (product: Product) => void;
  onCollectibleClick?: (product: Product) => void;
  viewMode: ViewMode;
}

function Content({ products, favorites, onToggleFavorite, onProductClick, onChatClick, onCollectibleClick, viewMode }: ContentProps) {
  if (viewMode === 'grid') {
    return (
      <div className="absolute left-0 right-0 top-[284px] bottom-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 px-4 py-4">
          {products.map((product) => (
            <GridProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.has(product.id)}
              onToggleFavorite={() => onToggleFavorite(product.id)}
              onClick={() => onProductClick(product)}
              onChatClick={() => onChatClick?.(product)}
              onCollectibleClick={() => onCollectibleClick?.(product)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-[284px] bottom-4 overflow-y-auto">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start relative w-full px-4 py-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.has(product.id)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
            onClick={() => onProductClick(product)}
            onChatClick={() => onChatClick?.(product)}
            onCollectibleClick={() => onCollectibleClick?.(product)}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  onChatClick: () => void;
  onCollectibleClick: () => void;
}

function ProductCard({ product, isFavorite, onToggleFavorite, onClick, onChatClick, onCollectibleClick }: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics': return 'bg-blue-100 text-blue-800';
      case 'precious_metals': return 'bg-yellow-100 text-yellow-800';
      case 'collectibles': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'electronics': return 'Electronics';
      case 'precious_metals': return 'Precious Metals';
      case 'collectibles': return 'Collectibles';
      default: return category;
    }
  };

  const getActionButton = () => {
    if (product.category === 'collectibles') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCollectibleClick();
          }}
          className="absolute bg-purple-600 bottom-2 right-2 rounded-lg px-3 py-1 flex items-center justify-center"
        >
          <span className="text-white text-[10px] font-medium">BID</span>
        </button>
      );
    } else if (product.category === 'precious_metals') {
      return (
        <div className="absolute bg-yellow-600 bottom-2 right-2 rounded-lg px-2 py-1 flex items-center justify-center">
          <span className="text-white text-[10px] font-medium">CONTACT SELLER</span>
        </div>
      );
    } else {
      return (
        <div className="absolute bg-gray-500 bottom-2 right-2 rounded-lg px-2 py-1 flex items-center justify-center">
          <span className="text-white text-[10px] font-medium">CONTACT SELLER</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#ffffff] relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] shrink-0 w-full rounded-[12px] h-[120px]">
      <div className="box-border content-stretch flex flex-row items-center justify-start overflow-clip p-0 relative w-full h-full">
        {/* Product Image */}
        <div
          className="bg-[#ffffff] relative flex-shrink-0 w-[100px] h-full cursor-pointer rounded-l-[12px]"
          style={{
            backgroundImage: `url('${product.images[0]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={onClick}
        >
          <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getCategoryColor(product.category)} text-[9px] px-1.5 py-0.5 font-medium`}>
              {getCategoryLabel(product.category)}
            </Badge>
          </div>
          
          {/* Verification Badge for Precious Metals */}
          {product.certification && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-green-100 text-green-800 text-[8px] px-1 py-0.5 font-medium">
                ✓ RBI
              </Badge>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex-1 relative h-full cursor-pointer flex flex-col justify-center" onClick={onClick}>
          <div className="px-4 py-3 h-full flex flex-col justify-center">
            <div className="space-y-1">
              <h3 className="font-medium text-[14px] line-clamp-2 text-[#000000] leading-[1.3]">
                {product.name}
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-[#426b1f] font-medium text-[14px]">
                  {product.category === 'collectibles' ? product.currentBid : product.price}
                </span>
                {product.category === 'collectibles' && product.bidCount && (
                  <span className="text-[#757575] text-[10px]">
                    ({product.bidCount} bids)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#757575] text-[12px] leading-[1.4]">{product.seller}</span>
                {product.condition && (
                  <Badge variant="outline" className="text-[8px] px-1 py-0.5 h-fit">
                    {product.condition}
                  </Badge>
                )}
                {product.emergencyFund && (
                  <Badge className="bg-red-100 text-red-800 text-[8px] px-1 py-0.5 h-fit">
                    Emergency Fund
                  </Badge>
                )}
              </div>
              {product.auctionEnd && (
                <div className="text-[10px] text-orange-600 font-medium">
                  ⏰ {product.auctionEnd}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Side Buttons */}
        <div className="relative w-16 h-full flex flex-col items-center justify-start pt-2 space-y-2">
          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <HeartIcon filled={isFavorite} />
          </button>
          
          {/* Chat Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChatClick();
            }}
            className="bg-blue-500 hover:bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
        
        {/* Action Button */}
        <div className="absolute bottom-2 right-2">
          {getActionButton()}
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <div className="size-8">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          {filled ? (
            <>
              <path
                d={svgPaths.p297cea80}
                fill="var(--fill-0, #FF8577)"
                fillOpacity="0.98"
              />
              <path
                d={svgPaths.p3bfbe380}
                fill="var(--fill-0, #FF8577)"
                fillOpacity="0.98"
              />
            </>
          ) : (
            <>
              <path
                d={svgPaths.p1177b300}
                stroke="var(--stroke-0, black)"
              />
              <path
                d={svgPaths.p1d24580}
                fill="var(--fill-0, #FF8577)"
                fillOpacity="0.98"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

// Grid view product card component
function GridProductCard({ product, isFavorite, onToggleFavorite, onClick, onChatClick, onCollectibleClick }: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics': return 'bg-blue-100 text-blue-800';
      case 'precious_metals': return 'bg-yellow-100 text-yellow-800';
      case 'collectibles': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'electronics': return 'Electronics';
      case 'precious_metals': return 'Precious Metals';
      case 'collectibles': return 'Collectibles';
      default: return category;
    }
  };

  const getActionButton = () => {
    if (product.category === 'collectibles') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCollectibleClick();
          }}
          className="absolute bg-purple-600 bottom-1 right-1 rounded-md px-2 py-1 flex items-center justify-center"
        >
          <span className="text-white text-[8px] font-medium">BID</span>
        </button>
      );
    } else if (product.category === 'precious_metals') {
      return (
        <div className="absolute bg-yellow-600 bottom-1 right-1 rounded-md px-1 py-1 flex items-center justify-center">
          <span className="text-white text-[7px] font-medium">CONTACT</span>
        </div>
      );
    } else {
      return (
        <div className="absolute bg-gray-500 bottom-1 right-1 rounded-md px-1 py-1 flex items-center justify-center">
          <span className="text-white text-[7px] font-medium">CONTACT</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#ffffff] relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] rounded-[12px] overflow-hidden">
      {/* Product Image */}
      <div
        className="relative w-full h-32 cursor-pointer"
        style={{
          backgroundImage: `url('${product.images[0]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={onClick}
      >
        {/* Category Badge */}
        <div className="absolute top-1 left-1">
          <Badge className={`${getCategoryColor(product.category)} text-[8px] px-1 py-0.5`}>
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        
        {/* Verification Badge for Precious Metals */}
        {product.certification && (
          <div className="absolute bottom-1 left-1">
            <Badge className="bg-green-100 text-green-800 text-[7px] px-1 py-0.5">
              ✓ RBI
            </Badge>
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute right-1 top-1 size-6"
        >
          <div className="size-6">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g>
                {isFavorite ? (
                  <>
                    <path
                      d={svgPaths.p297cea80}
                      fill="var(--fill-0, #FF8577)"
                      fillOpacity="0.98"
                    />
                    <path
                      d={svgPaths.p3bfbe380}
                      fill="var(--fill-0, #FF8577)"
                      fillOpacity="0.98"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d={svgPaths.p1177b300}
                      stroke="var(--stroke-0, white)"
                      strokeWidth="2"
                    />
                    <path
                      d={svgPaths.p1d24580}
                      fill="var(--fill-0, #FF8577)"
                      fillOpacity="0.98"
                    />
                  </>
                )}
              </g>
            </svg>
          </div>
        </button>

        {/* Chat Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChatClick();
          }}
          className="absolute right-1 top-8 bg-blue-500 hover:bg-blue-600 rounded-full size-5 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* Action Button */}
        {getActionButton()}
      </div>
      
      {/* Product Info */}
      <div className="p-2 cursor-pointer" onClick={onClick}>
        <div className="text-[12px] font-medium text-black truncate">
          {product.name}
        </div>
        <div className="text-[14px] font-medium text-[#426b1f] mt-1">
          {product.category === 'collectibles' ? product.currentBid : product.price}
          {product.category === 'collectibles' && product.bidCount && (
            <span className="text-[#757575] text-[8px] ml-1">
              ({product.bidCount} bids)
            </span>
          )}
        </div>
        <div className="text-[10px] text-[#757575] mt-1 flex items-center gap-1">
          <span className="truncate">{product.seller}</span>
          {product.condition && (
            <Badge variant="outline" className="text-[7px] px-1 py-0.5">
              {product.condition}
            </Badge>
          )}
        </div>
        {product.emergencyFund && (
          <Badge className="bg-red-100 text-red-800 text-[7px] px-1 py-0.5 mt-1">
            Emergency Fund
          </Badge>
        )}
        {product.auctionEnd && (
          <div className="text-[8px] text-orange-600 font-medium mt-1">
            ⏰ {product.auctionEnd}
          </div>
        )}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="size-8">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          <path d={svgPaths.p367b3d00} fill="var(--fill-0, white)" />
        </g>
      </svg>
    </div>
  );
}