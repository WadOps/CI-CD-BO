<template>
    <v-card>
      <v-card-title>
        Assessemnt
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
            <tr @click="props.expanded = !props.expanded; definevariables(props.item);">
                <td>{{ props.item.name }}</td>
                <td >{{ momentit(props.item.createdAt) }}</td>
                <td >{{ momentit(props.item.time) }}</td>
                <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="dialog=true">
                        <v-icon color="pink">delete</v-icon>
                    </v-btn>
                    <v-dialog v-model="dialog" max-width="400px">
                        <v-card>
                            <v-card-text class="title">
                                Are you sure?
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" flat @click.stop="deleteItem(props.item)">Sure !</v-btn>
                                <v-btn color="primary" flat @click.stop="dialog=false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </td>
            </tr>
        </template>
        <template slot="expand" slot-scope="props">
            <v-card flat>
                <v-layout row align-center>
                    <v-flex xs5>
                        <v-menu
                            ref="menu"
                            lazy
                            :close-on-content-click="false"
                            v-model="menu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            min-width="290px"
                            :return-value.sync="exptime"
                            class="ma-4"
                        >
                            <v-text-field
                                slot="activator"
                                label="Expiration invitation day"
                                v-model="exptime"
                                prepend-icon="event"
                                readonly
                            ></v-text-field>
                            <v-date-picker v-model="exptime" no-title scrollable :min="allowedDates()">
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.menu.save(exptime)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex>
                        <v-btn icon class="mx-0" @click.stop="updatexptime(props.item.id)" v-if="!updatedtime">
                            <v-icon color="primary">update</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click.stop="reset()" v-if="updatedtime">
                            <v-icon color="green">done</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
                <v-layout row align-center class="ma-3">
                    <v-flex>
                        <template>
                        <v-card>
                            <v-card-title>
                            Tests
                            </v-card-title>
                            <v-data-table
                            :headers="testheaders"
                            :items="tests"
                            class="elevation-1"
                            >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.id }}</td>
                                <td >{{ momentit(props.item.createdAt) }}</td>
                                <td >{{ props.item.difficulty }}</td>
                                <td ><v-chip v-for="(tech, index) in props.item.techstack">{{ tech }}</v-chip></td>
                            </template>
                            </v-data-table>
                        </v-card>
                        </template>
                    </v-flex>
                </v-layout>
                <v-layout row align-center class="mx-5">
                    <v-flex xs3>
                        <v-subheader>Difficulty</v-subheader>
                    </v-flex>
                    <v-select
                        :items="diff"
                        v-model="assessment_diff"
                        label="Select difficulty"
                        single-line
                    ></v-select>
                </v-layout>
                <v-layout row align-center class="mx-5">
                    <v-flex xs3>
                        <v-subheader>Technology</v-subheader>
                    </v-flex>
                    <v-select
                        v-model="techstack"
                        label="Select a technology"
                        multiple
                        tags
                        :items="techs"
                    ></v-select>
                </v-layout>
                <div class="my-4" slot="buttons">
                    <v-btn class="grey" dark="dark" @click.native="$root.back()"> 
                    <v-icon dark="dark" left="left">chevron_left </v-icon><span>Back</span>
                    </v-btn>
                </div>
            </v-card>
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
        menu: false,
        search: '',
        headers: [
            {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'id'
            },
            { text: 'Created at', value: 'createdAt', sortable: false, },
            { text: 'Expire in', value: 'time', sortable: false, },
        ],
        items: [],
        exptime: '',
        testheaders: [
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
        tests: [],
        diff: [ 'Junior',
                'Intermediate',
                'Senior'
        ],
        assessment_diff: '',
        techs:[  'Javascript',
            'Java',
            'Ruby',
            'Python'
        ],
        techstack: [],
        updatedtime: false,
        dialog: false,
        error: '',
        showerror: false,
    }
  },
  mounted() {
        Api.customApi("get", "/assessments").then(response => {
            if(response.data.success==true) {
                this.items = response.data.data;
            } else {
                this.showError(response.data.data)
            }
        })
  },
  methods: {
    deleteItem(assessment) {
        Api.customApi("delete", "/assessments/crud/"+assessment.id).then((response) => {
            if(response.data.success==true)
                Api.customApi("get", "/assessments").then(response => {
                    this.items = response.data.data;
                })
        })
        this.dialog = false
    },
    updatexptime(id) {
        Api.customApiParam("put", "/assessments/crud", {
            id: id,
            time: this.exptime
        }).then((response) => {
            if(response.data.success == true) {
                this.updatedtime = true
                Api.customApi("get", "/assessments").then(response => {
                    this.items = response.data.data;
                })
            }
                
        })
    },
    reset() {
        this.updatedtime = false
    },
    definevariables(assessment) {
        this.exptime = assessment.time
        this.assessment_diff = assessment.difficulty
        this.techstack = assessment.techstack
        this.tests = assessment.tests
    },
    allowedDates () {
      return moment().format("YYYY-MM-DD"); 
    },
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
