<template>
  <v-row>
      <v-col
        v-for="(data, index) in $store.state.quotes.paginatedQuotes"
        :key="index"
        cols="12"
        md="3"
      >
          <v-card
          @click="updateLive(data)"
          >
            <v-card-text class="quote-font font-weight-bold">
              {{data.en}}
            </v-card-text>
            <v-card-actions>
              <v-list-item>
                <v-rating
                  background-color="white"
                  dense
                  half-increments
                  readonly
                  size="12"
                  color="pink accent-4"
                  :value="data.rating"
              ></v-rating>
              </v-list-item>
            </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
</template>

<script>
export default {
  methods: {
    updateLive (data) {
      this.$store.dispatch('updateLiveQuote', data)
    }
  }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Muli');
    .quote-font {
      font-family: 'Muli',cursive;
    }
</style>
