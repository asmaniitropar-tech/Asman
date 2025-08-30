import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, FileText, Share2 } from 'lucide-react';
import { LessonOutput } from '../../types';
import jsPDF from 'jspdf';

interface ExportSectionProps {
  lessonOutput: LessonOutput;
  classLevel: string;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ 
  lessonOutput, 
  classLevel 
}) => {
  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ASman Learning - Lesson Pack', margin, 30);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Class Level: ${classLevel}`, margin, 45);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 55);
    
    let yPosition = 75;
    
    // Simplified Lesson
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Simplified Lesson', margin, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const simplifiedLines = pdf.splitTextToSize(lessonOutput.simplified_explanation, maxWidth);
    pdf.text(simplifiedLines, margin, yPosition);
    yPosition += simplifiedLines.length * 5 + 15;
    
    // Practical Activity
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Practical Activity', margin, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const activityLines = pdf.splitTextToSize(lessonOutput.practical_activity, maxWidth);
    pdf.text(activityLines, margin, yPosition);
    yPosition += activityLines.length * 5 + 15;
    
    // Q&A
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Questions & Answers', margin, yPosition);
    yPosition += 15;
    
    lessonOutput.questions_and_answers.forEach((qa, index) => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Q${index + 1}: ${qa.q}`, margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const answerLines = pdf.splitTextToSize(`A: ${qa.a}`, maxWidth);
      pdf.text(answerLines, margin, yPosition);
      yPosition += answerLines.length * 5 + 10;
    });
    
    pdf.save('asman-lesson-pack.pdf');
  };

  const exportToWord = () => {
    const content = `
ASman Learning - Lesson Pack
Class Level: ${classLevel}
Generated on: ${new Date().toLocaleDateString()}

SIMPLIFIED LESSON
${lessonOutput.simplified_explanation}

PRACTICAL ACTIVITY
${lessonOutput.practical_activity}

QUESTIONS & ANSWERS
${lessonOutput.questions_and_answers.map((qa, index) => 
  `Q${index + 1}: ${qa.q}\nA: ${qa.a}`
).join('\n\n')}

GLOBAL MODULE
${lessonOutput.global_module_used}
    `;
    
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asman-lesson-pack.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <Download className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Export Lesson Pack</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={exportToPDF}
            variant="primary"
            className="flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Export PDF</span>
          </Button>
          
          <Button
            onClick={exportToWord}
            variant="secondary"
            className="flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Export Word</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 text-center">
            Download your complete lesson pack to use in your classroom
          </p>
        </div>
      </div>
    </Card>
  );
};