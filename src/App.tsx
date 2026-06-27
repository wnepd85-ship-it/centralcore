import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Menu, 
  X, 
  Accessibility, 
  Scale, 
  Dumbbell, 
  ChevronRight, 
  ChevronLeft,
  Quote,
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  Mail, 
  PhoneCall, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Info,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

import { INSTRUCTORS, GALLERY_ITEMS, PROGRAMS, ASSESSMENT_QUESTIONS, REVIEWS } from './data';
import { Instructor, GalleryItem, Program, Booking, Review } from './types';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'home' | 'intro' | 'programs' | 'instructors' | 'gallery' | 'booking'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Reviews slider state
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  
  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };
  
  // Modals & Overlay triggers
  const [selectedInstructorDetail, setSelectedInstructorDetail] = useState<Instructor | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);

  // Write Review Form States
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTag, setNewReviewTag] = useState('거북목/체형교정');
  const [newReviewCustomTag, setNewReviewCustomTag] = useState('');
  const [newReviewProgram, setNewReviewProgram] = useState('Core Reformer');
  const [newReviewCustomProgram, setNewReviewCustomProgram] = useState('');
  const [newReviewPeriod, setNewReviewPeriod] = useState('3개월 수강');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showBreathingWidget, setShowBreathingWidget] = useState(false);
  
  // Interactive Filtering
  const [instructorFilter, setInstructorFilter] = useState<string>('all');
  const [philosophyTab, setPhilosophyTab] = useState<number>(0);
  
  // Breathing Guideline States
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [totalBreathsCompleted, setTotalBreathsCompleted] = useState(0);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Diagnostic Assessment Form States
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    title: string;
    description: string;
    recommendedClass: Program;
    recommendedInstructor: Instructor;
  } | null>(null);

  // Booking Engine States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>(PROGRAMS[0].id);
  const [selectedInstructor, setSelectedInstructor] = useState<string>(INSTRUCTORS[0].id);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('10:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);
  const [bookingViewMode, setBookingViewMode] = useState<'book' | 'list'>('book');

  // Load Bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('central_core_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse bookings', e);
      }
    }
    
    // Set a default booking date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Save Bookings
  const saveBookingsToStorage = (updated: Booking[]) => {
    setBookings(updated);
    localStorage.setItem('central_core_bookings', JSON.stringify(updated));
  };

  // Breathing Cycle Logic
  useEffect(() => {
    if (isBreathingActive) {
      breathIntervalRef.current = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
            // Cycle phases: inhale (4s) -> hold (4s) -> exhale (4s)
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 4;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 4;
            } else {
              setBreathPhase('inhale');
              setTotalBreathsCompleted((b) => b + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isBreathingActive, breathPhase]);

  const handleStartBreathing = () => {
    setIsBreathingActive(true);
    setBreathPhase('inhale');
    setBreathCountdown(4);
  };

  const handlePauseBreathing = () => {
    setIsBreathingActive(false);
  };

  const handleResetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('inhale');
    setBreathCountdown(4);
    setTotalBreathsCompleted(0);
  };

  // Assessment Wizard Controls
  const handleAnswerSelect = (score: number) => {
    const newAnswers = [...assessmentAnswers, score];
    setAssessmentAnswers(newAnswers);
    
    if (assessmentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setAssessmentStep((prev) => prev + 1);
    } else {
      // Calculate output results
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      let title = '';
      let description = '';
      let recommendedClass = PROGRAMS[0];
      let recommendedInstructor = INSTRUCTORS[0];

      if (totalScore >= 7) {
        title = '중증 관절 스트레스 및 척추 불균형 교정 필요 그룹';
        description = '오랜 시간 누적된 불균형으로 척추 유연성과 골반 수평 오차가 두드러지게 어긋나 있습니다. 무리한 운동은 오히려 통증을 유발하니, 정밀 재활 전문가 엘레나 밴스의 일대일 프로그램으로 코어 신경과 관절을 천천히 복원해야 합니다.';
        recommendedClass = PROGRAMS.find(p => p.id === 'p-rehab') || PROGRAMS[2];
        recommendedInstructor = INSTRUCTORS.find(i => i.id === 'elena') || INSTRUCTORS[0];
      } else if (totalScore >= 5) {
        title = '심부 코어 약화 및 기립 지구력 결핍 그룹';
        description = '자세를 길게 유지하는 심부 다열근과 척추 기립 유지가 다소 약해져 몸통 안정성이 떨어져 있습니다. 골반의 회전 불균형을 교정하고 심부 코어를 활성화하는 코어 에퀴리브리엄 또는 시에나 브룩스의 리포머 단계를 적극 추천합니다.';
        recommendedClass = PROGRAMS.find(p => p.id === 'p-equilibrium') || PROGRAMS[0];
        recommendedInstructor = INSTRUCTORS.find(i => i.id === 'sienna') || INSTRUCTORS[1];
      } else {
        title = '가동성 확장 및 정밀 평형 단련 타겟 그룹';
        description = '기초적인 코어 지탱력은 우수한 편이나, 척추 분절 마디마디의 최대 가동력과 관절 고유수용 감각을 일치시켜 한 단계 높은 스포츠 웰니스를 성취하는 단계입니다. 줄리안 첸의 가동성 체어 및 소도구 흐름 마스터 클래스에 최적화되어 있습니다.';
        recommendedClass = PROGRAMS.find(p => p.id === 'p-mobility') || PROGRAMS[3];
        recommendedInstructor = INSTRUCTORS.find(i => i.id === 'julian') || INSTRUCTORS[2];
      }

      setAssessmentResult({
        score: totalScore,
        title,
        description,
        recommendedClass,
        recommendedInstructor
      });
    }
  };

  const handleResetAssessment = () => {
    setAssessmentStep(0);
    setAssessmentAnswers([]);
    setAssessmentResult(null);
  };

  // Create Appointment
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('예약자 성함과 연락처를 빠짐없이 적어주세요.');
      return;
    }

    const prog = PROGRAMS.find(p => p.id === selectedProgram) || PROGRAMS[0];
    const inst = INSTRUCTORS.find(i => i.id === selectedInstructor) || INSTRUCTORS[0];

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      programId: selectedProgram,
      programTitle: prog.title,
      instructorId: selectedInstructor,
      instructorName: inst.name,
      date: bookingDate,
      timeSlot: bookingTime,
      clientName: customerName,
      clientPhone: customerPhone,
      notes: bookingNotes,
      createdAt: new Date().toLocaleString('ko-KR')
    };

    const updated = [newBooking, ...bookings];
    saveBookingsToStorage(updated);

    // Reset Booking controls
    setCustomerName('');
    setCustomerPhone('');
    setBookingNotes('');
    setBookingSuccessMessage(`예약이 최종 접수되었습니다. ${newBooking.date} / ${newBooking.timeSlot} 에 뵙겠습니다.`);
    setBookingViewMode('list');

    // Smooth auto hide success banner
    setTimeout(() => {
      setBookingSuccessMessage(null);
    }, 6000);
  };

  // Cancel Booking
  const handleCancelBooking = (id: string) => {
    if (confirm('해당 예약을 취소하시겠습니까? (이 복구할 수 없는 작업은 중앙 정렬의 균형 약속을 일시 취소합니다)')) {
      const filtered = bookings.filter(b => b.id !== id);
      saveBookingsToStorage(filtered);
    }
  };

  // Open booking form and preselect program or instructor
  const handleQuickBook = (targetProgId?: string, targetInstId?: string) => {
    if (targetProgId) {
      setSelectedProgram(targetProgId);
    }
    if (targetInstId) {
      setSelectedInstructor(targetInstId);
    }
    setBookingViewMode('book');
    setActiveTab('booking');
    
    // Smooth scroll to booking
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtering Instructors based on Korean tags
  const filteredInstructorsList = INSTRUCTORS.filter(i => {
    if (instructorFilter === 'all') return true;
    if (instructorFilter === 'rehab' && i.id === 'elena') return true;
    if (instructorFilter === 'reformer' && i.id === 'sienna') return true;
    if (instructorFilter === 'mobility' && i.id === 'julian') return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-brand-background text-brand-on-surface font-sans selection:bg-brand-primary-container selection:text-white antialiased">
      
      {/* Floating Header */}
      <header className="fixed top-0 w-full z-50 bg-brand-surface/80 glass-effect border-b border-brand-surface-highest/30 transition-all duration-300">
        <nav className="flex justify-between items-center px-6 lg:px-12 py-5 max-w-7xl mx-auto">
          {/* Logo */}
          <div 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="cursor-pointer hover:opacity-95 transition-opacity flex items-center"
            id="nav-logo"
          >
            <img 
              src="https://postfiles.pstatic.net/MjAyNjA2MTNfNjgg/MDAxNzgxMzM5OTQwMDk4.cjKIekBTKSo06nk4xUg4qzlsoMeLVzApsS200Ix0QlMg.hRYs8zKYME9vZvf0M0TKLUWKYPrUg69j3NC17fKmNEAg.PNG/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_05_30_33.png?type=w966" 
              alt="Central Core Logo" 
              className="h-14 md:h-18 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex gap-8 items-center">
            {[
              { id: 'home', label: '홈' },
              { id: 'intro', label: '철학' },
              { id: 'programs', label: '프로그램' },
              { id: 'instructors', label: '강사진' },
              { id: 'gallery', label: '수강생 후기' },
              { id: 'booking', label: '예약하기' }
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setActiveTab(n.id as any);
                  const el = document.getElementById(`${n.id}-section`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`text-sm tracking-widest font-medium transition-colors hover:text-brand-primary pb-1 relative cursor-pointer ${
                  activeTab === n.id 
                    ? 'text-brand-primary border-b-2 border-brand-secondary font-semibold' 
                    : 'text-brand-on-surface-variant'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-brand-primary font-semibold hover:opacity-85 transition-opacity px-3 py-1.5 border border-brand-secondary/30 rounded bg-white/50"
              id="desktop-location-btn"
            >
              <MapPin className="w-4.5 h-4.5 text-brand-secondary" />
              스튜디오 위치
            </button>

            {bookings.length > 0 && (
              <button
                onClick={() => {
                  setBookingViewMode('list');
                  setActiveTab('booking');
                  const el = document.getElementById('booking-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative flex items-center gap-1 bg-brand-primary text-brand-on-primary text-xs px-3 py-1.5 rounded font-semibold tracking-wider hover:bg-brand-primary/90 transition-colors"
                id="my-booking-pill"
              >
                나의 예약
                <span className="bg-white text-brand-primary text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {bookings.length}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex md:hidden items-center gap-2">
            {bookings.length > 0 && (
              <button
                onClick={() => {
                  setBookingViewMode('list');
                  setActiveTab('booking');
                  const el = document.getElementById('booking-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-brand-primary text-brand-on-primary text-xs px-2.5 py-1.5 rounded font-semibold flex items-center gap-1"
              >
                내 예약 ({bookings.length})
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-brand-primary focus:outline-none"
              aria-label="메뉴 열기"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-brand-surface border-b border-brand-surface-highest/50 px-6 py-4 overflow-hidden"
              id="mobile-nav-panel"
            >
              <div className="flex flex-col gap-4 py-2">
                {[
                  { id: 'home', label: '홈' },
                  { id: 'intro', label: '철학' },
                  { id: 'programs', label: '프로그램' },
                  { id: 'instructors', label: '강사진' },
                  { id: 'gallery', label: '수강생 후기' },
                  { id: 'booking', label: '예약하기' }
                ].map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveTab(n.id as any);
                      const el = document.getElementById(`${n.id}-section`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`text-left text-sm py-2 tracking-wider ${
                      activeTab === n.id 
                        ? 'text-brand-primary font-bold border-l-2 border-brand-primary pl-2' 
                        : 'text-brand-on-surface-variant'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
                
                <hr className="border-brand-surface-highest w-full my-1" />

                <div className="flex flex-col gap-2 pt-1">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLocationModal(true);
                    }}
                    className="flex items-center justify-center gap-2 text-xs py-2.5 border border-brand-primary/20 bg-brand-surface-low rounded text-brand-primary font-bold"
                  >
                    <MapPin className="w-4.5 h-4.5 text-brand-tertiary" />
                    오시는 길 & 주차 안내
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="pt-18">

        {/* 1. HERO SECTION */}
        <section 
          id="home-section"
          className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden py-16"
        >
          {/* Ambient Background Gradient & Video Look Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://postfiles.pstatic.net/MjAyNjA2MjdfMjM2/MDAxNzgyNTUxODUyNDc2.cK0JYKNpHuwLc3nY_GaqAYzXBBGsEZ6V36e2ksdYle8g.fw-ElLF9sxrLqIC2K7yb04RAVOwp_5qCE7MSb7OOGZkg.PNG/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_27%EC%9D%BC_%EC%98%A4%EC%A0%84_07_36_57.png?type=w3840" 
              alt="Boutique Pilates Studio Central Core" 
              className="w-full h-full object-cover grayscale-[15%] brightness-[0.75] origin-center scale-102 transition-transform duration-10000"
              referrerPolicy="no-referrer"
            />
            {/* Elegant overlay to bridge image to cream theme and keep high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/75 via-brand-primary/45 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto w-full text-white">
            <div className="max-w-3xl">
              <span className="font-sans text-xs lg:text-sm uppercase tracking-[0.25em] text-brand-tertiary-container font-semibold mb-5 block">
                THE ART OF EQUILIBRIUM
              </span>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-normal leading-tight text-white mb-6 tracking-tight">
                모든 움직임에 <br />
                <span className="font-normal text-brand-surface-low">깃든 정교함.</span>
              </h1>
              
              <p className="font-sans text-sm sm:text-base lg:text-lg text-brand-surface-low/90 mb-10 max-w-xl leading-relaxed font-light">
                움직임에 대한 수준 높은 해부학적 접근을 경험해 보세요. <br />
                <strong className="font-semibold text-white">Central Core</strong>는 고요함과 극한의 정교함을 통해 진정한 내면의 코어를 강화하고자 하는 분들을 위한 프리미엄 필라테스 안식처입니다.
              </p>

              {/* Action Rows */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <button 
                  onClick={() => {
                    const el = document.getElementById('programs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border border-white/30 bg-white/10 hover:bg-brand-secondary hover:border-brand-secondary hover:text-white hover:scale-105 transition-all duration-300 px-8 py-4 rounded-lg font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 text-white group cursor-pointer"
                  id="hero-program-view-btn"
                >
                  기구별 프로그램 안내
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => handleQuickBook()}
                  className="border border-white/30 bg-white/10 hover:bg-brand-secondary hover:border-brand-secondary hover:text-white hover:scale-105 transition-all duration-300 px-8 py-4 rounded-lg font-semibold text-xs tracking-widest uppercase text-center text-white cursor-pointer"
                  id="hero-trial-booking-btn"
                >
                  체험 수업 실시간 예약
                </button>
              </div>



            </div>
          </div>
        </section>





        {/* 2. PHILOSOPHY / INTRO DIVISION */}
        <section 
          id="intro-section"
          className="py-16 lg:py-24 bg-brand-surface border-b border-brand-surface-highest/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Visual Graphic Representation */}
            <div className="relative">
              <div className="aspect-[4/4.3] bg-brand-surface-container overflow-hidden rounded relative group shadow-md border border-brand-surface-highest/40">
                <img 
                  src="https://postfiles.pstatic.net/MjAyNjA2MjdfMTUx/MDAxNzgyNTY4MTk1MzI4.euSuCvfDh59JHJlTyAu9uOCYJXu-pDlIEAXsnMH9zk8g.SzhlJoVUIIApS_xXvnreTeUPxH_44VlbRjNwTf3GRoEg.PNG/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_27%EC%9D%BC_%EC%98%A4%ED%9B%84_10_49_14.png?type=w966" 
                  alt="Cadillac Pilates movement" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image details card inside */}
              </div>

              {/* Decorative Subtle element */}
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-brand-secondary-container/30 rounded-full blur-2xl z-0 pointer-events-none"></div>
            </div>

            {/* Philosophy Text & Tabs */}
            <div className="flex flex-col justify-center">
              <div className="w-12 h-[1px] bg-brand-primary mb-6"></div>
              <span className="font-sans text-sm uppercase tracking-widest text-brand-secondary font-bold mb-3 block">
                스튜디오의 철학
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary mb-6 leading-tight">
                중심의 힘을 바탕으로 <br />
                <span className="font-normal">세워진 정렬 철학</span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-brand-on-surface-variant mb-6 leading-relaxed">
                Central Core는 성급한 체중 감소나 겉으로만 가시화되는 근육 팽창 대신, <strong className="font-bold text-brand-primary">좌우 뼈대의 무결성과 깊은 심부 코어가 만드는 고요한 조율</strong>에 무게를 둡니다.
                우리의 해부학적 방법론은 일반적인 운동을 뛰어넘어, 지속 가능한 정렬 변화와 마인드 풀니스(내면 집중)의 통합적 성취를 의미합니다.
              </p>

              {/* Interactive Core Tabs */}
              <div className="bg-brand-surface-low p-4 rounded border border-brand-surface-highest/20 mb-8">
                <div className="flex gap-2 border-b border-brand-surface-highest/40 pb-2 mb-3">
                  {['철학', '호흡의 가치', '안전 관리'].map((tabLabel, idx) => {
                    const isActive = philosophyTab === idx;
                    return (
                      <button
                        key={tabLabel}
                        onClick={() => setPhilosophyTab(idx)}
                        className={`text-xs uppercase tracking-wider font-semibold focus:outline-none px-3 py-1.5 rounded transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-secondary text-white border border-brand-secondary shadow-sm font-bold'
                            : 'bg-white text-brand-on-surface-variant/80 border border-brand-surface-highest/30 hover:bg-brand-secondary-container/30 hover:text-brand-primary'
                        }`}
                      >
                        {tabLabel}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-brand-on-surface-variant leading-relaxed min-h-[48px] flex items-center">
                  {philosophyTab === 0 && (
                    <span>"필라테스는 단순한 운동 루틴이 아닙니다. 신체, 지성, 그리고 영혼이 완전하게 결합하는 통로입니다." 조셉 필라테스의 굳센 신념을 현대 재활 기법과 결합하여 안전한 척추 수명을 완성합니다.</span>
                  )}
                  {philosophyTab === 1 && (
                    <span>"호흡은 삶의 첫 번째이자 마지막 행동입니다." 코어를 단단하게 지탱하는 갈비뼈 하부 정렬 호흡법을 통해 몸 속 구석구석 신선한 산소를 공급하고 중추 안정성을 가동시킵니다.</span>
                  )}
                  {philosophyTab === 2 && (
                    <span>최첨단 압력 측정판과 자세 판독 기구를 바탕으로 매 세션 개인별 피로도와 운동 가동 범위를 점검하여 단 한 건의 부상도 허용하지 않는 안전 제일의 재활 정렬을 보장합니다.</span>
                  )}
                </p>
              </div>


            </div>

          </div>
        </section>


        {/* 3. BENTO GRID: WHY CENTRAL CORE & THREE PILLARS */}
        <section 
          id="why-section"
          className="py-16 lg:py-24 bg-brand-surface-low border-b border-brand-surface-highest/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-sans text-xs uppercase tracking-widest text-brand-tertiary font-bold mb-3 block">
                WHY CENTRAL CORE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary mb-4">
                중심을 되찾아주는 삼각 기둥
              </h2>
              <p className="text-sm text-brand-on-surface-variant font-light">
                필라테스의 현대적 재활 재해석. 기구와 정밀 훈련이 도출하는 압도적인 수련 변화를 몸소 느껴 보세요.
              </p>
              <div className="w-16 h-0.5 bg-brand-tertiary-container mx-auto mt-6"></div>
            </div>

            {/* Pillar Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1: 정렬과 자세 */}
              <div className="bg-brand-surface p-8 lg:p-10 rounded border border-brand-surface-highest/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <div className="w-12 h-12 rounded bg-brand-secondary-container flex items-center justify-center mb-6 text-brand-secondary">
                  <Accessibility className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-brand-primary mb-3">정렬과 자세 (Posture)</h3>
                <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed">
                  틀어진 골반, 라운드 숄더, 일자목 등 당신의 고질적인 정렬 상태를 진단하고 비대칭을 교정하기 위한 뼈대 위주 정렬을 설계합니다.
                </p>
              </div>

              {/* Card 2: 기능적 균형 */}
              <div className="bg-brand-surface p-8 lg:p-10 rounded border border-brand-surface-highest/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <div className="w-12 h-12 rounded bg-brand-secondary-container flex items-center justify-center mb-6 text-brand-secondary">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-brand-primary mb-3">기능적 균형 (Balance)</h3>
                <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed">
                  일상으로 돌아갔을 때 부상을 방지하고, 통제 가능한 고유 수용 감각을 깨워 신체 통제력을 높이는 상하지 복합 훈련입니다.
                </p>
              </div>

              {/* Card 3: 코어의 힘 */}
              <div className="bg-brand-surface p-8 lg:p-10 rounded border border-brand-surface-highest/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <div className="w-12 h-12 rounded bg-brand-secondary-container flex items-center justify-center mb-6 text-brand-secondary">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-brand-primary mb-3">코어의 심부 근력 (Power)</h3>
                <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed">
                  단지 가시적인 겉 표면 복근이 아니라 복횡근, 골반저근, 다열근, 횡격막을 조이는 진정한 인간 몸통의 코칭 시스템을 기릅니다.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* 4. CLINICAL PROGRAMS EXPLORER */}
        <section 
          id="programs-section"
          className="py-16 lg:py-24 bg-brand-surface border-b border-brand-surface-highest/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            <div className="mb-16">
              <span className="font-sans text-xs uppercase tracking-widest text-brand-secondary font-bold mb-3 block">
                REGULAR PROGRAMS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary mb-4">
                정교하게 설계된 필라테스 프로그램
              </h2>
              <p className="text-xs sm:text-sm text-brand-on-surface-variant max-w-xl mt-2 leading-relaxed">
                개인의 신체 상태와 목표에 맞춰 설계된 다양한 수업을 통해<br className="hidden sm:inline" />
                균형 잡힌 몸과 건강한 움직임을 경험해 보세요.
              </p>
            </div>

            {/* Programs List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROGRAMS.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    handleQuickBook(p.id, undefined);
                  }}
                  className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div>
                    {/* Aspect Ratio Image Container */}
                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-brand-surface-highest/10">
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-6">
                      {/* Level Pill */}
                      <div className="mb-4">
                        <span className="text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-[#fbfaf7] bg-brand-secondary px-3 py-1 rounded-md shadow-sm">
                          {p.level}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mb-3">
                        <h3 className="font-sans text-lg sm:text-xl text-brand-primary font-medium">
                          {p.title}
                        </h3>
                        <p className="font-sans text-[11px] sm:text-xs text-brand-secondary/80 mt-0.5 tracking-wider uppercase font-medium">
                          {p.enTitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed whitespace-pre-line min-h-[48px]">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Metadata & Booking Button */}
                  <div className="px-6 pb-6 pt-4 border-t border-brand-surface-highest/20 flex justify-between items-center text-brand-on-surface-variant/75 mt-auto">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                        {p.duration}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickBook(p.id, undefined);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-[#5E5E5E] bg-[#F2F1EC] hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all duration-300 cursor-pointer border border-[#E0DFD8] shadow-sm"
                    >
                      <span>체험 신청하기</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Recommendation & Counseling CTA Banner */}
            <div className="bg-[#FAF9F6] border border-[#EBEAE5] p-6 sm:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg sm:text-xl text-brand-primary font-bold">
                    어떤 프로그램이 나에게 맞을지 고민되시나요?
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-on-surface-variant mt-1.5 leading-relaxed">
                    전문가와의 상담을 통해 최적의 프로그램을 추천받아 보세요.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                <div className="hidden md:block w-[1px] h-10 bg-[#EBEAE5]"></div>
                <button 
                  onClick={() => {
                    setActiveTab('booking');
                    const el = document.getElementById('booking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#5E5E5E] hover:bg-brand-secondary hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg active:scale-95 shrink-0 group font-sans"
                >
                  <span>상담 예약하기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* 5. INSTRUCTORS INTRO */}
        <section 
          id="instructors-section"
          className="py-16 lg:py-24 bg-brand-surface-low border-b border-brand-surface-highest/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <span className="font-sans text-xs uppercase tracking-widest text-brand-tertiary font-bold mb-3 block">
                  MEET OUR TEAM
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary">
                  치유를 돕는 강사진 소개
                </h2>
                <p className="text-sm text-brand-on-surface-variant max-w-xl mt-1 font-light">
                  헌신적인 메디컬 재활 전문가들로 결성된 우리 팀은 모든 세션에 뛰어난 물리치료 기술 및 정교한 필라테스 기구 제어를 결합해 품격 있는 체형 회복을 안내합니다.
                </p>
              </div>

              {/* Filtering tabs */}
              <div className="flex gap-2 bg-brand-surface p-1 rounded border border-brand-surface-highest/40">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'rehab', label: '재활 특화' },
                  { id: 'reformer', label: '리포머 특화' },
                  { id: 'mobility', label: '가동성 특화' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setInstructorFilter(f.id)}
                    className={`text-xs px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                      instructorFilter === f.id
                        ? 'bg-brand-secondary text-brand-on-secondary font-bold'
                        : 'text-brand-on-surface-variant hover:text-brand-secondary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of instructors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {filteredInstructorsList.map((inst) => (
                <div 
                  key={inst.id}
                  className="group cursor-pointer bg-brand-surface p-4 rounded border border-brand-surface-highest/30 hover:shadow-md transition-all"
                  onClick={() => setSelectedInstructorDetail(inst)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-brand-surface-low rounded mb-6 relative">
                    <img 
                      src={inst.image} 
                      alt={inst.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-brand-primary/80 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded">
                      {inst.position}
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-serif text-xl text-brand-primary group-hover:text-brand-secondary transition-colors">
                        {inst.name}
                      </h3>
                      <p className="text-[11px] text-brand-on-surface-variant">
                        {inst.specialty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-brand-primary">{inst.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-on-surface-variant leading-relaxed line-clamp-2 mb-4 font-light">
                    {inst.bio}
                  </p>

                  <div className="pt-3 border-t border-brand-surface-highest/30">
                    <div className="w-full text-center py-2.5 rounded-lg bg-[#FAF9F6] border border-[#EBEAE5] text-brand-secondary font-bold text-xs inline-flex items-center justify-center gap-1.5 group-hover:bg-brand-secondary group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      <span>프로필 보기</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* 6. STUDENT REVIEWS SECTION */}
        <section 
          id="reviews-section"
          className="py-16 lg:py-24 bg-brand-surface border-b border-brand-surface-highest/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            {/* Carousel Container */}
            <div className="relative overflow-hidden py-4">
              
              {/* Header and navigation buttons */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div className="text-left">
                  <span className="font-sans text-xs uppercase tracking-widest text-brand-secondary font-bold mb-3 block">
                    STUDENT REVIEWS
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-brand-primary">
                    수강생들의 솔직한 변화 후기
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-on-surface-variant max-w-xl mt-2 leading-relaxed font-light">
                    중심부 깊은 정렬부터 달라진 회원님들의 생생한 체험 이야기입니다.<br className="hidden sm:inline" />
                    센트럴 코어 필라테스와 함께 삶의 새로운 정렬을 되찾은 실제 후기를 만나보세요.
                  </p>
                </div>
                
                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrevReview}
                    className="w-10 h-10 rounded-full border border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    aria-label="Previous Review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextReview}
                    className="w-10 h-10 rounded-full border border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    aria-label="Next Review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Review Cards Track */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
                {[0, 1, 2].map((offset) => {
                  const index = (currentReviewIndex + offset) % reviewsList.length;
                  const r = reviewsList[index];
                  return (
                    <div 
                      key={r.id}
                      className={`bg-[#FAF9F6] border border-[#EBEAE5] p-8 rounded-xl flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[340px] ${
                        offset > 0 ? 'hidden md:flex' : 'flex'
                      }`}
                    >
                      <div>
                        {/* Stars & Tag */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex text-[#D4AF37] gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-brand-secondary bg-[#FAF9F6] px-2.5 py-1 rounded border border-[#EBEAE5]">
                            {r.tag}
                          </span>
                        </div>

                        {/* Quote Icon */}
                        <Quote className="w-8 h-8 text-brand-secondary/15 mb-4" />

                        {/* Content */}
                        <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed mb-6 font-light italic">
                          "{r.content}"
                        </p>
                      </div>

                      {/* User Info */}
                      <div className="pt-4 border-t border-[#EBEAE5] flex justify-between items-center">
                        <div>
                          <span className="text-sm font-semibold text-brand-primary block">
                            {r.name.length > 2 
                              ? r.name.slice(0, 1) + '*' + r.name.slice(2) 
                              : r.name.length === 2 
                                ? r.name.slice(0, 1) + '*' 
                                : r.name} <span className="text-[11px] text-brand-on-surface-variant/70 font-normal">회원님</span>
                          </span>
                          <span className="text-[10px] text-brand-secondary font-mono tracking-wider block mt-0.5">
                            {r.period}
                          </span>
                        </div>
                        <span className="text-[10px] bg-brand-secondary-container/20 text-brand-secondary px-2 py-0.5 rounded font-medium">
                          {r.programName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {reviewsList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReviewIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentReviewIndex === i ? 'w-6 bg-brand-secondary' : 'w-2 bg-brand-secondary/30'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Write Review Button */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setShowWriteReviewModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#5E5E5E] hover:bg-brand-secondary hover:shadow-lg transition-all duration-300 cursor-pointer shadow-md active:scale-95 group font-sans w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                  <span>솔직한 수강 후기 남기기</span>
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* 7. DETAILED BOOKING ENGINE (체험 수업 예약 및 조회) */}
        <section 
          id="booking-section"
          className="py-16 lg:py-24 bg-brand-primary text-white relative overflow-hidden"
        >
          {/* Subtle design element */}
          <div className="absolute w-[500px] h-[500px] bg-brand-tertiary/10 rounded-full blur-3xl -top-64 -right-32 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-sans text-xs uppercase tracking-widest text-brand-tertiary-container font-bold mb-3 block">
                ONLINE RESERVATION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
                당신의 중심을 찾을 준비가 되셨나요?
              </h2>
              <p className="text-sm text-brand-surface-low/80 font-light max-w-lg mx-auto">
                노련한 수련자이든 기구를 처음 접하는 입문자이든, 당신의 신체 발달 진도를 진단하고 교정 처방하기 위한 최초 1회 체험 클래스는 무료로 부담 없이 이용하실 수 있습니다.
              </p>
              
              {/* Selector Mode Tabs */}
              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={() => setBookingViewMode('book')}
                  className={`px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    bookingViewMode === 'book'
                      ? 'bg-white text-brand-primary'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  새로운 체험 수업 예약 신청
                </button>
                <button
                  onClick={() => setBookingViewMode('list')}
                  className={`px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    bookingViewMode === 'list'
                      ? 'bg-white text-brand-primary'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  나의 신청 내역 조회
                  {bookings.length > 0 && (
                    <span className="bg-brand-primary text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                      {bookings.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Success Booking notification */}
            {bookingSuccessMessage && (
              <div className="bg-emerald-800/90 text-white p-4 rounded mb-8 border border-emerald-600 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">예약 성공!</p>
                  <p className="text-xs">{bookingSuccessMessage}</p>
                </div>
              </div>
            )}

            {/* BOOKING MODE */}
            {bookingViewMode === 'book' ? (
              <div className="bg-white text-brand-primary p-6 sm:p-10 rounded shadow-md border border-brand-surface-highest/30">
                <form onSubmit={handleCreateBooking} className="space-y-6">
                  
                  {/* Step Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Select Program */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant flex items-center gap-1">
                        1. 체험 프로그램 선택
                      </label>
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="bg-brand-surface-low border border-brand-surface-highest/60 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        id="booking-program-select"
                      >
                        {PROGRAMS.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.level} 전용 - 정원 {p.capacity}명)
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-brand-on-surface-variant">
                        * 선택 국가공인 기구별 특징을 기초로 체형 분석 상담이 15분 병행 제공됩니다.
                      </p>
                    </div>

                    {/* Select Instructor */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant">
                        2. 전담 트레이너 매치
                      </label>
                      <select
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        className="bg-brand-surface-low border border-brand-surface-highest/60 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        id="booking-instructor-select"
                      >
                        {INSTRUCTORS.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.name} 마스터 ({i.position} / {i.specialty})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-brand-on-surface-variant">
                        * 프로필 진도 수준이 뛰어난 치료사 그룹이 직접 어시스트합니다.
                      </p>
                    </div>

                    {/* Choose Ideal Date */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-tertiary" />
                        3. 예약 일자 지정
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-brand-surface-low border border-brand-surface-highest/60 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        id="booking-date-input"
                        required
                      />
                    </div>

                    {/* Select Time slot */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-tertiary" />
                        4. 희망 타임 선택
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['09:00', '10:30', '14:00', '16:30', '18:00', '19:30'].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setBookingTime(time)}
                            className={`py-2 text-xs rounded border text-center transition-all ${
                              bookingTime === time
                                ? 'bg-brand-primary text-white font-bold border-brand-primary'
                                : 'bg-brand-surface border-brand-surface-highest/50 text-brand-on-surface hover:bg-brand-surface-low'
                            }`}
                          >
                            {time} {time < '12:00' ? '오전' : '오후'}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Personal Information */}
                  <hr className="border-brand-surface-highest/60 my-2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* User Fullname */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        예약자 성명
                      </label>
                      <input
                        type="text"
                        placeholder="실명을 입력해 주세요"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-brand-surface-low border border-brand-surface-highest/60 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        id="booking-name-input"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        연락처 (안내 문자용)
                      </label>
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="bg-brand-surface-low border border-brand-surface-highest/60 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        id="booking-phone-input"
                        required
                      />
                    </div>

                  </div>

                  {/* Dynamic health notice */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-on-surface-variant flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      신체 특이사항 및 사전 요청 (허리디스크 여부 등)
                    </label>
                    <textarea
                      placeholder="재활 필요 부위, 수술 이력 또는 원하는 교정 부위를 가볍게 설명해 주시면 강사 매칭 시 반영됩니다."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      rows={3}
                      className="bg-brand-surface-low border border-brand-surface-highest/60 rounded p-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary w-full"
                      id="booking-notes-input"
                    />
                  </div>

                  {/* Submission and Terms Action */}
                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-brand-on-surface-variant text-center sm:text-left max-w-sm leading-normal">
                      * 본 예약은 인원 제한에 따라 노쇼 방지를 위해 사전 연락을 드립니다. 
                      취소는 24시간 전까지 100% 자가 환원 가능합니다.
                    </p>
                    <button
                      type="submit"
                      className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded text-center w-full sm:w-auto shrink-0 cursor-pointer shadow-sm"
                      id="booking-submit-btn"
                    >
                      체험 예약 확정 신청하기 &rarr;
                    </button>
                  </div>

                </form>
              </div>
            ) : (
              /* MY BOOKINGS LIST READ MODE */
              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="bg-white/10 p-12 rounded border border-white/10 text-center">
                    <p className="text-base text-brand-surface-low/90 mb-4">현재 예약 완료된 체험 신청 정보가 존재하지 않습니다.</p>
                    <button
                      onClick={() => setBookingViewMode('book')}
                      className="bg-white text-brand-primary text-xs font-bold px-6 py-2.5 rounded tracking-wide hover:shadow-md"
                    >
                      지금 첫 무료 체험 신청하기
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map((b) => (
                      <div 
                        key={b.id}
                        className="bg-white text-brand-primary p-6 rounded shadow border border-brand-surface-highest/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-brand-secondary-container/30 text-brand-on-secondary-container font-semibold text-xs px-2.5 py-0.5 rounded">
                              예약 대기 완료 (Central Core 인증)
                            </span>
                            <span className="text-[10px] text-brand-on-surface-variant font-mono">신청 ID: {b.id}</span>
                          </div>

                          <h3 className="text-lg font-serif font-bold text-brand-primary pt-1">
                            {b.programTitle}
                          </h3>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 text-xs text-brand-on-surface-variant pt-1">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-brand-tertiary" />
                              강사: {b.instructorName} 마스터
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-brand-tertiary" />
                              날짜: {b.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-brand-tertiary" />
                              시간: {b.timeSlot}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-brand-tertiary" />
                              신청인: {b.clientName}님
                            </span>
                          </div>

                          {b.notes && (
                            <div className="text-[11px] text-brand-on-surface-variant bg-brand-surface-low p-2 rounded border border-brand-surface-highest/20 mt-2">
                              <strong className="font-semibold text-brand-primary block mb-0.5">남기신 의학적 이상 내역:</strong>
                              {b.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex sm:flex-col gap-2 w-full md:w-auto shrink-0">
                          <button
                            onClick={() => {
                              alert(`스튜디오 전화안내번호로 바로 연결을 안내하거나 당일 강사 마스터 폰으로 자동 예약이 갱신되었습니다. (문자안내 발송완료)`);
                            }}
                            className="bg-brand-surface-low text-brand-primary hover:bg-brand-surface-highest text-xs font-semibold py-2 px-4 rounded text-center"
                          >
                            일정 변경 문의
                          </button>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold py-2 px-4 rounded text-center"
                          >
                            예약 취소
                          </button>
                        </div>

                      </div>
                    ))}
                    
                    <p className="text-center text-xs text-brand-surface-low/70 pt-2">
                      * 본 내역은 브라우저 공간 수명을 위해 로컬 드라이브에 안전하게 보관되며 스튜디오 인원 접수를 연동합니다.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-brand-surface-low border-t border-brand-surface-highest/40 text-brand-on-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col gap-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Info and vision */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-2xl font-serif text-brand-primary font-bold">Central Core</div>
              <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed max-w-xs font-light">
                균형과 내면 집중에 비할 바 없이 최적화된 하이엔드 부티크 환경에서 고도의 기구 필라테스 세션을 제공합니다.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => alert('본점 이메일: info@centralcore.co.kr 으로 문의 접수창을 연결합니다')}
                  className="w-9 h-9 rounded-full bg-white border border-brand-surface-highest/40 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                  title="이메일 문의"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert('대표전화: 02-540-3000 예약 안내소로 발신연결을 표시합니다.')}
                  className="w-9 h-9 rounded-full bg-white border border-brand-surface-highest/40 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                  title="전화 문의"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Links columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">탐색하기</h4>
                <ul className="text-xs space-y-2.5">
                  <li>
                    <button onClick={() => {
                      const el = document.getElementById('programs-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} className="text-brand-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer text-left">
                      프로그램 안내
                    </button>
                  </li>
                  <li>
                    <button onClick={() => {
                      const el = document.getElementById('instructors-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} className="text-brand-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer text-left">
                      강사진 전공 프로필
                    </button>
                  </li>
                  <li>
                    <button onClick={() => {
                      const el = document.getElementById('reviews-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} className="text-brand-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer text-left">
                      수강생 솔직 후기
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">회사 소개</h4>
                <ul className="text-xs space-y-2.5 text-brand-on-surface-variant">
                  <li>
                    <button onClick={() => {
                      const el = document.getElementById('intro-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} className="hover:text-brand-primary transition-colors">중심 철학</button>
                  </li>
                  <li>
                    <button onClick={() => setShowLocationModal(true)} className="hover:text-brand-primary transition-colors">스튜디오 오시는 길</button>
                  </li>
                  <li>
                    <button onClick={() => alert('본 계약이 체결하는 웰니스 조약 및 개인정보처리방침 규정을 열람하기 위하여 고객상담실 자료를 요청합니다.')} className="hover:text-brand-primary transition-colors">개인정보 처리방침</button>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 col-span-2 sm:col-span-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">운영 안내</h4>
                <p className="text-xs text-brand-on-surface-variant leading-relaxed font-light">
                  평일: 오전 07:00 ~ 오후 10:00 <br />
                  토요일: 오전 09:00 ~ 오후 05:00 <br />
                  일요일 및 공휴일 휴무 <br />
                  <span className="font-semibold text-brand-primary mt-1 block">주차 여부: 발렛 주차 제공</span>
                </p>
              </div>

            </div>

          </div>

          <hr className="border-brand-surface-highest/40 my-2" />

          {/* Legal Rights Block */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-on-surface-variant text-center sm:text-left font-light">
            <p>© 2026 Central Core Pilates. 균형의 미학을 지향합니다.</p>
            <p>
              안정된 웰빙을 위한 최고의 파트너. 서울 강남구 청담동 메인 에비뉴 4층 본점.
            </p>
          </div>

        </div>
      </footer>


      {/* Modal Dialog 1: Trainer Profile Detail view */}
      <AnimatePresence>
        {selectedInstructorDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="trainer-parent-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded max-w-2xl w-full text-brand-primary overflow-hidden shadow-2xl relative"
            >
              
              {/* Close btn */}
              <button 
                onClick={() => setSelectedInstructorDetail(null)}
                className="absolute top-4 right-4 bg-brand-surface-low p-1.5 rounded-full z-10 hover:bg-brand-surface-highest transition-colors"
              >
                <X className="w-5 h-5 text-brand-primary" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                <div className="md:col-span-5 h-64 md:h-auto relative bg-brand-surface-low">
                  <img 
                    src={selectedInstructorDetail.image} 
                    alt={selectedInstructorDetail.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-brand-tertiary tracking-widest bg-brand-surface-low px-2 py-0.5 rounded border border-brand-surface-highest/30 uppercase">
                        {selectedInstructorDetail.position}
                      </span>
                      <div className="flex items-center gap-0.5 text-xs">
                        <Star className="w-3 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{selectedInstructorDetail.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-brand-primary font-bold mb-1">
                      {selectedInstructorDetail.name}
                    </h3>
                    <p className="text-xs text-brand-tertiary font-mono mb-4 uppercase tracking-wider">
                      {selectedInstructorDetail.enSpecialty}
                    </p>

                    <p className="text-xs text-brand-on-surface-variant leading-relaxed font-light mb-6">
                      {selectedInstructorDetail.longBio}
                    </p>

                    <div className="bg-brand-surface-low p-4 rounded border border-brand-surface-highest/20 mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-primary mb-2">실제 수강생 리뷰</p>
                      <div className="space-y-2">
                        {selectedInstructorDetail.reviews.map((r, i) => (
                          <p key={i} className="text-[11px] text-brand-on-surface-variant leading-normal">
                            "{r}"
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleQuickBook(undefined, selectedInstructorDetail.id);
                        setSelectedInstructorDetail(null);
                      }}
                      className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs py-3 rounded font-bold tracking-widest uppercase text-center"
                    >
                      {selectedInstructorDetail.name} 강사로 예약하기
                    </button>
                    <button
                      onClick={() => setSelectedInstructorDetail(null)}
                      className="border border-brand-surface-highest/60 text-brand-primary text-xs py-3 px-4 rounded font-semibold hover:bg-brand-surface-low"
                    >
                      목록 닫기
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modal Dialog 2: Gallery Item details Dialog */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="gallery-parent-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded max-w-xl w-full text-brand-primary overflow-hidden shadow-2xl"
            >
              <div className="h-64 sm:h-80 bg-brand-surface-low relative">
                <img 
                  src={selectedGalleryItem.image} 
                  alt={selectedGalleryItem.alt} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute top-4 right-4 bg-black/40 p-1.5 rounded-full text-white hover:bg-black/60 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-brand-primary font-bold mb-2">
                    {selectedGalleryItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-on-surface-variant leading-relaxed font-light">
                    {selectedGalleryItem.description}
                  </p>
                </div>

                <div className="bg-brand-surface-low p-4 rounded border border-brand-surface-highest/20 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">기구의 대표적 치유적 이점</p>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                    {selectedGalleryItem.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-tertiary shrink-0 mt-0.5" />
                        <span className="text-xs text-brand-on-surface-variant font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleQuickBook();
                      setSelectedGalleryItem(null);
                    }}
                    className="flex-1 bg-brand-primary text-white text-xs py-3 rounded font-bold tracking-widest uppercase text-center hover:bg-brand-primary/95 transition-all"
                  >
                    이 장비 위주 체험 수업 예약
                  </button>
                  <button
                    onClick={() => setSelectedGalleryItem(null)}
                    className="border border-brand-surface-highest/60 text-brand-primary text-xs py-3 px-4 rounded font-semibold hover:bg-brand-surface-low"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modal Dialog 3: Assessment Posture/Core Testing tool */}
      <AnimatePresence>
        {showAssessmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="assessment-parent-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded max-w-xl w-full text-brand-primary p-6 sm:p-8 shadow-2xl relative"
            >
              
              <button 
                onClick={() => {
                  setShowAssessmentModal(false);
                  handleResetAssessment();
                }}
                className="absolute top-4 right-4 bg-brand-surface-low p-1.5 rounded-full hover:bg-brand-surface-highest transition-colors"
                aria-label="자가 진단 창 닫기"
              >
                <X className="w-5 h-5 text-brand-primary" />
              </button>

              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-5 h-5 text-brand-tertiary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-tertiary">
                  Central Core Diagnostic Engine
                </span>
              </div>

              {!assessmentResult ? (
                /* Questioning phase */
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-brand-primary font-bold">
                      코어 밸런스 & 척추 정렬 비대칭 자가 판별
                    </h3>
                    <p className="text-xs text-brand-on-surface-variant font-light mt-1">
                      당신의 움직임 습관과 통증 분포를 통해 이상 범위 및 맞춤 처방 기구 코스를 매칭해 줍니다.
                    </p>
                  </div>

                  <div className="bg-brand-surface-low p-1 rounded-full grid grid-cols-3 gap-1 relative text-center text-[10px] text-brand-on-surface-variant">
                    {ASSESSMENT_QUESTIONS.map((_, idx) => (
                      <span 
                        key={idx}
                        className={`py-1 rounded-full font-semibold transition-all ${
                          assessmentStep === idx
                            ? 'bg-brand-primary text-white font-bold'
                            : assessmentStep > idx
                              ? 'text-brand-primary line-through'
                              : 'text-brand-on-surface-variant/60'
                        }`}
                      >
                        질문 {idx + 1}
                      </span>
                    ))}
                  </div>

                  <div className="min-h-[80px]">
                    <p className="text-sm font-semibold text-brand-primary leading-relaxed">
                      {ASSESSMENT_QUESTIONS[assessmentStep].question}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {ASSESSMENT_QUESTIONS[assessmentStep].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(opt.score)}
                        className="w-full text-left p-4 rounded border border-brand-surface-highest hover:bg-brand-surface-low focus:outline-none transition-colors duration-200 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-xs font-medium text-brand-primary">{opt.text}</p>
                          <p className="text-[10px] text-brand-on-surface-variant/70 mt-1">{opt.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              ) : (
                /* Result display phase */
                <div className="space-y-6">
                  
                  <div className="text-center py-4 bg-brand-surface-low rounded border border-brand-surface-highest/20">
                    <span className="text-[11px] font-semibold text-brand-tertiary uppercase tracking-wider block mb-1">
                      종합 판정 결과 지수: {assessmentResult.score}등급 (총점 {assessmentResult.score}/9점)
                    </span>
                    <h4 className="font-serif text-lg text-brand-primary font-bold px-4">
                      {assessmentResult.title}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-brand-on-surface-variant leading-relaxed font-light">
                      {assessmentResult.description}
                    </p>

                    <hr className="border-brand-surface-highest/60" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 bg-brand-surface border border-brand-surface-highest rounded space-y-1">
                        <span className="text-[9px] font-mono font-bold text-brand-tertiary block uppercase">추천 기구 코스</span>
                        <p className="text-xs font-bold text-brand-primary">{assessmentResult.recommendedClass.title}</p>
                        <span className="text-[10px] text-brand-on-surface-variant">{assessmentResult.recommendedClass.duration} / {assessmentResult.recommendedClass.level} 과정</span>
                      </div>

                      <div className="p-3.5 bg-brand-surface border border-brand-surface-highest rounded space-y-1">
                        <span className="text-[9px] font-mono font-bold text-brand-tertiary block uppercase">전담 진료 강사</span>
                        <p className="text-xs font-bold text-brand-primary">{assessmentResult.recommendedInstructor.name} 설립강사</p>
                        <span className="text-[10px] text-brand-on-surface-variant">{assessmentResult.recommendedInstructor.specialty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        handleQuickBook(assessmentResult.recommendedClass.id, assessmentResult.recommendedInstructor.id);
                        setShowAssessmentModal(false);
                      }}
                      className="flex-1 bg-brand-primary text-white text-xs py-3 rounded font-bold tracking-widest uppercase text-center hover:bg-brand-primary/95 transition-all"
                    >
                      진단 기반 맞춤 프로그램 즉시 전산 예약
                    </button>
                    <button
                      onClick={handleResetAssessment}
                      className="border border-brand-surface-highest text-brand-primary text-xs py-3 px-4 rounded font-semibold hover:bg-brand-surface-low"
                    >
                      다시 테스트하기
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modal Dialog 4: Breath Metronome guide widget */}
      <AnimatePresence>
        {showBreathingWidget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="breathing-parent-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded max-w-md w-full text-brand-primary p-6 sm:p-8 shadow-2xl relative text-center"
            >
              
              <button 
                onClick={() => {
                  setShowBreathingWidget(false);
                  handleResetBreathing();
                }}
                className="absolute top-4 right-4 bg-brand-surface-low p-1.5 rounded-full hover:bg-brand-surface-highest transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 text-brand-primary" />
              </button>

              <div className="flex justify-center items-center gap-1.5 mb-2">
                <Dumbbell className="w-5 h-5 text-brand-tertiary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-tertiary">
                  Pilates Prana Breathing coach
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl text-brand-primary font-bold mb-2">
                갈비뼈 측면 확장 (복횡근) 호흡법 조율기
              </h3>
              
              <p className="text-xs text-brand-on-surface-variant leading-relaxed max-w-sm mx-auto font-light mb-6">
                코어를 수축하는 필라테스 영식 흉식 호흡(Lateral Breathing)은 어깨 긴장을 이완하며 복강 내압을 극대화시켜 줍니다. 리듬 시각구에 몸을 맡기세요.
              </p>

              {/* Rhythmic Breathing animation bubble */}
              <div className="h-48 flex items-center justify-center relative my-4">
                
                {/* Background breathing pulse ring */}
                <div 
                  className={`absolute rounded-full bg-brand-secondary-container/20 transition-all duration-1000 ${
                    isBreathingActive && breathPhase === 'inhale' ? 'w-40 h-40 scale-125' : 
                    isBreathingActive && breathPhase === 'hold' ? 'w-40 h-40 scale-110' : 'w-24 h-24 scale-100'
                  }`}
                />

                {/* Main bubble */}
                <div 
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all duration-1000 relative z-10 ${
                    breathPhase === 'inhale' ? 'bg-brand-primary' : 
                    breathPhase === 'hold' ? 'bg-brand-tertiary' : 'bg-brand-secondary'
                  }`}
                  id="breathing-circle-bubble"
                >
                  <p className="text-[11px] uppercase tracking-widest text-brand-surface-low font-normal">
                    {breathPhase === 'inhale' ? '코로 마시기' : 
                     breathPhase === 'hold' ? '숨 멈추기' : '입으로 조이기'}
                  </p>
                  
                  <p className="text-3xl font-serif mt-1">
                    {isBreathingActive ? breathCountdown : '대기'}
                  </p>
                  
                  <p className="text-[10px] font-light text-brand-surface-low/80 mt-1">
                    {breathPhase === 'inhale' ? '갈비뼈 측면 확장' : 
                     breathPhase === 'hold' ? '척추 일렬 고정' : '아랫배 납작하게'}
                  </p>
                </div>

              </div>

              {/* Counter and stats */}
              <div className="grid grid-cols-2 gap-4 bg-brand-surface-low p-3.5 rounded border border-brand-surface-highest/40 mb-6 text-xs text-brand-primary">
                <div>
                  <span className="block text-[10px] text-brand-on-surface-variant font-medium">진행 페이즈</span>
                  <span className="font-bold uppercase tracking-widest text-brand-primary">
                    {breathPhase} (4초)
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-on-surface-variant font-medium">성공 횟수</span>
                  <span className="font-bold text-brand-primary">{totalBreathsCompleted}회 수명 갱신</span>
                </div>
              </div>

              {/* Helper control buttons */}
              <div className="flex gap-2">
                {!isBreathingActive ? (
                  <button
                    onClick={handleStartBreathing}
                    className="flex-1 bg-brand-primary text-white text-xs py-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-brand-primary/95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    호흡 훈련 시작
                  </button>
                ) : (
                  <button
                    onClick={handlePauseBreathing}
                    className="flex-1 border border-brand-primary text-brand-primary text-xs py-3 rounded font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-brand-surface-low"
                  >
                    <Pause className="w-4 h-4 text-brand-primary fill-brand-primary" />
                    일시 정지
                  </button>
                )}
                <button
                  onClick={handleResetBreathing}
                  className="bg-brand-surface border border-brand-surface-highest text-brand-primary px-4 py-3 rounded hover:bg-brand-surface-low transition-all"
                  aria-label="훈련 리셋"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-brand-on-surface-variant/80 mt-4">
                * 3분(약 12번 온전 주기) 수행 시 등 뒤 광배근 긴장도가 약 40% 즉각 경감됩니다.
              </p>

            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modal Dialog 5: Studio exact location & Virtual GPS */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="location-parent-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded max-w-lg w-full text-brand-primary p-6 sm:p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 bg-brand-surface-low p-1.5 rounded-full hover:bg-brand-surface-highest transition-colors"
              >
                <X className="w-5 h-5 text-brand-primary" />
              </button>

              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="w-5 h-5 text-brand-tertiary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-tertiary">
                  DIRECTIONS & SERVICES
                </span>
              </div>

              <h3 className="font-serif text-xl text-brand-primary font-bold mb-4">
                Central Core 청담 본점 안내
              </h3>

              {/* Interactive Draggable & Zoomable Map Preview */}
              <div className="relative h-64 sm:h-72 w-full rounded border border-brand-surface-highest/60 bg-[#F5F4EE] overflow-hidden select-none mb-6">
                
                {/* Drag status message */}
                <div className="absolute top-3 left-3 z-20 bg-brand-primary/80 backdrop-blur-sm text-white text-[9px] px-2.5 py-1 rounded shadow-sm font-sans flex items-center gap-1.5 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>지도를 드래그하여 둘러보세요 (도보 3분 거리)</span>
                </div>

                {/* Map Control Box */}
                <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMapZoom(z => Math.min(z + 0.25, 2.5))}
                    className="w-8 h-8 rounded bg-white shadow-md border border-[#E0DFD8] flex items-center justify-center text-brand-primary hover:bg-[#FAF9F6] active:scale-95 transition-all cursor-pointer"
                    title="확대"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom(z => Math.max(z - 0.25, 0.75))}
                    className="w-8 h-8 rounded bg-white shadow-md border border-[#E0DFD8] flex items-center justify-center text-brand-primary hover:bg-[#FAF9F6] active:scale-95 transition-all cursor-pointer"
                    title="축소"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom(1)}
                    className="w-8 h-8 rounded bg-white shadow-md border border-[#E0DFD8] flex items-center justify-center text-brand-primary hover:bg-[#FAF9F6] active:scale-95 transition-all cursor-pointer"
                    title="초기화"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive Map Canvas */}
                <motion.div
                  drag={true}
                  dragElastic={0.15}
                  dragConstraints={{ left: -220, right: 220, top: -140, bottom: 140 }}
                  style={{ 
                    width: '800px', 
                    height: '500px', 
                    position: 'absolute', 
                    left: 'calc(50% - 400px)', 
                    top: 'calc(50% - 250px)' 
                  }}
                  animate={{ scale: mapZoom }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="bg-[#F5F4EE] relative select-none cursor-grab active:cursor-grabbing"
                >
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
                    backgroundImage: 'radial-gradient(circle, #34270f 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                  }} />

                  {/* Hangang River (Top) */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-[#D3E3F2] border-b border-[#B2CDE0] flex items-center justify-center">
                    <span className="font-serif text-[11px] text-[#4A7295] tracking-widest uppercase font-medium">한강 (Hangang River)</span>
                  </div>

                  {/* Cheongdam Park (Bottom Left) */}
                  <div className="absolute bottom-6 left-12 w-44 h-24 bg-[#E1EDDD] border border-[#CBDAC6] rounded-xl flex items-center justify-center">
                    <span className="font-sans text-[10px] text-[#557E4D] font-semibold tracking-wide">청담공원</span>
                  </div>

                  {/* Cheongdam Samik Apt (Right) */}
                  <div className="absolute top-28 right-8 w-44 h-20 bg-[#ECEBE5] border border-[#D7D6CD] rounded flex flex-col justify-center items-center px-2 text-center">
                    <span className="font-sans text-[10px] text-brand-primary/60 font-semibold">청담 삼익 아파트</span>
                    <span className="font-sans text-[8px] text-brand-primary/40 mt-0.5">재건축 예정 구역</span>
                  </div>

                  {/* STREETS / ROADS */}

                  {/* Dosan-daero (Horizontal - Top) */}
                  <div className="absolute top-28 left-0 right-0 h-8 bg-white border-y border-[#E2E1D7] flex items-center">
                    <div className="w-full border-t border-dashed border-[#C0BFA8] h-0" />
                    <span className="absolute left-8 bg-[#FAF9F6] text-[#7A796F] text-[7px] font-bold px-1 rounded transform -translate-y-1/2">도산대로</span>
                  </div>

                  {/* Hakdong-ro (Horizontal - Middle) */}
                  <div className="absolute top-72 left-0 right-0 h-10 bg-white border-y border-[#E2E1D7] flex items-center">
                    <div className="w-full border-t border-dashed border-amber-400 h-0" />
                    <span className="absolute left-10 bg-[#FAF9F6] text-[#7A796F] text-[7px] font-bold px-1 rounded transform -translate-y-1/2">학동로</span>
                  </div>

                  {/* Yeongdong-daero (Vertical - Right) */}
                  <div className="absolute top-24 right-56 bottom-0 w-12 bg-white border-x border-[#E2E1D7] flex justify-center">
                    <div className="h-full border-l border-dashed border-amber-400 w-0" />
                    <span className="absolute bottom-10 bg-[#FAF9F6] text-[#7A796F] text-[7px] font-bold py-1 px-0.5 rounded tracking-widest [writing-mode:vertical-lr] text-center">영동대로</span>
                  </div>

                  {/* Samseong-ro (Vertical - Left) */}
                  <div className="absolute top-24 left-64 bottom-0 w-8 bg-white border-x border-[#E2E1D7] flex justify-center">
                    <div className="h-full border-l border-dashed border-[#C0BFA8] w-0" />
                    <span className="absolute bottom-12 bg-[#FAF9F6] text-[#7A796F] text-[7px] font-bold py-1 px-0.5 rounded tracking-widest [writing-mode:vertical-lr] text-center">삼성로</span>
                  </div>

                  {/* WALKING DIRECTION SVG LAYER */}
                  <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
                    {/* Path from Cheongdam Station Exit 9 (approx x: 380, y: 310) to Central Core (approx x: 420, y: 195) */}
                    <path 
                      d="M 380 322 Q 410 322 410 260 T 425 200" 
                      fill="none" 
                      stroke="#8C7F60" 
                      strokeWidth="2.5" 
                      strokeDasharray="6,4" 
                      strokeLinecap="round"
                    />
                    {/* Arrow Head */}
                    <path 
                      d="M 425 200 L 419 208 M 425 200 L 429 207" 
                      fill="none" 
                      stroke="#8C7F60" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Footsteps Dot Bubble / Walk time */}
                  <div 
                    className="absolute z-10 bg-[#FAF9F6] border border-[#C0BFA8] text-[#8C7F60] text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1"
                    style={{ left: '415px', top: '255px', transform: 'translate(-50%, -50%)' }}
                  >
                    <span>🚶 도보 3분 (250m)</span>
                  </div>

                  {/* LANDMARKS */}
                  
                  {/* Cheongdam Cathedral */}
                  <div className="absolute text-[9px] text-[#8C8B83] font-medium" style={{ left: '460px', top: '240px' }}>
                    ⛪ 청담성당
                  </div>

                  {/* Livat Furniture */}
                  <div className="absolute text-[9px] text-[#8C8B83] font-medium" style={{ left: '430px', top: '345px' }}>
                    🏢 현대 리바트가구
                  </div>

                  {/* Cheongdam Police Box */}
                  <div className="absolute text-[9px] text-[#8C8B83] font-medium" style={{ left: '220px', top: '220px' }}>
                    👮 청담치안센터
                  </div>

                  {/* Luxury 명품거리 */}
                  <div className="absolute text-[9px] text-[#8C8B83] font-medium tracking-wide" style={{ left: '110px', top: '150px' }}>
                    ✨ 청담동 명품거리
                  </div>

                  {/* SUBWAY STATION: CHEONGDAM (Exit 9) */}
                  <div className="absolute" style={{ left: '380px', top: '320px', transform: 'translate(-50%, -50%)' }}>
                    <div className="w-7 h-7 rounded-full bg-[#747F28] border-2 border-white shadow flex items-center justify-center text-white text-[9px] font-bold">
                      7
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white border border-[#C0BFA8] px-1.5 py-0.5 rounded shadow-sm text-[8px] font-bold text-brand-primary whitespace-nowrap">
                      청담역
                    </div>
                  </div>

                  {/* Exit 9 Capsule */}
                  <div 
                    className="absolute bg-amber-500 border border-white text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm"
                    style={{ left: '388px', top: '298px' }}
                  >
                    9번 출구
                  </div>


                  {/* STUDIO PIN: CENTRAL CORE */}
                  <div className="absolute" style={{ left: '425px', top: '185px', transform: 'translate(-50%, -50%)' }}>
                    {/* Ring Pulse effect */}
                    <span className="absolute -inset-2.5 rounded-full bg-brand-primary/30 animate-ping" />
                    
                    <div className="relative bg-brand-primary text-white w-9 h-9 rounded-full shadow-lg border-2 border-brand-tertiary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand-tertiary-container" />
                    </div>

                    {/* Speech bubble label */}
                    <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-extrabold px-3 py-1.5 rounded-md shadow-md border border-brand-tertiary whitespace-nowrap flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Central Core 청담본점</span>
                    </div>

                    {/* Small speech arrow */}
                    <div className="absolute bottom-[38px] left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-primary border-r border-b border-brand-tertiary transform rotate-45" />
                  </div>

                </motion.div>

                {/* Valet Parking Label */}
                <span className="absolute bottom-3 left-3 bg-brand-primary text-white text-[9px] px-2.5 py-1 rounded shadow-sm uppercase tracking-wide font-sans font-bold border border-brand-tertiary/40">
                  ⚡ VALET PARKING FREE
                </span>

              </div>

              <div className="space-y-4 text-xs text-brand-on-surface-variant">
                <div>
                  <h4 className="font-bold text-brand-primary mb-1">대중교통 오시는 방법</h4>
                  <p className="leading-relaxed">
                    - <strong className="font-semibold text-brand-primary">지하철:</strong> 청담역 9번 출구로 나와 청담 성당 사거리 방향으로 약 250m 직진 후 리바트 가구 사거리 코너 4층입니다. <br />
                    - <strong className="font-semibold text-brand-primary">버스:</strong> 청담역 앞 (23-142) 정류장에서 간선 143, 362번 하차 시 도보 1분 이내.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-brand-primary mb-1">주차 및 발렛 파킹 안내</h4>
                  <p className="leading-relaxed">
                    수련생들의 한적한 수면 여정을 위해 <strong className="font-semibold text-brand-primary">전 강좌 발렛 파킹을 무상 제공</strong>합니다. 리프 오피스 1층 주차타워 정면 발렛 부스에서 'Central Core 필라테스 고객'이라고 수납증을 받아주시면 됩니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    alert('네이버지도 / 카카오맵 네비게이션 주소 등록 상태를 브라우저 외부 탭에 연동합니다.');
                  }}
                  className="flex-1 bg-brand-primary text-white text-xs py-3 rounded font-bold tracking-widest uppercase text-center hover:bg-brand-primary/95 transition-colors"
                >
                  네이버 지도 실행하기
                </button>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="border border-brand-surface-highest text-brand-primary text-xs py-3 px-4 rounded font-semibold hover:bg-brand-surface-low"
                >
                  확인 완료
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Modal Dialog 6: Write Custom Review */}
      <AnimatePresence>
        {showWriteReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="write-review-modal-parent">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-lg w-full text-brand-primary p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                type="button"
                onClick={() => {
                  setShowWriteReviewModal(false);
                  setNewReviewName('');
                  setNewReviewRating(5);
                  setNewReviewTag('거북목/체형교정');
                  setNewReviewCustomTag('');
                  setNewReviewProgram('Core Reformer');
                  setNewReviewCustomProgram('');
                  setNewReviewPeriod('3개월 수강');
                  setNewReviewContent('');
                }}
                className="absolute top-4 right-4 bg-brand-surface-low p-1.5 rounded-full z-10 hover:bg-brand-surface-highest transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-brand-primary" />
              </button>

              <div className="mb-6">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-secondary font-bold block mb-1">
                  WRITE A REVIEW
                </span>
                <h3 className="font-serif text-2xl text-brand-primary font-bold">
                  솔직한 수강 후기 남기기
                </h3>
                <p className="text-xs text-brand-on-surface-variant mt-1 leading-relaxed">
                  수업을 통해 느끼신 몸의 변화와 경험을 들려주세요.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  if (!newReviewName.trim()) {
                    alert('이름을 입력해주세요.');
                    return;
                  }
                  if (!newReviewContent.trim() || newReviewContent.trim().length < 10) {
                    alert('후기 내용을 최소 10자 이상 입력해주세요.');
                    return;
                  }

                  const selectedTag = newReviewTag === 'custom' ? (newReviewCustomTag.trim() || '체형교정') : newReviewTag;
                  const selectedProgram = newReviewProgram === 'custom' ? (newReviewCustomProgram.trim() || 'Core Reformer') : newReviewProgram;

                  const newReviewObj = {
                    id: `r-custom-${Date.now()}`,
                    name: newReviewName,
                    tag: selectedTag,
                    programName: selectedProgram,
                    rating: newReviewRating,
                    date: new Date().toISOString().split('T')[0],
                    period: newReviewPeriod,
                    content: newReviewContent,
                  };

                  const updatedReviews = [newReviewObj, ...reviewsList];
                  setReviewsList(updatedReviews);
                  setCurrentReviewIndex(0); // Show the new review immediately
                  setShowWriteReviewModal(false);

                  // Reset form
                  setNewReviewName('');
                  setNewReviewRating(5);
                  setNewReviewTag('거북목/체형교정');
                  setNewReviewCustomTag('');
                  setNewReviewProgram('Core Reformer');
                  setNewReviewCustomProgram('');
                  setNewReviewPeriod('3개월 수강');
                  setNewReviewContent('');
                }}
                className="space-y-4 text-xs text-left"
              >
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="예: 김민아"
                    maxLength={10}
                    className="w-full px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary bg-[#FAF9F6] text-brand-primary font-sans text-xs"
                  />
                </div>

                {/* Star Rating Selection */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                    평점 및 추천 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= newReviewRating 
                              ? 'fill-current text-amber-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-semibold text-brand-secondary font-mono text-xs">{newReviewRating}.0 / 5.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category/Tag */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                      핵심 태그 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newReviewTag}
                      onChange={(e) => setNewReviewTag(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary bg-[#FAF9F6] text-brand-primary text-xs"
                    >
                      <option value="거북목/체형교정">거북목/체형교정</option>
                      <option value="일자목/자세 불균형">일자목/자세 불균형</option>
                      <option value="드레스 라인/유연성">드레스 라인/유연성</option>
                      <option value="재활/척추 통증 완화">재활/척추 통증 완화</option>
                      <option value="심부 코어/고난도 컨트롤">심부 코어/고난도 컨트롤</option>
                      <option value="산전산후/골반 정렬">산전산후/골반 정렬</option>
                      <option value="custom">직접 입력...</option>
                    </select>
                    {newReviewTag === 'custom' && (
                      <input 
                        type="text"
                        required
                        value={newReviewCustomTag}
                        onChange={(e) => setNewReviewCustomTag(e.target.value)}
                        placeholder="예: 다이어트/근력증강"
                        maxLength={15}
                        className="w-full mt-2 px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary bg-[#FAF9F6] text-brand-primary text-xs"
                      />
                    )}
                  </div>

                  {/* Period */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                      수강 기간 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newReviewPeriod}
                      onChange={(e) => setNewReviewPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary bg-[#FAF9F6] text-brand-primary text-xs"
                    >
                      <option value="1개월 수강">1개월 수강</option>
                      <option value="2개월 수강">2개월 수강</option>
                      <option value="3개월 수강">3개월 수강</option>
                      <option value="4개월 수강">4개월 수강</option>
                      <option value="5개월 수강">5개월 수강</option>
                      <option value="6개월 수강">6개월 수강</option>
                      <option value="12개월 이상 수강">12개월 이상 수강</option>
                    </select>
                  </div>
                </div>

                {/* Program Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                    수강한 프로그램 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newReviewProgram}
                    onChange={(e) => setNewReviewProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary bg-[#FAF9F6] text-brand-primary text-xs"
                  >
                    <option value="Core Reformer">코어 리포머 (Core Reformer)</option>
                    <option value="Athletic Reformer">애슬레틱 리포머 (Athletic Reformer)</option>
                    <option value="Rehabilitation">재활 필라테스 (Rehabilitation)</option>
                    <option value="Advanced Mobility">어드밴스드 모빌리티 (Advanced Mobility)</option>
                    <option value="custom">직접 입력...</option>
                  </select>
                  {newReviewProgram === 'custom' && (
                    <input 
                      type="text"
                      required
                      value={newReviewCustomProgram}
                      onChange={(e) => setNewReviewCustomProgram(e.target.value)}
                      placeholder="예: 산후 1:1 리커버리"
                      maxLength={30}
                      className="w-full mt-2 px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary bg-[#FAF9F6] text-brand-primary text-xs"
                    />
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1.5">
                    솔직한 후기 내용 <span className="text-red-500">* (최소 10자)</span>
                  </label>
                  <textarea 
                    required
                    rows={4}
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    placeholder="수업을 받기 전 고민했던 점과 수업 후 신체적인 변화, 그리고 좋았던 점을 적어주세요."
                    className="w-full px-3 py-2 border border-[#E0DFD8] rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary bg-[#FAF9F6] text-brand-primary leading-relaxed font-sans text-xs resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#5E5E5E] hover:bg-brand-secondary text-white text-xs py-3 rounded font-bold tracking-widest uppercase text-center transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                  >
                    수강 후기 등록하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWriteReviewModal(false);
                      setNewReviewName('');
                      setNewReviewRating(5);
                      setNewReviewTag('거북목/체형교정');
                      setNewReviewCustomTag('');
                      setNewReviewProgram('Core Reformer');
                      setNewReviewCustomProgram('');
                      setNewReviewPeriod('3개월 수강');
                      setNewReviewContent('');
                    }}
                    className="border border-brand-surface-highest text-brand-primary text-xs py-3 px-4 rounded font-semibold hover:bg-brand-surface-low transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
