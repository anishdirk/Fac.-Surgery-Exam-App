import json

questions = [
  {
    "id": 1, "number": 1, "topicId": "appendicitis", "page": 1,
    "questionRu": "ДЛЯ ОСТРОГО АППЕНДИЦИТА НЕ ХАРАКТЕРЕН СИМПТОМ:",
    "questionEn": "Which symptom is NOT characteristic of acute appendicitis?",
    "correctKey": "в",
    "options": [
      { "key": "а", "textRu": "Ровзинга", "textEn": "Rovsing's sign" },
      { "key": "б", "textRu": "Воскресенского", "textEn": "Voskresensky's sign" },
      { "key": "в", "textRu": "Мерфи", "textEn": "Murphy's sign (cholecystitis)" },
      { "key": "г", "textRu": "Образцова", "textEn": "Obraztsov's sign" },
      { "key": "д", "textRu": "Бартомье–Михельсона", "textEn": "Bartomier-Michelson's sign" }
    ]
  },
  {
    "id": 2, "number": 2, "topicId": "appendicitis", "page": 1,
    "questionRu": "СПЕЦИФИЧЕСКИМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ СИМПТОМ:",
    "questionEn": "Which of the following is a specific (pathognomonic) sign for acute appendicitis?",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "Кохера–Волковича", "textEn": "Kocher-Volkovich sign" },
      { "key": "б", "textRu": "Ровзинга", "textEn": "Rovsing's sign" },
      { "key": "в", "textRu": "Ситковского", "textEn": "Sitkovsky's sign" },
      { "key": "г", "textRu": "все три симптома", "textEn": "All three symptoms" },
      { "key": "д", "textRu": "ни один из них", "textEn": "None of them" }
    ]
  },
  {
    "id": 3, "number": 3, "topicId": "appendicitis", "page": 1,
    "questionRu": "К ПЕРИТОНЕАЛЬНЫМ СИМПТОМАМ ПРИ ОСТРОМ АППЕНДИЦИТЕ ОТНОСЯТ СИМПТОМЫ:",
    "questionEn": "Peritoneal signs in acute appendicitis include:",
    "correctKey": "г",
    "options": [
      { "key": "а", "textRu": "Воскресенского (синдром \"рубашки\")", "textEn": "Voskresensky's sign (shirt sign)" },
      { "key": "б", "textRu": "Щеткина–Блюмберга", "textEn": "Shchetkin-Blumberg's sign" },
      { "key": "в", "textRu": "Раздольского", "textEn": "Razdolsky's sign" },
      { "key": "г", "textRu": "все названные симптомы", "textEn": "All named symptoms" },
      { "key": "д", "textRu": "ни один из них", "textEn": "None of them" }
    ]
  },
  {
    "id": 4, "number": 4, "topicId": "appendicitis", "page": 1,
    "questionRu": "НЕВЕРНЫМ ДЛЯ ОСТРОГО АППЕНДИЦИТА ЯВЛЯЕТСЯ УТВЕРЖДЕНИЕ, ЧТО:",
    "questionEn": "Which statement is INCORRECT regarding acute appendicitis?",
    "correctKey": "в",
    "options": [
      { "key": "а", "textRu": "ригидность брюшной стенки может отсутствовать при ретроцекальном расположении отростка", "textEn": "Abdominal rigidity may be absent in retrocecal location" },
      { "key": "б", "textRu": "ригидности может не быть при тазовом расположении", "textEn": "Rigidity may be absent in pelvic location" },
      { "key": "в", "textRu": "рвота всегда предшествует боли", "textEn": "Vomiting always precedes the pain" },
      { "key": "г", "textRu": "боль может начинаться в области пупка", "textEn": "Pain can start in the periumbilical region" },
      { "key": "д", "textRu": "боль чаще начинается в эпигастральной области", "textEn": "Pain most often starts in epigastrium" }
    ]
  },
  {
    "id": 5, "number": 5, "topicId": "appendicitis", "page": 1,
    "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА ИСПОЛЬЗУЮТСЯ МЕТОДЫ:",
    "questionEn": "Methods used for the diagnosis of acute appendicitis include:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "лапароскопия", "textEn": "Laparoscopy" },
      { "key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count (CBC)" },
      { "key": "в", "textRu": "ректальное исследование", "textEn": "Rectal examination" },
      { "key": "г", "textRu": "термография", "textEn": "Thermography" },
      { "key": "д", "textRu": "все перечисленное верно", "textEn": "All of the above are correct" }
    ]
  },
  {
    "id": 6, "number": 6, "topicId": "appendicitis", "page": 1,
    "questionRu": "ДЛЯ ДИАГНОСТИКИ ОСТРОГО АППЕНДИЦИТА НЕ ПРИМЕНЯЮТ:",
    "questionEn": "Which method is NOT used for diagnosing acute appendicitis?",
    "correctKey": "г",
    "options": [
      { "key": "а", "textRu": "пальпацию брюшной стенки", "textEn": "Palpation of the abdominal wall" },
      { "key": "б", "textRu": "клинический анализ крови", "textEn": "Complete blood count" },
      { "key": "в", "textRu": "пальцевое ректальное исследование", "textEn": "Digital rectal examination" },
      { "key": "г", "textRu": "ирригоскопию", "textEn": "Barium enema (irrigoscopy)" },
      { "key": "д", "textRu": "влагалищное исследование", "textEn": "Vaginal bimanual examination" }
    ]
  },
  {
    "id": 7, "number": 7, "topicId": "appendicitis", "page": 1,
    "questionRu": "ПРИ ОСТРОМ ФЛЕГМОНОЗНОМ АППЕНДИЦИТЕ НЕ НАБЛЮДАЕТСЯ СИМПТОМ:",
    "questionEn": "In acute phlegmonous appendicitis, which sign is NOT observed?",
    "correctKey": "г",
    "options": [
      { "key": "а", "textRu": "Щеткина−Блюмберга", "textEn": "Shchetkin-Blumberg sign" },
      { "key": "б", "textRu": "Бартомье−Михельсона", "textEn": "Bartomier-Michelson sign" },
      { "key": "в", "textRu": "Кохера−Волковича", "textEn": "Kocher-Volkovich sign" },
      { "key": "г", "textRu": "Георгиевского−Мюсси", "textEn": "Georgievsky-Mussy (frenicus) sign" },
      { "key": "д", "textRu": "Крымова", "textEn": "Krymov sign" }
    ]
  },
  {
    "id": 8, "number": 8, "topicId": "appendicitis", "page": 1,
    "questionRu": "ПЕРВИЧНО-ГАНГРЕНОЗНЫЙ АППЕНДИЦИТ ЧАЩЕ ВСЕГО ВСТРЕЧАЕТСЯ:",
    "questionEn": "Primary gangrenous appendicitis is most commonly found in:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "у детей", "textEn": "Children" },
      { "key": "б", "textRu": "у лиц с тяжелой травмой", "textEn": "Patients with severe trauma" },
      { "key": "в", "textRu": "у мужчин", "textEn": "Men" },
      { "key": "г", "textRu": "у женщин", "textEn": "Women" },
      { "key": "д", "textRu": "у лиц пожилого и старческого возраста", "textEn": "Elderly and senile individuals" }
    ]
  },
  {
    "id": 9, "number": 9, "topicId": "appendicitis", "page": 1,
    "questionRu": "ОСТРЫЙ АППЕНДИЦИТ У ДЕТЕЙ ОТЛИЧАЕТСЯ ОТ ТАКОВОГО У ВЗРОСЛЫХ ВСЕМ, КРОМЕ:",
    "questionEn": "Acute appendicitis in children differs from adults by all of the following EXCEPT:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "схваткообразного характера боли, поноса многократной рвоты", "textEn": "Cramping pain, diarrhea, repeated vomiting" },
      { "key": "б", "textRu": "быстрого развития разлитого перитонита", "textEn": "Rapid development of diffuse peritonitis" },
      { "key": "в", "textRu": "высокой температуры", "textEn": "High fever" },
      { "key": "г", "textRu": "выраженной интоксикации", "textEn": "Marked toxic syndrome" },
      { "key": "д", "textRu": "резкого напряжения мышц в правой подвздошной области", "textEn": "Sharp localized muscular defense in right iliac fossa" }
    ]
  },
  {
    "id": 10, "number": 10, "topicId": "appendicitis", "page": 1,
    "questionRu": "ДЛЯ ПЕРФОРАТИВНОГО АППЕНДИЦИТА ХАРАКТЕРНО:",
    "questionEn": "Perforated appendicitis is characterized by:",
    "correctKey": "д",
    "options": [
      { "key": "а", "textRu": "симптом Раздольского", "textEn": "Razdolsky sign" },
      { "key": "б", "textRu": "нарастание клинической картины перитонита", "textEn": "Progressive peritoneal signs" },
      { "key": "в", "textRu": "внезапное усиление болей в животе", "textEn": "Sudden surge of abdominal pain" },
      { "key": "г", "textRu": "напряжение мышц передней брюшной стенки", "textEn": "Anterior abdominal wall muscular rigidity" },
      { "key": "д", "textRu": "все перечисленное", "textEn": "All of the above" }
    ]
  }
]

with open('src/data/questions/chunk1.ts', 'w', encoding='utf-8') as f:
    f.write("import { Question } from '../../types';\n\n")
    f.write("export const CHUNK_1: Question[] = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n")
print("Chunk 1 written successfully.")
