import { useState, useEffect } from "react";
import type { Team } from "./interfaces/team";
import type { FetchPrediction } from "./interfaces/predictions";

export default function App() {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [result, setResult] = useState<FetchPrediction | null>(null);

  // Cargar equipos al iniciar
  useEffect(() => {
    fetch("http://127.0.0.1:8000/teams")
      .then(res => res.json())
      .then(data => setTeams(data.teams));
  }, []);

  const onPredictResult = async(e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
          if (!homeTeam || !awayTeam) return;

          const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              home_team_api_id: parseInt(homeTeam),
              away_team_api_id: parseInt(awayTeam)
            })
          });

          const data = await res.json();
          setResult(data);
  }

  return (
    <div className="max-w-[600px] flex flex-col m-auto p-4 gap-3">
      <p className="text-center text-2xl">Football Predictor</p>
      <form
        className="grid grid-cols-2 gap-3"
        onSubmit={onPredictResult}
      >
        <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}
          className="border border-gray-400 rounded-md p-1">
          <option value="">Equipo Local</option>
          {teams.map((team:Team) => (
            <option key={team.team_api_id} value={team.team_api_id}>
              {team.team_long_name}
            </option>
          ))}
        </select>

        <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}
         className="border border-gray-400 rounded-md p-1">     
          <option value="">Equipo Visitante</option>
          {teams.map((team:Team) => (
            <option key={team.team_api_id} value={team.team_api_id}>
              {team.team_long_name}
            </option>
          ))}
        </select>

        <button
          className="cursor-pointer col-span-2 bg-green-800 text-white py-2 rounded-md"
         type="submit">Predecir</button>
      </form>

      <div className="rounded-md border border-gray-300">

        {result && (
          <div className="flex flex-col gap-2 p-3">
            <span className="font-bold">Predicción</span>
            <hr className="bg-gray-400 text-gray-300"/>
            <span className="font-bold text-xl">{result.prediction}</span>
          </div>
        )}
        </div>
    </div>
  )
}