<template>
    <v-layout>
        <v-container fluid warp>
        <v-layout wrap align-center row >
            <v-flex xs3>
                <v-subheader>Questions</v-subheader>
            </v-flex>
            <v-flex wrap>
                <v-layout align-center v-for="(question, index) in questions">
                    <v-flex xs10>
                        <v-text-field
                            name="input-7-1"
                            :label="`Question ${index+1}`"
                            multi-line
                            v-model="question.desc"
                        ></v-text-field>
                        <v-layout align-center v-for="(answer, index) in question.answers">
                            <v-checkbox hide-details class="shrink mr-2" v-model="answer.istrue"></v-checkbox>
                            <v-text-field :label="`Answer ${index+1}`" v-model="answer.desc"></v-text-field>
                                <v-btn fab dark small color="error" @click="addAnswer(question.answers)"> <v-icon dark>add</v-icon> </v-btn>
                        </v-layout>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn fab dark color="error" @click="addQuestion(questions)"> <v-icon dark>add</v-icon> </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout row align-center>
            <v-flex xs3>
                <v-subheader>Difficulty</v-subheader>
            </v-flex>
            <v-select
                :items="diff"
                v-model="test_diff"
                label="Select difficulty"
                single-line
            ></v-select>
        </v-layout>
        <v-layout row align-center>
            <v-flex xs3>
                <v-subheader>Time Limit</v-subheader>
            </v-flex>
            <v-text-field
                label=""
                id="test"
                min=0
                max=60
                step=1
                maxlength=3
                suffix="minutes"
                v-model="time"
            ></v-text-field>
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
import Api from "@/services/api";
export default {

  data () {
    return {
        questions:[
            {
                desc:'',
                answers:[
                    {
                        desc:'',
                        istrue: false
                    }
                ]
            }
        ],
        diff: [ 'Junior',
                'Intermediate',
                'Senior'
        ],
        test_diff: '',
        time: null,
        techs:[  'Javascript',
                'Java',
                'Ruby',
                'Python'
        ],
        techstack: [],
        error: '',
        showerror: false

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
    addAnswer (answers) {
        answers.push({
            desc:'',
            istrue: false
        })
    },
    addQuestion(questions) {
        questions.push({
                desc:'',
                answers:[
                    {
                        desc:'',
                        istrue: false
                    }
                ]
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

    },
    onSubmit () {
        Api.customApiParam("post", "/tests", { questions: this.questions, diff: this.test_diff, timelimit: this.time, techstack: this.techstack })
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
        this.$router.push({name: 'grid', params: {resource: this.resource}})
        if (data.id) {
            // this.$router.go(-1)
      }
    },
    showError(err) {
        this.error=err
        this.showerror = true
    }
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
