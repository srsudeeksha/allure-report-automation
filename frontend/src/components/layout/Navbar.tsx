// components/layout/Navbar.tsx
// Side navigation bar with main app links

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud, MessageSquare, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Navigation item interface
 */
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * Navbar component with navigation links
 * Positioned on the left side of the app
 */
const Navbar: React.FC = () => {
  /**
   * Navigation items configuration
   */
  const navItems: NavItem[] = [
    {
      title: 'Weather Dashboard',
      href: '/home',
      icon: <Cloud className="h-5 w-5" />,
    },
    {
      title: 'Chat with AI',
      href: '/chat',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'My Friends',
      href: '/friends',
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col gap-2 p-4">
        {/* Navigation Links */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground'
                )
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>

        {/* Spacer to push content to bottom if needed */}
        <div className="flex-1" />

        {/* Optional: Footer info */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            © 2025 WeatherApp
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;