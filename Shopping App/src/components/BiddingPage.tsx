import React, { useState } from 'react';
import StatusBar from './shared/StatusBar';
import svgPaths from "../imports/svg-s5y93igtx2";
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Pause, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  currentBid?: string;
  startingBid?: string;
  priceValue: number;
  category: string;
  condition?: string;
  seller: string;
  auctionEnd?: string;
  bidCount?: number;
  images: string[];
  video: string;
  description: string;
  location: string;
  specifications?: string[];
  rarity?: string;
}

interface BidInfo {
  productId: number;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
}

interface BiddingPageProps {
  product: Product;
  activeBids: BidInfo[];
  onBack: () => void;
  onMenuClick: () => void;
  onPlaceBid: (productId: number, bidAmount: number) => void;
  onChatClick?: (product: Product) => void;
}

export default function BiddingPage({
  product,
  activeBids,
  onBack,
  onMenuClick,
  onPlaceBid,
  onChatClick
}: BiddingPageProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [showBidSuccess, setShowBidSuccess] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Create combined media array (images + video)
  const allMedia = [
    ...product.images.map((url, index) => ({ type: 'image', url, index })),
    { type: 'video', url: product.video, index: product.images.length }
  ];

  const currentBidInfo = activeBids.find(bid => bid.productId === product.id);
  const displayBid = currentBidInfo ? 
    `₹${currentBidInfo.currentBid.toLocaleString()}` : 
    product.currentBid || product.startingBid || '₹0';
  const displayBidCount = currentBidInfo?.bidCount || product.bidCount || 0;
  const minBidAmount = currentBidInfo ? 
    currentBidInfo.currentBid + 1000 : 
    (product.priceValue + 1000);

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount.replace(/[^\d]/g, ''));
    if (amount >= minBidAmount) {
      onPlaceBid(product.id, amount);
      setShowBidSuccess(true);
      setBidAmount('');
      setTimeout(() => setShowBidSuccess(false), 3000);
    }
  };

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const goToPreviousMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  const goToNextMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === allMedia.length - 1 ? 0 : prev + 1
    );
  };

  const currentMedia = allMedia[currentMediaIndex];

  const handleChatClick = () => {
    onChatClick?.(product);
  };

  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <div className="absolute bg-[#ffffff] h-16 left-0 right-0 top-[31px]">
        <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[393px]" />
        <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]" />
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute left-5 rounded-2xl size-8 top-[18px] flex items-center justify-center"
        >
          <div className="size-8">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g>
                <path d="M20 8L12 16L20 24" stroke="black" strokeWidth="2" fill="none"/>
              </g>
            </svg>
          </div>
        </button>
        
        {/* Title */}
        <div
          className="absolute css-v5bt0j flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#000000] text-[18px] text-center text-nowrap top-9 tracking-[-0.18px] translate-x-[-50%] translate-y-[-50%]"
          style={{ left: "calc(50% - 0.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-none whitespace-pre">Bidding</p>
        </div>
        
        {/* Chat and Menu Icons */}
        <div className="absolute right-5 top-[18px] flex items-center gap-2">
          <button 
            onClick={handleChatClick}
            className="rounded-2xl size-8 flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={onMenuClick}
            className="rounded-2xl size-8 flex items-center justify-center"
          >
            <div className="h-1.5 w-[18px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
                <g>
                  <line stroke="var(--stroke-0, black)" strokeWidth="1.5" x2="18" y1="1.25" y2="1.25" />
                  <line stroke="var(--stroke-0, black)" strokeWidth="1.5" x2="18" y1="7.25" y2="7.25" />
                </g>
              </svg>
            </div>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute left-0 right-0 top-[111px] bottom-0 overflow-y-auto">
        <div className="px-6 py-4">
          {/* Product Image */}
          <div className="relative mb-6">
            <div 
              className="w-full aspect-square rounded-[12px] bg-cover bg-center relative"
              style={{ backgroundImage: `url('${product.images[0]}')` }}
            >
              <div className="absolute top-3 left-3">
                <Badge className="bg-purple-100 text-purple-800 text-[12px]">
                  {product.category === 'collectibles' ? 'Collectible' : 'Auction'}
                </Badge>
              </div>
              
              {product.rarity && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[12px]">
                    {product.rarity}
                  </Badge>
                </div>
              )}
              
              {/* Auction Timer */}
              <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-2 rounded-lg">
                <div className="text-[12px] font-medium">
                  ⏰ {product.auctionEnd || '2 days left'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="mb-6">
            <h1 className="text-[20px] font-medium text-[#000000] mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-[12px]">
                {product.condition}
              </Badge>
              <Badge variant="outline" className="text-[12px]">
                {product.seller}
              </Badge>
            </div>
            <p className="text-[14px] text-[#757575] leading-[1.4] mb-4">
              {product.description}
            </p>
            
            {/* Specifications */}
            {product.specifications && (
              <div className="mb-4">
                <h3 className="text-[14px] font-medium text-[#000000] mb-2">Specifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.specifications.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-[10px]">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Current Bid Info */}
          <div className="bg-[#f8f9fa] rounded-[12px] p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-[12px] text-[#757575] mb-1">Current Bid</div>
                <div className="text-[24px] font-medium text-[#426b1f]">{displayBid}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#757575] mb-1">Total Bids</div>
                <div className="text-[18px] font-medium text-[#000000]">{displayBidCount}</div>
              </div>
            </div>
            
            <div className="text-[12px] text-[#757575]">
              Minimum next bid: ₹{minBidAmount.toLocaleString()}
            </div>
          </div>
          
          {/* Bidding Section */}
          <div className="bg-[#ffffff] border border-[#e1e1e1] rounded-[12px] p-4 mb-6">
            <h3 className="text-[16px] font-medium text-[#000000] mb-3">Place Your Bid</h3>
            
            <div className="mb-4">
              <Input
                type="text"
                placeholder={`₹${minBidAmount.toLocaleString()}`}
                value={bidAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setBidAmount(value ? `₹${parseInt(value).toLocaleString()}` : '');
                }}
                className="text-[16px] h-12"
              />
            </div>
            
            <Button 
              onClick={handlePlaceBid}
              disabled={!bidAmount || parseInt(bidAmount.replace(/[^\d]/g, '')) < minBidAmount}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Place Bid
            </Button>
            
            <div className="text-[12px] text-[#757575] mt-2 text-center">
              Your bid is binding and cannot be withdrawn
            </div>
          </div>
          
          {/* Bid History */}
          <div className="bg-[#ffffff] border border-[#e1e1e1] rounded-[12px] p-4">
            <h3 className="text-[16px] font-medium text-[#000000] mb-3">Recent Bids</h3>
            
            <div className="space-y-3">
              {[...Array(displayBidCount > 0 ? Math.min(displayBidCount, 5) : 1)].map((_, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-[#f0f0f0] last:border-b-0">
                  <div className="text-[14px] text-[#000000]">
                    User***{Math.floor(Math.random() * 100)}
                  </div>
                  <div className="text-[14px] font-medium text-[#426b1f]">
                    ₹{(parseInt(displayBid.replace(/[^\d]/g, '')) - (index * 1000)).toLocaleString()}
                  </div>
                  <div className="text-[12px] text-[#757575]">
                    {index === 0 ? 'Current' : `${index + 1}h ago`}
                  </div>
                </div>
              ))}
              
              {displayBidCount === 0 && (
                <div className="text-center text-[#757575] py-4">
                  No bids yet. Be the first to bid!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bid Success Notification */}
      {showBidSuccess && (
        <div className="absolute top-[120px] left-6 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <div className="font-medium">Bid Placed Successfully!</div>
              <div className="text-[12px] opacity-90">You'll be notified if you're outbid</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}