import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Serie, SerieFilter } from '../src/types/serie';
import * as SerieRepository from '../src/database/serieRepository';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Calcula as margens físicas do ecrã
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  const carregarSeries = useCallback(async () => {
    const dados = await SerieRepository.getSeries(filtro);
    setSeries(dados);
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarSeries();
    }, [carregarSeries])
  );

const renderFiltro = (valor: SerieFilter, label: string) => {
    const ativo = filtro === valor;
    
    return (
      <TouchableOpacity
        // A propriedade key força o componente a ser recriado ao trocar de estado
        key={`${valor}-${ativo}`} 
        className={`px-4 py-2 rounded-full border ${
          ativo ? 'bg-blue-700 border-blue-700' : 'bg-white border-gray-300'
        }`}
        onPress={() => setFiltro(valor)}
      >
        <Text className={`font-bold ${ativo ? 'text-white' : 'text-gray-600'}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      className="flex-1 bg-gray-50 px-4 pt-4"
      // Adiciona o espaçamento inferior dinâmico baseado no telemóvel
      style={{ paddingBottom: Math.max(insets.bottom, 16) }} 
    >
      {/* Botões de Filtro */}
      <View className="flex-row justify-between mb-4">
        {renderFiltro('todas', 'Todas')}
        {renderFiltro('assistindo', 'Assistindo')}
        {renderFiltro('concluidas', 'Concluídas')}
      </View>

      {/* Lista de Séries */}
      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 rounded-xl mb-3 border border-gray-200 ${
              item.concluida === 1 ? 'bg-gray-200 opacity-70' : 'bg-white shadow-sm'
            }`}
            onPress={() => router.push(`/detalhe?id=${item.id}`)}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-gray-800 flex-1">
                {item.titulo}
              </Text>
              <Text className="text-sm font-bold text-yellow-500">
                {item.nota !== null ? `★ ${item.nota}` : 'Sem nota'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 font-medium">{item.plataforma}</Text>
              <Text className="text-gray-500 text-sm">
                {item.temporadas} {item.temporadas === 1 ? 'temporada' : 'temporadas'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10 text-base">
            Nenhuma série encontrada para este filtro.
          </Text>
        }
      />

      {/* Botão de Nova Série */}
      <TouchableOpacity
        className="bg-blue-700 p-4 rounded-xl mt-2 items-center"
        onPress={() => router.push('/form')}
      >
        <Text className="text-white font-bold text-lg">+ Nova série</Text>
      </TouchableOpacity>
    </View>
  );
}