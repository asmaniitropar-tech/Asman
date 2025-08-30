import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { NCERTSelector } from './NCERTSelector';
import { UploadSection } from './UploadSection';
import { GlobalModuleSelector } from './GlobalModuleSelector';
import { AICharacterSelector } from './AICharacterSelector';
import { ArrowLeft, Sparkles, BookOpen, Upload } from 'lucide-react';
import { LessonInput } from '../../types';
import { LANGUAGES } from '../../config/constants';

interface TeacherWorkflowProps {
  onGenerate: (input: LessonInput) => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

export const TeacherWorkflow: React.FC<TeacherWorkflowProps> = ({ 
  onGenerate, 
  onBack, 
  loading 
}) => {
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState<'ncert' | 'upload'>('ncert');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [classLevel, setClassLevel] = useState('3');
  const [globalModules, setGlobalModules] = useState<string[]>([]);
  const [aiCharacter, setAICharacter] = useState('friendly_teacher');
  const [language, setLanguage] = useState<'english' | 'hindi' | 'bilingual'>('bilingual');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    if (!canProceed()) {
      toast.error('Please complete all required fields before generating.');
      return;
    }
    
    const input: LessonInput = {
      content: contentType === 'ncert' ? selectedContent : uploadedContent,
      classLevel,
      globalModules,
      aiCharacter,
      language,
      uploadType: contentType
    };
    
    toast.loading('Creating your AI lesson pack...', { id: 'workflow-generation' });
    await onGenerate(input);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return contentType === 'ncert' ? !!selectedContent : !!uploadedContent.trim();
      case 2:
        return true; // Global modules are optional
      case 3:
        return !!aiCharacter;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: 'Content Selection', icon: BookOpen },
    { number: 2, title: 'Global Modules', icon: '🌍' },
    { number: 3, title: 'AI Character', icon: '🎭' },
    { number: 4, title: 'Final Settings', icon: '⚙️' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-800">Create AI Whiteboard Lesson</h1>
          <p className="text-gray-600 mt-1">Step {step} of 4 - You're in complete control</p>
        </div>
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= stepItem.number 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {typeof stepItem.icon === 'string' ? stepItem.icon : stepItem.number}
              </div>
              <div className="ml-2 hidden md:block">
                <p className={`text-sm font-medium ${
                  step >= stepItem.number ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-4 rounded transition-all duration-300 ${
                  step > stepItem.number ? 'bg-orange-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📚 Step 1: Choose Your Content Source
            </h2>
            
            {/* Content Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setContentType('ncert')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  contentType === 'ncert'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">NCERT Chapters</h3>
                <p className="text-sm text-gray-600">
                  Pre-loaded content for all subjects and classes. Zero preparation time required.
                </p>
                <div className="mt-3 px-3 py-1 bg-orange-100 rounded-full">
                  <span className="text-xs font-medium text-orange-700">✨ Recommended</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setContentType('upload')}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  contentType === 'upload'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Your Material</h3>
                <p className="text-sm text-gray-600">
                  PDF, image, text, or voice recording. AI will structure it into a lesson.
                </p>
                <div className="mt-3 px-3 py-1 bg-green-100 rounded-full">
                  <span className="text-xs font-medium text-green-700">📱 Phone photos work!</span>
                </div>
              </motion.button>
            </div>

            {/* Content Selection */}
            {contentType === 'ncert' ? (
              <NCERTSelector 
                onSelect={setSelectedContent}
                selectedContent={selectedContent}
              />
            ) : (
              <UploadSection 
                onContentExtracted={setUploadedContent}
                content={uploadedContent}
              />
            )}
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🌍 Step 2: Global Learning Modules (Optional)
            </h2>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-center">
                <strong>Teacher's Choice:</strong> Add global learning styles to give students world-class exposure while staying rooted in NCERT curriculum. You can skip this or select multiple approaches.
              </p>
            </div>
            <GlobalModuleSelector 
              selectedModules={globalModules}
              onSelectionChange={setGlobalModules}
              classLevel={classLevel}
            />
          </Card>
        )}

        {step === 3 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🎭 Step 3: Choose Your AI Teaching Assistant
            </h2>
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-800 text-center">
                <strong>Your AI Partner:</strong> Select the personality and voice style that matches your teaching approach. Each character adapts to your lesson content.
              </p>
            </div>
            <AICharacterSelector 
              selectedCharacter={aiCharacter}
              onCharacterChange={setAICharacter}
            />
          </Card>
        )}

        {step === 4 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ⚙️ Step 4: Final Settings & Generate
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Select
                  label="Language Preference"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  options={LANGUAGES}
                />
                <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    🗣️ AI will speak and display content in your preferred language
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Summary
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Content:</strong> {contentType === 'ncert' ? 'NCERT Chapter' : 'Uploaded Material'}<br/>
                    <strong>Class:</strong> {classLevel}<br/>
                    <strong>Global Modules:</strong> {globalModules.length > 0 ? globalModules.join(', ') : 'None'}<br/>
                    <strong>AI Character:</strong> {aiCharacter.replace('_', ' ')}<br/>
                    <strong>Language:</strong> {language}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGenerate}
                size="lg"
                loading={loading}
                className="px-16 py-6 text-2xl"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                🎯 Generate AI Lesson Pack
              </Button>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  🚀 <strong>2-minute generation:</strong> Complete lesson pack with animations, Q&A, activities, and teacher controls - ready to project and teach!
                </p>
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Navigation */}
      {step > 1 && (
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          {step < 4 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <span>→</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};