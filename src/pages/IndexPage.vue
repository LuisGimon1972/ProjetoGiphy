<template>
    <div class="layout-principal">
      <div class="painel-superior">
        <img :src="logo" alt="Logo" class="logo" />
        <label class="textonome">Master Giphy Sistemas</label>
        <div class="perfil">
        <label class="texto">Dev. Luis Manuel Gimón</label>
        <img :src="usuario" alt="Usuario" class="usuariodev" />
      </div>
    </div>

    <div class="layout-conteudo" style="display: flex; min-height: 80vh">
      <div class="painel-esquerdo">
          <q-item
             clickable
             v-ripple
            :active="menuAtivo === 'home'"
            active-class="menu-ativo"
            @click="() => { navegar('Home', true); carregarTrending(); menuAtivo='home'; }"
            >
            <q-item-section avatar>
            <q-icon name="home_filled" class="menu-icon" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

  <q-item
    clickable
    v-ripple
    :active="menuAtivo === 'favoritos'"
    active-class="menu-ativo"
    @click="() => { navegar('Favoritos'); menuAtivo='favoritos'; }"
  >
    <q-item-section avatar>
      <q-icon name="people" class="menu-icon" />
    </q-item-section>
    <q-item-section>GIFs Favoritos</q-item-section>
  </q-item>

  <q-item
    clickable
    v-ripple
    :active="menuAtivo === 'categorias'"
    active-class="menu-ativo"
    @click="() => { navegar('Categorias'); menuAtivo='categorias'; }"
  >
    <q-item-section avatar>
      <q-icon name="apps" class="menu-icon" />
    </q-item-section>
    <q-item-section>GIFs por Categorias</q-item-section>
  </q-item>

    <q-item
    clickable
    v-ripple
    :active="menuAtivo === 'configuracoes'"
    active-class="menu-ativo"
    @click="() => { navegar('Configurações'); menuAtivo='configuracoes'; }"
  >
    <q-item-section avatar>
      <q-icon name="settings" class="menu-icon" />
    </q-item-section>
    <q-item-section>Configurações</q-item-section>
  </q-item>

  <q-item
    clickable
    v-ripple
    :active="menuAtivo === 'sobre'"
    active-class="menu-ativo"
    @click="() => { navegar('Sobre'); menuAtivo='sobre'; }"
  >
    <q-item-section avatar>
      <q-icon name="info_outline" class="menu-icon" />
    </q-item-section>
    <q-item-section>Sobre o sistema</q-item-section>
  </q-item>


</div>

      <!-- Conteúdo sempre no modo normal -->
<div class="conteudo">
        <br />
        <div v-if="mostrarBusca">
          <div class="titulo flex items-center gap-3">
            <q-icon name="home_filled" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>            
          </div>
          <br />
          <label class="resultado">{{ resultado }}</label>
          
          
          <div class="q-mb-md flex items-center gap-2">
            <q-input
              v-model="termo"
              outlined
              dense
              placeholder="Encontre o GIF perfeito..."
              class="w-4/5"
              style="width: 400px"
              @keyup.enter="buscarGifs"
            />

            <q-btn flat round color="primary" icon="search" size="lg" @click="buscarGifs" />
          </div>

          <div v-if="historicoBuscas.length" style="margin-bottom: 15px">
            <label style="font-weight: bold; font-size: 20px; color:#0f172a">Histórico de pesquisas</label>
            <button
                @click="limparHistorico"
                class="botao-esquerda botao-danger">
                <span class="icone">🗑️</span>
                Limpar histórico
              </button>
            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px">
              <button
                v-for="termoHist in historicoBuscas"
                :key="termoHist"
                @click="buscarTermoHistorico(termoHist)"
                class="botao-categoria"
              >
                {{ termoHist }}
              </button>
            </div>
            
          </div>

      <div class="galeria-gifs">

  <div
    v-for="gif in gifs"
    :key="gif.id"
    class="gif-container"
  >
    <q-img
      :src="gif.images.fixed_height.url"
      :alt="gif.title"
      fit="cover"
      class="gif-imagem"
    >
      <!-- BOTÃO FAVORITO AQUI DENTRO -->
      <div class="absolute-top-right q-pa-xs">
        <q-btn
          round
          dense
          size="sm"
          color="dark"
          @click="toggleFavorito(gif)"
        >
          {{ isFavorito(gif.id) ? '⭐' : '⚡' }}
        </q-btn>
      </div>
    </q-img>
  </div>
