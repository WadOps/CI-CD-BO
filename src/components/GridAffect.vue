<template>
  <v-app id="inspire">
    <v-card>
      <v-card-title>
        Affected Tests
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
          <td>{{ props.item.test }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </v-app>

</template>

<script>
import Api from "@/services/api";
export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'id test',
          align: 'left',
          sortable: false,
          value: ''
        },
        { text: 'Candidate Email', value: '', align: 'left'}
      ],
      items: []
    }
  },
  mounted() {
      Api.customApi("get", "/candidates").then(response => {
      this.items = response.data.data;
      console.log(this.items)
    });
  }
}

</script>
