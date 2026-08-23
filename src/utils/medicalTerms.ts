// Medical terms glossary with Russian to English translations and explanations
export interface TermEntry {
  ru: string;
  en: string;
  definition: string;
  category?: string;
}

export const MEDICAL_GLOSSARY: Record<string, TermEntry> = {
  // Signs & Eponyms
  'щеткина-блюмберга': {
    ru: 'Щеткина–Блюмберга',
    en: 'Blumberg Sign (Rebound Tenderness)',
    definition: 'Sharp pain upon sudden release of deep abdominal palpation; hallmark of peritoneal irritation.',
    category: 'Peritoneal Signs'
  },
  'ковчера': {
    ru: 'Кохера–Волковича',
    en: 'Kocher-Volkovich Sign',
    definition: 'Abdominal pain starting in the epigastrium or periumbilical area and shifting to the right iliac fossa.',
    category: 'Appendicitis'
  },
  'кохера': {
    ru: 'Кохера',
    en: 'Kocher Sign',
    definition: 'Migration of epigastric pain to right iliac fossa in acute appendicitis.',
    category: 'Appendicitis'
  },
  'ровзинга': {
    ru: 'Ровзинга',
    en: "Rovsing's Sign",
    definition: 'Pressure in the left lower quadrant causes pain in the right lower quadrant due to retrograde gas displacement.',
    category: 'Appendicitis'
  },
  'воскресенского': {
    ru: 'Воскресенского',
    en: "Voskresensky's Sign (Shirt Sign)",
    definition: 'Pain felt when quickly sliding hand over patient shirt across epigastrium down to right iliac fossa.',
    category: 'Appendicitis / Pancreatitis'
  },
  'образцова': {
    ru: 'Образцова',
    en: "Obraztsov's (Psoas) Sign",
    definition: 'Pain increased upon raising the extended right leg while lying supine, indicating retrocecal appendicitis.',
    category: 'Appendicitis'
  },
  'бартомье': {
    ru: 'Бартомье–Михельсона',
    en: "Bartomier-Michelson Sign",
    definition: 'Increased tenderness in right iliac fossa when palpated with the patient lying on their left side.',
    category: 'Appendicitis'
  },
  'ситковского': {
    ru: 'Ситковского',
    en: "Sitkovsky's Sign",
    definition: 'Appearance or exacerbation of right lower quadrant pain when patient turns onto the left side.',
    category: 'Appendicitis'
  },
  'курвуазье': {
    ru: 'Курвуазье',
    en: "Courvoisier's Law / Sign",
    definition: 'Palpably enlarged, non-tender gallbladder in the presence of obstructive jaundice (points to head of pancreas malignancy).',
    category: 'Biliary / Oncology'
  },
  'керте': {
    ru: 'Керте',
    en: "Körte's Sign",
    definition: 'Painful resistance/guarding in the epigastrium along the transverse projection of the pancreas in acute pancreatitis.',
    category: 'Pancreatitis'
  },
  'мейо-робсона': {
    ru: 'Мейо–Робсона',
    en: "Mayo-Robson's Sign",
    definition: 'Tenderness at the left costovertebral angle, typical for acute pancreatitis involving the tail/body.',
    category: 'Pancreatitis'
  },
  'грея-тернера': {
    ru: 'Грея–Тернера',
    en: "Grey Turner's Sign",
    definition: 'Bruising/cyanosis of the flank tissues in severe acute necrotizing pancreatitis.',
    category: 'Pancreatitis'
  },
  'мондора': {
    ru: 'Мондора',
    en: "Mondor's Sign",
    definition: 'Bluish spots / cyanosis of the face and trunk in acute severe pancreatitis.',
    category: 'Pancreatitis'
  },
  'куллена': {
    ru: 'Куллена',
    en: "Cullen's Sign",
    definition: 'Superficial edema and bruising around the umbilicus.',
    category: 'Pancreatitis / Hemoperitoneum'
  },
  'хвостека': {
    ru: 'Хвостека',
    en: "Chvostek's Sign",
    definition: 'Twitching of facial muscles elicited by tapping the facial nerve; indicates hypocalcemia/hypoparathyroidism.',
    category: 'Thyroid / Parathyroid'
  },
  'труссо': {
    ru: 'Труссо',
    en: "Trousseau's Sign",
    definition: "Carpal spasm ('main d'accoucheur') upon inflation of a BP cuff above systolic pressure; indicates tetany/hypocalcemia.",
    category: 'Thyroid / Parathyroid'
  },
  'клойбера': {
    ru: 'Чаши Клойбера',
    en: "Kloiber's Cups",
    definition: 'Classic radiologic crescent gas-fluid levels visible on abdominal plain X-ray in intestinal obstruction (ileus).',
    category: 'Intestinal Obstruction'
  },
  'шум плеска': {
    ru: 'Шум плеска',
    en: 'Splashing Sound (Sklyarov Sign)',
    definition: 'Audible fluid splashing on gentle abdominal agitation in acute intestinal obstruction.',
    category: 'Intestinal Obstruction'
  },
  'доскообразный': {
    ru: 'Доскообразный живот',
    en: 'Board-like Abdominal Rigidity (Défense)',
    definition: 'Severe involuntary spastic contraction of the abdominal rectus muscles, typical in hollow organ perforation.',
    category: 'Peritonitis / Perforation'
  },
  'пэнкоста': {
    ru: 'Рак Пэнкоста',
    en: 'Pancoast Tumor',
    definition: 'Apical lung carcinoma invading brachial plexus, cervical sympathetic ganglia (Horner syndrome), and ribs.',
    category: 'Thoracic Oncology'
  },
  'горнера': {
    ru: 'Синдром Клода Бернара – Горнера',
    en: "Horner's Syndrome",
    definition: 'Triad of ptosis, miosis, and anhidrosis caused by disruption of the cervical sympathetic chain.',
    category: 'Neurology / Thoracic'
  },
  'лериша': {
    ru: 'Синдром Лериша',
    en: 'Leriche Syndrome',
    definition: 'Aortoiliac occlusive disease: claudication of buttock/thigh, absent femoral pulses, and erectile dysfunction.',
    category: 'Vascular Surgery'
  },
  'меллори': {
    ru: 'Синдром Маллори–Вейса',
    en: 'Mallory-Weiss Syndrome',
    definition: 'Mucosal longitudinal laceration at the gastroesophageal junction caused by severe retching/vomiting.',
    category: 'Gastroenterology'
  },
  'вирхова': {
    ru: 'Метастаз Вирхова',
    en: "Virchow's Node",
    definition: 'Left supraclavicular lymph node metastasis from abdominal malignancy (gastric cancer).',
    category: 'Oncology'
  },
  'крукенберга': {
    ru: 'Метастаз Крукенберга',
    en: 'Krukenberg Tumor',
    definition: 'Metastasis to ovaries typically originating from gastric adenocarcinoma.',
    category: 'Oncology'
  },
  'шницлера': {
    ru: 'Метастаз Шницлера',
    en: "Schnitzler's Metastasis",
    definition: 'Metastatic implant in the rectovesical or rectouterine (Douglas) pouch.',
    category: 'Oncology'
  }
};

