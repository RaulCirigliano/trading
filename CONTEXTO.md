# Proyecto AI Trading Agent - Contexto y Plan de Acción

## Visión General
Este proyecto es una plataforma integral para traders profesionales que combina la ingesta de datos de mercado en tiempo real, análisis técnico/fundamental y la ejecución automatizada de estrategias a través de agentes de Inteligencia Artificial.

## Estado Actual (Prototipo V1)
- [x] Inicialización del proyecto.
- [x] Creación de Dashboard UI (HTML/CSS/JS) para la visualización de datos y panel de control del agente.
- [x] Definición del documento de contexto y planificación.

## Arquitectura Planeada

1. **Frontend (Dashboard):** Interfaz para monitorear el mercado, el estado del agente y el rendimiento. (Actual: Prototipo estático HTML/JS).
2. **Backend (API):** Servidor (planeado en Python/FastAPI) para manejar la lógica de negocio, comunicarse con los exchanges y orquestar a los agentes.
3. **Agentes de IA:** Scripts en Python que evaluarán estrategias (Ej. LangChain / Modelos Predictivos).
4. **Conector de Exchange:** Integración con brokers (ej. Binance Testnet, Alpaca) para paper trading.

## Plan de Acción a Futuro

### Fase 1: Base Visual y Conexión de Datos (Próximos Pasos)
- [ ] Convertir el prototipo frontend a una aplicación estructurada (React o servir el HTML con FastAPI).
- [ ] Conectar un flujo de datos real (WebSockets de Binance o Polygon.io) para actualizar el gráfico en tiempo real en el Dashboard.
- [ ] Implementar un backend básico en Python para servir los datos al frontend.

### Fase 2: El Cerebro del Agente (Paper Trading)
- [ ] Desarrollar el primer "Agente Analista" en Python capaz de procesar OHLCV (Velas) y calcular indicadores técnicos básicos.
- [ ] Conectar el backend con una API de simulación (Paper Trading).
- [ ] Integrar un botón en el UI para activar/desactivar al agente y ver su log de decisiones.

### Fase 3: Análisis Fundamental e Interfaz Conversacional (Asistente)
- [ ] Integrar un LLM (OpenAI / Gemini) para analizar feeds de noticias y generar un score de sentimiento.
- [ ] Mostrar alertas en el dashboard cuando el agente detecte oportunidades claras, requiriendo aprobación manual del trader (Modo Copiloto).

### Fase 4: Trading Autónomo y Gestión de Riesgos
- [ ] Implementar reglas duras de gestión de riesgo (Stop Loss máximo por día, tamaño de posición dinámico).
- [ ] Transición a cuenta real con capital de prueba (Live Trading).
- [ ] Añadir panel de métricas de rendimiento avanzadas (Sharpe Ratio, Max Drawdown).

## Notas Técnicas
- **Ruta del Proyecto:** `/home/raul/Escritorio/proyectos/triding`
- Se sugiere usar entornos virtuales (`venv`) para el desarrollo en Python futuro.


## Notas Adicionales y Estrategia

Entiendo perfectamente lo que buscas. Quieres crear una gran base de conocimiento (documentos, estrategias y videos de trading) para que, al momento de programar y diseñar tu proyecto aquí conmigo, yo entienda tu visión y estrategias con exactitud. Dado que estamos trabajando en este entorno de desarrollo, **no puedo conectarme directamente a tu cuenta web personal de NotebookLM**, pero podemos lograr exactamente lo que quieres de dos formas mucho más directas y potentes:

### Opción 1: Usar este mismo chat como tu "Cuaderno"
El modelo de IA que utilizo (Gemini) tiene una capacidad de memoria enorme (ventana de contexto). Esto significa que **puedes subir toda tu información directamente a este chat o al espacio de trabajo**.
* Puedes arrastrar y soltar PDFs, archivos de texto con tus estrategias, e incluso videos tutoriales directamente aquí.
* Una vez que los subas, yo los analizaré, los mantendré en memoria y usaré todo ese conocimiento experto en trading para programar el proyecto exactamente como tú lo pretendes.

### Opción 2: Programar nuestro propio "Cerebro de Trading" en tu proyecto
Si lo que quieres es que el *software* que vamos a construir tenga ese conocimiento incorporado (por ejemplo, si vamos a crear un bot de trading o una app de análisis), podemos iniciar un proyecto ahora mismo y usar la **API de Gemini**.
1. Creamos una carpeta en tu espacio de trabajo donde guardarás todos esos PDFs, notas y videos de trading.
2. Yo programo un script que lea todos esos archivos (creando nuestro propio NotebookLM local).
3. El proyecto que construyamos consultará esa base de datos de trading para tomar decisiones, generar alertas o darte consejos precisos.

