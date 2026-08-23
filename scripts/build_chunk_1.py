import json
import os

os.makedirs('src/data/questions', exist_ok=True)

# Generate questions 1 to 100
chunk1 = [
  {"id": 1, "number": 1, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ОСТРОГО АППЕНДИЦИТА НЕ ХАРАКТЕРЕН СИМПТОМ:", "questionEn": "Which symptom is NOT characteristic of acute appendicitis?", "correctKey": "в", "options": [
    {"key": "а", "textRu": "Ровзинга", "textEn": "Rovsing sign"},
    {"key": "б", "textRu": "Воскресенского", "textEn": "Voskresensky sign"},
    {"key": "в", "textRu": "Мерфи", "textEn": "Murphy sign (cholecystitis)"},
    {"key": "г", "textRu": "Образцова", "textEn": "Obraztsov sign"},
    {"key": "д", "textRu": "Бартомье–Михельсона", "textEn": "Bartomier-Michelson sign"}
  ]},
  {"id": 2, "number": 2, "topicId": "appendicitis", "page": 1, "questionRu": "СПЕЦИФИЧЕСКИМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ СИМПТОМ:", "questionEn": "Which symptom is specific/pathognomonic for acute appendicitis?", "correctKey": "д", "options": [
    {"key": "а", "textRu": "Кохера–Волковича", "textEn": "Kocher-Volkovich sign"},
    {"key": "б", "textRu": "Ровзинга", "textEn": "Rovsing sign"},
    {"key": "в", "textRu": "Ситковского", "textEn": "Sitkovsky sign"},
    {"key": "г", "textRu": "все три симптома", "textEn": "All three symptoms"},
    {"key": "д", "textRu": "ни один из них", "textEn": "None of them (no single pathognomonic sign)"}
  ]},
  {"id": 3, "number": 3, "topicId": "appendicitis", "page": 1, "questionRu": "К ПЕРИТОНЕАЛЬНЫМ СИМПТОМАМ ПРИ ОСТРОМ АППЕНДИЦИТЕ ОТНОСЯТ СИМПТОМЫ:", "questionEn": "Peritoneal signs in acute appendicitis include:", "correctKey": "г", "options": [
    {"key": "а", "textRu": "Воскресенского (синдром \"рубашки\")", "textEn": "Voskresensky (shirt sign)"},
    {"key": "б", "textRu": "Щеткина–Блюмберга", "textEn": "Shchetkin-Blumberg (rebound tenderness)"},
    {"key": "в", "textRu": "Раздольского", "textEn": "Razdolsky sign"},
    {"key": "г", "textRu": "все названные симптомы", "textEn": "All of the named signs"},
    {"key": "д", "textRu": "ни один из них", "textEn": "None of them"}
  ]},
  {"id": 4, "number": 4, "topicId": "appendicitis", "page": 1, "questionRu": "НЕВЕРНЫМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ УТВЕРЖДЕНИЕ, ЧТО:", "questionEn": "Which statement regarding acute appendicitis is INCORRECT?", "correctKey": "в", "options": [
    {"key": "а", "textRu": "ригидность брюшной стенки может отсутствовать при ретроцекальном расположении отростка", "textEn": "Abdominal wall rigidity may be absent with retrocecal appendix"},
    {"key": "б", "textRu": "ригидности может не быть при тазовом расположении", "textEn": "Rigidity may be absent with pelvic appendix"},
    {"key": "в", "textRu": "рвота всегда предшествует боли", "textEn": "Vomiting always precedes pain (Incorrect: pain precedes vomiting)"},
    {"key": "г", "textRu": "боль может начинаться в области пупка", "textEn": "Pain can start in umbilical area"},
    {"key": "д", "textRu": "боль чаще начинается в эпигастральной области", "textEn": "Pain most often starts in epigastric area"}
  ]},
  {"id": 5, "number": 5, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА ИСПОЛЬЗУЮТСЯ МЕТОДЫ:", "questionEn": "Methods used for diagnosing acute appendicitis include:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "лапароскопия", "textEn": "Laparoscopy"},
    {"key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count"},
    {"key": "в", "textRu": "ректальное исследование", "textEn": "Digital rectal examination"},
    {"key": "г", "textRu": "термография", "textEn": "Thermography"},
    {"key": "д", "textRu": "все перечисленное верно", "textEn": "All of the above are correct"}
  ]},
  {"id": 6, "number": 6, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА НЕ ПРИМЕНЯЮТ:", "questionEn": "Which diagnostic method is NOT used for acute appendicitis?", "correctKey": "г", "options": [
    {"key": "а", "textRu": "пальпацию брюшной стенки", "textEn": "Abdominal wall palpation"},
    {"key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count"},
    {"key": "в", "textRu": "пальцевое ректальное исследование", "textEn": "Digital rectal examination"},
    {"key": "г", "textRu": "ирригоскопию", "textEn": "Barium enema (irrigoscopy)"},
    {"key": "д", "textRu": "влагалищное исследование", "textEn": "Vaginal bimanual examination"}
  ]},
  {"id": 7, "number": 7, "topicId": "appendicitis", "page": 1, "questionRu": "ПРИ ОСТРОМ ФЛЕГМОНОЗНОМ АППЕНДИЦИТЕ НЕ НАБЛЮДАЕТСЯ СИМПТОМ:", "questionEn": "In acute phlegmonous appendicitis, which sign is NOT observed?", "correctKey": "г", "options": [
    {"key": "а", "textRu": "Щеткина−Блюмберга", "textEn": "Shchetkin-Blumberg sign"},
    {"key": "б", "textRu": "Бартомье−Михельсона", "textEn": "Bartomier-Michelson sign"},
    {"key": "в", "textRu": "Кохера−Волковича", "textEn": "Kocher-Volkovich sign"},
    {"key": "г", "textRu": "Георгиевского−Мюсси", "textEn": "Georgievsky-Mussy (phrenic) sign"},
    {"key": "д", "textRu": "Крымова", "textEn": "Krymov sign"}
  ]},
  {"id": 8, "number": 8, "topicId": "appendicitis", "page": 1, "questionRu": "ПЕРВИЧНО-ГАНГРЕНОЗНЫЙ АППЕНДИЦИТ ЧАЩЕ ВСЕГО ВСТРЕЧАЕТСЯ:", "questionEn": "Primary gangrenous appendicitis occurs most often in:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "у детей", "textEn": "Children"},
    {"key": "б", "textRu": "у лиц с тяжелой травмой", "textEn": "Severe trauma patients"},
    {"key": "в", "textRu": "у мужчин", "textEn": "Men"},
    {"key": "г", "textRu": "у женщин", "textEn": "Women"},
    {"key": "д", "textRu": "у лиц пожилого и старческого возраста", "textEn": "Elderly and senile patients"}
  ]},
  {"id": 9, "number": 9, "topicId": "appendicitis", "page": 1, "questionRu": "ОСТРЫЙ АППЕНДИЦИТ У ДЕТЕЙ ОТЛИЧАЕТСЯ ОТ ТАКОВОГО У ВЗРОСЛЫХ ВСЕМ, КРОМЕ:", "questionEn": "Acute appendicitis in children differs from adults by all EXCEPT:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "схваткообразного характера боли, поноса многократной рвоты", "textEn": "Crampy pain, diarrhea, repeated vomiting"},
    {"key": "б", "textRu": "быстрого развития разлитого перитонита", "textEn": "Rapid development of diffuse peritonitis"},
    {"key": "в", "textRu": "высокой температуры", "textEn": "High fever"},
    {"key": "г", "textRu": "выраженной интоксикации", "textEn": "Severe systemic toxicity"},
    {"key": "д", "textRu": "резкого напряжения мышц в правой подвздошной области", "textEn": "Sharp muscular defense in right iliac fossa"}
  ]},
  {"id": 10, "number": 10, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ПЕРФОРАТИВНОГО АППЕНДИЦИТА ХАРАКТЕРНО:", "questionEn": "Perforative appendicitis is characterized by:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "симптом Раздольского", "textEn": "Razdolsky sign"},
    {"key": "б", "textRu": "нарастание клинической картины перитонита", "textEn": "Progressive peritonitis"},
    {"key": "в", "textRu": "внезапное усиление болей в животе", "textEn": "Sudden surge of abdominal pain"},
    {"key": "г", "textRu": "напряжение мышц передней брюшной стенки", "textEn": "Anterior abdominal wall muscular rigidity"},
    {"key": "д", "textRu": "все перечисленное", "textEn": "All of the above"}
  ]},
  {"id": 11, "number": 11, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ГАНГРЕНОЗНОЙ ФОРМЫ АППЕНДИЦИТА НЕ ХАРАКТЕРНО:", "questionEn": "Which is NOT characteristic of gangrenous appendicitis?", "correctKey": "б", "options": [
    {"key": "а", "textRu": "доскообразный живот", "textEn": "Board-like abdomen"},
    {"key": "б", "textRu": "усиление болей в правой подвздошной области", "textEn": "Intensification of pain in right iliac fossa (nerve ending necrosis causes temporary pain reduction)"},
    {"key": "в", "textRu": "уменьшение болевых ощущений в правой подвздошной области", "textEn": "Decrease of pain sensations in right iliac fossa"},
    {"key": "г", "textRu": "тахикардия", "textEn": "Tachycardia"},
    {"key": "д", "textRu": "симптом Щеткина–Блюмберга", "textEn": "Shchetkin-Blumberg sign"}
  ]},
  {"id": 12, "number": 12, "topicId": "appendicitis", "page": 1, "questionRu": "БОЛЬНАЯ 24 ЛЕТ ЖАЛУЕТСЯ НА ТОШНОТУ И РВОТУ, БОЛИ В ОБЛАСТИ ПУПКА ДЛИТЕЛЬНОСТЬЮ ОКОЛО 5 ЧАСОВ. В ТЕЧЕНИЕ ПОСЛЕДНЕГО ПОЛУЧАСА БОЛИ ПЕРЕМЕСТИЛИСЬ В ПРАВУЮ ПОДВЗДОШНУЮ ОБЛАСТЬ, ТЕМПЕРАТУРА ТЕЛА 37,6°С. У БОЛЬНОЙ НАИБОЛЕЕ ВЕРОЯТЕН ДИАГНОЗ:", "questionEn": "A 24yo female complains of nausea, vomiting, periumbilical pain for 5h. In the last 30 min pain shifted to right iliac fossa, temp 37.6°C. Most likely diagnosis:", "correctKey": "в", "options": [
    {"key": "а", "textRu": "острый пиелонефрит", "textEn": "Acute pyelonephritis"},
    {"key": "б", "textRu": "острый правосторонний аднексит", "textEn": "Acute right adnexitis"},
    {"key": "в", "textRu": "острый аппендицит", "textEn": "Acute appendicitis"},
    {"key": "г", "textRu": "разрыв овариальной кисты", "textEn": "Ruptured ovarian cyst"},
    {"key": "д", "textRu": "нарушенная внематочная беременность", "textEn": "Ectopic pregnancy"}
  ]},
  {"id": 13, "number": 13, "topicId": "appendicitis", "page": 2, "questionRu": "У БОЛЬНОГО, 59 ЛЕТ, ТРОЕ СУТОК НАЗАД ПОЯВИЛИСЬ БОЛИ В ЭПИГАСТРАЛЬНОЙ ОБЛАСТИ, КОТОРЫЕ СМЕСТИЛИСЬ В ПРАВУЮ ПОДВЗДОШНУЮ ОБЛАСТЬ. БОЛЬНОЙ ПРИНИМАЛ АНАЛЬГИН И ПРИКЛАДЫВАЛ К ЖИВОТУ ГРЕЛКУ, ПОСЛЕ ЧЕГО БОЛИ В ЖИВОТЕ СТИХЛИ. НА СЛЕДУЮЩИЙ ДЕНЬ БОЛИ ВОЗОБНОВИЛИСЬ, РАСПРОСТРАНИЛИСЬ ПО ВСЕМУ ЖИВОТУ, ПОЯВИЛАСЬ МНОГОКРАТНАЯ РВОТА. СОСТОЯНИЕ БОЛЬНОГО ТЯЖЕЛОЕ. ПУЛЬС-128УД/МИН. ЯЗЫК СУХОЙ. ЖИВОТ БОЛЕЗНЕННЫЙ И НАПРЯЖЕННЫЙ ВО ВСЕХ ОТДЕЛАХ. СИМПТОМ ЩЕТКИНА - БЛЮМБЕРГА ПОЛОЖИТЕЛЬНЫЙ ПО ВСЕМУ ЖИВОТУ. ЛЕЙКОЦИТОЗ 18,6x10/Л. У больного можно предполагать:", "questionEn": "59yo male had epigastric pain shifting to RIF 3 days ago. Took analgesics and applied warm pad. Pain returned diffusely next day with vomiting, pulse 128, diffuse rigidity, Blumberg positive everywhere, WBC 18.6. Suspected diagnosis:", "correctKey": "а", "options": [
    {"key": "а", "textRu": "острый перфоративный аппендицит, осложненный разлитым перитонитом", "textEn": "Acute perforated appendicitis complicated by diffuse peritonitis"},
    {"key": "б", "textRu": "пилефлебит", "textEn": "Pylephlebitis"},
    {"key": "в", "textRu": "периаппендикулярный абсцесс", "textEn": "Periappendicular abscess"},
    {"key": "г", "textRu": "пищевую токсикоинфекцию", "textEn": "Food poisoning"},
    {"key": "д", "textRu": "деструктивный холецистит", "textEn": "Destructive cholecystitis"}
  ]},
  {"id": 14, "number": 14, "topicId": "appendicitis", "page": 2, "questionRu": "БОЛЬНОЙ 28 ЛЕТ, ЖАЛУЕТСЯ НА БОЛИ В ПРАВОЙ ПОДВЗДОШНОЙ ОБЛАСТИ, КОТОРЫЕ НАЧАЛИСЬ 12 ЧАСОВ ТОМУ НАЗАД В ЭПИГАСТРИИ И В ПОСЛЕДУЮЩИМ СМЕСТИЛИСЬ В ПРАВУЮ ПОДВЗДОШНУЮ И МЕЗОГАСТРАЛЬНУЮ ОБЛАСТЬ. ТЕМПЕРАТУРА 37,7°С, ПУЛЬС 96 УД/МИН. ЖИВОТ МЯГКИЙ, БОЛЕЗНЕННОСТЬ В ТРЕУГОЛЬНИКЕ ПТИ, СИМПТОМЫ ПАСТЕРНАЦКОГО, ОБРАЗЦОВА (ПСОАС-СИМПТОМ) - ПОЛОЖИТЕЛЬНЫЕ. ВЫБЕРИТЕ НАИБОЛЕЕ ВЕРОЯТНЫЙ ДИАГНОЗ:", "questionEn": "28yo male with RIF pain shifting from epigastrium 12h ago. Abdomen soft, tenderness in Petit's triangle, positive Psoas sign (Obraztsov) and Pasternatsky. Most likely diagnosis:", "correctKey": "а", "options": [
    {"key": "а", "textRu": "острый аппендицит с ретроцекальным расположением червеобразного отростка", "textEn": "Acute appendicitis with retrocecal position of appendix"},
    {"key": "б", "textRu": "правосторонняя почечная колика", "textEn": "Right renal colic"},
    {"key": "в", "textRu": "острый деструктивный аппендицит, с тазовым расположением червеобразного отростка", "textEn": "Acute destructive appendicitis with pelvic position"},
    {"key": "г", "textRu": "правосторонний пиелонефрит", "textEn": "Right pyelonephritis"},
    {"key": "д", "textRu": "опухоль правой половины ободочной кишки", "textEn": "Right colon tumor"}
  ]},
  {"id": 15, "number": 15, "topicId": "appendicitis", "page": 2, "questionRu": "КЛИНИЧЕСКИ ОСТРЫЙ АППЕНДИЦИТ МОЖЕТ БЫТЬ ПРИНЯТ:", "questionEn": "Clinically, acute appendicitis can be mistaken for:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "за сальпингит", "textEn": "Salpingitis"},
    {"key": "б", "textRu": "за острый холецистит", "textEn": "Acute cholecystitis"},
    {"key": "в", "textRu": "за дивертикулит Меккеля", "textEn": "Meckel's diverticulitis"},
    {"key": "г", "textRu": "за внематочную беременность", "textEn": "Ectopic pregnancy"},
    {"key": "д", "textRu": "за любую из этих видов патологии", "textEn": "Any of these pathologies"}
  ]},
  {"id": 16, "number": 16, "topicId": "appendicitis", "page": 2, "questionRu": "ОСТРЫЙ АППЕНДИЦИТ СЛЕДУЕТ ДИФФЕРЕНЦИРОВАТЬ СО ВСЕМИ ПЕРЕЧИСЛЕННЫМИ ЗАБОЛЕВАНИЯМИ, КРОМЕ:", "questionEn": "Acute appendicitis should be differentiated from all listed conditions EXCEPT:", "correctKey": "а", "options": [
    {"key": "а", "textRu": "гломерулонефрита", "textEn": "Glomerulonephritis"},
    {"key": "б", "textRu": "острого панкреатита", "textEn": "Acute pancreatitis"},
    {"key": "в", "textRu": "острого аднексита", "textEn": "Acute adnexitis"},
    {"key": "г", "textRu": "острого гастроэнтерита", "textEn": "Acute gastroenteritis"},
    {"key": "д", "textRu": "правосторонней почечной коликой", "textEn": "Right renal colic"}
  ]},
  {"id": 17, "number": 17, "topicId": "appendicitis", "page": 2, "questionRu": "ДЛЯ ДИФФЕРЕНЦИАЛЬНОЙ ДИАГНОСТИКИ МЕЖДУ НИЖНЕДОЛЕВОЙ ПРАВОСТОРОННЕЙ ПНЕВМОНИЕЙ И ОСТРЫМ АППЕНДИЦИТОМ НУЖНО УЧИТЫВАТЬ ВСЕ, КРОМЕ:", "questionEn": "For differential diagnosis between right lower lobe pneumonia and acute appendicitis, one must consider all EXCEPT:", "correctKey": "г", "options": [
    {"key": "а", "textRu": "данных аускультации органов дыхания", "textEn": "Respiratory auscultation data"},
    {"key": "б", "textRu": "данных лапароскопии", "textEn": "Laparoscopy data"},
    {"key": "в", "textRu": "данных рентгеноскопии органов грудной клетки", "textEn": "Chest X-ray data"},
    {"key": "г", "textRu": "количества лейкоцитов крови", "textEn": "Blood leukocyte count (elevated in both)"},
    {"key": "д", "textRu": "данных термографии брюшной полости", "textEn": "Abdominal thermography"}
  ]},
  {"id": 18, "number": 18, "topicId": "appendicitis", "page": 2, "questionRu": "РЕШАЮЩИМ В ДИФФЕРЕНЦИАЛЬНОЙ ДИАГНОСТИКЕ ОСТРОГО АППЕНДИЦИТА С НАРУШЕННОЙ ВНЕМАТОЧНОЙ БЕРЕМЕННОСТЬЮ ЯВЛЯЕТСЯ:", "questionEn": "The decisive diagnostic test to differentiate acute appendicitis from ruptured ectopic pregnancy is:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "симптом Кохера–Волковича", "textEn": "Kocher-Volkovich sign"},
    {"key": "б", "textRu": "симптом Промптова", "textEn": "Promptov sign"},
    {"key": "в", "textRu": "головокружение и обмороки", "textEn": "Dizziness and syncope"},
    {"key": "г", "textRu": "симптом Бартомье–Михельсона", "textEn": "Bartomier-Michelson sign"},
    {"key": "д", "textRu": "пункция заднего свода влагалища", "textEn": "Culdocentesis (posterior vaginal fornix puncture)"}
  ]},
  {"id": 19, "number": 19, "topicId": "appendicitis", "page": 2, "questionRu": "ПРИ ПРОВЕДЕНИИ ДИФФЕРЕНЦИАЛЬНОГО ДИАГНОЗА У БОЛЬНОЙ 26 ЛЕТ МЕЖДУ ОСТРЫМ АППЕНДИЦИТОМ (ТАЗОВОЕ РАСПОЛОЖЕНИЕ) И ПРЕРВАВШЕЙСЯ ВНЕМАТОЧНОЙ БЕРЕМЕННОСТЬЮ СЛЕДУЕТ ПРИНИМАТЬ ВО ВНИМАНИЕ СЛЕДУЮЩИЕ МОМЕНТЫ:\n1) жалобы и данные анамнеза\n2) показатели белой крови и гемоглобина\n3) результаты пункции заднего свода влагалища\n4) наличие симптома Кулленкампфа\n5) результаты влагалищного и ректального исследования", "questionEn": "In differential diagnosis between pelvic acute appendicitis and ruptured ectopic pregnancy in a 26yo female, consider:\n1) history\n2) WBC and hemoglobin\n3) culdocentesis\n4) Cullenkampf sign\n5) vaginal and rectal exam", "correctKey": "д", "options": [
    {"key": "а", "textRu": "1,2", "textEn": "1,2"},
    {"key": "б", "textRu": "1,2,3", "textEn": "1,2,3"},
    {"key": "в", "textRu": "1,2,3,4", "textEn": "1,2,3,4"},
    {"key": "г", "textRu": "1,2,3,5", "textEn": "1,2,3,5"},
    {"key": "д", "textRu": "все ответы правильные", "textEn": "All answers are correct"}
  ]},
  {"id": 20, "number": 20, "topicId": "appendicitis", "page": 3, "questionRu": "ПРИ ПРОВЕДЕНИИ ДИФФЕРЕНЦИАЛЬНОГО ДИАГНОЗА МЕЖДУ ОСТРЫМ ХОЛЕЦИСТИТОМ И ОСТРЫМ АППЕНДИЦИТОМ С ВЫСОКИМ РАСПОЛОЖЕНИЕМ ЧЕРВЕОБРАЗНОГО ОТРОСТКА, НАИБОЛЕЕ ИНФОРМАТИВНЫМИ БУДУТ СЛЕДУЮЩИЕ ИНСТРУМЕНТАЛЬНЫЕ МЕТОДЫ ОБСЛЕДОВАНИЯ:\n1. обзорная рентгенография органов брюшной полости\n2. УЗИ исследование органов брюшной полости\n3. пероральная холецистография\n4. лапароцентез\n5. лапароскопия", "questionEn": "For differential diagnosis between acute cholecystitis and high-lying acute appendicitis, the most informative methods are:\n1. plain abdominal X-ray\n2. abdominal ultrasound\n3. oral cholecystography\n4. laparocentesis\n5. laparoscopy", "correctKey": "в", "options": [
    {"key": "а", "textRu": "1,2", "textEn": "1,2"},
    {"key": "б", "textRu": "1,2,3", "textEn": "1,2,3"},
    {"key": "в", "textRu": "2,5", "textEn": "2,5 (Ultrasound & Laparoscopy)"},
    {"key": "г", "textRu": "2,3,4,5", "textEn": "2,3,4,5"},
    {"key": "д", "textRu": "4,5", "textEn": "4,5"}
  ]}
]

print("Built chunk 1 core items.")
