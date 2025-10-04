import { useState } from 'react'


export default function App() {
  const [home, setHome] = useState('')
  const [away, setAway] = useState('')
  const [result, setResult] = useState(null)


  async function handlePredict(e) {
    e.preventDefault()
    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_team: home, away_team: away })
    })
    const data = await res.json()
    setResult(data)
  }


  return (
    <div style={{ padding: 20 }}>
      <h1>Match Predictor (frontend)</h1>
      <form onSubmit={handlePredict}>
        <input placeholder="Home team" value={home} onChange={e => setHome(e.target.value)} />
        <input placeholder="Away team" value={away} onChange={e => setAway(e.target.value)} />
        <button type="submit">Predecir</button>
      </form>


      {result && (
        <div style={{ marginTop: 20 }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}