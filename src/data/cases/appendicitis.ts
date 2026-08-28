import { ClinicalCase } from '../../types';

export const appendicitisCases: ClinicalCase[] = [
  {
    id: 1,
    number: 1,
    topicId: 'appendicitis',
    topicTitleEn: 'Acute Appendicitis',
    crossTopicIds: ['peritonitis'],
    stem: 'A 78-year-old female was admitted to the surgical department complaining of lower abdominal pain, nausea, and dry mouth. Onset of illness was 3 days ago; she did not seek medical care initially. On the day of admission, the pain worsened. On examination: moderate condition, pulse 98 bpm, body temperature 38°C. The abdomen is distended, guarded in the lower quadrants, and tender over the pubic region and right iliac fossa; Shchetkin-Blumberg (rebound tenderness) sign is positive. Leukocytes 16.2 x 10⁹/L. Urinalysis shows trace protein and 15-20 leukocytes per high-power field.',
    questions: [
      { num: 1, text: 'What is the patient\'s underlying diagnosis?' },
      { num: 2, text: 'What complication has likely developed?' },
      { num: 3, text: 'What additional diagnostic tests are needed to clarify the diagnosis and guide management?' },
      { num: 4, text: 'What treatment is indicated?' },
      { num: 5, text: 'Is preoperative preparation required?' },
      { num: 6, text: 'What type of anesthesia is indicated for surgical treatment?' },
      { num: 7, text: 'Which forms of acute appendicitis are classified as destructive?' },
      { num: 8, text: 'What complications are possible in the postoperative period?' }
    ],
    answers: [
      { num: 1, text: 'Acute appendicitis.' },
      { num: 2, text: 'Diffuse purulent peritonitis.' },
      { num: 3, text: 'CBC (complete blood count), urinalysis, abdominal/pelvic ultrasound, plain abdominal X-ray, and diagnostic laparoscopy if indicated.' },
      { num: 4, text: 'Emergency surgery: appendectomy, thorough peritoneal lavage/debridement, and abdominal drainage. Comprehensive peritonitis management including targeted IV antibiotics, hemodynamic stabilization, and bowel decompression if needed.' },
      { num: 5, text: 'Yes, emergency preoperative preparation: NPO status, nasogastric gastric decompression, IV access with fluid resuscitation, and surgical site prep.' },
      { num: 6, text: 'General endotracheal anesthesia.' },
      { num: 7, text: 'Phlegmonous, apostematous, phlegmonous-ulcerative, gangrenous, and perforated.' },
      { num: 8, text: 'Wound infection/dehiscence, intra-abdominal or pelvic abscess (Douglas pouch abscess), fecal fistula from stump leakage, pylephlebitis (portal vein septic thrombophlebitis), early adhesive obstruction, and thromboembolism.' }
    ]
  },
  {
    id: 2,
    number: 2,
    topicId: 'appendicitis',
    topicTitleEn: 'Acute Appendicitis',
    stem: 'Patient K., 57 years old, was admitted to the surgical department complaining of right iliac fossa pain. Onset was 3 days ago with initial epigastric pain and mild nausea, which subsequently migrated to the right lower quadrant (Kocher-Volkovich sign). She had one episode of loose stool. On examination: general condition satisfactory, body temperature 37.0°C. In the right iliac region, a firm, non-mobile, moderately tender mass ~5 cm in diameter is palpable. The rest of the abdomen is soft, non-tender, non-distended, with normal bowel sounds.',
    questions: [
      { num: 1, text: 'What is the most likely presumptive diagnosis?' },
      { num: 2, text: 'What is the pathogenesis of the palpable mass?' },
      { num: 3, text: 'What diagnostic investigations should be performed?' },
      { num: 4, text: 'What initial management should be prescribed?' },
      { num: 5, text: 'What possible clinical courses can occur, and what signs indicate urgent surgery?' },
      { num: 6, text: 'What conditions require differential diagnosis?' },
      { num: 7, text: 'What is the strategy after complete resolution of the infiltrate?' },
      { num: 8, text: 'What is the operative approach if an appendicular infiltrate is discovered intraoperatively?' }
    ],
    answers: [
      { num: 1, text: 'Appendicular infiltrate (appendiceal mass/phlegmon).' },
      { num: 2, text: 'Obstruction and destructive inflammation of the appendix walled off by adjacent structures (greater omentum, cecum, and loops of terminal ileum) with fibrinous exudate, walling off infection from the general peritoneal cavity.' },
      { num: 3, text: 'CBC, CRP, urinalysis, abdominal/pelvic ultrasound, colonoscopy or CT scan once acute inflammation subsides.' },
      { num: 4, text: 'Conservative management: bed rest, bland diet, broad-spectrum IV antibiotics, analgesics/antispasmodics, and physical therapy in the resolving phase. Avoid appendectomy during dense infiltration.' },
      { num: 5, text: 'Two outcomes: resolution (resorption) or abscess formation (suppuration). Indications for emergency surgery (drainage): worsening localized pain, fluctuating mass, spiking/hectic fever with chills, and worsening leukocytosis.' },
      { num: 6, text: 'Cecal carcinoma, Crohn\'s disease, ileocecal actinomycosis/tuberculosis, right ovarian torsion or tumor.' },
      { num: 7, text: 'Interval elective appendectomy performed 2-3 months after complete clinical and sonographic resolution of the infiltrate.' },
      { num: 8, text: 'If a dense uninflamed mass is discovered intraoperatively, do NOT attempt radical dissection of the appendix (risk of cecal/ileal perforation). Place a soft drain adjacent to the mass, close the wound, and treat with antibiotics.' }
    ]
  },
  {
    id: 3,
    number: 3,
    topicId: 'appendicitis',
    topicTitleEn: 'Acute Appendicitis',
    crossTopicIds: ['peritonitis'],
    stem: 'Patient I., 38 years old, underwent appendectomy for gangrenous appendicitis. On postoperative day 6, his temperature spiked to 38.0°C, and he developed dysuria/cramps on urination, painful rectal tenesmus, and frequent urges to defecate. The abdomen is soft, mildly tender suprapubically. The surgical incision shows no signs of infection or infiltrate. Repeat blood test: Hb 108 g/L, leukocytes 18 x 10⁹/L, band neutrophils 11%, segmented 68%, lymphocytes 12%, ESR 36 mm/h.',
    questions: [
      { num: 1, text: 'What postoperative complication should be suspected?' },
      { num: 2, text: 'What specific diagnostic examinations must be performed?' },
      { num: 3, text: 'What is the pathogenesis of this complication and the mechanism of rectal and urinary symptoms?' },
      { num: 4, text: 'What is the treatment plan?' },
      { num: 5, text: 'What are the characteristic clinical features of gangrenous appendicitis?' },
      { num: 6, text: 'Describe the pathogenesis of gangrenous appendicitis.' },
      { num: 7, text: 'What is the mortality rate and its main causes in acute appendicitis?' }
    ],
    answers: [
      { num: 1, text: 'Pelvic abscess (Douglas pouch abscess).' },
      { num: 2, text: 'Digital rectal examination (DRE showing tender, boggy/fluctuant anterior rectal wall bulging), transrectal/pelvic ultrasound, and pelvic CT if needed.' },
      { num: 3, text: 'Gravitation and pooling of infected peritoneal fluid into the dependent pelvic basin (pouch of Douglas) following appendiceal gangrene. The inflammatory mass directly irritates the bladder dome and anterior rectal wall plexus, inducing tenesmus, mucus diarrhea, and dysuria.' },
      { num: 4, text: 'Transrectal drainage through the anterior rectal wall (in men) or posterior colpotomy (in women) under anesthesia, guided by ultrasound, plus systemic broad-spectrum antibiotics and fluid resuscitation.' },
      { num: 5, text: 'Deceptive relief of acute pain due to necrosis of intramural nerve endings, contrasted by escalating systemic toxicity: high fever, marked tachycardia, dry tongue, and severe leukocytosis with left shift.' },
      { num: 6, text: 'Primary luminal obstruction followed by microbial proliferation, microvascular thrombosis of the appendicular artery, transmural ischemic necrosis, and anaerobic tissue breakdown.' },
      { num: 7, text: 'Overall mortality is 0.1–0.3%, rising up to 3–5% with peritonitis and higher in elderly patients. Chief causes are delayed diagnosis, septic shock, diffuse peritonitis, and pylephlebitis.' }
    ]
  },
  {
    id: 4,
    number: 4,
    topicId: 'appendicitis',
    topicTitleEn: 'Acute Appendicitis',
    crossTopicIds: ['biliary'],
    stem: 'Patient B., 60 years old, presents with right-sided abdominal pain that began abruptly 4 hours before admission. She has a known history of gallstone disease (cholelithiasis). She took drotaverine (No-shpa) and metamizole (Analgin) without relief. On examination: satisfactory condition, body temperature 37.6°C, pulse 92 bpm. Tongue dry, coated with white fur. The abdomen is symmetrical, the right side lags during respiration. Palpation reveals tenderness greatest in the right iliac fossa. Sitkovsky sign is positive; Rovsing and Voskresensky signs are not detected. Shchetkin-Blumberg sign is weakly positive in the right iliac fossa.',
    questions: [
      { num: 1, text: 'What is the most likely presumptive diagnosis?' },
      { num: 2, text: 'What differential diagnoses must be considered?' },
      { num: 3, text: 'What additional clinical signs should be elicited?' },
      { num: 4, text: 'What diagnostic investigations should be ordered?' },
      { num: 5, text: 'What should be the surgeon\'s strategy if the diagnosis remains uncertain?' },
      { num: 6, text: 'What are the clinical peculiarities of acute appendicitis in elderly patients?' },
      { num: 7, text: 'What intraoperative findings must be differentiated from acute appendicitis?' },
      { num: 8, text: 'What postoperative complications may arise?' }
    ],
    answers: [
      { num: 1, text: 'Acute appendicitis (with atypical or subhepatic location, or mimicking acute cholecystitis).' },
      { num: 2, text: 'Acute cholecystitis, right renal colic/pyelonephritis, perforated duodenal ulcer, right adnexitis/ovarian cyst, and Meckel\'s diverticulitis.' },
      { num: 3, text: 'Obraztsov (psoas sign), Bartomier-Michelson, Razdolsky (percussion tenderness), Kushnirenko (cough sign), as well as Murphy and Ortner signs to evaluate the gallbladder.' },
      { num: 4, text: 'CBC, urinalysis, abdominal/pelvic ultrasound (liver, gallbladder, right kidney, right lower quadrant), plain abdominal radiograph, and diagnostic laparoscopy.' },
      { num: 5, text: 'Diagnostic video laparoscopy is the method of choice. If unavailable, active inpatient surgical observation for no more than 2–4 hours with serial exams and repeat CBC.' },
      { num: 6, text: 'Atypical muted presentation: mild pain, diminished abdominal wall guarding, minimal fever despite advanced gangrene/perforation due to atherosclerotic sclerosis of appendicular vessels.' },
      { num: 7, text: 'Meckel\'s diverticulitis, acute mesenteric lymphadenitis, Crohn\'s terminal ileitis, perforated cecal tumor, ovarian apoplexy or pelvic inflammatory disease.' },
      { num: 8, text: 'Surgical site infection, intra-abdominal phlegmon/abscess, postoperative bleeding, localized/diffuse peritonitis, pylephlebitis, and DVT/PE.' }
    ]
  },
  {
    id: 5,
    number: 5,
    topicId: 'appendicitis',
    topicTitleEn: 'Acute Appendicitis',
    stem: 'Patient A., 21 years old, presented to the emergency department complaining of right iliac fossa pain. The illness started 18 hours ago with epigastric pain that migrated to the right lower quadrant after 3 hours (classic Kocher-Volkovich sign). He experienced nausea and a single episode of vomiting. General condition satisfactory, pulse 84 bpm. Tongue dry, not coated. The abdomen is tender and guarded in the right iliac region. Sitkovsky sign is positive.',
    questions: [
      { num: 1, text: 'What is the primary diagnosis?' },
      { num: 2, text: 'What additional specific appendiceal signs should be checked?' },
      { num: 3, text: 'What additional laboratory and imaging studies should be ordered?' },
      { num: 4, text: 'What is the surgical strategy?' },
      { num: 5, text: 'Which operation is indicated? Describe anesthesia, surgical access, and technique.' },
      { num: 6, text: 'What must be examined intraoperatively if the appendix is found to be normal?' },
      { num: 7, text: 'What are the indications for abdominal drainage after appendectomy?' },
      { num: 8, text: 'What postoperative complications can occur?' },
      { num: 9, text: 'When can the patient return to work?' }
    ],
    answers: [
      { num: 1, text: 'Acute appendicitis (classic form).' },
      { num: 2, text: 'Rovsing, Voskresensky (shirt sign), Bartomier-Michelson, Obraztsov (psoas), Razdolsky, and Shchetkin-Blumberg signs.' },
      { num: 3, text: 'CBC, urinalysis, pelvic/abdominal ultrasound, diagnostic laparoscopy.' },
      { num: 4, text: 'Emergency hospitalization, brief preoperative prep, and urgent appendectomy (laparoscopic or open).' },
      { num: 5, text: 'Laparoscopic or open appendectomy via McBurney/Volkovich-Dyakonov incision. General or spinal anesthesia. Cecal exteriorization, mesoappendix ligation, base ligation with purse-string and Z-suture stump invagination, and layer-by-layer abdominal closure.' },
      { num: 6, text: 'Inspect the distal 100 cm of ileum for Meckel\'s diverticulum and Crohn\'s disease, mesenteric lymph nodes (mesadenitis), pelvic organs, and gallbladder/duodenum.' },
      { num: 7, text: '1) Incomplete debridement of infected foci; 2) Insecure hemostasis/capillary oozing; 3) Drainage of a periappendiceal abscess; 4) Cecal wall infiltration with questionable suture security; 5) Diffuse peritonitis.' },
      { num: 8, text: 'Wound infection, pelvic/subphrenic abscess, intra-abdominal bleeding, fecal fistula, adhesive ileus.' },
      { num: 9, text: 'Discharge on days 3–4 (uncomplicated); return to non-physical work in 10–14 days, heavy physical exertion after 4–6 weeks.' }
    ]
  }
];
