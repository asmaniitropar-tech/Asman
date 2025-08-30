export interface LessonInput {
  text: string;
  classLevel: string;
  globalModule: string;
  uploadType: 'text' | 'pdf' | 'audio';
}

export interface LessonOutput {
  simplified_explanation: string;
  practical_activity: string;
  questions_and_answers: Array<{
    q: string;
    a: string;
  }>;
  global_module_used: string;
}

export interface GlobalModule {
  name: string;
  character: string;
  flag: string;
  description: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SavedLesson {
  id: string;
  title: string;
  classLevel: string;
  globalModule: string;
  output: LessonOutput;
  createdAt: string;
}