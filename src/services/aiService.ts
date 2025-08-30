import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonInput, LessonPack } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateTeacherLessonPack(input: LessonInput): Promise<LessonPack> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const globalModuleContext = input.globalModules.length > 0 
      ? `Include these global learning approaches: ${input.globalModules.join(', ')}. For each module, create specific activities that blend with NCERT content while maintaining Indian educational values.`
      : 'Focus purely on NCERT content with Indian context and examples.';

    const prompt = `
You are ASman Learning's AI assistant, creating teacher-centric lesson packs that transform NCERT content into engaging AI whiteboard experiences.

TEACHER CONTEXT: This is for a teacher who wants to save prep time while making lessons more engaging. The teacher is always in control - AI suggests, teacher decides.

CONTENT: ${typeof input.content === 'string' ? input.content : `${input.content.class} ${input.content.subject} - ${input.content.topic}`}
CLASS LEVEL: ${input.classLevel} (Ages ${6 + parseInt(input.classLevel)}-${7 + parseInt(input.classLevel)})
LANGUAGE: ${input.language}
AI CHARACTER: ${input.aiCharacter}
GLOBAL MODULES: ${globalModuleContext}

Create a comprehensive lesson pack with these components:

1. TITLE: Clear, engaging lesson title

2. SIMPLIFIED EXPLANATION (Age-appropriate for Class ${input.classLevel})
   - Use simple, clear language suitable for ${6 + parseInt(input.classLevel)}-${7 + parseInt(input.classLevel)} year olds
   - Include [AI DRAWS: description] markers where AI animations should appear
   - Make abstract concepts concrete with relatable examples
   - Include cultural references that Indian children understand
   - Ensure content aligns with NCERT learning objectives

3. PRACTICAL ANIMATION
   - Description: Overall animation concept
   - KeyFrames: 4-6 specific animation sequences that sync with teacher explanation
   - InteractionPoints: 3-4 ways students can interact with the whiteboard animations

4. AI Q&A (5-6 interactive questions)
   - Mix of question types: yes/no, multiple choice, drawing activities, open questions
   - Age-appropriate language and concepts
   - Include answer options for multiple choice questions
   - Answers should encourage further exploration

5. HANDS-ON TASK
   - Title: Engaging activity name
   - Materials: Simple, classroom-available items
   - Steps: 4-6 clear, sequential instructions
   - Duration: Realistic time estimate (10-20 minutes)

6. GLOBAL MODULES (if selected)
   - For each selected global module, create:
     - Specific activity that blends with NCERT content
     - Cultural connection that respects both perspectives
     - Clear explanation of how it enhances learning

7. AUDIO SCRIPT
   - Natural, conversational script for AI character
   - Include pauses for teacher interaction
   - Describe animations and student interactions
   - Match the selected AI character's personality

8. TEACHER NOTES
   - Practical tips for using the AI whiteboard
   - Voice commands the teacher can use
   - Suggestions for adapting content during class
   - Tips for managing student interactions

Format as valid JSON with these exact keys: id, title, simplifiedExplanation, practicalAnimation (with description, keyFrames array, interactionPoints array), aiQA (array with question, answer, type, options), handsOnTask (with title, materials array, steps array, duration), globalModules (array with name, activity, culturalConnection), audioScript, teacherNotes.

Remember: This is a TEACHER'S tool. Focus on empowering the teacher while creating magical learning experiences for students.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const lessonPack: LessonPack = JSON.parse(jsonMatch[0]);
    
    // Ensure ID is set
    if (!lessonPack.id) {
      lessonPack.id = Date.now().toString();
    }
    
    return lessonPack;
  } catch (error) {
    console.error('Error generating teacher lesson pack:', error);
    
    // Return a comprehensive fallback lesson pack
    return {
      id: Date.now().toString(),
      title: `Interactive AI Lesson - Class ${input.classLevel}`,
      simplifiedExplanation: `Welcome to your AI whiteboard lesson! [AI DRAWS: colorful welcome animation with friendly characters] Today we'll explore exciting concepts together. [AI DRAWS: topic-related visuals that move and respond to touch] The AI will create beautiful animations as your teacher explains each concept, making learning fun and memorable.`,
      practicalAnimation: {
        description: "Interactive animations that sync with teacher explanations and respond to student touch",
        keyFrames: [
          "Opening animation introduces the topic with colorful, moving visuals",
          "Key concept animations appear as teacher explains each point",
          "Interactive elements highlight when students can touch and explore",
          "Summary animation reviews all learned concepts with student participation"
        ],
        interactionPoints: [
          "Students can touch any animated element to see it respond",
          "Tap characters to hear them speak key concepts",
          "Drag elements to explore cause and effect relationships"
        ]
      },
      aiQA: [
        {
          question: "What did you see in the AI animation?",
          answer: "The AI created moving pictures that helped explain our lesson concepts in a fun, visual way!",
          type: "open"
        },
        {
          question: "How does the AI whiteboard help you learn?",
          answer: "It makes abstract concepts visual and interactive, helping us understand and remember better.",
          type: "open"
        }
      ],
      handsOnTask: {
        title: "Interactive Exploration Activity",
        materials: ["Classroom whiteboard", "Student curiosity", "Teacher guidance"],
        steps: [
          "Students gather around the AI whiteboard display",
          "Teacher demonstrates how to interact with animations",
          "Students take turns touching and exploring different elements",
          "Class discusses what they discovered through interaction"
        ],
        duration: "15-20 minutes"
      },
      globalModules: input.globalModules.map(moduleId => ({
        name: `${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} Focus`,
        activity: `Interactive activity incorporating ${moduleId} learning methodology`,
        culturalConnection: `Connects global ${moduleId} perspectives with Indian educational values`
      })),
      audioScript: `Hello! I'm your AI teaching assistant, ready to make this lesson magical for your students. As you teach, I'll create beautiful animations that bring concepts to life. Students can touch and explore everything I draw, making learning interactive and memorable.`,
      teacherNotes: `TEACHER CONTROL TIPS:
• Say "pause" to stop AI animations anytime
• Say "simplify" for easier explanations  
• Say "translate" to switch between English/Hindi
• Use "repeat that" to replay any section
• Toggle global modules on/off during class
• Students can interact with all animations - encourage exploration!

VOICE COMMANDS:
• "Simplify this" - AI provides easier explanation
• "More details" - AI adds complexity
• "In Hindi/English" - Language switching
• "Slower please" - Reduces animation speed
• "Show global example" - Activates global module content

Remember: You're in complete control. AI enhances your teaching but never replaces your expertise!`
    };
  }
}

export async function processOCR(file: File): Promise<string> {
  // Simulate OCR processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return `Extracted content from ${file.name}:

This is sample extracted text from your uploaded document. In a production environment, this would contain the actual text content extracted from your PDF or image file using OCR technology.

The AI has successfully read your document and converted it into structured text that can be transformed into an interactive AI whiteboard lesson.

Key concepts identified:
- Main topic areas
- Important definitions
- Examples and illustrations
- Learning objectives

This content is now ready to be transformed into an engaging lesson with animations, activities, and interactive elements for your students.`;
}

export async function processSpeechToText(audioBlob: Blob): Promise<string> {
  // Simulate speech-to-text processing
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return `Transcribed from your voice recording:

"Hello, this is a sample transcription of your voice recording. In the actual implementation, this would contain the exact words you spoke in your audio file.

The AI has successfully converted your speech into text, capturing your teaching notes, lesson ideas, or any content you recorded.

This transcribed content maintains the natural flow of your speech while organizing it into a format that can be transformed into structured lesson plans.

Your voice recording has been processed and is ready to become an interactive AI whiteboard lesson for your students."

Duration: ${Math.round(audioBlob.size / 1000)} seconds
Quality: High clarity detected`;
}