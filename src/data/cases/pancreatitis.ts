import { ClinicalCase } from '../../types';

export const pancreatitisCases: ClinicalCase[] = [
  {
    id: 6,
    number: 1,
    topicId: 'pancreatitis',
    topicTitleEn: 'Acute Pancreatitis & Necrosis',
    stem: 'A 46-year-old male was admitted to the surgical ward 6 hours after acute onset of severe epigastric and right hypochondriac pain, accompanied by intractable vomiting that brought no relief. On admission: moderate condition, conscious, agitated by severe pain. Skin normal color and moisture. Heart sounds clear, regular; pulse 89 bpm, BP 140/90 mmHg. Tongue dry, white-coated. Abdomen uniformly distended, rigid in the epigastrium and sharply tender on palpation; the remainder of the abdomen is soft and mildly tender. Epigastric aortic pulsation is absent (Voskresensky sign); tenderness in the left costovertebral angle is marked (Mayo-Robson sign). Rebound tenderness (Shchetkin-Blumberg) is negative. Hepatic dullness is preserved (Spizharny sign negative). Peristalsis is sluggish, no flatus. Urination is normal. Blood: WBC 9.7 x 10⁹/L (bands 6%, segs 72%), Hb 156 g/L, Hct 0.50 L/L. Urinalysis normal. Urine diastase (amylase) 1024 units.',
    questions: [
      { num: 1, text: 'Formulate a comprehensive diagnosis.' },
      { num: 2, text: 'Which named physical signs are described in the clinical vignette, and what are their interpretations?' },
      { num: 3, text: 'What conditions must be included in the differential diagnosis?' },
      { num: 4, text: 'Characterize the laboratory findings. What are the normal reference ranges for urine diastase?' },
      { num: 5, text: 'What additional diagnostic workup is required?' },
      { num: 6, text: 'Explain the pathogenesis of the pathological changes in this patient.' },
      { num: 7, text: 'Outline the treatment plan. Is surgery indicated, and if so, under what circumstances?' }
    ],
    answers: [
      { num: 1, text: 'Acute edematous (interstitial) pancreatitis.' },
      { num: 2, text: 'Positive signs: Körte sign (transverse muscular rigidity and tenderness across epigastrium), Voskresensky sign (absence of transmitted abdominal aortic pulsation due to swollen pancreas), Mayo-Robson sign (tenderness at left costovertebral angle). Negative signs: Shchetkin-Blumberg (no peritonitis) and Spizharny (preserved liver dullness — rules out hollow viscus perforation).' },
      { num: 3, text: 'Acute cholecystitis, perforated gastroduodenal ulcer, acute appendicitis, bowel obstruction, acute myocardial infarction, and mesenteric ischemia.' },
      { num: 4, text: 'Mild leukocytosis with shift to the left, hemoconcentration due to third-space dehydration (Hct 0.50), and massive hyperenzymemia/hyperfermenturia (urine diastase 1024 U vs normal 16–64 U).' },
      { num: 5, text: 'Serum biochemistry (amylase, lipase, bilirubin, AST, ALT, creatinine, glucose, electrolytes, calcium), abdominal ultrasound, ECG, plain abdominal X-ray, EGD, and contrast-enhanced abdominal CT.' },
      { num: 6, text: 'Intraductal hypertension and premature intracellular activation of zymogens leading to enzymatic autodigestion, release of vasoactive kinins, marked interstitial edema, microcirculatory stasis (sludging), and tissue acidosis.' },
      { num: 7, text: 'Conservative regimen: "gut rest" (NPO), gastric decompression, local epigastric hypothermia (ice pack), IV fluid resuscitation with forced diuresis, somatostatin/octreotide, PPIs, and antispasmodics. Surgery (laparoscopic drainage/necrosectomy) is reserved for failed medical therapy, developing peritonitis, or infected necrosis.' }
    ]
  },
  {
    id: 7,
    number: 2,
    topicId: 'pancreatitis',
    topicTitleEn: 'Acute Pancreatitis & Necrosis',
    crossTopicIds: ['peritonitis'],
    stem: 'A 51-year-old male with chronic alcohol abuse developed sudden agonizing, belt-like epigastric pain radiating to the back, and intractable vomiting without relief. Initial temperature was normal, abdomen soft with mild epigastric tenderness, no peritoneal signs. Urine diastase was 2048 U. Conservative measures (paranephric block, antibiotics, antispasmodics, IV infusion) yielded no improvement. On the following day, his condition deteriorated severely: pulse rose to 120 bpm, BP plummeted to 70/40 mmHg (pancreatogenic shock). Generalized peritoneal signs emerged. Blood WBC 15.3 x 10⁹/L. Urine diastase dropped paradoxically to 8 U. Blood glucose spiked to 15 mmol/L.',
    questions: [
      { num: 1, text: 'What is the full diagnosis?' },
      { num: 2, text: 'How should the progression of the disease and laboratory changes be interpreted?' },
      { num: 3, text: 'Was the initial conservative therapy adequate, and what was missing?' },
      { num: 4, text: 'What conditions should be considered in the differential diagnosis?' },
      { num: 5, text: 'What systemic and local complications are anticipated?' },
      { num: 6, text: 'What imaging and diagnostic modalities should be performed?' },
      { num: 7, text: 'What is the subsequent management strategy?' }
    ],
    answers: [
      { num: 1, text: 'Acute destructive pancreatitis (pancreatic necrosis). Pancreatogenic shock (Grade 3). Enzymatic peritonitis.' },
      { num: 2, text: 'Rapid progression from edema to extensive pancreatic necrosis. The paradoxical collapse of urine diastase (from 2048 down to 8 U) signifies massive death of enzyme-producing acinar tissue, while severe hyperglycemia (15 mmol/L) indicates widespread necrosis of the islets of Langerhans in the tail.' },
      { num: 3, text: 'Inadequate. The regimen lacked potent secretory inhibitors (octreotide/somatostatin, 5-FU), protease inhibitors (aprotinin), massive plasma-expanding shock resuscitation guided by CVP, and parenteral antisecretory agents.' },
      { num: 4, text: 'Acute gangrenous cholecystitis, perforated peptic ulcer, acute myocardial infarction, acute mesenteric ischemia/thrombosis, and dissecting aortic aneurysm.' },
      { num: 5, text: 'Multiple organ dysfunction syndrome (MODS), acute renal failure, retroperitoneal phlegmon, pancreatic abscess, arrosive vascular hemorrhage, and sepsis.' },
      { num: 6, text: 'Contrast-enhanced abdominal CT (gold standard for necrotizing pancreatitis), abdominal ultrasound, serial ABGs, coagulogram, and diagnostic laparoscopy.' },
      { num: 7, text: 'Immediate ICU admission for aggressive anti-shock resuscitation. If no improvement within 12–24 hours, perform laparoscopic drainage of the lesser sac and peritoneal cavity with peritoneal lavage to evacuate toxic enzyme-rich fluid.' }
    ]
  },
  {
    id: 8,
    number: 3,
    topicId: 'pancreatitis',
    topicTitleEn: 'Acute Pancreatitis & Necrosis',
    stem: 'A 24-year-old male has experienced dull aching epigastric pain and progressive abdominal distension for 1 year. Palpation reveals a deep, smooth, spherical mass in the epigastrium measuring ~15x20 cm. The mass exhibits transmitted pulsation, but no vascular bruit is heard. Past history is notable for severe blunt abdominal trauma 1 year ago treated non-operatively. General condition is stable, no dyspepsia, bowel and bladder functions normal. Urine diastase is 256 U. CBC and routine biochemistry are normal. Upper GI barium study shows marked anterior displacement of the stomach by a retro-gastric mass.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'Provide a detailed classification of this pathological condition.' },
      { num: 3, text: 'What diseases must be considered in the differential diagnosis?' },
      { num: 4, text: 'What imaging and diagnostic methods are essential for confirmation?' },
      { num: 5, text: 'Explain the pathogenesis of this post-traumatic condition.' },
      { num: 6, text: 'What is the appropriate management and surgical plan?' },
      { num: 7, text: 'What complications may develop?' },
      { num: 8, text: 'Summarize key anatomical and physiological features of the pancreas.' }
    ],
    answers: [
      { num: 1, text: 'Post-traumatic chronic pseudocyst of the pancreas (in the lesser sac).' },
      { num: 2, text: '1) Origin: Congenital (true, epithelialized) vs Acquired (pseudocysts: post-necrotic, post-traumatic, retention, cystadenomas). 2) Course: Acute, subacute, chronic; uncomplicated vs complicated (infection, bleeding, rupture). 3) Location: Head, body, or tail.' },
      { num: 3, text: 'Abdominal aortic aneurysm (excluded by lack of vascular bruit/flow on Doppler), hepatic cyst/tumor, renal tumor/hydronephrosis, mesenteric cyst, and retroperitoneal sarcoma.' },
      { num: 4, text: 'Abdominal ultrasound, contrast-enhanced CT/MRI, EGD with endoscopic ultrasound (EUS), and angiography.' },
      { num: 5, text: 'Blunt trauma caused ductal/parenchymal injury with pancreatic juice leakage into the lesser sac. Enzymatic autodigestion triggered an inflammatory reaction encapsulated over months by a thick fibrous wall devoid of epithelium (pseudocyst).' },
      { num: 6, text: 'Surgical treatment: internal drainage via cystogastrostomy or Roux-en-Y cystojejunostomy (laparoscopic, endoscopic, or open), since the mature capsule is fully formed (>6 weeks).' },
      { num: 7, text: 'Secondary infection (abscess), intracystic arrosive hemorrhage, rupture into peritoneal cavity causing peritonitis, and compression of adjacent duodenum/biliary tract.' },
      { num: 8, text: 'Retroperitoneal organ at L1-L2, weight 50-70 g, length 15-25 cm. Subdivided into head, body, tail. Blood supply: superior/inferior pancreaticoduodenal arteries, splenic artery. Exocrine: 1.5–2 L/day alkaline juice (amylase, lipase, trypsin). Endocrine: insulin (beta), glucagon (alpha), somatostatin (delta).' }
    ]
  },
  {
    id: 9,
    number: 4,
    topicId: 'pancreatitis',
    topicTitleEn: 'Acute Pancreatitis & Necrosis',
    stem: 'A 30-year-old male was admitted with severe weakness, nausea, left hypochondriac and left flank pain radiating to the lumbar spine, and daily hectic fevers of 38.5–39.0°C for the past 2 weeks. One month ago, following heavy alcohol consumption, he was treated for acute pancreatitis and discharged on day 5, but neglected his diet. Physical exam: abdominal asymmetry caused by a large, firm, intensely tender mass filling the entire left hypochondrium down to the left iliac fossa. Left flank tap test is sharply painful, with flank edema/pastiness. Peritoneal signs negative. Urine output decreased. WBC 25.2 x 10⁹/L (bands 25%, segs 53%), ESR 48 mm/h. X-ray: elevated left hemidiaphragm with subdiaphragmatic air-fluid level; 200 mL reactive left pleural effusion. Urinalysis: protein 2.4 g/L, WBC 20-30/HPF, RBC 5-7/HPF. Urine diastase 16 U.',
    questions: [
      { num: 1, text: 'What is the patient\'s diagnosis?' },
      { num: 2, text: 'What primary disease caused this condition?' },
      { num: 3, text: 'Describe the pathogenesis of this suppurative process.' },
      { num: 4, text: 'What complications can be predicted in this patient?' },
      { num: 5, text: 'What differential diagnoses must be considered?' },
      { num: 6, text: 'Interpret the changes in laboratory and imaging findings.' },
      { num: 7, text: 'What additional diagnostic modalities should be utilized?' },
      { num: 8, text: 'What is the treatment strategy?' },
      { num: 9, text: 'State the possible outcomes and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Pancreatic abscess with retroperitoneal phlegmon (infected necrotizing pancreatitis).' },
      { num: 2, text: 'Acute destructive pancreatitis in the sequestration and secondary infection phase.' },
      { num: 3, text: 'Secondary bacterial translocation from the gut colonizing necrotic retroperitoneal and pancreatic tissue, causing extensive retroperitoneal phlegmon and multiple abscess pockets tracking down the left paracolic gutter.' },
      { num: 4, text: 'Arrosive arterial/venous bleeding (splenic vessels), gastrointestinal fistulae, septic shock, splenic vein thrombosis, and acute renal failure.' },
      { num: 5, text: 'Left renal carcinoma/abscess, retroperitoneal sarcoma with necrosis, colon cancer (splenic flexure), splenic abscess, and subphrenic abscess.' },
      { num: 6, text: 'Severe leukocytosis with 25% band shift and ESR 48 mm/h demonstrate purulent septic intoxication. Proteinuria and microhematuria indicate reactive paranephric inflammation. Left pleural effusion and diaphragmatic elevation reflect sympathetic subdiaphragmatic irritation.' },
      { num: 7, text: 'Abdominal/retroperitoneal CT with IV contrast, ultrasound-guided diagnostic fine-needle aspiration, blood cultures, and retroperitoneoscopy.' },
      { num: 8, text: 'Urgent operative debridement: extraperitoneal lumscopic or open lumbotomy, necrosectomy/sequestrectomy, and dual-lumen continuous closed lavage drainage of the retroperitoneum, combined with carbapenem antibiotics and nutritional support.' },
      { num: 9, text: 'Mortality exceeds 30–50% without surgery; modern minimally invasive and surgical drainage reduces mortality to 10–15%. Potential sequelae include pancreatic pseudocysts or external pancreatic fistulae.' }
    ]
  },
  {
    id: 10,
    number: 5,
    topicId: 'pancreatitis',
    topicTitleEn: 'Acute Pancreatitis & Necrosis',
    stem: 'A 49-year-old female experienced sudden severe, belt-like epigastric pain and repeated vomiting following a copious meal of fatty, spicy meat. Temperature remained normal. Palpation revealed moderate epigastric tenderness. Urine diastase was 1024 U. Comprehensive conservative therapy over 24 hours produced substantial clinical improvement: pain subsided markedly, vomiting ceased, abdomen softened, and urine diastase dropped to 256 U. No peritoneal signs developed.',
    questions: [
      { num: 1, text: 'What is the primary diagnosis?' },
      { num: 2, text: 'Provide a clinical classification of acute pancreatitis.' },
      { num: 3, text: 'What are the core components of conservative management for this pathology?' },
      { num: 4, text: 'What underlying biliary/gastric pathologies could provoke this attack?' },
      { num: 5, text: 'What diseases must be differentiated from this condition?' },
      { num: 6, text: 'What additional outpatient/inpatient investigations are required?' },
      { num: 7, text: 'What is the further management strategy?' },
      { num: 8, text: 'What dietary recommendations should be given upon hospital discharge?' }
    ],
    answers: [
      { num: 1, text: 'Acute edematous (interstitial) pancreatitis, resolving phase.' },
      { num: 2, text: '1) Etiology: alimentary/alcoholic, biliary, traumatic, postoperative, idiopathic. 2) Morphological forms: edematous (interstitial) vs necrotizing (sterile vs infected; fat, hemorrhagic, or mixed necrosis). 3) Severity (Atlanta): mild, moderately severe, severe.' },
      { num: 3, text: 'Classic triad of "cold, starvation, rest", IV crystalloid hydration, antispasmodics, gastric antisecretory agents (PPIs), and somatostatin analogues (octreotide).' },
      { num: 4, text: 'Gallstone disease (microlithiasis, sphincter of Oddi dysfunction/stenosis), duodenal peptic ulcer with penetration, and chronic duodenostasis.' },
      { num: 5, text: 'Peptic ulcer, acute cholecystitis, appendicitis, acute gastritis, inferior myocardial infarction, and thoracic radiculopathy.' },
      { num: 6, text: 'Biliary/pancreatic ultrasound to screen for occult gallstones or CBD dilation, EGD to inspect the major duodenal papilla, and liver/lipid panel.' },
      { num: 7, text: 'Complete conservative course until full biochemical normalization, followed by elective outpatient workup for biliary pathology.' },
      { num: 8, text: 'Strict dietary adherence (Pevzner Diet 5p): small frequent meals, complete avoidance of alcohol, fried/fatty/spicy foods, and pancreatic enzyme replacement therapy (pancreatin/Creon) with meals.' }
    ]
  },
  {
    id: 11,
    number: 6,
    topicId: 'pancreatitis',
    topicTitleEn: 'Acute Pancreatitis & Necrosis',
    crossTopicIds: ['peritonitis'],
    stem: 'Patient M., 48 years old, was urgently admitted with severe weakness, unremitting belt-like epigastric pain radiating to the left scapula and neck, and persistent bilious vomiting. Onset was 18 hours ago after heavy alcohol intake. Pain has now generalized across the entire abdomen; flatus has ceased. History includes duodenal ulcer and CAD (stable angina). On admission: grave condition, lethargic, hypothermic at 35.8°C. Pale skin, acrocyanosis, cold clammy sweat; periumbilical and buttock petechial rash (Cullen/Turner signs). Subicteric sclera. RR 24/min. Pulse 120 bpm, thready. BP 80/60 mmHg (shock). Tongue dry. Abdomen uniformly distended, immobile during breathing, with dullness in dependent flanks (peritoneal exudate). Epigastrium is tense and sharply tender; Shchetkin-Blumberg sign is weakly positive globally. Blood: WBC 12.0 x 10⁹/L, ESR 35 mm/h, Hb 160 g/L, Hct 0.50. Urine diastase 8 U.',
    questions: [
      { num: 1, text: 'Formulate a detailed diagnosis.' },
      { num: 2, text: 'What history points should be clarified?' },
      { num: 3, text: 'What additional physical signs and examinations should be performed?' },
      { num: 4, text: 'Outline a comprehensive investigative plan.' },
      { num: 5, text: 'Interpret the laboratory changes presented.' },
      { num: 6, text: 'What conditions require differential diagnosis?' },
      { num: 7, text: 'Describe the pathophysiological cascade leading to shock and peritonitis.' },
      { num: 8, text: 'Outline the management plan and surgical indications.' },
      { num: 9, text: 'What complications can be anticipated?' },
      { num: 10, text: 'State the probable outcomes and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Acute destructive pancreatitis (pancreatic necrosis) complicated by pancreatogenic shock (Grade II-III) and enzymatic ascites-peritonitis.' },
      { num: 2, text: 'History of gallstones, differentiation of chest/epigastric pain from acute coronary syndrome, and pre-hospital medications.' },
      { num: 3, text: 'Evaluate specific pancreatic signs (Mayo-Robson, Körte, Voskresensky, Mondor, Grey Turner, Cullen) and perform digital rectal examination.' },
      { num: 4, text: 'Coagulation panel, serum lactate, comprehensive metabolic panel, ECG, abdominal ultrasound, contrast CT, and diagnostic laparoscopy.' },
      { num: 5, text: 'Severe hemoconcentration (Hct 0.50), hypothermia, and paradoxically depleted urine diastase (8 U) due to massive acinar destruction.' },
      { num: 6, text: 'Perforated ulcer, gangrenous cholecystitis, acute myocardial infarction, dissecting aneurysm, and mesenteric vessel occlusion.' },
      { num: 7, text: 'Intraductal hyperpressure -> enzyme release into circulation -> systemic cytokine/kallikrein storm -> systemic vasodilation and capillary leakage -> severe fluid sequestration -> hypovolemic/septic shock and enzymatic peritonitis.' },
      { num: 8, text: 'Immediate ICU anti-shock resuscitation. Urgent laparoscopy for peritoneal lavage and multi-tube drainage of the lesser sac and abdominal gutters.' },
      { num: 9, text: 'Infected necrosis, retroperitoneal phlegmon, arrosive vascular hemorrhage, ARDS, and multiple organ failure.' },
      { num: 10, text: 'High mortality (20–40%). Prognosis remains guarded, contingent on aggressive early resuscitation and minimally invasive drainage.' }
    ]
  }
];
