<template>
  <div class="layout-principal">
    <!-- CABEÇALHO -->
    <div class="painel-superior">
      <img :src="logo" alt="Logo" class="logo" />
      <label class="textonome">Master Giphy Sistemas</label>
      <div class="perfil">
        <label class="texto">Dev. Luis Manuel Gimón</label>
        <img :src="usuario" alt="Usuario" class="usuariodev" />
      </div>
    </div>

    <!-- CONTEÚDO -->
    <div class="layout-conteudo" style="display: flex; min-height: 80vh">
      <!-- MENU LATERAL -->
      <div class="painel-esquerdo" style="width: 16%; padding: 25px">
        <q-item
          clickable
          v-ripple
          :active="menuAtivo === 'home'"
          active-class="menu-ativo"
          @click="
            () => {
              exibirBusca()
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
              favoritos()
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
              categorias()
              menuAtivo = 'categorias'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="apps" class="menu-icon" />
          </q-item-section>
          <q-item-section>Categorias</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="menuAtivo === 'sobre'"
          active-class="menu-ativo"
          @click="
            () => {
              sobre()
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

      <!-- CONTEÚDO PRINCIPAL -->
      <div class="conteudo" style="flex-grow: 1; padding: 20px">
        <label class="titulo-superior">{{ titulo }}</label
        ><br /><br />
        <label class="resultado">{{ resultado }}</label>

        <!-- HOME / BUSCA -->
        <div v-if="mostrarBusca">
          <div style="margin-bottom: 20px">
            <input
              v-model="termo"
              @keyup.enter="buscarGifs"
              placeholder="Pesquisar GIFs..."
              style="padding: 8px; width: 100%; max-width: 400px; font-size: 16px"
            />
            <button
              @click="buscarGifs"
              style="
                margin-left: 10px;
                padding: 8px 12px;
                font-size: 16px;
                background-color: rgb(128, 150, 229);
              "
            >
              🔍
            </button>
          </div>

          <!-- Histórico de buscas -->
          <div v-if="historicoBuscas.length" style="margin-bottom: 15px">
            <label style="font-weight: bold">Histórico de pesquisas:</label>
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
            <div style="margin-top: 10px">
              <button
                @click="limparHistorico"
                class="botao-esquerda"
                style="
                  padding: 4px 8px;
                  font-size: 14px;
                  background-color: rgb(200, 60, 60);
                  color: white;
                "
              >
                🗑️ Limpar histórico
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

        <!-- FAVORITOS -->
        <div v-else-if="titulo === 'Favoritos'">
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

        <!-- CATEGORIAS -->
        <div v-else-if="titulo === 'Categorias'">
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
            <button @click="categoriaSelecionada = ''" class="voltar-categorias">
              ⇦ Retornar às categorias
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

        <!-- SOBRE -->
        <div v-else-if="titulo === 'Sobre'">
          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            SG Master GIFs Versão 1.00 é um aplicativo web desenvolvido pelo Dev. Luis Manuel Gimón
            Silva, da SGBR Sistemas, com o objetivo de criar uma experiência simples e agradável
            para quem gosta de buscar e salvar GIFs animados. Utilizando a API do GIPHY, o app
            permite que você explore os GIFs mais populares do momento, faça buscas por qualquer
            tema e ainda salve seus favoritos para acessar quando quiser.
          </p>
          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            A aplicação foi construída utilizando tecnologias modernas de desenvolvimento web, como
            o framework Quasar 2 e Vue 3 com a Composition API (script setup), para garantir uma
            interface reativa, rápida e intuitiva. O Vue-router foi usado para gerenciar as
            diferentes telas, enquanto o Pinia gerencia o estado da aplicação, mantendo seus
            favoritos organizados.
          </p>
          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            Para consumir os dados, utilizamos o Axios para fazer requisições à API do GIPHY, e os
            favoritos são salvos localmente no navegador usando o LocalStorage através de um plugin
            do Quasar, garantindo que seus GIFs preferidos estejam sempre disponíveis, mesmo após
            fechar o navegador.
          </p>
          <p style="text-align: justify; padding-left: 10px; font-size: 16px">
            Espero que este projeto proporcione uma experiência divertida e útil para você, assim
            como foi uma ótima oportunidade para mim aplicar e expandir meus conhecimentos em
            desenvolvimento web.
          </p>
          <div style="text-align: center; padding-left: 10px; font-size: 16px">
            Muito obrigado por usar o
            <span class="text-blue-500 font-semibold">SG Master GIFs</span>!<br />
            Com carinho e dedicação,<br />
            <span class="text-gray-700 font-semibold">Luis Manuel Gimón Silva</span><br />
            <span class="text-sm text-gray-500">Desenvolvedor Front-end – SGBR Sistemas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logo from 'src/assets/logo.png'
import usuario from 'src/assets/usuario.png'
import { ref, onMounted } from 'vue'
import axios from 'axios'
const menuAtivo = ref(null)
const titulo = ref('Home')
const resultado = ref('')
const termo = ref('')
const gifs = ref([])
const mostrarBusca = ref(true)
const favoritosList = ref([])
const categoriaSelecionada = ref('')
const categoriasList = ref([
  'Pessoas',
  'Personagens',
  'Crianças',
  'Idosos',
  'Aniversário',
  'Engraçados',
  'Gatos',
  'Cachorros',
  'Memes',
  'Reações',
  'Futebol',
  'Filmes',
  'Anime',
  'Música',
  'Jogos',
  'Saúde',
  'Educação',
  'Religião',
  'Política',
  'Regional',
  'Ciência',
  'Cultura',
  'Tecnologia',
  'Trabalho',
  'Devs',
  'Fofos',
  'Surpresos',
  'Dançando',
])

// Histórico de buscas
const historicoBuscas = ref([])

// Navegação entre seções
function navegar(tituloPagina, exibirBuscaAtiva = false) {
  titulo.value = tituloPagina
  mostrarBusca.value = exibirBuscaAtiva
  resultado.value = ''
  gifs.value = []
  termo.value = ''
  categoriaSelecionada.value = ''
}

// Botões do menu
function exibirBusca() {
  navegar('Home', true)
  carregarTrending()
}

function favoritos() {
  navegar('Favoritos')
}

function categorias() {
  navegar('Categorias')
}

function sobre() {
  navegar('Sobre')
}

const apiKey = 'iiye8KLR1pbzIZpCkxeISNhu0GxViohh'

// Carregamento de dados
async function carregarTrending() {
  const res = await axios.get(`https://api.giphy.com/v1/gifs/trending`, {
    params: { api_key: apiKey, limit: 20 },
  })
  gifs.value = res.data.data
}

async function buscarGifs() {
  resultado.value = termo.value ? `Resultado para: "${termo.value}"` : 'GIFs em Alta'
  if (!termo.value) return carregarTrending()

  adicionarAoHistorico(termo.value)

  const res = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
    params: { api_key: apiKey, q: termo.value, limit: 20 },
  })
  gifs.value = res.data.data
}

