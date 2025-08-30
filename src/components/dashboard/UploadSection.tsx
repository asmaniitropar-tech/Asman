import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Upload, FileText, Mic, Camera, CheckCircle } from 'lucide-react';
import { processOCR, processSpeechToText } from '../../services/aiService';
import toast from 'react-hot-toast';

interface UploadSectionProps {
  onContentExtracted: (content: string) => void;
  content: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  onContentExtracted, 
  content 
}) => {
  const [uploadType, setUploadType] = useState<'text' | 'file' | 'audio'>('text');
  const [processing, setProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxSize: 10 * 1024 * 1024, // 10MB limit
    onDrop: async (files) => {
      const file = files[0];
      if (file) {
        setProcessing(true);
        try {
          let extractedText = '';
          
          if (file.type.includes('pdf') || file.type.includes('image')) {
            toast.loading('Reading your document...', { id: 'processing' });
            extractedText = await processOCR(file);
          } else if (file.type.includes('audio')) {
            toast.loading('Transcribing your voice...', { id: 'processing' });
            extractedText = await processSpeechToText(file);
          }
          
          onContentExtracted(extractedText);
          toast.success('Content extracted successfully!', { id: 'processing' });
        } catch (error) {
          console.error('File processing error:', error);
          toast.error(`Failed to process ${file.name}. Please try again.`, { id: 'processing' });
        } finally {
          setProcessing(false);
        }
      }
    },
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      if (file.errors.some(e => e.code === 'file-too-large')) {
        toast.error('File too large. Please upload files smaller than 10MB.');
      } else {
        toast.error('File type not supported. Please upload PDF, image, or audio files.');
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">📤 Upload Your Teaching Material</h3>
        <p className="text-gray-600">AI will convert any format into structured, interactive lessons</p>
      </div>

      {/* Upload Type Selector */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { type: 'text', icon: FileText, label: 'Type/Paste Text', desc: 'Direct text input' },
          { type: 'file', icon: Camera, label: 'Photo/PDF', desc: 'Textbook pages, worksheets' },
          { type: 'audio', icon: Mic, label: 'Voice Recording', desc: 'Your lesson notes' }
        ].map(({ type, icon: Icon, label, desc }) => (
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
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </motion.button>
        ))}
      </div>

      {/* Content Input */}
      {uploadType === 'text' ? (
        <Textarea
          label="Lesson Content"
          value={content}
          onChange={(e) => onContentExtracted(e.target.value)}
          placeholder="Paste your lesson content here... For example: 'Chapter 3: Water Cycle - Water is everywhere around us. It falls as rain, flows in rivers, and evaporates into clouds...'"
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
              ? 'AI is reading your content...' 
              : isDragActive 
                ? 'Drop your file here' 
                : `Upload ${uploadType === 'file' ? 'Document/Image' : 'Audio'} File`
            }
          </p>
          <p className="text-sm text-gray-500">
            {processing
              ? 'Converting to structured lesson content...'
              : uploadType === 'file' 
                ? 'Supports PDF, PNG, JPG - even phone photos of textbook pages!' 
                : 'Supports MP3, WAV, M4A - record your lesson ideas'
            }
          </p>
        </div>
      )}

      {content && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Content Ready</span>
          </div>
          <p className="text-sm text-green-700 mb-2">Preview:</p>
          <p className="text-sm text-gray-700 bg-white p-3 rounded border line-clamp-3">
            {content}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">📱 Teacher-Friendly Features:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Phone photos of textbook pages work perfectly</li>
            <li>• Voice recordings convert to structured lessons</li>
            <li>• Handwritten notes become digital content</li>
            <li>• Any format becomes interactive AI whiteboard material</li>
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 What AI Creates:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Child-friendly explanations with animations</li>
            <li>• Interactive Q&A with your AI character</li>
            <li>• Hands-on activities aligned with content</li>
            <li>• Optional global learning perspectives</li>
          </ul>
        </div>
      </div>
    </div>
  );
};