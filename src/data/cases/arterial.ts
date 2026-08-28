import { ClinicalCase } from '../../types';

export const arterialCases: ClinicalCase[] = [
  {
    id: 12,
    number: 1,
    topicId: 'arterial',
    topicTitleEn: 'Arterial Occlusion & Gangrene',
    stem: 'Patient D., 60 years old, was admitted with complaints of pain in the calf muscles of both legs after walking only 50 meters (intermittent claudication), numbness, coldness of the feet even in a warm room, and paresthesias ("crawling ants"). He has been ill for 8 years with gradual progression, receiving outpatient antispasmodics and balneotherapy with minimal effect. Three months ago his condition deteriorated sharply. Physical exam: marked coldness and pallor of both feet and shins with muscular atrophy. Femoral artery pulsation in both groins is diminished; popliteal and pedal pulses (dorsalis pedis and posterior tibial) are absent. Auscultation over both femoral arteries reveals a harsh systolic murmur.',
    questions: [
      { num: 1, text: 'What is your preliminary diagnosis?' },
      { num: 2, text: 'What additional vascular investigations are required to confirm the diagnosis?' },
      { num: 3, text: 'What angiographic and functional test findings are expected in this patient?' },
      { num: 4, text: 'What trophic and ischemic complications have developed in this patient?' },
      { num: 5, text: 'Outline a comprehensive treatment plan.' },
      { num: 6, text: 'What is the prognosis?' }
    ],
    answers: [
      { num: 1, text: 'Atherosclerosis obliterans of the lower extremity arteries, bilateral aortoiliac/femoral stenosis, Stage IIB according to Fontaine-Pokrovsky classification (claudication distance < 200 m).' },
      { num: 2, text: 'Duplex ultrasound / Doppler with Ankle-Brachial Index (ABI) measurement, CT/MR angiography or digital subtraction arteriography, lipid profile, and coagulation panel.' },
      { num: 3, text: 'Angiography: luminal narrowing, ragged vascular contours, segmental occlusion with collateral vessel filling. Functional tests: delayed capillary refill (>3 sec, Lanel-Lavastin test) and rapid plantar pallor on limb elevation (Goldflam/Samuels test).' },
      { num: 4, text: 'Trophic tissue changes (muscular atrophy, cold extremities) and severe chronic limb ischemia (stage IIB).' },
      { num: 5, text: '1) Medical therapy: antiplatelet therapy (aspirin/clopidogrel), statins, cilostazol/pentoxifylline, prostaglandins (alprostadil), and supervised exercise training. 2) Revascularization: endovascular balloon angioplasty with stenting or bypass grafting (aortobifemoral or femoropopliteal bypass).' },
      { num: 6, text: 'Favorable with timely revascularization and smoking cessation; without intervention, high risk of progression to critical limb ischemia and amputation.' }
    ]
  },
  {
    id: 13,
    number: 2,
    topicId: 'arterial',
    topicTitleEn: 'Arterial Occlusion & Gangrene',
    stem: 'Patient G., 35 years old, an electric welder who worked for many years in the Arctic North with repeated severe cold exposure and frostbite. Heavy smoker. Complains of excruciating rest pain and numbness in the right foot preventing sleep. He appears exhausted and distressed, sitting with his right leg hanging off the edge of the bed for dependency pain relief. The right foot shows dusky purple-cyanotic discoloration, marked hypothermia, absent active toe movements, and a 2 cm trophic ulcer with fibrinous base on the great toe. Femoral pulses are normal, popliteal pulses are diminished, and pedal pulses are absent. Chronic symptoms for 6 years with refractory medical treatment.',
    questions: [
      { num: 1, text: 'What is the full clinical diagnosis?' },
      { num: 2, text: 'What diagnostic workup is needed to confirm the diagnosis and distinguish it from atherosclerosis?' },
      { num: 3, text: 'What conditions require differential diagnosis?' },
      { num: 4, text: 'What conservative medical regimen should be instituted?' },
      { num: 5, text: 'Is surgical intervention possible, and which surgical procedures are performed?' },
      { num: 6, text: 'What is the patient\'s clinical prognosis?' },
      { num: 7, text: 'What constitutes an indication for amputation, and at what anatomical level should it be performed?' }
    ],
    answers: [
      { num: 1, text: 'Thromboangiitis obliterans (Buerger\'s disease / obliterating endarteritis), Stage IV according to Fontaine-Pokrovsky (critical limb ischemia with trophic ulceration).' },
      { num: 2, text: 'Immunological testing (circulating immune complexes, immunoglobulins), duplex ultrasonography, and distal digital subtraction arteriography (revealing segmental distal occlusion and corkscrew collaterals).' },
      { num: 3, text: 'Atherosclerosis obliterans, diabetic angiopathy, Raynaud\'s syndrome, and systemic vasculitis (polyarteritis nodosa).' },
      { num: 4, text: 'Absolute cessation of all tobacco use (critical!), intravenous prostaglandin analogues (iloprost/alprostadil), antiplatelet therapy, epidural/systemic analgesia, and local aseptic wound care.' },
      { num: 5, text: 'Lumbar sympathectomy (to reduce vasospasm and enhance cutaneous collateral perfusion) or distal microvascular bypass if acceptable run-off vessels exist.' },
      { num: 6, text: 'Guarded: without complete smoking cessation, limb loss is inevitable. Smoking cessation combined with prostaglandins can halt progression.' },
      { num: 7, text: 'Indications: spreading moist gangrene, unmanageable rest pain, or systemic sepsis. Level: minor amputation (toe/transmetatarsal) if dry and demarcated; below-knee amputation if the foot is non-viable.' }
    ]
  },
  {
    id: 14,
    number: 3,
    topicId: 'arterial',
    topicTitleEn: 'Arterial Occlusion & Gangrene',
    crossTopicIds: ['venous'],
    stem: 'Patient S., 67 years old, was urgently admitted with severe left foot pain, dark purple/black discoloration of all toes, and a weeping ulcer on the plantar surface. He cannot walk without crutches. He has a 15-year history of insulin-treated Type 2 Diabetes Mellitus (32 units/day). Worsening began after a long forest walk in tight footwear. On examination: toes of the left foot are cyanotic/necrotic with absent motion; the foot is cold. A 3x6 cm ulcer with purulent necrotic discharge is present on the plantar surface. Femoral and popliteal pulses are strong bilaterally; dorsalis pedis pulse is absent on the left and normal on the right. Blood glucose 12.0 mmol/L, glycosuria present. Tactile and vibratory sensation on the left foot are absent.',
    questions: [
      { num: 1, text: 'State the full diagnosis.' },
      { num: 2, text: 'What additional diabetic history and complications should be clarified?' },
      { num: 3, text: 'What other microvascular/neuropathic complications are likely present?' },
      { num: 4, text: 'What differential diagnoses must be considered for critical limb ischemia and gangrene?' },
      { num: 5, text: 'Describe the pathophysiological triggers leading to gangrene in this diabetic patient.' },
      { num: 6, text: 'Outline the surgical and medical management plan.' },
      { num: 7, text: 'State the potential complications and prognosis.' }
    ],
    answers: [
      { num: 1, text: 'Type 2 Diabetes Mellitus, decompensated. Diabetic foot syndrome (mixed neuroischemic form) complicated by plantar phlegmon/ulcer and moist gangrene of the left toes.' },
      { num: 2, text: 'Assessment of diabetic triad: retinopathy (visual acuity/fundoscopy), nephropathy (microalbuminuria/creatinine), neuropathy (sensory loss), and HbA1c control.' },
      { num: 3, text: 'Diabetic sensorimotor polyneuropathy, diabetic retinopathy, and diabetic nephropathy.' },
      { num: 4, text: 'Atherosclerosis obliterans, acute arterial thromboembolism, and acute deep vein thrombosis with phlegmasia cerulea dolens.' },
      { num: 5, text: 'Diabetic microangiopathy and sensory neuropathy caused insensate pressure injury from tight footwear, which became secondarily infected; compromised microcirculation and hyperglycemia accelerated tissue necrosis and moist gangrene.' },
      { num: 6, text: '1) Tight glycemic control with IV insulin. 2) Broad-spectrum IV antibiotics. 3) Surgical debridement, drainage of plantar phlegmon, and amputation (minor toe/forefoot or below-knee amputation depending on vascular demarcation). 4) Antiplatelet and rheological support.' },
      { num: 7, text: 'Complications: sepsis, ascending gas-forming infection, systemic septic shock. Prognosis is guarded with high risk of limb amputation.' }
    ]
  }
];
