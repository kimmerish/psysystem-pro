export type Urgency = "low" | "medium" | "high" | "critical";
export type RequestStatus = "new" | "in_processing" | "scheduled" | "completed" | "cancelled";
export type ReportStatus = "draft" | "submitted" | "approved" | "rejected";
export type EventType = "consultation" | "group_work" | "travel" | "documentation" | "other";
export type Role = "SuperAdmin" | "ServiceChief" | "Psychologist" | "Applicant";

export const urgencyLabels: Record<Urgency, string> = {
  low: "Низька",
  medium: "Середня",
  high: "Висока",
  critical: "Критична",
};

export const statusLabels: Record<RequestStatus, string> = {
  new: "Нове",
  in_processing: "В обробці",
  scheduled: "Заплановано",
  completed: "Завершено",
  cancelled: "Скасовано",
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  draft: "Чернетка",
  submitted: "Подано",
  approved: "Затверджено",
  rejected: "Повернуто",
};

export const eventTypeLabels: Record<EventType, string> = {
  consultation: "Консультація",
  group_work: "Групова робота",
  travel: "Переїзд",
  documentation: "Документація",
  other: "Інше",
};

export const roleLabels: Record<Role, string> = {
  SuperAdmin: "Головний адміністратор",
  ServiceChief: "Начальник служби",
  Psychologist: "Психолог",
  Applicant: "Заявник",
};

export const categories = [
  "Адаптація",
  "Бойовий стрес",
  "Адиктивна поведінка",
  "Конфлікт",
  "Сімейні труднощі",
  "Суїцидальні ризики",
  "Інше",
] as const;

export const units = [
  { id: "u1", name: "115 ОМБр", code: "115-OMBR", parent: "Оперативне командування «Північ»", location: "Пункт Схід" },
  { id: "u2", name: "25 ОПДБр", code: "25-OPDBR", parent: "ДШВ", location: "База Північ" },
  { id: "u3", name: "Центр підготовки", code: "CP-01", parent: "Навчальне командування", location: "Селекція-1" },
  { id: "u4", name: "47 ОМБр", code: "47-OMBR", parent: "Оперативне командування «Схід»", location: "Пункт Схід" },
];

export const locations = [
  { id: "l1", name: "Селекція-1", coordinates: "49.8397, 24.0297", address: "Навчальний майданчик, сектор А" },
  { id: "l2", name: "Пункт Схід", coordinates: "48.5937, 38.0000", address: "Польовий пункт психологічної допомоги" },
  { id: "l3", name: "База Північ", coordinates: "50.4501, 30.5234", address: "Пункт постійної дислокації, корпус 3" },
];

export const psychologists = [
  { id: "p1", name: "Олена Ковальчук", unit: "115 ОМБр", specialization: "Бойовий стрес, ПТСР" },
  { id: "p2", name: "Андрій Мельник", unit: "25 ОПДБр", specialization: "Адаптація, кризове втручання" },
  { id: "p3", name: "Ірина Бондаренко", unit: "Центр підготовки", specialization: "Адиктивна поведінка" },
  { id: "p4", name: "Сергій Ткаченко", unit: "47 ОМБр", specialization: "Сімейне консультування" },
];

export const profiles = [
  { id: "pr1", full_name: "Олена Ковальчук", email: "o.kovalchuk@psy.mil", role: "Psychologist" as Role, unit: "115 ОМБр" },
  { id: "pr2", full_name: "Андрій Мельник", email: "a.melnyk@psy.mil", role: "Psychologist" as Role, unit: "25 ОПДБр" },
  { id: "pr3", full_name: "Ірина Бондаренко", email: "i.bondarenko@psy.mil", role: "Psychologist" as Role, unit: "Центр підготовки" },
  { id: "pr4", full_name: "Сергій Ткаченко", email: "s.tkachenko@psy.mil", role: "Psychologist" as Role, unit: "47 ОМБр" },
  { id: "pr5", full_name: "Володимир Гринчук", email: "v.hrynchuk@psy.mil", role: "ServiceChief" as Role, unit: "Служба" },
  { id: "pr6", full_name: "Марія Литвин", email: "m.lytvyn@psy.mil", role: "SuperAdmin" as Role, unit: "Служба" },
  { id: "pr7", full_name: "Петро Савчук", email: "p.savchuk@unit.mil", role: "Applicant" as Role, unit: "115 ОМБр" },
];

