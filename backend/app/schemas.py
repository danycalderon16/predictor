from pydantic import BaseModel
from typing import Optional

class MatchInput(BaseModel):
    home_team: str
    away_team: str
    home_goals_avg: Optional[float] = None
    away_goals_avg: Optional[float] = None
    
    
class MatchData(BaseModel):
    home_team_api_id: int
    away_team_api_id: int
