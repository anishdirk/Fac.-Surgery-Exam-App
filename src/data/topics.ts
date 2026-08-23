export interface TopicInfo {
  id: string;
  order: number;
  titleEn: string;
  titleRu: string;
  questionRange: [number, number];
  count: number;
  icon: string;
  descriptionEn: string;
}

export const topics: TopicInfo[] = [
  { 
    id: 'appendicitis', 
    order: 1,
    titleEn: 'Acute Appendicitis', 
    titleRu: 'Острый аппендицит', 
    questionRange: [1, 48], 
    count: 48,
    icon: '🩺',
    descriptionEn: 'Clinical signs (Kocher, Rovsing, Sitkovsky), atypical locations, pediatric & geriatric features'
  },
  { 
    id: 'hernias', 
    order: 2,
    titleEn: 'Abdominal & Inguinal Hernias', 
    titleRu: 'Грыжи живота', 
    questionRange: [49, 96], 
    count: 48,
    icon: '🛡️',
    descriptionEn: 'Strangulated vs irreducible hernias, Bassini/Shouldice repairs, Richter & Littre hernia'
  },
  { 
    id: 'biliary', 
    order: 3,
    titleEn: 'Biliary Tract & Cholecystitis', 
    titleRu: 'Заболевания желчных путей', 
    questionRange: [97, 144], 
    count: 48,
    icon: '🧪',
    descriptionEn: 'Murphy sign, Ortner sign, Courvoisier sign, choledocholithiasis, obstructive jaundice'
  },
  { 
    id: 'obstruction', 
    order: 4,
    titleEn: 'Intestinal Obstruction (Ileus)', 
    titleRu: 'Кишечная непроходимость', 
    questionRange: [145, 192], 
    count: 48,
    icon: '🔄',
    descriptionEn: 'Kloiber cups, mechanical vs paralytic ileus, intussusception, volvulus'
  },
  { 
    id: 'pancreatitis', 
    order: 5,
    titleEn: 'Acute Pancreatitis & Necrosis', 
    titleRu: 'Острый панкреатит', 
    questionRange: [193, 240], 
    count: 48,
    icon: '🔥',
    descriptionEn: 'Mayo-Robson, Cullen, Grey Turner signs, enzyme diagnostic markers, sterile vs infected necrosis'
  },
  { 
    id: 'ulcer', 
    order: 6,
    titleEn: 'Gastroduodenal Ulcer & Perforation', 
    titleRu: 'Язвенная болезнь желудка и ДПК', 
    questionRange: [241, 312], 
    count: 72,
    icon: '⚡',
    descriptionEn: 'Perforation triad (dagger pain, wooden abdomen, subdiaphragmatic sickle air), Forrest bleeding'
  },
  { 
    id: 'gastric_cancer', 
    order: 7,
    titleEn: 'Gastric Malignancy & Polyps', 
    titleRu: 'Рак желудка', 
    questionRange: [313, 346], 
    count: 34,
    icon: '🎯',
    descriptionEn: 'Virchow, Krukenberg, Schnitzler metastases, Borrmann classification, early diagnostics'
  },
  { 
    id: 'peritonitis', 
    order: 8,
    titleEn: 'Peritonitis & Sepsis', 
    titleRu: 'Перитонит и абсцессы', 
    questionRange: [347, 383], 
    count: 37,
    icon: '⚠️',
    descriptionEn: 'Reactive, toxic, terminal phases, Shchetkin-Blumberg, subphrenic & Douglas pouch abscesses'
  },
  { 
    id: 'proctology', 
    order: 9,
    titleEn: 'Proctology: Hemorrhoids & Fissures', 
    titleRu: 'Заболевания прямой кишки', 
    questionRange: [384, 410], 
    count: 27,
    icon: '📍',
    descriptionEn: 'Acute paraproctitis, Goodsall rule, anal fissures triad, hemorrhoid staging'
  },
  { 
    id: 'thoracic_suppuration', 
    order: 10,
    titleEn: 'Thoracic: Abscess & Gangrene of Lungs', 
    titleRu: 'Нагноительные заболевания легких', 
    questionRange: [411, 440], 
    count: 30,
    icon: '🫁',
    descriptionEn: 'Acute vs chronic lung abscess, bronchiectasis, drainage positioning, putrid gangrene'
  },
  { 
    id: 'pleural', 
    order: 11,
    titleEn: 'Pneumothorax & Pleural Empyema', 
    titleRu: 'Пневмоторакс и эмпиема плевры', 
    questionRange: [441, 471], 
    count: 31,
    icon: '💨',
    descriptionEn: 'Tension pneumothorax, Bulau drainage, thoracocentesis landmarks, fibrothorax'
  },
  { 
    id: 'lung_cancer', 
    order: 12,
    titleEn: 'Pulmonary Oncology & Mediastinum', 
    titleRu: 'Рак легкого', 
    questionRange: [472, 500], 
    count: 29,
    icon: '🔬',
    descriptionEn: 'Central vs peripheral carcinoma, Horner syndrome, Pancoast tumor, bronchoscopy biopsy'
  },
  { 
    id: 'arterial', 
    order: 13,
    titleEn: 'Arterial Occlusion & Gangrene', 
    titleRu: 'Облитерирующие заболевания артерий', 
    questionRange: [501, 536], 
    count: 36,
    icon: '⚡',
    descriptionEn: 'Leriche syndrome, acute arterial embolism (6 Ps), intermittent claudication, bypass grafting'
  },
  { 
    id: 'venous', 
    order: 14,
    titleEn: 'Venous Thrombosis & Varices', 
    titleRu: 'Заболевания вен', 
    questionRange: [537, 572], 
    count: 36,
    icon: '🩸',
    descriptionEn: 'Homans, Moses signs, deep vein thrombosis (DVT), pulmonary embolism prevention, Troyanov-Trendelenburg'
  },
  { 
    id: 'esophagus', 
    order: 15,
    titleEn: 'Esophagus: Strictures, Burns & Achalasia', 
    titleRu: 'Заболевания пищевода', 
    questionRange: [573, 596], 
    count: 24,
    icon: '🧪',
    descriptionEn: 'Chemical burns stages, bougienage, cardiospasm (bird-beak sign), Mallory-Weiss vs Boerhaave'
  },
  { 
    id: 'thyroid', 
    order: 16,
    titleEn: 'Thyroid Gland & Endocrine Surgery', 
    titleRu: 'Заболевания щитовидной железы', 
    questionRange: [597, 620], 
    count: 24,
    icon: '🦋',
    descriptionEn: 'Thyrotoxic crisis, recurrent laryngeal nerve monitoring, Kocher thyroidectomy, hypoparathyroidism'
  }
];

export const TOPICS = topics.map(t => ({
  id: t.id,
  nameEn: t.titleEn,
  nameRu: t.titleRu,
  range: t.questionRange,
  icon: t.icon
}));
