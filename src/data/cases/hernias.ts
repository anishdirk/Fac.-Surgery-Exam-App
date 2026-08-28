import { ClinicalCase } from '../../types';

export const herniasCases: ClinicalCase[] = [
  {
    id: 35,
    number: 1,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    stem: 'A 26-year-old male loader presented to the outpatient surgical clinic complaining of a right groin bulge that appears when lifting heavy weights, associated with mild aching discomfort. On examination in the standing position with Valsalva maneuver, an oval-shaped swelling measuring 6x4x4 cm emerges in the right inguinal region, tracking downward and medially toward the scrotum. Percussion over the mass yields a tympanitic note. In the supine position, the mass reduces spontaneously.',
    questions: [
      { num: 1, text: 'State and justify the preliminary diagnosis.' },
      { num: 2, text: 'What vital medical history and clinical exam data are missing?' },
      { num: 3, text: 'What local physical and bedside examination must be performed?' },
      { num: 4, text: 'What preoperative workup is required for elective repair?' },
      { num: 5, text: 'What conditions require differential diagnosis?' },
      { num: 6, text: 'What treatment should be recommended?' },
      { num: 7, text: 'Describe the surgical stages and hernia repair technique.' },
      { num: 8, text: 'What local postoperative complications may occur?' },
      { num: 9, text: 'What are the convalescence guidelines and restrictions?' }
    ],
    answers: [
      { num: 1, text: 'Right-sided complete reducible uncomplicated indirect (oblique) inguinoscrotal hernia.' },
      { num: 2, text: 'History of intra-abdominal pressure factors (chronic cough, constipation, dysuria), family history, duration of hernia, and bilateral inguinal exam.' },
      { num: 3, text: 'Invagination of scrotal skin to palpate the superficial inguinal ring (cough impulse test), palpation of the spermatic cord and testicle, transillumination (diaphanoscopy), and scrotal ultrasound.' },
      { num: 4, text: 'Routine preoperative panel: CBC, urinalysis, coagulogram, blood type/Rh, ECG, chest X-ray, and infectious serology.' },
      { num: 5, text: 'Direct inguinal hernia, femoral hernia, hydrocele, varicocele, spermatic cord cyst, and inguinal lymphadenopathy.' },
      { num: 6, text: 'Elective surgical hernia repair (hernioplasty) is indicated to eliminate the risk of life-threatening strangulation.' },
      { num: 7, text: 'Inguinal incision, division of the external oblique aponeurosis, dissection of the indirect sac from cord structures, high ligation and excision of the sac, followed by anterior wall repair or Lichtenstein tension-free mesh hernioplasty.' },
      { num: 8, text: 'Scrotal hematoma/seroma, surgical site infection, ischemic orchitis, spermatic cord or ilioinguinal nerve injury.' },
      { num: 9, text: 'Suture removal at day 7; return to sedentary work in 2–3 weeks; restriction of heavy lifting and physical labor for 3–6 months.' }
    ]
  },
  {
    id: 36,
    number: 2,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    stem: 'A 21-year-old university student athlete noticed a right groin bulge during athletics accompanied by mild aching. The bulge reduces once exercise ceases. Symptoms began 2 months ago; his father and elder brother previously underwent inguinal hernia surgery. Examination in the standing position with straining reveals a 3x5 cm soft mass descending into the right scrotum with a gurgling sound. In supine position, it reduces completely. The superficial inguinal ring measures 2.5 cm on the right and 2.0 cm on the left; cough impulse is positive bilaterally. Scrotal transillumination (diaphanoscopy) is negative.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis and classification.' },
      { num: 2, text: 'What predisposing and precipitating factors are present?' },
      { num: 3, text: 'What treatment should be recommended?' },
      { num: 4, text: 'If the testicle lies directly inside the hernial sac, what anatomical entity is this?' },
      { num: 5, text: 'How does surgical technique differ between congenital and acquired indirect hernia?' },
      { num: 6, text: 'What method of inguinal canal hernioplasty is indicated?' },
      { num: 7, text: 'When may the patient resume sports training and heavy exertion?' }
    ],
    answers: [
      { num: 1, text: 'Right-sided reducible indirect inguinoscrotal hernia. Left-sided early/incipient reducible indirect inguinal hernia.' },
      { num: 2, text: 'Predisposing: hereditary connective tissue weakness (familial history), patent processus vaginalis. Precipitating: increased intra-abdominal pressure during intense athletic sports.' },
      { num: 3, text: 'Elective bilateral hernioplasty (preferably laparoscopic TAPP/TEP repair or staged open hernioplasty).' },
      { num: 4, text: 'Congenital indirect inguinal hernia (where the patent processus vaginalis serves as the hernial sac surrounding the testis).' },
      { num: 5, text: 'In congenital hernia, the proximal sac is ligated at the internal ring while the distal portion is split/everted around the testis (Winkelmann principle) to prevent hydrocele; in acquired hernia, the entire sac is dissected free and excised.' },
      { num: 6, text: 'Anterior wall hernioplasty (Girard-Spasokukotsky with Kimbarovsky suture / Martynov) or laparoscopic preperitoneal mesh repair (TEP/TAPP).' },
      { num: 7, text: 'Light non-impact exercises in 4–6 weeks; full return to competitive sports and heavy lifting in 3–6 months.' }
    ]
  },
  {
    id: 37,
    number: 3,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    crossTopicIds: ['gastric_cancer'],
    stem: 'A 52-year-old female presented with an umbilical bulge and new-onset dull epigastric pain that worsens after meals and improves with analgesics. Over the past 4 months, she lost 2 kg. The umbilical hernia was diagnosed 20 years ago; she previously declined surgery but now demands it. Physical exam: moderate obesity, BP 150/100 mmHg, mild tenderness on deep epigastric palpation. Umbilical mass measures 4x4 cm, soft, lobulated (omental content); it increases on Valsalva and is partially irreducible. Hernial orifice is 2.5 cm; cough impulse is positive. Blood: Hb 102 g/L, ESR 24 mm/h.',
    questions: [
      { num: 1, text: 'State and justify the clinical diagnosis. What warning signs and comorbidities are present?' },
      { num: 2, text: 'Should further diagnostic investigation be performed before hernia repair?' },
      { num: 3, text: 'What constitutes the hernial contents? What other viscera may herniate?' },
      { num: 4, text: 'What surgical repairs are performed for umbilical hernia? Type of anesthesia?' },
      { num: 5, text: 'What early postoperative complications can occur?' },
      { num: 6, text: 'What are the main risk factors for recurrence?' }
    ],
    answers: [
      { num: 1, text: 'Partially irreducible uncomplicated umbilical hernia; Grade II hypertension; secondary iron deficiency anemia with high suspicion for upper GI malignancy / gastric cancer.' },
      { num: 2, text: 'Yes, mandatory upper endoscopy (EGD) and abdominal ultrasound to rule out primary gastric malignancy or ulcer disease before addressing the hernia.' },
      { num: 3, text: 'Greater omentum (lobed structure). Other possible contents: loops of small intestine, transverse colon, and rarely the anterior gastric wall.' },
      { num: 4, text: 'Herniorrhaphy with aponeurotic overlap (Mayo transverse duplication or Sapezhko vertical duplication) or preperitoneal prosthetic mesh placement (open/laparoscopic). Local, regional, or general anesthesia.' },
      { num: 5, text: 'Wound hematoma, seroma, surgical site infection, and suture sinus/fistula.' },
      { num: 6, text: 'Severe obesity, thinned linea alba aponeurosis, persistent raised intra-abdominal pressure, wound sepsis, and tissue tension.' }
    ]
  },
  {
    id: 38,
    number: 4,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    crossTopicIds: ['obstruction', 'peritonitis'],
    stem: 'A 68-year-old male was urgently admitted with an incarcerated left inguinal hernia (12-year history). During emergency herniotomy, 2 pink, viable-appearing loops of small bowel were found in the hernial sac, deemed viable, and reduced into the abdominal cavity, followed by Girard-Spasokukotsky canal repair. On postoperative day 2, the patient developed acute signs of diffuse purulent peritonitis and paralytic ileus.',
    questions: [
      { num: 1, text: 'What was the surgical error and specific type of strangulation leading to peritonitis?' },
      { num: 2, text: 'List the clinical and morphological types of hernia strangulation.' },
      { num: 3, text: 'How does emergency strangulated hernia surgery differ from elective repair?' },
      { num: 4, text: 'How is bowel viability assessed, and what is the resection rule for non-viable intestine?' },
      { num: 5, text: 'What is the immediate treatment strategy for this patient now?' },
      { num: 6, text: 'What is the patient\'s prognosis?' }
    ],
    answers: [
      { num: 1, text: 'Retrograde strangulation (Maydl\'s hernia / W-shaped strangulation). Two viable loops were in the hernial sac, but the intermediate connecting loop remained inside the abdominal cavity, suffered ischemic gangrene, and perforated following reduction.' },
      { num: 2, text: 'Elastic (tight ring), fecal, retrograde (Maydl hernia), Richter (parietal/mural strangulation), and Littre hernia (Meckel diverticulum strangulation).' },
      { num: 3, text: 'In strangulated hernia, the sac must be opened and the entrapped organs securely held/fixed BEFORE the constricting ring is divided, preventing inadvertent reduction of non-viable bowel.' },
      { num: 4, text: 'Viability criteria: pink-red color, glistening serosa, active visible peristalsis, and palpable mesenteric arterial pulsations. In doubtful cases, warm saline soaks for 10–15 min. For necrosis: resection of non-viable bowel extending 30–40 cm proximally and 15–20 cm distally into healthy gut.' },
      { num: 5, text: 'Emergency exploratory midline relaparotomy, peritoneal lavage, resection of the gangrenous/perforated bowel loop with anastomosis, abdominal drainage, and ICU sepsis management.' },
      { num: 6, text: 'Guarded/serious due to delayed recognized peritonitis and advanced age.' }
    ]
  },
  {
    id: 39,
    number: 5,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    stem: 'A 76-year-old male presented with bilateral painless, rounded suprapubic groin swellings that appear upon standing or walking and have enlarged over the past year. He has hypertension and a history of myocardial infarction 3 years ago. He reports urinary hesitancy, a weak stream, straining on urination, and nocturia 3–4 times per night. Physical exam: BP 160/100 mmHg, pulse 78 bpm. On standing/Valsalva, hemispherical soft bulges protrude above the pubic crest bilaterally (right 6x8 cm, left 4x6 cm), which reduce effortlessly straight backward into the pelvis. External rings admit the examining finger directly posterior through a weakened transversalis fascia.',
    questions: [
      { num: 1, text: 'Formulate the complete primary diagnosis.' },
      { num: 2, text: 'What underlying urological condition provoked the hernia, and how should it be evaluated?' },
      { num: 3, text: 'What preoperative workup is required?' },
      { num: 4, text: 'What are the major medical contraindications to elective hernia repair?' },
      { num: 5, text: 'What is the correct treatment sequence for this patient?' },
      { num: 6, text: 'What surgical methods are used to repair direct inguinal hernias?' }
    ],
    answers: [
      { num: 1, text: 'Bilateral direct complete reducible uncomplicated inguinal hernias; Benign Prostatic Hyperplasia (BPH) with lower urinary tract obstruction.' },
      { num: 2, text: 'Benign Prostatic Hyperplasia causing chronic straining on micturition. Confirm via digital rectal exam of the prostate, transrectal/pelvic ultrasound with post-void residual volume, and serum PSA.' },
      { num: 3, text: 'Cardiology evaluation (ECHO, stress evaluation), urology consult, serum creatinine/BUN, coagulation profile, and routine pre-op labs.' },
      { num: 4, text: 'Recent myocardial infarction (<6 months), decompensated congestive heart failure, severe pulmonary insufficiency, and uncorrected coagulopathy.' },
      { num: 5, text: 'Two-stage strategy: Stage 1 — relieve urinary obstruction (TURP or alpha-blockers/5-ARI medical therapy) to eliminate chronic straining; Stage 2 — elective tension-free mesh hernioplasty (Lichtenstein / TEP).' },
      { num: 6, text: 'Posterior inguinal floor reconstruction: Lichtenstein tension-free mesh repair (gold standard) or tissue repairs (Bassini, Kukudzhanov, Shouldice).' }
    ]
  },
  {
    id: 40,
    number: 6,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    stem: 'A 65-year-old female was brought by ambulance with painful swelling in the right groin that became irreducible 8 hours ago, accompanied by nausea and vomiting. She had a known groin hernia for 5 years, previously untreated due to comorbidities (T2DM, hypertension, CAD). Physical exam: severe obesity (96 kg, 164 cm), BP 180/100 mmHg, pulse 78 bpm. Below the right inguinal ligament (in the femoral canal/fossa ovalis), a 6x7 cm tense, tender, irreducible mass is palpated; cough impulse is negative. Peritoneal signs are absent.',
    questions: [
      { num: 1, text: 'Formulate the diagnosis and state the clinical signs of strangulation.' },
      { num: 2, text: 'List the known complications of abdominal wall hernias.' },
      { num: 3, text: 'What urgent preoperative tests are required?' },
      { num: 4, text: 'What is the treatment and timing?' },
      { num: 5, text: 'What are the intraoperative criteria for bowel viability?' },
      { num: 6, text: 'What is the operative procedure for gangrenous strangulated bowel?' },
      { num: 7, text: 'What conditions require differential diagnosis?' },
      { num: 8, text: 'What methods of femoral hernia repair are used?' },
      { num: 9, text: 'Was it correct to deny elective surgery based on chronic comorbidities?' }
    ],
    answers: [
      { num: 1, text: 'Right-sided strangulated (incarcerated) femoral hernia. Signs of strangulation: sudden irreducibility, tense tender mass, negative cough impulse, nausea, and vomiting.' },
      { num: 2, text: 'Strangulation, incarceration/irreducibility, inflammation (herniitis), fecal stasis (coprostasis), and traumatic rupture.' },
      { num: 3, text: 'Emergency labs: CBC, blood glucose, electrolytes, coagulation, blood typing, ECG, and plain abdominal radiograph.' },
      { num: 4, text: 'Emergency surgery within 1–2 hours of admission following rapid cardiopulmonary optimization.' },
      { num: 5, text: 'Pink serosal color restoration, active visible peristalsis, and clear palpable arterial pulsations in the adjacent mesenteric arcades.' },
      { num: 6, text: 'Laparotomy and bowel resection of the gangrenous segment plus 30–40 cm proximal and 15–20 cm distal margin, with primary anastomosis.' },
      { num: 7, text: 'Strangulated inguinal hernia, acute femoral lymphadenitis, saphena varix thrombosis, femoral artery aneurysm, and psoas cold abscess.' },
      { num: 8, text: 'Bassini subinguinal approach, Ruggi-Parlavecchio inguinal approach (suturing conjoint tendon and Cooper\'s ligament), or prosthetic mesh plug repair.' },
      { num: 9, text: 'No, incorrect. Femoral hernias have narrow, unyielding lacunar ligament borders with high strangulation risk (~35%); elective repair under local/regional anesthesia should always be performed.' }
    ]
  },
  {
    id: 41,
    number: 7,
    topicId: 'hernias',
    topicTitleEn: 'Abdominal & Inguinal Hernias',
    crossTopicIds: ['obstruction', 'peritonitis'],
    stem: 'An 82-year-old female experienced sudden epigastric discomfort and vomiting. A home-visiting internist suspected gastric malignancy and prescribed antiemetics. Over the next 2 days, abdominal distension, loud bowel sounds, and recurrent vomiting developed. By day 3, she had intractable feculent vomiting and hiccups. An emergency doctor palpated a tense, tender, irreducible 4x3 cm mass below the left Poupart (inguinal) ligament; the abdomen was markedly distended with tympany and a positive succussion splash. She was rushed to the surgical hospital.',
    questions: [
      { num: 1, text: 'State and justify the emergency diagnosis.' },
      { num: 2, text: 'What investigations are urgently needed?' },
      { num: 3, text: 'What conditions require differential diagnosis?' },
      { num: 4, text: 'What is the immediate surgical strategy?' },
      { num: 5, text: 'What is the operative procedure if a 15 cm gangrenous ileal segment is found?' },
      { num: 6, text: 'What critical diagnostic mistake was made by the primary physician?' },
      { num: 7, text: 'Explain the reflex viscero-visceral mechanism causing initial epigastric pain.' },
      { num: 8, text: 'Describe postoperative intensive care and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Strangulated left femoral hernia complicated by late acute mechanical/strangulated small bowel obstruction and severe toxemia.' },
      { num: 2, text: 'Emergency plain abdominal X-ray (Kloiber fluid levels), blood gas/lactate, CBC, comprehensive metabolic panel, and ECG.' },
      { num: 3, text: 'Acute lymphadenitis of Cloquet\'s node, saphenous varix thrombosis, psoas abscess, and soft tissue tumor.' },
      { num: 4, text: 'Immediate surgical exploration via laparotomy/inguinal approach following brief fluid stabilization and NG decompression.' },
      { num: 5, text: 'Midline laparotomy, segmental resection of the 15 cm necrotic ileum with wide healthy margins (30–40 cm proximal, 15–20 cm distal), primary enteroenterostomy, and femoral canal repair.' },
      { num: 6, text: 'Failure to perform mandatory inspection and palpation of all abdominal hernia orifices (especially femoral and inguinal regions) in an elderly patient with acute vomiting.' },
      { num: 7, text: 'Mesenteric strangulation stimulates rich visceral autonomic plexus fibers, projecting reflex viscero-visceral epigastric pain and reflex vomiting via the celiac plexus.' },
      { num: 8, text: 'ICU monitoring: multi-antibiotic sepsis therapy, cardiopulmonary support, DVT prophylaxis, and bowel stimulation. Prognosis is guarded due to advanced age and 72-hour diagnostic delay.' }
    ]
  }
];
