from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import MatchInput

app = FastAPI(title="Match Predictor API")

origins = ["http://localhost:3000"]

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


@app.post("/predict")
async def predict(data: MatchInput):
# Lógica dummy: si envías promedios de gol, comparamos; si no, devolvemos empate probabilístico.
    if data.home_goals_avg is not None and data.away_goals_avg is not None:
        if data.home_goals_avg > data.away_goals_avg + 0.2:
            pred = "home"
        elif data.away_goals_avg > data.home_goals_avg + 0.2:
            pred = "away"
        else:
            pred = "draw"
        probs = {"home": 0.6, "draw": 0.2, "away": 0.2}
    else:
        pred = "draw"
        probs = {"home": 0.33, "draw": 0.34, "away": 0.33}


    return {"prediction": pred, "probabilities": probs, "input": data.dict()}