// Simple Russian -> English dictionary mapping
export const medicalTermsDictionary: Record<string, string> = {
  'Щеткина–Блюмберга (Симптом)': 'Blumberg Sign: Rebound tenderness indicating acute peritoneal inflammation.',
  'Кохера–Волковича (Симптом)': 'Kocher-Volkovich Sign: Migration of pain from epigastrium/periumbilical to right iliac fossa in acute appendicitis.',
  'Ровзинга (Симптом)': 'Rovsing Sign: Left lower quadrant pressure causing right lower quadrant pain in appendicitis.',
  'Воскресенского (Симптом рубашки)': 'Voskresensky Sign: Sliding hand over shirt across abdomen causes sharp pain at McBurney point.',
  'Образцова (Псоас-симптом)': 'Obraztsov Sign: Exacerbation of RLQ pain on raising extended right leg (retrocecal appendicitis).',
  'Бартомье–Михельсона (Симптом)': 'Bartomier-Michelson Sign: Increased RLQ tenderness during palpation with patient in left lateral decubitus.',
  'Ситковского (Симптом)': 'Sitkovsky Sign: RLQ pain triggered or increased when patient turns onto the left side.',
  'Курвуазье (Симптом / Закон)': 'Courvoisier Law: Palpably enlarged non-tender gallbladder + jaundice suggests head of pancreas neoplasm rather than stone.',
  'Керте (Симптом)': 'Körte Sign: Local transverse band of epigastric muscle guarding corresponding to inflamed pancreas.',
  'Мейо–Робсона (Симптом)': 'Mayo-Robson Sign: Tenderness in the left costovertebral angle in pancreatitis (tail/body involvement).',
  'Грея–Тернера (Симптом)': 'Grey Turner Sign: Flank ecchymosis/bruising in acute hemorrhagic pancreatitis.',
  'Мондора (Симптом)': 'Mondor Sign: Cyanotic spots on face and torso in acute severe pancreatitis.',
  'Куллена (Симптом)': 'Cullen Sign: Periumbilical superficial ecchymosis in acute pancreatitis or intraperitoneal bleeding.',
  'Хвостека (Симптом)': 'Chvostek Sign: Facial twitching on tapping facial nerve, indicating hypocalcemia/tetany after thyroidectomy.',
  'Труссо (Симптом)': 'Trousseau Sign: Carpopedal spasm after inflating BP cuff on arm, indicating latent hypocalcemia.',
  'Чаши Клойбера': 'Kloiber Cups: Air-fluid crescent levels on plain abdominal X-ray pathognomonic for bowel obstruction.',
  'Шум плеска (Склярова)': 'Sklyarov Splashing Sign: Audible fluid sloshing in distended bowel loops in mechanical obstruction.',
  'Доскообразный живот': 'Board-like Rigidity: Reflex involuntary contraction of abdominal wall muscles in perforated viscus.',
  'Рак Пэнкоста (Верхушечный)': 'Pancoast Tumor: Superior sulcus lung neoplasm invading brachial plexus and sympathetic chain.',
  'Синдром Горнера': 'Horner Syndrome: Triad of ptosis, miosis, and anhidrosis.',
  'Синдром Лериша': 'Leriche Syndrome: Chronic aortoiliac occlusion causing buttock/thigh claudication and absent femoral pulse.',
  'Синдром Маллори–Вейса': 'Mallory-Weiss Syndrome: Longitudinal gastroesophageal junction mucosal tear from forceful vomiting.',
  'Метастаз Вирхова': 'Virchow Node: Left supraclavicular lymph node enlargement from gastrointestinal malignancy.',
  'Метастаз Крукенберга': 'Krukenberg Tumor: Ovarian metastasis originating from stomach or colon adenocarcinoma.',
  'Метастаз Шницлера': 'Schnitzler Metastasis: Metastatic tumor drop in the rectouterine / rectovesical Douglas pouch.'
};

