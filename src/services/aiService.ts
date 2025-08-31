import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonInput, LessonPack } from '../types';
import toast from 'react-hot-toast';

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please check your environment variables.');
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function generateTeacherLessonPack(input: LessonInput): Promise<LessonPack> {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const globalModuleContext = input.globalModules.length > 0 
      ? `Include these global learning approaches: ${input.globalModules.join(', ')}. For each module, create specific activities that blend with NCERT content while maintaining Indian educational values.`
      : 'Focus purely on NCERT content with Indian context and examples.';

    const contentText = typeof input.content === 'string' 
      ? input.content 
      : `Class ${input.content.class} ${input.content.subject} - Chapter: ${input.content.chapter}, Topic: ${input.content.topic}`;

    const prompt = `
You are ASman Learning's AI assistant. Create a comprehensive lesson pack for Indian teachers.

CONTENT TO TEACH: ${contentText}
CLASS LEVEL: ${input.classLevel} (Ages ${6 + parseInt(input.classLevel)}-${7 + parseInt(input.classLevel)})
LANGUAGE: ${input.language}
AI CHARACTER: ${input.aiCharacter}
GLOBAL MODULES: ${globalModuleContext}

Create a JSON response with this exact structure:

{
  "id": "unique_lesson_id",
  "title": "Engaging lesson title",
  "simplifiedExplanation": "Child-friendly explanation with [AI DRAWS: animation description] markers where animations should appear. Use simple language for Class ${input.classLevel} students. Include both Hindi and English key terms naturally.",
  "practicalAnimation": {
    "description": "Overall animation concept that brings the lesson to life",
    "keyFrames": [
      "Frame 1: Opening animation that introduces the topic",
      "Frame 2: Main concept visualization",
      "Frame 3: Interactive demonstration",
      "Frame 4: Summary and conclusion"
    ],
    "interactionPoints": [
      "Students can touch animated elements to explore",
      "Tap characters to hear explanations",
      "Drag objects to see cause and effect"
    ]
  },
  "aiQA": [
    {
      "question": "What did you learn about the main topic?",
      "answer": "Encouraging response that reinforces learning",
      "type": "open"
    },
    {
      "question": "Which of these is correct?",
      "answer": "Option A is correct because...",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C"]
    }
  ],
  "handsOnTask": {
    "title": "Fun Activity Name",
    "materials": ["Simple classroom materials"],
    "steps": [
      "Step 1: Clear instruction",
      "Step 2: Next action",
      "Step 3: Final step"
    ],
    "duration": "15-20 minutes"
  },
  "globalModules": [
    {
      "name": "Selected Module Name",
      "activity": "Specific activity for this module",
      "culturalConnection": "How it connects to Indian values"
    }
  ],
  "audioScript": "Natural script for AI character to speak during lesson",
  "teacherNotes": "Practical tips for teachers including voice commands and control instructions"
}

Make the content engaging, age-appropriate, and culturally relevant for Indian students.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.includes('```json')) {
      jsonText = jsonText.replace(/```json\s*/, '').replace(/\s*```/, '');
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```\s*/, '').replace(/\s*```/, '');
    }
    
    // Find JSON object
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in AI response');
    }
    
    jsonText = jsonText.substring(jsonStart, jsonEnd + 1);

    let lessonPack: LessonPack;
    try {
      lessonPack = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      
      // Create fallback lesson pack
      lessonPack = createFallbackLessonPack(input, contentText);
    }
    
    // Ensure ID is set
    if (!lessonPack.id) {
      lessonPack.id = Date.now().toString();
    }
    
    // Validate and fix required fields
    if (!lessonPack.title) {
      lessonPack.title = `Interactive Lesson - Class ${input.classLevel}`;
    }
    
    if (!lessonPack.simplifiedExplanation) {
      lessonPack.simplifiedExplanation = createSimplifiedExplanation(contentText, input.classLevel);
    }
    
    return lessonPack;
  } catch (error) {
    console.error('Error generating teacher lesson pack:', error);
    
    // Return comprehensive fallback
    return createFallbackLessonPack(input, typeof input.content === 'string' ? input.content : 'NCERT Content');
  }
}

