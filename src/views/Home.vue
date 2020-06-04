<template>
  <v-app>
    <v-app-bar
      app
      color="white"
      height="50"
    >
      <v-avatar
        class="mr-3"
        color="grey lighten-5"
        size="50"
      >
        <v-img
          contain
          max-height="50%"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        ></v-img>
      </v-avatar>

      <v-toolbar-title class="font-weight-light headline">
        Programming-Quotes
      </v-toolbar-title>
    </v-app-bar>
   <v-content>
    <section>
        <v-row no-gutters>
            <v-img
              :src="$store.state.quotes.liveImage" height="550px">
                  <v-fade-transition>
                    <v-overlay
                      absolute
                      opacity="0.8"
                    >
                    <v-container
                        fill-height
                        fluid
                        v-if="liveQuote"
                        style="height: 450px; width: 1200px"
                      >
                    <v-row
                      class="white--text mx-auto"
                    >
                      <v-col class="text-left">
                          <v-icon x-large>mdi-format-quote-open</v-icon>
                        </v-col>
                      <v-col
                        class="white--text text-center"
                        cols="12"
                        tag="h1"
                      >
                        <span
                          class="display-1 font-weight-bold"
                        >
                          {{liveQuote.en}}
                        </span>
                      </v-col>
                      <v-col class="text-right">
                          <v-icon x-large>mdi-format-quote-close</v-icon>
                        </v-col>
                    </v-row>
                  </v-container>
                      <v-row class="pa-2"></v-row>
                      <v-row>
                        <v-col class="d-inline-flex">
                          <v-btn
                            fab
                            depressed
                            small
                            color="pink darken-3"
                            ref="enableRatingRef"
                            @click="enableRating=!enableRating"
                            class="mr-2"
                          >
                            <v-icon>mdi-heart</v-icon>
                          </v-btn>
                            <v-rating
                            v-show="enableRating"
                            v-model="liveQuoteRating"
                            background-color="white"
                            color="yellow accent-4"
                            dense
                            hover
                            size="30"
                            @click.native="submitVote"
                          ></v-rating>
                        </v-col>
                      </v-row>
                  </v-overlay>
                </v-fade-transition>
            </v-img>
        </v-row>
      </section>
    <section>
        <v-container>
          <v-row>
            <v-col>
              <div class="text-center">
              <v-pagination
                v-model="liveQuotePage"
                color="teal darken-1"
                :length="paginationLength"
                circle
                light
                @click.native="updatePaginatedQuotes"
              ></v-pagination>
            </div>
            </v-col>
          </v-row>
          <app-paginated-quotes></app-paginated-quotes>
        </v-container>
      </section>
  </v-content>
  </v-app>
</template>
<script>
import PaginatedQuotes from '../components/PaginatedQuotes'
export default {
  name: 'Home',
  data () {
    return {
      enableRating: false,
      liveQuotePage: 1,
      liveQuoteRating: 0
    }
  },
  components: {
    AppPaginatedQuotes: PaginatedQuotes
  },
  beforeMount () {
    this.$store.dispatch('getAllQuotes')
    this.$store.dispatch('getPaginatedQuotes', this.liveQuotePage)
  },
  created () {
    window.addEventListener('click', this.closeRating)
  },
  beforeDestroy () {
    window.addEventListener('click', this.closeRating)
  },
  computed: {
    liveQuote () {
      return this.$store.state.quotes.liveQuote
    },
    paginationLength () {
      return Math.ceil(this.$store.state.quotes.allQuotes.length / this.$store.state.quotes.pageQuoteCount)
    }
  },
  methods: {
    updatePaginatedQuotes () {
      this.$store.dispatch('getPaginatedQuotes', this.liveQuotePage)
    },
    submitVote () {
      const data = {
        quoteId: this.liveQuote.id,
        newVote: this.liveQuoteRating
      }
      this.$store.dispatch('postQuoteNewVote', data)
      this.enableRating = false
      this.liveQuoteRating = 0
    },
    closeRating (event) {
      if (!this.$refs.enableRatingRef.$el.contains(event.target)) {
        this.enableRating = false
      }
    }
  }
}
</script>
