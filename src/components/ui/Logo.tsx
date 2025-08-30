import React from 'react';
import { BookOpen, ArrowUp } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {/* Child figure pointing up */}
          <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-500 rounded-full opacity-20"></div>
            <ArrowUp className="w-6 h-6 text-orange-600 absolute -top-1 -right-1 z-10" />
            <BookOpen className="w-8 h-8 text-green-700" />
          </div>
        </div>
        <div>
          <h1 className={`${textSizes[size]} font-bold bg-gradient-to-r from-orange-500 via-green-600 to-blue-600 bg-clip-text text-transparent`}>
            ASman Learning
          </h1>
          {showTagline && (
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Sky of Knowledge, Roots in India
            </p>
          )}
        </div>
      </div>
    </div>
  );
};