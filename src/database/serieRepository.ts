import { getDatabase } from './database';
import { Serie, CreateSerieInput, UpdateSerieInput, SerieFilter, SerieSort } from '../types/serie';

export async function getSeries(
  filtro: SerieFilter, 
  busca: string = '', 
  ordenacao: SerieSort = 'recentes'
): Promise<Serie[]> {
  const db = await getDatabase();
  
  let query = 'SELECT * FROM series WHERE 1=1';
  const params: any[] = [];

  if (filtro === 'assistindo') {
    query += ' AND concluida = 0';
  } else if (filtro === 'concluidas') {
    query += ' AND concluida = 1';
  }

  if (busca.trim() !== '') {
    query += ' AND titulo LIKE ?';
    params.push(`%${busca.trim()}%`);
  }

  if (ordenacao === 'nota') {
    query += ' ORDER BY nota DESC NULLS LAST, id DESC';
  } else {
    query += ' ORDER BY id DESC';
  }

  const result = await db.getAllAsync<Serie>(query, params);
  return result;
}

export async function getEstatisticas(): Promise<{ total: number; concluidas: number }> {
  const db = await getDatabase();
  const totalResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM series');
  const concluidasResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM series WHERE concluida = 1');

  return {
    total: totalResult?.count || 0,
    concluidas: concluidasResult?.count || 0,
  };
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Serie>('SELECT * FROM series WHERE id = ?', [id]);
  return result || null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, nota, concluida) VALUES (?, ?, ?, ?, 0)',
    [input.titulo, input.plataforma, input.temporadas, input.nota ?? null]
  );
  
  const insertId = Number(result.lastInsertRowId);
  const novaSerie = await getSerieById(insertId);
  if (!novaSerie) throw new Error('Erro ao criar série');
  return novaSerie;
}

export async function updateSerie(id: number, input: UpdateSerieInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ? WHERE id = ?',
    [input.titulo!, input.plataforma!, input.temporadas!, input.nota ?? null, id]
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  const serie = await getSerieById(id);
  if (!serie) return;

  const novoStatus = serie.concluida === 1 ? 0 : 1;
  await db.runAsync('UPDATE series SET concluida = ? WHERE id = ?', [novoStatus, id]);
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', [id]);
}