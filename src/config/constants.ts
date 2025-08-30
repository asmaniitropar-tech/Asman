export const BRAND = {
  name: 'ASman Learning',
  tagline: 'Teacher\'s AI Partner for Engaging NCERT Lessons',
  description: 'AI Whiteboard Assistant - Save Prep Time, Boost Engagement'
};

export const CLASS_LEVELS = [
  { value: '1', label: 'Class 1 (Ages 6-7)' },
  { value: '2', label: 'Class 2 (Ages 7-8)' },
  { value: '3', label: 'Class 3 (Ages 8-9)' },
  { value: '4', label: 'Class 4 (Ages 9-10)' },
  { value: '5', label: 'Class 5 (Ages 10-11)' }
];

export const SUBJECTS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Environmental Science' },
  { value: 'social', label: 'Social Studies' },
  { value: 'moral', label: 'Moral Science' }
];

export const GLOBAL_MODULES = [
  { 
    id: 'china',
    name: 'China Focus', 
    character: '👨‍🏫', 
    flag: '🇨🇳',
    description: 'Discipline & Repetition',
    color: 'bg-gradient-to-r from-red-500 to-red-600',
    methodology: 'Quick drills, repetition exercises, speed practice'
  },
  { 
    id: 'japan',
    name: 'Japan Focus', 
    character: '👩‍🏫', 
    flag: '🇯🇵',
    description: 'Precision & Mindfulness',
    color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    methodology: 'Careful observation, group harmony, respectful participation'
  },
  { 
    id: 'usa',
    name: 'US Focus', 
    character: '👨‍🎓', 
    flag: '🇺🇸',
    description: 'Curiosity & Experiments',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    methodology: 'Hands-on experiments, "what if" questions, individual exploration'
  },
  { 
    id: 'europe',
    name: 'Europe Focus', 
    character: '👩‍🎨', 
    flag: '🇪🇺',
    description: 'Creativity & Art',
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    methodology: 'Art projects, creative storytelling, cultural connections'
  }
];

export const AI_CHARACTERS = [
  {
    id: 'friendly_teacher',
    name: 'Vidya',
    avatar: '👩‍🏫',
    personality: 'Warm, encouraging, patient',
    voiceStyle: 'Gentle and clear'
  },
  {
    id: 'curious_explorer',
    name: 'Arjun',
    avatar: '🧑‍🔬',
    personality: 'Curious, energetic, fun',
    voiceStyle: 'Enthusiastic and engaging'
  },
  {
    id: 'wise_storyteller',
    name: 'Dadi',
    avatar: '👵',
    personality: 'Wise, storytelling, cultural',
    voiceStyle: 'Storytelling with warmth'
  }
];

export const LANGUAGES = [
  { value: 'english', label: 'English Only' },
  { value: 'hindi', label: 'Hindi Only' },
  { value: 'bilingual', label: 'Bilingual (English + Hindi)' }
];

// Sample NCERT content structure
export const NCERT_CHAPTERS = {
  '1': {
    'english': [
      { chapter: 'Chapter 1', title: 'A Happy Child', topics: ['Family', 'Happiness', 'Sharing'] },
      { chapter: 'Chapter 2', title: 'The Kite', topics: ['Colors', 'Sky', 'Flying'] }
    ],
    'mathematics': [
      { chapter: 'Chapter 1', title: 'Shapes and Space', topics: ['Circles', 'Squares', 'Triangles'] },
      { chapter: 'Chapter 2', title: 'Numbers from One to Nine', topics: ['Counting', 'Recognition', 'Writing'] }
    ],
    'science': [
      { chapter: 'Chapter 1', title: 'Plants Around Us', topics: ['Trees', 'Flowers', 'Leaves'] },
      { chapter: 'Chapter 2', title: 'Animals Around Us', topics: ['Pets', 'Wild Animals', 'Birds'] }
    ]
  },
  '2': {
    'english': [
      { chapter: 'Chapter 1', title: 'First Day at School', topics: ['School', 'Friends', 'Learning'] },
      { chapter: 'Chapter 2', title: 'Haldi\'s Adventure', topics: ['Adventure', 'Courage', 'Friendship'] }
    ],
    'mathematics': [
      { chapter: 'Chapter 1', title: 'What is Long, What is Round?', topics: ['Measurement', 'Shapes', 'Comparison'] },
      { chapter: 'Chapter 2', title: 'Counting in Groups', topics: ['Grouping', 'Addition', 'Subtraction'] }
    ],
    'science': [
      { chapter: 'Chapter 1', title: 'My Family', topics: ['Family Members', 'Relationships', 'Care'] },
      { chapter: 'Chapter 2', title: 'My Body', topics: ['Body Parts', 'Health', 'Hygiene'] }
    ]
  },
  '3': {
    'english': [
      { chapter: 'Chapter 1', title: 'The Magic Garden', topics: ['Nature', 'Growth', 'Seasons'] },
      { chapter: 'Chapter 2', title: 'Bird Talk', topics: ['Communication', 'Animals', 'Sounds'] }
    ],
    'mathematics': [
      { chapter: 'Chapter 1', title: 'Where to Look From?', topics: ['Directions', 'Position', 'Observation'] },
      { chapter: 'Chapter 2', title: 'Fun with Numbers', topics: ['Addition', 'Subtraction', 'Patterns'] }
    ],
    'science': [
      { chapter: 'Chapter 1', title: 'Water', topics: ['Water Cycle', 'Uses', 'Conservation'] },
      { chapter: 'Chapter 2', title: 'Air Around Us', topics: ['Breathing', 'Wind', 'Pollution'] }
    ]
  },
  '4': {
    'english': [
      { chapter: 'Chapter 1', title: 'Wake Up!', topics: ['Morning Routine', 'Time', 'Responsibility'] },
      { chapter: 'Chapter 2', title: 'Noses', topics: ['Senses', 'Animals', 'Adaptation'] }
    ],
    'mathematics': [
      { chapter: 'Chapter 1', title: 'Building with Bricks', topics: ['Patterns', 'Shapes', 'Construction'] },
      { chapter: 'Chapter 2', title: 'Long and Short', topics: ['Measurement', 'Comparison', 'Units'] }
    ],
    'science': [
      { chapter: 'Chapter 1', title: 'Going to School', topics: ['Transportation', 'Safety', 'Environment'] },
      { chapter: 'Chapter 2', title: 'Ear to Ear', topics: ['Communication', 'Sounds', 'Language'] }
    ]
  },
  '5': {
    'english': [
      { chapter: 'Chapter 1', title: 'Ice-cream Man', topics: ['Seasons', 'Joy', 'Community'] },
      { chapter: 'Chapter 2', title: 'Wonderful Waste!', topics: ['Recycling', 'Environment', 'Creativity'] }
    ],
    'mathematics': [
      { chapter: 'Chapter 1', title: 'The Fish Tale', topics: ['Measurement', 'Estimation', 'Problem Solving'] },
      { chapter: 'Chapter 2', title: 'Shapes and Angles', topics: ['Geometry', 'Angles', 'Patterns'] }
    ],
    'science': [
      { chapter: 'Chapter 1', title: 'Super Senses', topics: ['Five Senses', 'Animals', 'Adaptation'] },
      { chapter: 'Chapter 2', title: 'A Snake Charmer\'s Story', topics: ['Snakes', 'Traditional Knowledge', 'Respect'] }
    ]
  }
};