import { ClinicalCase } from '../../types';

export const obstructionCases: ClinicalCase[] = [
  {
    id: 20,
    number: 1,
    topicId: 'obstruction',
    topicTitleEn: 'Intestinal Obstruction (Ileus)',
    crossTopicIds: ['gastric_cancer'],
    stem: 'Patient K., 65 years old, has experienced right iliac fossa pain, abdominal bloating, loud borborygmi, weakness, and low-grade fever for 4 months. Recently, alternating constipation and loose bloody stools developed. One month ago, he was treated conservatively for a presumed "appendicular infiltrate" without colon examination. Over the past 3 days, abdominal pain worsened into intense colicky cramps, and passage of flatus and stool ceased. On examination: moderate severity, dry coated tongue. Abdomen distended, soft, tender in the right lower quadrant, where a firm, poorly mobile, tender mass is palpated. No peritoneal signs. Resonant, high-pitched hyperactive peristalsis. Blood: ESR 28 mm/h, WBC 11.4 x 10⁹/L, Hb 88 g/L, RBC 3.2 x 10¹²/L.',
    questions: [
      { num: 1, text: 'Formulate and justify the comprehensive clinical diagnosis.' },
      { num: 2, text: 'What additional imaging and laboratory investigations are required?' },
      { num: 3, text: 'What diseases must be differentiated from this condition?' },
      { num: 4, text: 'Describe the pathophysiological mechanisms of obstruction and anemia.' },
      { num: 5, text: 'Were there clinical errors during the previous hospital admission?' },
      { num: 6, text: 'Outline the surgical and medical treatment plan.' },
      { num: 7, text: 'Describe the scope and timing of preoperative preparation.' },
      { num: 8, text: 'What complications may arise in this patient?' },
      { num: 9, text: 'State the expected outcomes and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Carcinoma of the cecum/ascending colon complicated by acute mechanical obstructive colonic ileus and chronic iron-deficiency anemia.' },
      { num: 2, text: 'Plain abdominal radiograph (Kloiber fluid levels/cups), contrast-enhanced abdominal CT, water-soluble contrast enema (apple-core filling defect), colonoscopy with biopsy, and serum CEA.' },
      { num: 3, text: 'Appendiceal abscess, Crohn\'s disease, ileocecal tuberculosis/actinomycosis, and intussusception.' },
      { num: 4, text: 'Tumor mass luminal narrowing produced mechanical obstruction with upstream proximal distension and hyperperistalsis. Chronic occult blood loss and tumor intoxication caused progressive hypochromic anemia.' },
      { num: 5, text: 'Yes. An elderly patient with an inflammatory-like mass and progressive anemia was discharged without obligatory colonoscopy or barium enema to exclude colonic malignancy.' },
      { num: 6, text: 'Urgent oncologic resection: right hemicolectomy with primary ileotransverse anastomosis or preliminary diverting stoma depending on bowel viability and peritoneal contamination.' },
      { num: 7, text: 'Short intensive preparation (2–4 hours): nasogastric decompression, IV crystalloid and electrolyte repletion, blood transfusion, and broad-spectrum IV antibiotics.' },
      { num: 8, text: 'Cecal diastatic perforation due to closed-loop pressure, feculent peritonitis, septic shock, and anastomotic leak.' },
      { num: 9, text: 'Favorable with timely oncologic resection before perforation; overall survival depends on TNM stage and lymph node status.' }
    ]
  },
  {
    id: 21,
    number: 2,
    topicId: 'obstruction',
    topicTitleEn: 'Intestinal Obstruction (Ileus)',
    stem: 'Patient K., 38 years old, experienced sudden excruciating cramping abdominal pain 6 hours prior to admission after heavy weight lifting. Flatus and bowel movements ceased, and he had repeated persistent vomiting. On examination: severe condition, restless, constantly changing body position in bed trying to find relief. Pale, acrocyanotic, pulse 100 bpm. Abdomen moderately distended in the epigastric/umbilical region; a tense, elastic mass with overlying tympany is palpated around the umbilicus (Val sign). Bowel sounds are sparse and metallic/resonant.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'What physical and bedside examinations must be performed?' },
      { num: 3, text: 'What imaging and laboratory tests should be ordered?' },
      { num: 4, text: 'What pathophysiological alterations develop in strangulated obstruction?' },
      { num: 5, text: 'What differential diagnoses should be evaluated?' },
      { num: 6, text: 'Outline the conservative preparation and surgical management plan.' },
      { num: 7, text: 'What is the operative procedure depending on intestinal viability?' },
      { num: 8, text: 'What major complications can occur?' },
      { num: 9, text: 'State the possible clinical outcomes.' }
    ],
    answers: [
      { num: 1, text: 'Acute strangulation small bowel obstruction (small intestine volvulus).' },
      { num: 2, text: 'Digital rectal exam (gaping empty rectal ampulla - Obukhov hospital sign; rule out blood), search for splash noise (Sklyarov sign) and metallic tinkles (Spasokukotsky sign).' },
      { num: 3, text: 'Plain abdominal X-ray (Kloiber cups, Kerkring plicae circulares), ultrasound (whirlpool sign of mesenteric twist, fluid-filled aperistaltic loops), CBC, lactate, and ABG.' },
      { num: 4, text: 'Mesenteric vascular compression causes rapid hemorrhagic infarction, bowel wall gangrene, loss of mucosal barrier, bacterial/toxin translocation into the peritoneal cavity, and severe hypovolemic/septic shock.' },
      { num: 5, text: 'Perforated peptic ulcer, acute necrotizing pancreatitis, acute mesenteric ischemia, and strangulated internal hernia.' },
      { num: 6, text: 'Rapid preoperative resuscitation (max 1.5–2 hours: NG decompression, fluid repletion). Emergency exploratory midline laparotomy under general anesthesia.' },
      { num: 7, text: 'If viable: detorsion, warm laparotomy pads, and mesenteric lidocaine block. If non-viable/gangrenous: resection of the necrotic segment plus 30–40 cm of proximal and 15–20 cm of distal viable intestine, with primary end-to-end anastomosis and nasointestinal tube decompression.' },
      { num: 8, text: 'Transmural necrosis, perforation, diffuse peritonitis, septic shock, and anastomotic failure.' },
      { num: 9, text: 'Full recovery with timely operation; high mortality if surgery is delayed beyond the window of bowel viability.' }
    ]
  },
  {
    id: 22,
    number: 3,
    topicId: 'obstruction',
    topicTitleEn: 'Intestinal Obstruction (Ileus)',
    crossTopicIds: ['appendicitis'],
    stem: 'Patient B., 28 years old, developed sudden severe colicky abdominal pain shortly after a meal 10 hours prior to admission, followed by inability to pass flatus or feces and repeated vomiting. Examination: moderate severity, groaning in pain, pulse 80 bpm, dry tongue, abdomen uniformly moderately distended. An old surgical scar from a childhood appendectomy is present in the right iliac fossa. Abdomen is soft, moderately tender throughout, no peritoneal irritation. Bowel peristalsis is hyperactive and resonant; a succussion splash ("splash noise" / Sklyarov sign) is easily elicited.',
    questions: [
      { num: 1, text: 'State the nature of the condition and its probable underlying cause.' },
      { num: 2, text: 'Provide a structured classification of intestinal obstruction.' },
      { num: 3, text: 'What imaging and diagnostic studies are required?' },
      { num: 4, text: 'What differential diagnoses must be excluded?' },
      { num: 5, text: 'Detail the medical and surgical management plan.' },
      { num: 6, text: 'What complications and outcomes are possible?' },
      { num: 7, text: 'What are the main priorities of postoperative care?' },
      { num: 8, text: 'What are the key clinical and metabolic differences between high (small bowel) and low (colonic) obstruction?' }
    ],
    answers: [
      { num: 1, text: 'Acute adhesive small bowel obstruction (SBO). Cause: intra-abdominal peritoneal adhesions following prior appendectomy.' },
      { num: 2, text: '1) Mechanism: Mechanical (strangulation, simple obturation, mixed: adhesive, intussusception) vs Dynamic (paralytic, spastic). 2) Level: High (small intestine) vs Low (large intestine). 3) Degree: Complete vs Partial.' },
      { num: 3, text: 'Plain abdominal radiography (Kloiber fluid levels/step-ladder pattern), abdominal ultrasound, small bowel follow-through / Gastrografin challenge (Schwartz test), and contrast CT.' },
      { num: 4, text: 'Acute pancreatitis, appendicitis, acute cholecystitis, perforated ulcer, renal colic, and acute gynecological emergencies.' },
      { num: 5, text: 'Initial trial of conservative management for 2–4 hours (NG decompression, IV fluid resuscitation, antispasmodics, water-soluble contrast challenge). If refractory or if strangulation is suspected: emergency laparotomy/laparoscopy, adhesiolysis, resection of non-viable bowel if gangrenous, and long-tube intestinal splinting.' },
      { num: 6, text: 'Strangulation gangrene, bowel perforation, peritonitis, severe electrolyte depletion, and recurrent adhesive episodes.' },
      { num: 7, text: 'Early restoration of intestinal motility (prokinetics, epidural analgesia), fluid/electrolyte rebalancing, antibiotics, and early mobilization to minimize adhesion recurrence.' },
      { num: 8, text: 'High (small bowel): early agonizing vomiting, rapid profound dehydration, hypokalemic/hypochloremic metabolic alkalosis, less prominent distension. Low (colonic): pronounced asymmetric bloating, late vomiting (feculent), delayed metabolic crisis, competence of ileocecal valve creating closed-loop obstruction.' }
    ]
  },
  {
    id: 23,
    number: 4,
    topicId: 'obstruction',
    topicTitleEn: 'Intestinal Obstruction (Ileus)',
    stem: 'A 3-year-old child developed sudden paroxysmal bouts of severe abdominal pain lasting several minutes. During the attack, the child turned pale, clutched his stomach, and drew up his legs. An ambulance doctor found the child playing calmly between spasms and found no abnormalities. An hour later, the spasms recurred. Following a third attack, the child was hospitalized. He passed a stool mixed with blood and mucus (classic "red currant jelly" stool). Pulse 100 bpm, temperature normal. After 30 minutes, another spasm with vomiting occurred. Examination: empty right iliac fossa (Dance\'s sign) and an elongated, tender, sausage-shaped elastic mass palpable in the right hypochondrium.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'What conditions should be included in the differential diagnosis?' },
      { num: 3, text: 'What should the emergency physician have done during the initial visit?' },
      { num: 4, text: 'What diagnostic investigations are indicated?' },
      { num: 5, text: 'What is the primary treatment strategy (conservative vs surgical)?' },
      { num: 6, text: 'Describe the surgical technique and resection criteria.' },
      { num: 7, text: 'Provide the anatomical classification of intussusception.' },
      { num: 8, text: 'What complications can develop if untreated?' },
      { num: 9, text: 'Explain the difference between high and low obstruction in terms of mortality risks.' }
    ],
    answers: [
      { num: 1, text: 'Acute ileocecal intussusception (invagination) in a child; acute mechanical/strangulated bowel obstruction.' },
      { num: 2, text: 'Acute infectious enteritis/dysentery, Henoch-Schönlein purpura, acute appendicitis, Meckel\'s diverticulitis, and midgut volvulus.' },
      { num: 3, text: 'Perform digital rectal exam (to detect occult blood/currant jelly mucus) and mandate immediate transfer to a pediatric surgical center without leaving the patient at home.' },
      { num: 4, text: 'Abdominal ultrasound (pathognomonic "target" or "doughnut" sign), pneumatic/contrast enema under fluoroscopy or US guidance (diagnostic and potentially therapeutic).' },
      { num: 5, text: 'In early cases (<12–24 hours without peritonitis): non-operative pneumatic reduction (air enema) under fluoroscopy/ultrasound. If pneumatic reduction fails or signs of perforation/peritonitis exist: immediate surgery.' },
      { num: 6, text: 'Surgical manual reduction by gentle retrograde squeezing/milking of the intussusceptum (traction is strictly contraindicated). If bowel is non-viable or perforated: segmental resection / right hemicolectomy.' },
      { num: 7, text: 'Anatomical types: Entero-enteric (small bowel), Ileo-colic (ileocecal, most common), Ileo-ileocolic, and Colo-colic.' },
      { num: 8, text: 'Strangulation gangrene of the intussusceptum, perforation, fecal peritonitis, and septic shock.' },
      { num: 9, text: 'High vs Low obstruction. High (small bowel) is acutely dangerous due to rapid life-threatening dehydration and electrolyte loss.' }
    ]
  },
  {
    id: 24,
    number: 5,
    topicId: 'obstruction',
    topicTitleEn: 'Intestinal Obstruction (Ileus)',
    stem: 'Patient B., 65 years old, was admitted on day 2 of illness complaining of moderate cramping lower abdominal pain radiating to the sacrum, massive abdominal distension, and complete cessation of flatus and stool. Onset was gradual; he has a long history of chronic constipation with similar episodes previously relieved by enemas. General condition is stable: pulse 72 bpm, afebrile, tongue coated. Abdomen is visibly asymmetrical ("skewed abdomen") with massive ballooning of the right/upper abdomen; soft and non-tender on palpation. An enormous tense-elastic ballooned loop with tympanitic percussion and a distinct succussion splash is noted.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'What are the anatomical and predisposing causes of this condition?' },
      { num: 3, text: 'Outline the clinical, digital rectal, and instrumental diagnostic findings.' },
      { num: 4, text: 'What pathological changes occur in the twisted colon loop and upstream bowel?' },
      { num: 5, text: 'What is the treatment strategy, endoscopic detorsion, and surgical scope?' },
      { num: 6, text: 'What postoperative complications may arise?' },
      { num: 7, text: 'How is intestinal continuity restored in cases treated with Hartmann\'s procedure?' }
    ],
    answers: [
      { num: 1, text: 'Acute large bowel obstruction due to Sigmoid Colon Volvulus (dolichosigmoid).' },
      { num: 2, text: 'Elongated redundant sigmoid loop (dolichosigmoid) with a narrow mesenteric base, chronic constipation, fecal loading, and scarring/shortening of the mesenteric root.' },
      { num: 3, text: 'Digital rectal exam (dilated empty ampulla), diagnostic enema (Tsege-von Manteuffel sign: bowel accepts <500 mL of fluid), plain X-ray showing classic "coffee bean" or "omega loop" sign, and flexible sigmoidoscopy.' },
      { num: 4, text: 'Venous engorgement and thrombosis in the twisted mesentery leading to hemorrhagic infarction, transmural gangrene, bacterial translocation, and foul bloody peritoneal transudate.' },
      { num: 5, text: 'Initial attempt at endoscopic detorsion via sigmoidoscopy/colonoscopy with decompression tube placement if no gangrene/peritonitis is present. If non-viable or detorsion fails: emergency laparotomy with Hartmann\'s resection (sigmoid colectomy with end colostomy).' },
      { num: 6, text: 'Fecal peritonitis, wound infection, DVT/PE, stoma necrosis or retraction.' },
      { num: 7, text: 'Second-stage reconstructive takedown of colostomy with colorectal anastomosis performed 3–6 months later.' }
    ]
  },
  {
    id: 25,
    number: 6,
    topicId: 'obstruction',
    topicTitleEn: 'Intestinal Obstruction (Ileus)',
    crossTopicIds: ['ulcer', 'peritonitis'],
    stem: 'Patient R., 36 years old, underwent primary suture closure of a perforated gastric ulcer. On postoperative day 5, he developed colicky abdominal pain, nausea, and recurrent vomiting. After a siphon enema, flatus was expelled and pain briefly improved, but bilious vomiting soon recurred. On examination: moderate condition, pulse 100 bpm, tongue dry, abdomen distended, soft in all quadrants. Peristalsis is infrequent but vigorous; succussion splash ("splash noise") is positive. Repeat plain abdominal radiography demonstrates multiple Kloiber fluid-gas levels.',
    questions: [
      { num: 1, text: 'What postoperative complication has developed?' },
      { num: 2, text: 'What is the primary etiology of this complication?' },
      { num: 3, text: 'What investigations are required to confirm the diagnosis?' },
      { num: 4, text: 'What other postoperative complications must be ruled out?' },
      { num: 5, text: 'What is the stepwise medical and surgical management strategy?' },
      { num: 6, text: 'Present the classification of intestinal obstruction.' },
      { num: 7, text: 'What is the therapeutic purpose of nasointestinal tube decompression?' },
      { num: 8, text: 'Which is more dangerous — strangulation or simple obturation, and why?' }
    ],
    answers: [
      { num: 1, text: 'Early postoperative adhesive small bowel obstruction (SBO).' },
      { num: 2, text: 'Fibrinous adhesion formation secondary to the preceding chemical/purulent peritonitis and surgical peritoneal manipulation.' },
      { num: 3, text: 'Serial plain abdominal X-rays, small bowel Gastrografin water-soluble contrast transit challenge, abdominal ultrasound, and electrolyte panel.' },
      { num: 4, text: 'Gastric outlet stenosis at the ulcer suture line, suture line leak with peritonitis, intra-abdominal (subphrenic/inter-loop) abscess, and postoperative pancreatitis.' },
      { num: 5, text: 'Active conservative trial (12–24 hours): continuous NG suction decompression, IV fluid and electrolyte repletion, antispasmodics, water-soluble contrast. If unresolving or worsening: urgent relaparotomy, adhesiolysis, and bowel decompression.' },
      { num: 6, text: 'Acute vs chronic; Mechanical (obturative, strangulated, mixed) vs Dynamic (paralytic, spastic); High (small bowel) vs Low (large bowel).' },
      { num: 7, text: 'Gastrointestinal decompression, drainage of toxic stagnant intraluminal fluid, restoration of intramural microcirculation, and internal splinting of loops to prevent kinked re-adhesions.' },
      { num: 8, text: 'Strangulation is much more lethal because mesenteric vascular compromise produces rapid transmural gangrene, perforation, and septic peritonitis within hours.' }
    ]
  }
];
