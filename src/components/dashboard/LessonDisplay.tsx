import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BookOpen, Activity, HelpCircle, Globe, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { LessonPack } from '../../types';
import toast from 'react-hot-toast';

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
  const [autoPlay, setAutoPlay] = useState(false);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    // Clean text from AI DRAWS markers
    const cleanText = text.replace(/\[AI DRAWS:.*?\]/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.lang = 'en-IN'; // Indian English
    speechSynthesis.speak(utterance);
  };

  const playAnimation = () => {
    setIsPlaying(true);
    const frames = lessonPack.practicalAnimation.keyFrames;
    
    const playFrame = (index: number) => {
      if (index >= frames.length) {
        setIsPlaying(false);
        setCurrentAnimationFrame(0);
        toast.success('Animation sequence completed!');
        return;
      }
      
      setCurrentAnimationFrame(index);
      if (voiceEnabled) {
        speakText(frames[index]);
      }
      
      setTimeout(() => playFrame(index + 1), 4000);
    };
    
    playFrame(0);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    speechSynthesis.cancel();
    setCurrentAnimationFrame(0);
  };

  // Auto-start explanation when in teaching mode
  useEffect(() => {
    if (teachingMode && autoPlay && activeSection === 'explanation') {
      const timer = setTimeout(() => {
        speakText(lessonPack.simplifiedExplanation);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [teachingMode, autoPlay, activeSection, lessonPack.simplifiedExplanation, voiceEnabled]);

  const sections = [
    { id: 'explanation', label: '📖 Explanation', icon: BookOpen, color: 'orange' },
    { id: 'animation', label: '🎬 Animations', icon: Play, color: 'blue' },
    { id: 'qa', label: '❓ Q&A', icon: HelpCircle, color: 'purple' },
    { id: 'activity', label: '🛠️ Activity', icon: Activity, color: 'green' },
    ...(globalModulesEnabled && lessonPack.globalModules.length > 0 ? 
      [{ id: 'global', label: '🌍 Global', icon: Globe, color: 'indigo' }] : [])
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'explanation':
        return (
          <div className="space-y-6">
            {teachingMode && (
              <div className="flex justify-between items-center mb-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="text-lg font-bold text-orange-800">📖 Teaching Content</h4>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => speakText(lessonPack.simplifiedExplanation)}
                    variant="outline"
                    size="sm"
                    disabled={!voiceEnabled}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Read Aloud
                  </Button>
                  <Button
                    onClick={() => setAutoPlay(!autoPlay)}
                    variant={autoPlay ? "secondary" : "outline"}
                    size="sm"
                  >
                    {autoPlay ? 'Auto ON' : 'Auto OFF'}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg">
                {lessonPack.simplifiedExplanation.split(/(\[AI DRAWS:.*?\])/).map((part, index) => {
                  if (part.startsWith('[AI DRAWS:')) {
                    const animationDesc = part.replace('[AI DRAWS:', '').replace(']', '');
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="my-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎨</span>
                            <span className="text-blue-700 font-bold">AI ANIMATION</span>
                          </div>
                          {teachingMode && (
                            <Button
                              onClick={() => speakText(animationDesc)}
                              variant="outline"
                              size="sm"
                              disabled={!voiceEnabled}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Narrate
                            </Button>
                          )}
                        </div>
                        <p className="text-blue-800 font-medium text-base">{animationDesc}</p>
                        <div className="mt-3 p-3 bg-white/50 rounded-lg">
                          <p className="text-xs text-blue-600">
                            👆 Students can interact with this animation when it appears on screen
                          </p>
                        </div>
                      </motion.div>
                    );
                  }
                  return part ? <p key={index} className="mb-4">{part}</p> : null;
                })}
              </div>
            </div>

            {teachingMode && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-bold text-yellow-800 mb-2">🗣️ Teacher Voice Commands:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <button 
                    onClick={() => toast.success('🗣️ "Simplify this" - Making explanation easier')}
                    className="p-2 bg-white rounded hover:bg-yellow-100 text-left"
                  >
                    "Simplify this"
                  </button>
                  <button 
                    onClick={() => toast.success('🗣️ "In Hindi" - Switching to Hindi')}
                    className="p-2 bg-white rounded hover:bg-yellow-100 text-left"
                  >
                    "In Hindi"
                  </button>
                  <button 
                    onClick={() => toast.success('🗣️ "Repeat that" - Replaying section')}
                    className="p-2 bg-white rounded hover:bg-yellow-100 text-left"
                  >
                    "Repeat that"
                  </button>
                  <button 
                    onClick={() => toast.success('🗣️ "More examples" - Adding examples')}
                    className="p-2 bg-white rounded hover:bg-yellow-100 text-left"
                  >
                    "More examples"
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'animation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800">🎬 AI Animation Sequence</h4>
              {teachingMode && (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={isPlaying ? stopAnimation : playAnimation}
                    variant={isPlaying ? "secondary" : "primary"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Stop Animation' : 'Play Full Sequence'}
                  </Button>
                  {isPlaying && (
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded">
                      Frame {currentAnimationFrame + 1} of {lessonPack.practicalAnimation.keyFrames.length}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 bg-black rounded-xl relative overflow-hidden min-h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
              <div className="relative z-10 text-center text-white">
                {isPlaying ? (
                  <motion.div
                    key={currentAnimationFrame}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-4xl mb-4">🎬</div>
                    <h5 className="text-xl font-bold mb-2">Animation Playing</h5>
                    <p className="text-lg">{lessonPack.practicalAnimation.keyFrames[currentAnimationFrame]}</p>
                    <div className="flex justify-center space-x-2 mt-4">
                      {lessonPack.practicalAnimation.keyFrames.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentAnimationFrame ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl mb-4">🎭</div>
                    <h5 className="text-xl font-bold mb-2">AI Animation Ready</h5>
                    <p className="text-gray-300">{lessonPack.practicalAnimation.description}</p>
                    <p className="text-sm text-gray-400">Click "Play Full Sequence" to start animations</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-gray-800">🎬 Animation Frames:</h5>
              {lessonPack.practicalAnimation.keyFrames.map((frame, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                    isPlaying && currentAnimationFrame === index
                      ? 'bg-green-100 border-green-500 shadow-lg'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold ${
                        isPlaying && currentAnimationFrame === index ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </span>
                      <p className="text-gray-700 flex-1">{frame}</p>
                    </div>
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
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h5 className="font-bold text-purple-800 mb-3">👆 Student Interaction Points:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lessonPack.practicalAnimation.interactionPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-purple-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800">❓ Interactive Q&A with AI Character</h4>
            {lessonPack.aiQA.map((qa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🤖</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-gray-800 text-lg">{qa.question}</p>
                      {teachingMode && (
                        <Button
                          onClick={() => speakText(qa.question)}
                          variant="outline"
                          size="sm"
                          disabled={!voiceEnabled}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {qa.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    {qa.options && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {qa.options.map((option, optIndex) => (
                          <button 
                            key={optIndex} 
                            onClick={() => {
                              if (teachingMode) {
                                speakText(option);
                                toast.success(`Student selected: ${option}`);
                              }
                            }}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium"
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-700 font-bold text-sm">✅ AI Answer:</span>
                        {teachingMode && (
                          <Button
                            onClick={() => speakText(qa.answer)}
                            variant="outline"
                            size="sm"
                            disabled={!voiceEnabled}
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Read Answer
                          </Button>
                        )}
                      </div>
                      <p className="text-green-800">{qa.answer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800">🛠️ {lessonPack.handsOnTask.title}</h4>
              {teachingMode && (
                <Button
                  onClick={() => speakText(`Let's do our hands-on activity: ${lessonPack.handsOnTask.title}`)}
                  variant="outline"
                  size="sm"
                  disabled={!voiceEnabled}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Announce Activity
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">📦</span>
                  Materials Needed
                </h5>
                <ul className="space-y-2">
                  {lessonPack.handsOnTask.materials.map((material, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      <span className="text-gray-700">{material}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">⏱️</span>
                  Duration & Setup
                </h5>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Time needed:</strong> {lessonPack.handsOnTask.duration}
                  </p>
                  <p className="text-sm text-gray-600">
                    AI will guide students through each step with visual cues and encouragement.
                  </p>
                </div>
              </Card>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-4">📋 Step-by-Step Instructions:</h5>
              <div className="space-y-3">
                {lessonPack.handsOnTask.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                    {teachingMode && (
                      <Button
                        onClick={() => speakText(`Step ${index + 1}: ${step}`)}
                        variant="outline"
                        size="sm"
                        disabled={!voiceEnabled}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'global':
        return globalModulesEnabled && lessonPack.globalModules.length > 0 ? (
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800">🌍 Global Learning Modules</h4>
            {lessonPack.globalModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-gray-800 text-lg flex items-center">
                    <span className="text-2xl mr-3">
                      {module.name.includes('China') ? '🇨🇳' : 
                       module.name.includes('Japan') ? '🇯🇵' : 
                       module.name.includes('US') ? '🇺🇸' : 
                       module.name.includes('Europe') ? '🇪🇺' : '🤖'}
                    </span>
                    {module.name}
                  </h5>
                  {teachingMode && (
                    <Button
                      onClick={() => speakText(`${module.name}: ${module.activity}`)}
                      variant="outline"
                      size="sm"
                      disabled={!voiceEnabled}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-2">🎯</span>
                      Activity:
                    </h6>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{module.activity}</p>
                  </div>
                  
                  <div>
                    <h6 className="font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-2">🌍</span>
                      Cultural Connection:
                    </h6>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{module.culturalConnection}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Global modules are currently hidden</p>
            <p className="text-sm text-gray-400 mt-2">Enable them in teacher controls to see global learning activities</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-3">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            variant={activeSection === section.id ? "primary" : "outline"}
            size="md"
            className="flex items-center space-x-2"
          >
            {typeof section.icon === 'string' ? (
              <span className="text-lg">{section.icon}</span>
            ) : (
              <section.icon className="w-5 h-5" />
            )}
            <span>{section.label}</span>
          </Button>
        ))}
      </div>

      {/* Teaching Mode Status */}
      {teachingMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-green-600 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg">🎯</span>
              <span className="font-bold">Teaching Mode Active</span>
              <span className="text-sm opacity-90">Voice: {voiceEnabled ? '🔊 ON' : '🔇 OFF'}</span>
              <span className="text-sm opacity-90">Global: {globalModulesEnabled ? '🌍 ACTIVE' : '❌ HIDDEN'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Current: {activeSection.toUpperCase()}</span>
              {isPlaying && <span className="animate-pulse text-yellow-300">🎬 ANIMATING</span>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Display */}
      <Card className="min-h-[400px]">
        <div className="p-6">
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
        </div>
      </Card>

      {/* Teacher Notes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="text-xl mr-2">📝</span>
            Teacher Notes & Control Tips
          </h3>
          {teachingMode && (
            <Button
              onClick={() => speakText(lessonPack.teacherNotes)}
              variant="outline"
              size="sm"
              disabled={!voiceEnabled}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Read Notes
            </Button>
          )}
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {lessonPack.teacherNotes}
          </p>
        </div>
      </Card>
    </div>
  );
};