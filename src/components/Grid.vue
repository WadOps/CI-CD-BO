<template>
    <v-card>
      <v-card-title>
        Tests
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td >{{ momentit(props.item.createdAt) }}</td>
          <td >{{ props.item.difficulty }}</td>
          <td ><v-chip v-for="(tech, index) in props.item.techstack">{{ tech }}</v-chip></td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
      <v-snackbar
            :timeout=6000
            :top=true
            v-model="showerror"
            >
            {{ error }}
            <v-btn flat color="error" @click.native="showerror = false">Close</v-btn>
      </v-snackbar>
    </v-card>

</template>

<script>
import Api from "@/services/api";
import moment from "moment"
export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Created at', value: 'createdAt', sortable: false, },
        { text: 'Difficulty', value: 'difficulty', sortable: false, },
        { text: 'Technology', value: 'techstack', sortable: false, }
      ],
      items: [],
      error: '',
      showerror: false,
    }
  },
  mounted() {
      Api.customApi("get", "/tests").then(response => {
        if(response.data.success==true) {
            this.items = response.data.data;
        } else {
            this.showError(response.data.data)
        }
    })
  },
  methods: {
    momentit(time) {
      return moment(time).format('llll')
    },
    showError(err) {
        this.error=err
        this.showerror = true
    }
  }
}

</script>
