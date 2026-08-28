import { ClinicalCase } from '../../types';

export const esophagusCases: ClinicalCase[] = [
  {
    id: 31,
    number: 1,
    topicId: 'esophagus',
    topicTitleEn: 'Esophagus: Strictures, Burns & Achalasia',
    stem: 'Patient V., 37 years old, was admitted with progressive dysphagia, regurgitation, and retrosternal pain radiating to both shoulder blades for 3 years. She lost 15 kg. She used maneuvers to assist swallowing (gulping air, contracting neck/chest muscles, drinking warm water) and noted paradoxical dysphagia (solid food passes more easily than liquid). Barium swallow shows a massively dilated, elongated, tortuous (megaesophagus) and hypotonic esophagus containing fasting fluid, with smooth tapering at the gastroesophageal junction in a classic "bird\'s beak" or "candle-flame" configuration. The gastric air bubble is absent.',
    questions: [
      { num: 1, text: 'What is dysphagia? List its primary etiologies and clinical forms.' },
      { num: 2, text: 'What is the specific diagnosis for patient V.?' },
      { num: 3, text: 'Define this disease and describe its etiology and pathogenesis.' },
      { num: 4, text: 'What are the clinical and radiologic stages of achalasia?' },
      { num: 5, text: 'List the hallmark clinical and radiological features.' },
      { num: 6, text: 'What are the medical, endoscopic, and surgical modalities of treatment?' }
    ],
    answers: [
      { num: 1, text: 'Dysphagia is difficulty in swallowing and transporting food through the esophagus. Categories: Oropharyngeal vs Esophageal (mechanical/structural vs neuromuscular motility disorders). Types: painful (dolorosa), paradoxical (paradoxalis — solids pass easier than liquids), intermittent, and progressive.' },
      { num: 2, text: 'Achalasia of the cardia (cardiospasm), Stage III (marked dilatation with structural narrowing of the lower esophageal sphincter).' },
      { num: 3, text: 'Primary esophageal motility disorder characterized by incomplete lower esophageal sphincter (LES) relaxation and aperistalsis. Pathogenesis involves loss of inhibitory ganglion cells in the myenteric (Auerbach\'s) plexus.' },
      { num: 4, text: 'Stage I: intermittent functional spasm without dilation; Stage II: persistent spasm with moderate dilation (<4 cm); Stage III: organic fibromuscular changes with marked dilation (>4 cm); Stage IV: sigmoidal megaesophagus with severe atony and erosive stasis esophagitis.' },
      { num: 5, text: 'Clinical triad: dysphagia, regurgitation ("wet pillow sign"), and retrosternal spasm. Radiology: "bird\'s beak" / "candle flame" tapering of distal esophagus, proximal megaesophagus with air-fluid level, and absent gastric bubble.' },
      { num: 6, text: '1) Pharmacotherapy: calcium channel blockers / nitrates (bridge only). 2) Endoscopic: graded pneumatic balloon dilation or POEM (peroral endoscopic myotomy). 3) Surgical: laparoscopic Heller cardiomyotomy with partial anterior Dor (or Toupet) fundoplication to prevent reflux.' }
    ]
  },
  {
    id: 32,
    number: 2,
    topicId: 'esophagus',
    topicTitleEn: 'Esophagus: Strictures, Burns & Achalasia',
    stem: 'Patient Zh., 42 years old, while intoxicated in his garage, accidentally ingested an alkali solution. He was hospitalized in the ICU with toxic shock for 10 days, then transferred to the medical ward for conservative care and prophylactic bougienage. After transient symptom improvement, he was prematurely discharged for disciplinary violations. One month post-discharge, severe progressive dysphagia to solid foods returned and worsened, prompting referral to thoracic surgery.',
    questions: [
      { num: 1, text: 'Compare acid vs alkali chemical burns of the esophagus and list the pathological healing stages.' },
      { num: 2, text: 'What are the clinical stages and acute first-aid measures for caustic ingestion?' },
      { num: 3, text: 'What is the medical regimen in the hospital, and what is bougienage?' },
      { num: 4, text: 'What types of bougienage are classified by timing of performance?' },
      { num: 5, text: 'What explains initial acute dysphagia versus late recurrent dysphagia 1 month later?' },
      { num: 6, text: 'What diagnostic studies should the thoracic surgeon order?' }
    ],
    answers: [
      { num: 1, text: 'Alkalis produce deep colliquative (liquefaction) necrosis with saponification penetrating the muscularis into mediastinal structures; acids produce superficial coagulative necrosis with an eschar that limits penetration. Pathologic stages: 1) hyperemia/edema, 2) necrosis and ulceration, 3) granulation tissue, 4) cicatrization/stricture.' },
      { num: 2, text: 'Clinical stages: 1) acute phase (pain, shock, acute dysphagia), 2) latent/deceptive latent phase (mucosal re-epithelialization), 3) cicatricial stricture formation (progressive dysphagia). Acute care: IV analgesia, neutral gastric lavage, and anti-shock resuscitation.' },
      { num: 3, text: 'Antibiotics, systemic corticosteroids (to inhibit excessive granulation and collagen deposition), oral oils, and bougienage (mechanical lumen dilation using graded dilators).' },
      { num: 4, text: 'Early (prophylactic) bougienage: initiated on post-burn days 8–10 to prevent stricture formation; Late (therapeutic) bougienage: performed once a mature fibrous stricture is established (after 1–2 months).' },
      { num: 5, text: 'Early dysphagia is functional (edema and inflammatory spasm); late recurrent dysphagia is structural due to dense collagen contraction and luminal narrowing during the cicatrization phase.' },
      { num: 6, text: 'Contrast barium esophagogram (to define stricture level, length, and caliber) and flexible esophagoscopy under direct visualization.' }
    ]
  },
  {
    id: 33,
    number: 3,
    topicId: 'esophagus',
    topicTitleEn: 'Esophagus: Strictures, Burns & Achalasia',
    stem: 'Patient E., 43 years old, suffered an esophageal chemical burn 5 years ago. Since then, he underwent recurrent courses of bougienage for cicatricial stricture, each providing temporary relief for ≤6 months. He now presents with complete aphagia/dysphagia (even liquids cannot pass), severe cachexia (-25 kg weight loss), and painful calf cramps (hypocalcemia/dehydration). He is emaciated, pulse 100 bpm, BP 90/60 mmHg, with oliguria. Historical films showed a 0.3 cm narrowing below the aortic arch; current barium swallow reveals complete esophageal obliteration terminating blindly at the aortic arch level.',
    questions: [
      { num: 1, text: 'What is the complete diagnosis?' },
      { num: 2, text: 'What techniques of bougienage are used in esophageal strictures?' },
      { num: 3, text: 'Outline the diagnostic workup and nutritional preparation.' },
      { num: 4, text: 'What is the surgical treatment strategy? When and what procedures are indicated?' },
      { num: 5, text: 'What are the indications for surgery in cicatricial strictures, and what types of esophagoplasty exist?' }
    ],
    answers: [
      { num: 1, text: 'Post-burn cicatricial stricture of the thoracic esophagus, Grade IV (complete fibrous obliteration). Severe alimentary cachexia, dehydration, and electrolyte depletion.' },
      { num: 2, text: '1) Blind transoral bougienage; 2) Endoscopically guided bougienage; 3) Wire-guided bougienage (Savary-Gilliard); 4) Retrograde bougienage "without end" via gastrostomy using an endless string.' },
      { num: 3, text: 'Contrast esophagography, endoscopy, and CT. Immediate resuscitation: parenteral hydration, electrolyte correction, and creation of a feeding gastrostomy (Witzel/Kader/PEG) for enteral refeeding prior to major reconstruction.' },
      { num: 4, text: 'Two-stage surgical strategy: Stage 1 — feeding gastrostomy and aggressive nutritional rehabilitation for 1.5–3 months; Stage 2 — elective esophageal reconstruction (esophagoplasty).' },
      { num: 5, text: 'Indications for surgery: complete lumen obliteration, failed bougienage, rapid recurrent restonosis, or instrumental perforation. Types of esophagoplasty: Gastric pull-up / gastric conduit (Ivor Lewis or retrosternal), Colonic interposition (substernal colon graft by Yudin/Hertzen), or Roux-en-Y jejunal transposition.' }
    ]
  },
  {
    id: 34,
    number: 4,
    topicId: 'esophagus',
    topicTitleEn: 'Esophagus: Strictures, Burns & Achalasia',
    stem: 'Patient S., 35 years old, accidentally ingested several sips of concentrated acetic acid essence 1 year ago. She immediately drank large amounts of water and was treated in the medical ward without toxic shock. She remained asymptomatic until 1 month ago, when progressive solid-food dysphagia developed. She was admitted to thoracic surgery in satisfactory condition. Barium swallow demonstrates a focal, concentric narrowing of the midthoracic esophagus to 0.5 cm in diameter over a 1.5 cm segment, with minimal proximal dilation.',
    questions: [
      { num: 1, text: 'What is the specific diagnosis for patient S.?' },
      { num: 2, text: 'What diagnostic examinations are indicated?' },
      { num: 3, text: 'What is the treatment plan and specific method of bougienage in this patient?' },
      { num: 4, text: 'Are there indications for major surgical resection/esophagoplasty in this patient?' }
    ],
    answers: [
      { num: 1, text: 'Post-burn cicatricial stricture of the midthoracic esophagus, Grade III (focal short-segment narrowing, 0.5 cm diameter).' },
      { num: 2, text: 'Barium esophagogram in multiple projections, flexible fiberoptic esophagoscopy (EGD) to assess mucosal margins, CBC, and ECG.' },
      { num: 3, text: 'Endoscopic conservative dilatation: wire-guided bougienage under fluoroscopic/endoscopic control (or balloon dilatation) with progressive sizing (Savary dilators from Fr 24 to Fr 36–40), combined with antispasmodics.' },
      { num: 4, text: 'No indication for major surgical resection or esophagoplasty; the focal (1.5 cm) short stricture is ideal for endoscopic balloon dilation or wire-guided bougienage.' }
    ]
  }
];
