# TalentFlow - A Mini Hiring Platform

TalentFlow is a front-end-only React application that simulates a mini hiring platform (ATS). It's designed to manage job postings, track candidates through various stages, and build custom assessments for each job.

The entire application runs in your browser with no backend. It uses **Mock Service Worker (MSW)** to simulate a REST API and **IndexedDB (via Dexie.js)** for full data persistence. This means all your data (jobs, candidates, etc.) will be saved in your browser and will be there when you refresh the page.

### Live Demo Link

https://talent-flow-vishal.vercel.app/

---

## Features

* **Login System:** Secure, hardcoded login page protects the entire application.
* **Animated Home Dashboard:** The home page serves as a fully animated dashboard displaying "at a glance" stats for total jobs, candidates, new applicants, and assessments.
* **Job Management:**
    * Create, Read, Edit, and Archive jobs.
    * Drag-and-drop reordering of the job list.
    * Optimistic updates for all actions (create, edit, reorder) with error handling and rollback on simulated API failure.
    * Client-side search and filtering by job status.
* **Candidate Pipeline:**
    * **Two-View System:** Toggle between a **List View** and a **Kanban View** on the main candidates page.
    * **List View:** A paginated list to handle the 1,000+ seeded candidates without performance issues.
    * **Kanban View:** A full drag-and-drop pipeline to move candidates between stages (Applied, Screen, Tech, etc.) with optimistic updates.
    * Client-side search by name or email that works across both views.
* **Candidate Profile:**
    * A detailed profile page for each candidate.
    * View a complete timeline of all activities and notes.
    * Add new notes with **@mention support** and suggestions.
    * Delete notes with optimistic updates and rollback.
* **Assessment Builder:**
    * A powerful two-pane assessment editor (Builder + Live Preview).
    * Add various question types: short/long text, single/multi-choice, numeric, and file upload.
    * Set validation rules like "required", "max length", or "numeric range".
    * Implement **conditional logic** (e.g., "show Q2 only if Q1 is 'Yes'").
    * All assessment structures are saved to the mock API and persist.

---

## Technical Stack

* **Framework:** React 18+ (with Vite)
* **Styling:** Tailwind CSS (with a dark-mode-first design)
* **Animations:** Framer Motion
* **Drag & Drop:** `@hello-pangea/dnd`
* **Mock API:** Mock Service Worker (MSW)
* **Local Persistence:** IndexedDB via Dexie.js
* **Utilities:** `nanoid`, `dayjs`

---
talentflow/
├── public/
│   ├── mockServiceWorker.js
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Modal.jsx
│   │   │   └── Spinner.jsx
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobForm.jsx
│   │   │   ├── JobModal.jsx
│   │   │   └── JobsList.jsx
│   │   ├── candidates/
│   │   │   ├── CandidateKanban.jsx
│   │   │   ├── CandidateNoteForm.jsx
│   │   │   ├── CandidateProfile.jsx
│   │   │   └── CandidatesList.jsx
│   │   └── assessments/
│   │       ├── AssessmentBuilder.jsx
│   │       └── AssessmentPreview.jsx
│   ├── IconButton.jsx
│   ├── Loader.jsx
│   ├── PageLayout.jsx
│   ├── ProtectedRoute.jsx
│   └── Search.jsx
│
│   ├── contexts/
│   │   └── AuthContext.jsx
│
│   ├── db/
│   │   ├── indexedDB.js
│   │   └── seeds.js
│
│   ├── hooks/
│   │   └── useDebounce.js
│
│   ├── msw/
│   │   ├── browser.js
│   │   ├── handlers.js
│   │   └── serverUtils.js
│
│   ├── screens/
│   │   ├── AssessmentEditorPage.jsx
│   │   ├── AssessmentsPage.jsx
│   │   ├── CandidatePage.jsx
│   │   ├── CandidatesPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── JobDetailPage.jsx
│   │   ├── JobsPage.jsx
│   │   └── LoginPage.jsx
│
│   ├── services/
│   │   ├── assessmentsAPI.js
│   │   ├── candidatesAPI.js
│   │   ├── jobsAPI.js
│   │   └── jobsStore.js
│
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
└── vercel.json

---
## Login & Access

This application requires login credentials for access. No sign-up or registration is necessary.

Please use the following credentials to log in:

* **Username:** `admin`
* **Password:** `password123`

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (v18 or newer) and `npm` or `yarn` installed on your computer.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone (your-repo-url)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd talentflow-project
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running the Application

Once installation is complete, run the following command to start the Vite development server:

```sh
npm run dev
