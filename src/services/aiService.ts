import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonInput, LessonOutput } from '../types';
import { GLOBAL_MODULES } from '../config/constants';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateLessonPack = async (input: LessonInput): Promise<LessonOutput> => {
  // Check if API key is available
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using enhanced fallback');
    return generateFallbackResponse(input);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const globalModuleInfo = GLOBAL_MODULES.find(m => m.value === input.globalModule) || GLOBAL_MODULES[0];
    
    const prompt = `You are ASman Learning AI - an expert teacher assistant specializing in interactive whiteboard education for Indian NCERT curriculum (Class 1-5).

Your mission: Transform traditional lessons into engaging, visual, and interactive experiences that work perfectly with AI whiteboards and personalized learning.

CONTENT TO PROCESS:
${input.text}

CLASS LEVEL: ${input.classLevel} (Ages ${getAgeRange(input.classLevel)})
GLOBAL MODULE: ${globalModuleInfo.label} - ${globalModuleInfo.description}

Create a comprehensive lesson pack with these components:

1. SIMPLIFIED EXPLANATION (AI Whiteboard Ready):
- Perfect for Class ${input.classLevel} students
- Include visual cues and animation suggestions
- Use simple language with Indian cultural examples
- Break into visual, interactive chunks
- Add emoji and whiteboard display markers

2. PRACTICAL ACTIVITY (Classroom + Digital):
- Design hands-on activities with AI whiteboard support
- Include physical materials and digital interactions
- Ensure inclusive participation for all learning paces
- Connect to Indian culture and environment
- Provide step-by-step teacher instructions

3. STUDENT Q&A (AI Assistant Ready):
- Create 4-5 common student questions about this topic
- Provide child-friendly answers with examples
- Include follow-up questions for deeper thinking
- Make suitable for AI voice responses

4. GLOBAL LEARNING INTEGRATION:
- Incorporate ${globalModuleInfo.label} perspective
- Balance global knowledge with Indian values
- Show world connections while maintaining cultural sensitivity

Respond with ONLY valid JSON in this exact format:
{
  "simplified_explanation": "detailed explanation here",
  "practical_activity": "detailed activity here", 
  "questions_and_answers": [
    {"q": "question 1", "a": "answer 1"},
    {"q": "question 2", "a": "answer 2"},
    {"q": "question 3", "a": "answer 3"},
    {"q": "question 4", "a": "answer 4"}
  ],
  "global_module_used": "${globalModuleInfo.label}"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON response
    let cleanedText = text.trim();
    
    // Remove any markdown code blocks
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Find JSON object
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const parsedOutput = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsedOutput.simplified_explanation || 
        !parsedOutput.practical_activity || 
        !Array.isArray(parsedOutput.questions_and_answers) ||
        parsedOutput.questions_and_answers.length === 0) {
      throw new Error('Invalid response structure from AI');
    }
    
    return parsedOutput as LessonOutput;
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Provide detailed error information
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      }
      if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      if (error.message.includes('JSON')) {
        console.warn('JSON parsing failed, using fallback response');
        return generateFallbackResponse(input);
      }
    }
    
    // For any other errors, use fallback
    return generateFallbackResponse(input);
  }
};

const generateFallbackResponse = (input: LessonInput): LessonOutput => {
  const globalModuleInfo = GLOBAL_MODULES.find(m => m.value === input.globalModule) || GLOBAL_MODULES[0];
  
  return {
    simplified_explanation: `🎨 Interactive AI Whiteboard Lesson - Class ${input.classLevel}

👋 Hello Class ${input.classLevel}! Today we're exploring an exciting topic together!

🖼️ WHITEBOARD VISUALIZATION:
[AI creates live animations as teacher explains]
• Visual storytelling with moving pictures
• Step-by-step animations bringing concepts to life
• Interactive elements students can touch and explore

📖 LESSON CONTENT:
${input.text.slice(0, 500)}...

🌟 What Makes This Special:
• Every concept becomes a visual story on our smart whiteboard
• Students ask questions anytime and get instant, friendly answers
• Learning happens at each child's own pace
• We connect new ideas to familiar things from daily life

🏠 Real-Life Connections:
This topic appears everywhere around us! From our homes to neighborhoods, from festivals to daily routines. The AI whiteboard shows you exactly where and how!

🎯 Learning Goals:
✅ Understand through visual stories
✅ Connect learning to real experiences  
✅ Ask curious questions and explore together
✅ Build confidence through interaction

💡 Teacher's Note: AI whiteboard automatically creates animations, diagrams, and interactive elements as you teach!`,

    practical_activity: `🎯 "AI Whiteboard Discovery Lab" - Interactive Classroom Experience

🎨 WHITEBOARD SETUP (AI-Powered):
• AI creates dynamic visual workspace
• Interactive zones for different activities
• Real-time drawing and animation
• Student response collection system

📋 MATERIALS NEEDED:
Physical: Colorful sticky notes, everyday objects, chart paper, crayons
Digital: AI Whiteboard, student devices (optional), voice interaction

👥 ACTIVITY STRUCTURE (50 minutes):

🔸 Phase 1: AI Introduction (10 min)
- Teacher introduces while AI creates live visuals
- Students watch concepts come alive
- AI responds to questions with instant visuals
- Interactive polls: "What happens next?"

🔸 Phase 2: Hands-On Exploration (25 min)
Station 1: Physical exploration with real objects
Station 2: AI whiteboard interaction (draw/touch)
Station 3: Storytelling with visual props  
Station 4: Question corner with AI assistant

🔸 Phase 3: Creative Synthesis (15 min)
- Groups create visual stories on AI whiteboard
- Students explain using drawings and words
- AI illustrates student ideas in real-time
- Celebration with digital badges

🌟 PERSONALIZED FEATURES:
• AI adapts explanations to individual responses
• Visual learners get more diagrams
• Kinesthetic learners get touch activities
• Verbal learners get storytelling

🎯 OUTCOMES:
✅ Active engagement with AI-enhanced visuals
✅ Digital literacy alongside subject knowledge
✅ Confidence through personalized AI support
✅ Lasting memories through multi-sensory experiences`,

    questions_and_answers: [
      {
        q: "How does the AI whiteboard make learning more fun than regular teaching?",
        a: "The AI whiteboard is like having a magical drawing friend! When your teacher talks about the water cycle, you see animated clouds moving, rain falling, and rivers flowing right on the board. You can touch the screen to make things happen! It's like your favorite cartoon, but you're learning important things. Plus, you can ask the AI questions and it draws the answer instantly!"
      },
      {
        q: "Can I ask the AI questions during class without disturbing others?",
        a: "Yes! The AI is your personal learning buddy. You can whisper questions, write on your tablet, or draw what confuses you. The AI understands all these ways and gives you a quiet, personal answer. Sometimes, if your question is really good, the teacher might ask the AI to share it with the whole class!"
      },
      {
        q: "How does this help me learn better than just reading books?",
        a: "Reading books is important, but ASman Learning makes those ideas come alive! Instead of just reading 'plants need water,' you see an animated plant growing when you give it water on the whiteboard. You can experiment and try again in a safe, fun way. The AI remembers how you like to learn best!"
      },
      {
        q: "Will the AI replace my teacher?",
        a: "Never! Your teacher is the most important person in your classroom. The AI is like a super-smart helper that makes your teacher even more amazing! Your teacher is the captain, and AI is a helpful crew member. Your teacher's care, wisdom, and personal attention can never be replaced!"
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
  await new Promise(resolve => setTimeout(resolve, 2000));
  return `[OCR Processing] Extracted text from ${file.name}:\n\nThis would contain the actual text extracted from your PDF or image file. The OCR service would analyze the document and convert any text content into editable format for lesson generation.`;
};

// Speech-to-Text Service  
export const processSpeechToText = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return `[Speech-to-Text Processing] Transcribed content from ${file.name}:\n\nThis would contain the actual transcribed text from your audio file. The speech recognition service would convert spoken content into text format for lesson generation.`;
};