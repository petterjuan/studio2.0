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

**VM Fitness Hub** es una plataforma de experiencia digital (DXP) headless de alto rendimiento, diseñada con Next.js. Proporciona una arquitectura de frontend sofisticada para un ecosistema premium de e-commerce y contenido. La plataforma aprovecha el renderizado del lado del servidor (SSR) y una pila tecnológica robusta para ofrecer una interfaz de usuario pulida para explorar productos digitales exclusivos, consumir artículos de blog y utilizar herramientas de personalización impulsadas por IA, incluyendo un asistente de compras inteligente y generadores de recetas y entrenamientos personalizados. El backend está impulsado por Firebase para una autenticación de usuarios, persistencia de datos y administración fluidas, mientras que el procesamiento seguro de pagos se orquesta a través de Stripe.

Este proyecto está diseñado para un despliegue automatizado y escalable en **Firebase App Hosting**.

---

## ✨ Características Principales

- **Arquitectura Next.js 15:** Construido sobre el App Router de Next.js, este proyecto utiliza Server Components por defecto para minimizar el JavaScript del lado del cliente, optimizar el rendimiento de renderizado y mejorar el SEO.
- **UI/UX Sistematizada:** La interfaz de usuario está construida con un enfoque de sistema de diseño, utilizando **Tailwind CSS** y **ShadCN UI** para una experiencia totalmente responsiva y estéticamente consistente. El tema se define por una paleta de colores sofisticada en tonos marrones y beige, con esquemas distintos para los modos claro y oscuro.
- **Motor de Comercio Headless:** Proporciona una experiencia de compra curada para productos digitales, integrándose con **Stripe Checkout** a través de la creación de sesiones en el lado del servidor. El sistema está diseñado para funcionar en un "modo de simulación" si no se proporcionan las claves de Stripe, permitiendo el desarrollo y las pruebas sin credenciales activas.
- **Pipeline de Ingesta de Contenido Automatizado:** Un centro de contenido dinámico con artículos de Valentina Montero. Nuevos artículos optimizados para SEO son **generados autónomamente por una IA** semanalmente a través de una tarea programada (cron job), asegurando un flujo continuo de contenido fresco sin intervención manual.
- **Gestión de Identidad y Acceso Segura (IAM):** Un sistema completo de autenticación de usuarios con flujos de registro e inicio de sesión, y Control de Acceso Basado en Roles (RBAC) para funciones administrativas, todo gestionado por **Firebase Authentication**.
- **Persistencia de Datos NoSQL Escalable:** Los perfiles de usuario, roles de RBAC, planes de entrenamiento personalizados y artículos generados por IA se almacenan en **Cloud Firestore**, proporcionando una solución de base de datos escalable y en tiempo real.
- **Portal de Usuario Autenticado:** Un panel de control privado y autenticado donde los usuarios pueden gestionar sus planes de entrenamiento guardados y acceder al contenido digital comprado.
- **Motor de IA Generativa Propietario:**
    - **Generador de Planes de Entrenamiento:** Un motor personalizado que crea planes de entrenamiento semanales personalizados basados en las metas, niveles de experiencia y preferencias definidas por el usuario.
    - **Generador de Recetas:** Una herramienta de IA que sintetiza recetas novedosas a partir de un ingrediente principal y restricciones dietéticas.
    - **Asistente de Compras:** Un chatbot inteligente y consciente del contexto que asiste a los usuarios con el descubrimiento de productos y consultas, utilizando dinámicamente una herramienta `searchProducts` contra el catálogo de productos.
- **Control de Acceso Basado en Roles (RBAC) para Administración:** Un panel administrativo protegido, controlado por roles de usuario, para que los supervisores revisen y gestionen todos los planes de entrenamiento generados por los usuarios.
- **Optimizado para CI/CD en Firebase App Hosting:** Preconfigurado para despliegues automatizados y sin fricción en **Firebase App Hosting**, con definiciones de infraestructura como código en `apphosting.yaml`.

---

## 🛠️ Configuración y Desarrollo Local

Sigue estos pasos para instanciar el proyecto en tu máquina local. Este es un paso crucial para asegurar que todos los servicios, incluyendo Firebase y Stripe, estén conectados correctamente.

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

