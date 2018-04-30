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
                label="Name"
                v-model="user.name"
                ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
             <v-flex>
                <v-text-field
                label="Email"
                v-model="user.email"
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
        <v-layout wrap transition="fade-transition" v-if="showsendform">
            <v-flex xs2>
                <v-subheader>To</v-subheader>
            </v-flex>
            <v-flex xs10 class="text-xs-right">
                <v-chip>
                    <v-avatar class="error">{{user.email.charAt(0)}}</v-avatar>
                    {{user.email}}
                </v-chip>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
                <v-text-field
                label="Subject"
                :value="getsubject"
                v-model="subject"
                single-line
                full-width
                hide-details
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
                <v-text-field
                label="Message"
                :value="this.getmessage"
                v-model="message"
                counter=500
                max="500"
                full-width
                multi-line
                single-line
                auto-grow
                >
                </v-text-field>
                <v-text-field
					:value="this.getinfo"
					disabled
					multi-line
					single-line
					full-width
					hide-details
					auto-grow
				></v-text-field>
            </v-flex>
            <v-btn primary="primary" dark="dark" type="submit" color="error" @click="onSend">Send
                <v-icon right="right" dark="dark">send</v-icon>
            </v-btn>
        </v-layout>
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
    props: ["id","name","email"],

    data () {
        return {
            user:
                {
                    name: '',
                    email: '',
                    pass: ''
                },
            error: '',
            showerror: false,
            dialog: false,
            showsendform: false,
            message : "",
            subject: "",
            info:''
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
    getmessage () {
        if(!!this.id) {
            this.message = `Hello, 
    your informations has been updated, here they are:`
		return this.message
        } else {
            this.message = `Hello, 
    this are your informations to log in to technical screening platform :`
		return this.message
        }
    },
    getinfo () {
        this.info = `
    email : ${this.user.email}, 
    password : ${this.user.pass}`
		return this.info
    },
    getsubject() {
        if(!!this.id) {
            this.subject = "Update on your Organization Account: Technical Screening"
            return this.subject
        } else {
            this.subject = "Organization Account: Technical Screening"
            return this.subject
        }
    }
    // id () {
    //   return this.$route.params.id
    // },
    
  },
  watch: {
    '$route': 'fetch',
    'model': 'updateFields'
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
        this.user.name = this.name
        this.user.email = this.email
    },
    onSubmit () {
        Api.customApiParam(this.method, "/users/crud", { user: this.user, id: !!this.id ? this.id : '' })
        .then(response => {
            if(response.data.success == true) {
                this.showsendform = true
            } else {
                this.showError(response.data.data)
            }
        })
        .catch(err => {
            console.log(err);
        });
    },
    onSuccess (data) {
        this.showsendform = false
        this.$router.push({name: 'users', params: {resource: this.resource}})
        if (data.data) {
            this.$emit("disabledialog")
        }
    },
    onSend() {
		Api.customApiParam("post", "/sendinfomail", {
			user: this.user,
            message: this.message,
            subject: this.subject,
            info: this.info
        }).then(response => {
            if(response.data.success == true) {
                this.onSuccess(response.data)
            } else {
                this.showError(response.data.data)
            }
        })
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
