import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LessonDisplay } from './LessonDisplay';
import { ExportOptions } from './ExportOptions';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Settings, Globe, MessageCircle } from 'lucide-react';
import { LessonPack } from '../../types';
import toast from 'react-hot-toast';

interface TeacherControlsProps {
  lessonPack: LessonPack;
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const TeacherControls: React.FC<TeacherControlsProps> = ({ 
  lessonPack, 
  isActive, 
  onToggle 
}) => {
  const [currentSection, setCurrentSection] = useState<'explanation' | 'activity' | 'qa'>('explanation');
  const [globalModulesEnabled, setGlobalModulesEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [simplificationLevel, setSimplificationLevel] = useState<'normal' | 'simple' | 'very-simple'>('normal');

  const handleVoiceCommand = (command: string) => {
    toast.success(`🗣️ Voice command: "${command}"`);
    
    switch (command) {
      case 'simplify':
        setSimplificationLevel('simple');
        toast.info('✨ AI switching to simpler explanations');
        break;
      case 'translate':
        toast.info('🌐 Language switching activated');
        break;
      case 'repeat':
        toast.info('🔄 Replaying current section');
        break;
      case 'more-examples':
        toast.info('📚 AI adding more examples');
        break;
      case 'global-mode':
        setGlobalModulesEnabled(!globalModulesEnabled);
        toast.info(globalModulesEnabled ? '🌍 Global mode ON' : '📚 NCERT-only mode');
        break;
      default:
        console.log('Voice command:', command);
    }
  };

  const toggleGlobalModules = () => {
    setGlobalModulesEnabled(!globalModulesEnabled);
    toast.success(globalModulesEnabled ? 'Global modules hidden' : 'Global modules enabled');
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      // Test voice synthesis
      const utterance = new SpeechSynthesisUtterance('AI voice is now enabled and ready to assist your teaching.');
      speechSynthesis.speak(utterance);
    }
    toast.success(voiceEnabled ? 'AI voice muted' : 'AI voice enabled');
  };
  return (
    <div className="space-y-6">
      {/* Main Teaching Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <Play className="w-5 h-5 mr-2 text-orange-600" />
            Lesson Control
          </h3>
          <div className="space-y-2">
            <Button
              onClick={() => onToggle(!isActive)}
              variant={isActive ? "secondary" : "primary"}
              className="w-full"
            >
              {isActive ? 'Pause AI Assistant' : 'Start AI Assistant'}
            </Button>
            <Button variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Section
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Quick Settings
          </h3>
          <div className="space-y-2">
            <Button
              onClick={toggleVoice}
              variant="outline"
              className="w-full"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            </Button>
            <Button
              onClick={toggleGlobalModules}
              variant="outline"
              className="w-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              {globalModulesEnabled ? 'Hide Global' : 'Show Global'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
            Voice Commands
          </h3>
          <div className="space-y-2 text-sm">
            <button
              onClick={() => handleVoiceCommand('simplify')}
              className="w-full p-2 text-left hover:bg-gray-50 rounded"
            >
              "Simplify this" - Easier explanation
            </button>
            <button
              onClick={() => handleVoiceCommand('translate')}
              className="w-full p-2 text-left hover:bg-gray-50 rounded"
            >
              "In Hindi" - Language switch
            </button>
            <button
              onClick={() => handleVoiceCommand('repeat')}
              className="w-full p-2 text-left hover:bg-gray-50 rounded"
            >
              "Repeat that" - Replay section
            </button>
            <button
              onClick={() => handleVoiceCommand('more-examples')}
              className="w-full p-2 text-left hover:bg-gray-50 rounded"
            >
              "Add more examples" - Extra content
            </button>
            <button
              onClick={() => handleVoiceCommand('global-mode')}
              className="w-full p-2 text-left hover:bg-gray-50 rounded"
            >
              "Switch to global" - Toggle modes
            </button>
          </div>
        </Card>
      </div>

      {/* Live Teaching Interface */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🎭 Live AI Whiteboard Interface
        </h3>
        
        <div className="bg-black rounded-lg p-8 mb-4 min-h-[300px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
          
          {isActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 text-center text-white"
            >
              <div className="text-6xl mb-4">👩‍🏫</div>
              <h4 className="text-2xl font-bold mb-2">AI Assistant Active</h4>
              <p className="text-lg mb-4">Ready to support your teaching...</p>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-4 bg-white/10 rounded-lg"
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm">Creating Animations</div>
                </motion.div>
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="p-4 bg-white/10 rounded-lg"
                >
                  <div className="text-2xl mb-2">👂</div>
                  <div className="text-sm">Listening to Teacher</div>
                </motion.div>
                
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-4 bg-white/10 rounded-lg"
                >
                  <div className="text-2xl mb-2">🤔</div>
                  <div className="text-sm">Engaging Students</div>
                </motion.div>
              </div>
              
              {/* Real-time Status */}
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-sm">
                  Current Section: <span className="font-bold">{currentSection}</span> | 
                  Voice: <span className="font-bold">{voiceEnabled ? 'ON' : 'OFF'}</span> | 
                  Global Modules: <span className="font-bold">{globalModulesEnabled ? 'ACTIVE' : 'HIDDEN'}</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="relative z-10 text-center text-white/70">
              <div className="text-4xl mb-4">💤</div>
              <h4 className="text-xl font-medium mb-2">AI Assistant Standby</h4>
              <p className="text-sm">Click "Start AI Assistant" to begin interactive teaching</p>
            </div>
          )}
        </div>

        {/* Teacher Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-bold text-orange-800 mb-2">👩‍🏫 How to Use in Class:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>1. Project this on your smartboard/TV</li>
              <li>2. Start AI Assistant when ready</li>
              <li>3. Teach normally - AI follows your pace</li>
              <li>4. Use voice commands for adjustments</li>
              <li>5. Students can interact with animations</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">🎯 Student Experience:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• See concepts come alive through animations</li>
              <li>• Touch whiteboard to explore deeper</li>
              <li>• Ask AI character questions anytime</li>
              <li>• Participate in interactive activities</li>
              <li>• Learn through multiple senses</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Lesson Content Display */}
      <LessonDisplay 
        lessonPack={lessonPack} 
        teachingMode={isActive}
        globalModulesEnabled={globalModulesEnabled}
        voiceEnabled={voiceEnabled}
      />
      
      {/* Export and Share */}
      <ExportOptions lessonPack={lessonPack} />
    </div>
  );
};