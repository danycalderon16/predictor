import { useState, useEffect } from "react";

export default function App() {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [result, setResult] = useState(null);

  // Cargar equipos al iniciar
  useEffect(() => {
    fetch("http://127.0.0.1:8000/teams")
      .then(res => res.json())
      .then(data => setTeams(data.teams));
  }, []);


  return (
    <>
    <form
      onSubmit={async (e) => {
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
      }}
    >
      <label>Equipo Local:</label>
      <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
        <option value="">Selecciona un equipo</option>
        {teams.map(team => (
          <option key={team.team_api_id} value={team.team_api_id}>
            {team.team_long_name}
          </option>
        ))}
      </select>

      <label>Equipo Visitante:</label>
      <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}>
        <option value="">Selecciona un equipo</option>
        {teams.map(team => (
          <option key={team.team_api_id} value={team.team_api_id}>
            {team.team_long_name}
          </option>
        ))}
      </select>

      <button type="submit">Predecir</button>
    </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>Predicción:</strong> {result.prediction}
        </div>
      )}
    </>
  )
}