import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Upload, FileText, Mic, Sparkles } from 'lucide-react';
import { CLASS_LEVELS, GLOBAL_MODULES } from '../../config/constants';
import { LessonInput } from '../../types';
import { processOCR, processSpeechToText } from '../../services/aiService';
import toast from 'react-hot-toast';

interface UploadSectionProps {
  onGenerate: (input: LessonInput) => Promise<void>;
  loading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onGenerate, loading }) => {
  const [uploadType, setUploadType] = useState<'text' | 'pdf' | 'audio'>('text');
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [classLevel, setClassLevel] = useState('3');
  const [globalModule, setGlobalModule] = useState('auto');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    onDrop: async (files) => {
      const file = files[0];
      if (file) {
        setProcessing(true);
        try {
          let extractedText = '';
          
        if (file.type.includes('pdf') || file.type.includes('image')) {
          setUploadType('pdf');
            toast.loading('Processing document...', { id: 'processing' });
            extractedText = await processOCR(file);
        } else if (file.type.includes('audio')) {
          setUploadType('audio');
            toast.loading('Transcribing audio...', { id: 'processing' });
            extractedText = await processSpeechToText(file);
        }
          
          setText(extractedText);
          toast.success('File processed successfully!', { id: 'processing' });
        } catch (error) {
          console.error('File processing error:', error);
          toast.error('Failed to process file. Please try again.', { id: 'processing' });
        } finally {
          setProcessing(false);
        }
      }
    }
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    try {
      await onGenerate({
        text,
        classLevel,
        globalModule,
        uploadType
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate lesson pack. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Upload className="w-6 h-6 mr-3 text-orange-500" />
          Upload NCERT Content
        </h2>

        {/* Upload Type Selector */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { type: 'text', icon: FileText, label: 'Paste Text' },
            { type: 'pdf', icon: Upload, label: 'Upload PDF/Image' },
            { type: 'audio', icon: Mic, label: 'Upload Audio' }
          ].map(({ type, icon: Icon, label }) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUploadType(type as any)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                uploadType === type
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content Input */}
        {uploadType === 'text' ? (
          <Textarea
            label="NCERT Lesson Content"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your NCERT lesson content here... 

Example: 'Water Cycle - Water from rivers and seas goes up to the sky as water vapor. It forms clouds and comes back as rain...'

The AI will create interactive whiteboard animations and student-friendly explanations!"
            rows={8}
          />
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-orange-500 bg-orange-50'
                : processing 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {processing ? (
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            )}
            <p className="text-lg font-medium text-gray-700 mb-2">
              {processing 
                ? 'Processing your file...' 
                : isDragActive 
                  ? 'Drop your file here' 
                  : `Upload ${uploadType === 'pdf' ? 'NCERT Textbook Pages' : 'Teacher Audio Notes'}`
              }
            </p>
            <p className="text-sm text-gray-500">
              {processing
                ? 'AI is extracting content for whiteboard visualization...'
                : uploadType === 'pdf' 
                  ? 'Upload textbook pages - AI will extract and visualize content' 
                  : 'Upload audio notes - AI will transcribe and create activities'
              }
            </p>
          </div>
        )}

        {text && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Content Preview:</p>
            <p className="text-sm text-gray-800 line-clamp-3">{text}</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Select
            label="Class Level (Age Group)"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            options={CLASS_LEVELS}
          />
          <div className="mt-3 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700">
              🎯 Content will be tailored for Class {classLevel} students (ages {getAgeRange(classLevel)})
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <Select
            label="Global Learning Module"
            value={globalModule}
            onChange={(e) => setGlobalModule(e.target.value)}
            options={GLOBAL_MODULES.map(m => ({ value: m.value, label: m.label }))}
          />
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              🌍 {GLOBAL_MODULES.find(m => m.value === globalModule)?.description}
            </p>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={handleGenerate}
          size="lg"
          loading={loading || processing}
          disabled={!text.trim() || processing}
          className="px-12 py-4 text-xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          {processing ? 'Processing Content...' : 'Create AI Whiteboard Lesson 🎨'}
        </Button>
      </div>
    </div>
  );
};

const getAgeRange = (classLevel: string): string => {
  const ageMap: Record<string, string> = {
    '1': '6-7 years',
    '2': '7-8 years', 
    '3': '8-9 years',
    '4': '9-10 years',
    '5': '10-11 years'
  };
  return ageMap[classLevel] || '8-10 years';
};