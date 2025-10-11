# VM Fitness Hub - Headless E-Commerce & Content Platform

![VM Fitness Hub Hero Image](https://images.unsplash.com/photo-1586323289103-e309634e2a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmaXRuZXNzJTIwd29tYW58ZW58MHx8fHwxNzU5NzY3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080)

## Project Summary

**VM Fitness Hub** is a modern, high-performance web application built with Next.js that serves as a frontend for an e-commerce and content experience. The application provides users with a polished UI to browse products, read blog articles, interact with an AI shopping assistant, and generate personalized workout plans. User authentication, profile data, and admin features are handled via Firebase. Payments are securely processed through Stripe.

This project is designed to be deployed on **Firebase App Hosting**, providing a scalable and fully-managed solution.

---

## ✨ Key Features

- **Modern Framework:** Built with **Next.js 14 (App Router)** for optimal performance and Server-Side Rendering (SSR).
- **Responsive Design:** Sleek and fully responsive user interface built with **Tailwind CSS** and **ShadCN UI**.
- **E-commerce Store:** Product browsing and detail pages. The payment gateway integrates with **Stripe Checkout** (or simulates the purchase if the key is not set).
- **Blog Content:** A dynamic blog with statically managed articles for exceptional performance.
- **Secure Authentication:** Complete user registration and login system with roles (including an admin panel) using **Firebase Authentication**.
- **Firestore Database:** User profiles, roles, and workout plans are stored in **Cloud Firestore**.
- **User Dashboard:** A dashboard for users to view their saved workout plans.
- **AI-Powered Features (Genkit):**
    - **Workout Plan Generator:** An AI tool that creates custom weekly workout plans based on user goals and experience.
    - **Shopping Assistant:** A shopping concierge chatbot powered by **Google AI (Genkit)** that helps users find products and answers their questions.
- **Admin Panel:** A protected section for administrators to view all user-generated workout plans.
- **Deployment-Optimized:** Configured for seamless deployment on **Firebase App Hosting**.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 14.2.33
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Framework:** [React](https://reactjs.org/) 18.3.1
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend (BaaS):** [Firebase](https://firebase.google.com/) (Authentication, Firestore, App Hosting)
- **Payments:** [Stripe](https://stripe.com/)
- **Artificial Intelligence:** [Genkit](https://firebase.google.com/docs/genkit) (with Google AI) 1.0.0
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🛠️ Setup and Local Development

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- Node.js (v20 or higher recommended)
- npm (or pnpm/yarn)

### 2. Clone the Repository (if applicable)

```bash
git clone [REPOSITORY_URL]
cd [REPOSITORY_NAME]
```

### 3. Install Dependencies

Install all project dependencies.

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root of the project and fill in the following variables:

```plaintext
# Firebase (Obtained from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Firebase Admin (Service account key for the backend)
# Generate this from your Firebase Project Settings > Service accounts
# Paste the entire content of the JSON file on a single line.
FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}

# Stripe (Obtained from Stripe Dashboard -> Developers -> API keys)
# If this key is not provided, the checkout will simulate a successful purchase.
STRIPE_SECRET_KEY=sk_test_...

# Google AI (Genkit - Obtained from Google AI Studio)
GEMINI_API_KEY=AIza...
```

### 5. Run the Development Server

Start the Next.js development server. Turbopack is enabled by default.

```bash
npm run dev
```

The application will be available at `http://localhost:9000`.

---

## 🔧 Key Integrations

### Firebase

- **Authentication:** The authentication flow leverages both client-side and server-side logic. User creation (`createUserWithEmailAndPassword`) is handled on the client for an immediate sign-in experience. Server Actions are then used to validate data and create a corresponding user document in Firestore.
- **Firestore:** Used to store user profiles (including an `isAdmin` field for access control) and user-generated workout plans.
- **Server SDK:** The Firebase Admin SDK (`firebase-admin`) is used in Server Actions to perform privileged backend operations, such as fetching data for all users.

### Stripe

The payment flow is handled via **Stripe Checkout**.
1.  A user clicks the "Buy Now" button on a product detail page.
2.  A **Server Action** (`src/app/products/actions.ts`) is invoked.
3.  This action creates a Stripe `checkout.Session` on the server-side.
4.  The application redirects the user to the secure Stripe checkout URL.
5.  **Important:** If the `STRIPE_SECRET_KEY` is not set in your `.env` file, this flow is **simulated**. The user will be redirected directly to the digital product to allow for local development and testing without requiring Stripe keys.

### Genkit (Google AI)

- **Plan Generator:** The `workoutPlanGeneratorFlow` (`src/ai/flows/workout-plan-generator.ts`) creates weekly workout plans based on user inputs.
- **Shopping Assistant:** The `shoppingAssistantFlow` (`src/ai/flows/shopping-assistant.ts`) processes the user's query and chat history. It uses a `searchProductsTool` to allow the AI model to dynamically search the product catalog and provide recommendations.

---

## 🚀 Deployment

This project is optimized for **Firebase App Hosting**.

Deployment is managed automatically through the Firebase Studio workflow. Each time a change is committed, a new build and deployment can be initiated.

The `apphosting.yaml` file in the root contains the basic configuration for the App Hosting environment. No manual CI/CD setup is needed.
