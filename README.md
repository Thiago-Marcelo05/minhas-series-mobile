# Minhas Séries - Aplicativo Mobile

Aplicativo desenvolvido para o gerenciamento de séries acompanhadas, permitindo registar, listar, filtrar, editar, eliminar, atribuir notas e controlar o status de conclusão, utilizando **Expo**, **Expo Router**, **SQLite** e **NativeWind v4** (Tailwind CSS).

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente:

1. **Pré-requisitos:** 
Certifique-se de ter o Node.js e o Expo Go (ou um emulador configurado) instalados no seu computador e telemóvel.

Node.js (versão 22.13 ou superior)
# Verifique se já está instalado:
node --version   # deve mostrar v22.13.x ou superior
npm --version    # deve mostrar 10.x.x ou superior
Se não tiver, baixe em: https://nodejs.org (instale a versão LTS)

Expo CLI (instalação global)
npm install -g expo-cli

Expo Go no seu celular
Instale o app Expo Go pela loja do seu dispositivo

2. **Instalar as dependências:**
   ```bash
   npm install

   1 - Iniciar a aplicação:
   bash
   npx expo start -c

   2 - Abrir no dispositivo: Leia o QR code apresentado no terminal utilizando o aplicativo Expo Go no seu smartphone ou inicie um emulador Android/iOS.

💾 Teste de Persistência (SQLite)
O aplicativo utiliza a biblioteca expo-sqlite para garantir o armazenamento local e persistente dos dados.

Procedimento de Teste Realizado:

1. O aplicativo foi iniciado e foram cadastradas três novas séries ("Breaking Bad", "Supernatural" e "Dexter") com respetivas plataformas, temporadas e notas.

2. A aplicação foi totalmente fechada (encerrada a sessão do Expo Go / removida dos aplicativos recentes no telemóvel).

3. O aplicativo foi reaberto através do Expo Go.

Resultado: As séries cadastradas mantiveram-se intactas na lista, com os seus respetivos estados de conclusão e notas guardados corretamente, confirmando o sucesso da persistência com SQLite.

<img width="774" height="1600" alt="WhatsApp Image 2026-09-30 at 19 34 48" src="https://github.com/user-attachments/assets/76688d57-dee5-4112-b67e-f66ff997643b" />
<img width="774" height="1600" alt="WhatsApp Image 2026-09-30 at 19 34 48 (2)" src="https://github.com/user-attachments/assets/7e4770a3-9c86-40ef-9a8e-51714d9f5571" />
<img width="778" height="1600" alt="WhatsApp Image 2026-09-30 at 19 34 48 (1)" src="https://github.com/user-attachments/assets/6608e325-314e-476c-9f08-6051defc73ed" />


### 🎥 Vídeo Demonstrativo
Podes assistir à demonstração completa do teste de persistência no link abaixo:
* **[Assistir no YouTube](https://youtube.com/shorts/IYTG2WbPw6w?is=UKa3qz2C4lVD4xSW)**

🤖 Diário do Copiloto
Registo das interações, tomadas de decisão e ajustes efetuados com o auxílio da inteligência artificial durante o desenvolvimento do projeto:

Registro 1 - Estrutura Inicial e Rotas:

Interação: Solicitei diretrizes sobre a estruturação inicial das pastas utilizando o Expo Router (app/_layout.tsx e app/index.tsx).

Decisão: A IA sugeriu uma organização modular. Adotei a estrutura de rotas baseada em ficheiros do Expo Router e o layout com NativeWind v4 para estilização rápida.

Registro 2 - Configuração da Base de Dados SQLite:

Interação: Dúvida sobre como implementar o padrão assíncrono para abrir a base de dados (expo-sqlite) sem bloquear a thread principal.

Decisão: Implementámos o padrão Singleton assíncrono (getDatabase) para garantir que a conexão é aberta uma única vez e reutilizada em todas as operações do repositório.

Registro 3 - Resolução de Conflito de Esquema (Correção/Recusa):

Interação: A IA sugeriu inicialmente manter uma coluna createdAt NOT NULL nas migrações da tabela.

Ajuste/Recusa: Notei que isso gerava erros de restrição de nulidade (NOT NULL constraint failed) ao inserir dados sem enviar o timestamp. Rejeitei a abordagem de manter o campo obsoleto e ajustámos o esquema da tabela para remover o createdAt, focando apenas nos campos obrigatórios exigidos pela rubrica.

Registro 4 - Implementação do "Para ir além" (Busca e Ordenação):

Interação: Solicitei a implementação de funcionalidades extras para ir além da rubrica básica.

Decisão: Adicionamos filtragem por texto com instrução SQL LIKE ?, contadores dinâmicos com COUNT e ordenação por nota ou data de registo, melhorando significativamente a utilidade da aplicação.

Registro 5 - Refinamento Visual (Dark Mode e Estados):





Interação: O design inicial encontrava-se muito simples com fundo branco genérico.

Decisão: Solicitámos e aplicámos um tema escuro (Dark Mode profissional inspirado em plataformas de streaming), incluindo cartões com destaques visuais em tons de verde e indicador de séries concluídas para melhorar a experiência do utilizador.
