import React from 'react';
import { Home, MessageCircle, Gavel, ShoppingBag, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'chat' | 'auctions' | 'orders' | 'profile';
  onTabClick: (tab: 'home' | 'chat' | 'auctions' | 'orders' | 'profile') => void;
}

export default function BottomNavigation({ activeTab, onTabClick }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'chat' as const, icon: MessageCircle, label: 'Chat' },
    { id: 'auctions' as const, icon: Gavel, label: 'Auctions' },
    { id: 'orders' as const, icon: ShoppingBag, label: 'Orders' },
    { id: 'profile' as const, icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-md bg-white border-t border-gray-200 px-2 py-2 shadow-lg z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex flex-col items-center py-2 px-3 transition-all duration-200 rounded-lg ${
                isActive 
                  ? 'text-[#426b1f] bg-[#426b1f] bg-opacity-15' 
                  : 'text-gray-600 hover:text-[#426b1f] hover:bg-[#426b1f] hover:bg-opacity-10'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}