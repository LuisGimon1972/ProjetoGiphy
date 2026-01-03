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
      <div class="painel-esquerdo" style="width: 16%; padding: 25px">
        <q-item
          clickable
          v-ripple
          :active="menuAtivo === 'home'"
          active-class="menu-ativo"
          @click="
            () => {
              navegar('Home', true)
              carregarTrending()
              menuAtivo = 'home'
            }
          "
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
          @click="
            () => {
              navegar('Favoritos')
              menuAtivo = 'favoritos'
            }
          "
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
          @click="
            () => {
              navegar('Categorias')
              menuAtivo = 'categorias'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="apps" class="menu-icon" />
          </q-item-section>
          <q-item-section>GIFs por Categorias</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="menuAtivo === 'sobre'"
          active-class="menu-ativo"
          @click="
            () => {
              navegar('Sobre')
              menuAtivo = 'sobre'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="info_outline" class="menu-icon" />
          </q-item-section>
          <q-item-section>Sobre o sistema</q-item-section>
        </q-item>
      </div>

      <div class="conteudo" style="flex-grow: 1; padding: 20px">
        <br />
        <div v-if="mostrarBusca">
          <div class="titulo-superior flex items-center gap-3">
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

        <div v-else-if="titulo === 'Favoritos'">
          <div class="titulo-superior flex items-center gap-3">
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
          <div class="titulo-superior flex items-center gap-3">
            <q-icon name="apps" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>
          </div>
          <label class="resultado">{{ resultado }}</label>
          <div v-if="!categoriaSelecionada">
            <p class="voltar-categorias">Selecione uma categoria:</p>
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
           <button @click="voltarParaCategorias" class="voltar-categorias">
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

        <div v-else-if="titulo === 'Sobre'">
          <div class="titulo-superior flex items-center gap-3">
            <q-icon name="info_outline" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>
          </div>
          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            O <strong>Master Giphy Sistemas</strong> é uma aplicação web criada por
            <strong>Luis Manuel Gimón Silva</strong>, da <strong>SGBR Sistemas</strong>, pensada
            para quem gosta de se divertir explorando GIFs animados. A plataforma utiliza a API do
            GIPHY para permitir buscas rápidas, acesso aos GIFs em alta e a possibilidade de salvar
            seus favoritos para consultar sempre que quiser.
          </p>

          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            Desenvolvido com <strong>Vue 3</strong> e <strong>Quasar Framework 2</strong>, o sistema
            oferece uma navegação fluida e uma interface intuitiva. A organização das telas é feita
            com o <strong>Vue Router</strong>, enquanto o <strong>Pinia</strong>
            cuida do estado da aplicação, garantindo uma experiência consistente ao usuário.
          </p>

          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            As informações são obtidas por meio do <strong>Axios</strong>, responsável pelas
            requisições à API do GIPHY. Os GIFs favoritos ficam armazenados no próprio navegador,
            usando o <strong>LocalStorage</strong>, o que permite manter seus conteúdos salvos mesmo
            após sair da aplicação.
          </p>

          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            Mais do que um projeto, o Master Giphy Sistemas representa uma oportunidade de unir
            aprendizado, criatividade e tecnologia em uma experiência prática e agradável.
          </p>

          <div style="text-align: center; padding-left: 10px; font-size: 16px">
            Obrigado por utilizar o
            <span class="text-blue-500 font-semibold">Master Giphy Sistemas</span>!<br />
            Atenciosamente,<br />
            <span class="text-gray-700 font-semibold">Luis Manuel Gimón Silva</span><br />
            <span class="text-sm text-gray-500">Desenvolvedor Frontend – SGBR Sistemas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import logo from 'src/assets/logo.png'
import usuario from 'src/assets/usuario.png'

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
const apiKey: string = 'iiye8KLR1pbzIZpCkxeISNhu0GxViohh'

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


// =====================
// Lifecycle
// =====================
onMounted((): void => {
  carregarFavoritos()
  carregarHistorico()
  navegar('Home', true)
  carregarTrending()
})
</script>
