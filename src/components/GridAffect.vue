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
          <td>{{ props.item.affectedtest.id }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ props.item.score }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click.stop="dialog = true">
              <v-icon color="gray">visibility</v-icon>
            </v-btn>
             <v-dialog v-model="dialog" max-width="800px">
              <v-card>
                 <v-layout row align-center class="pr-2" v-for="(answer, index) in props.item.answers">
                  <v-card-text>
                    Question {{index+1}} : 
                      <v-flex>
                        question
                      </v-flex>
                  </v-card-text>
                  <v-card-text>
                    Answer : {{answer.desc}}
                  </v-card-text>
                  <v-icon color="green" v-if="answer.istrue">done</v-icon>
                  <v-icon color="red" v-if="!answer.istrue">clear</v-icon>
                 </v-layout>
                <v-card-actions>
                  <v-btn color="primary" flat @click.stop="dialog2=false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
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
      dialog: false,
      search: '',
      headers: [
        {
          text: 'id test',
          align: 'left',
          sortable: false,
          value: ''
        },
        { text: 'Candidate Email', value: '', align: 'left'},
        { text: 'Candidate Score', value: '', align: 'left'}
      ],
      items: []
    }
  },
  mounted() {
      Api.customApi("get", "/candidates").then(response => {
      this.items = response.data.data;
    });
  }
}

</script>
