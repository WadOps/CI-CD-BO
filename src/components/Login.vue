<template>
  <v-app fluid>
    <v-layout row wrap>
      <v-flex xs12 md6 offset-md3>
			<v-card>
				<v-toolbar color="error" dark>
					<v-toolbar-title>Login</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-text-field
					label="Username"
					required
					v-model="model.username"
					></v-text-field>
					<v-text-field
					label="Password"
					required
					v-model="model.password"
					></v-text-field>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn primary="primary" dark="dark" type="submit" color="error" @click="onSubmit(model)">Log in
							<v-icon right="right" dark="dark">send</v-icon>
						</v-btn>
					</v-card-actions>
				</v-card-text>
			</v-card>
		</v-flex>
		<v-snackbar
            :timeout=6000
            :top=true
            v-model="showerror"
            >
            {{ error }}
            <v-btn flat color="error" @click.native="showerror = false">Close</v-btn>
        </v-snackbar>
    </v-layout>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Api from "@/services/api"
export default {


	data () {
		return {
			model: {
				username: '',
				password: ''
			},
			error: '',
        	showerror: false,
		}
	},
	methods: {
		onSubmit (data) {
			Api.customApiParam("post", "/authenticate", data)
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
			this.$store.commit('setAuth', data.data)
			this.$router.replace('/')
		},
		showError(err) {
        this.error=err
        this.showerror = true
    },
  },

  mounted () {
  }
}
</script>
