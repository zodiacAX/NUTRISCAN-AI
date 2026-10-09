# NutriScan AI — Multimodal Food Intelligence

> **“Know your food. Make smarter choices.”**  
> An evidence-backed multimodal nutrition intelligence web application designed for the MLH Hackathon, powered by Gemma 4.

---

## 🥗 Product Overview

**NutriScan AI** empowers consumers, students, and health-conscious eaters to decode packaged-food labels, hidden ingredients, and cooked meals. It converts dense, confusing nutrition tables and microscopic ingredient paragraphs into transparent, evidence-grounded intelligence and practical consumer actions.

### Core Experience Pipeline:
```
Upload / Snap Food Image 
  → Multi-Stage Vision Analysis (Gemma 4) 
  → Strict Data Provenance Extraction 
  → Cross-Verification (Open Food Facts / USDA FoodData) 
  → Actionable Nutrition Intelligence Report
```

---

## 🎨 Visual Design System

Crafted with an editorial health-tech aesthetic emphasizing clarity, calm intelligence, and high contrast:

- **Primary Forest Green**: `#163D2B`
- **Secondary Green**: `#3D7954`
- **Soft Mint Surfaces**: `#E4F0E5`
- **Warm Cream Background**: `#F6F4E9`
- **White Cards**: `#FFFFFF`
- **Primary Text**: `#1D2921`
- **Secondary Text**: `#68736B`
- **Borders**: `#E2E8E0`
- **Warning Amber**: `#A65D12`
- **Error Red**: `#B42318`

Typography: **Inter** modern sans-serif with tabular numerals for precision metrics.

---

## 🚀 Key Features & Screen Architecture

### 1. Landing & Home Dashboard
- **Hero Presentation**: Headline *"What's really in your food?"*, quick CTAs, and an interactive scan preview card.
- **Quick-Start Modes**: Direct entrypoints for *Packaged Food*, *Cooked Meal*, and *Product Comparison*.
- **Curated Sample Showcase**: 4 pre-configured foods ready for 1-click evaluation in under 90 seconds.
- **Recent Scans**: Live local history with zero fabricated data.
- **Trust Section**: Transparent disclosures explaining AI uncertainty and safety limits.

### 2. Scan Workspace
- **Responsive 2-Column Layout**: Drag-and-drop zone on desktop, touch-friendly on mobile.
- **Image Controls**: File drag & drop, file picker, camera capture simulation, replace, and remove.
- **Format Validation**: Strict client-side verification for JPG, JPEG, PNG, and WEBP under 10 MB.
- **Packaged Focus Areas**: Front of package, Ingredients list, Nutrition label, or Expiry date.
- **Cooked Meal Context**: Optional dish notes and portion basis.

### 3. AI Analysis Loading State
- **Honest 5-Stage Stepper**:
  1. *Processing image*
  2. *Reading visible food information*
  3. *Analyzing nutrition details*
  4. *Checking available reference data*
  5. *Preparing the report*
- User cancellation support with `AbortSignal`.

### 4. Food Analysis Results (Centerpiece)
- **Product Header**: Name confidence check, serving basis, timestamps, and action buttons.
- **Nutrition Overview**: Standardized metric cards for Calories, Protein, Carbs, Total Sugar, Total Fat, Saturated Fat, and Sodium. Missing values explicitly read *"Not available"* (never false zeros).
- **Macronutrient Gram Distribution Bar**: Visual proportion breakdown of Carbs, Protein, and Fat.
- **"What This Means"**: Plain-language nutritional observations without simplistic "good" or "bad" judgments.
- **NOVA Processing Audit**: Formal Monteiro et al. 4-tier classification with identified formulation markers.
- **Ingredients & Additive Intelligence**: Additive explanations (emulsifiers, leaveners), declared allergens, and a mandatory prominent red warning:
  > *“Always verify the original packaging. AI extraction may miss allergens.”*
- **Food Safety Information**: Distinguishes *Best before* from *Use by* dates, storage instructions, and recall status.
- **Evidence & Verification Panel**: Direct bounding OCR snippets and external database links (Open Food Facts / USDA FoodData Central).
- **"Your Next Best Step"**: Grounded consumer recommendations without medical prescriptions.
- **Follow-up Chat Drawer**: Evidence-grounded conversational agent with suggested question chips, citations, and medical guardrails.
- **Print / PDF Export**: Dedicated clean print stylesheet.

### 5. Product Comparison Engine
- Compares any two foods side-by-side.
- Normalization toggle: **Per 100 g** vs **Stated Package Portion**.
- Neutral comparative language (e.g. *"2.1x lower sodium per 100g"*).

