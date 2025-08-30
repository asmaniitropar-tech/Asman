import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Globe, Sparkles } from 'lucide-react';
import { GLOBAL_MODULES } from '../../config/constants';

interface GlobalModuleCardProps {
  moduleName: string;
  content: string;
}

export const GlobalModuleCard: React.FC<GlobalModuleCardProps> = ({ 
  moduleName, 
  content 
}) => {
  const module = GLOBAL_MODULES.find(m => 
    moduleName && m.label.toLowerCase() === moduleName.toLowerCase()
  ) || GLOBAL_MODULES[0];

  return (
    <Card>
      <div className={`${module.color} p-4 text-white`}>
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Global Learning Module</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-4xl"
          >
            {module.character}
          </motion.div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{module.flag}</span>
              <h4 className="text-xl font-bold text-gray-800">{module.label}</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Global Learning Integration</span>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            🌍 This lesson incorporates {moduleName} learning methodologies while maintaining strong Indian educational values.
            
            The AI whiteboard will seamlessly blend global perspectives with local context, helping students understand how knowledge connects across cultures while staying rooted in their own heritage.
            
            Students will see examples from both Indian traditions and {moduleName} approaches, creating a rich, multicultural learning experience that prepares them for our interconnected world.
          </p>
        </div>
      </div>
    </Card>
  );
};