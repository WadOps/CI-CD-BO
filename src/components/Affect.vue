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
                <!-- <v-flex>
                    <v-text-field label="Condidat Email" v-model="email"></v-text-field>
                </v-flex> -->
                <v-flex>
                    <v-select :items="candidates" v-model="chosencandidate" item-text="email" label="Emails" autocomplete></v-select>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
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
			<v-layout wrap v-if="!!link">
				<v-flex xs2>
					<v-subheader>To</v-subheader>
				</v-flex>
				<v-flex xs10 class="text-xs-right">
					<v-chip>
						<v-avatar class="error">{{chosencandidate.email.charAt(0)}}</v-avatar>
						{{chosencandidate.email}}
					</v-chip>
				</v-flex>
				<v-flex xs12>
					<v-divider></v-divider>
					<v-text-field
					label="Subject"
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
					:value="this.link"
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
          </v-container>
    </v-flex>
    </v-layout>
</template>

<script>
import Api from "@/services/api";
import moment from "moment"
export default {

  data () {
    return {
        tests: [],
        candidates: [],
        chosentest: {},
        chosencandidate: {},
        link: "",
        expdate: null,
        menu: false,
        message : "",
        subject: "Invitation to Hidden Founders assessment"
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
    },
	getmessage () {
		this.message = `This is your link to pass the assessment, it will expire in ${this.expdate}`
		return this.message
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
      Api.customApi("get", "/candidates").then(response => {
        this.candidates = response.data.data;
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
            email: this.chosencandidate.email,
            id:this.chosentest.id,
            expdate: this.expdate
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
    },
    allowedDates () {
      return moment().format("YYYY-MM-DD"); 
    },
	onSend() {
		Api.customApiParam("post", "/sendmail", {
			link: this.link,
			name: this.chosencandidate.name,
            email: this.chosencandidate.email,
            message: this.message,
			subject: this.subject
        })
	}
  },
  created () {
    let pageTitle = (this.isEdit ? 'Update' : 'Create') + ' ' + global.helper.i.titleize(global.helper.i.singularize(this.resource))
    this.$store.commit('setPageTitle', pageTitle)
  }
}
</script>
