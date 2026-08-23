import json
import os

questions_1_100 = [
  {
    "id": 1,
    "number": 1,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ДЛЯ ОСТРОГО АППЕНДИЦИТА НЕ ХАРАКТЕРЕН СИМПТОМ:",
    "questionEn": "Which symptom is NOT characteristic of acute appendicitis?",
    "correctKey": "в",
    "options": [
      { "key": "а", "textRu": "Ровзинга", "textEn": "Rovsing sign" },
      { "key": "б", "textRu": "Воскресенского", "textEn": "Voskresensky sign" },
      { "key": "в", "textRu": "Мерфи", "textEn": "Murphy sign" },
      { "key": "г", "textRu": "Образцова", "textEn": "Obraztsov sign" },
      { "key": "д", "textRu": "Бартомье–Михельсона", "textEn": "Bartomier-Michelson sign" }
    ]
  },
  {
    "id": 2,
    "number": 2,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "СПЕЦИФИЧЕСКИМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ СИМПТОМ:",
    "questionEn": "Which of the following is a pathognomonic / specific symptom for acute appendicitis?",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "Кохера–Волковича", "textEn": "Kocher-Volkovich sign" },
      { "key": "б", "textRu": "Ровзинга", "textEn": "Rovsing sign" },
      { "key": "в", "textRu": "Ситковского", "textEn": "Sitkovsky sign" },
      { "key": "г", "textRu": "все три симптома", "textEn": "All three symptoms" },
      { "key": "д", "textRu": "ни один из них", "textEn": "None of them (no single sign is 100% pathognomonic alone)" }
    ]
  },
  {
    "id": 3,
    "number": 3,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "К ПЕРИТОНЕАЛЬНЫМ СИМПТОМАМ ПРИ ОСТРОМ АППЕНДИЦИТЕ ОТНОСЯТ СИМПТОМЫ:",
    "questionEn": "Peritoneal signs in acute appendicitis include:",
    "correctKey": "г",
    "options": [
      { "key": "а", "textRu": "Воскресенского (синдром \"рубашки\")", "textEn": "Voskresensky (shirt sign)" },
      { "key": "б", "textRu": "Щеткина–Блюмберга", "textEn": "Shchetkin-Blumberg (rebound tenderness)" },
      { "key": "в", "textRu": "Раздольского", "textEn": "Razdolsky sign (percussion tenderness)" },
      { "key": "г", "textRu": "все названные симптомы", "textEn": "All of the named signs" },
      { "key": "д", "textRu": "ни один из них", "textEn": "None of them" }
    ]
  },
  {
    "id": 4,
    "number": 4,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "НЕВЕРНЫМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ УТВЕРЖДЕНИЕ, ЧТО:",
    "questionEn": "Which statement is INCORRECT regarding acute appendicitis?",
    "correctKey": "в",
    "options": [
      { "key": "а", "textRu": "ригидность брюшной стенки может отсутствовать при ретроцекальном расположении отростка", "textEn": "Abdominal rigidity may be absent in retrocecal appendix" },
      { "key": "б", "textRu": "ригидности может не быть при тазовом расположении", "textEn": "Rigidity may be absent in pelvic position" },
      { "key": "в", "textRu": "рвота всегда предшествует боли", "textEn": "Vomiting always precedes the onset of pain" },
      { "key": "г", "textRu": "боль может начинаться в области пупка", "textEn": "Pain may begin in the periumbilical region" },
      { "key": "д", "textRu": "боль чаще начинается в эпигастральной области", "textEn": "Pain most often begins in the epigastric region" }
    ]
  },
  {
    "id": 5,
    "number": 5,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА ИСПОЛЬЗУЮТСЯ МЕТОДЫ:",
    "questionEn": "Methods used for the diagnosis of acute appendicitis include:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "лапароскопия", "textEn": "Laparoscopy" },
      { "key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count (CBC)" },
      { "key": "в", "textRu": "ректальное исследование", "textEn": "Digital rectal examination" },
      { "key": "г", "textRu": "термография", "textEn": "Thermography" },
      { "key": "д", "textRu": "все перечисленное верно", "textEn": "All of the above are correct" }
    ]
  },
  {
    "id": 6,
    "number": 6,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА НЕ ПРИМЕНЯЮТ:",
    "questionEn": "Which method is NOT used for the emergency diagnosis of acute appendicitis?",
    "correctKey": "г",
    "options": [
      { "key": "а", "textRu": "пальпацию брюшной стенки", "textEn": "Abdominal palpation" },
      { "key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count" },
      { "key": "в", "textRu": "пальцевое ректальное исследование", "textEn": "Digital rectal examination" },
      { "key": "г", "textRu": "ирригоскопию", "textEn": "Barium enema (irrigoscopy)" },
      { "key": "д", "textRu": "влагалищное исследование", "textEn": "Vaginal bimanual examination" }
    ]
  },
  {
    "id": 7,
    "number": 7,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ПРИ ОСТРОМ ФЛЕГМОНОЗНОМ АППЕНДИЦИТЕ НЕ НАБЛЮДАЕТСЯ СИМПТОМ:",
    "questionEn": "In acute phlegmonous appendicitis, which sign is NOT observed?",
    "correctKey": "г",
    "options": [
      { "key": "а", "textRu": "Щеткина−Блюмберга", "textEn": "Shchetkin-Blumberg sign" },
      { "key": "б", "textRu": "Бартомье−Михельсона", "textEn": "Bartomier-Michelson sign" },
      { "key": "в", "textRu": "Кохера−Волковича", "textEn": "Kocher-Volkovich sign" },
      { "key": "г", "textRu": "Георгиевского−Мюсси", "textEn": "Georgievsky-Mussy sign (frenicus sign in cholecystitis)" },
      { "key": "д", "textRu": "Крымова", "textEn": "Krymov sign" }
    ]
  },
  {
    "id": 8,
    "number": 8,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ПЕРВИЧНО-ГАНГРЕНОЗНЫЙ АППЕНДИЦИТ ЧАЩЕ ВСЕГО ВСТРЕЧАЕТСЯ:",
    "questionEn": "Primary gangrenous appendicitis is most frequently encountered in:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "у детей", "textEn": "Children" },
      { "key": "б", "textRu": "у лиц с тяжелой травмой", "textEn": "Severe trauma patients" },
      { "key": "в", "textRu": "у мужчин", "textEn": "Men" },
      { "key": "г", "textRu": "у женщин", "textEn": "Women" },
      { "key": "д", "textRu": "у лиц пожилого и старческого возраста", "textEn": "Elderly and senile individuals (due to vascular sclerosis)" }
    ]
  },
  {
    "id": 9,
    "number": 9,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ОСТРЫЙ АППЕНДИЦИТ У ДЕТЕЙ ОТЛИЧАЕТСЯ ОТ ТАКОВОГО У ВЗРОСЛЫХ ВСЕМ, КРОМЕ:",
    "questionEn": "Acute appendicitis in children differs from adults by all of the following EXCEPT:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "схваткообразного характера боли, поноса многократной рвоты", "textEn": "Crampy pain, diarrhea, and repeated vomiting" },
      { "key": "б", "textRu": "быстрого развития разлитого перитонита", "textEn": "Rapid progression to generalized peritonitis" },
      { "key": "в", "textRu": "высокой температуры", "textEn": "High fever" },
      { "key": "г", "textRu": "выраженной интоксикации", "textEn": "Marked intoxication" },
      { "key": "д", "textRu": "резкого напряжения мышц в правой подвздошной области", "textEn": "Sharp localized muscle guarding in right iliac fossa" }
    ]
  },
  {
    "id": 10,
    "number": 10,
    "topicId": "appendicitis",
    "page": 1,
    "questionRu": "ДЛЯ ПЕРФОРАТИВНОГО АППЕНДИЦИТА ХАРАКТЕРНО:",
    "questionEn": "Perforative appendicitis is characterized by:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "симптом Раздольского", "textEn": "Razdolsky sign" },
      { "key": "б", "textRu": "нарастание клинической картины перитонита", "textEn": "Worsening clinical picture of peritonitis" },
      { "key": "в", "textRu": "внезапное усиление болей в животе", "textEn": "Sudden surge in abdominal pain" },
      { "key": "г", "textRu": "напряжение мышц передней брюшной стенки", "textEn": "Rigidity of anterior abdominal wall muscles" },
      { "key": "д", "textRu": "все перечисленное", "textEn": "All of the above" }
    ]
  }
]

print("Writing chunk1 initial items...")
