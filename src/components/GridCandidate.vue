<template>
    <v-card>
      <v-card-title>
        Candidates
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
            <td >{{ props.item.name }}</td>
            <td >{{ props.item.email }}</td>
            <td >{{ momentit(props.item.createdAt) }}</td>
            <td class="justify-center layout px-0">
                <v-btn icon class="mx-0" @click="/*editItem(props.item)*/showformdialog(props.item)">
                    <v-icon color="teal">edit</v-icon>
                </v-btn>
                <v-dialog v-model="formdialog">
                  <v-card>
                    <formcandidate :id="chosenCandidate.id" :email="chosenCandidate.email" :name="chosenCandidate.name" @disabledialog="updatedItem()"></formcandidate>
                  </v-card>
                </v-dialog>
                <v-btn icon class="mx-0" @click="showdialog(props.item)">
                    <v-icon color="pink">delete</v-icon>
                </v-btn>
                <v-dialog v-model="dialog" max-width="400px">
                    <v-card>
                        <v-card-text class="title">
                            Are you sure?
                            <v-card-text class="subheading">
                                <v-icon>warning</v-icon> it will delete all candidate Passed Tests !
                            </v-card-text>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" flat @click.stop="deleteItem()">Sure !</v-btn>
                            <v-btn color="primary" flat @click.stop="dialog=false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>

</template>

<script>
import Api from "@/services/api";
import moment from "moment"
import formcandidate from "./CandidateForm";
export default {
  components: {
    formcandidate
  },
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
        { text: 'Name', value: 'name', sortable: false, },
        { text: 'Email', value: 'email', sortable: false, },
        { text: 'Added', value: 'createdAt', sortable: false, } 
      ],
      items: [],
      dialog: false,
      formdialog: false,
      chosenCandidate: {}
    }
  },
  mounted() {
      Api.customApi("get", "/candidates").then(response => {
        this.items = response.data.data;
      })
  },
  methods: {
    momentit(time) {
      return moment(time).format('llll')
    },
    showdialog(candidate) {
      this.chosenCandidate = candidate
      this.dialog = true
    },
    showformdialog(candidate) {
      this.chosenCandidate = candidate
      this.formdialog = true
    },
    deleteItem() {
        Api.customApiParam("delete", "/candidates/crud",{
            candidate: this.chosenCandidate
        }).then((response) => {
            if(response.data.success==true)
                Api.customApi("get", "/candidates").then(response => {
                    this.items = response.data.data;
                })
        })
        this.dialog = false
    },
    updatedItem() {
      	Api.customApi("get", "/candidates").then(response => {
            this.items = response.data.data;
		})
		this.formdialog = false
    }
  }
}

</script>
