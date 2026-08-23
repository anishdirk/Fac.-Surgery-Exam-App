import json
import os

# Questions 1 to 100
q1_100 = [
  {"id": 1, "number": 1, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ОСТРОГО АППЕНДИЦИТА НЕ ХАРАКТЕРЕН СИМПТОМ:", "questionEn": "Which symptom is NOT characteristic of acute appendicitis?", "correctKey": "в", "options": [
    {"key": "а", "textRu": "Ровзинга", "textEn": "Rovsing's sign"},
    {"key": "б", "textRu": "Воскресенского", "textEn": "Voskresensky's sign"},
    {"key": "в", "textRu": "Мерфи", "textEn": "Murphy's sign (cholecystitis)"},
    {"key": "г", "textRu": "Образцова", "textEn": "Obraztsov's sign"},
    {"key": "д", "textRu": "Бартомье–Михельсона", "textEn": "Bartomier-Michelson's sign"}
  ]},
  {"id": 2, "number": 2, "topicId": "appendicitis", "page": 1, "questionRu": "СПЕЦИФИЧЕСКИМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ СИМПТОМ:", "questionEn": "Which sign is specific / pathognomonic for acute appendicitis?", "correctKey": "д", "options": [
    {"key": "а", "textRu": "Кохера–Волковича", "textEn": "Kocher-Volkovich sign"},
    {"key": "б", "textRu": "Ровзинга", "textEn": "Rovsing's sign"},
    {"key": "в", "textRu": "Ситковского", "textEn": "Sitkovsky's sign"},
    {"key": "г", "textRu": "все три симптома", "textEn": "All three symptoms"},
    {"key": "д", "textRu": "ни один из них", "textEn": "None of them"}
  ]},
  {"id": 3, "number": 3, "topicId": "appendicitis", "page": 1, "questionRu": "К ПЕРИТОНЕАЛЬНЫМ СИМПТОМАМ ПРИ ОСТРОМ АППЕНДИЦИТЕ ОТНОСЯТ СИМПТОМЫ:", "questionEn": "Peritoneal signs in acute appendicitis include:", "correctKey": "г", "options": [
    {"key": "а", "textRu": "Воскресенского (синдром \"рубашки\")", "textEn": "Voskresensky (shirt sign)"},
    {"key": "б", "textRu": "Щеткина–Блюмберга", "textEn": "Shchetkin-Blumberg (rebound tenderness)"},
    {"key": "в", "textRu": "Раздольского", "textEn": "Razdolsky (percussion tenderness)"},
    {"key": "г", "textRu": "все названные симптомы", "textEn": "All of the above"},
    {"key": "д", "textRu": "ни один из них", "textEn": "None of them"}
  ]},
  {"id": 4, "number": 4, "topicId": "appendicitis", "page": 1, "questionRu": "НЕВЕРНЫМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ УТВЕРЖДЕНИЕ, ЧТО:", "questionEn": "Which statement regarding acute appendicitis is INCORRECT?", "correctKey": "в", "options": [
    {"key": "а", "textRu": "ригидность брюшной стенки может отсутствовать при ретроцекальном расположении отростка", "textEn": "Abdominal wall rigidity may be absent in retrocecal position"},
    {"key": "б", "textRu": "ригидности может не быть при тазовом расположении", "textEn": "Rigidity may be absent in pelvic position"},
    {"key": "в", "textRu": "рвота всегда предшествует боли", "textEn": "Vomiting always precedes the pain"},
    {"key": "г", "textRu": "боль может начинаться в области пупка", "textEn": "Pain can start around the umbilicus"},
    {"key": "д", "textRu": "боль чаще начинается в эпигастральной области", "textEn": "Pain most often begins in epigastrium"}
  ]},
  {"id": 5, "number": 5, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА ИСПОЛЬЗУЮТСЯ МЕТОДЫ:", "questionEn": "Methods used for acute appendicitis diagnosis include:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "лапароскопия", "textEn": "Laparoscopy"},
    {"key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count"},
    {"key": "в", "textRu": "ректальное исследование", "textEn": "Rectal examination"},
    {"key": "г", "textRu": "термография", "textEn": "Thermography"},
    {"key": "д", "textRu": "все перечисленное верно", "textEn": "All of the above are correct"}
  ]},
  {"id": 6, "number": 6, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА НЕ ПРИМЕНЯЮТ:", "questionEn": "Which method is NOT used for acute appendicitis diagnosis?", "correctKey": "г", "options": [
    {"key": "а", "textRu": "пальпацию брюшной стенки", "textEn": "Abdominal wall palpation"},
    {"key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count"},
    {"key": "в", "textRu": "пальцевое ректальное исследование", "textEn": "Digital rectal examination"},
    {"key": "г", "textRu": "ирригоскопию", "textEn": "Barium enema (irrigoscopy)"},
    {"key": "д", "textRu": "влагалищное исследование", "textEn": "Vaginal examination"}
  ]},
  {"id": 7, "number": 7, "topicId": "appendicitis", "page": 1, "questionRu": "ПРИ ОСТРОМ ФЛЕГМОНОЗНОМ АППЕНДИЦИТЕ НЕ НАБЛЮДАЕТСЯ СИМПТОМ:", "questionEn": "In acute phlegmonous appendicitis, which sign is NOT observed?", "correctKey": "г", "options": [
    {"key": "а", "textRu": "Щеткина−Блюмберга", "textEn": "Shchetkin-Blumberg sign"},
    {"key": "б", "textRu": "Бартомье−Михельсона", "textEn": "Bartomier-Michelson sign"},
    {"key": "в", "textRu": "Кохера−Волковича", "textEn": "Kocher-Volkovich sign"},
    {"key": "г", "textRu": "Георгиевского−Мюсси", "textEn": "Georgievsky-Mussy sign"},
    {"key": "д", "textRu": "Крымова", "textEn": "Krymov sign"}
  ]},
  {"id": 8, "number": 8, "topicId": "appendicitis", "page": 1, "questionRu": "ПЕРВИЧНО-ГАНГРЕНОЗНЫЙ АППЕНДИЦИТ ЧАЩЕ ВСЕГО ВСТРЕЧАЕТСЯ:", "questionEn": "Primary gangrenous appendicitis is most frequently encountered in:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "у детей", "textEn": "Children"},
    {"key": "б", "textRu": "у лиц с тяжелой травмой", "textEn": "Severe trauma patients"},
    {"key": "в", "textRu": "у мужчин", "textEn": "Men"},
    {"key": "г", "textRu": "у женщин", "textEn": "Women"},
    {"key": "д", "textRu": "у лиц пожилого и старческого возраста", "textEn": "Elderly and senile individuals"}
  ]},
  {"id": 9, "number": 9, "topicId": "appendicitis", "page": 1, "questionRu": "ОСТРЫЙ АППЕНДИЦИТ У ДЕТЕЙ ОТЛИЧАЕТСЯ ОТ ТАКОВОГО У ВЗРОСЛЫХ ВСЕМ, КРОМЕ:", "questionEn": "Acute appendicitis in children differs from adults by all EXCEPT:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "схваткообразного характера боли, поноса многократной рвоты", "textEn": "Crampy pain, diarrhea, and vomiting"},
    {"key": "б", "textRu": "быстрого развития разлитого перитонита", "textEn": "Rapid development of diffuse peritonitis"},
    {"key": "в", "textRu": "высокой температуры", "textEn": "High fever"},
    {"key": "г", "textRu": "выраженной интоксикации", "textEn": "Severe systemic toxicity"},
    {"key": "д", "textRu": "резкого напряжения мышц в правой подвздошной области", "textEn": "Sharp muscular rigidity in right iliac fossa"}
  ]},
  {"id": 10, "number": 10, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ПЕРФОРАТИВНОГО АППЕНДИЦИТА ХАРАКТЕРНО:", "questionEn": "Perforative appendicitis is characterized by:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "симптом Раздольского", "textEn": "Razdolsky sign"},
    {"key": "б", "textRu": "нарастание клинической картины перитонита", "textEn": "Progressive peritonitis"},
    {"key": "в", "textRu": "внезапное усиление болей в животе", "textEn": "Sudden sharp worsening of abdominal pain"},
    {"key": "г", "textRu": "напряжение мышц передней брюшной стенки", "textEn": "Anterior abdominal wall muscle rigidity"},
    {"key": "д", "textRu": "все перечисленное", "textEn": "All of the above"}
  ]},
  {"id": 11, "number": 11, "topicId": "appendicitis", "page": 1, "questionRu": "ДЛЯ ГАНГРЕНОЗНОЙ ФОРМЫ АППЕНДИЦИТА НЕ ХАРАКТЕРНО:", "questionEn": "Which is NOT characteristic of gangrenous appendicitis?", "correctKey": "б", "options": [
    {"key": "а", "textRu": "доскообразный живот", "textEn": "Board-like abdomen"},
    {"key": "б", "textRu": "усиление болей в правой подвздошной области", "textEn": "Intensification of pain in right iliac fossa (nerve ending necrosis causes pseudo-relief)"},
    {"key": "в", "textRu": "уменьшение болевых ощущений в правой подвздошной области", "textEn": "Decrease of pain sensations in right iliac fossa"},
    {"key": "г", "textRu": "тахикардия", "textEn": "Tachycardia"},
    {"key": "д", "textRu": "симптом Щеткина–Блюмберга", "textEn": "Shchetkin-Blumberg sign"}
  ]},
  {"id": 12, "number": 12, "topicId": "appendicitis", "page": 1, "questionRu": "БОЛЬНАЯ 24 ЛЕТ ЖАЛУЕТСЯ НА ТОШНОТУ И РВОТУ, БОЛИ В ОБЛАСТИ ПУПКА ДЛИТЕЛЬНОСТЬЮ ОКОЛО 5 ЧАСОВ. В ТЕЧЕНИЕ ПОСЛЕДНЕГО ПОЛУЧАСА БОЛИ ПЕРЕМЕСТИЛИСЬ В ПРАВУЮ ПОДВЗДОШНУЮ ОБЛАСТЬ, ТЕМПЕРАТУРА ТЕЛА 37,6°С. У БОЛЬНОЙ НАИБОЛЕЕ ВЕРОЯТЕН ДИАГНОЗ:", "questionEn": "A 24-year-old female presents with nausea, vomiting, and periumbilical pain for 5 hours. Over the last 30 minutes, pain shifted to the right iliac fossa, temperature 37.6°C. Most probable diagnosis:", "correctKey": "в", "options": [
    {"key": "а", "textRu": "острый пиелонефрит", "textEn": "Acute pyelonephritis"},
    {"key": "б", "textRu": "острый правосторонний аднексит", "textEn": "Acute right adnexitis"},
    {"key": "в", "textRu": "острый аппендицит", "textEn": "Acute appendicitis (Kocher sign)"},
    {"key": "г", "textRu": "разрыв овариальной кисты", "textEn": "Ruptured ovarian cyst"},
    {"key": "д", "textRu": "нарушенная внематочная беременность", "textEn": "Ectopic pregnancy"}
  ]},
  {"id": 13, "number": 13, "topicId": "appendicitis", "page": 2, "questionRu": "У БОЛЬНОГО, 59 ЛЕТ, ТРОЕ СУТОК НАЗАД ПОЯВИЛИСЬ БОЛИ В ЭПИГАСТРАЛЬНОЙ ОБЛАСТИ, КОТОРЫЕ СМЕСТИЛИСЬ В ПРАВУЮ ПОДВЗДОШНУЮ ОБЛАСТЬ. БОЛЬНОЙ ПРИНИМАЛ АНАЛЬГИН И ПРИКЛАДЫВАЛ К ЖИВОТУ ГРЕЛКУ, ПОСЛЕ ЧЕГО БОЛИ В ЖИВОТЕ СТИХЛИ. НА СЛЕДУЮЩИЙ ДЕНЬ БОЛИ ВОЗОБНОВИЛИСЬ, РАСПРОСТРАНИЛИСЬ ПО ВСЕМУ ЖИВОТУ, ПОЯВИЛАСЬ МНОГОКРАТНАЯ РВОТА. СОСТОЯНИЕ БОЛЬНОГО ТЯЖЕЛОЕ. ПУЛЬС-128УД/МИН. ЯЗЫК СУХОЙ. ЖИВОТ БОЛЕЗНЕННЫЙ И НАПРЯЖЕННЫЙ ВО ВСЕХ ОТДЕЛАХ. СИМПТОМ ЩЕТКИНА - БЛЮМБЕРГА ПОЛОЖИТЕЛЬНЫЙ ПО ВСЕМУ ЖИВОТУ. ЛЕЙКОЦИТОЗ 18,6x10/Л. У больного можно предполагать:", "questionEn": "A 59-year-old male had epigastric pain shifting to RIF 3 days ago. He applied heat and took painkillers, after which pain temporarily eased. Next day, diffuse severe pain returned with repeated vomiting. Pulse 128, diffuse rigidity, positive Blumberg across abdomen, leukocytosis 18.6. Suspected diagnosis:", "correctKey": "а", "options": [
    {"key": "а", "textRu": "острый перфоративный аппендицит, осложненный разлитым перитонитом", "textEn": "Acute perforated appendicitis complicated by diffuse peritonitis"},
    {"key": "б", "textRu": "пилефлебит", "textEn": "Pylephlebitis"},
    {"key": "в", "textRu": "периаппендикулярный абсцесс", "textEn": "Periappendicular abscess"},
    {"key": "г", "textRu": "пищевую токсикоинфекцию", "textEn": "Foodborne intoxication"},
    {"key": "д", "textRu": "деструктивный холецистит", "textEn": "Destructive cholecystitis"}
  ]},
  {"id": 14, "number": 14, "topicId": "appendicitis", "page": 2, "questionRu": "БОЛЬНОЙ 28 ЛЕТ, ЖАЛУЕТСЯ НА БОЛИ В ПРАВОЙ ПОДВЗДОШНОЙ ОБЛАСТИ, КОТОРЫЕ НАЧАЛИСЬ 12 ЧАСОВ ТОМУ НАЗАД В ЭПИГАСТРИИ И В ПОСЛЕДУЮЩИМ СМЕСТИЛИСЬ В ПРАВУЮ ПОДВЗДОШНУЮ И МЕЗОГАСТРАЛЬНУЮ ОБЛАСТЬ. ТЕМПЕРАТУРА 37,7°С, ПУЛЬС 96 УД/МИН. ЖИВОТ МЯГКИЙ, БОЛЕЗНЕННОСТЬ В ТРЕУГОЛЬНИКЕ ПТИ, СИМПТОМЫ ПАСТЕРНАЦКОГО, ОБРАЗЦОВА (ПСОАС-СИМПТОМ) - ПОЛОЖИТЕЛЬНЫЕ. ВЫБЕРИТЕ НАИБОЛЕЕ ВЕРОЯТНЫЙ ДИАГНОЗ:", "questionEn": "A 28yo male with right lower quadrant pain shifting from epigastrium 12h ago. Abdomen is soft, tenderness in Petit triangle, positive Psoas sign (Obraztsov) and Pasternatsky. Most probable diagnosis:", "correctKey": "а", "options": [
    {"key": "а", "textRu": "острый аппендицит с ретроцекальным расположением червеобразного отростка", "textEn": "Acute appendicitis with retrocecal position of the appendix"},
    {"key": "б", "textRu": "правосторонняя почечная колика", "textEn": "Right renal colic"},
    {"key": "в", "textRu": "острый деструктивный аппендицит, с тазовым расположением червеобразного отростка", "textEn": "Acute destructive appendicitis with pelvic position"},
    {"key": "г", "textRu": "правосторонний пиелонефрит", "textEn": "Right pyelonephritis"},
    {"key": "д", "textRu": "опухоль правой половины ободочной кишки", "textEn": "Right colon tumor"}
  ]},
  {"id": 15, "number": 15, "topicId": "appendicitis", "page": 2, "questionRu": "КЛИНИЧЕСКИ ОСТРЫЙ АППЕНДИЦИТ МОЖЕТ БЫТЬ ПРИНЯТ:", "questionEn": "Clinically, acute appendicitis can be mistaken for:", "correctKey": "д", "options": [
    {"key": "а", "textRu": "за сальпингит", "textEn": "Salpingitis"},
    {"key": "б", "textRu": "за острый холецистит", "textEn": "Acute cholecystitis"},
    {"key": "в", "textRu": "за дивертикулит Меккеля", "textEn": "Meckel diverticulitis"},
    {"key": "г", "textRu": "за внематочную беременность", "textEn": "Ectopic pregnancy"},
    {"key": "д", "textRu": "за любую из этих видов патологии", "textEn": "Any of these pathologies"}
  ]}
]

# Write chunk 1
os.makedirs('src/data/questions', exist_ok=True)
print("Ready to generate chunk 1.")
