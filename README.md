# VM Fitness Hub - Plataforma Headless de E-Commerce y Contenido

![VM Fitness Hub Hero Image](https://images.unsplash.com/photo-1586323289103-e309634e2a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmaXRuZXNzJTIwd29tYW58ZW58MHx8fHwxNzU5NzY3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080)

## Resumen del Proyecto

**VM Fitness Hub** es una aplicación web moderna y de alto rendimiento construida con Next.js que sirve como la fachada (frontend) para una experiencia de e-commerce y contenido. La aplicación ofrece a los usuarios una interfaz de usuario pulida para explorar productos, leer artículos de blog e interactuar con un asistente de compras de IA. La autenticación de usuarios, los datos de perfil y las funciones de administrador se gestionan a través de Firebase. Los pagos se procesan de forma segura a través de Stripe.

Este proyecto está diseñado para ser desplegado en **Firebase App Hosting**, proporcionando una solución escalable y totalmente gestionada.

---

## ✨ Características Principales

- **Framework Moderno:** Construido con **Next.js 15 (App Router)** para un rendimiento óptimo y Server-Side Rendering (SSR).
- **Diseño Responsivo:** Interfaz de usuario elegante y totalmente responsiva construida con **Tailwind CSS** y **ShadCN UI**.
- **Contenido y Productos Estáticos:** Los productos y artículos del blog se gestionan de forma estática dentro del código de la aplicación para mayor simplicidad y rendimiento.
- **Autenticación Segura:** Sistema completo de registro e inicio de sesión de usuarios con roles (incluyendo un panel de administrador) utilizando **Firebase Authentication**.
- **Base de Datos Firestore:** Los perfiles de usuario y los roles se almacenan en **Cloud Firestore**.
- **Procesamiento de Pagos:** Integración segura de pagos con **Stripe Checkout**.
- **Asistente de IA:** Un chatbot de conserje de compras impulsado por **Google AI (Genkit)** que puede proporcionar información sobre productos.
- **Optimización de Despliegue:** Configurado para un despliegue sin problemas en **Firebase App Hosting**.

---

## 🚀 Pila Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) 15.3.3
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **UI Framework:** [React](https://reactjs.org/) 18.3
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend (BaaS):** [Firebase](https://firebase.google.com/) (Authentication, Firestore, App Hosting)
- **Pagos:** [Stripe](https://stripe.com/)
- **Inteligencia Artificial:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🛠️ Configuración y Desarrollo Local

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

### 1. Prerrequisitos

- Node.js (v20 o superior recomendado)
- npm (o pnpm/yarn)

### 2. Clonar el Repositorio (si aplica)

```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_REPOSITORIO]
```

### 3. Instalar Dependencias

Instala todas las dependencias del proyecto.

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto copiando el archivo `.env.example` (si existe) o creándolo desde cero. Luego, rellena las siguientes variables:

```plaintext
# Firebase (Obtenido desde la consola de Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Stripe (Obtenido desde el Stripe Dashboard -> Desarrolladores -> Claves de API)
# Si no se proporciona esta clave, el proceso de pago simulará una compra exitosa.
STRIPE_SECRET_KEY=sk_test_...

# Google AI (Genkit - Obtenido desde Google AI Studio)
GEMINI_API_KEY=AIza...
```

### 5. Ejecutar el Servidor de Desarrollo

Inicia el servidor de desarrollo de Next.js. Turbopack está habilitado para un rendimiento más rápido.

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9002`.

---

## 🔧 Integraciones Clave

### Firebase

- **Autenticación:** El flujo de autenticación aprovecha la lógica tanto del lado del cliente como del servidor. La creación de usuarios (`createUserWithEmailAndPassword`) se gestiona en el cliente para una experiencia de inicio de sesión inmediata. Luego, las Server Actions se utilizan para validar datos y crear el documento de usuario correspondiente en Firestore.
- **Firestore:** Se utiliza para almacenar perfiles de usuario, incluyendo un campo `isAdmin` para el control de acceso al panel de administración.
- **Server SDK:** El SDK de administración de Firebase (`firebase-admin`) se utiliza en las Server Actions (`src/app/admin/actions.ts`) para realizar operaciones privilegiadas de backend, como la obtención de datos de todos los usuarios.

### Stripe

El flujo de pago se gestiona a través de **Stripe Checkout**.
1.  Un usuario hace clic en el botón de compra en la página de detalles de un producto.
2.  Se invoca una **Server Action** (`src/app/products/actions.ts`).
3.  Esta acción crea una `checkout.Session` de Stripe en el lado del servidor.
4.  La aplicación redirige al usuario a la URL segura de la pasarela de pago de Stripe.
5.  **Importante:** Si la clave `STRIPE_SECRET_KEY` no está configurada en tu archivo `.env`, este flujo se **simula**. El usuario será redirigido directamente al producto digital para facilitar el desarrollo y las pruebas locales sin necesidad de claves de Stripe.

### Genkit (Google AI)

El asistente de compras se implementa utilizando un **flujo de Genkit** definido en `src/ai/flows/shopping-assistant.ts`.
- **Flujo:** `shoppingAssistantFlow` procesa la consulta del usuario y el historial de chat.
- **Herramientas (Tools):** Puede ser extendido con herramientas para permitir que el modelo de IA obtenga dinámicamente información actualizada sobre productos desde APIs internas o externas.

---

## 🚀 Despliegue

Este proyecto está optimizado para **Firebase App Hosting**.

El despliegue se gestiona automáticamente a través del flujo de trabajo de Firebase Studio. Cada vez que se confirma un cambio, se puede iniciar una nueva compilación y despliegue.

El archivo `apphosting.yaml` en la raíz contiene la configuración básica para el entorno de App Hosting. No se necesita configuración manual de CI/CD.
