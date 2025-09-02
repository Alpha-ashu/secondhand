import React, { useState } from "react";
import { ArrowLeft, Edit, Star, Package, MessageCircle, Heart, Eye, Settings, ShoppingBag, TrendingUp, Award, MapPin, Calendar, Phone, Mail, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProfilePageProps {
  onBack: () => void;
  onMenuClick: () => void;
  onVerificationClick?: () => void;
}

export default function ProfilePage({ 
  onBack, 
  onMenuClick,
  onVerificationClick 
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("buyer");

  // Mock user data
  const userProfile = {
    name: "Rajesh Kumar",
    username: "@rajesh_trader",
    avatar: "",
    joinDate: "January 2023",
    location: "Mumbai, Maharashtra",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    verified: false, // Change to false to show verification needed
    rating: 4.8,
    totalReviews: 156,
    verification: {
      identity: false,
      phone: false,
      email: true
    }
  };

  // Mock buyer stats
  const buyerStats = {
    totalPurchases: 23,
    totalSpent: "₹1,24,500",
    activeBids: 3,
    watchlist: 12,
    pendingOrders: 1
  };

  // Mock seller stats  
  const sellerStats = {
    totalSales: 45,
    totalEarned: "₹2,85,000",
    activeListings: 8,
    completedSales: 37,
    rating: 4.9,
    responseTime: "< 2 hours"
  };

  // Mock recent purchases
  const recentPurchases = [
    {
      id: 1,
      name: "iPhone 13 Pro",
      price: "₹65,000",
      date: "Dec 15, 2024",
      status: "Delivered",
      image: "https://images.unsplash.com/photo-1636589343867-f1d643baf04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwc21hcnRwaG9uZSUyMGVsZWN0cm9uaWNzfGVufDF8fHx8MTc1NjU4MTU0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      name: "MacBook Air M1",
      price: "₹75,000",
      date: "Nov 28, 2024",
      status: "Delivered",
      image: "https://images.unsplash.com/photo-1632976032753-2b209dd0a921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbGFwdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU2NTgxNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  // Mock active listings
  const activeListings = [
    {
      id: 1,
      name: "PlayStation 4 Pro",
      price: "₹28,000",
      views: 45,
      watchers: 8,
      image: "https://images.unsplash.com/photo-1718397363345-7a6aeb25f669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwdXNlZHxlbnwxfHx8fDE3NTY1ODE1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      name: "Canon EOS R5",
      price: "₹1,85,000",
      views: 123,
      watchers: 15,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjB2aW50YWdlfGVufDF8fHx8MTc1NjU4NDMyMHww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1>My Profile</h1>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                {userProfile.verified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{userProfile.username}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{userProfile.rating}</span>
                <span className="text-gray-500">({userProfile.totalReviews} reviews)</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Verification Status Alert */}
        {!userProfile.verified && (
          <div className="p-6 border-b border-gray-200">
            <Alert className="border-orange-200 bg-orange-50">
              <Shield className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="flex items-center justify-between">
                  <span>Complete identity verification to access all marketplace features</span>
                  <Button 
                    size="sm" 
                    className="ml-4"
                    onClick={onVerificationClick}
                  >
                    Verify Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Verification Details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userProfile.verification.identity ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {userProfile.verification.identity ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Identity Verification</p>
                  <p className="text-sm text-gray-600">Government ID + Selfie</p>
                </div>
              </div>
              <Badge variant={userProfile.verification.identity ? "secondary" : "destructive"}>
                {userProfile.verification.identity ? "Verified" : "Required"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userProfile.verification.phone ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {userProfile.verification.phone ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Phone Verification</p>
                  <p className="text-sm text-gray-600">OTP Verified</p>
                </div>
              </div>
              <Badge variant={userProfile.verification.phone ? "secondary" : "destructive"}>
                {userProfile.verification.phone ? "Verified" : "Required"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userProfile.verification.email ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {userProfile.verification.email ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-gray-600">Email Confirmed</p>
                </div>
              </div>
              <Badge variant={userProfile.verification.email ? "secondary" : "outline"}>
                {userProfile.verification.email ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
          
          {!userProfile.verified && (
            <Button 
              className="w-full mt-4" 
              onClick={onVerificationClick}
            >
              <Shield className="w-4 h-4 mr-2" />
              Complete Verification
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer" className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Buyer</span>
            </TabsTrigger>
            <TabsTrigger value="seller" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Seller</span>
            </TabsTrigger>
          </TabsList>

          {/* Buyer Tab */}
          <TabsContent value="buyer" className="space-y-6">
            {/* Buyer Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {buyerStats.totalPurchases}
                  </div>
                  <div className="text-sm text-gray-600">Total Purchases</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {buyerStats.totalSpent}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {buyerStats.activeBids}
                  </div>
                  <div className="text-sm text-gray-600">Active Bids</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {buyerStats.watchlist}
                  </div>
                  <div className="text-sm text-gray-600">Watchlist</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Purchases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Recent Purchases</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <ImageWithFallback
                      src={purchase.image}
                      alt={purchase.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{purchase.name}</h4>
                      <p className="text-sm text-gray-600">{purchase.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{purchase.price}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seller Tab */}
          <TabsContent value="seller" className="space-y-6">
            {/* Seller Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {sellerStats.totalSales}
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sellerStats.totalEarned}
                  </div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {sellerStats.activeListings}
                  </div>
                  <div className="text-sm text-gray-600">Active Listings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {sellerStats.rating}
                  </div>
                  <div className="text-sm text-gray-600">Seller Rating</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{sellerStats.completedSales}</div>
                    <div className="text-sm text-gray-600">Completed Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{sellerStats.responseTime}</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Listings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Active Listings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeListings.map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <ImageWithFallback
                      src={listing.image}
                      alt={listing.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{listing.name}</h4>
                      <p className="text-sm text-gray-600">{listing.price}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{listing.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{listing.watchers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{userProfile.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{userProfile.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}