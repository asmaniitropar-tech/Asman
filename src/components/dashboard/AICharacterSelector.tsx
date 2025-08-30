import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Volume2, Play } from 'lucide-react';
import { AI_CHARACTERS } from '../../config/constants';

interface AICharacterSelectorProps {
  selectedCharacter: string;
  onCharacterChange: (characterId: string) => void;
}

export const AICharacterSelector: React.FC<AICharacterSelectorProps> = ({ 
  selectedCharacter, 
  onCharacterChange 
}) => {
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  const previewVoice = (characterId: string) => {
    const character = AI_CHARACTERS.find(c => c.id === characterId);
    if (!character) return;

    setPreviewingVoice(characterId);
    
    const utterance = new SpeechSynthesisUtterance(
      `Hello! I'm ${character.name}, your AI teaching assistant. I'm here to help make your lessons engaging and fun for your students. Let's create some magic together!`
    );
    
    // Adjust voice characteristics based on character
    switch (characterId) {
      case 'friendly_teacher':
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        break;
      case 'curious_explorer':
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
        break;
      case 'wise_storyteller':
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        break;
    }
    
    utterance.onend = () => setPreviewingVoice(null);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AI_CHARACTERS.map((character) => (
          <motion.div
            key={character.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedCharacter === character.id
                  ? 'ring-2 ring-orange-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onCharacterChange(character.id)}
            >
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">{character.avatar}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{character.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{character.personality}</p>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-700">
                    <strong>Voice Style:</strong> {character.voiceStyle}
                  </p>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    previewVoice(character.id);
                  }}
                  variant="outline"
                  size="sm"
                  loading={previewingVoice === character.id}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {previewingVoice === character.id ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>Preview Voice</span>
                </Button>

                {selectedCharacter === character.id && (
                  <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                    <span className="text-xs font-medium text-orange-700">✓ Selected</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-orange-600">🎭</span>
            <span className="font-medium text-orange-800">AI Character Selected</span>
          </div>
          <p className="text-sm text-orange-700">
            {AI_CHARACTERS.find(c => c.id === selectedCharacter)?.name} will be your AI teaching partner, 
            adapting their personality and voice to support your teaching style and engage your students.
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🎯 How Your AI Character Helps:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
          <div className="flex items-start space-x-2">
            <span>📢</span>
            <span>Speaks in sync with your teaching pace</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>🎨</span>
            <span>Creates animations that match lesson content</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>❓</span>
            <span>Asks interactive questions to keep students engaged</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>🔄</span>
            <span>Adapts explanations when you request "simpler" or "more detail"</span>
          </div>
        </div>
      </div>
    </div>
  );
};