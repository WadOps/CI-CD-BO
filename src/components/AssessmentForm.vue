<template>
    <v-layout>
        <v-container fluid warp>
        <v-layout wrap align-center row >
            <v-flex xs3>
                <v-subheader>Assessment Name</v-subheader>
            </v-flex>
            <v-text-field 
                label="Name"
                id="test"
                v-model="name"
            ></v-text-field>
            <v-flex xs5>
            </v-flex>
        </v-layout>
        <v-layout row align-center>
            <v-flex xs3>
                <v-subheader>Candidate</v-subheader>
            </v-flex>
            <v-select
                :items="candidates"
                v-model="chosencandidate"
                item-text="email"
                label="Select candidate"
                single-line
            ></v-select>
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
                    :return-value.sync="expdate"
                    class="ml-5"
                >
                    <v-text-field
                        slot="activator"
                        label="Expiration invitation day"
                        v-model="expdate"
                        prepend-icon="event"
                        readonly
                    ></v-text-field>
                    <v-date-picker v-model="expdate" no-title scrollable :min="allowedDates()">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(expdate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-flex>
        </v-layout>
        <v-layout row align-center class="my-5">
            <v-flex>
                <template>
                <v-card>
                    <v-card-title>
                    Assign Tests
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
                    v-model="selected"
                    select-all
                    class="elevation-1"
                    >
                    <template slot="headerCell" slot-scope="props">
                        <v-tooltip bottom>
                            <span slot="activator">
                            {{ props.header.text }}
                            </span>
                            <span>
                            {{ props.header.text }}
                            </span>
                        </v-tooltip>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td>
                            <v-checkbox
                            primary
                            hide-details
                            v-model="props.selected"
                            ></v-checkbox>
                        </td>
                        <td>{{ props.item.id }}</td>
                        <td >{{ momentit(props.item.createdAt) }}</td>
                        <td >{{ props.item.difficulty }}</td>
                        <td ><v-chip v-for="(tech, index) in props.item.techstack">{{ tech }}</v-chip></td>
                    </template>
                    <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                    </v-data-table>
                </v-card>
                </template>
            </v-flex>
            <!-- <v-flex>
                <template>
                    <v-card>
                        <v-card-title>
                        Coding Challenges
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
                            <td>{{ props.item.name }}</td>
                        </template>
                        <v-alert slot="no-results" :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                        </v-data-table>
                    </v-card>
                </template>
            </v-flex> -->
        </v-layout>

        <v-layout row align-center >
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
        <v-layout row align-center>
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
            <v-btn primary="primary" dark="dark" type="submit" color="error" @click="onSubmit">Submit
            <v-icon right="right" dark="dark">send</v-icon>
            </v-btn>
        </div>
        <v-snackbar
            :timeout=6000
            :top=true
            v-model="showerror"
            >
            {{ error }}
            <v-btn flat color="error" @click.native="showerror = false">Close</v-btn>
        </v-snackbar>
        </v-container>
    </v-layout>
</template>

<script>
import Api from "@/services/api"
import moment from "moment"
var marked = require('marked')
export default {

  data () {
    return {
        search: '',
        selected: [],
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
        name: '',
        diff: [ 'Junior',
                'Intermediate',
                'Senior'
        ],
        assessment_diff: '',
        time: null,
        techs:[  'Javascript',
                'Java',
                'Ruby',
                'Python'
        ],
        techstack: [],
        error: '',
        showerror: false,
        items:[],
        candidates: [],
        chosencandidate: {},
        expdate: '',
        menu: false,

    }
  },
  computed: {
    method () {
      return this.isEdit ? 'patch' : 'post'
    },
    action () {
      if (this.isEdit) {
        return `${this.resource}/${this.id}`
      } else {
        return `${this.resource}`
      }
    },
    isEdit () {
      return !!this.id
    },
    resource () {
      return this.$route.params.resource
    },
    id () {
      return this.$route.params.id
    }

  },
  watch: {
    '$route': 'fetch',
    'model': 'updateFields'
  },
  methods: {
    allowedDates () {
      return moment().format("YYYY-MM-DD"); 
    },
    momentit(time) {
      return moment(time).format('llll')
    },
    getFieldError (fieldName) {
      for (let k in this.errors) {
        let error = this.errors[k]
        if (error.field === fieldName) {
          return error.message
        }
      }
    },
    updateFields () {

    },
    onSubmit () {
        Api.customApiParam("post", "/assessments/crud", { name: this.name, tests: this.selected, candidate: this.chosencandidate, diff: this.assessment_diff, timelimit: this.expdate, techstack: this.techstack })
        .then(response => {
            if(response.data.success == true) {
                this.onSuccess(response.data)
            } else {
                this.showError(response.data.data)
            }
        })
        .catch(err => {
            console.log(err);
        });
    },
    onSuccess (data) {
        this.$router.push({name: 'assessments', params: {resource: this.resource}})
        if (data.id) {
            // this.$router.go(-1)
      }
    },
    showError(err) {
        this.error=err
        this.showerror = true
    },
    markit(text) {
        return marked(text)
    },
  },
  mounted() {
      Api.customApi("get", "/tests").then(response => {
        this.items = response.data.data;
      });
      Api.customApi("get", "/candidates").then(response => {
        this.candidates = response.data.data;
      });
  },
  created () {
    let pageTitle = (this.isEdit ? 'Update' : 'Create') + ' ' + global.helper.i.titleize(global.helper.i.singularize(this.resource))
    this.$store.commit('setPageTitle', pageTitle)
  },
//   mounted () {
//     // this.$bus.showMessage('success', 'success')
//     // this.fetch()
//   }
}
</script>
