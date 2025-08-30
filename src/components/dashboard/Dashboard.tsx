import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../layout/Header';
import { TeacherWorkflow } from './TeacherWorkflow';
import { LessonPreview } from './LessonPreview';
import { Card } from '../ui/Card';
import { BookOpen, Upload, Globe, Bot, Clock, Users, TrendingUp, Award } from 'lucide-react';
import { LessonInput, LessonPack } from '../../types';
import { generateTeacherLessonPack } from '../../services/aiService';
import toast from 'react-hot-toast';

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentStep, setCurrentStep] = useState<'dashboard' | 'workflow' | 'preview'>('dashboard');
  const [lessonPack, setLessonPack] = useState<LessonPack | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateLesson = async (input: LessonInput) => {
    setLoading(true);
    toast.loading('AI is creating your lesson pack...', { id: 'generation' });
    
    try {
      const pack = await generateTeacherLessonPack(input);
      setLessonPack(pack);
      setCurrentStep('preview');
      toast.success('Lesson pack ready for your classroom!', { id: 'generation' });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate lesson pack. Please try again.', { id: 'generation' });
    } finally {
      setLoading(false);
    }
  };

  const teacherStats = [
    { icon: Clock, label: 'Prep Time Saved', value: '75%', color: 'text-orange-600', desc: 'Average time reduction' },
    { icon: Users, label: 'Student Engagement', value: '95%', color: 'text-green-600', desc: 'Active participation' },
    { icon: TrendingUp, label: 'Learning Outcomes', value: '85%', color: 'text-blue-600', desc: 'Improved retention' },
    { icon: Award, label: 'Teacher Satisfaction', value: '98%', color: 'text-purple-600', desc: 'Positive feedback' }
  ];

  if (currentStep === 'workflow') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        <Header user={user} onLogout={onLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeacherWorkflow 
            onGenerate={handleGenerateLesson}
            onBack={() => setCurrentStep('dashboard')}
            loading={loading}
          />
        </main>
      </div>
    );
  }

  if (currentStep === 'preview' && lessonPack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        <Header user={user} onLogout={onLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LessonPreview 
            lessonPack={lessonPack}
            onBack={() => setCurrentStep('dashboard')}
            onEdit={() => setCurrentStep('workflow')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome back, <span className="text-orange-600">{user.name.split(' ')[0]}</span>! 👩‍🏫
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI teaching partner is ready to transform NCERT lessons into engaging, interactive experiences. 
            Save prep time while giving students global exposure rooted in Indian values.
          </p>
        </motion.div>

        {/* Teacher Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {teacherStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.desc}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => setCurrentStep('workflow')}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">📂 NCERT Chapters</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pre-loaded content for Classes 1-5. Select and transform instantly.
                </p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-700 font-medium">
                    ✨ Most Popular Choice - Zero Prep Time!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => setCurrentStep('workflow')}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">📤 Upload Material</h3>
                <p className="text-sm text-gray-600 mb-4">
                  PDF, image, text, or voice. AI converts to structured lessons.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">
                    📱 Works with phone photos of textbook pages
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => setCurrentStep('workflow')}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">🌍 Global Modules</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add China, Japan, US, or Europe learning styles to NCERT.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    🎯 Optional - You decide what to include
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => setCurrentStep('workflow')}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">🎭 AI Character</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose your AI teaching assistant's personality and voice.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    👩‍🏫 Vidya, Arjun, or Dadi - each unique!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Teacher Benefits Section */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 How ASman Transforms Your Teaching Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Save 75% Prep Time</h3>
              <p className="text-sm text-gray-600">
                No more hours creating visual aids. AI generates animations, activities, and Q&A instantly from NCERT content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Boost Student Engagement</h3>
              <p className="text-sm text-gray-600">
                Interactive AI animations and global perspectives keep students curious and actively participating in lessons.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Global + Local Balance</h3>
              <p className="text-sm text-gray-600">
                Expose students to world-class learning methods while staying firmly rooted in Indian values and NCERT curriculum.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Start Guide */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium text-gray-800">Choose Content</p>
                <p className="text-xs text-gray-600">NCERT or Upload</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium text-gray-800">Select Options</p>
                <p className="text-xs text-gray-600">Global modules & AI character</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium text-gray-800">AI Generates</p>
                <p className="text-xs text-gray-600">Complete lesson pack</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-medium text-gray-800">Teach & Engage</p>
                <p className="text-xs text-gray-600">Project & interact</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Start Button */}
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep('workflow')}
            className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            🎨 Start Creating Your AI Lesson
          </motion.button>
          <p className="text-sm text-gray-600 mt-3">
            Transform any NCERT content into an engaging AI whiteboard experience in under 2 minutes
          </p>
        </div>
      </main>
    </div>
  );
};