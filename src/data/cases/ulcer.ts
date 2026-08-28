import { ClinicalCase } from '../../types';

export const ulcerCases: ClinicalCase[] = [
  {
    id: 66,
    number: 1,
    topicId: 'ulcer',
    topicTitleEn: 'Peptic Ulcer Disease & Complications',
    crossTopicIds: ['peritonitis'],
    stem: 'A 34-year-old male was rushed to the ER 2 hours after acute onset of sudden, agonizing "dagger-like" epigastric pain, diaphoresis, and weakness. He has a 5-year history of duodenal ulcer. Physical exam: lies motionless on his right side with hips and knees flexed; pale, cold clammy sweat, anxious facies. Pulse 60 bpm (reflex vagal bradycardia), BP 100/60 mmHg. Abdomen is scaphoid, completely motionless during respiration. Palpation demonstrates generalized "board-like" muscular rigidity and exquisite tenderness in all quadrants (De Quervain sign). Blumberg sign is markedly positive throughout. Hepatic dullness is absent on percussion (Spizharny sign). Plain upright abdominal X-ray reveals a free subdiaphragmatic crescent of gas under the right hemidiaphragm.',
    questions: [
      { num: 1, text: 'Formulate the complete diagnosis and determine the clinical phase.' },
      { num: 2, text: 'Describe Mondor\'s classic triad of perforated peptic ulcer.' },
      { num: 3, text: 'What are the three clinical stages/phases of perforated peptic ulcer?' },
      { num: 4, text: 'What acute abdominal emergencies require differential diagnosis?' },
      { num: 5, text: 'What is the immediate surgical strategy and choice of operative procedures?' }
    ],
    answers: [
      { num: 1, text: 'Peptic ulcer disease of the duodenum, acute free perforation into the peritoneal cavity; acute diffuse chemical peritonitis, Stage 1 (abdominal shock phase).' },
      { num: 2, text: 'Mondor\'s classic triad: 1) Sudden explosive "dagger-like" epigastric pain; 2) "Board-like" abdominal wall muscular rigidity; 3) Ulcer history.' },
      { num: 3, text: '1) Chemical peritonitis / abdominal shock phase (0–6 h): excruciating pain, board-like rigidity, vagal bradycardia, pneumoperitoneum; 2) Illusory/latent improvement phase (6–12 h): pain dulls, rigidity relaxes, but tachycardia, dry tongue, and leukocytosis worsen; 3) Bacterial purulent peritonitis phase (>12–24 h): abdominal distension, severe sepsis, paralytic ileus.' },
      { num: 4, text: 'Acute pancreatitis, acute appendicitis, acute cholecystitis, acute mesenteric ischemia, renal colic, and inferior myocardial infarction.' },
      { num: 5, text: 'Emergency laparoscopic/open surgery: primary transverse closure with omental patch repair (Graham/Oppel-Polikarpov omentoplasty — gold standard), extensive peritoneal irrigation and drainage, followed by postoperative IV PPIs and H. pylori eradication.' }
    ]
  },
  {
    id: 67,
    number: 2,
    topicId: 'ulcer',
    topicTitleEn: 'Peptic Ulcer Disease & Complications',
    stem: 'A 45-year-old male with a history of duodenal ulcer noticed that his typical intense hunger and nocturnal epigastric pains suddenly vanished over the past 24 hours (Bergmann\'s sign). However, hours later he developed profound asthenia, dizziness, tinnitus, diaphoresis, followed by coffee-ground vomiting (~300 mL) and voluminous foul, pitch-black tarry stools (melena). Physical exam: pale skin, pulse 110 bpm, BP 90/60 mmHg. Abdomen is soft, mild tenderness in epigastrium without peritoneal signs. Blood: Hb 78 g/L, RBC 2.6 x 10¹²/L, Hct 26%. Emergency EGD: a 1.2 cm ulcer on the posterior duodenal wall with a visible vessel/adherent clot oozing fresh blood (Forrest Ib/IIa).',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis and stratify the severity of blood loss.' },
      { num: 2, text: 'Explain the mechanism of Bergmann\'s sign (sudden cessation of ulcer pain).' },
      { num: 3, text: 'Describe the Forrest classification of endoscopic bleeding stigmata.' },
      { num: 4, text: 'What endoscopic modalities are used for multimodal dual hemostasis?' },
      { num: 5, text: 'What are the indications for emergency surgery in bleeding peptic ulcer?' }
    ],
    answers: [
      { num: 1, text: 'Peptic ulcer disease of the duodenum complicated by acute upper gastrointestinal bleeding (Forrest Ib/IIa); moderate-to-severe acute posthemorrhagic anemia.' },
      { num: 2, text: 'Intraluminal alkaline extravasated blood buffers and neutralizes gastric hydrochloric acid, eliminating chemical irritation of exposed nerve endings in the ulcer crater.' },
      { num: 3, text: 'Forrest classification: I: Active bleeding (Ia spurting arterial, Ib oozing); II: Recent hemorrhage stigmata (IIa non-bleeding visible vessel, IIb adherent clot, IIc flat hematin spot); III: Clean base ulcer without stigmata.' },
      { num: 4, text: 'Dual-modality endoscopic hemostasis: epinephrine injection (1:10,000) combined with mechanical endoclips or thermal argon plasma coagulation (APC), supported by high-dose IV PPI infusion (80 mg bolus followed by 8 mg/hr).' },
      { num: 5, text: 'Refractory active bleeding despite dual endoscopic attempts, second early rebleeding episode, or inability to control hemorrhage endoscopically.' }
    ]
  },
  {
    id: 68,
    number: 3,
    topicId: 'ulcer',
    topicTitleEn: 'Peptic Ulcer Disease & Complications',
    crossTopicIds: ['pancreatitis'],
    stem: 'A 52-year-old male with a 12-year history of duodenal ulcer presents with an alteration of pain pattern: epigastric pain became persistent, severe, unlinked to meals, completely refractory to antacids, and boring straight into the spine and lumbar region. He wakes up at night rocking in bed with flexed legs. Physical exam: deep muscular resistance and point tenderness in the epigastrium. Serum amylase is elevated to 180 U/L (normal <100), urine diastase 128 U. EGD demonstrates a deep, 2.0 cm crateriform callous ulcer on the posterior duodenal bulb wall, the base of which is formed by firm, whitish lobulated tissue (pancreatic parenchyma).',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'What are the diagnostic clinical hallmarks of peptic ulcer penetration?' },
      { num: 3, text: 'Into which adjacent anatomical structures do gastric and duodenal ulcers penetrate?' },
      { num: 4, text: 'What are the three morphological stages of ulcer penetration?' },
      { num: 5, text: 'What is the surgical strategy and operative management for deep penetrating duodenal ulcers?' }
    ],
    answers: [
      { num: 1, text: 'Chronic peptic ulcer disease; callous ulcer of the posterior duodenal wall with transmural penetration into the head/body of the pancreas (Stage III); reactive focal pancreatitis.' },
      { num: 2, text: '1) Loss of meal periodicity with constant unremitting pain; 2) Characteristic radiation to the spine/back; 3) Complete failure of antacids; 4) Secondary elevation of serum/urinary amylase.' },
      { num: 3, text: 'Duodenal ulcers: head/body of pancreas, hepatoduodenal ligament, gallbladder, and biliary ducts. Gastric ulcers: lesser omentum, left hepatic lobe, pancreas body, and transverse mesocolon.' },
      { num: 4, text: 'Stage I: transmural ulceration reaching the serosa; Stage II: dense inflammatory adhesion to adjacent organ; Stage III: deep craterous invasion into the parenchyma of the neighboring organ.' },
      { num: 5, text: 'Elective surgery: subtotal gastrectomy (Billroth II / Roux-en-Y) leaving the ulcer crater intact on the pancreatic surface (abandoning the base to prevent pancreatic fistula or fatal arrosion) with safe closure of the difficult duodenal stump (Nissen/Yudin technique).' }
    ]
  },
  {
    id: 69,
    number: 4,
    topicId: 'ulcer',
    topicTitleEn: 'Peptic Ulcer Disease & Complications',
    crossTopicIds: ['obstruction'],
    stem: 'A 49-year-old male with a 15-year history of duodenal ulcer presents with intractable daily vomiting of stagnant food eaten 1–2 days earlier with a sour/putrid odor, severe epigastric fullness, and a 10 kg weight loss over 3 months. He regularly self-induces vomiting to obtain relief. Physical exam: cachectic, skin turgor reduced, dry mucous membranes. Visible gastric peristalsis waves in the upper abdomen; succussion splash positive on fasting. Labs: hypokalemia (K+ 2.8 mmol/L), hypochloremia (Cl- 82 mmol/L), metabolic alkalosis, BUN 11.2 mmol/L. Barium fluoroscopy reveals a massively dilated hypotonic stomach extending into the pelvis with >50% barium retention at 24 hours and a pyloric channel narrowed to 2 mm.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'Describe the three clinical stages of peptic pyloroduodenal stenosis.' },
      { num: 3, text: 'Explain the pathophysiological mechanism of hypochloremic hypokalemic alkalosis.' },
      { num: 4, text: 'Describe the intensive preoperative preparation and gastric decompression protocol.' },
      { num: 5, text: 'What are the surgical procedures of choice for decompensated cicatricial stenosis?' }
    ],
    answers: [
      { num: 1, text: 'Chronic duodenal peptic ulcer; decompensated cicatricial pyloroduodenal stenosis (gastric outlet obstruction); severe hypochloremic hypokalemic metabolic alkalosis and cachexia.' },
      { num: 2, text: '1) Compensated stage (gastric muscular hypertrophy, delay 6–12 h); 2) Subcompensated stage (vomiting of ingested food, barium retention 12–24 h); 3) Decompensated stage (gastric atony, permanent gastric dilation, severe hypokalemic alkalosis, >24 h barium retention).' },
      { num: 3, text: 'Massive unbuffered loss of hydrochloric acid (H+, Cl-) and potassium with vomited gastric juice leads to profound hypochloremic, hypokalemic metabolic alkalosis, intracellular K+/H+ shift, renal bicarbonate retention, and dehydration.' },
      { num: 4, text: 'Intensive 5–7 day preparation: daily evening nasogastric lavage to evacuate foul residues and restore muscular tone; IV replacement of potassium chloride and normal saline; parenteral and enteral nutritional support.' },
      { num: 5, text: 'Distal subtotal gastrectomy (Billroth I, Billroth II, or Roux-en-Y) is the procedure of choice; in frail high-risk patients: truncal or selective vagotomy with duodenoplasty / gastrojejunostomy.' }
    ]
  },
  {
    id: 70,
    number: 5,
    topicId: 'ulcer',
    topicTitleEn: 'Peptic Ulcer Disease & Complications',
    crossTopicIds: ['peritonitis', 'appendicitis'],
    stem: 'A 38-year-old male presents with dull right lower quadrant (RLQ) and right hypochondriac pain with low-grade fever (37.6°C). History: 18 hours ago, he experienced sudden explosive "dagger-like" epigastric pain that forced him to drop to the floor. However, within 1.5–2 hours, the epigastric agony subsided substantially and shifted down along the right paracolic gutter into the right iliac fossa. Physical exam: pulse 84 bpm. Epigastrium is soft with mild tenderness; right hypochondrium and right iliac fossa show localized muscular guarding and positive Blumberg sign. Ultrasound shows a small encapsulated fluid layer in the subhepatic space. Plain upright chest/abdominal X-ray shows no free subdiaphragmatic air.',
    questions: [
      { num: 1, text: 'Formulate the specific clinical diagnosis taking into account the perforated subtype.' },
      { num: 2, text: 'Explain the mechanism of sealed/covered ulcer perforation (perforatio tecta).' },
      { num: 3, text: 'Why did the pain shift along the right paracolic gutter into the right iliac fossa?' },
      { num: 4, text: 'What diagnostic investigations (including pneumogastrography) are indicated?' },
      { num: 5, text: 'What is the definitive surgical management for sealed peptic ulcer perforation?' }
    ],
    answers: [
      { num: 1, text: 'Peptic ulcer disease of the duodenum; covered/sealed perforation of duodenal ulcer (perforatio tecta); localized right paracolic peritonitis.' },
      { num: 2, text: 'The small perforation site is spontaneously sealed from the peritoneal side by adherence of the greater omentum, visceral undersurface of the liver, gallbladder, or dense fibrinous exudate, halting continued peritoneal leak.' },
      { num: 3, text: 'Gastroduodenal fluid released at initial perforation tracked down the right paracolic gutter into the right iliac fossa, causing secondary localized peritoneal inflammation mimicking acute appendicitis.' },
      { num: 4, text: '1) Diagnostic pneumogastrography (air insufflation via NG tube followed by repeat plain X-ray to demonstrate subdiaphragmatic air); 2) Contrast-enhanced CT; 3) Diagnostic laparoscopy.' },
      { num: 5, text: 'Surgical exploration (laparoscopic or open): confirmation of the perforation site, primary closure with omentoplasty, peritoneal debridement, and abdominal drainage.' }
    ]
  }
];
