import { ClinicalCase } from '../../types';

export const proctologyCases: ClinicalCase[] = [
  {
    id: 42,
    number: 1,
    topicId: 'proctology',
    topicTitleEn: 'Proctology: Hemorrhoids, Fissures & Paraproctitis',
    stem: 'Patient V., 42 years old, a long-distance truck driver, presents with intermittent bright red rectal bleeding occurring in drops or squirts at the end of defecation, prolapsing anal cushions during bowel movements and heavy lifting requiring manual reduction, perianal pruritus, and a foreign body sensation. History spans 6 years. Physical exam: perianal skin unremarkable. On straining, three discrete soft-elastic mucosal cushions prolapse at 3, 7, and 11 o\'clock positions. Digital rectal exam and anoscopy identify enlarged, painless internal hemorrhoidal complexes that bleed easily on contact.',
    questions: [
      { num: 1, text: 'Formulate the diagnosis according to modern clinical classification.' },
      { num: 2, text: 'Describe the etiology and vascular/mechanical pathogenesis of hemorrhoids.' },
      { num: 3, text: 'What diagnostic investigations are mandatory to rule out proximal colonic disease?' },
      { num: 4, text: 'What conditions require differential diagnosis?' },
      { num: 5, text: 'What conservative and minimally invasive treatment options exist?' },
      { num: 6, text: 'Is surgery indicated? Describe the gold-standard surgical procedures.' }
    ],
    answers: [
      { num: 1, text: 'Chronic internal (combined) hemorrhoids, Grade III (prolapse requiring manual digital reduction).' },
      { num: 2, text: 'Hyperplasia and vascular dysregulation of the submucosal cavernous vascular plexus combined with degenerative laxity of Treitz\'s/Parks\' suspensory ligament. Precipitating triggers: sedentary occupation, chronic constipation, straining.' },
      { num: 3, text: 'Anoscopy, rigid proctosigmoidoscopy, and full colonoscopy (essential to rule out colorectal carcinoma, polyps, and inflammatory bowel disease).' },
      { num: 4, text: 'Colorectal carcinoma, rectal polyps/villous adenoma, full-thickness rectal prolapse, anal fissure, and arteriovenous malformations.' },
      { num: 5, text: 'Conservative: dietary fiber, flavonoids (micronized diosmin/hesperidin), topical suppositories. Minimally invasive: rubber band ligation, Doppler-guided hemorrhoidal artery ligation (DG-HAL/RAR), sclerotherapy, or laser coagulation.' },
      { num: 6, text: 'Yes, surgical hemorrhoidectomy (Milligan-Morgan open or Ferguson closed excisional hemorrhoidectomy) or Longo stapled hemorrhoidopexy is indicated.' }
    ]
  },
  {
    id: 43,
    number: 2,
    topicId: 'proctology',
    topicTitleEn: 'Proctology: Hemorrhoids, Fissures & Paraproctitis',
    stem: 'Patient G., 36 years old, presents with excruciating, sharp, burning "knife-like" anal pain during and persisting for 1–2 hours after defecation, streaks of bright red blood on toilet paper, severe fear of defecation (coprophobia), and reflex constipation. Symptoms have lasted 4 months. Physical exam: severe anal sphincter spasm. On gentle lateral retraction of the buttocks, a longitudinal linear ulcer measuring 1.2x0.4 cm is visualized at the 6 o\'clock position (posterior midline) with indurated fibrous margins exposing circular sphincter fibers at the base and a hypertrophied "sentinel skin tag" at the anal verge. Digital rectal exam is severely limited by pain and hypertonia.',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Describe the classic diagnostic clinical triad.' },
      { num: 3, text: 'Explain the pathophysiological vicious cycle of chronic anal fissure.' },
      { num: 4, text: 'How does an acute fissure differ morphologically from a chronic one?' },
      { num: 5, text: 'What conservative options exist, including chemical sphincterotomy?' },
      { num: 6, text: 'What definitive surgical intervention is indicated?' }
    ],
    answers: [
      { num: 1, text: 'Chronic posterior midline anal fissure with internal anal sphincter spasm and sentinel skin tag.' },
      { num: 2, text: 'Classic clinical triad: 1) Severe post-defecation anal pain, 2) Internal anal sphincter spasm/hypertonia, and 3) Scant bright red rectal bleeding.' },
      { num: 3, text: 'Anoderm tear -> severe pain -> tonic internal sphincter spasm -> microcirculatory ischemia of the posterior midline anoderm -> failure of healing -> ulcer chronicity -> worsened pain/spasm (vicious cycle).' },
      { num: 4, text: 'Acute: linear mucosal slit with fresh, clean, pliable margins and granulating base. Chronic (>6-8 weeks): indurated callous edges, visible circular fibers of internal sphincter, hypertrophied anal papilla at apex, and sentinel skin tag at base.' },
      { num: 5, text: 'Fiber supplementation, stool softeners, sitz baths. Chemical sphincterotomy: topical 0.2% diltiazem/nifedipine or 0.4% nitroglycerin ointment, or botulinum toxin injection into the internal sphincter.' },
      { num: 6, text: 'Fissurectomy (excision of the ulcer and sentinel tag — Gabriel procedure) combined with lateral internal sphincterotomy (LIS) to permanently eliminate sphincter hypertonia.' }
    ]
  },
  {
    id: 44,
    number: 3,
    topicId: 'proctology',
    topicTitleEn: 'Proctology: Hemorrhoids, Fissures & Paraproctitis',
    crossTopicIds: ['peritonitis'],
    stem: 'Patient S., 48 years old, was rushed to the surgical hospital complaining of severe, throbbing, constant perineal and deep anal pain aggravated by minimal movement, coughing, or defecation, accompanied by high fevers (38.6°C), chills, and reflex dysuria/urinary retention. Duration 3 days. Physical exam: pale, toxic, tachycardia 98 bpm. Right perianal asymmetry: warm erythema, effaced skin folds, and a tense, exquisitely tender 6x7 cm inflammatory mass with central fluctuation. Digital rectal exam reveals painful bulging of the right lateral rectal wall.',
    questions: [
      { num: 1, text: 'Formulate the exact clinical diagnosis and anatomical subtype.' },
      { num: 2, text: 'What is the etiology and route of bacterial entry into the perirectal spaces (cryptoglandular theory)?' },
      { num: 3, text: 'Classify the anatomical spaces/types of acute paraproctitis (perianal abscess).' },
      { num: 4, text: 'What imaging and diagnostic studies are useful?' },
      { num: 5, text: 'What is the surgical management and specific operative technique?' },
      { num: 6, text: 'What life-threatening and chronic complications can arise?' }
    ],
    answers: [
      { num: 1, text: 'Acute right-sided ischiorectal paraproctitis (ischiorectal abscess) with systemic inflammatory response.' },
      { num: 2, text: 'Cryptoglandular theory: bacterial infection originates in an obstructed and infected anal crypt (cryptitis), extending along branching anal gland ducts through the internal sphincter into perirectal fat spaces.' },
      { num: 3, text: '1) Perianal (subcutaneous); 2) Submucosal; 3) Ischiorectal; 4) Pelvirectal (supralevator); 5) Retrorectal.' },
      { num: 4, text: 'Endorectal ultrasound (ERUS), pelvic MRI/CT (for complex or supralevator collections), CBC, and metabolic panel.' },
      { num: 5, text: 'Urgent surgical drainage under general/spinal anesthesia: wide semilunar/radial incision over the ischiorectal fossa, finger debridement of loculations, copious antiseptic irrigation, open packing/drainage, and identification/excision of the internal crypt opening if feasible.' },
      { num: 6, text: 'Formation of chronic anal fistula (fistula-in-ano in 40–50%), bilateral horseshoe abscess extension, pelvic peritonitis, necrotizing fasciitis (Fournier\'s gangrene), and sepsis.' }
    ]
  },
  {
    id: 45,
    number: 4,
    topicId: 'proctology',
    topicTitleEn: 'Proctology: Hemorrhoids, Fissures & Paraproctitis',
    stem: 'A 32-year-old male presents with intermittent purulent/serous drainage from a perineal opening soiling his underwear, perianal pruritus, and dull aching pain whenever the discharge temporarily ceases. History: he underwent incision and drainage of an acute perianal abscess 1.5 years ago. On examination: at the 5 o\'clock position, 3 cm from the anal verge, a punctate external opening with exuberant granulation tissue is noted, exuding a drop of pus on pressure. A bulb-headed fistulous probe passes smoothly into the track toward the anal canal to a depth of 3.5 cm.',
    questions: [
      { num: 1, text: 'Formulate the complete clinical diagnosis.' },
      { num: 2, text: 'Explain Goodsall\'s rule for predicting the trajectory of anal fistulas.' },
      { num: 3, text: 'How are anorectal fistulas classified relative to the anal sphincter muscles (Parks classification)?' },
      { num: 4, text: 'What diagnostic tests and imaging modalities must be performed?' },
      { num: 5, text: 'What surgical techniques are used for definitive fistula repair?' }
    ],
    answers: [
      { num: 1, text: 'Chronic paraproctitis, complete anorectal fistula (fistula-in-ano).' },
      { num: 2, text: 'Goodsall\'s rule: external openings posterior to the transverse anal line follow a curved path to the posterior midline (6 o\'clock) crypt; external openings anterior to the transverse line track radially in a straight line to the nearest anterior crypt.' },
      { num: 3, text: 'Parks classification: 1) Intersphincteric; 2) Transsphincteric (low vs high); 3) Suprasphincteric; 4) Extrasphincteric.' },
      { num: 4, text: 'Methylene blue dye test via the external opening during anoscopy, fistula probing, fistulography, endoanal ultrasound (EAUS), and pelvic MRI.' },
      { num: 5, text: '1) Fistulotomy / lay-open technique (for simple intersphincteric/low transsphincteric); 2) Seton placement (draining or cutting); 3) LIFT (Ligation of Intersphincteric Fistula Tract); 4) Endorectal advancement flap; 5) FiLaC (Fistula-tract Laser Closure).' }
    ]
  },
  {
    id: 46,
    number: 5,
    topicId: 'proctology',
    topicTitleEn: 'Proctology: Hemorrhoids, Fissures & Paraproctitis',
    stem: 'A 23-year-old male student presents with sacrococcygeal pain aggravated by prolonged sitting, purulent discharge in the intergluteal cleft, and low-grade fever (37.5°C). Symptoms started 2 months ago after a long road trip when a painful swelling first formed over the tailbone. Physical exam: in the natal cleft strictly along the midline, 4 cm above the anal verge, two discrete primary cutaneous pits/sinuses are identified, one with protruding hair tufts. Proximally and 3 cm laterally, a tender induration with a secondary discharging fistula is present.',
    questions: [
      { num: 1, text: 'What is your clinical diagnosis?' },
      { num: 2, text: 'What is the etiology and modern pathogenesis of this condition?' },
      { num: 3, text: 'What conditions require differential diagnosis?' },
      { num: 4, text: 'What is the stepwise treatment in the acute versus elective stage?' },
      { num: 5, text: 'What radical surgical techniques are used for excision and reconstruction?' }
    ],
    answers: [
      { num: 1, text: 'Suppurative pilonidal disease (epithelial coccygeal tract / pilonidal sinus) with chronic discharging fistula.' },
      { num: 2, text: 'Acquired foreign body reaction to shed hair shafts forced into dilated natal cleft hair follicles by friction and negative suction pressure during sitting.' },
      { num: 3, text: 'Anal fistula (posterior transsphincteric), sacrococcygeal osteomyelitis, presacral teratoma/epidermoid cyst, and hidradenitis suppurativa.' },
      { num: 4, text: 'Acute abscess: emergency incision and drainage. Elective quiescent phase (after 4–8 weeks): complete radical excision of the sinus tract and all pits.' },
      { num: 5, text: '1) Wide excision with marsupialization (Ryzhikh); 2) Excision with primary midline closure; 3) Off-midline flap reconstructions (Karydakis procedure / Limberg rhomboid transposition flap); 4) Minimally invasive endoscopic pilonidal sinus treatment (EPSiT).' }
    ]
  }
];
