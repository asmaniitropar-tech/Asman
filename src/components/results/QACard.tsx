import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface QACardProps {
  questions: Array<{ q: string; a: string }>;
}

export const QACard: React.FC<QACardProps> = ({ questions }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <Card>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Questions & Answers</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {questions.map((qa, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <motion.button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="font-medium text-gray-800 pr-4">{qa.q}</span>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </motion.button>
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-blue-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{qa.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  );
};