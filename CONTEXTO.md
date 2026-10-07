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
