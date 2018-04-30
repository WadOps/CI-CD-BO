<template>
    <v-card>
      <v-card-title>
        Organization Users
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
                    <formuser :id="chosenUser.id" :name="chosenUser.name" :email="chosenUser.email" @disabledialog="updatedItem()"></formuser>
                  </v-card>
                </v-dialog>
                <v-btn icon class="mx-0" @click="showdialog(props.item)">
                    <v-icon color="pink">delete</v-icon>
                </v-btn>
                <v-dialog v-model="dialog" max-width="400px">
                    <v-card>
                        <v-card-text class="title">
                            Are you sure?
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
import formuser from "./UserForm";
export default {
  components: {
    formuser
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
            { text: 'Userame', value: 'name', sortable: false, },
            { text: 'Email', value: 'email', sortable: false, },
            { text: 'Added', value: 'createdAt', sortable: false, } 
        ],
        items: [],
        dialog: false,
        formdialog: false,
        chosenUser: {},
        error: '',
        showerror: false,
    }
  },
  mounted() {
        Api.customApi("get", "/users").then(response => {
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
    showdialog(user) {
      this.chosenUser = user
      this.dialog = true
    },
    showformdialog(user) {
      this.chosenUser = user
      this.formdialog = true
    },
    deleteItem() {
        Api.customApi("delete", "/users/crud/"+this.chosenUser.id).then((response) => {
            if(response.data.success==true)
                Api.customApi("get", "/users").then(response => {
                    this.items = response.data.data;
                })
        })
        this.dialog = false
    },
    updatedItem() {
      	Api.customApi("get", "/users").then(response => {
            this.items = response.data.data;
		})
		this.formdialog = false
    },
    showError(err) {
        this.error=err
        this.showerror = true
    }
  }
}

</script>
