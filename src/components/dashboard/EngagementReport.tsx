import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { BarChart3, TrendingUp, Users, Clock, Target, Lightbulb } from 'lucide-react';

interface EngagementReportProps {
  lessonId: string;
}

export const EngagementReport: React.FC<EngagementReportProps> = ({ lessonId }) => {
  // Mock engagement data - in production this would come from actual lesson analytics
  const mockData = {
    totalStudents: 28,
    activeParticipants: 26,
    questionsAnswered: 45,
    totalQuestions: 50,
    averageEngagementTime: '18 minutes',
    strugglingAreas: ['Water cycle stages', 'Evaporation concept'],
    highEngagementMoments: ['Rain animation', 'Cloud formation demo', 'Interactive water drop journey'],
    globalModuleUsage: {
      'China Focus': { used: true, engagement: 85 },
      'Japan Focus': { used: false, engagement: 0 },
      'US Focus': { used: true, engagement: 92 }
    },
    recommendations: [
      'Students loved the water drop animation - consider similar approaches for other science topics',
      'Some students needed extra time with evaporation - add more visual examples',
      'US Focus curiosity activities were very popular - use more hands-on experiments'
    ]
  };

  const engagementPercentage = Math.round((mockData.questionsAnswered / mockData.totalQuestions) * 100);
  const participationRate = Math.round((mockData.activeParticipants / mockData.totalStudents) * 100);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
          📊 Post-Class Engagement Report
        </h2>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{participationRate}%</div>
            <div className="text-sm text-green-700 font-medium">Student Participation</div>
            <div className="text-xs text-gray-500">{mockData.activeParticipants}/{mockData.totalStudents} students</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{engagementPercentage}%</div>
            <div className="text-sm text-blue-700 font-medium">Questions Answered</div>
            <div className="text-xs text-gray-500">{mockData.questionsAnswered}/{mockData.totalQuestions} responses</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{mockData.averageEngagementTime}</div>
            <div className="text-sm text-purple-700 font-medium">Avg. Engagement</div>
            <div className="text-xs text-gray-500">Per student</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">A+</div>
            <div className="text-sm text-orange-700 font-medium">Overall Grade</div>
            <div className="text-xs text-gray-500">Excellent engagement</div>
          </div>
        </div>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            High Engagement Moments
          </h3>
          <div className="space-y-3">
            {mockData.highEngagementMoments.map((moment, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">🎯</span>
                <span className="text-gray-700">{moment}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-600" />
            Areas Needing Attention
          </h3>
          <div className="space-y-3">
            {mockData.strugglingAreas.map((area, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-600">⚠️</span>
                <span className="text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Global Module Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Global Module Performance
        </h3>
        <div className="space-y-4">
          {Object.entries(mockData.globalModuleUsage).map(([module, data]) => (
            <div key={module} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={data.used ? 'text-green-600' : 'text-gray-400'}>
                  {data.used ? '✅' : '⭕'}
                </span>
                <span className="font-medium text-gray-800">{module}</span>
              </div>
              {data.used && (
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.engagement}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{data.engagement}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          AI Recommendations for Next Lessons
        </h3>
        <div className="space-y-3">
          {mockData.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg"
            >
              <span className="text-yellow-600 text-lg">💡</span>
              <p className="text-gray-700">{rec}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Export Report */}
      <div className="text-center">
        <div className="flex justify-center space-x-4">
          <Button variant="primary" className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>📄 Export PDF Report</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>📱 Share via WhatsApp</span>
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share insights with school administration or send simplified notes to parents
        </p>
      </div>
    </div>
  );
};