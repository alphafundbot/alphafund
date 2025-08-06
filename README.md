# Firebase Pilot

This is a Next.js application built with Firebase Studio that allows you to manage and audit your Firebase project configurations.

## Features

- **Configuration Management**: Toggle various Firebase services on and off through a user-friendly interface.
- **Persistent Settings**: Your configuration is saved to and fetched from Firestore.
- **AI-Powered Audits**: Leverage a Genkit AI flow to audit your current settings and receive security and performance recommendations.

## Getting Started

1.  **Set up Firebase**:
    *   Create a Firebase project.
    *   Create a Web app in your Firebase project and copy the configuration credentials.

2.  **Configure Environment Variables**:
    *   Rename `.env.local.example` to `.env.local`.
    *   Populate `.env.local` with your Firebase project's credentials.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
