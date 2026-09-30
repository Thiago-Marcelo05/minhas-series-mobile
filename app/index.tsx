import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Serie, SerieFilter, SerieSort } from '../src/types/serie';
import * as SerieRepository from '../src/database/serieRepository';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<SerieSort>('recentes');
  const [estatisticas, setEstatisticas] = useState({ total: 0, concluidas: 0 });

  const carregarDados = useCallback(async () => {
    const dados = await SerieRepository.getSeries(filtro, busca, ordenacao);
    const stats = await SerieRepository.getEstatisticas();
    setSeries(dados);
    setEstatisticas(stats);
  }, [filtro, busca, ordenacao]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const renderFiltro = (valor: SerieFilter, label: string) => {
    const ativo = filtro === valor;
    return (
      <TouchableOpacity
        key={`${valor}-${ativo}`}
        className={`px-3.5 py-2 rounded-full border ${
          ativo ? 'bg-indigo-600 border-indigo-600 shadow-sm' : 'bg-slate-800 border-slate-700'
        }`}
        onPress={() => setFiltro(valor)}
      >
        <Text className={`font-semibold text-xs ${ativo ? 'text-white' : 'text-slate-300'}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      className="flex-1 bg-slate-950 px-4 pt-4"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }} 
    >
      {/* Cabeçalho / Estatísticas */}
      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3 shadow-md flex-row justify-around items-center">
        <View className="items-center">
          <Text className="text-slate-400 text-xs font-medium">Total</Text>
          <Text className="text-white font-bold text-lg">📺 {estatisticas.total}</Text>
        </View>
        <View className="h-8 w-[1px] bg-slate-800" />
        <View className="items-center">
          <Text className="text-slate-400 text-xs font-medium">Concluídas</Text>
          <Text className="text-emerald-400 font-bold text-lg">✅ {estatisticas.concluidas}</Text>
        </View>
      </View>

      {/* Barra de Busca */}
      <View className="mb-3">
        <TextInput
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white shadow-sm"
          placeholder="Pesquisar série por título..."
          placeholderTextColor="#64748B"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Filtros e Ordenação */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row gap-2">
          {renderFiltro('todas', 'Todas')}
          {renderFiltro('assistindo', 'Assistindo')}
          {renderFiltro('concluidas', 'Concluídas')}
        </View>

        <TouchableOpacity
          className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl"
          onPress={() => setOrdenacao(ordenacao === 'recentes' ? 'nota' : 'recentes')}
        >
          <Text className="text-xs font-semibold text-indigo-400">
            {ordenacao === 'recentes' ? '📅 Recentes' : '⭐ Nota'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Séries */}
      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const concluida = item.concluida === 1;
          return (
            <TouchableOpacity
              className={`p-4 rounded-2xl mb-3 border ${
                concluida
                  ? 'bg-emerald-950/30 border-emerald-800/50 shadow-sm' 
                  : 'bg-slate-900 border-slate-800 shadow-md'
              }`}
              onPress={() => router.push(`/detalhe?id=${item.id}`)}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className={`text-base font-bold flex-1 mr-2 ${concluida ? 'text-emerald-200 line-through opacity-90' : 'text-white'}`}>
                  {item.titulo}
                </Text>
                <Text className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">
                  {item.nota !== null ? `★ ${item.nota}` : 'Sem nota'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <Text className="text-indigo-400 text-xs font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    {item.plataforma}
                  </Text>
                  {concluida && (
                    <Text className="text-emerald-400 text-xs font-semibold bg-emerald-500/20 px-2.5 py-1 rounded-md">
                      ✓ Concluída
                    </Text>
                  )}
                </View>
                <Text className="text-slate-400 text-xs">
                  {item.temporadas} {item.temporadas === 1 ? 'temporada' : 'temporadas'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-slate-500 text-base">Nenhuma série encontrada.</Text>
          </View>
        }
      />

      {/* Botão de Nova Série */}
      <TouchableOpacity
        className="bg-indigo-600 p-4 rounded-2xl mt-2 items-center shadow-lg shadow-indigo-600/30"
        onPress={() => router.push('/form')}
      >
        <Text className="text-white font-bold text-base">+ Nova série</Text>
      </TouchableOpacity>
    </View>
  );
}