export type RequestItem = {
  id: string;
  code: string;
  applicant: string;
  unit: string;
  location: string;
  request_type: string;
  raw_text: string;
  structured_text: string;
  category: string;
  urgency: Urgency;
  status: RequestStatus;
  created_at: string;
};

export const requests: RequestItem[] = [
  {
    id: "r1",
    code: "ЗВ-0241",
    applicant: "Петро Савчук",
    unit: "115 ОМБр",
    location: "Пункт Схід",
    request_type: "Звернення командира",
    raw_text: "Треба поговорити, у хлопців щось не те після ротації",
    structured_text:
      "Командир підрозділу повідомляє про ознаки емоційного виснаження військовослужбовців після повернення з ротації. Потребує групової діагностики та індивідуальних консультацій.",
    category: "Бойовий стрес",
    urgency: "high",
    status: "in_processing",
    created_at: "2026-08-28",
  },
  {
    id: "r2",
    code: "ЗВ-0242",
    applicant: "Ігор Дяченко",
    unit: "25 ОПДБр",
    location: "База Північ",
    request_type: "Самозвернення",
    raw_text: "Не сплю нормально вже третій тиждень",
    structured_text:
      "Військовослужбовець повідомляє про стійке порушення сну тривалістю понад три тижні, ознаки тривожності та зниження концентрації уваги.",
    category: "Бойовий стрес",
    urgency: "medium",
    status: "scheduled",
    created_at: "2026-08-29",
  },
  {
    id: "r3",
    code: "ЗВ-0243",
    applicant: "Анонімно (QR)",
    unit: "Центр підготовки",
    location: "Селекція-1",
    request_type: "QR-звернення",
    raw_text: "Є проблеми",
    structured_text:
      "Звернення потребує уточнення. Отримано відповіді: конфлікт із безпосереднім командиром, триває близько двох тижнів, залучено 3 особи.",
    category: "Конфлікт",
    urgency: "medium",
    status: "new",
    created_at: "2026-09-01",
  },
  {
    id: "r4",
    code: "ЗВ-0244",
    applicant: "Олег Кравець",
    unit: "47 ОМБр",
    location: "Пункт Схід",
    request_type: "Скерування медичної служби",
    raw_text: "Побратим каже, що не бачить сенсу далі",
    structured_text:
      "Отримано інформацію про висловлювання військовослужбовця, що можуть свідчити про суїцидальні наміри. Потрібне негайне кризове втручання та оцінка ризику.",
    category: "Суїцидальні ризики",
    urgency: "critical",
    status: "in_processing",
    created_at: "2026-09-02",
  },
  {
    id: "r5",
    code: "ЗВ-0245",
    applicant: "Наталія Гуменюк",
    unit: "115 ОМБр",
    location: "Пункт Схід",
    request_type: "Самозвернення",
    raw_text: "Вдома складна ситуація, важко зосередитись",
    structured_text:
      "Військовослужбовиця повідомляє про сімейні труднощі, що впливають на працездатність та концентрацію під час виконання службових завдань.",
    category: "Сімейні труднощі",
    urgency: "medium",
    status: "completed",
    created_at: "2026-08-20",
  },
  {
    id: "r6",
    code: "ЗВ-0246",
    applicant: "Юрій Панасюк",
    unit: "Центр підготовки",
    location: "Селекція-1",
    request_type: "Звернення командира",
    raw_text: "Новоприбулі важко вливаються в колектив",
    structured_text:
      "Командир повідомляє про труднощі адаптації новоприбулого поповнення: дистанціювання від колективу, зниження мотивації, поодинокі порушення розпорядку.",
    category: "Адаптація",
    urgency: "low",
    status: "scheduled",
    created_at: "2026-09-03",
  },
  {
    id: "r7",
    code: "ЗВ-0247",
    applicant: "Анонімно (QR)",
    unit: "25 ОПДБр",
    location: "База Північ",
    request_type: "QR-звернення",
    raw_text: "Багато п'є після повернення",
    structured_text:
      "Повідомлення про систематичне вживання алкоголю військовослужбовцем після повернення з ротації. Ознаки адиктивної поведінки, потрібна діагностична бесіда.",
    category: "Адиктивна поведінка",
    urgency: "high",
    status: "new",
    created_at: "2026-09-04",
  },
  {
    id: "r8",
    code: "ЗВ-0248",
    applicant: "Василь Романюк",
    unit: "47 ОМБр",
    location: "Пункт Схід",
    request_type: "Самозвернення",
    raw_text: "Хочу просто проконсультуватись щодо відпустки і стану",
    structured_text:
      "Військовослужбовець звертається за плановою консультацією щодо психологічного стану напередодні відпустки та планування відновлення.",
    category: "Інше",
    urgency: "low",
    status: "completed",
    created_at: "2026-08-15",
  },
];

