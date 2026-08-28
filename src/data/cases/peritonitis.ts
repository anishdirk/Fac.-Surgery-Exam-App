import { ClinicalCase } from '../../types';

export const peritonitisCases: ClinicalCase[] = [
  {
    id: 71,
    number: 1,
    topicId: 'peritonitis',
    topicTitleEn: 'Peritonitis & Abdominal Abscesses',
    crossTopicIds: ['appendicitis'],
    stem: 'A 42-year-old male was admitted on day 3 of illness in severe septic condition: lethargic, pale, sunken eyes and sharp features (facies Hippocratica), dry tongue with dark brown crusts. Body temperature 38.9°C, pulse 120 bpm, BP 95/60 mmHg, RR 28/min. He complains of diffuse constant abdominal pain, fecaloid vomiting, and obstipation. Symptoms originated as right lower quadrant pain 3 days ago for which he self-medicated with analgesics. Physical exam: abdomen is distended, rigid, and exquisitely tender in all quadrants. Blumberg, Mendel, and Voskresensky signs are diffuse and positive throughout. Bowel sounds are absent ("deathly silence"). Labs: WBC 19.8 x 10⁹/L (22% bands, 4% metamyelocytes), toxic granulation, leukocyte index of intoxication (LII) 6.5, creatinine 160 µmol/L.',
    questions: [
      { num: 1, text: 'Formulate the complete diagnosis and determine the stage of peritonitis according to Simonian\'s classification.' },
      { num: 2, text: 'Describe the three clinical stages of diffuse peritonitis (reactive, toxic, terminal).' },
      { num: 3, text: 'Describe the preoperative resuscitation protocol and timing.' },
      { num: 4, text: 'List the mandatory surgical steps of laparotomy for diffuse peritonitis.' },
      { num: 5, text: 'What are the indications and goals of nasointestinal tube splinting/decompression?' }
    ],
    answers: [
      { num: 1, text: 'Acute perforated appendicitis complicated by diffuse purulent-fibrinous peritonitis, Toxic Stage (Simonian classification), abdominal sepsis, and paralytic ileus.' },
      { num: 2, text: '1) Reactive stage (0–24 h): maximal local peritoneal defense, sharp localized pain; 2) Toxic stage (24–72 h): diffuse peritonitis, paralytic ileus, marked systemic endotoxemia, dissociation between pulse and temperature; 3) Terminal stage (>72 h): decompensated septic shock, multi-organ failure, irreversible collapse.' },
      { num: 3, text: 'Rapid ICU resuscitation (max 1.5–2 hours): aggressive fluid resuscitation to restore central venous pressure and urine output, NG suction, bladder catheterization, and IV broad-spectrum antibiotics.' },
      { num: 4, text: '1) Wide midline exploratory laparotomy; 2) Elimination of the source (appendectomy); 3) Thorough abdominal lavage (6–10 L warm sterile saline); 4) Nasointestinal long-tube decompression; 5) Multi-quadrant closed tube drainage.' },
      { num: 5, text: 'Severe paralytic ileus, extreme loop distension with compromised microcirculation, and dense fibrin deposits; relieves intraluminal pressure and prevents recurrent obstructive adhesions.' }
    ]
  },
  {
    id: 72,
    number: 2,
    topicId: 'peritonitis',
    topicTitleEn: 'Peritonitis & Abdominal Abscesses',
    crossTopicIds: ['biliary', 'pleural'],
    stem: 'A 56-year-old male on postoperative day 9 following open cholecystectomy for gangrenous cholecystitis developed hectic fevers to 39.2°C, drenching night sweats, and sharp pain in the right hypochondrium and lower right hemithorax aggravated by deep inspiration and radiating to the shoulder. Physical exam: pale, subicteric sclerae, pulse 96 bpm. Right costal margin is tender on compression with local skin edema. Percussion reveals elevated right diaphragmatic dullness to the 4th rib. Radiography shows high elevation and immobility of the right hemidiaphragm, reactive right pleural effusion, and a distinct subdiaphragmatic air-fluid level.',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Describe the anatomical boundaries and routes of subphrenic abscess formation.' },
      { num: 3, text: 'What are the classic radiological signs of a subdiaphragmatic abscess?' },
      { num: 4, text: 'What is the modern minimally invasive gold standard for diagnosis and treatment?' },
      { num: 5, text: 'Describe extraperitoneal versus transperitoneal surgical approaches for open drainage.' }
    ],
    answers: [
      { num: 1, text: 'Postoperative acute right-sided subphrenic (subdiaphragmatic) abscess with reactive right sympathetic pleural effusion.' },
      { num: 2, text: 'Bounded by the diaphragm superiorly and the superior/posterior liver surface inferiorly. Caused by stagnant infected bile/hematoma or ascendant exudate suctioned into the subphrenic recess by negative respiratory excursion pressure.' },
      { num: 3, text: '1) High elevated, immobile hemidiaphragm; 2) Subdiaphragmatic air-fluid collection with a gas crescent; 3) Basal plate-like atelectasis; 4) Reactive sympathetic pleural effusion in the costophrenic angle.' },
      { num: 4, text: 'Contrast-enhanced abdominal CT; definitive treatment of choice is ultrasound- or CT-guided percutaneous pig-tail catheter drainage and continuous suction/lavage.' },
      { num: 5, text: 'Extraperitoneal/extrapleural approaches (Clairmont anterior subcostal extraperitoneal or Melnikov posterior approach through the bed of the resected 12th rib) to avoid contaminating the sterile peritoneal/pleural cavities.' }
    ]
  },
  {
    id: 73,
    number: 3,
    topicId: 'peritonitis',
    topicTitleEn: 'Peritonitis & Abdominal Abscesses',
    crossTopicIds: ['appendicitis'],
    stem: 'A 35-year-old female on postoperative day 7 after laparoscopic appendectomy for gangrenous appendicitis presents with fever up to 38.4°C, pelvic heaviness, painful tenesmus with mucus discharge, and frequent dysuria. Physical exam: abdomen is soft and non-tender without peritoneal signs. Digital rectal exam reveals lax sphincter tone, with marked tenderness and a bulging, tense-elastic, fluctuating mass on the anterior rectal wall protruding into the ampulla. Vaginal examination demonstrates extreme tenderness and fullness of the posterior vaginal fornix (classic "Douglas cry").',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'Explain the anatomical and gravitational factors predisposing to Douglas pouch abscess.' },
      { num: 3, text: 'Why are anterior abdominal peritoneal signs absent in isolated pelvic abscess?' },
      { num: 4, text: 'What bedside physical and imaging procedures confirm the diagnosis?' },
      { num: 5, text: 'Describe the surgical technique for transrectal/transvaginal drainage.' }
    ],
    answers: [
      { num: 1, text: 'Postoperative acute pelvic abscess of the rectouterine pouch (pouch of Douglas abscess).' },
      { num: 2, text: 'The pouch of Douglas is the most dependent declivity of the peritoneal cavity, where infected peritoneal fluid, blood, and bacteria naturally gravitate and pool.' },
      { num: 3, text: 'The collection is walled off superiorly by loops of small bowel and omentum, sparing the anterior parietal peritoneum. Inflammation irritates the adjacent bladder and rectum, causing tenesmus and dysuria.' },
      { num: 4, text: 'Digital rectal and pelvic exam, transvaginal/transrectal pelvic ultrasound, and diagnostic needle aspiration yielding purulent exudate.' },
      { num: 5, text: 'In females: posterior colpotomy via the posterior vaginal fornix with soft drain placement; in males: transrectal needle-guided drainage through the anterior rectal wall.' }
    ]
  },
  {
    id: 74,
    number: 4,
    topicId: 'peritonitis',
    topicTitleEn: 'Peritonitis & Abdominal Abscesses',
    stem: 'A 50-year-old male underwent emergency Hartmann\'s procedure, peritoneal lavage, and drainage 48 hours ago for perforated sigmoid diverticulitis with fecal peritonitis. Despite ICU therapy, severe sepsis persists: fever 39.0°C, heart rate 128 bpm, refractory hypotension requiring norepinephrine (0.2 µg/kg/min), persistent gastrointestinal atony (1500 mL/day of foul NG aspirate), and bladder intra-abdominal pressure measuring 22 mmHg (Grade III intra-abdominal hypertension). Drainage tubes yield scant fluid. CT/ultrasound reveals multiple inter-loop fluid collections, extensive fibrin strands, and small bowel distension to 4.5 cm.',
    questions: [
      { num: 1, text: 'Formulate the diagnosis; identify persistent/tertiary peritonitis and abdominal compartment syndrome.' },
      { num: 2, text: 'Define Intra-Abdominal Hypertension (IAH) and Abdominal Compartment Syndrome (ACS).' },
      { num: 3, text: 'What are the strict indications for planned re-laparotomy on demand / by schedule?' },
      { num: 4, text: 'Describe temporary abdominal closure techniques and Negative Pressure Wound Therapy (NPWT / VAC).' },
      { num: 5, text: 'Outline the antibiotic strategy against multidrug-resistant nosocomial pathogens in tertiary peritonitis.' }
    ],
    answers: [
      { num: 1, text: 'Tertiary/persistent diffuse peritonitis, severe abdominal sepsis, septic shock, and Grade III Intra-Abdominal Hypertension (IAH) / Abdominal Compartment Syndrome.' },
      { num: 2, text: 'IAH is sustained intra-abdominal pressure (IAP) ≥12 mmHg; Abdominal Compartment Syndrome (ACS) is sustained IAP >20 mmHg associated with new organ failure (oliguria, elevated peak airway pressures, decreased cardiac output).' },
      { num: 3, text: '1) Inability to achieve complete source control and debridement during index surgery; 2) Questionable bowel viability; 3) Refractory IAH/ACS; 4) Staged Damage Control laparotomy.' },
      { num: 4, text: 'Decompressive relaparotomy, peritoneal debridement, and temporary abdominal closure with an active Negative Pressure Wound Therapy (NPWT / laparostomy VAC system with visceral protective layer).' },
      { num: 5, text: 'Targeted broad-spectrum coverage for nosocomial multidrug-resistant pathogens and fungi: carbapenem (meropenem) + anti-MRSA agent (vancomycin/linezolid) + echinocandin antifungal (caspofungin).' }
    ]
  }
];