// Quick keyword translations for common medical options
export const MEDICAL_TRANSLATION_MAP: Record<string, string> = {
  'острый аппендицит': 'acute appendicitis',
  'флегмонозный': 'phlegmonous',
  'гангренозный': 'gangrenous',
  'перфоративный': 'perforated',
  'перитонит': 'peritonitis',
  'холецистит': 'cholecystitis',
  'панкреатит': 'pancreatitis',
  'панкреонекроз': 'pancreatic necrosis',
  'холедохолитиаз': 'choledocholithiasis (common bile duct stones)',
  'кишечная непроходимость': 'intestinal obstruction (ileus)',
  'инвагинация': 'intussusception',
  'заворот': 'volvulus',
  'ущемленная грыжа': 'strangulated / incarcerated hernia',
  'паховая грыжа': 'inguinal hernia',
  'бедренная грыжа': 'femoral hernia',
  'лапароскопия': 'laparoscopy',
  'лапаротомия': 'laparotomy',
  'аппендэктомия': 'appendectomy',
  'холецистэктомия': 'cholecystectomy',
  'пневмоторакс': 'pneumothorax',
  'эмпиема плевры': 'pleural empyema',
  'абсцесс легкого': 'lung abscess',
  'гангрена легкого': 'lung gangrene',
  'облитерирующий эндартериит': 'obliterating endarteritis',
  'облитерирующий тромбангиит': 'thromboangiitis obliterans (Buerger disease)',
  'тромбофлебит': 'thrombophlebitis',
  'флебэктомия': 'phlebectomy',
  'ахалазия кардии': 'achalasia of cardia',
  'бужирование': 'bougienage / esophageal dilation',
  'тиреотоксикоз': 'thyrotoxicosis',
  'струмэктомия': 'strumectomy (thyroidectomy)',
  'гипопаратиреоз': 'hypoparathyroidism',
  'диффузный токсический зоб': 'diffuse toxic goiter (Graves disease)',
  'рак желудка': 'gastric cancer',
  'рак легкого': 'lung cancer',
  'парапроктит': 'paraproctitis / perianal abscess',
  'геморрой': 'hemorrhoids',
  'анальная трещина': 'anal fissure',
  'все перечисленное': 'all of the above',
  'все перечисленное верно': 'all of the above are correct',
  'ни один из них': 'none of the above',
  'экстренная операция': 'emergency surgery',
  'плановая операция': 'scheduled / elective surgery',
  'консервативное лечение': 'conservative treatment'
};

export function findGlossaryTerms(text: string): TermEntry[] {
  const lower = text.toLowerCase();
  const matched: TermEntry[] = [];
  
  for (const [key, term] of Object.entries(MEDICAL_GLOSSARY)) {
    if (lower.includes(key)) {
      matched.push(term);
    }
  }
  return matched;
}

export function getQuickTranslation(text: string): string | null {
  const lower = text.toLowerCase().trim();
  for (const [key, translation] of Object.entries(MEDICAL_TRANSLATION_MAP)) {
    if (lower.includes(key)) {
      return translation;
    }
  }
  return null;
}
