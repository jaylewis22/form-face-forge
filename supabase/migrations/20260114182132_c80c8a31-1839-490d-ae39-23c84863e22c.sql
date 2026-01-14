-- Create leagues table
CREATE TABLE public.leagues (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  country_code TEXT,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  country_code TEXT,
  league_id INTEGER REFERENCES public.leagues(id),
  overall_rating INTEGER DEFAULT 0,
  stadium TEXT,
  budget BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  position TEXT,
  secondary_position TEXT,
  nationality TEXT,
  nationality_code TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  overall_rating INTEGER DEFAULT 0,
  potential_rating INTEGER DEFAULT 0,
  jersey_number INTEGER,
  preferred_foot TEXT,
  weak_foot INTEGER,
  skill_moves INTEGER,
  team_id INTEGER REFERENCES public.teams(id),
  wage BIGINT DEFAULT 0,
  contract_end DATE,
  -- Physical attributes
  pace INTEGER DEFAULT 0,
  acceleration INTEGER DEFAULT 0,
  sprint_speed INTEGER DEFAULT 0,
  -- Shooting attributes
  shooting INTEGER DEFAULT 0,
  positioning INTEGER DEFAULT 0,
  finishing INTEGER DEFAULT 0,
  shot_power INTEGER DEFAULT 0,
  long_shots INTEGER DEFAULT 0,
  volleys INTEGER DEFAULT 0,
  penalties INTEGER DEFAULT 0,
  -- Passing attributes
  passing INTEGER DEFAULT 0,
  vision INTEGER DEFAULT 0,
  crossing INTEGER DEFAULT 0,
  free_kick_accuracy INTEGER DEFAULT 0,
  short_passing INTEGER DEFAULT 0,
  long_passing INTEGER DEFAULT 0,
  curve INTEGER DEFAULT 0,
  -- Dribbling attributes
  dribbling INTEGER DEFAULT 0,
  agility INTEGER DEFAULT 0,
  balance INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  ball_control INTEGER DEFAULT 0,
  composure INTEGER DEFAULT 0,
  -- Defending attributes
  defending INTEGER DEFAULT 0,
  interceptions INTEGER DEFAULT 0,
  heading_accuracy INTEGER DEFAULT 0,
  def_awareness INTEGER DEFAULT 0,
  standing_tackle INTEGER DEFAULT 0,
  sliding_tackle INTEGER DEFAULT 0,
  -- Physical attributes
  physical INTEGER DEFAULT 0,
  jumping INTEGER DEFAULT 0,
  stamina INTEGER DEFAULT 0,
  strength INTEGER DEFAULT 0,
  aggression INTEGER DEFAULT 0,
  -- GK attributes
  gk_diving INTEGER DEFAULT 0,
  gk_handling INTEGER DEFAULT 0,
  gk_kicking INTEGER DEFAULT 0,
  gk_positioning INTEGER DEFAULT 0,
  gk_reflexes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competitions table
CREATE TABLE public.competitions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  competition_type TEXT,
  country_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kits table
CREATE TABLE public.kits (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES public.teams(id),
  kit_type TEXT NOT NULL,
  primary_color TEXT,
  secondary_color TEXT,
  third_color TEXT,
  pattern TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_players_team_id ON public.players(team_id);
CREATE INDEX idx_players_name ON public.players(name);
CREATE INDEX idx_teams_league_id ON public.teams(league_id);
CREATE INDEX idx_teams_name ON public.teams(name);
CREATE INDEX idx_kits_team_id ON public.kits(team_id);

-- Enable RLS
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is game data, not user-specific)
CREATE POLICY "Allow public read access to leagues"
  ON public.leagues FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to teams"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to players"
  ON public.players FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to competitions"
  ON public.competitions FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to kits"
  ON public.kits FOR SELECT
  USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert to leagues"
  ON public.leagues FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to leagues"
  ON public.leagues FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete to leagues"
  ON public.leagues FOR DELETE
  USING (true);

CREATE POLICY "Allow authenticated insert to teams"
  ON public.teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to teams"
  ON public.teams FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete to teams"
  ON public.teams FOR DELETE
  USING (true);

CREATE POLICY "Allow authenticated insert to players"
  ON public.players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to players"
  ON public.players FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete to players"
  ON public.players FOR DELETE
  USING (true);

CREATE POLICY "Allow authenticated insert to competitions"
  ON public.competitions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to competitions"
  ON public.competitions FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete to competitions"
  ON public.competitions FOR DELETE
  USING (true);

CREATE POLICY "Allow authenticated insert to kits"
  ON public.kits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to kits"
  ON public.kits FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete to kits"
  ON public.kits FOR DELETE
  USING (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers
CREATE TRIGGER update_leagues_updated_at
  BEFORE UPDATE ON public.leagues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kits_updated_at
  BEFORE UPDATE ON public.kits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();