async function buscarPorCategoria(nome) {
  categoriaSelecionada.value = nome
  resultado.value = `GIFs da categoria: "${nome}"`
  titulo.value = 'Categorias'
  mostrarBusca.value = false
  const res = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
    params: { api_key: apiKey, q: nome, limit: 20 },
  })
  gifs.value = res.data.data
}

// Favoritos
function isFavorito(id) {
  return favoritosList.value.some((g) => g.id === id)
}

function toggleFavorito(gif) {
  if (isFavorito(gif.id)) {
    favoritosList.value = favoritosList.value.filter((g) => g.id !== gif.id)
  } else {
    favoritosList.value.push(gif)
  }
  salvarFavoritos()
}

function salvarFavoritos() {
  localStorage.setItem('meusFavoritos', JSON.stringify(favoritosList.value))
}

function carregarFavoritos() {
  const salvos = localStorage.getItem('meusFavoritos')
  favoritosList.value = salvos ? JSON.parse(salvos) : []
}

// Histórico de buscas com localStorage
function adicionarAoHistorico(termoBusca) {
  if (!termoBusca) return
  historicoBuscas.value = historicoBuscas.value.filter((t) => t !== termoBusca)
  historicoBuscas.value.unshift(termoBusca)
  if (historicoBuscas.value.length > 15) historicoBuscas.value.pop()
  localStorage.setItem('historicoBuscas', JSON.stringify(historicoBuscas.value))
}

function carregarHistorico() {
  const salvos = localStorage.getItem('historicoBuscas')
  historicoBuscas.value = salvos ? JSON.parse(salvos) : []
}

function limparHistorico() {
  historicoBuscas.value = []
  localStorage.removeItem('historicoBuscas')
}

function buscarTermoHistorico(termoBusca) {
  termo.value = termoBusca
  buscarGifs()
}

onMounted(() => {
  carregarFavoritos()
  carregarHistorico()
  exibirBusca()
})
</script>
