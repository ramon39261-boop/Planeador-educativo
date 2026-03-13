export type Grade = '1°' | '2°' | '3°' | '4°' | '5°' | '6°';
export type CampoFormativo = 
  | 'Lenguajes' 
  | 'Saberes y Pensamiento Científico' 
  | 'Ética, Naturaleza y Sociedades' 
  | 'De lo Humano y lo Comunitario';

export type Metodologia = 
  | 'Aprendizaje basado en proyectos comunitarios'
  | 'Aprendizaje basado en indagación (STEAM)'
  | 'Aprendizaje basado en problemas (ABP)'
  | 'Aprendizaje servicio (AS)';

export interface PlanningData {
  grade: Grade;
  campoFormativo: CampoFormativo;
  metodologia: Metodologia;
  contenido: string;
  pda: string;
  ejesArticuladores: string[];
}

export interface PlanningResult {
  content: string;
  timestamp: string;
}
