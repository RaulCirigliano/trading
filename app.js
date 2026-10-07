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
const chart = LightweightCharts.createChart(chartContainer, chartOptions);

const candleSeries = chart.addCandlestickSeries({
    upColor: '#22c55e', // green-500
    downColor: '#ef4444', // red-500
    borderDownColor: '#ef4444',
    borderUpColor: '#22c55e',
    wickDownColor: '#ef4444',
    wickUpColor: '#22c55e',
});

// Generar datos ficticios (Mock data) para el prototipo
function generateMockData() {
    let data = [];
    let time = Math.floor(Date.now() / 1000) - 100 * 3600; // Hace 100 horas
    let open = 60000;
    
    for (let i = 0; i < 100; i++) {
        let close = open + (Math.random() - 0.5) * 1000;
        let high = Math.max(open, close) + Math.random() * 500;
        let low = Math.min(open, close) - Math.random() * 500;
        
        data.push({
            time: time,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
        });
        
        open = close;
        time += 3600; // 1 hora en segundos
    }
    return data;
}

const mockData = generateMockData();
candleSeries.setData(mockData);

// Mostrar precio actual simulado
const currentPriceElement = document.getElementById('currentPrice');
let currentPrice = mockData[mockData.length - 1].close;
currentPriceElement.innerText = `$${currentPrice.toLocaleString()}`;

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
