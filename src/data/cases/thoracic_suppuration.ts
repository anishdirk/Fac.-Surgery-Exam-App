import { ClinicalCase } from '../../types';

export const thoracicSuppurationCases: ClinicalCase[] = [
  {
    id: 47,
    number: 1,
    topicId: 'thoracic_suppuration',
    topicTitleEn: 'Suppurative Lung Diseases & Abscess',
    stem: 'Patient S., 44 years old, with chronic alcohol abuse, presents with severe cough yielding up to 500 mL of foul-smelling, dirty-gray purulent sputum ("full mouth") when rolling onto his left side, profound weakness, dyspnea, and high fevers up to 39.2°C with rigors. Onset was acute 12 days ago following alcohol-induced hypothermia. Yesterday, after a violent coughing bout, he coughed up massive foul sputum, followed by defervescence to 37.6°C. Physical exam: dullness with a tympanitic overtone below the right scapula, amphoric breath sounds, and coarse crackles. Chest X-ray: a 6 cm rounded cavity with a horizontal air-fluid level and broad peripheral infiltration in the superior segment of the right lower lobe (S6).',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Describe the two clinical phases of this disease and identify the patient\'s current phase.' },
      { num: 3, text: 'Explain the etiology and aspiration pathogenesis of lung abscess.' },
      { num: 4, text: 'What cavitary lung lesions require differential diagnosis?' },
      { num: 5, text: 'Outline the comprehensive medical and bronchoscopic treatment plan.' },
      { num: 6, text: 'What are the indications and types of surgical resection/drainage?' }
    ],
    answers: [
      { num: 1, text: 'Acute aspiration purulent lung abscess of the right lower lobe (S6 segment), post-rupture / draining phase.' },
      { num: 2, text: 'Two phases: 1) Pre-drainage phase (tissue infiltration/necrosis without bronchus communication: hectic fever, toxic state, dry cough); 2) Post-drainage phase (following rupture into a bronchus: massive sputum, cavity air-fluid level, and clinical improvement). The patient is in Phase 2.' },
      { num: 3, text: 'Aspiration of polymicrobial oral anaerobes during alcohol-induced coma, lodging in the dependent S6 segment, causing localized suppurative necrosis, microabscess confluence, and cavitary abscess.' },
      { num: 4, text: 'Cavitary pulmonary tuberculosis, cavitating peripheral bronchogenic carcinoma, infected echinococcal or bronchogenic cyst, and loculated empyema with bronchopleural fistula.' },
      { num: 5, text: '1) Broad-spectrum IV antibiotics covering anaerobes (amoxicillin-clavulanate + clindamycin/metronidazole or carbapenems); 2) Serial therapeutic bronchoscopy with direct cavity lavage; 3) Postural drainage, mucolytics, and nutritional support.' },
      { num: 6, text: 'Indications: massive hemoptysis, failure of medical/bronchoscopic therapy >6–8 weeks, suspicion of cavitating cancer, or giant tension abscess. Procedures: percutaneous pig-tail drainage (Monaldi) or anatomic lobectomy/pneumonectomy.' }
    ]
  },
  {
    id: 48,
    number: 2,
    topicId: 'thoracic_suppuration',
    topicTitleEn: 'Suppurative Lung Diseases & Abscess',
    stem: 'Patient K., 48 years old, was admitted in a severe septic state: stuporous, profound tachypnea (respiratory rate 34/min), ashen-gray skin, clammy diaphoresis, and central cyanosis. Pulse 118 bpm, BP 95/60 mmHg, temperature 39.8°C. Cough yields up to 800 mL/day of foul brownish putrid sputum ("meat water" appearance) containing visible necrotic lung tissue fragments (pulmonary sequestra). Chest X-ray and CT demonstrate diffuse consolidation of the entire right lung with multiple irregular, non-demarcated breakdown cavities, containing floating sequestra and air-fluid levels.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'How does pulmonary gangrene differ pathologically and clinically from a lung abscess?' },
      { num: 3, text: 'What life-threatening complications are imminent?' },
      { num: 4, text: 'Outline the emergency ICU resuscitation protocol.' },
      { num: 5, text: 'What is the surgical strategy and operative options for pulmonary gangrene?' }
    ],
    answers: [
      { num: 1, text: 'Acute pulmonary gangrene of the right lung, severe sepsis, septic/toxic shock, and acute respiratory failure Grade III.' },
      { num: 2, text: 'Abscess is a localized suppurative cavity bounded by a pyogenic membrane and demarcation zone; pulmonary gangrene is an extensive, non-demarcated necrotizing putrefaction with liquefactive necrosis involving entire lobes/lung without a protective capsule.' },
      { num: 3, text: 'Massive fatal hemoptysis (arrosion of pulmonary vessels), pyopneumothorax with mediastinal shift, contralateral aspiration drowning, septic shock, and multi-organ failure.' },
      { num: 4, text: 'Intubation with double-lumen endotracheal tube (to isolate and protect the healthy left lung from purulent soiling), mechanical ventilation, ultra-broad-spectrum antibiotics (carbapenem + vancomycin), hemodynamic vasopressor support, and bronchoscopic suction.' },
      { num: 5, text: 'Emergency/urgent surgical resection: urgent anatomical pneumonectomy (or lobectomy/pneumonostomy in severely compromised candidates) with careful bronchial stump coverage.' }
    ]
  },
  {
    id: 49,
    number: 3,
    topicId: 'thoracic_suppuration',
    topicTitleEn: 'Suppurative Lung Diseases & Abscess',
    stem: 'A 52-year-old male with lifelong productive morning cough (up to 150 mL/day of foul three-layered sputum) presents with acute hemoptysis of ~250 mL of bright red blood and clots following exertion. Physical examination: pale, perioral cyanosis, classic digital clubbing ("drumstick fingers" and "watch-glass nails"). Dullness to percussion and persistent bubbling crackles over the left lung base. High-resolution chest CT reveals extensive saccular and cylindrical bronchial dilatations with thickened walls in the basal segments of the left lower lobe.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'What is the morphological classification of bronchiectasis?' },
      { num: 3, text: 'Classify pulmonary hemorrhage/hemoptysis by volume.' },
      { num: 4, text: 'What are the urgent first-aid and medical measures for active pulmonary bleeding?' },
      { num: 5, text: 'What endovascular and bronchoscopic techniques are used for definitive hemostasis?' },
      { num: 6, text: 'Is definitive elective surgical resection indicated?' }
    ],
    answers: [
      { num: 1, text: 'Bronchiectasis (saccular/cylindrical type) localized to the left lower lobe, exacerbation phase; complicated by moderate pulmonary hemorrhage (hemoptysis).' },
      { num: 2, text: '1) Cylindrical; 2) Saccular (cystic); 3) Varicose/fusiform; 4) Mixed.' },
      { num: 3, text: '1) Mild (streaking/hemoptysis): <50–100 mL/day; 2) Moderate: 100–500 mL/day; 3) Severe / Massive: >500 mL/day (or >150 mL/hour), posing immediate risk of asphyxiation.' },
      { num: 4, text: 'Sitting posture tilted toward the bleeding (left) side, systemic antifibrinolytics (tranexamic acid), antitussives (codeine), cold application, and blood pressure control.' },
      { num: 5, text: '1) Bronchoscopic occlusion of the bleeding segmental bronchus using a Fogarty balloon catheter or spigot; 2) Bronchial artery embolization (BAE) under angiographic guidance (gold standard).' },
      { num: 6, text: 'Yes, because the disease is strictly localized to a single anatomical lobe (left lower lobe), elective anatomical lobectomy offers complete curative outcomes.' }
    ]
  },
  {
    id: 50,
    number: 4,
    topicId: 'thoracic_suppuration',
    topicTitleEn: 'Suppurative Lung Diseases & Abscess',
    crossTopicIds: ['pleural'],
    stem: 'A 39-year-old male treated for an acute right upper lobe lung abscess experienced sudden agonizing "dagger-like" right chest pain during a coughing spasm, followed by profound suffocating dyspnea, dry cough, and a sense of impending doom. Examination: cyanosis, orthopneic sitting posture, pulse 120 bpm, BP 90/60 mmHg, RR 32/min. The right hemithorax lags in breathing. Percussion: loud tympany over upper zones with dullness below the scapula; mediastinum/heart shifted to the left. Breath sounds absent on the right. Chest X-ray: 2/3 collapse of the right lung, pleural pneumothorax capping a dense horizontal air-fluid level, with contralateral mediastinal displacement.',
    questions: [
      { num: 1, text: 'What acute life-threatening complication has occurred?' },
      { num: 2, text: 'Describe the pathogenesis and anatomical subtypes of this condition.' },
      { num: 3, text: 'How is this differentiated from simple spontaneous pneumothorax?' },
      { num: 4, text: 'What emergency pleural drainage procedure and technique are required?' },
      { num: 5, text: 'How is a persistent large bronchopleural fistula managed?' }
    ],
    answers: [
      { num: 1, text: 'Acute tension pyopneumothorax on the right (rupture of a subpleural lung abscess into the pleural space with bronchopleural fistulization) and pleuropulmonary shock.' },
      { num: 2, text: 'Necrotic rupture of subpleural abscess into the negative-pressure pleural cavity, introducing air and purulent fluid, resulting in lung collapse and mediastinal shift with vena caval kinking. Types: Closed, Open, and Tension/Valvular (most dangerous).' },
      { num: 3, text: 'Pre-existing suppurative lung disease, systemic toxemia, and radiologic presence of a distinct horizontal air-fluid level (purulent exudate) in addition to pleural air.' },
      { num: 4, text: 'Immediate needle decompression followed by tube thoracostomy with dual chest drains: one in the 2nd intercostal space at the midclavicular line (air evacuation) and one in the 7th/8th interspace at the posterior axillary line (fluid drainage), connected to underwater seal (Bülau) or continuous negative suction.' },
      { num: 5, text: 'Endobronchial valve placement / endoscopic bronchial occlusion; if unsealed: thoracotomy with fistula repair, decortication, or lobectomy.' }
    ]
  },
  {
    id: 51,
    number: 5,
    topicId: 'thoracic_suppuration',
    topicTitleEn: 'Suppurative Lung Diseases & Abscess',
    stem: 'A 46-year-old male presents with persistent cough producing 100–150 mL/day of foul purulent sputum, low-grade fevers, exertional dyspnea, fatigue, and an 8 kg weight loss. History: 4 months ago, he was treated medically for an acute right middle lobe lung abscess and discharged with partial improvement. Complete resolution never occurred. High-resolution chest CT shows a 5x4 cm thick-walled cavity with a dense fibrous wall, an air-fluid level, adjacent cicatrising pneumosclerosis, and localized pleural thickening in the right middle lobe.',
    questions: [
      { num: 1, text: 'Formulate the complete diagnosis.' },
      { num: 2, text: 'What is the time threshold for transition from acute to chronic lung abscess?' },
      { num: 3, text: 'What are the structural and histopathological characteristics of a chronic abscess?' },
      { num: 4, text: 'Why is medical therapy unable to achieve cure in chronic abscess?' },
      { num: 5, text: 'What is the definitive treatment of choice? Name the specific surgery.' }
    ],
    answers: [
      { num: 1, text: 'Chronic lung abscess of the right middle lobe, exacerbation phase; localized fibro-atelectasis/pneumosclerosis.' },
      { num: 2, text: 'Persistence of a cavitary lesion with rigid walls beyond 2 months (8–10 weeks) defines transition from acute to chronic lung abscess.' },
      { num: 3, text: 'Development of a thick, rigid three-layered fibrous capsule: inner pyogenic/granulation layer, middle mature collagenous fibrous layer, and outer perimeter of dense pneumosclerosis with obliterated vessels.' },
      { num: 4, text: 'The rigid, unyielding fibrous shell prevents cavity collapse and cicatricial obliteration, while impaired microvasculature prevents therapeutic antibiotic delivery.' },
      { num: 5, text: 'Definitive elective surgical resection following preoperative bronchial toilet: right middle lobectomy (anatomic lobectomy).' }
    ]
  }
];
