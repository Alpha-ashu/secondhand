import React, { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Shield, MapPin, Clock, Award, Play, Pause, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: number;
  name: string;
  price?: string;
  currentBid?: string;
  priceValue: number;
  category: string;
  condition?: string;
  seller: string;
  images: string[];
  video: string;
  isFavorite: boolean;
  description: string;
  location: string;
  specifications?: string[];
  warranty?: string;
  purity?: string;
  certification?: string;
  auctionEnd?: string;
  bidCount?: number;
  rarity?: string;
  emergencyFund?: boolean;
  processingTime?: string;
}

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onMenuClick: () => void;
  onChatClick?: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite: boolean;
  onVerificationClick?: () => void;
}

export default function ProductDetailPage({
  product,
  onBack,
  onMenuClick,
  onChatClick,
  onToggleFavorite,
  isFavorite,
  onVerificationClick
}: ProductDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);
  
  // Mock user verification status - in real app, this would come from user context
  const isUserVerified = false;

  // Create combined media array (images + video)
  const allMedia = [
    ...product.images.map((url, index) => ({ type: 'image', url, index })),
    { type: 'video', url: product.video, index: product.images.length }
  ];
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleToggleFavorite = () => {
    onToggleFavorite(product.id);
  };

  const handleChatClick = () => {
    if (!isUserVerified) {
      setShowVerificationWarning(true);
      return;
    }
    onChatClick?.(product);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "electronics":
        return "bg-blue-100 text-blue-800";
      case "precious_metals":
        return "bg-yellow-100 text-yellow-800";
      case "collectibles":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
      case "deadstock":
      case "near mint":
        return "text-green-600";
      case "very good":
      case "good":
        return "text-blue-600";
      case "vintage":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold line-clamp-1">{product.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button onClick={onMenuClick} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Media Gallery Section */}
        <div className="relative h-80">
          {/* Main Media Display */}
          {currentMedia.type === 'image' ? (
            <ImageWithFallback
              src={currentMedia.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full bg-black">
              <video
                src={currentMedia.url}
                className="w-full h-full object-cover"
                controls={false}
                autoPlay={isVideoPlaying}
                loop
                muted
                playsInline
              />
              {/* Video Play/Pause Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                onClick={handleVideoToggle}
              >
                <div className="bg-white/90 rounded-full p-3">
                  {isVideoPlaying ? (
                    <Pause className="w-8 h-8 text-black" />
                  ) : (
                    <Play className="w-8 h-8 text-black ml-1" />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={goToPreviousMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Media Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {allMedia.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`relative w-3 h-3 rounded-full transition-all ${
                  index === currentMediaIndex ? "bg-white scale-110" : "bg-white/50"
                }`}
              >
                {media.type === 'video' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Media Thumbnails Strip */}
          <div className="absolute bottom-16 left-4 right-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentMediaIndex ? "border-white scale-110" : "border-white/50"
                  }`}
                >
                  {media.type === 'image' ? (
                    <ImageWithFallback
                      src={media.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={getCategoryColor(product.category)}>
              {product.category.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Special Badges */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {product.certification && (
              <Badge className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                {product.certification}
              </Badge>
            )}
            {product.rarity && (
              <Badge className="bg-purple-100 text-purple-800">
                <Award className="w-3 h-3 mr-1" />
                {product.rarity}
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Price and Condition */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-green-600">
                {product.price || product.currentBid}
              </h2>
              {product.currentBid && (
                <p className="text-sm text-gray-600">
                  Current bid • {product.bidCount} bids • {product.auctionEnd}
                </p>
              )}
            </div>
            {product.condition && (
              <Badge variant="outline" className={getConditionColor(product.condition)}>
                {product.condition}
              </Badge>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {product.seller.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{product.seller}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleChatClick}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">• {spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-3 mb-6">
            {product.warranty && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>{product.warranty}</span>
              </div>
            )}
            {product.purity && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>Purity: {product.purity}</span>
              </div>
            )}
            {product.processingTime && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Processing: {product.processingTime}</span>
              </div>
            )}
          </div>

          {/* Emergency Fund Badge */}
          {product.emergencyFund && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <p className="text-sm text-yellow-800 font-medium">
                ⚡ Emergency Fund Ready - Quick cash conversion available
              </p>
            </div>
          )}

          {/* Verification Warning */}
          {showVerificationWarning && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Identity verification required</p>
                    <p className="text-sm">Complete verification to contact sellers and access all features</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="ml-4"
                    onClick={() => {
                      setShowVerificationWarning(false);
                      onVerificationClick?.();
                    }}
                  >
                    Verify Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {product.category === "collectibles" ? (
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => {
              if (!isUserVerified) {
                setShowVerificationWarning(true);
                return;
              }
              // Navigate to bidding
            }}
          >
            {!isUserVerified ? (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify to Bid • {product.currentBid}
              </>
            ) : (
              <>Place Bid • {product.currentBid}</>
            )}
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleChatClick}
            >
              {!isUserVerified ? (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify to Contact
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={handleToggleFavorite}
              className={`px-6 ${isFavorite ? 'text-red-500 border-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}