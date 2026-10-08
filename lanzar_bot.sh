#!/bin/bash

# Ruta del proyecto
PROJECT_DIR="/home/raul/Escritorio/proyectos/trading"
cd $PROJECT_DIR

echo "Iniciando el Cerebro Matemático (Backend)..."
# Activar entorno y ejecutar FastAPI en segundo plano
source venv/bin/activate
uvicorn backend.main:app --host 127.0.0.1 --port 8765 &
BACKEND_PID=$!

echo "Iniciando la Interfaz Visual (Frontend)..."
# Ejecutar servidor web en segundo plano
python3 -m http.server 8085 &
FRONTEND_PID=$!

echo "Esperando 2 segundos para que los servidores arranquen..."
sleep 2

echo "Abriendo la aplicación en tu navegador web..."
# xdg-open es el comando en Linux para abrir el navegador predeterminado
xdg-open http://localhost:8085

echo "------------------------------------------------------"
echo "¡Todo en marcha! La aplicación se abrió en tu navegador."
echo "Para APAGAR los motores, simplemente cierra esta terminal"
echo "o presiona Ctrl+C"
echo "------------------------------------------------------"

# Esperar a que el usuario presione Ctrl+C para matar los procesos
wait $BACKEND_PID
wait $FRONTEND_PID
