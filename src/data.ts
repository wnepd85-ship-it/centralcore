import { Instructor, GalleryItem, Program, Question, Review } from './types';

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'elena',
    name: '김민지',
    position: '설립자',
    specialty: '재활 필라테스 & 체형 교정',
    enSpecialty: 'Clinical Rehabilitation & Posture Correction',
    bio: '국제 재활 필라테스 협회 마스터 러너이자, 12년 경력의 신체 정렬 전문가입니다. 부상 극복과 해부학적 맞춤 가이드를 지향합니다.',
    longBio: '엘레나 밴스는 해부학적 지식과 깊은 연민의 태도를 바탕으로 겉모습뿐만 아니라 속 근육부터 다시 살려내는 움직임을 설계합니다. 만성 통증, 척추 이상, 출산 후 골반 틀어짐 등으로 고통받는 수많은 오피니어 리더들이 그녀의 손길을 거쳤으며, 중앙 정렬의 가치를 전파하고 있습니다.',
    image: 'https://postfiles.pstatic.net/MjAyNjA2MjdfMTY1/MDAxNzgyNTUxODY5MjY4.UN7044IQIzZTL_b0GsU_enGSBBUDIREHex_b3Of0W3og.4uTX8n2sFBewrxzYr3fA6qGi108zfUynjfStIqZftqsg.PNG/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_27%EC%9D%BC_%EC%98%A4%ED%9B%84_05_05_24.png?type=w3840',
    rating: 4.9,
    reviews: [
      '단 한 세션만으로도 허리 가동 범위가 완전히 달라졌어요. 정말 은인 같은 분이십니다.',
      '통증의 근본적인 원인을 정확히 짚어내고 알기 쉽게 설명해주어서 좋았습니다.'
    ]
  },
  {
    id: 'sienna',
    name: '이루리',
    position: '시니어',
    specialty: '애슬레틱 리포머 & 코어 컨디셔닝',
    enSpecialty: 'Athletic Reformer & Dynamic Core Strengthening',
    bio: '체조 선수 출신으로 활기차고 에너지 넘치는 동작 구성을 자랑합니다. 호흡의 균형과 폭발적인 심부 근육 발달을 목표로 합니다.',
    longBio: '시에나 브룩스는 신체 가동성과 무용적 유려함을 필라테스 기구 위에 완벽히 녹여냅니다. 그녀의 리포머 세션은 코어 근육 구석구석을 깨우며, 일상 속 정밀한 기동 통제력과 신체 균형을 회복하도록 돕습니다.',
    image: 'https://postfiles.pstatic.net/MjAyNjA2MjdfNzAg/MDAxNzgyNTUxODgwMzc1.oS0dq8goHUjeGP-qOj95NIzEhor8ccAdx-nF_GvlViUg.uGF9ZRULOdZrVs0U76XkcYeZkG0rWm6-eZWTzT-1Ft8g.PNG/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_27%EC%9D%BC_%EC%98%A4%ED%9B%84_05_10_17.png?type=w3840',
    rating: 4.8,
    reviews: [
      '땀이 촉촉히 나면서도 몸은 전혀 무리하지 않고 개운해지는 역동적인 50분이었습니다!',
      '코어 깊숙한 속근육의 사용법을 깨닫게 해준 최고의 시니어 트레이너입니다.'
    ]
  },
  {
    id: 'julian',
    name: '박민혁',
    position: '시니어',
    specialty: '가동성 트레이닝 & 스포츠 메디컬',
    enSpecialty: 'Mobility Training & Sports Medicine Pilates',
    bio: '물리치료사 면허를 보유한 정밀 운동 전문가입니다. 관절의 제한 범위를 해소하고 일상 가동 능력을 극대화시킵니다.',
    longBio: '줄리안 첸은 운동역학과 고유 수용 감각 재활에 초점을 둡니다. 각자의 신체 특성을 과학적으로 수치화하여 필요한 맞춤 각도를 제시하며, 기구 기반의 부드러우면서도 단단한 정렬을 완성해 드립니다.',
    image: 'https://postfiles.pstatic.net/MjAyNjA2MjdfMTcx/MDAxNzgyNTcxNjYwMjEz.9Tsb6y_Lh_NwB9A8vp--3ivRfde6Wh63TXRboJ4Yjusg.sEv0-Ohn0lphKVy9Kb3k5GUghiOdzn1oLO0RtEVKbKIg.PNG/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_27%EC%9D%BC_%EC%98%A4%ED%9B%84_10_46_43.png?type=w3840',
    rating: 4.9,
    reviews: [
      '관절이 뻣뻣해서 요가나 다른 구부리기 운동은 겁났는데, 기구 사용법을 친절히 교정 받아 가동 범위가 크게 넓어졌어요.',
      '논리적이고 명료한 지도로 내 몸이 어디가 비대칭인지 완벽하게 깨닫고 고치고 있습니다.'
    ]
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: '리포머 필라테스 (Reformer)',
    alt: '리포머 필라테스 기구',
    description: '적절한 저항을 제공하는 스프링과 가변식 도르래가 장착된 리포머는 전신 근육의 비대칭을 진단하고, 균형 있게 발달시키기 위한 최적의 올인원 기구입니다.',
    benefits: [
      '전신 정렬 및 비대칭 체형 교정',
      '관절 스트레스 없는 근력 단단한 강화',
      '고유수용감각 발달 및 유연성 향상'
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk9RDi2tkBVavf1pUZ8QYKCDoLXqHrqcv9DmE79e3QchgM-PepaHaiuh4GTOLioLd-Xgm6qcpVMa_I-Psli9jfji1rQnmCJA99O3xXEjVSbP5XlGigStCn3Hjl5R_AkEnDU0uJARFMGV7cQQ_YcT6SojfB7zl69SQaC7rzLYPKeJcugmsOUL7BQ_adOBR5DXhUUR6S_ywmOyXeOJJBEOprDQnCrRY4_p79moTBEoc07ApyywlH1DyLtyLYGM5SDr-C64l_v2_0oMg',
    size: 'large'
  },
  {
    id: 'g2',
    title: '캐딜락 디테일 (Cadillac)',
    alt: '캐딜락 기구',
    description: '하늘에 매달린 행잉 스프링과 스트랩을 활용해 척추 마디마디의 분절 및 가동성을 정교하게 깨워내고 극강의 코어 힘을 길러줍니다.',
    benefits: [
      '심층 코어 머슬의 완전한 집중 개입',
      '척추 및 골반 분절 가동범위 극대화',
      '부상 후 조절 능력의 재활 훈련 특화'
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB72hy5W75V7qzlaCMFcY4ptqjAZ7w5gWsNHskG0eD3NyBPRicu-np8-ymjhLCjwX-uQHqqiOu0CeAr0q6w65VC7QPEAfyi1GyDewPAKOHdb6ejImguJFO1kBbmyrXJeAA0SLhj2JmL154CzDtF6PzUPZxvrodnV7yd3r4YQYoDwCdwTBQUx8NLBYaSMeT-S9u-N39-unbUHFmAqVURAnzxiyHF2_TGbpRBb18L5GtloDvlRFMr4OVvcZIEQG1qcUbK-WnB1H_V82E',
    size: 'small'
  },
  {
    id: 'g3',
    title: '운다 체어 (Wunda Chair)',
    alt: '운다 체어',
    description: '작은 지지 면적 위에서 체중부하 제어를 필요로 하는 고난도 밸런스 및 하체 근육 단련용 기구로, 강인한 하복부 및 정렬 안정성을 제공합니다.',
    benefits: [
      '하체 정렬과 고관절 밸런싱',
      '골반저근 및 기립근 등 후면 사슬 강화',
      '고난도 균형 감각 촉진'
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5E_9WxWT6GNdKmgql_oDPsSzuQIaamy-cpwah1_h7t0hnlUokqY47UD0zyuKcE0yp8scZQBwB_ulrchcUoTASNPf55dZgN3vyOqUdk4uZVeKs5MprxiYE116EJSQLDgA7xhtBwF5nx1cv-8aTqkes5-cE4zL1l3OqiLmTxP524hpFLqtDD3R4TuzblkFRbu0NMAJPDyXIt8U89QnHl5LU2IMofKiAb92zyhAiD2emWLmHiCyqSVlMXZhnIdTZzl3phTska8BYHs8',
    size: 'tall'
  },
  {
    id: 'g4',
    title: '핸드 루프 & 로프 (Loops)',
    alt: '핸드 루프 디테일',
    description: '최상급의 부드럽고 질긴 가죽 및 커스텀 원단을 활용해 사용자의 손끝, 발끝에 닿는 촉감부터 안정적으로 지탱하며 신체의 완전한 이완과 긴장을 돕습니다.',
    benefits: [
      '부드러운 압력 분포로 피부 및 힘줄 자극 없음',
      '다각도 수축 작용을 위한 고탄성 로프 연동',
      '정밀하고 미세한 저항 조절 매커니즘'
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF-WbhmQwv4LVXNfAXx_pZ0tTdgyO_5RNzOk4WWd68qnnyVQHtWUPEcuwiIfWQaKKyntH7niqIntjGe3W7hG9ttIJmI1xgkJDgyGnoZ51bpPgYvvkkh8QSclaqmPUCMiossz4c6F9SXeCFX8lB0yP6EYJsuLSeG8_6IkAOMPxlO-CfPMiln6sMoLv3BYKqRS741Jqv_2vCF1GMLjinfBvv5AoxkmWaSy4WfHM8EQ-YocK0ExH9vW2bACTiypxaYkmrc3A7XKSvk1A',
    size: 'small'
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'p-equilibrium',
    title: '코어 리포머',
    enTitle: 'Core Reformer',
    level: 'Beginner',
    duration: '50min',
    intensity: 'Low',
    description: '코어 안정성과 자세 정렬을 위한 기초 리포머 프로그램',
    benefits: [
      '골반 정렬 수평 오차 즉각적 완화',
      '코어 하단 유기적 힘 자가 인지',
      '호흡 조절 중심선 각성 패턴 습득'
    ],
    capacity: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF-WbhmQwv4LVXNfAXx_pZ0tTdgyO_5RNzOk4WWd68qnnyVQHtWUPEcuwiIfWQaKKyntH7niqIntjGe3W7hG9ttIJmI1xgkJDgyGnoZ51bpPgYvvkkh8QSclaqmPUCMiossz4c6F9SXeCFX8lB0yP6EYJsuLSeG8_6IkAOMPxlO-CfPMiln6sMoLv3BYKqRS741Jqv_2vCF1GMLjinfBvv5AoxkmWaSy4WfHM8EQ-YocK0ExH9vW2bACTiypxaYkmrc3A7XKSvk1A'
  },
  {
    id: 'p-reformer',
    title: '애슬레틱 리포머',
    enTitle: 'Athletic Reformer',
    level: 'Intermediate',
    duration: '50min',
    intensity: 'Medium',
    description: '근력과 탄력을 동시에 향상시키는 역동적인 리포머 프로그램',
    benefits: [
      '전체 근섬유 활성도를 높이는 저항 운동',
      '사지 유연 가동력 증강',
      '둔근 및 대퇴 사슬 정렬 성취'
    ],
    capacity: 6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk9RDi2tkBVavf1pUZ8QYKCDoLXqHrqcv9DmE79e3QchgM-PepaHaiuh4GTOLioLd-Xgm6qcpVMa_I-Psli9jfji1rQnmCJA99O3xXEjVSbP5XlGigStCn3Hjl5R_AkEnDU0uJARFMGV7cQQ_YcT6SojfB7zl69SQaC7rzLYPKeJcugmsOUL7BQ_adOBR5DXhUUR6S_ywmOyXeOJJBEOprDQnCrRY4_p79moTBEoc07ApyywlH1DyLtyLYGM5SDr-C64l_v2_0oMg'
  },
  {
    id: 'p-rehab',
    title: '재활 필라테스',
    enTitle: 'Rehabilitation',
    level: 'All Levels',
    duration: '50min',
    intensity: 'Low',
    description: '통증 완화와 자세 교정을 위한 맞춤형 재활 프로그램',
    benefits: [
      '일자목 및 거북목 압박 완화',
      '분마디 척추 정렬 재설정',
      '부상 부위 근 신경 재활 활성화'
    ],
    capacity: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB72hy5W75V7qzlaCMFcY4ptqjAZ7w5gWsNHskG0eD3NyBPRicu-np8-ymjhLCjwX-uQHqqiOu0CeAr0q6w65VC7QPEAfyi1GyDewPAKOHdb6ejImguJFO1kBbmyrXJeAA0SLhj2JmL154CzDtF6PzUPZxvrodnV7yd3r4YQYoDwCdwTBQUx8NLBYaSMeT-S9u-N39-unbUHFmAqVURAnzxiyHF2_TGbpRBb18L5GtloDvlRFMr4OVvcZIEQG1qcUbK-WnB1H_V82E'
  },
  {
    id: 'p-mobility',
    title: '어드밴스드 모빌리티',
    enTitle: 'Advanced Mobility',
    level: 'Advanced',
    duration: '50min',
    intensity: 'High',
    description: '고난도 컨트롤과 유연성 향상을 위한 프리미엄 프로그램',
    benefits: [
      '전방 사슬 확장 및 유연 유동력 확보',
      '극단적인 밸런싱 기법을 통한 신경 각성',
      '전문 수련생 수준의 웰니스 한계 타파'
    ],
    capacity: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5E_9WxWT6GNdKmgql_oDPsSzuQIaamy-cpwah1_h7t0hnlUokqY47UD0zyuKcE0yp8scZQBwB_ulrchcUoTASNPf55dZgN3vyOqUdk4uZVeKs5MprxiYE116EJSQLDgA7xhtBwF5nx1cv-8aTqkes5-cE4zL1l3OqiLmTxP524hpFLqtDD3R4TuzblkFRbu0NMAJPDyXIt8U89QnHl5LU2IMofKiAb92zyhAiD2emWLmHiCyqSVlMXZhnIdTZzl3phTska8BYHs8'
  }
];

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: '하루 중 가장 많은 시간을 차지하는 서거나 앉아 있는 자세는 어떤 편인가요?',
    options: [
      { text: '장시간 컴퓨터 앞에서 모니터를 향해 목을 빼고 구부정하게 앉아 있습니다.', score: 3, description: '굽은 등과 일자목 정렬 불균형이 의심됩니다.' },
      { text: '다리를 꼬고 앉거나, 서 있을 때 한쪽 골반에 무게중심을 두고 짝다리를 짚는 버릇이 있습니다.', score: 2, description: '골반 비대칭 및 천장관절 불안정 경향이 보입니다.' },
      { text: '등을 곧게 펴고 밸런스 있는 자세를 유지하려고 의식하지만, 이내 금방 목이나 허리가 뻐근해집니다.', score: 1, description: '자세 유지근(코어)의 피로 누적 및 지구력 부족 상태입니다.' }
    ]
  },
  {
    id: 2,
    question: '아래 증상 중 평상시 당신에게 일어나는 육체적 통증이나 피로감은 어떤 범위인가요?',
    options: [
      { text: '안구 건조 및 만성 두통을 동반한 뒷목, 어깨의 뭉침 현상과 자고 일어나도 뻐근함이 잔존함.', score: 3, description: '상지교차증후군(대흉근 긴장 및 거북목 발달) 치료가 절실합니다.' },
      { text: '가끔 오래 걷거나 일어서면 골반 좌우 한 곳이 욱신거리거나 치마, 바지가 한쪽으로 많이 돌아감.', score: 2, description: '골반 불균형으로 인한 요추 불안정이 작용하고 있습니다.' },
      { text: '등 주변이 단단하게 뭉쳐 깊은 호흡을 쉴 때 조금 뻣뻣하다고 느끼거나 숨이 쉽게 차오름.', score: 1, description: '갈비뼈 주변 전거근과 횡격막 가동성 훈련이 지시됩니다.' }
    ]
  },
  {
    id: 3,
    question: '평소 코어 및 복부 정밀 근력 수준에 대해 어떻게 생각하시나요?',
    options: [
      { text: '바닥에 오랜 시간 눕거나 앉으면 허리 틈새가 너무 과하게 떠서 꼬리뼈나 요추 뒤편 통증이 발생함.', score: 3, description: '복횡근 약화 및 아랫배 코어 서포팅 결손 상태입니다.' },
      { text: '런지나 한 발 서기 동작 시 온몸이 바들바들 떨리거나 좌우 발목 흔들림이 유독 극심함.', score: 2, description: '하지 지지 체인의 유기적 협력 관계 및 고유수용감각 연계 누락입니다.' },
      { text: '플랭크 등을 하면 코어가 아닌 어깨 힘으로 견디며 목 앞쪽에 담이 자주 결림.', score: 1, description: '대근육 유선 사용법에 따른 코어 유치 결핍 양상입니다.' }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: '김민아',
    tag: '거북목/체형교정',
    programName: 'Core Reformer',
    rating: 5,
    date: '2026-06-15',
    period: '3개월 수강',
    content: '종일 구부정한 자세로 모니터를 보며 일하다 보니 거북목과 허리 통증이 심해 일상이 늘 뻐근하고 괴로웠습니다. 일대일 맞춤 리포머 집중 정렬 수업을 수강한 후 만성 어깨 통증이 씻은 듯이 사라졌고, 몸 전체의 중심선을 정밀하게 다스리는 코어의 힘을 매주 실감하고 있습니다.'
  },
  {
    id: 'r2',
    name: '이지현',
    tag: '드레스 라인/유연성',
    programName: 'Advanced Mobility',
    rating: 5,
    date: '2026-06-20',
    period: '2개월 수강',
    content: '결혼식을 앞두고 쇄골 라인 정리와 굽은 어깨 교정을 위해 등록했습니다. 타 센터의 필라테스와 다르게 호흡법 정렬부터 동작 하나하나 가동성을 극대화해 어깨 라인이 너무나 반듯하게 정돈되었어요. 만나는 지인들마다 승모근 라인이 슬림해지고 목이 길어졌다고 칭찬이 자자합니다!'
  },
  {
    id: 'r3',
    name: '박준호',
    tag: '재활/척추 통증 완화',
    programName: 'Rehabilitation',
    rating: 5,
    date: '2026-06-25',
    period: '6개월 수강',
    content: '고질적인 허리 통증으로 서 있거나 운전할 때조차 무척 쑤셨는데, 기구의 수축 자극과 정교한 분절 운동을 통해 척추 정렬을 맞추니 통증의 근본 원인이 개선되는 걸 느낍니다. 엘레나 원장님의 깊이 있는 재활 코칭 덕분에 지금은 골프 칠 때 비거리와 유연성까지 월등하게 개선되었습니다.'
  },
  {
    id: 'r4',
    name: '최서연',
    tag: '심부 코어/고난도 컨트롤',
    programName: 'Athletic Reformer',
    rating: 5,
    date: '2026-06-18',
    period: '5개월 수강',
    content: '기존에 수년간 그룹 필라테스를 받아와서 나름 자신 있었는데, 이곳에서 일대일 집중 기구 저항을 겪어보고 진정한 속근육 활성화가 무엇인지 비로소 깨닫게 되었습니다. 좌우 불균형을 예리하게 간파해 균형 수치를 맞춰주시니 매 세션마다 한계를 단단하게 넘어가는 성장의 기쁨이 있습니다.'
  },
  {
    id: 'r5',
    name: '정수민',
    tag: '일자목/자세 불균형',
    programName: 'Core Reformer',
    rating: 5,
    date: '2026-06-22',
    period: '4개월 수강',
    content: '자세 판독판 검사를 통해 제 비대칭 체형을 분석해 주셨는데, 짝다리를 짚는 습관과 골반의 경사도가 눈에 띄게 좋아졌습니다. 갈비뼈를 정밀하게 조이는 전식 호흡법 하나만으로도 복부 전체의 긴장감이 남달라졌고, 불균형 교정을 통해 만성 피로와 근육 뭉침이 기적적으로 완화되었습니다.'
  }
];