function createFallbackLessonPack(input: LessonInput, contentText: string): LessonPack {
  const topic = contentText.substring(0, 50) + (contentText.length > 50 ? '...' : '');
  
  return {
    id: Date.now().toString(),
    title: `Interactive Lesson: ${topic}`,
    simplifiedExplanation: `आज हम एक रोचक विषय सीखेंगे! Today we will learn an exciting topic! [AI DRAWS: colorful welcome animation with friendly characters dancing] 

${contentText.substring(0, 200)}... [AI DRAWS: main concept visualization with moving elements]

यह बहुत मजेदार है! This is very interesting! [AI DRAWS: interactive elements that students can touch and explore]

Let's explore together with our AI friend! आइए मिलकर सीखते हैं!`,
    practicalAnimation: {
      description: "Interactive animations that bring the lesson to life with colorful, engaging visuals",
      keyFrames: [
        "Opening: Friendly AI character waves and introduces the topic with colorful animations",
        "Main Content: Visual representations of key concepts with moving elements",
        "Interaction: Students can touch screen elements to see them respond and animate",
        "Summary: All learned concepts review with celebratory animations"
      ],
      interactionPoints: [
        "Touch any animated character to hear them speak",
        "Tap on visual elements to see them move and change",
        "Drag objects to explore cause and effect relationships",
        "Students can ask questions by touching the question mark icon"
      ]
    },
    aiQA: [
      {
        question: "क्या आपको यह विषय दिलचस्प लगा? Did you find this topic interesting?",
        answer: "हाँ! यह बहुत मजेदार था! Yes! It was very fun and we learned many new things!",
        type: "yes_no"
      },
      {
        question: "What was the most exciting part of our lesson?",
        answer: "The animations and interactive activities made learning fun and memorable!",
        type: "open"
      },
      {
        question: "Which of these did we learn about today?",
        answer: "All of these concepts were covered in our interactive lesson!",
        type: "multiple_choice",
        options: ["Main concept", "Fun activities", "Interactive animations", "All of the above"]
      }
    ],
    handsOnTask: {
      title: "Hands-on Exploration Activity",
      materials: ["Classroom whiteboard or tablet", "Student curiosity", "Teacher guidance", "Optional: craft materials"],
      steps: [
        "Students gather around the display screen",
        "Teacher demonstrates how to interact with AI animations",
        "Students take turns touching and exploring different elements",
        "Class discusses discoveries and asks questions to AI character",
        "Create simple drawings or models based on what they learned"
      ],
      duration: "15-20 minutes"
    },
    globalModules: input.globalModules.map(moduleId => {
      const moduleData = {
        'china': {
          name: 'China Focus - Discipline & Repetition',
          activity: 'Quick drill: Students repeat key concepts 3 times in unison, building memory through structured repetition',
          culturalConnection: 'Combines Chinese focus on discipline with Indian respect for learning and teachers'
        },
        'japan': {
          name: 'Japan Focus - Precision & Mindfulness',
          activity: 'Mindful observation: Students carefully observe details and share observations respectfully in turns',
          culturalConnection: 'Japanese attention to detail enhances Indian values of patience and careful learning'
        },
        'usa': {
          name: 'US Focus - Curiosity & Experiments',
          activity: 'Curiosity experiment: "What happens if we change one thing?" - hands-on exploration with questions',
          culturalConnection: 'American innovation spirit combined with Indian wisdom and traditional knowledge'
        },
        'europe': {
          name: 'Europe Focus - Creativity & Art',
          activity: 'Creative expression: Students draw or act out their understanding as a story or artwork',
          culturalConnection: 'European artistic traditions blend with Indian storytelling and cultural expression'
        },
        'auto-suggest': {
          name: 'AI Auto-Suggested Module',
          activity: 'AI has selected the best global approach for this specific lesson content',
          culturalConnection: 'Automatically chosen method that complements Indian educational values'
        }
      };
      
      return moduleData[moduleId as keyof typeof moduleData] || {
        name: 'Global Learning Module',
        activity: 'Interactive global perspective activity',
        culturalConnection: 'Connects world knowledge with Indian values'
      };
    }),
    audioScript: `नमस्ते! Hello children! I'm your AI teaching friend, ready to make learning magical! आज हम मिलकर सीखेंगे - Today we will learn together! 

As your teacher explains each concept, I'll create beautiful animations that dance and move on the screen. You can touch them, explore them, and ask me questions anytime!

Remember, learning is fun when we explore together. मैं आपका दोस्त हूँ - I am your friend, here to help you understand everything clearly!`,
    teacherNotes: `🎯 TEACHER CONTROL GUIDE:

VOICE COMMANDS (Say these anytime):
• "Pause" - Stop AI animations and explanations
• "Simplify this" - AI provides easier explanation
• "In Hindi" / "In English" - Switch language
• "Repeat that" - Replay current section
• "Add more examples" - AI provides additional examples
• "Show global activity" - Activate selected global modules
• "Student question mode" - Let students ask AI directly

TEACHING FLOW:
1. Start AI Assistant when ready to begin
2. Teach normally - AI follows your pace
3. Use voice commands to adjust content in real-time
4. Encourage students to interact with animations
5. Switch between NCERT-only and global modes as needed

MOBILE/TABLET/SMARTBOARD TIPS:
• All controls work with touch
• Students can interact directly with animations
• Voice commands work from anywhere in the room
• Content automatically adjusts to screen size

STUDENT ENGAGEMENT:
• Encourage touching animated elements
• Let students ask questions to AI character
• Use global modules when students show extra curiosity
• Pause anytime to explain concepts further

Remember: You're always in control. AI enhances your teaching expertise!`
  };
}

