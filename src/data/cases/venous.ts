import { ClinicalCase } from '../../types';

export const venousCases: ClinicalCase[] = [
  {
    id: 15,
    number: 4,
    topicId: 'venous',
    topicTitleEn: 'Venous Thrombosis & Varices',
    stem: 'Patient B., 34 years old, a hairdresser, presented with varicose veins of both lower legs, extensive brownish pigmentation above the medial malleolus, evening ankle edema, and nocturnal calf cramps. The varicosities first appeared 7 years ago following her second delivery. She wore compression stockings intermittently without formal medical care. Physical exam reveals marked tortuous nodular dilatation of the great saphenous vein (trunk type), and skin induration (lipodermatosclerosis) in the lower third of the calf. Hackenbruch cough test is positive. Palpation identifies incompetent perforating veins.',
    questions: [
      { num: 1, text: 'Formulate a comprehensive clinical diagnosis.' },
      { num: 2, text: 'What functional tests and instrumental investigations should be performed?' },
      { num: 3, text: 'What is the diagnostic significance of the functional tests (Trendelenburg, Perthes, Pratt)?' },
      { num: 4, text: 'What diseases must be differentiated from primary varicose disease?' },
      { num: 5, text: 'Outline the treatment plan and describe the principal surgical stages.' },
      { num: 6, text: 'Describe postoperative care and overall prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Varicose veins of the lower extremities (primary), Chronic Venous Insufficiency (CVI) Stage 3 (CEAP class C4b: lipodermatosclerosis and pigmentation).' },
      { num: 2, text: 'Duplex ultrasound scanning of lower extremity veins (gold standard), functional tourniquet/marching tests (Trendelenburg, Delbet-Perthes, Pratt-2, Hackenbruch), and coagulation panel.' },
      { num: 3, text: 'Trendelenburg test detects saphenofemoral junction incompetence. Delbet-Perthes marching test confirms patency of the deep venous system. Pratt-2 test localizes incompetent perforator veins.' },
      { num: 4, text: 'Post-thrombophlebitic syndrome, secondary varices due to pelvic/iliac compression (May-Thurner syndrome), congenital arteriovenous fistulas (Parkes-Weber syndrome), and lymphedema.' },
      { num: 5, text: 'Surgical/endovenous treatment (combined phlebectomy or EVLA/RFA): 1) Crossectomy (saphenofemoral junction high ligation); 2) Stripping of the incompetent GSV trunk (Babcock method); 3) Miniphlebectomy of tributary varices (Varady/Narat); 4) Subfascial/percutaneous ligation of incompetent perforating veins (Linton/Cockett).' },
      { num: 6, text: 'Early ambulation, immediate graduated compression bandaging/stockings for 6–8 weeks, micronized flavonoid venotonics (diosmin/hesperidin). Prognosis is favorable.' }
    ]
  },
  {
    id: 16,
    number: 5,
    topicId: 'venous',
    topicTitleEn: 'Venous Thrombosis & Varices',
    stem: 'Patient S., 27 years old, presents with severe varicose veins, edema, and a non-healing ulcer of the left lower leg. Six years ago, during football, he sustained blunt trauma to the popliteal fossa followed by plaster immobilization, after which persistent swelling and cyanosis developed. Varicose veins appeared gradually, and a refractory ulcer formed 4 months ago. Physical exam: left calf circumference is enlarged by 4 cm, diffuse "loose-network" superficial varicosities, marked induration and hyperpigmentation in the lower third, centering a 4 cm diameter ulcer with purulent necrotic base. Delbet-Perthes test is equivocal. Venography shows occlusion/non-filling of the left popliteal and femoral veins with retrograde reflux into dilated superficial veins via incompetent perforators.',
    questions: [
      { num: 1, text: 'What is the full clinical diagnosis?' },
      { num: 2, text: 'What conditions require differential diagnosis?' },
      { num: 3, text: 'Describe the pathophysiological mechanism linking the prior trauma to the trophic ulcer.' },
      { num: 4, text: 'What is the staged therapeutic and surgical strategy?' },
      { num: 5, text: 'What are the possible treatment outcomes and complications?' },
      { num: 6, text: 'Determine the patient\'s clinical prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Post-thrombophlebitic syndrome (PTBS) of the left lower extremity (mixed occlusive/recanalized form of the femoropopliteal segment), severe CVI with active trophic ulcer (CEAP Class C6). Secondary varicose veins.' },
      { num: 2, text: 'Primary varicose veins (distinguished by history of DVT and failure of superficial veins to decompress), pelvic tumor venous compression, Klippel-Trenaunay syndrome, and ischemic arterial ulcers.' },
      { num: 3, text: 'Trauma and immobilization triggered acute DVT. Recanalization led to destruction of deep venous valves, causing ambulatory venous hypertension, massive reflux across incompetent perforators, pericapillary fibrin cuff deposition, microcirculatory ischemia, liposclerosis, and skin breakdown into a trophic ulcer.' },
      { num: 4, text: 'Staged therapy: 1) Local ulcer debridement (vacuum therapy, proteolytic dressings) and multi-layer compression bandages. 2) Systemic venoactive drugs (micronized flavonoids, pentoxifylline, sulodexide). 3) Once the ulcer heals/cleanses: subfascial endoscopic perforator surgery (SEPS / Linton operation) and removal of secondary refluxing superficial trunks.' },
      { num: 5, text: 'Complete ulcer epithelialization and symptom control vs refractory ulceration, recurrent cellulitis/erysipelas, or secondary infection.' },
      { num: 6, text: 'Relatively favorable in this young patient with strict lifelong compression adherence and surgical correction of perforator reflux.' }
    ]
  },
  {
    id: 17,
    number: 6,
    topicId: 'venous',
    topicTitleEn: 'Venous Thrombosis & Varices',
    stem: 'Patient G., 67 years old, presented with severe pain along the medial surface of her left leg and thigh. Symptoms began 3 days ago with redness and tenderness on the calf, rapidly ascending to the thigh. Body temperature 37.8°C. She has a 7-year history of varicose veins of the left leg. Physical examination: Grade III obesity, restricted mobility due to pain. Along the course of the great saphenous vein from the ankle all the way up to the inguinal crease, the skin is brightly erythematous and warm, overlying a dense, excruciatingly tender, cord-like infiltrate up to 4 cm wide. Moderate edema of the left ankle and calf is noted.',
    questions: [
      { num: 1, text: 'Formulate the full clinical diagnosis.' },
      { num: 2, text: 'What urgent diagnostic investigations must be performed?' },
      { num: 3, text: 'What conditions require differential diagnosis?' },
      { num: 4, text: 'What are the immediate surgical and conservative treatment tactics?' },
      { num: 5, text: 'What life-threatening complications must be prevented?' },
      { num: 6, text: 'State the expected outcomes and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Acute ascending superficial thrombophlebitis of the great saphenous vein (GSV) of the left thigh and calf, complicating varicose vein disease, with immediate threat of extension into the common femoral vein.' },
      { num: 2, text: 'Emergency duplex ultrasound scanning of lower extremity veins (critical to identify the true cranial thrombus head, which typically extends 10–15 cm proximal to visible erythema), D-dimer, and coagulation panel.' },
      { num: 3, text: 'Erysipelas (demarcated margins, shivering), acute lymphangitis, subcutaneous phlegmon, deep vein thrombosis, and strangulated femoral hernia.' },
      { num: 4, text: 'Emergency surgery: urgent crossectomy (Troyanov-Trendelenburg procedure / saphenofemoral junction disconnection) under local or regional anesthesia to prevent pulmonary embolism. Postoperatively: therapeutic low-molecular-weight heparin (LMWH), NSAIDs, compression therapy, and ambulation.' },
      { num: 5, text: 'Pulmonary thromboembolism (PE), progression to iliofemoral DVT, suppurative thrombophlebitis, and groin wound seroma/hematoma.' },
      { num: 6, text: 'Favorable with prompt surgical crossectomy, successfully preventing fatal pulmonary embolism.' }
    ]
  },
  {
    id: 18,
    number: 7,
    topicId: 'venous',
    topicTitleEn: 'Venous Thrombosis & Varices',
    stem: 'Patient S., 57 years old, was urgently admitted with sudden severe bursting pain in the right thigh and lower leg, massive swelling, and dusky cyanosis of the extremity. Symptoms appeared acutely 2 days ago. History is notable for 4 kg weight loss over 6 months and chronic constipation. Physical exam: marked tense non-pitting edema of the entire right lower limb (thigh circumference +7 cm, calf +4 cm compared to left). Skin is cyanotic with prominent dilated superficial collateral veins (Pratt sign). Calf muscles are firm and exquisitely tender on anteroposterior compression; Homans sign (dorsiflexion pain) is positive.',
    questions: [
      { num: 1, text: 'What is the full diagnosis?' },
      { num: 2, text: 'Outline the laboratory and instrumental diagnostic plan.' },
      { num: 3, text: 'How should occult paraneoplastic etiologies (Trousseau syndrome) be evaluated?' },
      { num: 4, text: 'What differential diagnoses must be excluded?' },
      { num: 5, text: 'Provide a detailed antithrombotic treatment plan.' },
      { num: 6, text: 'What complications may occur?' },
      { num: 7, text: 'State the long-term clinical outcome and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Acute right ileofemoral deep vein thrombosis (DVT), phlegmasia alba/cerulea dolens.' },
      { num: 2, text: 'Emergency color Doppler venous ultrasonography (to evaluate proximal extent and rule out free-floating thrombus), D-dimer, coagulogram, and CT venography.' },
      { num: 3, text: 'Comprehensive malignancy screening for paraneoplastic thrombosis (Trousseau syndrome): colonoscopy (given weight loss and constipation), EGD, pelvic/abdominal CT, and chest CT.' },
      { num: 4, text: 'Ruptured Baker\'s cyst, acute lymphedema, soft tissue phlegmon, extrinsic iliac vein tumor compression, and acute arterial thrombosis.' },
      { num: 5, text: '1) Initial bed rest until non-floating status is verified. 2) Therapeutic anticoagulation: LMWH bridged to direct oral anticoagulants (rivaroxaban 15 mg BID for 3 weeks, then 20 mg daily) for ≥6 months. 3) Graduated compression therapy. 4) For free-floating thrombi: inferior vena cava (IVC) filter placement, catheter-directed thrombolysis, or surgical thrombectomy.' },
      { num: 6, text: 'Fatal pulmonary embolism (PE), phlegmasia cerulea dolens with venous gangrene, and severe post-thrombotic syndrome.' },
      { num: 7, text: 'Favorable for survival with adequate anticoagulation; post-thrombotic syndrome typically develops long-term requiring lifelong compression.' }
    ]
  },
  {
    id: 19,
    number: 8,
    topicId: 'venous',
    topicTitleEn: 'Venous Thrombosis & Varices',
    stem: 'A 38-year-old female cook has suffered from varicose veins of the right lower extremity for 11 years. Four days ago, an acutely tender, firm induration developed along the great saphenous vein on the calf. She took aspirin on medical advice, but over the next 5 days the cord-like induration extended up the thigh reaching the upper third. Body temperature 37.7°C. Palpation reveals a tense, tender, inflammatory thrombus along the GSV to the proximal thigh with overlying skin erythema and painful reactive right inguinal lymphadenopathy.',
    questions: [
      { num: 1, text: 'What is your clinical diagnosis?' },
      { num: 2, text: 'With what conditions should a differential diagnosis be made?' },
      { num: 3, text: 'How should this patient be managed surgically and medically?' }
    ],
    answers: [
      { num: 1, text: 'Varicose veins of the right lower extremity complicated by acute ascending superficial thrombophlebitis of the great saphenous vein reaching the upper third of the thigh. Reactive inguinal lymphadenitis.' },
      { num: 2, text: 'Deep vein thrombosis (phlebothrombosis), acute lymphangitis, erysipelas, cellulitis, and strangulated femoral hernia.' },
      { num: 3, text: 'Urgent hospitalization and emergency crossectomy (Troyanov-Trendelenburg saphenofemoral junction disconnection) to prevent propagation of the thrombus into the femoral vein and pulmonary embolism. Postoperative LMWH anticoagulation, NSAIDs, and compression.' }
    ]
  }
];
