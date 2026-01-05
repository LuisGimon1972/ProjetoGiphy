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
          :active="menuAtivo === 'configuracoes'"
          active-class="menu-ativo"
          @click="
            () => {
              navegar('Configurações')
              menuAtivo = 'configuracoes'
            }
          "
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
            <label class="historicopes">Histórico de pesquisas</label>
            <q-btn
              color="negative"
              icon="delete"
              label="Limpar histórico"
              flat
              class="btn-historico-suave"
              @click="limparHistorico"
            />

            <div class="historico">
              <q-btn
                v-for="termoHist in historicoBuscas"
                :key="termoHist"
                @click="buscarTermoHistorico(termoHist)"
                :label="termoHist"
                color="primary"
                unelevated
                rounded
                class="btn-historico-termo"
              />
            </div>
          </div>

          <div class="galeria-gifs">
            <div v-for="gif in gifs" :key="gif.id" class="gif-container">
              <q-img
                :src="gif.images.fixed_height.url"
                :alt="gif.title"
                fit="cover"
                class="gif-imagem"
              >
                <div class="absolute-top-right q-pa-xs">
                  <q-btn round dense size="sm" color="dark" @click="toggleFavorito(gif)">
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
            {{ avisofavoritos() }}
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
              <q-btn
                v-for="cat in categoriasList"
                :key="cat"
                @click="buscarPorCategoria(cat)"
                :label="cat"
                :color="$q.dark.isActive ? 'dark' : 'primary'"
                unelevated
                dense
                class="botao-categoria ripple-suave"
                v-ripple
              />
            </div>
          </div>
          <div v-else>
            <q-btn
              flat
              icon="arrow_back"
              label="Voltar para categorias"
              color="primary"
              class="btn-voltar-categorias"
              @click="voltarParaCategorias"
            />
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
            <q-card>
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-weight-bold">Modo Escuro</div>
                  <div class="text-caption text-grey">Alternar entre tema claro e escuro</div>
                </div>
                <q-toggle v-model="modoEscuro" @update:model-value="alternarTema" />
              </q-card-section>
            </q-card>

            <!-- Limpar Favoritos -->
            <q-card>
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-weight-bold">Favoritos</div>
                  <div class="text-caption text-grey">Remover todos os GIFs favoritos</div>
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
                  <div class="text-caption text-grey">Apagar todas as pesquisas realizadas</div>
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

        <div v-else-if="titulo === 'Sobre'" class="justificar">
          <div class="titulo flex items-center gap-3">
            <q-icon name="info_outline" size="32px" class="icone-titulo" />
            <span>{{ titulo }}</span>
          </div>
          <p class="sobre alinhar">
            O <strong>Master Giphy Sistemas</strong> é uma aplicação web desenvolvida por
            <strong>Luis Manuel Gimón Silva</strong>, da <strong>SGBR Sistemas</strong>, criada para
            quem deseja explorar GIFs animados de forma rápida, organizada e intuitiva. A plataforma
            utiliza a API oficial do <strong>GIPHY</strong>, permitindo buscas eficientes, acesso
            aos GIFs em alta e a possibilidade de salvar conteúdos favoritos para consultas futuras.
          </p>
          <p class="sobre alinhar">
            Desenvolvido com <strong>Vue 3</strong> e <strong>Quasar Framework 2</strong>, o sistema
            oferece uma navegação fluida, layout moderno e excelente experiência do usuário. A
            aplicação adota uma arquitetura organizada, utilizando o
            <strong>Vue Router</strong> para navegação entre módulos,
            <strong>TypeScript</strong> para garantir maior segurança, legibilidade e manutenção do
            código, e o <strong>Tailwind CSS</strong> para ajustes visuais rápidos, padronização de
            estilos e maior flexibilidade na personalização da interface.
          </p>

          <p class="sobre alinhar">
            As funcionalidades de configuração permitem ao usuário personalizar a experiência,
            incluindo a alternância entre <strong>modo claro e modo escuro</strong>, com
            persistência automática das preferências por meio do <strong>LocalStorage</strong>. O
            sistema também oferece opções para gerenciamento de dados locais, como limpeza do
            histórico de buscas e dos GIFs favoritos, proporcionando maior controle e praticidade.
          </p>

          <p class="sobre alinhar">
            As requisições à API são realizadas com <strong>Axios</strong>, garantindo comunicação
            eficiente e confiável. Os dados do usuário, como favoritos, histórico de pesquisas e
            preferências de tema, permanecem salvos no navegador, assegurando continuidade da
            experiência mesmo após o encerramento da aplicação.
          </p>

          <p class="sobre alinhar">
            Mais do que um simples projeto, o <strong>Master Giphy Sistemas</strong> representa a
            aplicação prática de boas práticas de desenvolvimento frontend, unindo aprendizado,
            organização, desempenho e uma interface agradável em um sistema funcional e evolutivo.
          </p>

          <div class="sobre alinharcentro">
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
import axios from 'axios'
import logo from 'src/assets/logo.png'
import usuario from 'src/assets/usuario.png'
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { Dialog } from 'quasar'
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
// Estado (Refs) e constantes
// =====================
const apiKey: string = 'iiye8KLR1pbzIZpCkxeISNhu0GxViohh'
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
  termo.value = ''
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
  if (historicoBuscas.value.length > 0) {
    historicoBuscas.value = []
    localStorage.removeItem('historicoBuscas')
    $q.notify({
      type: 'positive',
      message: 'Histórico removido com sucesso',
      icon: 'check',
    })
  }
}

