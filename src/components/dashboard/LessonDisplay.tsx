import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BookOpen, Activity, HelpCircle, Globe, Play, Pause } from 'lucide-react';
import { LessonPack } from '../../types';

interface LessonDisplayProps {
  lessonPack: LessonPack;
  teachingMode?: boolean;
  globalModulesEnabled?: boolean;
  voiceEnabled?: boolean;
}

export const LessonDisplay: React.FC<LessonDisplayProps> = ({ 
  lessonPack, 
  teachingMode = false,
  globalModulesEnabled = true,
  voiceEnabled = true
}) => {
  const [activeSection, setActiveSection] = useState<'explanation' | 'animation' | 'qa' | 'activity' | 'global'>('explanation');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimationFrame, setCurrentAnimationFrame] = useState(0);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };
  const sections = [
    { id: 'explanation', label: 'Simplified Explanation', icon: BookOpen, color: 'orange' },
    { id: 'animation', label: 'AI Animations', icon: '🎬', color: 'blue' },
    { id: 'qa', label: 'Interactive Q&A', icon: HelpCircle, color: 'purple' },
    { id: 'activity', label: 'Hands-on Task', icon: Activity, color: 'green' },
    ...(globalModulesEnabled ? [{ id: 'global', label: 'Global Modules', icon: Globe, color: 'indigo' }] : [])
  ];

  const playAnimation = () => {
    setIsPlaying(true);
    const frames = lessonPack.practicalAnimation.keyFrames;
    
    const playFrame = (index: number) => {
      if (index >= frames.length) {
        setIsPlaying(false);
        setCurrentAnimationFrame(0);
        return;
      }
      
      setCurrentAnimationFrame(index);
      speakText(frames[index]);
      
      setTimeout(() => playFrame(index + 1), 3000);
    };
    
    playFrame(0);
  };
  const renderContent = () => {
    switch (activeSection) {
      case 'explanation':
        return (
          <div className="space-y-4">
            {teachingMode && (
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800">📖 Teaching Content</h4>
                <Button
                  onClick={() => speakText(lessonPack.simplifiedExplanation.replace(/\[AI DRAWS:.*?\]/g, ''))}
                  variant="outline"
                  size="sm"
                  disabled={!voiceEnabled}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Read Aloud
                </Button>
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {lessonPack.simplifiedExplanation.split('[AI DRAWS:').map((part, index) => {
                  if (index === 0) return <p key={index}>{part}</p>;
                  
                  const [animationDesc, ...rest] = part.split(']');
                  return (
                    <div key={index}>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="my-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-blue-600 font-semibold text-sm">🎨 AI ANIMATION:</span>
                        </div>
                        <p className="text-blue-700 font-medium">{animationDesc}</p>
                        {teachingMode && (
                          <Button
                            onClick={() => speakText(animationDesc)}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            disabled={!voiceEnabled}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Narrate
                          </Button>
                        )}
                      </motion.div>
                      <p>{rest.join(']')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'animation':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800">🎬 AI Animation Sequence</h4>
            {teachingMode && (
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  onClick={playAnimation}
                  disabled={isPlaying}
                  variant="primary"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Playing...' : 'Play Animation Sequence'}
                </Button>
                {isPlaying && (
                  <div className="text-sm text-gray-600">
                    Frame {currentAnimationFrame + 1} of {lessonPack.practicalAnimation.keyFrames.length}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-3">
              {lessonPack.practicalAnimation.keyFrames.map((frame, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                    teachingMode && currentAnimationFrame === index && isPlaying
                      ? 'bg-green-100 border-green-500 shadow-lg'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold ${
                      teachingMode && currentAnimationFrame === index && isPlaying
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{frame}</p>
                    {teachingMode && (
                      <Button
                        onClick={() => speakText(frame)}
                        variant="outline"
                        size="sm"
                        disabled={!voiceEnabled}
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h5 className="font-bold text-purple-800 mb-2">👆 Student Interaction Points:</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                {lessonPack.practicalAnimation.interactionPoints.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800">❓ Interactive Q&A with AI Character</h4>
            {lessonPack.aiQA.map((qa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-2xl">🤖</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-2">{qa.question}</p>
                    <div className="text-sm text-gray-600 mb-2">
                      {teachingMode && (
                        <Button
                          onClick={() => speakText(qa.question)}
                          variant="outline"
                          size="sm"
                          disabled={!voiceEnabled}
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                      Type: <span className="font-medium">{qa.type.replace('_', ' ')}</span>
                    </div>
                    {qa.options && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {qa.options.map((option, optIndex) => (
                          <button 
                            key={optIndex} 
                            onClick={() => teachingMode && speakText(option)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                      <p className="text-green-700 text-sm">{qa.answer}</p>
                      {teachingMode && (
                        <Button
                          onClick={() => speakText(qa.answer)}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          disabled={!voiceEnabled}
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Read Answer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800">🛠️ {lessonPack.handsOnTask.title}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">📦 Materials Needed:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {lessonPack.handsOnTask.materials.map((material, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">⏱️ Duration & Setup:</h5>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Time needed:</strong> {lessonPack.handsOnTask.duration}
                </p>
                <p className="text-sm text-gray-600">
                  AI will guide students through each step with visual cues and encouragement.
                </p>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-3">📋 Step-by-Step Instructions:</h5>
              <div className="space-y-3">
                {lessonPack.handsOnTask.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                    {teachingMode && (
                      <Button
                        onClick={() => speakText(step)}
                        variant="outline"
                        size="sm"
                        disabled={!voiceEnabled}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Read Step
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'global':
        return globalModulesEnabled ? (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800">🌍 Global Learning Modules</h4>
            {lessonPack.globalModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 rounded-lg"
              >
                <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-3">
                    {module.name === 'China Focus' ? '🇨🇳' : 
                     module.name === 'Japan Focus' ? '🇯🇵' : 
                     module.name === 'US Focus' ? '🇺🇸' : '🇪🇺'}
                  </span>
                  {module.name}
                  {teachingMode && (
                    <Button
                      onClick={() => speakText(`${module.name}: ${module.activity}`)}
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      disabled={!voiceEnabled}
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  )}
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-gray-700 mb-2">🎯 Activity:</h6>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{module.activity}</p>
                  </div>
                  
                  <div>
                    <h6 className="font-medium text-gray-700 mb-2">🌍 Cultural Connection:</h6>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{module.culturalConnection}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Global modules are currently hidden</p>
            <p className="text-sm text-gray-400 mt-2">Enable them in teacher controls to see global learning activities</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            variant={activeSection === section.id ? "primary" : "outline"}
            size="sm"
            className="flex items-center space-x-2"
          >
            {typeof section.icon === 'string' ? (
              <span className="text-lg">{section.icon}</span>
            ) : (
              <section.icon className="w-4 h-4" />
            )}
            <span>{section.label}</span>
          </Button>
        ))}
      </div>

      {/* Real-time Status Bar */}
      {teachingMode && (
        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>🎯 Teaching Mode Active</span>
              <span>Voice: {voiceEnabled ? '🔊 ON' : '🔇 OFF'}</span>
              <span>Global: {globalModulesEnabled ? '🌍 ACTIVE' : '❌ HIDDEN'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Current: {activeSection.toUpperCase()}</span>
              {isPlaying && <span className="animate-pulse">🎬 ANIMATING</span>}
            </div>
          </div>
        </div>
      )}
      {/* Content Display */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Teacher Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          📝 Teacher Notes & Tips
          {teachingMode && (
            <Button
              onClick={() => speakText(lessonPack.teacherNotes)}
              variant="outline"
              size="sm"
              className="ml-auto"
              disabled={!voiceEnabled}
            >
              <Volume2 className="w-3 h-3 mr-1" />
              Read Notes
            </Button>
          )}
        </h3>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {lessonPack.teacherNotes}
          </p>
        </div>
      </Card>
    </div>
  );
};