# Ясний Шлях

Task: Build a production-ready, full-stack, highly structured Web Application for a Specialized Psychological Service Platform ("Система психологічної служби") using React, TypeScript, Tailwind CSS, shadcn/ui components, Lucide React icons, and integrated with Supabase (Auth, PostgreSQL DB, RLS, Edge Functions, Storage).

1. VISUAL DESIGN & UX/UI SYSTEM

Theme: Professional, calm, military-tactical & clinical-wellness aesthetic.

Color Palette: Primary Slate 900 (#0f172a), Muted Background Slate 50 (#f8fafc), Accent Indigo 600 (#4f46e5). Urgency/Status Badges: Low = Emerald 600, Medium = Amber 500, High = Orange 600, Critical = Rose 600.

Typography: Inter font, clean hierarchy, tight layout spacing for high data density.

Language: All UI text, headers, mock data, and system outputs MUST be in Ukrainian.

Layout: Responsive Main Layout with a collapsible Sidebar (Navigation), Top Header (Search, Notifications, Profile Switcher, Active Unit Indicator), and Main Content Viewport.

2. DATABASE SCHEMA & SUPABASE INTEGRATION

Create PostgreSQL tables with Row Level Security (RLS) policies:

profiles (id references auth.users, full_name, email, role ['SuperAdmin', 'ServiceChief', 'Psychologist', 'Applicant'], unit_id, created_at).

units (id, name, code, parent_id, location_id).

locations (id, name, coordinates, address).

qr_codes (id, token, unit_id, location_id, is_active).

requests (id, applicant_id, unit_id, location_id, request_type, raw_text, structured_text, category, urgency ['low', 'medium', 'high', 'critical'], status ['new', 'in_processing', 'scheduled', 'completed', 'cancelled'], created_at).

reports (id, request_id, psychologist_id, goal, work_description, results, recommendations, draft_content, final_content, status ['draft', 'submitted', 'approved', 'rejected'], tags, attachments, created_at).

schedules (id, psychologist_id, event_title, event_type ['consultation', 'group_work', 'travel', 'documentation', 'other'], start_time, end_time, location_id, travel_time_hours, route_details).

case_bank (id, report_id, primary_category, subcategories (array), symptoms, interventions, outcomes, recommendations, similar_case_count, created_at).

audit_logs (id, user_id, action, entity_type, entity_id, details (jsonb), timestamp).

3. CORE MODULES & THE 6 INTEGRATED AI AGENTS

Build dynamic, interactive views for each system module with full simulation of the 6 specialized AI Agents:

Module 1: Intake & Request Management (AI Agent #1 — "Агент Заявок")

Public/Internal Request Form: Selection of Unit, Location, Request Type, Attachment Upload, and Raw Text Input.

AI Secretary Drawer/Modal:

Text Structuring: Converts non-formal user text (e.g., "Треба поговорити") into professional request formulations (e.g., "Командир підрозділу повідомляє про ознаки емоційного виснаження військовослужбовців...").

Completeness Check: Validates presence of Problem Clarity, Participants, Location, and Core Demand.

Ambiguity Resolver: Prompts dynamic clarifying questions if the input is vague (e.g., "Є проблеми" -> asks what specific issues, when they started, and who is involved).

Pre-Categorization: Auto-selects categories: Адаптація, Бойовий стрес, Адиктивна поведінка, Конфлікт, Сімейні труднощі, Суїцидальні ризики, Інше.

Urgency Assessment: Suggests Low, Medium, High, or Critical badges with human-in-the-loop override capability.

Database Commit: Saves structured JSON to requests table.

Module 2: Reporting & Quality Control (AI Agent #2 — "Агент Звітів")

Report Drafting Workspace: Form fields for Goal, Work Process, Results, and Recommendations.

AI Quality Assistant:

Grammar & Style Inspector: Highlights errors, typos, and inappropriate tone.

Structure Validator: Verifies essential report sections (Goal, Process, Result, Recommendations).

Non-Psychological Data Filter: Identifies and flags non-relevant operational notes (e.g., "Замінено генератор") and prompts for their removal.

Weak Spot Analysis: Flags incomplete entries (e.g., "Проведено бесіду" triggers prompt: "З ким? Щодо чого? Який результат?").

Document Exporter: Generates export previews for PDF, DOCX, Official Service Report, and Monthly Report.

Auto-Tagging: Extracts semantic tags and forwards structured data to the Case Bank classifier.

Module 3: Logistics & Schedule Planning (AI Agent #3 — "Агент Планер")

Calendar Workspace: Interactive Day, Week, and Month views with filter by Psychologist.

Route & Route Planner: Calculates distance, travel time, and availability conflicts.

Overload Control Dashboard: Visual gauges showing workload balance, total event hours vs. travel hours, and burnout risk alerts.

Time Usage Pie Chart: Categorizes hours into Consultations, Group Work, Documentation, Travel, and Other Tasks.

Schedule Generator: Auto-generates optimized daily/weekly activity itineraries.

Module 4: Executive Analytics Hub (AI Agent #4 — "Агент Аналітичний Дашборд")

Analytical Center: Recharts visualizations simulating Power BI dynamic dashboards.

Request Dynamics Chart: Line and Bar charts for trends over time, geographical distribution, unit breakdown, and thematic categories.

Activity & Workload Analytics: Psychologist efficiency, total hours worked, travel times, and specialization areas.

Category Spike Alerts: Automatically generates insight cards (e.g., "Кількість звернень щодо адаптації зросла на 18%").

Power BI / PostgreSQL Connector Interface: Displays connection status, query optimization logs, and export settings.

Module 5: Data Synchronization & Export Hub (AI Agent #5 — "Агент Синхронізації")

Sync Manager Panel: Shows real-time status of automated updates to Google Sheets upon report approval.

Multi-Format Export Engine: Buttons to generate and download XLSX, CSV, PDF, and DOCX files.

Live Table Sync Monitor: Ensures modifying a report automatically updates corresponding analytical tables and executive dashboards without manual data re-entry.

Official Monthly Reporting: Generates aggregated monthly summaries by psychologist, unit, and whole service.

Module 6: Knowledge Base & Taxonomy (AI Agent #6 — "Агент Класифікатор і Банк Кейсів")

Semantic Search Engine: Natural language query input (e.g., "усі випадки адиктивної поведінки після ротації за останні два роки").

Hierarchical Taxonomy Tree Component: Navigable tree (Психологічні проблеми -> Адиктивна поведінка -> Алкоголь / Наркотики / Ліки / Азартні ігри; Адаптація; Бойовий стрес; Конфлікти; Сімейні питання).

Multi-Categorization Engine: Supports multi-tag tagging per case.

Similar Case Matcher: Displays related cases with similarity percentage (e.g., "Знайдено 27 схожих випадків").

Structured Case Card: Modal view displaying an sanitized case with Symptoms, Interventions, Outcomes, and Best Practices.

Cross-Case Analytical Insights: Statistical breakdowns (e.g., "72% випадків адиктивної поведінки пов'язані з алкоголем").

Module 7: Administration & Infrastructure

User Management (CRUD profiles & roles), Unit Management, Location Setup, QR Code Generator for instant request forms, System Audit Log Viewer (tracking user actions, timestamps, entity IDs), and Email Notification Settings.

4. MOCK DATA REQUIREMENTS

Populate the system with detailed Ukrainian mock data:

Units: "115 ОМБр", "25 ОПДБр", "Центр підготовки", "47 ОМБр".

Locations: "Селекція-1", "Пункт Схід", "База Північ".

Include at least 8 requests, 6 reports, 10 calendar events, and 12 case bank records across different categories. Ensure all UI controls, modals, sheets, and tabs are fully interactive and non-empty.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://psysystem-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6e106ea-d8e0-439f-884d-ec72970392cf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
