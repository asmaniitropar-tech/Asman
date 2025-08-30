import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { GLOBAL_MODULES } from '../../config/constants';

interface GlobalModuleSelectorProps {
  selectedModules: string[];
  onSelectionChange: (modules: string[]) => void;
  classLevel: string;
}

export const GlobalModuleSelector: React.FC<GlobalModuleSelectorProps> = ({ 
  selectedModules, 
  onSelectionChange,
  classLevel 
}) => {
  const toggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      onSelectionChange(selectedModules.filter(id => id !== moduleId));
    } else {
      onSelectionChange([...selectedModules, moduleId]);
    }
  };

  const getExampleActivity = (moduleId: string) => {
    const examples = {
      china: `Quick drill: "Repeat the 3 main points 5 times" - builds memory through repetition`,
      japan: `Group harmony: "Each student shares one observation politely" - respectful participation`,
      usa: `Curiosity experiment: "What happens if we change one thing?" - hands-on exploration`,
      europe: `Creative expression: "Draw your understanding as a story" - artistic interpretation`
    };
    return examples[moduleId as keyof typeof examples];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          <strong>Teacher's Choice:</strong> Select global learning approaches to enhance your NCERT lesson. 
          You can choose none, one, or multiple modules - you're in complete control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GLOBAL_MODULES.map((module) => (
          <motion.div
            key={module.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedModules.includes(module.id)
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleModule(module.id)}
            >
              <div className={`${module.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{module.character}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{module.flag} {module.name}</h3>
                      <p className="text-sm opacity-90">{module.description}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                    selectedModules.includes(module.id) ? 'bg-white' : ''
                  }`}>
                    {selectedModules.includes(module.id) && (
                      <span className="text-blue-600 text-sm">✓</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Teaching Methodology:</h4>
                  <p className="text-sm text-gray-600">{module.methodology}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-1">Example for Class {classLevel}:</h5>
                  <p className="text-xs text-gray-600">{getExampleActivity(module.id)}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedModules.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600">🌍</span>
            <span className="font-medium text-blue-800">Selected Global Modules</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedModules.map(moduleId => {
              const module = GLOBAL_MODULES.find(m => m.id === moduleId);
              return (
                <span key={moduleId} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {module?.flag} {module?.name}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            These will be integrated into your lesson as optional activities that you can choose to include during teaching.
          </p>
        </div>
      )}

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800 text-center">
          💡 <strong>Teacher Tip:</strong> You can always preview the global activities and decide during class whether to include them. 
          ASman gives you suggestions - you make the final decisions!
        </p>
      </div>
    </div>
  );
};