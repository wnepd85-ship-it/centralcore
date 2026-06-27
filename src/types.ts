export interface Instructor {
  id: string;
  name: string;
  position: '설립자' | '시니어' | '초임' | '마스터';
  specialty: string;
  enSpecialty: string;
  bio: string;
  longBio: string;
  image: string;
  rating: number;
  reviews: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  alt: string;
  description: string;
  benefits: string[];
  image: string;
  size: 'large' | 'small' | 'tall';
}

export interface Program {
  id: string;
  title: string;
  enTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  description: string;
  benefits: string[];
  capacity: number;
  image?: string;
}

export interface Booking {
  id: string;
  programId: string;
  programTitle: string;
  instructorId: string;
  instructorName: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  createdAt: string;
}

export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
    description: string;
  }[];
}

export interface Review {
  id: string;
  name: string;
  tag: string; // e.g., '체형교정', '재활운동', '산전산후'
  programName: string;
  rating: number;
  date: string;
  content: string;
  period: string; // e.g., '3개월 수강', '6개월 수강'
}

