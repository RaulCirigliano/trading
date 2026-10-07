from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ccxt

app = FastAPI(title="Trading AI API", description="API para el agente de trading")

# Configurar CORS para permitir que el frontend HTML acceda a esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite cualquier origen durante desarrollo
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializamos el exchange (usamos Binance por defecto, pero CCXT soporta +100)
exchange = ccxt.binance()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Motor de Trading AI en línea"}

@app.get("/api/market/price")
def get_price(symbol: str = "BTC/USDT"):
    """
    Obtiene el precio actual y el volumen de un activo.
    """
    try:
        ticker = exchange.fetch_ticker(symbol)
        return {
            "symbol": symbol,
            "price": ticker['last'],
            "high": ticker['high'],
            "low": ticker['low'],
            "volume": ticker['quoteVolume']
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/market/history")
def get_history(symbol: str = "BTC/USDT", timeframe: str = "1h", limit: int = 100):
    """
    Obtiene el histórico de velas (OHLCV) listo para graficar.
    """
    try:
        # fetch_ohlcv devuelve: [timestamp, open, high, low, close, volume]
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
        
        # Lo formateamos para que Lightweight Charts (nuestro frontend) lo entienda fácilmente
        formatted_data = [
            {
                "time": int(candle[0] / 1000),  # Convertimos ms a segundos (debe ser entero)
                "open": candle[1],
                "high": candle[2],
                "low": candle[3],
                "close": candle[4],
                "volume": candle[5]
            }
            for candle in ohlcv
        ]
        return formatted_data
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/market/analysis")
def get_analysis(symbol: str = "BTC/USDT", timeframe: str = "1h"):
    """
    Realiza análisis técnico cuantitativo de las últimas velas.
    """
    try:
        import pandas as pd
        import ta
        
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=100)
        df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        
        # Calcular RSI (14 periodos)
        df['rsi'] = ta.momentum.RSIIndicator(close=df['close'], window=14).rsi()
        
        # Calcular Medias Móviles (SMA 20 y SMA 50)
        df['sma_20'] = ta.trend.SMAIndicator(close=df['close'], window=20).sma_indicator()
        df['sma_50'] = ta.trend.SMAIndicator(close=df['close'], window=50).sma_indicator()
        
        latest = df.iloc[-1]
        previous = df.iloc[-2]
        
        # Lógica básica del Agente Cuantitativo
        signal = "MANTENER"
        reason = "El mercado está en zona neutral."
        
        if latest['rsi'] < 30:
            signal = "COMPRAR"
            reason = f"RSI en sobreventa ({latest['rsi']:.2f}). Posible rebote."
        elif latest['rsi'] > 70:
            signal = "VENDER"
            reason = f"RSI en sobrecompra ({latest['rsi']:.2f}). Posible corrección."
        elif previous['sma_20'] < previous['sma_50'] and latest['sma_20'] > latest['sma_50']:
            signal = "COMPRAR"
            reason = "Cruce dorado detectado (SMA 20 cruza hacia arriba SMA 50)."
        elif previous['sma_20'] > previous['sma_50'] and latest['sma_20'] < latest['sma_50']:
            signal = "VENDER"
            reason = "Cruce de la muerte detectado (SMA 20 cruza hacia abajo SMA 50)."
            
        return {
            "symbol": symbol,
            "signal": signal,
            "reason": reason,
            "indicators": {
                "rsi": round(latest['rsi'], 2) if not pd.isna(latest['rsi']) else None,
                "sma_20": round(latest['sma_20'], 2) if not pd.isna(latest['sma_20']) else None,
                "sma_50": round(latest['sma_50'], 2) if not pd.isna(latest['sma_50']) else None,
                "current_price": latest['close']
            }
        }
    except Exception as e:
        return {"error": str(e)}
