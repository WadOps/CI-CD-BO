<template>
    <v-layout>
        <v-container fluid warp>
        <v-layout wrap align-center row>
            <v-flex v-if="!isEdit">
                <v-subheader>User</v-subheader>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
                <v-text-field
                label="Username"
                v-model="user.name"
                ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex>
                <v-text-field
                label="Password"
                v-model="user.pass"
                required
                ></v-text-field>
            </v-flex>
            <v-flex>
                <v-btn icon class="mx-0" @click.stop="generatePass()">
                    <v-icon color="primary">update</v-icon>
                </v-btn>
            </v-flex>
            <v-spacer></v-spacer>
        </v-layout>
        <div class="my-4" slot="buttons">
            <v-btn class="grey" dark="dark" @click.native="backAction()"> 
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
import Api from "@/services/api";
var generatePassword = require('password-generator')
export default {
    props: ["id","name", "email"],

    data () {
        return {
            user:
                {
                    username: '',
                    pass: ''
                },
            error: '',
            showerror: false,
            dialog: false

        }
  },
  computed: {
    method () {
      return this.isEdit ? 'put' : 'post'
    },
    action () {
      if (this.isEdit) {
        return `${this.resource}/${this.id}`
      } else {
        return `${this.resource}`
      }
    },
    isEdit () {
        if(!!this.id)
            this.updateFields()
        return !!this.id
    },
    resource () {
      return this.$route.params.resource
    },
    // id () {
    //   return this.$route.params.id
    // },
    
    

  },
  watch: {
    '$route': 'fetch',
    'model': 'updateFields'
  },
  methods: {
    addCandidate(candidates) {
        candidates.push({
                name:'',
                email:''
        })
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
        this.candidates[0].name = this.name
        this.candidates[0].email = this.email
    },
    onSubmit () {
        Api.customApiParam(this.method, "/users/crud", { user: this.user, id: !!this.id ? this.id : '' })
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
        this.$router.push({name: 'users', params: {resource: this.resource}})
        if (data.data[0].id) {
            this.$emit("disabledialog")
        }
    },
    showError(err) {
        this.error=err
        this.showerror = true
    },
    backAction() {
        if(this.isEdit) 
            this.$emit("disabledialog") 
        else 
            this.$root.back()
    },
    generatePass(){
        this.user.pass=generatePassword(8, false)
    }    
  },
  created () {
    let pageTitle = (this.isEdit ? 'Update' : 'Create') + ' ' + global.helper.i.titleize(global.helper.i.singularize(this.resource))
    this.$store.commit('setPageTitle', pageTitle)
  },
  mounted () {
    // this.$bus.showMessage('success', 'success')
    // this.fetch()
  }
}
</script>
