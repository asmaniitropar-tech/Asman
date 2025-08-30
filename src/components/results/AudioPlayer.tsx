import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2, Download, Wand2, Eye, RotateCcw, Settings } from 'lucide-react';
import { Select } from '../ui/Select';

interface AudioPlayerProps {
  text: string;
  classLevel: string;
  topic: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, classLevel, topic }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'topic-explanation' | 'animation-demo' | 'interaction' | 'complete'>('intro');
  const [explanationMode, setExplanationMode] = useState<'simple' | 'detailed' | 'full'>('simple');
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ageGroups = {
    '1': '6-7 year olds',
    '2': '7-8 year olds', 
    '3': '8-9 year olds',
    '4': '9-10 year olds',
    '5': '10-11 year olds'
  };

  const generateTopicSpecificExplanation = (mode: string) => {
    const ageGroup = ageGroups[classLevel as keyof typeof ageGroups] || 'young students';
    
    const explanations = {
      simple: `
        Hello! I'm your AI whiteboard assistant, and I'm going to explain ${topic} in a magical way for ${ageGroup}!
        
        As your teacher talks about ${topic}, watch me create beautiful moving pictures on the whiteboard.
        
        When your teacher says important words, I instantly draw them! If they mention water, you'll see sparkling blue water flowing. If they talk about animals, cute animals will appear and move around.
        
        The best part? You can touch anything I draw! Touch a butterfly, and it might flutter its wings. Touch a tree, and leaves might fall down.
        
        I listen very carefully to your teacher and make sure every picture matches exactly what they're explaining. This helps you see, hear, and touch your lessons all at the same time!
        
        Learning becomes like watching a magical story where you're part of the adventure!
      `,
      detailed: `
        Welcome to ASman Learning's AI Whiteboard Experience for ${ageGroup}!
        
        I'm your intelligent drawing assistant, and I specialize in bringing ${topic} to life through synchronized animations.
        
        Here's how I work with your teacher:
        
        LISTENING PHASE: I use advanced speech recognition to understand every word your teacher speaks about ${topic}. I identify key concepts, emotions, and teaching moments.
        
        ANIMATION CREATION: As your teacher explains concepts, I create contextual animations. For ${topic}, this means:
        - Visual representations that match the complexity level for ${ageGroup}
        - Interactive elements that respond to student curiosity
        - Cultural connections that relate to Indian examples and global perspectives
        
        STUDENT INTERACTION: You can pause me anytime to ask questions. I'll create visual answers that help you understand better.
        
        ADAPTIVE LEARNING: I notice if students seem confused and automatically create simpler visuals or more detailed explanations.
        
        The magic happens in real-time - no pre-made videos, just intelligent responses to your teacher's unique teaching style and your class's needs.
      `,
      full: `
        Complete AI Whiteboard System Explanation for ${topic} - Designed for ${ageGroup}
        
        INTRODUCTION TO AI-POWERED LEARNING:
        I am ASman Learning's advanced AI whiteboard system, specifically calibrated for ${ageGroup} studying ${topic}. My purpose is to transform traditional NCERT lessons into immersive, interactive experiences.
        
        REAL-TIME CONTENT ANALYSIS:
        When your teacher uploads content about ${topic}, I analyze it through multiple layers:
        - Curriculum alignment with NCERT standards for Class ${classLevel}
        - Age-appropriate language and concept complexity
        - Cultural context integration balancing global perspectives with Indian values
        - Interactive potential assessment for maximum engagement
        
        SYNCHRONIZED ANIMATION SYSTEM:
        As your teacher speaks about ${topic}, I employ:
        - Natural Language Processing to identify key concepts in real-time
        - Visual Generation AI to create appropriate animations instantly
        - Contextual Understanding to ensure animations match the exact teaching moment
        - Emotional Intelligence to gauge student engagement and adapt accordingly
        
        MULTI-SENSORY LEARNING APPROACH:
        For ${topic}, I create:
        - Visual animations that make abstract concepts concrete
        - Audio cues that reinforce learning through multiple senses
        - Tactile interactions through touch-responsive elements
        - Kinesthetic activities that encourage physical participation
        
        STUDENT INTERACTION CAPABILITIES:
        Students can:
        - Touch any animation to explore deeper concepts
        - Ask questions verbally, and I'll create visual answers
        - Request different perspectives or examples
        - Control animation speed and complexity
        
        TEACHER EMPOWERMENT:
        I enhance rather than replace teaching by:
        - Following the teacher's pace and style
        - Providing instant visual support for explanations
        - Offering suggested activities based on student responses
        - Creating assessment opportunities through interactive elements
        
        CULTURAL INTEGRATION:
        Every lesson about ${topic} includes:
        - Indian examples and cultural references
        - Global perspectives for broader understanding
        - Values-based learning that respects local traditions
        - Multilingual support when needed
        
        ASSESSMENT AND ADAPTATION:
        I continuously:
        - Monitor student engagement levels
        - Adjust content complexity in real-time
        - Provide teachers with insights about student understanding
        - Generate follow-up activities based on learning gaps
        
        This comprehensive system ensures that ${topic} becomes not just a lesson, but an unforgettable learning adventure that respects both innovation and tradition.
      `
    };

    return explanations[mode as keyof typeof explanations];
  };

  const startExplanation = async () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setIsGenerating(true);
    setCurrentPhase('intro');
    setProgress(0);
    
    try {
      const explanationText = generateTopicSpecificExplanation(explanationMode);
      
      const utterance = new SpeechSynthesisUtterance(explanationText);
      utterance.rate = explanationMode === 'full' ? 0.7 : 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      utteranceRef.current = utterance;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentPhase('intro');
        
        // Start progress tracking
        const duration = explanationText.length * 50; // Estimate duration
        let currentProgress = 0;
        progressIntervalRef.current = setInterval(() => {
          currentProgress += 1;
          setProgress(Math.min(currentProgress, 100));
          
          // Update phases based on progress
          if (currentProgress > 20 && currentProgress <= 40) {
            setCurrentPhase('topic-explanation');
          } else if (currentProgress > 40 && currentProgress <= 70) {
            setCurrentPhase('animation-demo');
          } else if (currentProgress > 70 && currentProgress <= 90) {
            setCurrentPhase('interaction');
          } else if (currentProgress > 90) {
            setCurrentPhase('complete');
          }
        }, duration / 100);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPhase('complete');
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPhase('intro');
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const pauseExplanation = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const resumeExplanation = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      // Resume progress tracking
      if (utteranceRef.current) {
        const remainingText = utteranceRef.current.text.length * (1 - progress / 100);
        const duration = remainingText * 50;
        progressIntervalRef.current = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(prev + 1, 100);
            if (newProgress >= 100) {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }
            }
            return newProgress;
          });
        }, duration / (100 - progress));
      }
    }
  };

  const stopExplanation = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPhase('intro');
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'intro':
        return `🎙️ AI introducing ${topic} for ${ageGroups[classLevel as keyof typeof ageGroups]}...`;
      case 'topic-explanation':
        return `📚 Explaining ${topic} concepts in simple terms...`;
      case 'animation-demo':
        return `🎨 Describing how AI creates live animations for ${topic}...`;
      case 'interaction':
        return `👆 Explaining student interaction features...`;
      case 'complete':
        return `✨ Complete AI explanation of ${topic} finished!`;
      default:
        return `🎙️ Ready to explain ${topic} with AI magic...`;
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <Card>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <Volume2 className="w-6 h-6" />
          <h3 className="text-lg font-semibold">AI Voice: {topic} Explanation</h3>
        </div>
      </div>
      <div className="p-6">
        {/* Explanation Mode Selector */}
        <div className="mb-6">
          <Select
            label="Explanation Detail Level"
            value={explanationMode}
            onChange={(e) => setExplanationMode(e.target.value as any)}
            options={[
              { value: 'simple', label: `Simple (Perfect for ${ageGroups[classLevel as keyof typeof ageGroups]})` },
              { value: 'detailed', label: 'Detailed (How AI Works)' },
              { value: 'full', label: 'Complete System Explanation' }
            ]}
          />
        </div>

        {/* Topic-Specific Animation Demo */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
          <div className="text-center mb-4">
            <h4 className="font-bold text-blue-800 mb-2">🎨 Live Animation Preview for "{topic}"</h4>
            <p className="text-sm text-blue-600">See how AI creates visuals as teacher explains {topic}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <motion.div
              animate={currentPhase === 'topic-explanation' ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="text-xs text-gray-600">AI visualizes {topic} concepts</div>
            </motion.div>
            
            <motion.div
              animate={currentPhase === 'animation-demo' ? { 
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="text-2xl mb-2">🎭</div>
              <div className="text-xs text-gray-600">Animations sync with teacher's voice</div>
            </motion.div>
            
            <motion.div
              animate={currentPhase === 'interaction' ? { 
                x: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="text-2xl mb-2">👆</div>
              <div className="text-xs text-gray-600">Students explore by touching</div>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar */}
        {(isPlaying || isPaused) && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Explanation Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Voice Control Section */}
        <div className="flex items-center justify-center space-x-3 mb-6 flex-wrap gap-2">
          {!isPlaying && !isPaused ? (
            <Button
              onClick={startExplanation}
              variant="primary"
              size="lg"
              loading={isGenerating}
              className="flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>🎙️ AI Explain "{topic}"</span>
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={pauseExplanation}
                  variant="secondary"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </Button>
              ) : (
                <Button
                  onClick={resumeExplanation}
                  variant="primary"
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Resume</span>
                </Button>
              )}
              
              <Button
                onClick={stopExplanation}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Restart</span>
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Audio</span>
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
        
        {/* Age-Appropriate Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Age-Appropriate for {ageGroups[classLevel as keyof typeof ageGroups]}</span>
            </div>
            <p className="text-sm text-orange-700">
              AI automatically adjusts language complexity, visual style, and interaction level for Class {classLevel} students learning {topic}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Smart Adaptation</span>
            </div>
            <p className="text-sm text-green-700">
              AI notices when students need more help with {topic} and automatically creates simpler explanations or more engaging visuals
            </p>
          </div>
        </div>

        {/* Topic-Specific Learning Outcomes */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <h5 className="font-bold text-gray-800 mb-3">🎯 What Students Learn About {topic}:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">📖</span>
              <span className="text-gray-700">Core concepts explained through interactive visuals</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600">🎨</span>
              <span className="text-gray-700">Creative thinking through animation exploration</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-600">🤝</span>
              <span className="text-gray-700">Collaborative learning through shared whiteboard</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-600">🌍</span>
              <span className="text-gray-700">Global perspectives rooted in Indian values</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};