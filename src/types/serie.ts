// A entidade completa, exatamente como está no banco de dados
export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null; 
  concluida: number; 
  createdAt: string;
}

export interface CreateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
}


export interface UpdateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
}

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';