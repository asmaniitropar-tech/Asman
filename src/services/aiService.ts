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
You are ASman Learning AI - an expert teacher assistant specializing in interactive whiteboard education for Indian NCERT curriculum (Class 1-5). 

Your mission: Transform traditional lessons into engaging, visual, and interactive experiences that work perfectly with AI whiteboards and personalized learning.
CONTENT TO PROCESS:
${input.text}

LESSON CREATION REQUIREMENTS:

1. SIMPLIFIED EXPLANATION (for AI Whiteboard):
   - Perfect for Class ${input.classLevel} students (ages ${getAgeRange(input.classLevel)})
   - Include visual cues and animation suggestions for AI whiteboard
   - Use simple language with relatable examples from Indian context
   - Break complex concepts into bite-sized, visual chunks
   - Add emoji and visual markers for whiteboard display

2. PRACTICAL ACTIVITY (Classroom + Digital):
   - Design hands-on activities that work with AI whiteboard support
   - Include both physical materials and digital interactions
   - Ensure every student can participate regardless of learning pace
   - Connect to real-life examples from Indian culture and environment
   - Provide step-by-step instructions for teachers

3. STUDENT Q&A (Personalized Learning):
   - Create 4-5 questions that students commonly ask about this topic
   - Provide child-friendly answers with examples and analogies
   - Include follow-up questions to encourage deeper thinking
   - Make answers suitable for AI voice responses

4. GLOBAL LEARNING INTEGRATION:
   - Incorporate ${globalModuleInfo.label} perspective: ${globalModuleInfo.description}
   - Balance global knowledge with strong Indian educational values
   - Show how this topic connects to the wider world
   - Maintain cultural sensitivity and inclusivity

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
    simplified_explanation: `🎨 Interactive AI Whiteboard Lesson - Class ${input.classLevel}

👋 Hello Class ${input.classLevel}! Today we're going to explore an amazing topic together!

🖼️ WHITEBOARD VISUALIZATION:
[AI will draw and animate concepts as teacher explains]
• Visual storytelling with moving pictures
• Step-by-step animations that bring ideas to life
• Interactive elements students can touch and explore

📖 LESSON CONTENT:
${input.text.slice(0, 300)}...

🌟 What Makes This Special:
• Every concept becomes a visual story on our smart whiteboard
• Students can ask questions anytime and get instant, friendly answers
• Learning happens at each child's own pace
• We connect new ideas to things you already know and love

🏠 Real-Life Connections:
This topic appears everywhere around us! From our homes to our neighborhoods, from festivals to daily routines. The AI whiteboard will show you exactly where and how!

🎯 Learning Goals for Today:
✅ Understand the main concept through visual stories
✅ Connect learning to real-life experiences
✅ Ask curious questions and explore answers together
✅ Build confidence through interactive participation

💡 Teacher's Note: The AI whiteboard will automatically create animations, diagrams, and interactive elements as you teach, making every explanation come alive for your students!`,

    practical_activity: `🎯 "AI Whiteboard Discovery Lab" - Interactive Classroom Experience

🎨 WHITEBOARD SETUP (AI-Powered):
• AI creates dynamic visual workspace
• Interactive zones for different learning activities
• Real-time drawing and animation capabilities
• Student response collection system

📋 MATERIALS NEEDED:
Physical Materials:
• Colorful sticky notes (4 colors)
• Simple everyday objects for demonstration
• Chart paper for group work
• Crayons/markers for drawing

Digital Tools:
• AI Whiteboard (main display)
• Student tablets/devices (if available)
• Voice interaction system

👥 ACTIVITY STRUCTURE (50 minutes):

🔸 Phase 1: AI Whiteboard Introduction (10 minutes)
- Teacher introduces topic while AI creates live visuals
- Students watch concepts come alive on the whiteboard
- AI responds to student questions with instant visual answers
- Interactive polls: "What do you think will happen next?"

🔸 Phase 2: Hands-On Exploration (25 minutes)
- Groups rotate through 4 learning stations:
  Station 1: Physical exploration with real objects
  Station 2: AI whiteboard interaction (students draw/touch)
  Station 3: Storytelling with visual props
  Station 4: Question corner with AI assistant

🔸 Phase 3: Creative Synthesis (15 minutes)
- Each group creates a visual story on the AI whiteboard
- Students explain their understanding using drawings and words
- AI helps illustrate student ideas in real-time
- Celebration of learning with digital badges

🌟 PERSONALIZED LEARNING FEATURES:
• AI adapts explanations based on individual student responses
• Visual learners get more diagrams and animations
• Kinesthetic learners get interactive touch activities
• Verbal learners get storytelling and discussion opportunities

🎯 LEARNING OUTCOMES:
✅ Students actively engage with AI-enhanced visual learning
✅ Develop digital literacy alongside subject knowledge
✅ Build confidence through personalized AI support
✅ Create lasting memories through multi-sensory experiences
✅ Practice collaboration in technology-enhanced environment

📱 TEACHER SUPPORT:
• AI provides real-time teaching suggestions
• Automatic progress tracking for each student
• Instant content adaptation based on class response
• Digital lesson plan with visual cues and timing guides`,

    questions_and_answers: [
      {
        q: "How does the AI whiteboard make learning more fun than regular teaching?",
        a: "The AI whiteboard is like having a magical drawing friend who can bring any story to life! When your teacher talks about the water cycle, you don't just hear about it - you see animated clouds moving, rain falling, and rivers flowing right on the board. You can even touch the screen to make things happen! It's like watching your favorite cartoon, but you're learning important things at the same time. Plus, if you have a question, you can ask the AI and it will draw the answer for you instantly!"
      },
      {
        q: "Can I ask the AI questions during class without disturbing others?",
        a: "Absolutely! The AI is designed to be your personal learning buddy. You can whisper your questions, write them on your tablet, or even draw what you're confused about. The AI understands all these ways of asking and will give you a quiet, personal answer that appears just for you. Sometimes, if your question is really good, the teacher might ask the AI to share the answer with the whole class on the big whiteboard!"
      },
      {
        q: "How does this help me learn better than just reading from books?",
        a: "Reading books is important, but ASman Learning makes those book ideas come alive! Instead of just reading 'plants need water,' you see an animated plant growing when you give it water on the whiteboard. You can experiment, make mistakes, and try again - all in a safe, fun way. The AI also remembers how you like to learn best and gives you activities that match your style. Some students learn by seeing, some by doing, and some by hearing - the AI helps with all of these!"
      },
      {
        q: "Will the AI replace my teacher?",
        a: "Never! Your teacher is the most important person in your classroom. The AI is like a super-smart helper that makes your teacher even more amazing! Think of it like this: your teacher is the captain of a ship, and the AI is a helpful crew member. The teacher decides what to teach and how to help you grow, while the AI provides cool tools and visuals to make learning more exciting. Your teacher's care, wisdom, and personal attention can never be replaced by any technology!"
      },
      {
        q: "How does this connect our Indian culture with learning from other countries?",
        a: "ASman Learning is like a bridge that connects the best of both worlds! We start with our strong Indian values - respect for teachers, family connections, and cultural wisdom. Then we add the best learning methods from around the world. For example, we might learn about fractions using Indian sweets like laddu and jalebi, but also see how children in Japan use origami to understand the same concept. This way, we stay proud of our roots while becoming global citizens who can learn from everyone!"
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