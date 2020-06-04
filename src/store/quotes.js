import axios from 'axios'
import store from './store'
import stringSimilarity from 'string-similarity'

const state = {
  images: [
    'https://images.unsplash.com/photo-1480506132288-68f7705954bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=2593&q=80',
    'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80',
    'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80',
    'https://images.unsplash.com/photo-1477244075012-5cc28286e465?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
    'https://images.unsplash.com/29/night-square.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2559&q=80'],
  liveImage: '',
  allQuotes: [],
  allStringQuotes: [],
  liveQuote: null,
  paginatedQuotes: [],
  pageQuoteCount: 20,
  bestMatchVote: 4,
  leastMatchVote: 1
}

const getters = {}

const mutations = {
  setAllQuotes (state, quotes) {
    state.allQuotes = quotes
    quotes.forEach(function (data) {
      state.allStringQuotes.push(data.en)
    })
  },
  setPaginatedQuotes (state, quotes) {
    state.paginatedQuotes = quotes
  },
  setLiveQuote (state, quote) {
    state.liveQuote = quote
    state.liveImage = state.images[Math.floor(Math.random() * state.images.length)]
  }
}

const actions = {
  getAllQuotes ({ commit }) {
    axios.get(store.state.endpoints.baseUrl + '/quotes')
      .then(response => {
        commit('setAllQuotes', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  updateLiveQuote ({ commit }, quote) {
    commit('setLiveQuote', quote)
    window.scrollTo(0, 0)
  },
  getPaginatedQuotes ({ commit }, page) {
    axios.get(store.state.endpoints.baseUrl + '/quotes/page/' + page)
      .then(response => {
        commit('setPaginatedQuotes', response.data)
        commit('setLiveQuote', response.data[Math.floor(Math.random() * response.data.length)])
      })
      .catch(error => {
        console.log(error)
      })
  },
  postQuoteNewVote ({ commit }, data) {
    axios.post(store.state.endpoints.baseUrl + '/quotes/vote', JSON.stringify(data))
      .then(response => {
        state.allStringQuotes.splice(state.allStringQuotes.indexOf(state.liveQuote.en), 1)
        const similarity = stringSimilarity.findBestMatch(state.liveQuote.en, state.allStringQuotes)
        if (data.newVote >= state.bestMatchVote) {
          /* set live quote to best matched quote */
          commit('setLiveQuote', state.allQuotes[state.allQuotes.findIndex(element => element.en === similarity.bestMatch.target)])
        } else if (data.newVote <= state.leastMatchVote) {
          let leastRating = 1
          let leastRatingIndex = 0
          similarity.ratings.forEach(function (item, index) {
            if (leastRating >= similarity.ratings[index].rating) {
              leastRating = similarity.ratings[index].rating
              leastRatingIndex = index
            }
          })
          /* set live quote to least matched quote */
          commit('setLiveQuote', state.allQuotes[state.allQuotes.findIndex(element => element.en === similarity.ratings[leastRatingIndex].target)])
        } else {
          /* set live quote to random quote */
          commit('setLiveQuote', state.allQuotes[Math.floor(Math.random() * state.allQuotes.length)])
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