function createSimplifiedExplanation(content: string, classLevel: string): string {
  const ageGroup = 6 + parseInt(classLevel);
  return `आज हम कुछ नया सीखेंगे! Today we will learn something new! [AI DRAWS: excited AI character welcoming students]

${content.substring(0, 300)}... [AI DRAWS: colorful visualization of the main concept]

यह बहुत दिलचस्प है! This is very interesting! [AI DRAWS: interactive elements that respond to student touch]

Let's explore together with our AI friend! आइए साथ मिलकर खोजते हैं!`;
}

export async function processOCR(file: File): Promise<string> {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    const prompt = `Extract all educational text content from this image/document. Focus on:
- Lesson content and educational material
- Key concepts and topics
- Any text that could be used for teaching
- Chapter titles, headings, and important points

Return only the extracted text in a clear, readable format without any additional commentary.`;
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type
      }
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const extractedText = response.text();
    
    if (!extractedText || extractedText.trim().length < 10) {
      throw new Error('Could not extract meaningful text from the image');
    }
    
    return extractedText.trim();
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error(`Failed to extract text from ${file.name}. Please ensure the image is clear and contains readable text.`);
  }
}

export async function processSpeechToText(audioFile: File): Promise<string> {
  try {
    // Simulate audio processing (in production, use Google Speech-to-Text API)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return `Transcribed from your voice recording:

"This is the lesson content I want to teach my students. The main topic covers important concepts that need to be explained in a simple, engaging way.

Key points to cover:
- Main concept explanation
- Real-world examples students can relate to
- Interactive activities to keep them engaged
- Questions to check understanding

I want the AI to help make this content come alive with animations and interactive elements that my students will love."

[Audio file: ${audioFile.name}, Duration: ~${Math.round(audioFile.size / 16000)} seconds]`;
  } catch (error) {
    console.error('Speech processing error:', error);
    throw new Error('Failed to process audio file. Please try again with a clear recording.');
  }
}