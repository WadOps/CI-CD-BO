<template>
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
          <td>{{ props.item.test.id }}</td>
          <td >{{ props.item.candidate.email }}</td>
          <td >{{ props.item.score }}</td>
          <!-- <td >{{ momentit(props.item.starttime) }}</td> -->
          <td >{{ momentit(props.item.createdAt) }}</td>
          <td >{{ momentit(props.item.updatedAt) }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click.stop="showanswers(props.item.qsts)">
              <v-icon color="gray">visibility</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" max-width="800px">
              <v-card>
                 <v-layout row align-center class="pr-2" v-for="(qst, index) in qstsAnswers">
                  <v-card-text>
                    Question {{index+1}} : 
                      <v-flex v-html="markit(qst[0].desc)">
                      </v-flex>
                  </v-card-text>
                  <v-card-text>
                    Answer : {{qst[1].desc}}
                  </v-card-text>
                  <v-icon color="green" v-if="qst[1].istrue">done</v-icon>
                  <v-icon color="red" v-if="!qst[1].istrue">clear</v-icon>
                 </v-layout>
                <v-card-actions>
                  <v-btn color="primary" flat @click.stop="dialog=false">Close</v-btn>
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

</template>

<script>
import Api from "@/services/api"
var marked = require('marked')
import moment from "moment";
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
          value: 'test.id'
        },
        { text: 'Candidate Email', value: 'candidate.email', sortable: false,},
        { text: 'Candidate Score', value: 'candidate.score', sortable: false,},
        { text: 'Challenge started at', value: 'createdAt', sortable: false,},
        { text: 'Challenge finished at', value: 'updatedAt', sortable: false,}
      ],
      items: [],
      qstsAnswers: []
    }
  },
  mounted() {
    Api.customApi("get", "/passedtests").then(response => {
      this.items = response.data.data;
    });
  },

  methods: {
    momentit(time) {
      return moment(time).format('llll')
    },
    markit(text) {
      return marked(text)
    },
    showanswers(asws) {
      this.qstsAnswers = asws
      this.dialog = true
    }
  }
    
}

</script>