export type ReportItem = {
  id: string;
  code: string;
  request_code: string;
  psychologist: string;
  goal: string;
  work_description: string;
  results: string;
  recommendations: string;
  status: ReportStatus;
  tags: string[];
  attachments: number;
  created_at: string;
};

export const reports: ReportItem[] = [
  {
    id: "rep1",
    code: "ЗВІТ-118",
    request_code: "ЗВ-0241",
    psychologist: "Олена Ковальчук",
    goal: "Оцінити рівень емоційного виснаження особового складу після ротації.",
    work_description:
      "Проведено групову діагностику (24 особи) за методикою оцінки бойового стресу, 6 індивідуальних бесід, дебрифінг у складі підрозділу.",
    results: "Виявлено підвищений рівень стресу у 9 військовослужбовців, у 2 — ознаки гострої стресової реакції.",
    recommendations: "Індивідуальний супровід 2 осіб, повторна діагностика через 3 тижні, ротаційний відпочинок.",
    status: "approved",
    tags: ["бойовий стрес", "ротація", "групова діагностика"],
    attachments: 3,
    created_at: "2026-08-30",
  },
  {
    id: "rep2",
    code: "ЗВІТ-119",
    request_code: "ЗВ-0244",
    psychologist: "Андрій Мельник",
    goal: "Оцінка суїцидального ризику та кризове втручання.",
    work_description: "Проведено бесіду",
    results: "Ризик оцінено як високий.",
    recommendations: "Постійний супровід.",
    status: "draft",
    tags: ["суїцидальні ризики", "кризове втручання"],
    attachments: 1,
    created_at: "2026-09-02",
  },
  {
    id: "rep3",
    code: "ЗВІТ-120",
    request_code: "ЗВ-0245",
    psychologist: "Сергій Ткаченко",
    goal: "Стабілізація психоемоційного стану у зв'язку з сімейними труднощами.",
    work_description: "Три індивідуальні консультації, техніки саморегуляції, робота з ресурсним станом.",
    results: "Знижено рівень тривожності, відновлено концентрацію уваги під час служби.",
    recommendations: "Підтримувальні консультації раз на два тижні, залучення родини за згодою.",
    status: "approved",
    tags: ["сімейні труднощі", "саморегуляція"],
    attachments: 2,
    created_at: "2026-08-24",
  },
  {
    id: "rep4",
    code: "ЗВІТ-121",
    request_code: "ЗВ-0247",
    psychologist: "Ірина Бондаренко",
    goal: "Діагностика ознак адиктивної поведінки.",
    work_description: "Проведено скринінг AUDIT, дві бесіди. Замінено генератор у наметі психологічної служби.",
    results: "Підтверджено ризиковане вживання алкоголю (16 балів AUDIT).",
    recommendations: "Мотиваційне інтерв'ювання, скерування до медичної служби, контроль через місяць.",
    status: "submitted",
    tags: ["адиктивна поведінка", "алкоголь", "скринінг"],
    attachments: 1,
    created_at: "2026-09-05",
  },
  {
    id: "rep5",
    code: "ЗВІТ-122",
    request_code: "ЗВ-0246",
    psychologist: "Ірина Бондаренко",
    goal: "Підтримка адаптації новоприбулого поповнення.",
    work_description: "Групове заняття з адаптації (18 осіб), анкетування, робота з сержантським складом.",
    results: "Рівень згуртованості підвищено, визначено 4 особи для індивідуального супроводу.",
    recommendations: "Повторне заняття через 2 тижні, наставництво з боку досвідчених військовослужбовців.",
    status: "submitted",
    tags: ["адаптація", "групова робота"],
    attachments: 0,
    created_at: "2026-09-04",
  },
  {
    id: "rep6",
    code: "ЗВІТ-123",
    request_code: "ЗВ-0248",
    psychologist: "Сергій Ткаченко",
    goal: "Планова консультація перед відпусткою.",
    work_description: "Одна консультація, оцінка стану, планування відновлення.",
    results: "Стан у межах норми, ознак дезадаптації не виявлено.",
    recommendations: "Дотримання режиму відновлення, повторна оцінка після повернення.",
    status: "rejected",
    tags: ["профілактика", "відновлення"],
    attachments: 0,
    created_at: "2026-08-16",
  },
];

