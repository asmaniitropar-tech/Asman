import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TeacherControls } from './TeacherControls';
import { LessonDisplay } from './LessonDisplay';
import { EngagementReport } from './EngagementReport';
import { ExportOptions } from './ExportOptions';
import { ArrowLeft, Edit, Play, Pause, Settings, BarChart3 } from 'lucide-react';
import { LessonPack } from '../../types';

interface LessonPreviewProps {
  lessonPack: LessonPack;
  onBack: () => void;
  onEdit: () => void;
}

export const LessonPreview: React.FC<LessonPreviewProps> = ({ 
  lessonPack, 
  onBack, 
  onEdit 
}) => {
  const [currentView, setCurrentView] = useState<'preview' | 'teaching' | 'report'>('preview');
  const [isTeaching, setIsTeaching] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{lessonPack.title}</h1>
          <p className="text-gray-600 mt-1">🎯 Ready to project and teach with AI!</p>
        </div>
        
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
      </div>

      {/* View Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'preview', label: '👁️ Preview Lesson', icon: '' },
            { id: 'teaching', label: '🎯 Teaching Mode', icon: '' },
            { id: 'report', label: '📊 Post-Class Report', icon: '' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'preview' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  📋 Preview Your AI Lesson Pack
                </h2>
                <p className="text-gray-600">
                  Review content, test AI features, then project on smartboard/TV/mobile
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-green-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-gray-800 mb-3">🎯 Teacher Control Panel</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600">⏸️</span>
                    <span>Pause AI anytime to explain further</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">🗣️</span>
                    <span>Say "simplify" for easier explanations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🌍</span>
                    <span>Toggle global modules on/off during class</span>
                  </div>
                </div>
              </div>
            </Card>

            <LessonDisplay lessonPack={lessonPack} />
            <ExportOptions lessonPack={lessonPack} />
          </div>
        )}

        {currentView === 'teaching' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  🎯 Teaching Mode - You're in Control
                </h2>
                <Button
                  onClick={() => setIsTeaching(!isTeaching)}
                  variant={isTeaching ? "secondary" : "primary"}
                  className="flex items-center space-x-2"
                >
                  {isTeaching ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isTeaching ? 'Pause Lesson' : 'Start Teaching'}</span>
                </Button>
              </div>
              
              <TeacherControls 
                lessonPack={lessonPack}
                isActive={isTeaching}
                onToggle={setIsTeaching}
              />
            </Card>
          </div>
        )}

        {currentView === 'report' && (
          <EngagementReport lessonId={lessonPack.id} />
        )}
      </motion.div>
    </div>
  );
};