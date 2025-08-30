import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { BookOpen, ChevronRight } from 'lucide-react';
import { CLASS_LEVELS, SUBJECTS, NCERT_CHAPTERS } from '../../config/constants';

interface NCERTSelectorProps {
  onSelect: (content: any) => void;
  selectedContent: any;
}

export const NCERTSelector: React.FC<NCERTSelectorProps> = ({ 
  onSelect, 
  selectedContent 
}) => {
  const [selectedClass, setSelectedClass] = useState('3');
  const [selectedSubject, setSelectedSubject] = useState('science');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const getChapters = () => {
    const classData = NCERT_CHAPTERS[selectedClass as keyof typeof NCERT_CHAPTERS];
    return classData?.[selectedSubject as keyof typeof classData] || [];
  };

  const getTopics = () => {
    const chapters = getChapters();
    const chapter = chapters.find(c => c.chapter === selectedChapter);
    return chapter?.topics || [];
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    const content = {
      class: selectedClass,
      subject: selectedSubject,
      chapter: selectedChapter,
      topic: topic,
      content: `NCERT Class ${selectedClass} ${selectedSubject} - ${selectedChapter}: ${topic}`
    };
    onSelect(content);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">📚 Select NCERT Content</h3>
        <p className="text-gray-600">Choose from pre-loaded curriculum content for instant lesson creation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Class Level"
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setSelectedChapter('');
            setSelectedTopic('');
            onSelect(null);
          }}
          options={CLASS_LEVELS}
        />
        
        <Select
          label="Subject"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedChapter('');
            setSelectedTopic('');
            onSelect(null);
          }}
          options={SUBJECTS}
        />
      </div>

      {/* Chapters */}
      {getChapters().length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Chapters
          </label>
          <div className="grid grid-cols-1 gap-3">
            {getChapters().map((chapter) => (
              <motion.button
                key={chapter.chapter}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setSelectedChapter(chapter.chapter);
                  setSelectedTopic('');
                  onSelect(null);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedChapter === chapter.chapter
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{chapter.chapter}</h4>
                    <p className="text-sm text-gray-600">{chapter.title}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {selectedChapter && getTopics().length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Topic from {selectedChapter}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getTopics().map((topic) => (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTopicSelect(topic)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedTopic === topic
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-800">{topic}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {selectedContent && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600">✅</span>
            <span className="font-medium text-green-800">Content Selected</span>
          </div>
          <p className="text-sm text-green-700">
            Class {selectedContent.class} {selectedContent.subject} - {selectedContent.topic}
          </p>
        </div>
      )}
    </div>
  );
};