Instala todas las dependencias del proyecto.

```bash
npm install
```

### 4. Configurar Variables de Entorno

Este es el paso más crítico para lanzar la aplicación. Todos los secretos y valores de configuración se gestionan en un único archivo `.env`, que debes crear en la raíz del proyecto. **Nunca subas el archivo `.env` al control de versiones.**

Crea un archivo llamado `.env` en la raíz del proyecto y añade las variables de entorno necesarias para Firebase, Stripe y Google AI, reemplazando los valores de ejemplo con tus credenciales reales.

### 5. Ejecutar el Servidor de Desarrollo

Una vez que las variables de entorno estén configuradas, puedes iniciar el servidor de desarrollo de Next.js.

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9000`.

---

## 🔧 Integraciones Clave

### Firebase

- **Autenticación:** El flujo de autenticación emplea una estrategia híbrida cliente-servidor. La creación de usuarios (`createUserWithEmailAndPassword`) se maneja en el lado del cliente para establecer una sesión inmediata. Las Server Actions luego utilizan el token de autenticación de la sesión para crear de forma segura el documento de usuario correspondiente en Firestore con datos validados por el servidor, mitigando los riesgos de manipulación.
- **Firestore:** Utilizado para almacenar perfiles de usuario (incluyendo un booleano `isAdmin` para RBAC), planes de entrenamiento generados por usuarios y artículos de blog generados por IA.
- **Server SDK:** El SDK de administración de Firebase (`firebase-admin`) se utiliza dentro de las Server Actions para ejecutar operaciones privilegiadas de backend, como consultar datos de todos los usuarios en el panel administrativo.

### Stripe

El flujo de pago se orquesta a través de **Stripe Checkout**.
1.  Un usuario inicia una compra desde una página de producto o coaching.
2.  Se invoca una **Server Action** para manejar la solicitud.
3.  Esta acción crea de forma segura una `checkout.Session` de Stripe en el lado del servidor, haciendo referencia a un `stripePriceId` predefinido asociado con cada producto.
4.  La aplicación redirige al usuario a la URL de pago segura alojada en Stripe.
5.  **Importante:** Si la `STRIPE_SECRET_KEY` no está presente en el archivo `.env`, este flujo opera en **modo de simulación**. El usuario es redirigido directamente a una página de éxito, permitiendo el desarrollo local y pruebas de extremo a extremo sin requerir credenciales de Stripe activas.

### Motor de Personalización (Genkit)

- **Generador de Planes de Entrenamiento:** El `workoutPlanGeneratorFlow` (`src/ai/flows/workout-plan-generator.ts`) utiliza un prompt estructurado con validación de esquema Zod para producir planes de entrenamiento semanales personalizados y de alta calidad basados en las entradas del usuario.
- **Generador de Recetas:** El `recipeGeneratorFlow` (`src/ai/flows/recipe-generator.ts`) genera recetas a partir de un ingrediente y preferencias dietéticas especificadas, con validación de entrada incorporada.
- **Asistente de Compras:** El `shoppingAssistantFlow` (`src/ai/flows/shopping-assistant.ts`) procesa la consulta del usuario y el historial del chat. Aprovecha una `searchProductsTool` para otorgar al modelo la capacidad de consultar dinámicamente el catálogo de productos y proporcionar recomendaciones inteligentes y contextuales.
- **Escritor de Blogs Automatizado:** El `blogGeneratorFlow` (`src/ai/flows/blog-generator.ts`) se activa mediante un cron job semanal. Genera un nuevo artículo optimizado para SEO sobre un tema de fitness relevante y lo persiste directamente en la base de datos de Firestore.

---

## 🚀 Despliegue

Este proyecto está optimizado para **Firebase App Hosting**.

El despliegue se gestiona automáticamente a través del flujo de trabajo de Firebase Studio. Confirmar un cambio puede desencadenar un nuevo ciclo de compilación y despliegue.

El archivo `apphosting.yaml` en el directorio raíz contiene la configuración declarativa para el entorno de App Hosting, incluido el trabajo programado para la creación automatizada de contenido. No es necesaria ninguna configuración manual del pipeline de CI/CD.
