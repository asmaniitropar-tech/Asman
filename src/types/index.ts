export interface User {
  id: string;
  email: string;
  name: string;
  school?: string;
  subjects?: string[];
}

export interface NCERTContent {
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  content: string;
}

export interface GlobalModule {
  id: string;
  name: string;
  character: string;
  flag: string;
  description: string;
  color: string;
  methodology: string;
}

export interface AICharacter {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  voiceStyle: string;
}

export interface LessonInput {
  content: NCERTContent | string;
  classLevel: string;
  globalModules: string[];
  aiCharacter: string;
  language: 'english' | 'hindi' | 'bilingual';
  uploadType?: 'ncert' | 'upload';
}

export interface LessonPack {
  id: string;
  title: string;
  simplifiedExplanation: string;
  practicalAnimation: {
    description: string;
    keyFrames: string[];
    interactionPoints: string[];
  };
  aiQA: Array<{
    question: string;
    answer: string;
    type: 'yes_no' | 'multiple_choice' | 'drawing' | 'open';
    options?: string[];
  }>;
  handsOnTask: {
    title: string;
    materials: string[];
    steps: string[];
    duration: string;
  };
  globalModules: Array<{
    name: string;
    activity: string;
    culturalConnection: string;
  }>;
  audioScript: string;
  teacherNotes: string;
}

export interface EngagementReport {
  lessonId: string;
  questionsAnswered: number;
  totalQuestions: number;
  engagementLevel: 'high' | 'medium' | 'low';
  strugglingAreas: string[];
  recommendations: string[];
}

export interface TeacherPreferences {
  favoriteGlobalModules: string[];
  preferredLanguage: 'english' | 'hindi' | 'bilingual';
  defaultAICharacter: string;
  lessonStyle: 'visual' | 'interactive' | 'balanced';
}