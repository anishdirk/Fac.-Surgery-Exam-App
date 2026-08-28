import { ClinicalCase } from '../../types';

export const biliaryCases: ClinicalCase[] = [
  {
    id: 61,
    number: 1,
    topicId: 'biliary',
    topicTitleEn: 'Gallbladder & Biliary Tract Diseases',
    stem: 'A 52-year-old obese female was admitted 18 hours after a high-fat dietary indiscretion (fried pork and alcohol). She complains of severe colicky right upper quadrant (RUQ) pain radiating to the right scapula, shoulder, and neck, accompanied by persistent non-relieving bilious vomiting, dry bitter mouth, and fever to 38.2°C. Physical exam: non-icteric sclerae, dry coated tongue, pulse 88 bpm, BP 135/85 mmHg. Abdomen is soft but demonstrates guarding and acute tenderness in the right hypochondrium, where a tense, enlarged, tender gallbladder is palpated. Positive Ortner, Kehr, Murphy, and Mussy (phrenic) signs. Blumberg\'s sign is equivocal locally in the RUQ.',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Describe the sequence of pathogenesis in acute calculous cholecystitis.' },
      { num: 3, text: 'List the specific semiotic signs of acute cholecystitis and how they are elicited.' },
      { num: 4, text: 'What are the classic ultrasound features of acute cholecystitis?' },
      { num: 5, text: 'What is the standard surgical timeline and management protocol?' }
    ],
    answers: [
      { num: 1, text: 'Gallstone disease (cholelithiasis). Acute calculous obstructive phlegmonous cholecystitis.' },
      { num: 2, text: 'Impacted gallstone in cystic duct/infundibulum -> acute outflow obstruction -> high intravesical hypertension -> mucosal ischemia and chemical inflammation -> secondary bacterial invasion -> transmural suppurative cholecystitis.' },
      { num: 3, text: 'Ortner\'s sign (percussion tenderness along right costal margin); Murphy\'s sign (inspiratory arrest on deep RUQ palpation); Kehr\'s sign (point tenderness in RUQ); Mussy\'s/phrenic sign (tenderness between right sternocleidomastoid heads).' },
      { num: 4, text: 'Gallbladder enlargement (>10x4 cm), wall thickening (>4 mm), "double-contour" wall edema, intraluminal calculi, pericholecystic fluid halo, and sonographic Murphy sign.' },
      { num: 5, text: 'Hospitalization, IV fluids, antispasmodics, broad-spectrum IV antibiotics, and early laparoscopic cholecystectomy (LC) within 24–72 hours of admission (gold standard).' }
    ]
  },
  {
    id: 62,
    number: 2,
    topicId: 'biliary',
    topicTitleEn: 'Gallbladder & Biliary Tract Diseases',
    crossTopicIds: ['pancreatitis'],
    stem: 'A 64-year-old female was admitted for acute cholecystitis. On day 2 of illness, she developed marked scleral and cutaneous jaundice, dark "tea-colored" urine, acholic (clay-colored) stools, and generalized pruritus. Palpation reveals RUQ and epigastric tenderness. Labs: total bilirubin 180 µmol/L, direct (conjugated) 140 µmol/L, ALP and GGT elevated 4-fold, ALT 95 U/L, AST 80 U/L, serum amylase normal. Ultrasound shows a distended calculous gallbladder with a 5 mm wall, a common bile duct (CBD) dilated to 16 mm containing a 10 mm acoustic shadowing calculus in the distal intrapancreatic segment, and intrahepatic biliary ductal dilatation.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'What are the three pathophysiological types of jaundice? Classify this patient\'s jaundice.' },
      { num: 3, text: 'What imaging modalities are used to evaluate the biliary tree (MRCP, ERCP, EUS)?' },
      { num: 4, text: 'Describe the two-stage minimally invasive endoscopic-laparoscopic treatment sequence.' },
      { num: 5, text: 'What types of external biliary T-tube/drainage are used in open choledochotomy (Kehr, Vishnevsky)?' }
    ],
    answers: [
      { num: 1, text: 'Gallstone disease; acute calculous cholecystitis; choledocholithiasis with common bile duct obstruction and acute mechanical (cholestatic) jaundice.' },
      { num: 2, text: '1) Prehepatic (hemolytic); 2) Hepatic (parenchymal/hepatocellular); 3) Posthepatic (obstructive/mechanical). This case is posthepatic obstructive jaundice (conjugated hyperbilirubinemia, elevated ALP/GGT, acholic stool, dark urine).' },
      { num: 3, text: 'Abdominal ultrasound, Magnetic Resonance Cholangiopancreatography (MRCP — non-invasive gold standard), Endoscopic Ultrasound (EUS), and Endoscopic Retrograde Cholangiopancreatography (ERCP).' },
      { num: 4, text: 'Two-stage "rendezvous/split" strategy: Stage 1 — urgent ERCP with endoscopic sphincterotomy (EST) and stone extraction (Dormia basket/balloon); Stage 2 — elective laparoscopic cholecystectomy following jaundice resolution.' },
      { num: 5, text: '1) Kehr\'s T-tube drainage; 2) Vishnevsky drainage (single-lumen tube via cystic stump to hepatic duct); 3) Pikovsky microdrainage; 4) Halsted trans-cystic drain.' }
    ]
  },
  {
    id: 63,
    number: 3,
    topicId: 'biliary',
    topicTitleEn: 'Gallbladder & Biliary Tract Diseases',
    crossTopicIds: ['obstruction'],
    stem: 'A 78-year-old female with a long-standing history of gallstones presents with colicky abdominal pain, distension, obstipation, and recurrent feculent vomiting over 3 days. Examination: distended soft abdomen with periumbilical tenderness, succussion splash, and metallic hyperactive bowel sounds. Plain abdominal X-ray demonstrates small bowel air-fluid levels (Kloiber cups), air in the intrahepatic biliary tree (aerobilia/pneumobilia), and a 3.5 cm radiopaque calcified density in the right lower quadrant (Rigler\'s triad).',
    questions: [
      { num: 1, text: 'Formulate the complete diagnosis.' },
      { num: 2, text: 'Explain the biliodigestive fistulization mechanism causing this obstruction.' },
      { num: 3, text: 'What constitutes classic Rigler\'s triad on abdominal imaging?' },
      { num: 4, text: 'Where does the gallstone most frequently obstruct and why?' },
      { num: 5, text: 'What is the optimal emergency surgical procedure in this elderly patient?' }
    ],
    answers: [
      { num: 1, text: 'Gallstone ileus (mechanical small bowel obstruction secondary to an impacted gallstone via a cholecystoduodenal fistula).' },
      { num: 2, text: 'Chronic inflammation and pressure necrosis of a massive gallstone against the adjacent duodenum create a spontaneous cholecystoduodenal fistula; the stone passes into the gut and impacts at a narrow intestinal segment.' },
      { num: 3, text: 'Rigler\'s triad: 1) Small bowel mechanical obstruction; 2) Pneumobilia (gas in the biliary tree); 3) Ectopic radiopaque gallstone in the intestinal lumen.' },
      { num: 4, text: 'Terminal ileum (proximal to the ileocecal valve), which represents the narrowest caliber and least compliant segment of the small intestine.' },
      { num: 5, text: 'Emergency laparotomy, enterolithotomy (longitudinal enterotomy proximal to the impacted stone, stone extraction, and transverse closure). Simultaneous fistula repair/cholecystectomy is contraindicated in frail elderly patients due to prohibitive mortality.' }
    ]
  },
  {
    id: 64,
    number: 4,
    topicId: 'biliary',
    topicTitleEn: 'Gallbladder & Biliary Tract Diseases',
    stem: 'A 58-year-old male was admitted to the ICU in critical condition. Two days after acute RUQ pain, progressive jaundice, shaking chills with fevers to 40.0°C, and drenching sweats developed. This morning he became lethargic, disoriented, and obtunded. Physical exam: stuporous mental state, deep saffron-yellow jaundice, hot flushed skin, pulse 124 bpm, BP 80/50 mmHg, RR 28/min. RUQ tenderness and hepatomegaly (+4 cm). Labs: WBC 22.5 x 10⁹/L (26% bands), total bilirubin 210 µmol/L (direct 165), lactate 4.2 mmol/L, platelets 85 x 10⁹/L.',
    questions: [
      { num: 1, text: 'State the clinical diagnosis; identify Charcot\'s triad and Reynolds\' pentad.' },
      { num: 2, text: 'Explain the mechanism of bilio-venous reflux and septic shock in acute cholangitis.' },
      { num: 3, text: 'What is the immediate life-saving therapeutic objective?' },
      { num: 4, text: 'What are the emergency minimally invasive biliary decompression modalities?' },
      { num: 5, text: 'Outline the sepsis resuscitation and antibiotic regimen.' }
    ],
    answers: [
      { num: 1, text: 'Acute suppurative ascending cholangitis, severe cholangiogenic sepsis and septic shock. Charcot\'s triad: RUQ pain + jaundice + fever/chills. Reynolds\' pentad: Charcot\'s triad + hypotension (shock) + altered mental status.' },
      { num: 2, text: 'Biliary obstruction drives intrabiliary pressure >250–300 mm H2O, overcoming ductal barrier and triggering cholangiovenous reflux of bacteria/endotoxins directly into the systemic circulation, causing fulminant septic shock.' },
      { num: 3, text: 'Emergency biliary decompression to relieve ductal hypertension and drain purulent infected bile; antibiotics alone cannot penetrate obstructed infected ducts.' },
      { num: 4, text: '1) Urgent ERCP with endoscopic nasobiliary drainage (ENBD) or plastic biliary stenting (treatment of choice); 2) Percutaneous Transhepatic Biliary Drainage (PTBD) under US/fluoroscopy guidance; 3) Emergency open T-tube choledochostomy if endoscopic routes fail.' },
      { num: 5, text: 'ICU sepsis protocol: fluid resuscitation, norepinephrine infusion for refractory hypotension, and IV broad-spectrum bactericidal antibiotics (meropenem, piperacillin-tazobactam).' }
    ]
  },
  {
    id: 65,
    number: 5,
    topicId: 'biliary',
    topicTitleEn: 'Gallbladder & Biliary Tract Diseases',
    crossTopicIds: ['gastric_cancer'],
    stem: 'A 72-year-old male presents with progressive painless jaundice, dark urine, clay-colored stools, intolerable pruritus, anorexia, and a 7 kg weight loss over 2 months. He reports no abdominal pain. Physical exam: deep olive-green jaundice with cutaneous excoriations. Abdomen is soft and non-tender. In the RUQ, a markedly enlarged, smooth, tense-elastic, completely painless gallbladder is palpable (positive Courvoisier\'s sign). Hepatomegaly (+3 cm).',
    questions: [
      { num: 1, text: 'Name the pathognomonic clinical sign and explain its oncologic significance.' },
      { num: 2, text: 'What is the primary oncologic diagnosis?' },
      { num: 3, text: 'Why is Courvoisier\'s sign absent in common bile duct gallstone obstruction?' },
      { num: 4, text: 'Outline the diagnostic imaging, endoscopic, and tumor marker panel.' },
      { num: 5, text: 'What radical vs palliative surgical/endoscopic options exist?' }
    ],
    answers: [
      { num: 1, text: 'Courvoisier-Terrier sign (palpable, distended, non-tender gallbladder in the presence of painless jaundice). Highly indicative of malignant distal biliary obstruction.' },
      { num: 2, text: 'Periampullary malignancy (carcinoma of the head of the pancreas / distal cholangiocarcinoma / ampulla of Vater cancer) with mechanical obstructive jaundice.' },
      { num: 3, text: 'In cholelithiasis, chronic recurrent inflammation causes scarring, mural fibrosis, and shrinkage of the gallbladder wall, preventing passive enlargement during acute ductal blockage.' },
      { num: 4, text: 'Multiphase contrast-enhanced abdominal CT (pancreatic protocol), Endoscopic Ultrasound (EUS) with fine-needle aspiration (FNA) biopsy, MRCP, and serum CA 19-9.' },
      { num: 5, text: 'Radical: Pancreaticoduodenectomy (Whipple procedure). Palliative: endoscopic retrograde biliary stenting (SEMS) or surgical bypass (hepaticodochoduodenostomy/cholecystojejunostomy with gastrojejunostomy).' }
    ]
  }
];
