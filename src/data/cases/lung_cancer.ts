import { ClinicalCase } from '../../types';

export const lungCancerCases: ClinicalCase[] = [
  {
    id: 56,
    number: 1,
    topicId: 'lung_cancer',
    topicTitleEn: 'Lung Cancer & Mediastinal Tumors',
    stem: 'A 58-year-old male with a 35 pack-year smoking history presents with a persistent irritating cough progressing to mucopurulent sputum with streaks of bright red blood ("raspberry jelly" appearance), low-grade fevers, exertional dyspnea, and a 6 kg weight loss over 3 months. Physical exam: marked dullness to percussion below the right clavicle with absent breath sounds over the right upper zone. Chest X-ray demonstrates dense triangular consolidation/collapse of the right upper lobe with upward retraction of the horizontal fissure forming the classic Golden S-curve sign; the right hilum is enlarged and irregular.',
    questions: [
      { num: 1, text: 'Formulate the preliminary clinical diagnosis.' },
      { num: 2, text: 'Describe the anatomical classification of lung cancer and identify this patient\'s form.' },
      { num: 3, text: 'What are the main histological classifications of lung cancer?' },
      { num: 4, text: 'What is the gold standard diagnostic procedure for histological confirmation?' },
      { num: 5, text: 'Outline the clinical TNM staging workup.' },
      { num: 6, text: 'What are the principles and standard procedures for radical surgical resection?' }
    ],
    answers: [
      { num: 1, text: 'Central bronchogenic carcinoma of the right upper lobe bronchus complicated by complete obstructive lobar atelectasis.' },
      { num: 2, text: '1) Central (originates in main, lobar, or segmental bronchi — 70-80%); 2) Peripheral (originates in subsegmental bronchi or alveolar parenchyma — 20-30%); 3) Atypical forms (Pancoast, mediastinal). This patient has central right upper lobe cancer.' },
      { num: 3, text: '1) Non-Small Cell Lung Cancer (NSCLC, ~85%): Squamous cell carcinoma, Adenocarcinoma, and Large-cell carcinoma; 2) Small Cell Lung Cancer (SCLC, ~15%, neuroendocrine and highly aggressive).' },
      { num: 4, text: 'Flexible fiberoptic bronchoscopy (FOB) with direct endobronchial forceps biopsy, brush cytology, and bronchoalveolar lavage.' },
      { num: 5, text: 'Contrast-enhanced chest/abdominal CT, whole-body PET-CT, brain MRI, and Endobronchial Ultrasound Transbronchial Needle Aspiration (EBUS-TBNA) for mediastinal lymph node staging.' },
      { num: 6, text: 'For resectable stages (I–IIIA NSCLC): anatomic right upper lobectomy (or sleeve lobectomy / pneumonectomy) combined with systematic ipsilateral mediastinal lymphadenectomy (ND2).' }
    ]
  },
  {
    id: 57,
    number: 2,
    topicId: 'lung_cancer',
    topicTitleEn: 'Lung Cancer & Mediastinal Tumors',
    stem: 'A 62-year-old non-smoking male was found to have an incidental solitary pulmonary nodule measuring 3.5 cm in the posterior basal segment of the left lower lobe (S10) on routine screening chest radiography. The mass exhibits lobulated, irregular polycyclic margins with radiating spicules (corona radiata sign). He is entirely asymptomatic. Physical examination and peripheral lymph nodes are normal. Pulmonary function tests show FVC 95% of predicted. Flexible bronchoscopy demonstrates normal endobronchial anatomy down to subsegmental levels.',
    questions: [
      { num: 1, text: 'Formulate the preliminary diagnosis.' },
      { num: 2, text: 'Why was flexible bronchoscopy non-diagnostic in this case?' },
      { num: 3, text: 'What is the differential diagnosis of a solitary pulmonary nodule (SPN)?' },
      { num: 4, text: 'What techniques provide histological verification of a peripheral lung nodule?' },
      { num: 5, text: 'What is the surgical management and resection strategy?' }
    ],
    answers: [
      { num: 1, text: 'Peripheral bronchogenic carcinoma of the left lower lobe (probable adenocarcinoma), asymptomatic early stage (cT2aN0M0).' },
      { num: 2, text: 'Peripheral lung tumors arise beyond the subsegmental bronchi in peripheral small airways and parenchyma, remaining invisible to direct visualization during standard bronchoscopy.' },
      { num: 3, text: 'Tuberculoma, pulmonary hamartoma, solitary hematogenous metastasis (renal/colorectal primary), organized focal pneumonia, and echinococcal cyst.' },
      { num: 4, text: 'CT-guided percutaneous transthoracic core-needle biopsy or VATS wedge resection with intraoperative frozen-section histology.' },
      { num: 5, text: 'Anatomical video-assisted thoracoscopic (VATS) left lower lobectomy with systematic mediastinal nodal dissection (radical lymphadenectomy).' }
    ]
  },
  {
    id: 58,
    number: 3,
    topicId: 'lung_cancer',
    topicTitleEn: 'Lung Cancer & Mediastinal Tumors',
    stem: 'A 54-year-old chronic smoker presents with intractable right shoulder and scapular pain radiating along the ulnar border of the forearm to the 4th and 5th digits, hand paresthesias, progressive upper extremity weakness, and a drooping right eyelid. He had been treated by a neurologist for "cervical radiculopathy" without relief. Physical exam: right-sided ptosis, miosis, enophthalmos, and hemifacial anhidrosis (Horner\'s syndrome); wasting of the intrinsic muscles of the right hand. Chest CT reveals an invasive tumor at the apex of the right lung invading the 1st and 2nd ribs, Th1–Th2 transverse processes, and the inferior trunk of the brachial plexus.',
    questions: [
      { num: 1, text: 'State the diagnosis, eponymous tumor name, and neurological syndromes.' },
      { num: 2, text: 'Explain the mechanism producing Horner\'s syndrome.' },
      { num: 3, text: 'Why do pain and paresthesias radiate specifically along the ulnar nerve distribution?' },
      { num: 4, text: 'What is the T-stage classification for this invasive tumor?' },
      { num: 5, text: 'What is the multimodal treatment protocol for superior sulcus tumors?' }
    ],
    answers: [
      { num: 1, text: 'Superior sulcus tumor of the right lung apex (Pancoast-Tobias tumor) with Horner\'s syndrome and brachial plexus invasion.' },
      { num: 2, text: 'Direct neoplastic infiltration of the paravertebral sympathetic chain and stellate ganglion (cervicothoracic ganglion), causing loss of ipsilateral sympathetic tone.' },
      { num: 3, text: 'Compression and invasion of the inferior trunk of the brachial plexus and ventral rami of C8–T1 roots, which supply the ulnar nerve distribution and intrinsic hand muscles.' },
      { num: 4, text: 'Category T4 (invasion of the brachial plexus, vertebral bodies, or subclavian vessels).' },
      { num: 5, text: 'Trimodality protocol: induction concurrent chemoradiotherapy followed by en bloc radical surgical resection (lobectomy with chest wall, rib, and brachial plexus resection) and adjuvant systemic therapy.' }
    ]
  },
  {
    id: 59,
    number: 4,
    topicId: 'lung_cancer',
    topicTitleEn: 'Lung Cancer & Mediastinal Tumors',
    stem: 'A 60-year-old male with a 40 pack-year smoking history presents with resting dyspnea, nonproductive hacking cough, left-sided thoracic aching, fatigue, low-grade fevers, and weight loss. Physical exam: left hemithorax is retracted with narrowed interspaces and absent respiratory excursions. Flat dullness to percussion and complete absence of breath sounds throughout the entire left lung. Trachea and cardiac apex impulse are severely shifted to the left. Chest X-ray: complete opacification of the left hemithorax with ipsilateral mediastinal shift and elevated left hemidiaphragm. Bronchoscopy shows the left mainstem bronchus completely occluded 1.5 cm from the main carina by an exophytic, friable, bleeding mass.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'Explain the mechanism of total left hemithoracic opacification and ipsilateral mediastinal shift.' },
      { num: 3, text: 'What conditions cause total hemithorax opacification and how are they differentiated by mediastinal position?' },
      { num: 4, text: 'What are the anatomical criteria for surgical resectability when the main bronchus is involved?' },
      { num: 5, text: 'What radical surgical resection is indicated?' }
    ],
    answers: [
      { num: 1, text: 'Central bronchogenic carcinoma of the left mainstem bronchus with complete obstructive atelectasis of the left lung; respiratory failure Grade II.' },
      { num: 2, text: 'Complete tumor blockage of the left mainstem bronchus resulted in complete alveolar gas resorption and total left lung atelectasis; high negative intrapleural pressure pulls the mediastinum, trachea, and heart toward the ipsilateral side.' },
      { num: 3, text: '1) Total obstructive atelectasis (mediastinum shifted TOWARD the affected side); 2) Massive pleural effusion/empyema (mediastinum shifted AWAY toward the healthy side); 3) Post-pneumonectomy state.' },
      { num: 4, text: 'Distance from the proximal tumor margin to the tracheobronchial carina must be ≥1.5–2 cm to ensure a negative resection margin without requiring complex carinal resection.' },
      { num: 5, text: 'Left radical pneumonectomy with systematic ipsilateral mediastinal lymphadenectomy.' }
    ]
  },
  {
    id: 60,
    number: 5,
    topicId: 'lung_cancer',
    topicTitleEn: 'Lung Cancer & Mediastinal Tumors',
    stem: 'A 56-year-old male presents with sudden puffiness and swelling of the face, neck, and upper extremities, a bursting cephalic fullness exacerbated by bending forward (positive "shoelace sign"), hoarseness, dyspnea, and upper torso cyanosis progressing over 1 month. Physical exam: massive soft tissue edema of the face and neck (classic "Stokes\' collar"), cyanotic lips and ears, and prominent dilated, tortuous venous collaterals across the anterior chest wall and shoulders. Chest CT reveals central right lung carcinoma with a bulky mediastinal nodal conglomerate circularly compressing and invading the superior vena cava (residual lumen narrowed to 2 mm).',
    questions: [
      { num: 1, text: 'State the complete diagnosis and identify the life-threatening vascular syndrome.' },
      { num: 2, text: 'Explain the pathophysiology and collateral flow in Superior Vena Cava (SVC) syndrome.' },
      { num: 3, text: 'Why did the patient develop hoarseness (dysphonia)?' },
      { num: 4, text: 'What urgent palliative and endovascular interventions are indicated?' },
      { num: 5, text: 'Compare treatment strategies for NSCLC versus SCLC presenting with SVC syndrome.' }
    ],
    answers: [
      { num: 1, text: 'Central bronchogenic carcinoma of the right lung with mediastinal nodal metastasis complicated by acute Superior Vena Cava (SVC) Syndrome and recurrent laryngeal nerve palsy.' },
      { num: 2, text: 'Extrinsic compression and thrombosis of the thin-walled SVC by mediastinal nodal conglomerates, producing marked venous hypertension in the upper body (>200-400 mm H2O), cerebral and laryngeal edema, and venous diversion via azygos/thoracoepigastric collateral veins.' },
      { num: 3, text: 'Infiltration/compression of the recurrent laryngeal nerve by metastatic mediastinal lymph nodes, resulting in vocal cord paralysis.' },
      { num: 4, text: '1) Head-up posture and oxygenation; 2) High-dose IV dexamethasone (16–24 mg/day) and loop diuretics; 3) Emergency endovascular SVC stenting (self-expanding metallic stent), providing rapid symptom relief in >90% of cases.' },
      { num: 5, text: 'For SCLC: urgent systemic combination chemotherapy (EP protocol) with concurrent radiation (highly responsive). For NSCLC: primary SVC stenting followed by radiation or targeted/chemoimmunotherapy.' }
    ]
  }
];
