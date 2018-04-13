<template>
    <v-layout>
    <v-flex>
          <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex sm>
                    <v-subheader >Affect</v-subheader>
                </v-flex>
                <v-flex xs12 sm3>
                    <v-select :items="tests" v-model="chosentest" item-text="id" label="Tests" autocomplete></v-select>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                    <v-text-field label="Condidat Email" v-model="email"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                    <v-btn primary="primary" dark="dark" type="submit" color="error" @click="onSubmit">Affect
                    <v-icon right="right" dark="dark">send</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div class="my-4" slot="buttons">
                <a :href="'//' +link"> {{link}} </a>
            </div>
          </v-container>
    </v-flex>
    </v-layout>
</template>

<script>
import Api from "@/services/api";
export default {

  data () {
    return {
        tests:[],
        chosentest:{},
        email:"",
        link:"",
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
  mounted() {
      Api.customApi("get", "/tests").then(response => {
      this.tests = response.data.data;
      });
  },
  methods: {
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
        Api.customApiParam("post", "/generateurl", {
            email:this.email,
            id:this.chosentest.id
        })
        .then(response => {
            this.link=response.data.data
        })
        .catch(err => {
            console.log(err);
        });
    },
    onSuccess (data) {
      this.$router.push({name: 'affected_grid', params: {resource: this.resource}})
      if (data.id) {
        // this.$router.go(-1)
      }
    }
  },
  created () {
    let pageTitle = (this.isEdit ? 'Update' : 'Create') + ' ' + global.helper.i.titleize(global.helper.i.singularize(this.resource))
    this.$store.commit('setPageTitle', pageTitle)
  }
}
</script>
