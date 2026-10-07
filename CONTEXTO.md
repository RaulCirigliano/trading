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
