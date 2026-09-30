import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Serie } from '../src/types/serie';
import * as SerieRepository from '../src/database/serieRepository';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [serie, setSerie] = useState<Serie | null>(null);

  // Carrega os dados da série específica sempre que a tela ganha foco
  const carregarSerie = useCallback(async () => {
    if (!id) return;
    const dados = await SerieRepository.getSerieById(Number(id));
    setSerie(dados);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregarSerie();
    }, [carregarSerie])
  );

  async function handleToggleConcluida() {
    if (!serie) return;
    await SerieRepository.toggleSerieConcluida(serie.id);
    await carregarSerie(); // Atualiza o estado local para refletir a mudança na hora
  }

  async function handleExcluir() {
    if (!serie) return;

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente eliminar a série "${serie.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await SerieRepository.deleteSerie(serie.id);
            router.back(); // Volta para a lista após apagar
          },
        },
      ]
    );
  }

  if (!serie) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500 text-base">A carregar detalhes...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="flex-1 bg-gray-50 p-6 justify-between">
      <View>
        {/* Cabeçalho do Card de Detalhe */}
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="text-2xl font-bold text-gray-800 flex-1 mr-2">
              {serie.titulo}
            </Text>
            <View className={`px-3 py-1 rounded-full ${serie.concluida === 1 ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Text className={`font-bold text-xs ${serie.concluida === 1 ? 'text-green-700' : 'text-blue-700'}`}>
                {serie.concluida === 1 ? 'Concluída' : 'Assistindo'}
              </Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-500 font-medium">Plataforma</Text>
              <Text className="text-gray-800 font-bold">{serie.plataforma}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-500 font-medium">Temporadas Assistidas</Text>
              <Text className="text-gray-800 font-bold">{serie.temporadas}</Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500 font-medium">Nota Atribuída</Text>
              <Text className="font-bold text-yellow-500">
                {serie.nota !== null ? `★ ${serie.nota} / 5` : 'Sem nota'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      <View className="gap-3 mb-4">
        <TouchableOpacity
          className={`py-4 rounded-xl items-center ${
            serie.concluida === 1 ? 'bg-orange-500' : 'bg-green-600'
          }`}
          onPress={handleToggleConcluida}
        >
          <Text className="text-white font-bold text-base">
            {serie.concluida === 1 ? 'Marcar como Assistindo' : 'Marcar como Concluída'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center"
          onPress={() => router.push(`/form?id=${serie.id}`)}
        >
          <Text className="text-white font-bold text-base">Editar Série</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 py-4 rounded-xl items-center"
          onPress={handleExcluir}
        >
          <Text className="text-white font-bold text-base">Eliminar Série</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}