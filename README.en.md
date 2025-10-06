# VM Fitness Hub - Headless E-Commerce & Content Platform

![VM Fitness Hub Hero Image](https://images.unsplash.com/photo-1586323289103-e309634e2a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmaXRuZXNzJTIwd29tYW58ZW58MHx8fHwxNzU5NzY3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080)

## Project Summary

**VM Fitness Hub** is a modern, high-performance web application built with Next.js that serves as the frontend for a headless e-commerce and content experience. The application provides users with a polished UI to browse products, read blog articles, and interact with an AI shopping assistant, all while content and inventory are managed through a Shopify backend. User authentication, profile data, and admin features are handled via Firebase. Payments are securely processed through Stripe.

This project is designed to be deployed on **Firebase App Hosting**, providing a scalable and fully-managed solution.

---

## ✨ Key Features

- **Modern Framework:** Built with **Next.js 15 (App Router)** for optimal performance and Server-Side Rendering (SSR).
- **Responsive Design:** Sleek and fully responsive user interface built with **Tailwind CSS** and **ShadCN UI**.
- **Headless E-commerce:** Products are dynamically fetched from a **Shopify** store via the Storefront API.
- **Content Blog:** Blog articles are also managed in Shopify and rendered in the Next.js app.
- **Secure Authentication:** Complete user registration and login system with roles (including an admin panel) using **Firebase Authentication**.
- **Firestore Database:** User profiles and roles are stored in **Cloud Firestore**.
- **Payment Processing:** Secure payment integration with **Stripe Checkout**.
- **AI Assistant:** A shopping concierge chatbot powered by **Google AI (Genkit)** that can provide product information using tools.
- **Deployment-Optimized:** Configured for seamless deployment on **Firebase App Hosting**.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.3.3
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Framework:** [React](https://reactjs.org/) 18.3
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend (BaaS):** [Firebase](https://firebase.google.com/) (Authentication, Firestore, App Hosting)
- **Headless E-commerce:** [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- **Payments:** [Stripe](https://stripe.com/)
- **Artificial Intelligence:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
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

Create a `.env` file in the root of the project by copying the `.env.example` file (if it exists) or creating it from scratch. Then, fill in the following variables:

```plaintext
# Firebase (Obtained from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Shopify (Obtained from Shopify Dashboard -> Apps -> Develop apps)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...

# Stripe (Obtained from Stripe Dashboard -> Developers -> API keys)
STRIPE_SECRET_KEY=sk_test_...

# Google AI (Genkit - Obtained from Google AI Studio)
GEMINI_API_KEY=AIza...
```

### 5. Run the Development Server

Start the Next.js development server. Turbopack is enabled for faster performance.

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

## 🔧 Key Integrations

### Firebase

- **Authentication:** The auth flow (signup, login, logout) is managed via `firebase/auth`. User state is shared globally using an `AuthProvider`.
- **Firestore:** Used to store user profiles, including an `isAdmin` field for access control to the admin dashboard.
- **Server SDK:** The Firebase Admin SDK (`firebase-admin`) is used in Server Actions (`src/app/admin/actions.ts`) to perform privileged backend operations, such as fetching data for all users.

### Shopify

The application communicates with the **Shopify Storefront API** to fetch products and blog articles. The data fetching logic is located in `src/lib/shopify.ts`. A `force-cache` strategy with revalidation is used to enable Static Site Generation (SSG) and improve performance.

### Stripe

The payment flow is handled via **Stripe Checkout**.
1.  A user clicks the buy button on a product detail page (`src/app/products/[handle]/product-details.tsx`).
2.  A **Server Action** (`src/app/products/actions.ts`) is invoked.
3.  This action creates a Stripe `checkout.Session` on the server-side, passing in product details.
4.  The application redirects the user to the secure Stripe checkout URL.

### Genkit (Google AI)

The shopping assistant is implemented using a **Genkit flow** defined in `src/ai/flows/shopping-assistant.ts`.
- **Flow:** `shoppingAssistantFlow` processes the user's query and chat history.
- **Tools:** It uses `getProductInfo` as a tool to allow the AI model to dynamically fetch up-to-date product information from the Shopify API during a conversation.

---

## 🚀 Deployment

This project is optimized for **Firebase App Hosting**.

Deployment is managed automatically through the Firebase Studio workflow. Each time a change is committed, a new build and deployment can be initiated.

The `apphosting.yaml` file in the root contains the basic configuration for the App Hosting environment. No manual CI/CD setup is needed.
