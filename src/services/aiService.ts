import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface LessonPack {
  title: string;
  simplifiedExplanation: string;
  practicalActivities: string[];
  questionsAndAnswers: Array<{
    question: string;
    answer: string;
  }>;
  globalModule: {
    title: string;
    content: string;
    culturalConnections: string[];
  };
  audioScript: string;
}

export async function generateLessonPack(
  content: string,
  classLevel: string,
  subject: string,
  globalPerspective: string
): Promise<LessonPack> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an expert educator creating interactive AI whiteboard lessons for ASman Learning. Create a comprehensive lesson pack for Class ${classLevel} ${subject} that transforms traditional NCERT content into engaging, visual experiences.

CONTENT TO TRANSFORM: ${content}

GLOBAL PERSPECTIVE: ${globalPerspective}

Create a lesson pack with these components:

1. SIMPLIFIED EXPLANATION (Age-appropriate for Class ${classLevel})
   - Use simple language and relatable examples
   - Include [AI DRAWS: description] markers where animations should appear
   - Make abstract concepts concrete and visual

2. PRACTICAL ACTIVITIES (3-4 hands-on activities)
   - Mix physical and digital activities
   - Include whiteboard interaction elements
   - Encourage student participation and exploration

3. QUESTIONS & ANSWERS (5-6 Q&A pairs)
   - Age-appropriate questions that encourage thinking
   - Clear, simple answers with examples
   - Include follow-up exploration suggestions

4. GLOBAL MODULE
   - Connect the lesson to ${globalPerspective}
   - Include cultural stories or examples
   - Show how this knowledge applies worldwide

5. AUDIO SCRIPT
   - Natural, conversational script for AI voice
   - Include pauses for animation synchronization
   - Describe what students will see on the whiteboard
   - Explain how animations support the teacher's explanation

Format as valid JSON with these exact keys: title, simplifiedExplanation, practicalActivities, questionsAndAnswers, globalModule (with title, content, culturalConnections), audioScript.

Focus on creating magical learning moments where AI animations bring concepts to life as teachers speak.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const lessonPack = JSON.parse(jsonMatch[0]);
    return lessonPack;
  } catch (error) {
    console.error('Error generating lesson pack:', error);
    
    // Return a fallback lesson pack
    return {
      title: `${subject} Lesson for Class ${classLevel}`,
      simplifiedExplanation: `This lesson introduces key concepts from your uploaded content. [AI DRAWS: colorful diagrams and animations] The AI whiteboard will create visual representations to help students understand better.`,
      practicalActivities: [
        "Interactive whiteboard exploration with touch and gestures",
        "Group discussion about what they observed in the animations",
        "Hands-on activity connecting digital visuals to real objects",
        "Creative drawing exercise inspired by AI animations"
      ],
      questionsAndAnswers: [
        {
          question: "What did you see when the AI drew on the whiteboard?",
          answer: "The AI created moving pictures and animations that helped explain the lesson concepts in a fun, visual way."
        },
        {
          question: "How does this help you learn better?",
          answer: "Seeing concepts animated makes them easier to understand and remember, just like watching a story come to life."
        }
      ],
      globalModule: {
        title: `Global Connections: ${globalPerspective}`,
        content: `This lesson connects to ${globalPerspective} by showing how students around the world learn similar concepts through different cultural examples and stories.`,
        culturalConnections: [
          "Stories and examples from different cultures",
          "Universal concepts explained through local contexts",
          "Global perspectives on the same learning objectives"
        ]
      },
      audioScript: "Welcome to today's interactive lesson! As I explain each concept, watch how our AI whiteboard brings the ideas to life with beautiful animations and drawings. You'll see colors, shapes, and movements that make learning fun and memorable. Feel free to ask questions - our AI assistant is here to help you understand everything better!"
    };
  }
}

export async function processOCR(file: File): Promise<string> {
  // For now, return a placeholder since OCR requires additional setup
  return `Extracted text from ${file.name}. This would contain the actual text content from the uploaded image or PDF file.`;
}

export async function processSpeechToText(audioBlob: Blob): Promise<string> {
  // For now, return a placeholder since speech-to-text requires additional setup
  return "This would contain the transcribed text from the audio recording.";
}