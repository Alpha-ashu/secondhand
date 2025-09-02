import React, { useState, useMemo } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
// import SimpleBackendTest from "./components/SimpleBackendTest";

// Import enhanced components
import EnhancedHomePage from "./components/EnhancedHomePage";
import EnhancedProfilePage from "./components/EnhancedProfilePage";
import EnhancedBottomNavigation from "./components/EnhancedBottomNavigation";
import ResponsiveProductGrid from "./components/ResponsiveProductGrid";

// Import all page components
import HomePage from "./components/HomePageResponsive";
import ProductListPage from "./components/ProductListPageResponsive";
import ProductDetailPage from "./components/ProductDetailPage";
import PlaceholderPage from "./components/PlaceholderPage";
import BiddingPage from "./components/BiddingPage";
import ChatPage from "./components/ChatPage";
import ProfilePage from "./components/ProfilePage";
import UserVerificationPage from "./components/UserVerificationPage";
import Menu from "./components/Menu";
import ViewAllProductsButton from "./components/ViewAllProductsButton";
import BottomNavigation from "./components/BottomNavigation";

// Second-hand marketplace product data with electronics, precious metals, and collectibles
const PRODUCTS = [
  // Electronics Category
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: "$649",
    priceValue: 649,
    category: "electronics",
    condition: "Excellent",
    seller: "TechTrader_Mumbai",
    images: [
      "https://images.unsplash.com/photo-1636589343867-f1d643baf04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwc21hcnRwaG9uZSUyMGVsZWN0cm9uaWNzfGVufDF8fHx8MTc1NjU4MTU0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1587014240932-3a64fbcede2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwbXVsdGlwbGUlMjBhbmdsZXN8ZW58MXx8fHwxNzU2NTgyMzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwc2NyZWVuJTIwZGV0YWlsfGVufDF8fHx8MTc1NjU4MjM2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/4439425/4439425-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "Mint condition iPhone 13 Pro with original box, charger, and screen protector. Battery health: 89%. No scratches or dents.",
    location: "Mumbai, Maharashtra",
    specifications: ["128GB Storage", "6.1-inch Display", "Triple Camera", "Face ID"],
    warranty: "6 months seller warranty",
  },
  {
    id: 2,
    name: "MacBook Air M1",
    price: "$799",
    priceValue: 799,
    category: "electronics",
    condition: "Very Good",
    seller: "LaptopHub_Delhi",
    images: [
      "https://images.unsplash.com/photo-1632976032753-2b209dd0a921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbGFwdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU2NTgxNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1661329818127-010e09a92dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG11bHRpcGxlJTIwdmlld3N8ZW58MXx8fHwxNzU2NTgyMzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/5407745/5407745-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "2020 MacBook Air with M1 chip. Excellent performance for work and creativity. Minor wear on palm rest.",
    location: "New Delhi",
    specifications: ["Apple M1 Chip", "8GB RAM", "256GB SSD", "13.3-inch Display"],
    warranty: "3 months seller warranty",
  },
  {
    id: 3,
    name: "PlayStation 5",
    price: "$449",
    priceValue: 449,
    category: "electronics",
    condition: "Good",
    seller: "GameZone_Bangalore",
    images: [
      "https://images.unsplash.com/photo-1718397363345-7a6aeb25f669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwdXNlZHxlbnwxfHx8fDE3NTY1ODE1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1701281941420-d3ad09f5380c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwZGV0YWlsfGVufDF8fHx8MTc1NjU4MjM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/7003165/7003165-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "PlayStation 5 console with one controller. All original accessories included. Light usage, adult owned.",
    location: "Bangalore, Karnataka",
    specifications: ["825GB SSD", "4K Gaming", "Ray Tracing", "DualSense Controller"],
    warranty: "No warranty",
  },
  
  // Precious Metals Category
  {
    id: 4,
    name: "22K Gold Coins (10g)",
    price: "₹58,500",
    priceValue: 58500,
    category: "precious_metals",
    purity: "22 Karat",
    seller: "PNB Authorized Dealer",
    certification: "RBI Verified",
    images: [
      "https://images.unsplash.com/photo-1633785584922-503ad0e982f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGNvaW5zfGVufDF8fHx8MTc1NjU4MTU1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1751552147774-c374ae8e9910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzU2NTgyMzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/8353721/8353721-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "Authentic 22K gold coins with RBI certification. Perfect for emergency funds or investment. Immediate cash available.",
    location: "Authorized Gold Exchange, Mumbai",
    specifications: ["999.9 Purity", "Hallmarked", "BIS Certified", "Instant Verification"],
    emergencyFund: true,
    processingTime: "Same day cash",
  },
  {
    id: 5,
    name: "Silver Bars (100g)",
    price: "₹7,850",
    priceValue: 7850,
    category: "precious_metals",
    purity: "999 Silver",
    seller: "MMTC Authorized Store",
    certification: "RBI Verified",
    images: [
      "https://images.unsplash.com/photo-1643393669346-7d2e5fb0c18f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBjb2lucyUyMGJ1bGxpb258ZW58MXx8fHwxNzU2NTgxNTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1681108212545-04cabe9cf771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBiYXJzJTIwc3RhY2t8ZW58MXx8fHwxNzU2NTgyMzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/8720219/8720219-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "Pure silver bars with government certification. Quick liquidation for emergency financial needs.",
    location: "MMTC Store, Chennai",
    specifications: ["999 Purity", "Government Certified", "Tamper-Proof", "Instant Valuation"],
    emergencyFund: true,
    processingTime: "2 hours cash",
  },
  
  // Collectibles Category (Bidding Items)
  {
    id: 6,
    name: "Air Jordan 1 Retro High OG",
    currentBid: "₹25,000",
    startingBid: "₹15,000",
    priceValue: 25000,
    category: "collectibles",
    condition: "Deadstock",
    seller: "SneakerVault_Mumbai",
    auctionEnd: "2 days left",
    bidCount: 12,
    images: [
      "https://images.unsplash.com/photo-1587855049254-351f4e55fe2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc25lYWtlcnMlMjBjb2xsZWN0aWJsZXxlbnwxfHx8fDE3NTY1ODE1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1587855049254-351f4e55fe2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGNvbGxlY3Rpb24lMjBkZXRhaWx8ZW58MXx8fHwxNzU2NTgyMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/5842272/5842272-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "Rare Air Jordan 1 in original box, never worn. Size 9 US. Authenticated by StockX. Perfect collector's item.",
    location: "Mumbai, Maharashtra",
    specifications: ["Size 9 US", "Never Worn", "Original Box", "StockX Authenticated"],
    rarity: "Limited Edition",
  },
  {
    id: 7,
    name: "Charizard Base Set Holo",
    currentBid: "₹45,000",
    startingBid: "₹30,000",
    priceValue: 45000,
    category: "collectibles",
    condition: "Near Mint",
    seller: "PokemonMaster_Pune",
    auctionEnd: "5 hours left",
    bidCount: 8,
    images: [
      "https://images.unsplash.com/photo-1664997296099-5a0b63ab0196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlbW9uJTIwY2FyZHMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc1NjQ4NDIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1613771404738-65d22f979710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlbW9uJTIwY2FyZHMlMjBjbG9zZSUyMGRldGFpbHxlbnwxfHx8fDE3NTY1ODIzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/5699823/5699823-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "1999 Base Set Charizard holographic card. Near mint condition with minor edge wear. PSA gradeable.",
    location: "Pune, Maharashtra",
    specifications: ["Base Set Unlimited", "Holographic", "Near Mint", "PSA Ready"],
    rarity: "Iconic Card",
  },
  {
    id: 8,
    name: "Vintage Rolex Submariner",
    price: "₹3,85,000",
    priceValue: 385000,
    category: "electronics",
    condition: "Vintage",
    seller: "LuxuryTimepieces_Delhi",
    images: [
      "https://images.unsplash.com/photo-1546719900-f350ef5d469d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2F0Y2glMjBsdXh1cnl8ZW58MXx8fHwxNzU2NTgxNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/8034772/8034772-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "1985 Rolex Submariner with original papers and box. Service history available. Collectors dream piece.",
    location: "New Delhi",
    specifications: ["Automatic Movement", "Stainless Steel", "Original Papers", "Service Records"],
    warranty: "Seller authenticity guarantee",
  },
  {
    id: 9,
    name: "iPad Pro 11-inch",
    price: "₹45,900",
    priceValue: 45900,
    category: "electronics",
    condition: "Excellent",
    seller: "AppleHub_Chennai",
    images: [
      "https://images.unsplash.com/photo-1610664840481-10b7b43c9283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBpcGFkJTIwdXNlZHxlbnwxfHx8fDE3NTY1ODE1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    video: "https://videos.pexels.com/video-files/8465891/8465891-uhd_2560_1440_25fps.mp4",
    isFavorite: false,
    description: "2021 iPad Pro with M1 chip and Apple Pencil included. Perfect for creative work and productivity.",
    location: "Chennai, Tamil Nadu",
    specifications: ["M1 Chip", "128GB Storage", "11-inch Display", "Apple Pencil Included"],
    warranty: "Apple Care+ until Dec 2024",
  },
];

type SortOption = "default" | "a-z" | "price" | "category";
type CategoryFilter = "all" | "electronics" | "precious_metals" | "collectibles";
type ViewMode =
  | "home"
  | "list"
  | "detail"
  | "bidding"
  | "chat"
  | "newsstand"
  | "about"
  | "profile"
  | "verification"
  | "auctions"
  | "orders";

type BottomNavTab = 'home' | 'search' | 'sell' | 'messages' | 'profile';

interface BidInfo {
  productId: number;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
}



export default function App() {
  const [favorites, setFavorites] = useState(new Set<number>());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState("home");
  const [activeBottomTab, setActiveBottomTab] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);
  const [activeBids, setActiveBids] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || 
        product.category === categoryFilter;
      
      const matchesLocation = !locationFilter || 
        locationFilter === "Near Me" ||
        product.location.toLowerCase().includes(locationFilter.toLowerCase());
        
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Prioritize verified sellers and emergency products
    filtered = filtered.sort((a, b) => {
      // Emergency/urgent products first
      if (a.emergencyFund && !b.emergencyFund) return -1;
      if (!a.emergencyFund && b.emergencyFund) return 1;
      
      // Verified sellers second
      if (a.certification === "RBI Verified" && b.certification !== "RBI Verified") return -1;
      if (a.certification !== "RBI Verified" && b.certification === "RBI Verified") return 1;
      
      return 0;
    });

    switch (sortOption) {
      case "a-z":
        return filtered.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      case "price":
        return filtered.sort(
          (a, b) => a.priceValue - b.priceValue,
        );
      case "category":
        return filtered.sort((a, b) =>
          a.category.localeCompare(b.category),
        );
      default:
        return filtered;
    }
  }, [searchTerm, sortOption, categoryFilter, locationFilter]);

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleCollectibleClick = (product: (typeof PRODUCTS)[0]) => {
    if (product.category === "collectibles") {
      setSelectedProduct(product);
      setViewMode("bidding");
    }
  };

  const placeBid = (productId: number, bidAmount: number) => {
    // Mock bidding functionality
    setActiveBids(prev => {
      const existing = prev.find(bid => bid.productId === productId);
      if (existing) {
        return prev.map(bid => 
          bid.productId === productId 
            ? { ...bid, currentBid: bidAmount, bidCount: bid.bidCount + 1 }
            : bid
        );
      } else {
        return [...prev, {
          productId,
          currentBid: bidAmount,
          bidCount: 1,
          timeLeft: "2 days"
        }];
      }
    });
  };

  // Navigation handlers
  const handleProductClick = (
    product: (typeof PRODUCTS)[0],
  ) => {
    setSelectedProduct(product);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedProduct(null);
  };

  const handleMenuNavigation = (screen: string) => {
    if (screen === "view-all-products") {
      // Clear all filters and show all products
      setSearchTerm("");
      setSortOption("default");
      setCategoryFilter("all");
      setLocationFilter("");
      setViewMode("list");
      setSelectedProduct(null);
    } else if (screen === "home") {
      // Go back to home page
      setSearchTerm("");
      setSortOption("default");
      setCategoryFilter("all");
      setLocationFilter("");
      setViewMode("home");
      setActiveBottomTab("home");
      setSelectedProduct(null);
    } else if (screen === "list") {
      setViewMode("list");
      setSelectedProduct(null);
    } else {
      setViewMode(screen as ViewMode);
      if (screen === "profile") {
        setActiveBottomTab("profile");
      }
      setSelectedProduct(null);
    }
  };

  const handleChatClick = (product: (typeof PRODUCTS)[0]) => {
    setSelectedProduct(product);
    setViewMode("chat");
  };

  const handleVerificationClick = () => {
    setViewMode("verification");
    setSelectedProduct(null);
  };

  const handleViewAllProducts = () => {
    setSearchTerm("");
    setSortOption("default");
    setCategoryFilter("all");
    setLocationFilter("");
    setViewMode("list");
    setSelectedProduct(null);
  };

  const handleHomeSearch = (searchTerm: string, location?: string) => {
    setSearchTerm(searchTerm);
    if (location) {
      setLocationFilter(location);
    }
    setViewMode("list");
    setSelectedProduct(null);
  };

  const handleHomeCategoryClick = (category: string) => {
    setCategoryFilter(category as CategoryFilter);
    setViewMode("list");
    setSelectedProduct(null);
    
    // Update bottom nav if viewing collectibles (auctions)
    if (category === "collectibles") {
      setActiveBottomTab("auctions");
    }
  };

  const handleBackToHome = () => {
    setViewMode("home");
    setActiveBottomTab("home");
    setSelectedProduct(null);
  };

  // Bottom navigation handler
  const handleBottomNavigation = (tab: BottomNavTab) => {
    setActiveBottomTab(tab);
    setSelectedProduct(null);
    
    switch (tab) {
      case 'home':
        // Reset filters when going to home
        setSearchTerm("");
        setSortOption("default");
        setCategoryFilter("all");
        setLocationFilter("");
        setViewMode("home");
        break;
      case 'search':
        // Show product list for searching
        setViewMode("list");
        break;
      case 'sell':
        // Show sell/add product view
        setViewMode("orders"); // Placeholder for now
        break;
      case 'messages':
        // Show a general chat/messages view
        setViewMode("newsstand");
        break;
      case 'profile':
        setViewMode("profile");
        break;
    }
  };

  // Render current view based on viewMode
  const renderCurrentView = () => {
    switch (viewMode) {
      case "home":
        return (
          <EnhancedHomePage
            onMenuClick={() => setIsNavOpen(true)}
            onSearchSubmit={handleHomeSearch}
            onCategoryClick={handleHomeCategoryClick}
            onProductClick={handleProductClick}
            onViewAllProducts={handleViewAllProducts}
            products={PRODUCTS}
            onToggleFavorite={toggleFavorite}
          />
        );

      case "list":
        return (
          <ProductListPage
            products={filteredAndSortedProducts}
            favorites={favorites}
            searchTerm={searchTerm}
            sortOption={sortOption}
            onSearchChange={setSearchTerm}
            onSortChange={setSortOption}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            onToggleFavorite={toggleFavorite}
            onProductClick={(product) => handleProductClick(product as any)}
            onMenuClick={() => setIsNavOpen(true)}
            onChatClick={(product) => handleChatClick(product as any)}
            onCollectibleClick={(product) => handleCollectibleClick(product as any)}
            onBack={handleBackToHome}
          />
        );

      case "detail":
        return selectedProduct ? (
          <>
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => searchTerm || categoryFilter !== "all" || locationFilter ? handleBackToList() : handleBackToHome()}
              onMenuClick={() => setIsNavOpen(true)}
              onChatClick={(product) => handleChatClick(product as any)}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.has(selectedProduct.id)}
              onVerificationClick={handleVerificationClick}
            />
            <ViewAllProductsButton onClick={handleViewAllProducts} />
          </>
        ) : null;

      case "bidding":
        return selectedProduct && selectedProduct.category === "collectibles" ? (
          <>
            <BiddingPage
              product={selectedProduct}
              onBack={() => searchTerm || categoryFilter !== "all" || locationFilter ? handleBackToList() : handleBackToHome()}
              onMenuClick={() => setIsNavOpen(true)}
              onPlaceBid={placeBid}
              activeBids={activeBids}
            />
            <ViewAllProductsButton onClick={handleViewAllProducts} />
          </>
        ) : null;

      case "chat":
        return selectedProduct ? (
          <>
            <ChatPage
              product={selectedProduct}
              onBack={() => searchTerm || categoryFilter !== "all" || locationFilter ? handleBackToList() : handleBackToHome()}
              onMenuClick={() => setIsNavOpen(true)}
            />
            <ViewAllProductsButton onClick={handleViewAllProducts} />
          </>
        ) : null;

      case "profile":
        return (
          <>
            <EnhancedProfilePage
              onBack={handleBackToHome}
              onMenuClick={() => setIsNavOpen(true)}
              onVerificationClick={handleVerificationClick}
            />
            <ViewAllProductsButton onClick={handleViewAllProducts} />
          </>
        );

      case "verification":
        return (
          <UserVerificationPage
            onBack={() => setViewMode("profile")}
            onMenuClick={() => setIsNavOpen(true)}
            onVerificationComplete={(data) => {
              // Handle verification completion
              console.log("Verification completed:", data);
            }}
          />
        );

      case "auctions":
        return (
          <ProductListPage
            products={filteredAndSortedProducts.filter(p => p.category === 'collectibles')}
            favorites={favorites}
            searchTerm={searchTerm}
            sortOption={sortOption}
            onSearchChange={setSearchTerm}
            onSortChange={setSortOption}
            categoryFilter="collectibles"
            onCategoryChange={setCategoryFilter}
            onToggleFavorite={toggleFavorite}
            onProductClick={(product) => handleProductClick(product as any)}
            onMenuClick={() => setIsNavOpen(true)}
            onChatClick={(product) => handleChatClick(product as any)}
            onCollectibleClick={(product) => handleCollectibleClick(product as any)}
            onBack={handleBackToHome}
          />
        );

      case "orders":
        return (
          <>
            <PlaceholderPage
              title="Your Orders"
              onBack={handleBackToHome}
              onMenuClick={() => setIsNavOpen(true)}
              cartCount={0}
            />
            <ViewAllProductsButton onClick={handleViewAllProducts} />
          </>
        );

      case "newsstand":
      case "about":
        return (
          <>
            <PlaceholderPage
              title={
                viewMode === "newsstand"
                  ? "Messages"
                  : "Who we are"
              }
              onBack={handleBackToHome}
              onMenuClick={() => setIsNavOpen(true)}
              cartCount={0}
            />
            <ViewAllProductsButton onClick={handleViewAllProducts} />
          </>
        );

      default:
        return null;
    }
  };

  // Determine if bottom navigation should be shown
  const showBottomNav = !['detail', 'bidding', 'chat', 'verification'].includes(viewMode);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dynamic Responsive Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto min-h-screen bg-white relative overflow-hidden shadow-xl">
        <div className="w-full h-screen overflow-hidden">
          {renderCurrentView()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <EnhancedBottomNavigation
            activeTab={activeBottomTab}
            onTabClick={handleBottomNavigation}
          />
        )}

        {/* Custom Menu */}
        <Menu
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          onNavigate={handleMenuNavigation}
        />
      </div>
    </div>
  );
}