### 6. Food History
- Persistent `localStorage` tracking of user scans.
- Search by food name, ingredient, or brand with category filters.
- Individual deletion and full history wipe.

### 7. Settings & Transparency Modal
- Demo Adapter vs Live Gemma 4 / Gemini API toggle.
- Multimodal model architecture details.
- Data privacy confirmation (100% local client-side retention).
- Multi-language preference selector (EN, ES, FR, DE).

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript (Strict Mode)
- **Frontend Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 with custom semantic design tokens
- **Icons**: Lucide React
- **Frontend Testing**: Vitest + React Testing Library + JSDOM (23 tests passing)
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Uvicorn
- **Image Processing**: Pillow (PIL) with magic-byte signature validation
- **Multimodal AI**: Gemma 4 multimodal vision inference adapter (Google AI Studio / Ollama / deterministic Demo fallback)
- **External Data**: Open Food Facts REST API & USDA FoodData Central integration
- **Backend Testing**: pytest + HTTPX TestClient (18 test scenarios passing)
- **Containerization**: Docker & Docker Compose (multi-stage build with Nginx)

---

## 💻 Getting Started Locally

### Option 1: Docker Compose (Recommended)
Launch both the FastAPI backend and React frontend with a single command:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### Option 2: Running Directly on Host

#### 1. Backend (FastAPI)
```bash
# From workspace root
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --port 8000 --reload
```
API runs on `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

#### 2. Frontend (React + Vite)
```bash
# In another terminal
npm install
npm run dev
```
Vite runs on `http://localhost:5173` (or `5174`) and automatically proxies `/api` calls to the backend on port 8000.

---

## 🧪 Comprehensive Automated Testing (41/41 Passing)

### 1. Backend Test Suite (pytest — 18/18 Passing)
Run all 18 backend scenarios verifying schemas, security, and edge cases:
```bash
python -m pytest backend/tests/test_backend.py
```
Verified scenarios:
1. `GET /api/health` — Service readiness & provider reporting
2. `POST /api/analyze` — Valid image upload & multimodal extraction
3. Unsupported file type rejection (.pdf / .txt)
4. Invalid file signature detection (spoofed headers via magic bytes)
5. Oversized image rejection (>10 MB limit)
6. Corrupted image handling
7. Empty model response recovery
8. Malformed model JSON resilience
9. Gateway timeout handling (504 Gateway Timeout)
10. Missing nutrition values handling (no fabricated zeros)
11. Missing database record graceful fallback
12. External API timeout tolerance
13. Unit normalization (per-serving vs per-100g)
14. Mandatory allergen warning behavior
15. Expiry & ambiguous date parsing
16. Prompt injection defense in OCR inputs
17. Medical boundary enforcement (non-clinical software guardrail)
18. Transparent Demo Mode disclosure

### 2. Frontend Test Suite (Vitest — 23/23 Passing)
Run all 23 frontend component, validation, and logic tests:
```bash
npm test
```
Verified scenarios:
1. Home page renders hero & quick actions
2. Client-side file type & 10 MB size validation
3. Image preview & replacement controls
4. Honest 5-stage progress indicator
5. Error & retry handling
6. Analysis results view with NOVA classification & ingredients
7. Missing numerical values render as "Not available"
8. Product comparison engine with 100g toggle
9. Grounded follow-up chat with evidence citations
10. Print / PDF export layout
11. Responsive navigation tabs
12. Demo mode disclosure banner

### 3. Production Build Validation
```bash
npm run build
```
Ensures 100% strict TypeScript compliance (`tsc -b`) and bundles production assets with Vite.

---

## ⏱️ 90-Second MLH Hackathon Demo Guide

1. **Launch the Application**: Open `http://localhost:5174` (or `http://localhost:3000` in Docker).
2. **Click "Try a sample (90s Demo)"**: Instantly loads *Nature Valley Crunchy Granola Bars*.
3. **Inspect the Nutrition Overview**: Check the 11g added sugar warning, provenance badges, and macro gram bar.
4. **Scroll to "What This Means" & Ingredients**: View the NOVA 4 classification, Soy allergen banner, and additive breakdown.
5. **Open Evidence Panel**: See the exact OCR quotes extracted from the back packaging.
6. **Ask a Question in Follow-Up Chat**: Click *"How much sugar is in one serving?"* to see the cited response.
7. **Click "Compare"**: See Nature Valley compared with *Dang Coconut Chips* normalized to 100g.

---

## ⚖️ Ethical & Scientific Disclaimers

- NutriScan AI is an educational food literacy tool, not a medical or clinical diagnostic system.
- Photographs alone cannot establish microbiological sterility, bacterial contamination, or trace airborne allergens.
- Always review physical manufacturer packaging before consuming products if you have severe allergies.
