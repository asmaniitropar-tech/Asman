import React from 'react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { User, LogOut, BookOpen } from 'lucide-react';

interface HeaderProps {
  user?: { name: string; email: string };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="sm" />
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Teacher Assistant</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};