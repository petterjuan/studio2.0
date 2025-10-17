
# VM Fitness Hub - Plataforma Headless de E-Commerce y Contenido

## 🚀 Pila Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) 15.0.0
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) 5
- **UI Framework:** [React](https://reactjs.org/) 18.3.1
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Backend (BaaS):** [Firebase](https://firebase.google.com/) 10.12.4 (Authentication, Firestore, App Hosting)
- **Pagos:** [Stripe](https://stripe.com/) 16.5.0
- **Motor de Personalización:** [Genkit](https://firebase.google.com/docs/genkit) (con Gemini de Google) 1.0.0
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) 7.52.1 & [Zod](https://zod.dev/) 3.24.2

![VM Fitness Hub Hero Image](https://images.unsplash.com/photo-1586323289103-e309634e2a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmaXRuZXNzJTIwd29tYW58ZW58MHx8fHwxNzU5NzY3MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080)

## Resumen del Proyecto

**VM Fitness Hub** es una aplicación web moderna y de alto rendimiento construida con Next.js que sirve como la fachada (frontend) para una experiencia de e-commerce y contenido premium. La aplicación ofrece a los usuarios una interfaz de usuario pulida para explorar productos exclusivos, leer artículos de blog, interactuar con un asistente de compras inteligente y generar planes de entrenamiento y recetas personalizados. La autenticación de usuarios, los datos de perfil y las funciones de administrador se gestionan a través de Firebase, y los pagos se procesan de forma segura mediante Stripe.

Este proyecto está diseñado para ser desplegado en **Firebase App Hosting**, proporcionando una solución escalable y totalmente gestionada.

---

## ✨ Características Principales

- **Framework Moderno:** Construido con **Next.js 15 (App Router)** para un rendimiento óptimo, Server-Side Rendering (SSR) y una experiencia de usuario fluida.
- **Diseño Elegante y Responsivo:** Interfaz de usuario sofisticada y totalmente responsiva construida con **Tailwind CSS** y **ShadCN UI**. La estética se define por una paleta de colores en tonos marrones y beige, con temas diferenciados para modo claro y oscuro.
- **Tienda E-commerce:** Una experiencia de compra curada para explorar y adquirir productos digitales exclusivos. La pasarela de pago se integra con **Stripe Checkout** para transacciones seguras (o simula la compra si las claves no están configuradas).
- **Hub de Contenido Automatizado:** Un blog dinámico con artículos de Valentina Montero. Nuevos artículos son **generados automáticamente por una IA** cada semana a través de una tarea programada (cron job), asegurando contenido fresco sin esfuerzo manual.
- **Autenticación Segura:** Sistema completo de registro e inicio de sesión de usuarios con control de acceso basado en roles (incluyendo un panel de administrador) utilizando **Firebase Authentication**.
- **Base de Datos Firestore:** Los perfiles de usuario, roles, planes de entrenamiento personalizados y artículos de blog generados por IA se almacenan de forma segura en **Cloud Firestore**.
- **Panel de Usuario:** Un espacio privado y autenticado para que los usuarios vean y gestionen sus planes de entrenamiento guardados y accedan al contenido comprado.
- **Funcionalidades Avanzadas Potenciadas por IA:**
    - **Generador de Planes de Entrenamiento:** Un motor propietario que crea planes de entrenamiento semanales personalizados basados en las metas, nivel de experiencia y preferencias del usuario.
    - **Generador de Recetas:** Una herramienta de IA que crea recetas personalizadas a partir de un ingrediente principal y restricciones dietéticas.
    - **Asistente de Compras:** Un chatbot de conserjería inteligente que ayuda a los usuarios a encontrar productos y responde a sus preguntas con respuestas contextuales.
- **Panel de Administrador:** Una sección protegida basada en roles para que los administradores vean todos los planes de entrenamiento generados por los usuarios.
- **Optimización para Despliegue:** Totalmente configurado para un despliegue automatizado y sin interrupciones en **Firebase App Hosting**.

---

## 🛠️ Configuración y Desarrollo Local

Sigue estos pasos para poner en marcha el proyecto en tu máquina local. Este es un paso crucial para asegurar que todos los servicios, incluyendo Firebase y Stripe, estén conectados correctamente.

### 1. Prerrequisitos

- Node.js (v20 o superior recomendado)
- npm (o pnpm/yarn)
- Un proyecto de Firebase (puedes crear uno gratis en [firebase.google.com](https://firebase.google.com/))
- Una cuenta de Stripe (para el procesamiento de pagos)

### 2. Clonar el Repositorio (si aplica)

```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_REPOSITORIO]
```

### 3. Instalar Dependencias

Instala todas las dependencias del proyecto. Esto puede tardar unos minutos.

```bash
npm install
```

### 4. Configurar Variables de Entorno

Este es el paso más crítico para lanzar la aplicación. Todas las claves secretas y valores de configuración se gestionan en un único archivo `.env`, que debes crear en la raíz del proyecto. **Nunca subas el archivo `.env` al control de versiones.**

Crea un archivo llamado `.env` en la raíz del proyecto y añade las variables de entorno necesarias para Firebase, Stripe y Google AI, reemplazando los valores de ejemplo con tus claves reales.

### 5. Ejecutar el Servidor de Desarrollo

Once the environment variables are set, you can start the Next.js development server.

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9000`.

---

## 🔧 Integraciones Clave

### Firebase

- **Autenticación:** El flujo de autenticación aprovecha la lógica tanto del lado del cliente como del servidor. La creación de usuarios (`createUserWithEmailAndPassword`) se gestiona en el cliente para una experiencia de inicio de sesión inmediata. Luego, las Server Actions se utilizan para crear el documento de usuario correspondiente en Firestore utilizando el token de autenticación verificado por el servidor.
- **Firestore:** Se utiliza para almacenar perfiles de usuario (incluyendo un campo `isAdmin` para el control de acceso), los planes de entrenamiento generados por los usuarios y los artículos de blog generados por IA.
- **Server SDK:** El SDK de administración de Firebase (`firebase-admin`) se utiliza en las Server Actions para realizar operaciones privilegiadas de backend, como la obtención de datos de todos los usuarios para el panel de administración.

### Stripe

El flujo de pago se gestiona a través de **Stripe Checkout**.
1.  Un usuario hace clic en el botón de compra en una página de producto o coaching.
2.  Se invoca una **Server Action**.
3.  Esta acción crea de forma segura una `checkout.Session` de Stripe en el lado del servidor, utilizando un `stripePriceId` predefinido asociado a cada producto.
4.  La aplicación redirige al usuario a la URL segura de la pasarela de pago de Stripe para completar la compra.
5.  **Importante:** Si la clave `STRIPE_SECRET_KEY` no está configurada en tu archivo `.env`, este flujo se **simula**. El usuario será redirigido directamente a una página de éxito para facilitar el desarrollo y las pruebas locales sin necesidad de claves de Stripe.

### Motor de Personalización (Genkit)

- **Generador de Planes de Entrenamiento:** El flujo `workoutPlanGeneratorFlow` (`src/ai/flows/workout-plan-generator.ts`) utiliza un prompt estructurado para crear planes de entrenamiento semanales de alta calidad y personalizados basados en las entradas del usuario.
- **Generador de Recetas:** El flujo `recipeGeneratorFlow` (`src/ai/flows/recipe-generator.ts`) crea recetas deliciosas a partir de un ingrediente y preferencias dietéticas.
- **Asistente de Compras:** El flujo `shoppingAssistantFlow` (`src/ai/flows/shopping-assistant.ts`) procesa la consulta del usuario y el historial de chat. Utiliza una herramienta (`searchProductsTool`) para permitir que el modelo busque dinámicamente en el catálogo de productos y ofrezca recomendaciones inteligentes.
- **Escritor de Blogs Automatizado:** El flujo `blogGeneratorFlow` (`src/ai/flows/blog-generator.ts`) se activa mediante un cron job semanal. Genera un nuevo artículo optimizado para SEO sobre fitness femenino y lo guarda directamente en la base de datos de Firestore.

---

## 🚀 Despliegue

Este proyecto está optimizado para **Firebase App Hosting**.

El despliegue se gestiona automáticamente a través del flujo de trabajo de Firebase Studio. Cada vez que se confirma un cambio, se puede iniciar una nueva compilación y despliegue.

El archivo `apphosting.yaml` en la raíz contiene la configuración básica para el entorno de App Hosting, incluyendo la tarea programada para la creación automatizada de blogs. No se necesita configuración manual de CI/CD.