export type ScheduleEvent = {
  id: string;
  psychologist: string;
  title: string;
  type: EventType;
  day: string;
  start: string;
  end: string;
  location: string;
  travel_hours: number;
  route?: string;
};

export const scheduleEvents: ScheduleEvent[] = [
  { id: "e1", psychologist: "Олена Ковальчук", title: "Індивідуальна консультація — ЗВ-0241", type: "consultation", day: "Пн", start: "09:00", end: "10:00", location: "Пункт Схід", travel_hours: 0 },
  { id: "e2", psychologist: "Олена Ковальчук", title: "Групова робота: подолання бойового стресу", type: "group_work", day: "Пн", start: "11:00", end: "13:00", location: "Пункт Схід", travel_hours: 0 },
  { id: "e3", psychologist: "Олена Ковальчук", title: "Переїзд: Пункт Схід → База Північ", type: "travel", day: "Вт", start: "07:00", end: "11:30", location: "Маршрут", travel_hours: 4.5, route: "Пункт Схід — Ізюм — База Північ, 312 км" },
  { id: "e4", psychologist: "Андрій Мельник", title: "Кризове втручання — ЗВ-0244", type: "consultation", day: "Пн", start: "08:00", end: "09:30", location: "База Північ", travel_hours: 0 },
  { id: "e5", psychologist: "Андрій Мельник", title: "Опрацювання документації", type: "documentation", day: "Ср", start: "14:00", end: "17:00", location: "База Північ", travel_hours: 0 },
  { id: "e6", psychologist: "Ірина Бондаренко", title: "Заняття з адаптації новоприбулих", type: "group_work", day: "Вт", start: "10:00", end: "12:00", location: "Селекція-1", travel_hours: 0 },
  { id: "e7", psychologist: "Ірина Бондаренко", title: "Скринінг адиктивної поведінки", type: "consultation", day: "Чт", start: "09:00", end: "12:00", location: "Селекція-1", travel_hours: 0 },
  { id: "e8", psychologist: "Сергій Ткаченко", title: "Сімейне консультування", type: "consultation", day: "Ср", start: "10:00", end: "11:30", location: "Пункт Схід", travel_hours: 0 },
  { id: "e9", psychologist: "Сергій Ткаченко", title: "Переїзд: База Північ → Селекція-1", type: "travel", day: "Чт", start: "06:30", end: "09:00", location: "Маршрут", travel_hours: 2.5, route: "База Північ — Житомир — Селекція-1, 178 км" },
  { id: "e10", psychologist: "Олена Ковальчук", title: "Методична нарада служби", type: "other", day: "Пт", start: "15:00", end: "16:30", location: "База Північ", travel_hours: 0 },
];

export type CaseRecord = {
  id: string;
  code: string;
  primary_category: string;
  subcategories: string[];
  symptoms: string;
  interventions: string;
  outcomes: string;
  recommendations: string;
  similar: number;
  unit: string;
  created_at: string;
};

