// Elementos de UI
const terminal = document.getElementById('terminal');
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

const smaSeries = chart.addLineSeries({
    color: '#3b82f6', // Azul brillante para la SMA 20
    lineWidth: 2,
    crosshairMarkerVisible: false,
    priceLineVisible: false,
});

let currentPrice = 0;

// Obtener datos reales del motor Python
async function fetchMarketData() {
    try {
        logToTerminal('Conectando al motor Python para obtener velas...', 'info');
        const response = await fetch('http://localhost:8765/api/market/history?symbol=BTC/USDT&timeframe=1m');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data && !data.error) {
            candleSeries.setData(data);
            
            // Extraer y pintar la línea de Media Móvil (SMA 20)
            const smaData = data
                .filter(d => d.sma_20 !== undefined)
                .map(d => ({ time: d.time, value: d.sma_20 }));
            if (smaData.length > 0) {
                smaSeries.setData(smaData);
            }
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

// Ciclo de IA (Cada 15 segundos)
let isAgentActive = false;
let simulateInterval;

agentToggle.addEventListener('click', () => {
    isAgentActive = !isAgentActive;
    if (isAgentActive) {
        agentToggle.innerText = 'Detener Agente (Kill Switch)';
        agentToggle.classList.replace('bg-blue-600', 'bg-red-600');
        agentToggle.classList.replace('hover:bg-blue-700', 'hover:bg-red-700');
        logToTerminal('Agente activado. Iniciando análisis cuantitativo.', 'info');
        
        simulateInterval = setInterval(async () => {
            logToTerminal('Consultando agente de Python...', 'info');
            try {
                const response = await fetch('http://localhost:8765/api/market/analysis?symbol=BTC/USDT&timeframe=1m');
                const data = await response.json();
                
                if (data && !data.error) {
                    let logType = 'info';
                    if (data.signal === 'COMPRAR') logType = 'action';
                    if (data.signal === 'VENDER') logType = 'error';
                    
                    logToTerminal(`[${data.signal}] RSI: ${data.indicators.rsi} | SMA20: ${data.indicators.sma_20}`, 'warn');
                    logToTerminal(`Razonamiento: ${data.reason}`, logType);
                } else {
                    logToTerminal('Error de análisis: ' + data.error, 'error');
                }
            } catch (err) {
                logToTerminal('Fallo de conexión con el Agente Python.', 'error');
            }
        }, 15000);
    } else {
        agentToggle.innerText = 'Activar Agente';
        agentToggle.classList.replace('bg-red-600', 'bg-blue-600');
        agentToggle.classList.replace('hover:bg-red-700', 'hover:bg-blue-700');
        clearInterval(simulateInterval);
        logToTerminal('Agente detenido.', 'warn');
    }
});

// Ciclo de Gráfico en Vivo (Cada 2 segundos) para que se mueva rápido
setInterval(async () => {
    try {
        const response = await fetch('http://localhost:8765/api/market/history?symbol=BTC/USDT&timeframe=1m');
        const data = await response.json();
        if (data && data.length > 0) {
            const latest_candle = data[data.length - 1];
            candleSeries.update(latest_candle);
            
            if (latest_candle.sma_20 !== undefined) {
                smaSeries.update({ time: latest_candle.time, value: latest_candle.sma_20 });
            }
            
            const currentPriceElement = document.getElementById('currentPrice');
            currentPriceElement.innerText = `$${latest_candle.close.toLocaleString()}`;
        }
    } catch (err) {
        // Silencioso para no ensuciar la consola
    }
}, 2000);

// Agente Sentimiento (Cada 60 segundos)
async function updateSentiment() {
    try {
        const response = await fetch('http://localhost:8765/api/market/sentiment');
        const data = await response.json();
        if (data && !data.error) {
            const badge = document.getElementById('sentimentScoreBadge');
            const container = document.getElementById('sentimentNewsContainer');
            
            badge.innerText = `${data.score} (${data.estado})`;
            
            const needle = document.getElementById('sentimentNeedle');
            if (needle) {
                const percent = ((data.score + 1) / 2) * 100;
                needle.style.left = `${Math.max(0, Math.min(100, percent))}%`;
            }
            
            if (data.estado === 'BULLISH') {
                badge.className = 'text-xs bg-green-900 text-green-400 px-2 py-1 rounded font-bold';
            } else if (data.estado === 'BEARISH') {
                badge.className = 'text-xs bg-red-900 text-red-400 px-2 py-1 rounded font-bold';
            } else {
                badge.className = 'text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded font-bold';
            }
            
            container.innerHTML = '';
            data.noticias.forEach(news => {
                let colorClass = 'border-gray-500';
                if (news.score > 0) colorClass = 'border-green-500';
                if (news.score < 0) colorClass = 'border-red-500';
                
                const div = document.createElement('div');
                div.className = `bg-gray-900 p-2 rounded border-l-2 ${colorClass}`;
                div.innerHTML = `
                    <p class="text-[10px] text-gray-400 flex justify-between">
                        <span>📰 CoinDesk</span>
                        <span>Score: ${news.score}</span>
                    </p>
                    <p class="text-xs text-gray-200 mt-1">${news.title}</p>
                `;
                container.appendChild(div);
            });
        }
    } catch (err) {
        console.error("Fallo el Agente de Sentimiento", err);
    }
}
updateSentiment();
setInterval(updateSentiment, 60000);

document.getElementById('clearLogs').addEventListener('click', () => {
    terminal.innerHTML = '';
});
