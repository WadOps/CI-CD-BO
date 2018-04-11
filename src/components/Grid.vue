<template>
  <v-app id="inspire">
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
          <td >{{ props.item.createdAt }}</td>
          <td >{{ props.item.difficulty }}</td>
          <td v-for="(tech, index) in props.item.techstack">{{ tech }}</td>
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
          text: 'id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Created at', value: 'createdAt', sortable: false, },
        { text: 'Difficulty', value: 'difficulty', sortable: false, },
        { text: 'Technology', value: 'techstack', sortable: false, }
      ],
      items: []
    }
  },
  mounted() {
      Api.customApi("get", "/tests").then(response => {
      this.items = response.data.data;
    });
  }
}

</script>
