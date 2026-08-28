import { ClinicalCase } from '../../types';

export const pleuralCases: ClinicalCase[] = [
  {
    id: 52,
    number: 1,
    topicId: 'pleural',
    topicTitleEn: 'Pleural Diseases & Pneumothorax',
    stem: 'A 24-year-old tall asthenic male (height 188 cm, weight 68 kg) experienced sudden sharp right-sided chest pain, irritating dry cough, and acute dyspnea while lifting a box of books. Physical exam: pale, RR 24/min, pulse 90 bpm, BP 120/80 mmHg. The right hemithorax lags on inspiration. Percussion over the right chest reveals hyperresonance (tympany). Breath sounds and vocal fremitus are markedly diminished/absent throughout the right hemithorax. Chest X-ray demonstrates peripheral absence of bronchovascular markings, a visible visceral pleural line of a 50% collapsed right lung, and slight mediastinal shift to the left.',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Explain the underlying etiology and pathogenesis of primary spontaneous pneumothorax.' },
      { num: 3, text: 'Classify pneumothorax based on communication with the atmosphere.' },
      { num: 4, text: 'What are the hallmark signs of tension pneumothorax?' },
      { num: 5, text: 'Describe emergency needle decompression and tube thoracostomy technique.' },
      { num: 6, text: 'What are the indications for video-assisted thoracoscopic surgery (VATS)?' }
    ],
    answers: [
      { num: 1, text: 'Primary spontaneous right-sided pneumothorax, closed type, subtotal (50%) lung collapse; mild-to-moderate respiratory failure.' },
      { num: 2, text: 'Rupture of apical subpleural blebs/bullae in tall, lean individuals due to underlying connective tissue elastosis and high vertical apical transpulmonary pressure gradients.' },
      { num: 3, text: '1) Closed (non-progressive, stable); 2) Open (communicating freely with atmosphere); 3) Tension / Valvular (one-way valve allowing air entry on inspiration but trapping it during expiration, causing positive intrapleural pressure).' },
      { num: 4, text: 'Severe respiratory distress, cyanosis, hypotension, distended neck veins, subcutaneous emphysema, and dramatic contralateral mediastinal/tracheal shift.' },
      { num: 5, text: 'Tube thoracostomy in the 2nd intercostal space at the midclavicular line (or 4th/5th intercostal space anterior axillary line) connected to an underwater seal (Bülau drain) or active negative suction (-15 to -20 cm H2O).' },
      { num: 6, text: 'Recurrent pneumothorax (second ipsilateral or contralateral episode), continuous air leak >48–72 hours, visible large bullae on CT, hemopneumothorax, or high-risk occupations (pilots, divers). Procedure: VATS apical bullectomy and parietal pleurectomy/chemical pleurodesis.' }
    ]
  },
  {
    id: 53,
    number: 2,
    topicId: 'pleural',
    topicTitleEn: 'Pleural Diseases & Pneumothorax',
    stem: 'A 45-year-old male was referred to thoracic surgery 2 weeks into the course of severe right lower lobe bacterial pneumonia. Despite medical antibiotics, he has persistent hectic fevers (38.8°C), night sweats, progressive dyspnea, fatigue, and right hemithoracic heaviness. Physical exam: right hemithorax lags on inspiration with smoothed intercostal spaces. Percussion reveals stony dullness with an oblique Ellis-Damoisseau curve extending below the scapula; breath sounds and tactile fremitus are absent over the dull region. Diagnostic thoracentesis in the 7th intercostal space yields 800 mL of cloudy, thick, yellowish-green purulent fluid with pH 6.9, protein 45 g/L, and LDH >1200 U/L.',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Describe the three progressive stages of acute pleural empyema.' },
      { num: 3, text: 'State Light\'s criteria differentiating pleural exudate from transudate.' },
      { num: 4, text: 'Describe the drainage strategy and local antiseptic/fibrinolytic therapy.' },
      { num: 5, text: 'When is video-assisted thoracoscopic decortication/debridement indicated?' }
    ],
    answers: [
      { num: 1, text: 'Acute parapneumonic free purulent empyema of the right pleural cavity (fibropurulent stage); respiratory failure Grade II.' },
      { num: 2, text: '1) Exudative stage (sterile free-flowing serous fluid); 2) Fibropurulent stage (bacterial invasion, dense fibrinous loculations, thick pus, pH <7.20); 3) Organizing stage (dense collagenous pleural peel trapping the lung).' },
      { num: 3, text: 'Light\'s criteria for exudate (at least one met): 1) Pleural/serum protein ratio >0.5; 2) Pleural/serum LDH ratio >0.6; 3) Pleural LDH >2/3 the upper limit of normal serum LDH.' },
      { num: 4, text: 'Urgent large-bore (28–32 Fr) tube thoracostomy in the 7th/8th intercostal space with continuous water-seal/suction drainage, antiseptic cavity lavage, and intrapleural fibrinolytics (tPA/DNase) for loculated collections.' },
      { num: 5, text: 'Early VATS debridement and decortication is indicated if tube drainage fails within 48–72 hours or multiloculated fibropurulent septations prevent full lung re-expansion.' }
    ]
  },
  {
    id: 54,
    number: 3,
    topicId: 'pleural',
    topicTitleEn: 'Pleural Diseases & Pneumothorax',
    stem: 'A 55-year-old female presents 4 hours following a motor vehicle collision with blunt chest trauma (steering wheel impact). She complains of sharp left-sided thoracic pain aggravated by breathing, dyspnea, dizziness, and weakness. Physical exam: pale, BP 100/60 mmHg, pulse 104 bpm. Palpation reveals point tenderness and bony crepitus over left ribs 5–7 along the midaxillary line. Percussion reveals dullness extending from the scapular angle downward; breath sounds are significantly reduced at the left base. Thoracentesis in the 7th intercostal space yields dark fluid blood. The blood does not coagulate in a syringe (Ruvilois-Gregoire test negative), and Petrov sign is negative (clear supernatant upon sedimentation).',
    questions: [
      { num: 1, text: 'Formulate the traumatic diagnosis.' },
      { num: 2, text: 'Classify hemothorax by the volume of intrapleural hemorrhage.' },
      { num: 3, text: 'What is the diagnostic significance of the Ruvilois-Gregoire test?' },
      { num: 4, text: 'What are the strict indications for emergency exploratory thoracotomy in hemothorax?' },
      { num: 5, text: 'What is the immediate therapeutic protocol for this patient?' }
    ],
    answers: [
      { num: 1, text: 'Closed blunt thoracic trauma: fractures of left ribs 5–7; moderate left-sided hemothorax with arrested bleeding; mild acute posthemorrhagic anemia.' },
      { num: 2, text: '1) Minimal/small: blood confined to the costophrenic sulcus (<500 mL); 2) Moderate: blood level up to the scapular angle / 4th rib (500–1000 mL); 3) Massive/total: blood level above the scapular spine / 2nd rib (>1000–1500 mL).' },
      { num: 3, text: 'Determines ongoing hemorrhage: if aspirated pleural blood clots in the syringe, bleeding is actively ongoing (fresh active fibrinogen); if it remains liquid/unclotted, bleeding has stopped (defibrinated blood).' },
      { num: 4, text: '1) Immediate drainage of >1000–1500 mL of blood upon chest tube insertion; 2) Persistent bleeding >200–300 mL/hour for 3–4 consecutive hours; 3) Refractory hemodynamic shock; 4) Clotted hemothorax.' },
      { num: 5, text: 'Multi-modal analgesia (intercostal nerve block), tube thoracostomy in the 7th intercostal space (posterior axillary line) to completely evacuate blood and monitor hourly output, fluid resuscitation, and breathing exercises.' }
    ]
  },
  {
    id: 55,
    number: 4,
    topicId: 'pleural',
    topicTitleEn: 'Pleural Diseases & Pneumothorax',
    stem: 'A 50-year-old male is referred to thoracic surgery with exertional dyspnea, persistent tightness in the left chest, low-grade fever, asthenia, and thoracic deformity. Four months ago, he had severe left pneumonia complicated by empyema, managed inconsistently with intermittent needle taps. Physical exam: left hemithorax is contracted with narrowed intercostal spaces, dropped shoulder/scapula, and compensatory scoliosis. Percussion demonstrates flat dullness with absent breath sounds. Chest CT reveals complete collapse of the left lung encased in a dense, calcified fibrous peel (callous/rind) up to 2.5 cm thick, enclosing an irregular residual purulent cavity.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'What is the timeframe for transition from acute to chronic empyema?' },
      { num: 3, text: 'Describe the structural pathology of the pleural peel and entrapped lung ("trapped lung").' },
      { num: 4, text: 'Why are needle drainage and chest tubes ineffective at this stage?' },
      { num: 5, text: 'What is the definitive surgical operation of choice?' }
    ],
    answers: [
      { num: 1, text: 'Chronic postpneumonic left-sided pleural empyema with trapped lung (fibrothorax) and chronic purulent residual cavity; respiratory failure Grade II.' },
      { num: 2, text: 'Failure of empyema resolution beyond 2–3 months (8–12 weeks) with mature rigid fibrous peel formation marks the transition to chronic empyema.' },
      { num: 3, text: 'Fibrin organization with dense collagen deposition and calcification creates an unyielding thick pleural rind (pleural peel) encasing the visceral and parietal pleura, trapping the collapsed lung, narrowing rib spaces, and causing structural scoliosis.' },
      { num: 4, text: 'The rigid calcified fibrous encasement mechanically prevents pulmonary re-expansion even under high negative suction, maintaining a persistent infected rigid cavity.' },
      { num: 5, text: 'Open thoracotomy with radical decortication and pleurectomy (surgical peeling of the thick fibrous membrane from the visceral and parietal pleura) to liberate and re-expand the trapped lung.' }
    ]
  }
];
