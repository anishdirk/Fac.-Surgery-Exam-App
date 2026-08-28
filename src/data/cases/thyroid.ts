import { ClinicalCase } from '../../types';

export const thyroidCases: ClinicalCase[] = [
  {
    id: 75,
    number: 1,
    topicId: 'thyroid',
    topicTitleEn: 'Thyroid & Endocrine Surgery',
    stem: 'A 32-year-old female presents to the endocrine surgery clinic with persistent resting palpitations (pulse 110–120 bpm), heat intolerance, hyperhidrosis, emotional lability, an 8 kg weight loss despite hyperphagia, fine tremors, and progressive bilateral proptosis (exophthalmos). Physical exam: agitated, warm and velvety skin. Ophthalmic signs: Graefe\'s (lid lag on downward gaze), Kocher\'s (lid lag on upward gaze), Dalrymple\'s (wide palpebral fissure), Stellwag\'s (infrequent blinking), and Moebius\' (failure of convergence). Fine distal tremor of outstretched fingers (Marie sign). Thyroid is symmetrically, diffusely enlarged (WHO Grade 2), non-tender, with an audible vascular bruit. Labs: TSH <0.01 mIU/L, free T4 42 pmol/L, anti-TSH receptor antibodies (TRAb) 18 IU/L (markedly elevated).',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Describe the autoimmune pathogenesis of Graves\' disease.' },
      { num: 3, text: 'Detail the thyroid enlargement grading systems (Nikolaev vs WHO).' },
      { num: 4, text: 'Describe the preoperative antithyroid preparation protocol to achieve euthyroidism.' },
      { num: 5, text: 'What is the surgical procedure of choice and how is thyroid storm prevented?' }
    ],
    answers: [
      { num: 1, text: 'Graves\' disease (diffuse toxic goiter, WHO Grade 2 / Nikolaev Grade III); severe thyrotoxicosis; endocrine ophthalmopathy.' },
      { num: 2, text: 'Autoantibodies to the TSH receptor (TRAb) bind and constitutively stimulate follicular cells, driving unregulated autonomous release of T3/T4, uncoupling oxidative phosphorylation, and upregulating beta-adrenergic receptor sensitivity.' },
      { num: 3, text: 'Nikolaev classification (0 to V). WHO classification: Grade 0: No palpable or visible goiter; Grade 1: Palpable nodule/lobe larger than the distal phalanx of the patient\'s thumb, not visible when neck is in normal position; Grade 2: Goiter clearly visible with neck in neutral position and palpable.' },
      { num: 4, text: 'Achieving strict euthyroidism: 1) Thionamides (thiamazole/PTU) to normalize free T4/T3; 2) Beta-blockers (propranolol) to control adrenergic symptoms; 3) Potassium iodide / Lugol\'s solution for 10–14 days preoperatively to induce involution and decrease glandular vascularity and intraoperative bleeding.' },
      { num: 5, text: 'Total thyroidectomy or near-total thyroidectomy (Nikolaev subtotal resection leaving <1–2 g per side). Operating strictly under confirmed clinical and biochemical euthyroidism prevents fatal intraoperative thyroid storm.' }
    ]
  },
  {
    id: 76,
    number: 2,
    topicId: 'thyroid',
    topicTitleEn: 'Thyroid & Endocrine Surgery',
    stem: 'A 45-year-old female is found on routine exam to have a firm, non-tender, relatively fixed 2.5 cm nodule in the right thyroid lobe. Cervical lymph node examination reveals enlarged, firm, non-tender nodes along the right internal jugular chain (Levels III and IV). She is clinically euthyroid. Ultrasound: a 24x18 mm hypoechoic solid nodule in the right lobe with irregular microlobulated margins, taller-than-wide orientation, marked internal vascularity, and clustered microcalcifications (EU-TIRADS 5); lateral cervical lymphadenopathy. Fine-needle aspiration biopsy (FNAB) reveals papillary clusters of atypical thyrocytes with intranuclear pseudoinclusions, longitudinal nuclear grooves ("Orphan Annie eye" nuclei) — classified as Bethesda Category V (suspicious for papillary carcinoma).',
    questions: [
      { num: 1, text: 'Formulate the full oncological diagnosis.' },
      { num: 2, text: 'What are the main ultrasonographic features of thyroid nodule malignancy (TIRADS)?' },
      { num: 3, text: 'Explain the 6-tier Bethesda System for Reporting Thyroid Cytopathology.' },
      { num: 4, text: 'List the major histological subtypes of thyroid carcinoma.' },
      { num: 5, text: 'What is the required surgical procedure, lymphadenectomy, and adjuvant radioiodine therapy?' }
    ],
    answers: [
      { num: 1, text: 'Papillary thyroid carcinoma of the right lobe with lateral cervical lymph node metastases (cT2N1bM0); euthyroid.' },
      { num: 2, text: 'High-suspicion ultrasound criteria (TIRADS 5): 1) Marked hypoechogenicity; 2) Irregular, infiltrative, or microlobulated margins; 3) Taller-than-wide shape; 4) Microcalcifications (<1 mm); 5) Extrathyroidal extension.' },
      { num: 3, text: 'Bethesda categories: I (Non-diagnostic), II (Benign), III (Atypia of Undetermined Significance / Follicular Lesion of Undetermined Significance), IV (Follicular Neoplasm), V (Suspicious for Malignancy), VI (Malignant).' },
      { num: 4, text: '1) Papillary carcinoma (~80–85%, well-differentiated, lymphatic spread); 2) Follicular carcinoma (~10–15%, hematogenous spread to bones/lungs); 3) Medullary carcinoma (~3–5%, C-cell origin, secretes calcitonin, MEN2); 4) Anaplastic carcinoma (<2%, undifferentiated, rapidly fatal).' },
      { num: 5, text: 'Total thyroidectomy with ipsilateral central neck dissection (Level VI) and modified lateral neck dissection (Levels II–V). Postoperatively: Radioiodine ablation (RAI / I-131) and TSH-suppressive levothyroxine therapy with serum thyroglobulin surveillance.' }
    ]
  },
  {
    id: 77,
    number: 3,
    topicId: 'thyroid',
    topicTitleEn: 'Thyroid & Endocrine Surgery',
    stem: 'A 40-year-old female on postoperative day 2 following total thyroidectomy for multinodular toxic goiter complains of progressive circumoral and digital numbness, tingling paresthesias ("pins and needles"), facial tightness, and painful carpopedal spasms. Physical exam: positive Chvostek\'s sign (facial twitching upon tapping the facial nerve trunk anterior to the ear), positive Weiss sign (contraction of orbicularis oculi upon lateral orbital rim tapping), and positive Trousseau\'s sign (carpal spasm resulting in "obstetrician\'s hand" within 2 minutes of sphygmomanometer cuff inflation above systolic pressure). Labs: total serum calcium 1.65 mmol/L (normal 2.15–2.55), ionized calcium 0.78 mmol/L (normal 1.1–1.3), parathyroid hormone (PTH) markedly decreased.',
    questions: [
      { num: 1, text: 'Identify the specific postoperative endocrine complication.' },
      { num: 2, text: 'Explain the etiology and mechanism of postoperative hypocalcemic tetany.' },
      { num: 3, text: 'Describe how Chvostek\'s, Trousseau\'s, and Weiss\' signs are elicited.' },
      { num: 4, text: 'What is the immediate emergency protocol for acute hypocalcemic tetany?' },
      { num: 5, text: 'Outline the maintenance medical therapy for postoperative hypoparathyroidism.' }
    ],
    answers: [
      { num: 1, text: 'Acute postoperative hypoparathyroidism with severe hypocalcemia and tetany.' },
      { num: 2, text: 'Inadvertent surgical excision of parathyroid glands, mechanical crushing, or devascularization during inferior thyroid artery ligation -> parathyroid hormone deficiency -> impaired renal calcium reabsorption and skeletal resorption -> acute drop in ionized Ca²⁺, lowering threshold potentials and causing neuromuscular hyperexcitability.' },
      { num: 3, text: 'Chvostek sign: tapping the facial nerve trunk over the parotid gland produces ipsilateral facial muscle twitching. Trousseau sign: inflating a blood pressure cuff 20 mmHg above systolic BP for 3 minutes triggers painful ischemic carpal spasm ("obstetrician hand"). Weiss sign: tapping the lateral orbital margin elicits orbicularis oculi contraction.' },
      { num: 4, text: 'Immediate slow intravenous infusion of 10–20 mL of 10% Calcium Gluconate in 100 mL of 5% Dextrose over 10–15 minutes under continuous ECG monitoring (risk of bradycardia/arrhythmias).' },
      { num: 5, text: 'High-dose oral elemental calcium (calcium carbonate 1.5–3.0 g/day) combined with active 1-alpha-hydroxylated vitamin D metabolites (calcitriol/alfacalcidol 0.5–2.0 µg/day) with weekly calcium monitoring.' }
    ]
  },
  {
    id: 78,
    number: 4,
    topicId: 'thyroid',
    topicTitleEn: 'Thyroid & Endocrine Surgery',
    stem: 'A 50-year-old male presents with progressive orthopnea when lying supine, retrosternal fullness, exertional stridor, mild solid-food dysphagia, and hoarseness. Physical exam: only a minor thyroid enlargement is palpable in the neck, but upon coughing or neck hyperextension, a firm nodular mass ascends above the sternal notch. Raising both arms alongside the head for 45 seconds causes facial congestion, cyanosis, jugular distension, and audible stridor (positive Pemberton\'s sign). Contrast CT of the neck and chest reveals that 80% of the multinodular thyroid mass is situated in the anterior-superior mediastinum extending down to the aortic arch, compressing the tracheal lumen to 4 mm (tracheomalacia) and deviating the esophagus to the left.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'What is the anatomical classification of substernal/retrosternal and intrathoracic goiters?' },
      { num: 3, text: 'Explain the anatomical mechanism and clinical meaning of Pemberton\'s sign.' },
      { num: 4, text: 'What compressive thoracic complications threaten this patient (asphyxia, SVC obstruction)?' },
      { num: 5, text: 'What surgical approach is utilized (cervical collar incision vs sternotomy)?' }
    ],
    answers: [
      { num: 1, text: 'Substernal (mediastinal) multinodular non-toxic goiter with severe compressive mediastinal syndrome (critical tracheal stenosis/stridor, esophageal deviation, and SVC compression); respiratory failure Grade II.' },
      { num: 2, text: '1) Plunging / dipping goiter (ascends on deglutition/cough); 2) Substernal/retrosternal goiter (>50% below thoracic inlet with persistent cervical parenchyma continuity); 3) True intrathoracic/ectopic goiter (autonomous mediastinal mass supplied directly from internal thoracic/aortic vessels).' },
      { num: 3, text: 'Bilateral arm elevation wedges the bulky thyroid mass into the rigid thoracic inlet, causing acute vascular "corking" of the superior thoracic aperture, compressing jugular/innominate veins and narrowing the tracheal lumen.' },
      { num: 4, text: 'Acute suffocating asphyxia from tracheal compression and tracheomalacia (cartilage softening), acute superior vena cava syndrome, and bilateral recurrent laryngeal nerve palsy.' },
      { num: 5, text: 'In 95–98% of cases, the mass can be completely resected via a standard cervical collar incision (Kocher approach) by mobilizing capsular vessels from the neck. Partial/full sternotomy is reserved only for true ectopic goiters or massive posterior mediastinal impaction.' }
    ]
  }
];
