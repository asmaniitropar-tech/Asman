import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2, Download, Wand2, Eye } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'animation' | 'interaction' | 'complete'>('intro');

  const generateAIVoiceExplanation = async () => {
    setIsGenerating(true);
    setCurrentPhase('intro');
    
    try {
      // Enhanced AI voice explanation about live animations
      const animationExplanation = `
        Welcome to ASman Learning's AI Whiteboard Experience!
        
        Let me explain how our AI creates magical live animations as your teacher speaks.
        
        When your teacher begins explaining the water cycle, watch the magic happen:
        
        First, I listen to every word your teacher says. As they mention "clouds," beautiful animated clouds appear on the whiteboard, floating and moving naturally.
        
        When they say "rain falls," you'll see realistic raindrops cascading down the screen, each drop sparkling as it moves.
        
        As your teacher explains "rivers flow," animated rivers appear, winding across the board with flowing water that responds to touch.
        
        The amazing part? Everything happens in perfect sync with your teacher's voice. I understand the context and create visuals that match exactly what's being taught.
        
        Students can touch any part of the animation to explore deeper. Touch a cloud, and it might show you how water vapor forms. Touch the river, and fish might swim by!
        
        This isn't just a video - it's intelligent, responsive animation that adapts to your teacher's unique teaching style and your class's curiosity.
        
        Every lesson becomes a living, breathing story where abstract concepts transform into visual adventures that help you understand and remember better.
        
        Your teacher remains the guide, while I provide the magical visual journey that makes learning unforgettable!
      `;

      const utterance = new SpeechSynthesisUtterance(animationExplanation);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Simulate different phases of explanation
      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentPhase('intro');
      };
      
      // Simulate phase changes during speech
      setTimeout(() => setCurrentPhase('animation'), 3000);
      setTimeout(() => setCurrentPhase('interaction'), 8000);
      setTimeout(() => setCurrentPhase('complete'), 12000);
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentPhase('intro');
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentPhase('intro');
    } else {
      generateAIVoiceExplanation();
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'intro':
        return '🎙️ AI explaining the whiteboard concept...';
      case 'animation':
        return '🎨 Describing live animation creation...';
      case 'interaction':
        return '👆 Explaining student interaction features...';
      case 'complete':
        return '✨ Complete AI whiteboard experience explained!';
      default:
        return '🎙️ Ready to explain AI whiteboard magic...';
    }
  };

  return (
    <Card>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <Volume2 className="w-6 h-6" />
          <h3 className="text-lg font-semibold">AI Voice: Live Animation Explanation</h3>
        </div>
      </div>
      <div className="p-6">
        {/* Animation Demo Visualization */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
          <div className="text-center mb-4">
            <h4 className="font-bold text-blue-800 mb-2">🎨 Live Animation Preview</h4>
            <p className="text-sm text-blue-600">See how AI creates visuals as teacher speaks</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <motion.div
              animate={currentPhase === 'animation' ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="text-2xl mb-2">☁️</div>
              <div className="text-xs text-gray-600">Clouds appear as teacher says "clouds"</div>
            </motion.div>
            
            <motion.div
              animate={currentPhase === 'animation' ? { 
                y: [0, 10, 0],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="text-2xl mb-2">🌧️</div>
              <div className="text-xs text-gray-600">Rain animates when "rain" is mentioned</div>
            </motion.div>
            
            <motion.div
              animate={currentPhase === 'interaction' ? { 
                x: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="text-2xl mb-2">🏞️</div>
              <div className="text-xs text-gray-600">Students can touch to explore</div>
            </motion.div>
          </div>
        </div>

        {/* Voice Control Section */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            onClick={togglePlayback}
            variant="primary"
            size="lg"
            loading={isGenerating}
            className="flex items-center space-x-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause AI Explanation</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>🎙️ Hear AI Explain Live Animations</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Voice Guide</span>
          </Button>
        </div>

        {/* Current Phase Indicator */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-medium text-purple-700">
              {getPhaseDescription()}
            </p>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Real-Time Sync</span>
            </div>
            <p className="text-sm text-orange-700">
              AI listens to teacher's voice and creates matching animations instantly
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Wand2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Interactive Magic</span>
            </div>
            <p className="text-sm text-green-700">
              Students touch animations to explore deeper, making learning hands-on
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};