**¿Cómo prefieres que empecemos?** Si quieres que yo aprenda tus estrategias para ayudarte a programar, **puedes empezar a subir algunos de esos archivos de texto, PDFs o describir tus reglas de trading aquí mismo**, y luego me cuentas qué tipo de proyecto de software de trading quieres que construyamos juntos.

### Alternativas para Integración de Conocimiento (Estilo NotebookLM)
En el futuro, para que el sistema tenga acceso a una gran base de conocimiento de trading sin depender de subir archivos manualmente en cada sesión, consideraremos las siguientes aproximaciones:
1. **Gemini API (Recomendada para el proyecto):** Construir nuestra propia aplicación RAG (Retrieval-Augmented Generation) usando la API de Gemini o Google AI Studio. Esta es la vía oficial y escalable para subir múltiples documentos (estrategias, PDFs) y que la IA responda preguntas y tome decisiones basándose estrictamente en ellos.
2. **NotebookLM Enterprise API:** En caso de contar con Google Cloud, aprovechar la API oficial empresarial para gestionar cuadernos y fuentes de datos.
3. **Servidores MCP (Model Context Protocol):** Herramientas comunitarias para conectar cuentas individuales de NotebookLM con el agente de IA, útiles para prototipado rápido pero sin garantía de estabilidad a largo plazo.

## Tareas Pendientes (Agregadas en Sesión)
- [ ] **Gestión de Capital Fraccionado (Position Sizing):** Modificar el simulador (y futuro motor real) para que no opere "All-In" (100% de los USDT). Se debe configurar el Agente de Riesgo para usar solo una fracción del capital (ej. 25% o 20% por operación), permitiendo así múltiples operaciones simultáneas y mejorando la diversificación y control de riesgos. Validar esta estrategia con el experto antes de implementarla.
- [ ] **Caja de Contexto Macro (Prompt del Trader):** Agregar un campo de texto en el Dashboard para que el usuario pueda ingresar información fundamental, intuiciones o noticias de última hora (ej. "Estalló una guerra, favorecer compras en petróleo o refugios"). El Motor Orquestador basado en LLM (Gemini) deberá ingerir este texto como directiva suprema, calibrando o ignorando los indicadores técnicos si el contexto macroeconómico dictado por el humano lo amerita.

- [ ] **Despliegue a la Nube (Cloud Deployment):** Mover el backend (Python/FastAPI) de `localhost` a un servicio en la nube (ej. Render, Railway). Posteriormente, actualizar las rutas de los endpoints en el frontend (`app.js`) para que apunten a la nueva URL pública, permitiendo que la aplicación ya hosteada en GitHub Pages sea funcional para cualquier usuario externo sin requerir instalaciones locales.

## Motivación y Propósito del Proyecto (El "Por Qué")
Este proyecto nace de una profunda motivación personal y ética. Fue iniciado para ayudar a un amigo cercano que, tras realizar numerosos cursos de trading (a menudo promovidos por "gurús" de la industria), solicitó un crédito de 5 millones de pesos y perdió todo su capital. 
El creador de esta aplicación comprendió una dura realidad: el trading manual retail es, en gran medida, una fantasía. Los traders humanos que aprietan botones de compra y venta guiados por la emoción y la adrenalina (como en un videojuego) están compitiendo contra supercomputadoras de Wall Street y algoritmos de alta frecuencia. En esas condiciones, el fracaso es casi inevitable.

Al conocer el verdadero poder de la Inteligencia Artificial y la programación, el objetivo de este proyecto es nivelar el campo de juego. Se busca construir un "Escudo" o "Tanque de Guerra" algorítmico que elimine por completo el factor emocional (la principal causa de ruina financiera). 
Mediante reglas matemáticas estrictas (MACD, Bollinger), un Agente de Riesgo inflexible (Stop Loss al 1%) y un simulador con dinero ficticio hiperrealista, esta herramienta busca demostrar que la única posibilidad real de éxito para un inversor minorista es apoyarse en la disciplina inquebrantable del software, obligándolo a ser rentable en simulación antes de arriesgar un solo centavo real.