function buscarTermoHistorico(termoBusca: string): void {
  termo.value = termoBusca
  buscarGifs()
}

function voltarParaCategorias() {
  categoriaSelecionada.value = ''
  resultado.value = ''
  gifs.value = []
}

function alternarTema(val: boolean) {
  $q.dark.set(val) // ativa ou desativa dark mode
  modoEscuro.value = val
}

function limparFavoritos(): void {
  if (favoritosList.value.length > 0) {
    favoritosList.value = []
    localStorage.removeItem('meusFavoritos')
    $q.notify({
      message: 'Favoritos removidos com sucesso',
      color: 'positive',
      icon: 'check',
    })
  }
}

function avisofavoritos() {
  $q.notify({
    message: 'Nenhum GIF favorito foi adicionado.',
    color: 'positive',
    icon: 'check',
  })
}

const temaSalvo = localStorage.getItem('modoEscuro')
if (temaSalvo !== null) {
  modoEscuro.value = JSON.parse(temaSalvo)
  $q.dark.set(modoEscuro.value)
}

function bemvinda() {
  const dlg = Dialog.create({
    message: `
    <div class="column items-center" style="padding: 0; margin: 0;">
      <i class="material-icons" style="font-size:28px; color:#1976d2;">waving_hand</i>
      </i>
      <div class="text-body2">Bem-vindo ao Master Giphy Sistemas!</div>
    </div>
  `,
    html: true,
    class: 'q-pa-sm text-center',
    ok: false,
    cancel: false,
  })
  setTimeout(() => {
    dlg.hide()
  }, 1500)
}

//Restaura a configuração do tema salva
watch(modoEscuro, (valor) => {
  $q.dark.set(valor)
  localStorage.setItem('modoEscuro', JSON.stringify(valor))
})

onMounted((): void => {
  //Salva Configuração do tema
  const temaSalvo = localStorage.getItem('modoEscuro')

  if (temaSalvo !== null) {
    modoEscuro.value = JSON.parse(temaSalvo)
    $q.dark.set(modoEscuro.value)
  } else {
    modoEscuro.value = false
    $q.dark.set(false)
  }
  // =====================
  // Carregar módulos
  // =====================
  bemvinda()
  carregarFavoritos()
  carregarHistorico()
  navegar('Home', true)
})
</script>
