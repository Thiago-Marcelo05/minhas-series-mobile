import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const isEditing = !!id;

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);

  useEffect(() => {
    if (isEditing) {
      carregarSerie();
    }
  }, [id]);

  async function carregarSerie() {
    const serie = await SerieRepository.getSerieById(Number(id));
    if (serie) {
      setTitulo(serie.titulo);
      setPlataforma(serie.plataforma);
      setTemporadas(String(serie.temporadas));
      setNota(serie.nota);
    }
  }

  async function salvar() {
    // Validação de campos em branco
    if (!titulo.trim() || !plataforma.trim()) {
      Alert.alert('Atenção', 'Título e plataforma são obrigatórios.');
      return;
    }

    const qtdTemporadas = parseInt(temporadas, 10);
    if (isNaN(qtdTemporadas) || qtdTemporadas < 0) {
      Alert.alert('Atenção', 'O número de temporadas precisa ser igual ou maior que 0.');
      return;
    }

    const input = {
      titulo: titulo.trim(),
      plataforma: plataforma.trim(),
      temporadas: qtdTemporadas,
      nota,
    };

    if (isEditing) {
      await SerieRepository.updateSerie(Number(id), input);
    } else {
      await SerieRepository.createSerie(input);
    }

    // Retorna para a lista usando a pilha de navegação
    router.back();
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1"
    >
      <ScrollView contentContainerClassName="p-4" keyboardShouldPersistTaps="handled">
        
        <View className="mb-4">
          <Text className="text-gray-700 font-bold mb-1 ml-1">Título da Série</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="Ex: Breaking Bad"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-bold mb-1 ml-1">Plataforma</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="Ex: Netflix, Max"
            value={plataforma}
            onChangeText={setPlataforma}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-bold mb-1 ml-1">Temporadas Assistidas</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="Ex: 3"
            value={temporadas}
            onChangeText={setTemporadas}
            keyboardType="numeric"
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-700 font-bold mb-2 ml-1">Nota (Opcional)</Text>
          <View className="flex-row gap-3 items-center">
            {[1, 2, 3, 4, 5].map((valor) => {
              const selecionada = nota !== null && valor <= nota;
              return (
                <TouchableOpacity
                  key={valor}
                  onPress={() => setNota(nota === valor ? null : valor)}
                  className="w-12 h-12 items-center justify-center rounded-full border bg-white border-gray-300"
                >
                  <Ionicons 
                    name={selecionada ? "star" : "star-outline"} 
                    size={26} 
                    color={selecionada ? "#EAB308" : "#9CA3AF"} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-700 rounded-xl py-4 items-center"
          onPress={salvar}
        >
          <Text className="text-white font-bold text-lg">
            {isEditing ? 'Atualizar Série' : 'Salvar Nova Série'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}