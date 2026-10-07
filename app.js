// Configuración inicial del Gráfico usando Lightweight Charts
const chartOptions = {
    layout: {
        textColor: '#d1d5db', // text-gray-300
        background: { type: 'solid', color: 'transparent' },
    },
    grid: {
        vertLines: { color: 'rgba(55, 65, 81, 0.5)' }, // gray-700
        horzLines: { color: 'rgba(55, 65, 81, 0.5)' },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
        borderColor: 'rgba(55, 65, 81, 1)',
    },
    timeScale: {
        borderColor: 'rgba(55, 65, 81, 1)',
    },
};

const chartContainer = document.getElementById('chart-container');
const chart = LightweightCharts.createChart(chartContainer, {
    ...chartOptions,
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight || 400,
});

const candleSeries = chart.addCandlestickSeries({
    upColor: '#22c55e', // green-500
    downColor: '#ef4444', // red-500
    borderDownColor: '#ef4444',
    borderUpColor: '#22c55e',
    wickDownColor: '#ef4444',
    wickUpColor: '#22c55e',
});

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
            currentPrice = data[data.length - 1].close; // Actualizar variable global
            currentPriceElement.innerText = `$${currentPrice.toLocaleString()}`;
            logToTerminal('Gráfico actualizado con datos reales.', 'action');
        } else {
            logToTerminal('Error de datos: ' + data.error, 'error');
        }
    } catch (error) {
        console.error("Error conectando al motor:", error);
        logToTerminal('Fallo al conectar con FastAPI (¿Error de CORS o apagado?)', 'error');
    }
}

// Cargar datos al iniciar
let currentPrice = 0;

// Manejo del redimensionamiento de la ventana
window.addEventListener('resize', () => {
    chart.applyOptions({
        width: chartContainer.clientWidth,
    });
});

// Lógica de UI - Simulación de Agente
const agentToggle = document.getElementById('agentToggle');
const statusText = document.getElementById('statusText');
const terminal = document.getElementById('terminal');
let isAgentActive = false;
let simulateInterval;

function logToTerminal(message, type = 'info') {
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

document.getElementById('clearLogs').addEventListener('click', () => {
    terminal.innerHTML = '';
    logToTerminal('Logs limpiados.', 'info');
});

agentToggle.addEventListener('click', () => {
    isAgentActive = !isAgentActive;
    
    if (isAgentActive) {
        agentToggle.innerText = 'Detener Agente (Kill Switch)';
        agentToggle.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        agentToggle.classList.add('bg-red-600', 'hover:bg-red-700');
        
        statusText.innerText = 'ANALIZANDO...';
        statusText.className = 'font-bold text-green-400 animate-pulse';
        
        logToTerminal('Agente iniciado. Conectando al feed de precios...', 'info');
        
        // Simular análisis del agente
        simulateInterval = setInterval(() => {
            const actions = [
                'Analizando order book. Alta presión de compra detectada.',
                'Evaluando sentimiento en noticias recientes: Positivo.',
                'Calculando RSI (14): 45 - Zona neutral.',
                'Evaluando posible entrada Larga. Riesgo estimado: 1.5%.'
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            logToTerminal(randomAction, 'info');
            
            // Simular un trade aleatorio de vez en cuando
            if(Math.random() > 0.8) {
                logToTerminal('Señal confirmada. Ejecutando orden de COMPRA a mercado (BTC/USD).', 'action');
                addMockPosition();
            }
        }, 3000);
        
    } else {
        agentToggle.innerText = 'Activar Agente';
        agentToggle.classList.remove('bg-red-600', 'hover:bg-red-700');
        agentToggle.classList.add('bg-blue-600', 'hover:bg-blue-700');
        
        statusText.innerText = 'INACTIVO';
        statusText.className = 'font-bold text-yellow-500';
        
        clearInterval(simulateInterval);
        logToTerminal('Agente detenido por el usuario.', 'warn');
    }
});

function addMockPosition() {
    const table = document.getElementById('positionsTable');
    
    // Si es la primera, quitar el mensaje de "no hay posiciones"
    if(table.innerHTML.includes('No hay posiciones')) {
        table.innerHTML = '';
    }
    
    const tr = document.createElement('tr');
    tr.className = 'border-t border-gray-700';
    tr.innerHTML = `
        <td class="py-3 font-semibold">BTC/USD</td>
        <td class="py-3 text-green-400">LONG</td>
        <td class="py-3">$${currentPrice.toLocaleString()}</td>
        <td class="py-3">$${currentPrice.toLocaleString()}</td>
        <td class="py-3 text-green-400">+$0.00</td>
    `;
    table.appendChild(tr);
}

// Inicializar la carga de datos ahora que el DOM y variables están listos
fetchMarketData();
