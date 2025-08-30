import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2, Download } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      // In a real app, you'd call your TTS API here
      // For demo purposes, we'll use the browser's speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
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
    } else {
      generateAudio();
    }
  };

  return (
    <Card>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <Volume2 className="w-6 h-6" />
          <h3 className="text-lg font-semibold">AI Narration</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-center space-x-4">
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
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Play Narration</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Audio</span>
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            High-quality AI narration will help students better understand the lesson content
          </p>
        </div>
      </div>
    </Card>
  );
};