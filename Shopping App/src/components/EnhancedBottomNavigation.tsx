import React from 'react';

type BottomNavTab = 'home' | 'search' | 'sell' | 'messages' | 'profile';

interface EnhancedBottomNavigationProps {
  activeTab: BottomNavTab;
  onTabClick: (tab: BottomNavTab) => void;
}

const EnhancedBottomNavigation: React.FC<EnhancedBottomNavigationProps> = ({
  activeTab,
  onTabClick,
}) => {
  const navItems = [
    {
      id: 'home' as BottomNavTab,
      label: 'Home',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'search' as BottomNavTab,
      label: 'Search',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'sell' as BottomNavTab,
      label: 'Sell',
      icon: (active: boolean) => (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-blue-600' : 'bg-blue-500'} shadow-lg`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
    },
    {
      id: 'messages' as BottomNavTab,
      label: 'Messages',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'profile' as BottomNavTab,
      label: 'Profile',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 ${
                item.id === 'sell' ? 'relative -top-2' : ''
              }`}
            >
              <div className="mb-1">
                {item.icon(activeTab === item.id)}
              </div>
              <span className={`text-xs font-medium ${
                activeTab === item.id ? 'text-blue-600' : 'text-gray-400'
              } ${item.id === 'sell' ? 'text-white' : ''}`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {activeTab === item.id && item.id !== 'sell' && (
                <div className="absolute bottom-0 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBottomNavigation;
