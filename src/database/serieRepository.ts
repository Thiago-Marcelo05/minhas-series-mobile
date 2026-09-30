import { getDatabase } from './database';
import { Serie, CreateSerieInput, UpdateSerieInput, SerieFilter } from '../types/serie';

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = await getDatabase();
  
  let query = 'SELECT * FROM series';
  
  if (filtro === 'assistindo') {
    query += ' WHERE concluida = 0';
  } else if (filtro === 'concluidas') {
    query += ' WHERE concluida = 1';
  }
  
  query += ' ORDER BY createdAt DESC';
  
  return db.getAllAsync<Serie>(query);
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Serie>('SELECT * FROM series WHERE id = ?', id);
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  
  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, nota, concluida, createdAt) VALUES (?, ?, ?, ?, 0, ?)',
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.nota,
    createdAt
  );
  
  const novaSerie = await getSerieById(result.lastInsertRowId);
  return novaSerie!;
}

export async function updateSerie(id: number, input: UpdateSerieInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ? WHERE id = ?',
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.nota,
    id
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  const serie = await getSerieById(id);
  
  if (serie) {
    const novoStatus = serie.concluida === 0 ? 1 : 0;
    await db.runAsync('UPDATE series SET concluida = ? WHERE id = ?', novoStatus, id);
  }
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', id);
}