export const caseBank: CaseRecord[] = [
  { id: "c1", code: "КЕЙС-301", primary_category: "Адиктивна поведінка", subcategories: ["Алкоголь", "Після ротації"], symptoms: "Систематичне вживання, дратівливість, порушення сну", interventions: "Мотиваційне інтерв'ювання, скринінг AUDIT, скерування до медслужби", outcomes: "Зниження частоти вживання, утримання 6 тижнів", recommendations: "Щомісячний контроль, підтримувальна група", similar: 27, unit: "25 ОПДБр", created_at: "2026-06-11" },
  { id: "c2", code: "КЕЙС-302", primary_category: "Адиктивна поведінка", subcategories: ["Азартні ігри"], symptoms: "Фінансові борги, приховування, тривожність", interventions: "Когнітивна реструктуризація, робота з фінансовою поведінкою", outcomes: "Припинення ставок, часткове погашення боргів", recommendations: "Залучення родини, контроль 3 місяці", similar: 8, unit: "47 ОМБр", created_at: "2026-05-02" },
  { id: "c3", code: "КЕЙС-303", primary_category: "Бойовий стрес", subcategories: ["Гостра стресова реакція"], symptoms: "Флешбеки, гіперзбудження, уникнення", interventions: "Психологічна стабілізація, техніки заземлення, дебрифінг", outcomes: "Зниження інтенсивності симптомів на 60%", recommendations: "Повторна оцінка через 3 тижні", similar: 41, unit: "115 ОМБр", created_at: "2026-07-19" },
  { id: "c4", code: "КЕЙС-304", primary_category: "Бойовий стрес", subcategories: ["Порушення сну"], symptoms: "Безсоння понад 3 тижні, зниження концентрації", interventions: "Гігієна сну, релаксаційні техніки, щоденник сну", outcomes: "Відновлення сну до 6-7 годин", recommendations: "Продовження щоденника, контроль стану", similar: 33, unit: "25 ОПДБр", created_at: "2026-07-28" },
  { id: "c5", code: "КЕЙС-305", primary_category: "Адаптація", subcategories: ["Новоприбуле поповнення"], symptoms: "Дистанціювання, зниження мотивації", interventions: "Групове заняття, наставництво, робота з сержантами", outcomes: "Підвищення згуртованості підрозділу", recommendations: "Повторне заняття через 2 тижні", similar: 19, unit: "Центр підготовки", created_at: "2026-08-03" },
  { id: "c6", code: "КЕЙС-306", primary_category: "Адаптація", subcategories: ["Повернення після поранення"], symptoms: "Невпевненість, страх повторної травматизації", interventions: "Поетапне включення в завдання, супровід", outcomes: "Успішне повернення до обов'язків", recommendations: "Супровід 2 місяці", similar: 12, unit: "47 ОМБр", created_at: "2026-04-22" },
  { id: "c7", code: "КЕЙС-307", primary_category: "Конфлікт", subcategories: ["Із командиром"], symptoms: "Напруження в колективі, скарги, зниження дисципліни", interventions: "Медіація, робота з комунікацією", outcomes: "Врегульовано, конфлікт не поновлювався", recommendations: "Навчання командного складу комунікації", similar: 15, unit: "Центр підготовки", created_at: "2026-06-30" },
  { id: "c8", code: "КЕЙС-308", primary_category: "Конфлікт", subcategories: ["Міжособистісний"], symptoms: "Вербальна агресія, ізоляція окремих осіб", interventions: "Групова медіація, правила взаємодії", outcomes: "Зниження кількості інцидентів", recommendations: "Моніторинг клімату щомісяця", similar: 11, unit: "115 ОМБр", created_at: "2026-05-17" },
  { id: "c9", code: "КЕЙС-309", primary_category: "Сімейні труднощі", subcategories: ["Розлука", "Фінансові питання"], symptoms: "Тривога, зниження концентрації, конфлікти по телефону", interventions: "Консультування, техніки саморегуляції", outcomes: "Стабілізація стану, відновлення працездатності", recommendations: "Підтримувальні консультації", similar: 22, unit: "115 ОМБр", created_at: "2026-08-24" },
  { id: "c10", code: "КЕЙС-310", primary_category: "Сімейні труднощі", subcategories: ["Розлучення"], symptoms: "Пригнічений настрій, апатія", interventions: "Кризове консультування, планування ресурсів", outcomes: "Часткове відновлення, збережено службову придатність", recommendations: "Спостереження 3 місяці", similar: 9, unit: "47 ОМБр", created_at: "2026-03-14" },
  { id: "c11", code: "КЕЙС-311", primary_category: "Суїцидальні ризики", subcategories: ["Висока загроза"], symptoms: "Висловлювання про відсутність сенсу, звуження інтересів", interventions: "Кризове втручання, план безпеки, супровід 24/7", outcomes: "Ризик знижено до помірного", recommendations: "Спостереження, взаємодія з медслужбою", similar: 6, unit: "47 ОМБр", created_at: "2026-09-02" },
  { id: "c12", code: "КЕЙС-312", primary_category: "Інше", subcategories: ["Профілактика", "Відновлення"], symptoms: "Ознак дезадаптації не виявлено", interventions: "Планова консультація, планування відпочинку", outcomes: "Стан у межах норми", recommendations: "Повторна оцінка після відпустки", similar: 4, unit: "47 ОМБр", created_at: "2026-08-16" },
];

