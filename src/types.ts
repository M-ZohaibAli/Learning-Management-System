export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoType: "youtube" | "mp4";
  videoUrl: string;
  content: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  instructorTitle: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hue: number; // for theming
  modules: Module[];
  rating: number;
  students: number;
  hours: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lessonTime: Record<string, number>;
  lessonViews: Record<string, number>;
  resumePoints: Record<string, number>;
  lastVisited?: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  date: string;
  score: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "learner" | "instructor";
  avatar: string; // initials
  color: string; // gradient class
  createdAt: number;
  progress: Record<string, CourseProgress>;
  certificates: Certificate[];
  streak: number;
  xp: number;
}