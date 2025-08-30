import { LessonInput, LessonOutput } from '../types';

// Mock AI service - In production, you'd integrate with Google Gemini Pro API
export const generateLessonPack = async (input: LessonInput): Promise<LessonOutput> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Mock response based on input
  const mockOutput: LessonOutput = {
    simplified_explanation: `This lesson teaches us about ${input.text.slice(0, 50)}... 

For Class ${input.classLevel} students, we can understand this topic by thinking of it like everyday things we see around us. 

The main ideas are:
• Simple concept explanation suitable for young minds
• Real-world examples they can relate to
• Step-by-step breakdown of complex ideas
• Fun facts to keep them engaged

This helps students build a strong foundation while making learning enjoyable and memorable.`,

    practical_activity: `🎯 Classroom Activity: "Hands-On Learning Adventure"

Materials needed:
• Chart paper and colorful markers
• Small objects for demonstration
• Sticky notes for group work

Steps:
1. Divide students into groups of 4-5
2. Give each group a different aspect of the lesson to explore
3. Students create visual presentations using drawings and simple words
4. Each group presents their findings to the class
5. Create a class "knowledge wall" with all discoveries

Duration: 45 minutes
Learning outcome: Students will actively engage with the concept and remember it better through hands-on experience.`,

    questions_and_answers: [
      {
        q: `What is the main idea we learned about in today's lesson?`,
        a: `The main idea is about understanding the basic concepts through simple examples that connect to our daily life experiences.`
      },
      {
        q: `Can you give an example of how this topic relates to something you see at home?`,
        a: `Students can relate this to everyday objects and situations they encounter, making the learning more meaningful and memorable.`
      },
      {
        q: `Why is it important to learn about this topic?`,
        a: `This topic helps us understand the world around us better and builds the foundation for more advanced learning in higher classes.`
      }
    ],

    global_module_used: getGlobalModuleName(input.globalModule)
  };

  return mockOutput;
};

const getGlobalModuleName = (module: string): string => {
  const moduleMap: Record<string, string> = {
    'auto': 'Global Exposure',
    'china': 'Chinese Discipline Methods',
    'japan': 'Japanese Precision Learning',
    'us': 'American Innovation Approach',
    'europe': 'European Creative Methods'
  };
  
  return moduleMap[module] || 'Global Exposure';
};

// OCR Service Mock
export const processOCR = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return `[OCR processed content from ${file.name}] - This would contain the extracted text from the uploaded PDF or image file.`;
};

// Speech-to-Text Service Mock
export const processSpeechToText = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return `[Speech-to-text processed content from ${file.name}] - This would contain the transcribed text from the uploaded audio file.`;
};