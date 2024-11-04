import os
import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from scipy.spatial import distance

try:
    load_dotenv()

    database_url = os.getenv("DATABASE_URL1")

    if not database_url:
        raise ValueError("DATABASE_URL no está definido en el archivo .env")

     # Configuración de base de datos
    engine = create_engine(database_url)

    # Cargar datos de la tabla clima
    clima_data = pd.read_sql("SELECT * FROM clima WHERE recomendacion IS NOT NULL", engine)
    
    # Cargar datos de la tabla recomendaciones
    recomendaciones_data = pd.read_sql("SELECT * FROM recomendaciones", engine)

    # Verificar si hay suficientes registros
    if len(clima_data) < 100:  
        # Obtener las condiciones climáticas de entrada
        input_data = json.loads(sys.argv[1])
        entrada = [
            input_data['temperatura'],
            input_data['humedad'],
            input_data['viento'],
            input_data['presion'],
            input_data['precipitacion']
        ]

        # Predecir y seleccionar el mejor cultivo
        temp_pred = entrada[0]
        hum_pred = entrada[1]

        recomendaciones_data['distancia'] = ((recomendaciones_data['temperatura_min'] <= temp_pred) & 
                                             (recomendaciones_data['temperatura_max'] >= temp_pred) &
                                             (recomendaciones_data['humedad_min'] <= hum_pred) & 
                                             (recomendaciones_data['humedad_max'] >= hum_pred))

        if recomendaciones_data['distancia'].sum() == 0:
            recomendaciones_data['distancia'] = ((recomendaciones_data['temperatura_min'] - temp_pred).abs() +
                                                 (recomendaciones_data['temperatura_max'] - temp_pred).abs() +
                                                 (recomendaciones_data['humedad_min'] - hum_pred).abs() +
                                                 (recomendaciones_data['humedad_max'] - hum_pred).abs())
            mejor_cultivo = recomendaciones_data.nsmallest(1, 'distancia')
        else:
            mejor_cultivo = recomendaciones_data[recomendaciones_data['distancia']].head(1)
        
        resultado = mejor_cultivo['cultivo'].tolist()
        print(json.dumps({"recommendation": resultado}))

    else:
        # Preparación de los datos para entrenamiento
        X = clima_data[['temperatura', 'humedad', 'viento', 'presion', 'precipitacion']]
        y_temp = clima_data['temperatura']
        y_hum = clima_data['humedad']
        
        X_train, X_test, y_temp_train, y_temp_test = train_test_split(X, y_temp, test_size=0.2, random_state=42)
        _, _, y_hum_train, y_hum_test = train_test_split(X, y_hum, test_size=0.2, random_state=42)

        # Crear y entrenar el modelo de temperatura
        model_temp = XGBRegressor(colsample_bytree= 1.0, learning_rate= 0.01, max_depth= 5, n_estimators= 200, subsample= 0.7)
        model_temp.fit(X_train, y_temp_train)

        # Crear y entrenar el modelo de humedad
        model_hum = XGBRegressor(colsample_bytree= 1.0, learning_rate= 0.01, max_depth= 5, n_estimators= 200, subsample= 0.7)
        model_hum.fit(X_train, y_hum_train)

        # Función de predicción
        def predict_cultivo(entrada):
            temp_pred = model_temp.predict(pd.DataFrame([entrada], columns=['temperatura', 'humedad', 'viento', 'presion', 'precipitacion']))[0]
            hum_pred = model_hum.predict(pd.DataFrame([entrada], columns=['temperatura', 'humedad', 'viento', 'presion', 'precipitacion']))[0]

            recomendaciones_data['distancia'] = ((recomendaciones_data['temperatura_min'] <= temp_pred) & 
                                                 (recomendaciones_data['temperatura_max'] >= temp_pred) &
                                                 (recomendaciones_data['humedad_min'] <= hum_pred) & 
                                                 (recomendaciones_data['humedad_max'] >= hum_pred))

            if recomendaciones_data['distancia'].sum() == 0:
                recomendaciones_data['distancia'] = ((recomendaciones_data['temperatura_min'] - temp_pred).abs() +
                                                     (recomendaciones_data['temperatura_max'] - temp_pred).abs() +
                                                     (recomendaciones_data['humedad_min'] - hum_pred).abs() +
                                                     (recomendaciones_data['humedad_max'] - hum_pred).abs())
                mejor_cultivo = recomendaciones_data.nsmallest(1, 'distancia')
            else:
                mejor_cultivo = recomendaciones_data[recomendaciones_data['distancia']].head(1)

            return mejor_cultivo['cultivo'].tolist()

        # Obtener las condiciones climáticas de entrada
        input_data = json.loads(sys.argv[1])
        recommendation = predict_cultivo([
            input_data['temperatura'], 
            input_data['humedad'], 
            input_data['viento'], 
            input_data['presion'], 
            input_data['precipitacion']
        ])
        print(json.dumps({"recommendation": recommendation}))


except SQLAlchemyError as db_error:
    print(json.dumps({"error": f"Error en la base de datos: {str(db_error)}"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))