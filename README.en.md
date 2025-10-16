
# VM Fitness Hub - Headless E-Commerce & Content Platform

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.0.0
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5
- **UI Framework:** [React](https://reactjs.org/) 18.3.1
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend (BaaS):** [Firebase](https://firebase.google.com/) 10.12.4 (Authentication, Firestore, App Hosting)
- **Payments:** [Stripe](https://stripe.com/) 16.5.0
- **Personalization Engine:** [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini) 1.0.0
- **Form Management:** [React Hook Form](https://react-hook-form.com/) 7.52.1 & [Zod](https://zod.dev/) 3.24.2

![VM Fitness Hub Hero Image](https://images.unsplash.com/photo-1586323289103-e309634e2a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmaXRuZXNzJTIwd29tYW58ZW58MHx8fHwxNzU5NzY3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080)

## Project Summary

**VM Fitness Hub** is a modern, high-performance web application built with Next.js that serves as a frontend for a premium e-commerce and content experience. The application provides users with a polished UI to browse exclusive products, read insightful blog articles, interact with a smart shopping assistant, and generate personalized workout plans. User authentication, profile data, and admin features are seamlessly handled via Firebase, with secure payments processed through Stripe.

This project is designed to be deployed on **Firebase App Hosting**, providing a scalable and fully-managed solution.

---

## ✨ Key Features

- **Modern Framework:** Built with **Next.js 15** (App Router) for optimal performance, Server-Side Rendering (SSR), and a seamless user experience.
- **Elegant & Responsive Design:** A sleek and fully responsive user interface built with **Tailwind CSS** and **ShadCN UI**. The aesthetic is defined by a sophisticated brown and beige color palette, with distinct themes for light and dark modes.
- **E-commerce Store:** A curated shopping experience for browsing and purchasing exclusive digital products. The payment gateway integrates with **Stripe Checkout** for secure transactions (or simulates the purchase if keys are not provided).
- **Content Hub:** A dynamic blog featuring articles by Valentina Montero, statically generated for exceptional performance and SEO.
- **Secure Authentication:** A complete user registration and login system with role-based access control (including an admin panel) using **Firebase Authentication**.
- **Firestore Database:** User profiles, roles, and personalized workout plans are securely stored in **Cloud Firestore**.
- **User Dashboard:** A private, authenticated space for users to view and manage their saved workout plans and access purchased content.
- **Advanced Personalized Features:**
    - **Workout Plan Generator:** A proprietary engine that creates custom weekly workout plans based on the user's specific goals, experience level, and preferences.
    - **Shopping Assistant:** A smart shopping concierge chatbot that helps users find products and answers their questions with context-aware responses.
- **Admin Panel:** A protected, role-based section for administrators to view all user-generated workout plans.
- **Deployment-Ready:** Fully configured for seamless, automated deployment on **Firebase App Hosting**.

---

## 🛠️ Setup and Local Development

Follow these steps to get the project up and running on your local machine. This is a crucial step to ensure all services, including Firebase and Stripe, are properly connected.

### 1. Prerequisites

- Node.js (v20 or higher recommended)
- npm (or pnpm/yarn)
- A Firebase project (you can create one for free at [firebase.google.com](https://firebase.google.com/))
- A Stripe account (for payment processing)

### 2. Clone the Repository (if applicable)

```bash
git clone [REPOSITORY_URL]
cd [REPOSITORY_NAME]
```

### 3. Install Dependencies

Install all project dependencies. This may take a few minutes.

```bash
npm install
```

### 4. Configure Environment Variables

This is the most critical step for launching the application. All secret keys and configuration values are managed in a single `.env` file, which you must create in the root of the project.

**Never commit the `.env` file to version control.**

Create a file named `.env` in the project root and add the following variables, replacing the placeholder values with your actual keys.

```plaintext
# Firebase (Obtained from your Firebase Project Settings > General)
# Go to your Firebase project, click the gear icon -> Project settings, and under "Your apps", select or create a Web app.
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Firebase Admin (Service account key for the backend)
# In your Firebase project, click the gear icon -> Project settings -> Service accounts.
# Click "Generate new private key" and a JSON file will be downloaded.
# IMPORTANT: Copy the entire content of the JSON file and paste it on a single line.
FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}

# Stripe (Obtained from Stripe Dashboard -> Developers -> API keys)
# Find your "Secret key" here. If this key is not provided, the checkout will simulate a successful purchase for development purposes.
STRIPE_SECRET_KEY=

# Google AI (Genkit - Obtain from Google AI Studio)
# Go to https://aistudio.google.com/app/apikey and create a new API key.
GEMINI_API_KEY=AIza...
```

### 5. Run the Development Server

Once the environment variables are set, you can start the Next.js development server.

```bash
npm run dev
```

The application will be available at `http://localhost:9000`.

---

## 🔧 Key Integrations

### Firebase

- **Authentication:** The authentication flow leverages both client-side and server-side logic. User creation (`createUserWithEmailAndPassword`) is handled on the client for an immediate sign-in experience. Server Actions are then used to validate data and create a corresponding user document in Firestore.
- **Firestore:** Used to store user profiles (including an `isAdmin` field for access control) and user-generated workout plans.
- **Server SDK:** The Firebase Admin SDK (`firebase-admin`) is used in Server Actions to perform privileged backend operations, such as fetching data for all users in the admin panel.

### Stripe

The payment flow is handled via **Stripe Checkout**.
1.  A user clicks the "Buy Now" button on a product or coaching page.
2.  A **Server Action** is invoked.
3.  This action securely creates a Stripe `checkout.Session` on the server-side.
4.  The application redirects the user to the secure Stripe checkout URL to complete the purchase.
5.  **Important:** If the `STRIPE_SECRET_KEY` is not set in your `.env` file, this flow is **simulated**. The user will be redirected directly to the digital product or success page to allow for local development and testing without requiring Stripe keys.

### Personalization Engine (Genkit)

- **Plan Generator:** The `workoutPlanGeneratorFlow` (`src/ai/flows/workout-plan-generator.ts`) uses a structured prompt to create high-quality, personalized weekly workout plans based on user inputs.
- **Shopping Assistant:** The `shoppingAssistantFlow` (`src/ai/flows/shopping-assistant.ts`) processes the user's query and chat history. It uses a `searchProductsTool` to allow the model to dynamically search the product catalog and provide intelligent recommendations.

---

## 🚀 Deployment

This project is optimized for **Firebase App Hosting**.

Deployment is managed automatically through the Firebase Studio workflow. Each time a change is committed, a new build and deployment can be initiated.

The `apphosting.yaml` file in the root contains the basic configuration for the App Hosting environment. No manual CI/CD setup is needed.
