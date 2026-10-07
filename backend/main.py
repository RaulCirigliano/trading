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
        
        # Lógica del Agente Orquestador (IA Gemini)
        from dotenv import load_dotenv
        import os
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import PromptTemplate
        import json

        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")

        signal = "MANTENER"
        reason = "El mercado está en zona neutral."

        if not api_key or api_key == "tu_clave_aqui_sin_comillas":
            reason = "[AVISO] Falta configurar GEMINI_API_KEY en el archivo .env. Usando lógica por defecto."
            if latest['rsi'] < 30: signal = "COMPRAR"
            elif latest['rsi'] > 70: signal = "VENDER"
        else:
            try:
                # Inicializar el cerebro (Gemini 2.5 Flash es rapidísimo para esto)
                llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash", google_api_key=api_key, temperature=0.2)
                
                # Armar el contexto para el Agente
                prompt = PromptTemplate.from_template(
                    "Eres el Agente Orquestador de un bot de trading cuantitativo. "
                    "Analiza los siguientes datos técnicos del par {symbol}:\n"
                    "- Precio Actual: ${precio}\n"
                    "- RSI (14): {rsi}\n"
                    "- SMA (20): {sma20}\n"
                    "- SMA (50): {sma50}\n\n"
                    "Reglas estrictas:\n"
                    "1. Si el RSI está por debajo de 30, es sobreventa (buscar compras).\n"
                    "2. Si el RSI está por encima de 70, es sobrecompra (buscar ventas).\n"
                    "3. Si la SMA 20 es mayor que SMA 50, la tendencia a corto plazo es alcista.\n"
                    "4. Si la SMA 20 es menor que SMA 50, la tendencia a corto plazo es bajista.\n\n"
                    "Emite una señal final. Tu respuesta debe ser EXCLUSIVAMENTE en formato JSON válido:\n"
                    '{{"signal": "COMPRAR", "reason": "Justificación de máximo 15 palabras"}} o VENDER o MANTENER.'
                )
                
                chain = prompt | llm
                respuesta = chain.invoke({
                    "symbol": symbol,
                    "precio": round(latest['close'], 2),
                    "rsi": round(latest['rsi'], 2),
                    "sma20": round(latest['sma_20'], 2),
                    "sma50": round(latest['sma_50'], 2)
                })
                
                # Limpiar la respuesta (por si Gemini envuelve el JSON en ```json)
                raw_json = respuesta.content.replace("```json", "").replace("```", "").strip()
                ia_decision = json.loads(raw_json)
                
                signal = ia_decision.get("signal", "MANTENER").upper()
                reason = ia_decision.get("reason", "Decisión basada en análisis de IA.")
                
                # Seguridad: asegurar que la señal sea válida
                if signal not in ["COMPRAR", "VENDER", "MANTENER"]:
                    signal = "MANTENER"
                    
            except Exception as ia_error:
                reason = f"Error en el Agente IA: {str(ia_error)}"
        
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