</div>

        </div>

        <div v-else-if="titulo === 'Favoritos'">
          <div class="titulo flex items-center gap-3">
            <q-icon name="people" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>
          </div>
          <div v-if="favoritosList.length === 0" class="mensagem-vazia">
            Nenhum GIF favorito foi adicionado.
          </div>
          <div class="galeria-gifs">
            <template v-for="gif in favoritosList" :key="gif.id">
              <div class="gif-container">
                <img :src="gif.images.fixed_height.url" :alt="gif.title" class="gif-imagem" />
                <button @click="toggleFavorito(gif)" class="botao-favorito">⭐</button>
              </div>
            </template>
          </div>
        </div>

        <div v-else-if="titulo === 'Categorias'">
          <div class="titulo flex items-center gap-3">
            <q-icon name="apps" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>
          </div>
          <label class="resultado">{{ resultado }}</label>

          <div v-if="!categoriaSelecionada">
            <p class="voltar-categorias catego">Selecione uma categoria:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px">
              <button
                v-for="cat in categoriasList"
                :key="cat"
                @click="buscarPorCategoria(cat)"
                class="botao-categoria"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          <div v-else>
           <button @click="voltarParaCategorias" class="sobre voltar-categorias">
              ⇦ Voltar para categorias
          </button>
            <div class="galeria-gifs">
              <template v-for="gif in gifs" :key="gif.id">
                <div class="gif-container">
                  <img :src="gif.images.fixed_height.url" :alt="gif.title" class="gif-imagem" />
                  <button @click="toggleFavorito(gif)" class="botao-favorito">
                    {{ isFavorito(gif.id) ? '⭐' : '⚡' }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <div v-else-if="titulo === 'Configurações'">
  <div class="titulo flex items-center gap-3">
    <q-icon name="settings" size="32px" class="icone-titulo" />
    <span>{{ titulo }}</span>
  </div>

  <div class="q-mt-md q-gutter-md" style="max-width: 500px">

    <!-- Dark Mode -->
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-weight-bold">Modo Escuro</div>
          <div class="text-caption text-grey">
            Alternar entre tema claro e escuro
          </div>
        </div>

        <q-toggle v-model="modoEscuro" @update:model-value="alternarTema" />
      </q-card-section>
    </q-card>

    <!-- Limpar Favoritos -->
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-weight-bold">Favoritos</div>
          <div class="text-caption text-grey">
            Remover todos os GIFs favoritos
          </div>
        </div>

        <q-btn
          color="negative"
          flat
          icon="delete"
          label="Limpar"
          @click="limparFavoritos"
        />
      </q-card-section>
    </q-card>

    <!-- Limpar Histórico -->
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-weight-bold">Histórico de buscas</div>
          <div class="text-caption text-grey">
            Apagar todas as pesquisas realizadas
          </div>
        </div>

        <q-btn
          color="negative"
          flat
          icon="delete"
          label="Limpar"
          @click="limparHistorico"
        />
      </q-card-section>
    </q-card>

  </div>
</div>

        <div v-else-if="titulo === 'Sobre'">
          <div class="titulo flex items-center gap-3">
            <q-icon name="info_outline" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>
          </div>
          <p class="sobre" style="text-align: justify; padding-left: 10px; font-size: 16px">
            O <strong>Master Giphy Sistemas</strong> é uma aplicação web criada por
            <strong>Luis Manuel Gimón Silva</strong>, da <strong>SGBR Sistemas</strong>, pensada
            para quem gosta de se divertir explorando GIFs animados. A plataforma utiliza a API do
            GIPHY para permitir buscas rápidas, acesso aos GIFs em alta e a possibilidade de salvar
            seus favoritos para consultar sempre que quiser.
          </p>

          <p class="sobre" style="text-align: justify; padding-left: 10px; font-size: 16px">
            Desenvolvido com <strong>Vue 3</strong> e <strong>Quasar Framework 2</strong>, o sistema
            oferece uma navegação fluida e uma interface intuitiva. A organização das telas é feita
            com o <strong>Vue Router</strong>, enquanto o <strong>Pinia</strong>
            cuida do estado da aplicação, garantindo uma experiência consistente ao usuário.
          </p>

          <p class="sobre" style="text-align: justify; padding-left: 10px; font-size: 16px">
            As informações são obtidas por meio do <strong>Axios</strong>, responsável pelas
            requisições à API do GIPHY. Os GIFs favoritos ficam armazenados no próprio navegador,
            usando o <strong>LocalStorage</strong>, o que permite manter seus conteúdos salvos mesmo
            após sair da aplicação.
          </p>

          <p class="sobre" style="text-align: justify; padding-left: 10px; font-size: 16px">
            Mais do que um projeto, o Master Giphy Sistemas representa uma oportunidade de unir
            aprendizado, criatividade e tecnologia em uma experiência prática e agradável.
          </p>

          <div class="sobre" style="text-align: center; padding-left: 10px; font-size: 16px">
            Obrigado por utilizar o
            <span class="sobre text-blue-500 font-semibold">Master Giphy Sistemas</span>!<br />
            Atenciosamente,<br />
            <span class="sobre text-gray-700 font-semibold">Luis Manuel Gimón Silva</span><br />
            <span class="sobre text-sm text-gray-500">Desenvolvedor Frontend – SGBR Sistemas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import logo from 'src/assets/logo.png'
import usuario from 'src/assets/usuario.png'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const modoEscuro = ref($q.dark.isActive)

// =====================
// Interfaces TypeScript
// =====================
interface GifImage {
  url: string
}

interface GifImages {
  fixed_height: GifImage
}

export interface Gif {
  id: string
  title: string
  images: GifImages
}

interface GiphyResponse {
  data: Gif[]
}

// =====================
// Constantes
// =====================

// =====================
// Estado (Refs)
// =====================
const menuAtivo = ref<string | null>(null)
const titulo = ref<string>('Home')
const resultado = ref<string>('')
const termo = ref<string>('')

const gifs = ref<Gif[]>([])
const mostrarBusca = ref<boolean>(true)

const favoritosList = ref<Gif[]>([])
const categoriaSelecionada = ref<string>('')

const historicoBuscas = ref<string[]>([])

const categoriasList = ref<string[]>([
  // Pessoas & emoções
  'Pessoas',
  'Crianças',
  'Idosos',
  'Reações',
  'Engraçados',
  'Memes',
  'Fofos',
  'Surpresos',
  'Dançando',

  // Animais
  'Gatos',
  'Cachorros',

  // Cultura & entretenimento
  'Personagens',
  'Filmes',
  'Anime',
  'Música',
  'Jogos',
  'Futebol',
  'Esportes',

  // Datas & temas sociais
  'Aniversário',
  'Religião',
  'Política',
  'Regional',
  'Cultura',

  // Conhecimento & cotidiano
  'Educação',
  'Saúde',
  'Ciência',
  'Trabalho',

  // Tecnologia
  'Tecnologia',
  'Devs',

  //Veículos
  'Carros',
  'Motos',
  'Bicicletas',
])

// =====================
// Navegação / UI
// =====================
function navegar(tituloPagina: string, exibirBuscaAtiva = false): void {
  titulo.value = tituloPagina
  mostrarBusca.value = exibirBuscaAtiva
  resultado.value = ''
  gifs.value = []
  termo.value = ''
  categoriaSelecionada.value = ''
}

// =====================
// API / Busca de GIFs
// =====================
async function carregarTrending(): Promise<void> {
  const res = await axios.get<GiphyResponse>('https://api.giphy.com/v1/gifs/trending', {
    params: {
      api_key: apiKey,
      limit: 20,
    },
  })

  gifs.value = res.data.data
}

async function buscarGifs(): Promise<void> {
  resultado.value = termo.value ? `Resultado para: "${termo.value}"` : 'GIFs em Alta'

  if (!termo.value) {
    return carregarTrending()
  }

  adicionarAoHistorico(termo.value)

  const res = await axios.get<GiphyResponse>('https://api.giphy.com/v1/gifs/search', {
    params: {
      api_key: apiKey,
      q: termo.value,
      limit: 20,
    },
  })

  gifs.value = res.data.data
}

async function buscarPorCategoria(nome: string): Promise<void> {
  categoriaSelecionada.value = nome
  titulo.value = 'Categorias'
  mostrarBusca.value = false
  resultado.value = `GIFs da categoria: ${nome}`
   
  const res = await axios.get<GiphyResponse>('https://api.giphy.com/v1/gifs/search', {
    params: {
      api_key: apiKey,
      q: nome,
      limit: 20,
    },
  })

  gifs.value = res.data.data
}

// =====================
// Favoritos
// =====================
function isFavorito(id: string): boolean {
  return favoritosList.value.some((g) => g.id === id)
}

function toggleFavorito(gif: Gif): void {
  if (isFavorito(gif.id)) {
    favoritosList.value = favoritosList.value.filter((g) => g.id !== gif.id)
  } else {
    favoritosList.value.push(gif)
  }

  salvarFavoritos()
}

function salvarFavoritos(): void {
  localStorage.setItem('meusFavoritos', JSON.stringify(favoritosList.value))
}

function carregarFavoritos(): void {
  const salvos = localStorage.getItem('meusFavoritos')
  favoritosList.value = salvos ? (JSON.parse(salvos) as Gif[]) : []
}

// =====================
// Histórico de buscas
// =====================
function adicionarAoHistorico(termoBusca: string): void {
  if (!termoBusca) return

  historicoBuscas.value = historicoBuscas.value.filter((t) => t !== termoBusca)

  historicoBuscas.value.unshift(termoBusca)

  if (historicoBuscas.value.length > 15) {
    historicoBuscas.value.pop()
  }

  localStorage.setItem('historicoBuscas', JSON.stringify(historicoBuscas.value))
}

function carregarHistorico(): void {
  const salvos = localStorage.getItem('historicoBuscas')
  historicoBuscas.value = salvos ? (JSON.parse(salvos) as string[]) : []
}

function limparHistorico(): void {
  historicoBuscas.value = []
  localStorage.removeItem('historicoBuscas')
}

function buscarTermoHistorico(termoBusca: string): void {
  termo.value = termoBusca
  buscarGifs()
}

function voltarParaCategorias() {
  categoriaSelecionada.value = ''
  resultado.value = ''        // 🔥 apaga o resultado anterior
  gifs.value = []             // opcional: limpa os GIFs exibidos
}

function alternarTema(val: boolean) {
  $q.dark.set(val)      // ativa ou desativa dark mode
  modoEscuro.value = val
}


function limparFavoritos(): void {
  favoritosList.value = []
  localStorage.removeItem('meusFavoritos')

  $q.notify({
    message: 'Favoritos removidos com sucesso',
    color: 'positive',
    icon: 'check'
  })
}

const temaSalvo = localStorage.getItem('modoEscuro')
if (temaSalvo !== null) {
  modoEscuro.value = JSON.parse(temaSalvo)
  $q.dark.set(modoEscuro.value)
}

const apiKey: string = 'iiye8KLR1pbzIZpCkxeISNhu0GxViohh'

// =====================
// Carregar módulos
// =====================
onMounted((): void => {
  const temaSalvo = localStorage.getItem('modoEscuro')
  modoEscuro.value = temaSalvo ? JSON.parse(temaSalvo) : false
  $q.dark.set(modoEscuro.value)
  carregarFavoritos()
  carregarHistorico()
  navegar('Home', true)  
})
</script>
