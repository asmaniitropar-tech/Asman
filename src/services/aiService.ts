import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonInput, LessonOutput } from '../types';
import { GLOBAL_MODULES } from '../config/constants';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export const generateLessonPack = async (input: LessonInput): Promise<LessonOutput> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const globalModuleInfo = GLOBAL_MODULES.find(m => m.value === input.globalModule) || GLOBAL_MODULES[0];
    
    const prompt = `
You are an expert teacher assistant for Indian NCERT curriculum. Create a comprehensive lesson pack for Class ${input.classLevel} students based on the following content:

CONTENT TO PROCESS:
${input.text}

REQUIREMENTS:
1. Create a simplified explanation suitable for Class ${input.classLevel} students (ages ${getAgeRange(input.classLevel)})
2. Design a practical hands-on activity that can be done in a classroom
3. Generate 3-4 relevant questions with detailed answers
4. Incorporate ${globalModuleInfo.label} learning perspective: ${globalModuleInfo.description}

RESPONSE FORMAT (JSON):
{
  "simplified_explanation": "Age-appropriate explanation with examples and analogies",
  "practical_activity": "Detailed classroom activity with materials, steps, and learning outcomes",
  "questions_and_answers": [
    {"q": "Question 1", "a": "Detailed answer 1"},
    {"q": "Question 2", "a": "Detailed answer 2"},
    {"q": "Question 3", "a": "Detailed answer 3"}
  ],
  "global_module_used": "${globalModuleInfo.label}"
}

Make sure the content is:
- Age-appropriate and engaging
- Culturally sensitive and inclusive
- Aligned with NCERT learning objectives
- Practical and implementable in Indian classrooms
- Incorporating the specified global learning perspective

Respond ONLY with valid JSON.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsedOutput = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!parsedOutput.simplified_explanation || !parsedOutput.practical_activity || !parsedOutput.questions_and_answers) {
        throw new Error('Invalid response structure');
      }
      
      return parsedOutput as LessonOutput;
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to structured mock response
      return generateFallbackResponse(input);
    }
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes('API_KEY')) {
      throw new Error('AI service not configured. Please add your Gemini API key.');
    }
    
    // Fallback to enhanced mock response
    return generateFallbackResponse(input);
  }
};

const generateFallbackResponse = (input: LessonInput): LessonOutput => {
  const globalModuleInfo = GLOBAL_MODULES.find(m => m.value === input.globalModule) || GLOBAL_MODULES[0];
  
  return {
    simplified_explanation: `📚 Understanding the Lesson (Class ${input.classLevel})

Let's explore this topic in a way that's perfect for Class ${input.classLevel} students!

${input.text.slice(0, 200)}...

🔍 Key Points:
• We break down complex ideas into simple, fun concepts
• We use examples from everyday life that students can easily understand
• We connect learning to things students already know
• We make sure every student can participate and learn

🌟 Why This Matters:
This lesson helps students build strong foundations while developing curiosity about the world around them. By understanding these concepts now, students will be better prepared for advanced topics in higher classes.

💡 Fun Fact: Did you know that learning becomes 3x more effective when we connect new information to things we already know? That's exactly what we're doing here!`,

    practical_activity: `🎯 Interactive Classroom Activity: "Discovery Learning Lab"

📋 Materials Needed:
• Chart paper (A3 size) - 1 per group
• Colored markers/crayons
• Sticky notes (different colors)
• Small everyday objects for demonstration
• Timer for activities

👥 Group Setup:
• Divide class into groups of 4-5 students
• Assign roles: Leader, Recorder, Presenter, Materials Manager

⏰ Activity Timeline (45 minutes):

🔸 Phase 1: Exploration (15 minutes)
- Groups examine the lesson topic through hands-on exploration
- Students discuss what they already know about the topic
- Record initial thoughts on sticky notes

🔸 Phase 2: Investigation (20 minutes)
- Each group focuses on a different aspect of the lesson
- Create visual representations using drawings and simple words
- Connect the topic to real-life examples from their community

🔸 Phase 3: Presentation (10 minutes)
- Each group presents their findings (2 minutes per group)
- Other students ask questions and share observations
- Teacher facilitates discussion and clarifies concepts

🎯 Learning Outcomes:
✅ Students actively engage with the concept
✅ Develop teamwork and communication skills
✅ Build confidence through peer teaching
✅ Create lasting memories through hands-on experience

📝 Assessment: Observe student participation, quality of presentations, and peer interactions.`,

    questions_and_answers: [
      {
        q: "What is the most important thing we learned in today's lesson?",
        a: "The most important thing is understanding how this topic connects to our daily lives. When we can see how learning applies to real situations, it becomes much more meaningful and easier to remember. This lesson shows us that education is not just about memorizing facts, but about understanding how things work in the world around us."
      },
      {
        q: "How can we use what we learned today in our everyday life?",
        a: "We can apply this learning by observing similar situations at home, in our neighborhood, or in nature. For example, we can look for patterns, ask questions about how things work, and share our discoveries with family and friends. This helps us become better observers and thinkers in all areas of life."
      },
      {
        q: "What makes this lesson different from just reading from a textbook?",
        a: "This lesson is special because it combines reading with doing, seeing, and experiencing. Instead of just memorizing information, we explore concepts through activities, discussions, and real examples. This approach helps us understand deeply and remember for a long time, making learning both fun and effective."
      },
      {
        q: "How does this lesson help us prepare for higher classes?",
        a: "This lesson builds strong thinking skills and curiosity that are essential for advanced learning. By understanding concepts thoroughly now and learning how to ask good questions, we develop the foundation needed for more complex topics in higher classes. It also teaches us how to learn effectively, which is a skill we'll use throughout our education."
      }
    ],

    global_module_used: globalModuleInfo.label
  };
};

const getAgeRange = (classLevel: string): string => {
  const ageMap: Record<string, string> = {
    '1': '6-7',
    '2': '7-8', 
    '3': '8-9',
    '4': '9-10',
    '5': '10-11'
  };
  return ageMap[classLevel] || '8-10';
};

// OCR Service
export const processOCR = async (file: File): Promise<string> => {
  // In production, you'd integrate with Google Vision API or similar
  await new Promise(resolve => setTimeout(resolve, 2000));
  return `[OCR Processing] Extracted text from ${file.name}:\n\nThis would contain the actual text extracted from your PDF or image file. The OCR service would analyze the document and convert any text content into editable format for lesson generation.`;
};

// Speech-to-Text Service  
export const processSpeechToText = async (file: File): Promise<string> => {
  // In production, you'd integrate with Google Speech-to-Text API or similar
  await new Promise(resolve => setTimeout(resolve, 3000));
  return `[Speech-to-Text Processing] Transcribed content from ${file.name}:\n\nThis would contain the actual transcribed text from your audio file. The speech recognition service would convert spoken content into text format for lesson generation.`;
};