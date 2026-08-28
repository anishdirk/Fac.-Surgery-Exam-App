import { ClinicalCase } from '../../types';

export const gastricCancerCases: ClinicalCase[] = [
  {
    id: 26,
    number: 1,
    topicId: 'gastric_cancer',
    topicTitleEn: 'Gastric Malignancy & Polyps',
    stem: 'Patient S., 57 years old, presented with dysphagia/discomfort during swallowing, dull aching pain near the xiphoid process (prompting him to abandon solid food), belching, rapid weight loss, and fatigue. He has a 10-year history of chronic gastritis; 3 years ago, an endoscopy revealed a gastric ulcer, after which he was lost to follow-up. Symptoms worsened over the last 3 months. An occupational physician prescribed antacids and H2-blockers without benefit. On examination: pale, cachectic; a hard, non-tender, fixed 2 cm lymph node is palpable in the left supraclavicular fossa (Virchow\'s node). Deep epigastric palpation reveals an indistinct mass. Blood: Hb 86 g/L, RBC 3.1 x 10¹²/L, WBC 10.8 x 10⁹/L, ESR 40 mm/h.',
    questions: [
      { num: 1, text: 'What is the primary clinical diagnosis?' },
      { num: 2, text: 'What is the presumptive anatomical localization of the tumor?' },
      { num: 3, text: 'What clinical syndromes are evident in this case?' },
      { num: 4, text: 'What tactical errors were made by the occupational physician?' },
      { num: 5, text: 'What conditions require differential diagnosis?' },
      { num: 6, text: 'Outline a complete diagnostic and staging workup.' },
      { num: 7, text: 'What findings are expected on endoscopy and imaging?' },
      { num: 8, text: 'Determine and justify the stage of the disease.' },
      { num: 9, text: 'What therapeutic/palliative options are available?' },
      { num: 10, text: 'State the occupational disability evaluation.' }
    ],
    answers: [
      { num: 1, text: 'Gastric adenocarcinoma (cardia/proximal body), Stage IV (with distant lymph node metastasis: Virchow\'s node).' },
      { num: 2, text: 'Cardia and upper body of the stomach with extension to the gastroesophageal junction (causing dysphagia and retroxiphoid discomfort).' },
      { num: 3, text: 'Savitsky\'s syndrome of minor signs (fatigue, anorexia, weight loss, apathy), dysphagia syndrome, and chronic anemia syndrome.' },
      { num: 4, text: 'Prescribing empirical medical therapy to an elderly patient with red-flag symptoms (weight loss, dysphagia, ulcer history) without urgent endoscopy and biopsy.' },
      { num: 5, text: 'Benign gastric ulcer, esophageal carcinoma, achalasia, and pancreatic body carcinoma.' },
      { num: 6, text: 'EGD with multiple targeted biopsies (6–8 samples), contrast CT of chest/abdomen/pelvis, endoscopic ultrasound (EUS), and core biopsy of the supraclavicular lymph node.' },
      { num: 7, text: 'EGD demonstrates an exophytic or ulcerative mucosal lesion with friable borders; histology confirms adenocarcinoma. CT shows mural thickening and distant nodal metastasis.' },
      { num: 8, text: 'Stage IV (T_any N_any M1) due to the presence of distant lymphatic metastasis (left supraclavicular Virchow\'s node).' },
      { num: 9, text: 'Palliative approach: endoscopic stenting across the gastroesophageal junction or palliative gastrostomy/jejunostomy for nutrition, systemic palliative chemotherapy, and analgesia.' },
      { num: 10, text: 'Permanent total disability (Group I disability).' }
    ]
  },
  {
    id: 27,
    number: 2,
    topicId: 'gastric_cancer',
    topicTitleEn: 'Gastric Malignancy & Polyps',
    crossTopicIds: ['peritonitis'],
    stem: 'A 50-year-old female was found to have bilateral hard, nodular ovarian tumors (8–10 cm in diameter) during a routine gynecological checkup. Her history revealed persistent fatigue, anorexia, belching, irregular bowel habits, and two episodes of melena (which she attributed to dietary beets). She had a history of chronic gastritis and iron deficiency anemia (Hb 90 g/L), losing 5 kg over the past year without endoscopy for 2 years. A subtotal hysterectomy with bilateral salpingo-oophorectomy was performed in gynecology. Histopathology revealed bilateral ovarian metastases of poorly differentiated signet-ring cell carcinoma. She was referred to surgical oncology.',
    questions: [
      { num: 1, text: 'What is the primary oncologic diagnosis?' },
      { num: 2, text: 'What critical diagnostic mistake was made by the gynecologist prior to surgery?' },
      { num: 3, text: 'What primary pelvic conditions should have been differentiated?' },
      { num: 4, text: 'What is the eponym for this bilateral ovarian metastasis?' },
      { num: 5, text: 'What investigations must be ordered now to identify the primary tumor?' },
      { num: 6, text: 'What is the disease stage?' },
      { num: 7, text: 'What would have been the optimal management, and what is the current treatment plan?' },
      { num: 8, text: 'What is the prognosis?' },
      { num: 9, text: 'What is the disability status?' }
    ],
    answers: [
      { num: 1, text: 'Primary gastric adenocarcinoma, Stage IV, with bilateral ovarian metastases (Krukenberg tumors).' },
      { num: 2, text: 'Failure to evaluate gastrointestinal red flags (melena, anemia, dyspepsia, weight loss) and omission of preoperative upper and lower endoscopy (EGD/colonoscopy).' },
      { num: 3, text: 'Primary ovarian carcinoma, benign cystadenoma, pelvic tuberculosis, and metastatic colorectal cancer.' },
      { num: 4, text: 'Krukenberg tumor (Krukenberg metastasis).' },
      { num: 5, text: 'EGD with multiple mucosal biopsies, contrast-enhanced CT of abdomen/pelvis/chest, colonoscopy, and tumor markers (CEA, CA 72-4, CA 125).' },
      { num: 6, text: 'Stage IV (T_any N_any M1).' },
      { num: 7, text: 'Comprehensive staging followed by palliative/cytoreductive gastrectomy (if the primary tumor is resectable without other disseminated disease) combined with systemic platinum/fluoropyrimidine chemotherapy.' },
      { num: 8, text: 'Unfavorable (5-year survival < 10%).' },
      { num: 9, text: 'Permanent occupational disability (Group I or II).' }
    ]
  },
  {
    id: 28,
    number: 3,
    topicId: 'gastric_cancer',
    topicTitleEn: 'Gastric Malignancy & Polyps',
    crossTopicIds: ['ulcer'],
    stem: 'Patient K., 46 years old, with a 10-year history of chronic gastric ulcer and seasonal relapses, noted a change in symptom pattern over the last 3 months: pain became constant and dull, exacerbated by food, accompanied by foul-smelling belching, loss of appetite, a 5 kg weight loss, and chronic fatigue. She had not visited a physician for 2 years. Physical exam: pale, undernourished, lymph nodes normal. Abdomen soft, tender in the epigastrium without palpable masses. Blood: Hb 86 g/L, RBC 3.2 x 10¹²/L, WBC 7.4 x 10⁹/L, ESR 32 mm/h. Fecal occult blood test is positive.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'How frequently does malignant transformation of chronic gastric ulcer occur?' },
      { num: 3, text: 'What diseases must be considered in the differential diagnosis?' },
      { num: 4, text: 'Outline a diagnostic investigation plan.' },
      { num: 5, text: 'Describe the diagnostic value of endoscopy and barium radiography.' },
      { num: 6, text: 'Outline the surgical management and preoperative preparation.' },
      { num: 7, text: 'What determines radical vs palliative surgical resection, and what are the main operative stages?' },
      { num: 8, text: 'What are the key preventive measures for gastric ulcer malignancy?' },
      { num: 9, text: 'State the prognosis and disability evaluation.' }
    ],
    answers: [
      { num: 1, text: 'Malignant transformation of chronic gastric ulcer (ulcer-cancer / ulcerative gastric adenocarcinoma) with chronic secondary anemia.' },
      { num: 2, text: 'Malignant degeneration occurs in approximately 5–15% of chronic, calloused, or large (>2 cm) gastric ulcers.' },
      { num: 3, text: 'Exacerbation of benign peptic ulcer, gastric polyps, chronic atrophic gastritis, and pancreatic carcinoma.' },
      { num: 4, text: 'Urgent EGD with targeted multi-quadrant biopsies (≥6–8 samples from margins and base), barium fluoroscopy, contrast-enhanced CT of chest/abdomen, and tumor markers.' },
      { num: 5, text: 'EGD provides direct tissue biopsy for definitive histology. Barium radiography reveals an atypical niche with an asymmetric rigid surrounding halo, disrupted mucosal folds, and localized aperistalsis.' },
      { num: 6, text: 'Preoperative optimization: correction of anemia and hypoproteinemia. Radical surgical resection: subtotal gastrectomy or total gastrectomy with D2 lymphadenectomy.' },
      { num: 7, text: 'Radical distal subtotal gastrectomy with Roux-en-Y reconstruction and D2 lymph node dissection (for antral tumors) or total gastrectomy with esophagojejunostomy (for proximal/body lesions).' },
      { num: 8, text: 'Regular endoscopic monitoring of all gastric ulcers until verified complete histological healing, H. pylori eradication, and timely surgical resection of refractory callous ulcers.' },
      { num: 9, text: 'Favorable (60–80% 5-year survival) if detected in early stages (T1-T2N0); guarded in advanced stages. Group II or III disability.' }
    ]
  },
  {
    id: 29,
    number: 4,
    topicId: 'gastric_cancer',
    topicTitleEn: 'Gastric Malignancy & Polyps',
    crossTopicIds: ['ulcer', 'obstruction'],
    stem: 'Patient V., 57 years old, presents with nausea, foul/rotten belching, vomiting of food ingested the previous day, a 12 kg weight loss over 4 months, constipation, and heavy epigastric fullness after meals. Worsening over the past 6 months. Physical exam: cachectic with earthy skin tint (height 172 cm, weight 51 kg), lymph nodes normal. The abdomen is asymmetrical: visible gastric hyperperistalsis in the left hypochondrium/epigastrium, a succussion splash ("splash noise") on shaking, and lower extremity edema. Blood: Hb 132 g/L, RBC 4.3 x 10¹²/L, WBC 9.6 x 10⁹/L (18% bands), ESR 38 mm/h.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'Where is the tumor localized?' },
      { num: 3, text: 'What conditions should be considered in the differential diagnosis?' },
      { num: 4, text: 'Why are hemoglobin and RBC indices deceptively within normal limits?' },
      { num: 5, text: 'Outline the diagnostic and staging plan.' },
      { num: 6, text: 'How should the patient be prepared for endoscopic and radiologic studies?' },
      { num: 7, text: 'What surgical treatment options exist, and what dictates the choice?' },
      { num: 8, text: 'Describe the preoperative intensive preparation.' },
      { num: 9, text: 'State the prognosis and disability classification.' }
    ],
    answers: [
      { num: 1, text: 'Carcinoma of the pyloric/antral region of the stomach with secondary subcompensated/decompensated gastric outlet obstruction (pyloroduodenal stenosis).' },
      { num: 2, text: 'Pyloric canal and gastric antrum.' },
      { num: 3, text: 'Benign cicatricial peptic pyloric stenosis, benign gastric polyps/leiomyomas, and pancreatic head carcinoma.' },
      { num: 4, text: 'Severe hemoconcentration due to chronic dehydration and electrolyte loss from daily vomiting, which falsely elevates hematocrit and conceals underlying anemia.' },
      { num: 5, text: 'EGD with multiple biopsies, upper GI barium series, contrast CT of abdomen/chest, and metabolic panel (potassium, chloride, sodium, total protein, albumin, BUN, creatinine).' },
      { num: 6, text: 'Daily evening gastric lavage via large-bore nasogastric tube for 3–5 days to evacuate stagnant food debris, reduce mucosal edema, and cleanse the stomach.' },
      { num: 7, text: 'Radical distal subtotal gastrectomy with D2 lymphadenectomy if resectable; if unresectable, palliative bypass gastrojejunostomy (with Braun enteroenterostomy) or endoscopic duodenal stenting.' },
      { num: 8, text: 'Intensive preoperative resuscitation: aggressive IV rehydration, correction of hypochloremic/hypokalemic alkalosis, total parenteral nutrition, and albumin infusions.' },
      { num: 9, text: 'Guarded prognosis depending on TNM stage and resectability. Group I or II disability.' }
    ]
  },
  {
    id: 30,
    number: 5,
    topicId: 'gastric_cancer',
    topicTitleEn: 'Gastric Malignancy & Polyps',
    stem: 'Patient V., 49 years old, complains of constant epigastric pain aggravated after eating, frequent diarrhea with undigested food immediately following meals, profound weakness, progressive cachexia, foul fecal breath (fecal odor from mouth), and low-grade fever (37.5–38.0°C). Symptoms for 6 months. On examination: pale, cachectic (height 176 cm, weight 51 kg). Above the umbilicus, a firm, moderately tender, mobile tumor mass is palpated. Barium fluoroscopy of the stomach demonstrates a large ulcerative "niche" with irregular rigid margins on the greater curvature, with direct extravasation of barium contrast into the transverse colon.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'What specific complication has developed?' },
      { num: 3, text: 'What conditions should be considered in the differential diagnosis?' },
      { num: 4, text: 'Outline the diagnostic and staging workup.' },
      { num: 5, text: 'What is the probable TNM/clinical stage?' },
      { num: 6, text: 'What are the possible surgical treatment options?' },
      { num: 7, text: 'State the prognosis and disability classification.' }
    ],
    answers: [
      { num: 1, text: 'Advanced gastric carcinoma of the greater curvature (Stage IV / T4b) complicated by direct invasion into the transverse colon and gastrocolic fistula formation.' },
      { num: 2, text: 'Gastrocolic fistula, severe malabsorption syndrome, and tumor cachexia.' },
      { num: 3, text: 'Primary transverse colon carcinoma invading the stomach, Crohn\'s disease with internal fistulization, and benign penetrative peptic ulcer.' },
      { num: 4, text: 'EGD with multiple biopsies, contrast barium enema (irrigoscopy — highly sensitive for gastrocolic fistulae), contrast-enhanced abdominal/pelvic CT, and nutritional/metabolic panel.' },
      { num: 5, text: 'Stage IV (T4b N_any M0-1 due to direct transmural invasion into adjacent transverse colon).' },
      { num: 6, text: 'Combined multivisceral en bloc resection: total or subtotal gastrectomy with transverse colectomy and D2 lymphadenectomy if resectable; if unresectable, palliative fistula exclusion / feeding jejunostomy and systemic chemotherapy.' },
      { num: 7, text: 'Poor/unfavorable prognosis. Permanent disability (Group I).' }
    ]
  }
];
