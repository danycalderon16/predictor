from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import MatchInput, MatchData
import joblib
import os
import sqlite3
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "../models/trainig.pkl")
DB_PATH = os.path.join(BASE_DIR, "../data/database.sqlite")

app = FastAPI(title="Match Predictor API")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Match Predictor API!"
    }

model = joblib.load(model_path)

@app.post("/predict")
def predict(match: MatchData):
    data = [[match.home_team_api_id, match.away_team_api_id]]
    prediction = model.predict(data)[0]

    result = {1:"Home Win", 0:"Draw", -1: "Away Win"}[prediction]
    return {"prediction": result}

@app.get("/teams")
def get_teams():
    conn = sqlite3.connect(DB_PATH)
    query = "SELECT team_api_id, team_long_name FROM Team ORDER BY team_long_name ASC"
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    teams = df.to_dict(orient="records")
    return {"teams": teams}