export const taxonomy = [
  {
    name: "Психологічні проблеми",
    children: [
      { name: "Адиктивна поведінка", children: [{ name: "Алкоголь" }, { name: "Наркотики" }, { name: "Ліки" }, { name: "Азартні ігри" }] },
      { name: "Адаптація", children: [{ name: "Новоприбулі" }, { name: "Після поранення" }, { name: "Після ротації" }] },
      { name: "Бойовий стрес", children: [{ name: "Гостра стресова реакція" }, { name: "ПТСР" }, { name: "Порушення сну" }] },
      { name: "Конфлікти", children: [{ name: "Із командиром" }, { name: "Міжособистісні" }] },
      { name: "Сімейні питання", children: [{ name: "Розлука" }, { name: "Розлучення" }, { name: "Фінанси" }] },
      { name: "Суїцидальні ризики", children: [{ name: "Помірна загроза" }, { name: "Висока загроза" }] },
    ],
  },
];

export const auditLogs = [
  { id: "a1", user: "Марія Литвин", action: "Створено користувача", entity: "profiles", entity_id: "pr4", ts: "2026-09-05 08:12" },
  { id: "a2", user: "Володимир Гринчук", action: "Затверджено звіт", entity: "reports", entity_id: "rep1", ts: "2026-09-04 17:40" },
  { id: "a3", user: "Олена Ковальчук", action: "Оновлено звернення", entity: "requests", entity_id: "r1", ts: "2026-09-04 12:05" },
  { id: "a4", user: "Ірина Бондаренко", action: "Подано звіт", entity: "reports", entity_id: "rep4", ts: "2026-09-05 09:22" },
  { id: "a5", user: "Система", action: "Синхронізація Google Sheets", entity: "sync", entity_id: "job-771", ts: "2026-09-05 09:23" },
  { id: "a6", user: "Марія Литвин", action: "Згенеровано QR-код", entity: "qr_codes", entity_id: "qr3", ts: "2026-09-03 15:31" },
];

export const qrCodes = [
  { id: "qr1", token: "QR-115-EAST-01", unit: "115 ОМБр", location: "Пункт Схід", active: true, scans: 42 },
  { id: "qr2", token: "QR-25-NORTH-01", unit: "25 ОПДБр", location: "База Північ", active: true, scans: 28 },
  { id: "qr3", token: "QR-CP-SEL-01", unit: "Центр підготовки", location: "Селекція-1", active: true, scans: 61 },
  { id: "qr4", token: "QR-47-EAST-02", unit: "47 ОМБр", location: "Пункт Схід", active: false, scans: 7 },
];

export const monthlyDynamics = [
  { month: "Кві", requests: 34, completed: 30, critical: 2 },
  { month: "Тра", requests: 41, completed: 36, critical: 3 },
  { month: "Чер", requests: 38, completed: 35, critical: 1 },
  { month: "Лип", requests: 52, completed: 44, critical: 4 },
  { month: "Сер", requests: 61, completed: 50, critical: 5 },
  { month: "Вер", requests: 47, completed: 33, critical: 3 },
];

export const categoryBreakdown = [
  { name: "Бойовий стрес", value: 78 },
  { name: "Адаптація", value: 54 },
  { name: "Адиктивна поведінка", value: 39 },
  { name: "Конфлікт", value: 31 },
  { name: "Сімейні труднощі", value: 27 },
  { name: "Суїцидальні ризики", value: 12 },
];

export const unitBreakdown = [
  { unit: "115 ОМБр", requests: 84, reports: 61 },
  { unit: "25 ОПДБр", requests: 63, reports: 48 },
  { unit: "Центр підготовки", requests: 51, reports: 40 },
  { unit: "47 ОМБр", requests: 45, reports: 31 },
];

export const timeUsage = [
  { name: "Консультації", value: 42 },
  { name: "Групова робота", value: 21 },
  { name: "Документація", value: 15 },
  { name: "Переїзди", value: 16 },
  { name: "Інше", value: 6 },
];

export const workload = [
  { psychologist: "Олена Ковальчук", hours: 46, travel: 8.5, risk: "Високий" },
  { psychologist: "Андрій Мельник", hours: 38, travel: 4, risk: "Помірний" },
  { psychologist: "Ірина Бондаренко", hours: 33, travel: 2.5, risk: "Низький" },
  { psychologist: "Сергій Ткаченко", hours: 41, travel: 6.5, risk: "Помірний" },
];
