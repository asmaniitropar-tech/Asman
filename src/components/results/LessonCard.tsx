import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { BookOpen, Copy, Check } from 'lucide-react';

interface LessonCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({ 
  title, 
  content, 
  icon, 
  color 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full">
      <div className={`${color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content.split('[AI DRAWS:').map((part, index) => {
              if (index === 0) return <p key={index}>{part}</p>;
              
              const [animationDesc, ...rest] = part.split(']');
              return (
                <div key={index}>
                  <div className="my-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-blue-600 font-semibold text-sm">🎨 AI ANIMATION:</span>
                    </div>
                    <p className="text-blue-700 text-sm font-medium">{animationDesc}</p>
                  </div>
                  <p>{rest.join(']')}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};