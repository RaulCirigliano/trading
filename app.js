// Elementos de UI
const terminal = document.getElementById('terminal');
const statusText = document.getElementById('statusText');
const agentToggle = document.getElementById('agentToggle');

function logToTerminal(message, type = 'info') {
    if (!terminal) return;
    const time = new Date().toLocaleTimeString();
    const p = document.createElement('p');
    let color = 'text-green-400';
    if (type === 'warn') color = 'text-yellow-400';
    if (type === 'error') color = 'text-red-400';
    if (type === 'action') color = 'text-blue-400';
    
    p.className = color;
    p.innerHTML = `<span class="text-gray-500">[${time}]</span> > ${message}`;
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
}

// Capturar errores para verlos en pantalla
window.onerror = function(message, source, lineno, colno, error) {
    logToTerminal(`ERROR CRÍTICO: ${message} (Línea ${lineno})`, 'error');
};
window.addEventListener('unhandledrejection', function(event) {
    logToTerminal(`PROMESA FALLIDA: ${event.reason}`, 'error');
});

// Configuración inicial del Gráfico usando Lightweight Charts
const chartOptions = {
    layout: {
        textColor: '#d1d5db',
        background: { type: 'solid', color: 'transparent' },
    },
    grid: {
        vertLines: { color: 'rgba(55, 65, 81, 0.5)' },
        horzLines: { color: 'rgba(55, 65, 81, 0.5)' },
    },
    rightPriceScale: { borderColor: 'rgba(55, 65, 81, 1)' },
    timeScale: { borderColor: 'rgba(55, 65, 81, 1)', timeVisible: true },
};

const chartContainer = document.getElementById('chart-container');
const chart = LightweightCharts.createChart(chartContainer, {
    ...chartOptions,
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight || 400,
});

const candleSeries = chart.addCandlestickSeries({
    upColor: '#22c55e', downColor: '#ef4444',
    borderDownColor: '#ef4444', borderUpColor: '#22c55e',
    wickDownColor: '#ef4444', wickUpColor: '#22c55e',
});

let currentPrice = 0;

// Obtener datos reales del motor Python
async function fetchMarketData() {
    try {
        logToTerminal('Conectando al motor Python para obtener velas...', 'info');
        const response = await fetch('http://localhost:8765/api/market/history?symbol=BTC/USDT&timeframe=1h');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data && !data.error) {
            candleSeries.setData(data);
            const currentPriceElement = document.getElementById('currentPrice');
            currentPrice = data[data.length - 1].close; 
            currentPriceElement.innerText = `$${currentPrice.toLocaleString()}`;
            logToTerminal('Gráfico actualizado con datos reales.', 'action');
        } else {
            logToTerminal('Error de datos: ' + data.error, 'error');
        }
    } catch (error) {
        logToTerminal(`Fallo al conectar con FastAPI: ${error.message}`, 'error');
    }
}

// Cargar datos al iniciar
fetchMarketData();

window.addEventListener('resize', () => {
    chart.applyOptions({ width: chartContainer.clientWidth });
});

let isAgentActive = false;
let simulateInterval;

agentToggle.addEventListener('click', () => {
    isAgentActive = !isAgentActive;
    if (isAgentActive) {
        agentToggle.innerText = 'Detener Agente (Kill Switch)';
        agentToggle.classList.replace('bg-blue-600', 'bg-red-600');
        agentToggle.classList.replace('hover:bg-blue-700', 'hover:bg-red-700');
        statusText.innerText = 'ANALIZANDO...';
        statusText.className = 'font-bold text-green-400 animate-pulse';
        logToTerminal('Agente activado.', 'info');
        
        simulateInterval = setInterval(async () => {
            logToTerminal('Consultando agente de Python...', 'info');
            try {
                const response = await fetch('http://localhost:8765/api/market/analysis?symbol=BTC/USDT&timeframe=1h');
                const data = await response.json();
                
                if (data && !data.error) {
                    let logType = 'info';
                    if (data.signal === 'COMPRAR') logType = 'action';
                    if (data.signal === 'VENDER') logType = 'error';
                    
                    logToTerminal(`[${data.signal}] RSI: ${data.indicators.rsi} | SMA20: ${data.indicators.sma_20}`, 'warn');
                    logToTerminal(`Razonamiento: ${data.reason}`, logType);
                    
                    // Actualizar el gráfico y el precio en vivo
                    if (data.latest_candle) {
                        candleSeries.update(data.latest_candle);
                        const currentPriceElement = document.getElementById('currentPrice');
                        currentPriceElement.innerText = `$${data.latest_candle.close.toLocaleString()}`;
                    }
                } else {
                    logToTerminal('Error de análisis: ' + data.error, 'error');
                }
            } catch (err) {
                logToTerminal('Fallo de conexión con el Agente Python.', 'error');
            }
        }, 60000);
    } else {
        agentToggle.innerText = 'Activar Agente';
        agentToggle.classList.replace('bg-red-600', 'bg-blue-600');
        agentToggle.classList.replace('hover:bg-red-700', 'hover:bg-blue-700');
        statusText.innerText = 'INACTIVO';
        statusText.className = 'font-bold text-yellow-500';
        clearInterval(simulateInterval);
        logToTerminal('Agente detenido.', 'warn');
    }
});

document.getElementById('clearLogs').addEventListener('click', () => {
    terminal.innerHTML = '';
});
