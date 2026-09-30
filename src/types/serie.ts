export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';
export type SerieSort = 'recentes' | 'nota';

export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
  concluida: number; // 0 ou 1
}

export type CreateSerieInput = Omit<Serie, 'id' | 'concluida'>;
export type UpdateSerieInput = Partial<CreateSerieInput>;