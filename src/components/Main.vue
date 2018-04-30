<template>
  <v-app :dark="dark" standalone="standalone">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" persistent="persistent" enable-resize-watcher="enable-resize-watcher" :dark="dark" app>
      <v-list dense="dense">
        <template v-for="item in menu" v-if="checkAdmin(item.role)">
          <v-list-group v-if="item.items" v-bind:group="item.group">
            <v-list-tile slot="activator" :title="item.title" :key="item.title" :prepend-icon="item.icon" no-action>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="subItem in item.items" :key="subItem.href" :to="subItem.href" v-bind:router="!subItem.target" ripple="ripple" v-bind:disabled="subItem.disabled" v-bind:target="subItem.target">
              <v-list-tile-action v-if="subItem.icon">
                <v-icon class="success--text">{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-subheader v-else-if="item.header">{{ item.header }}</v-subheader>
          <v-divider v-else-if="item.divider"></v-divider>
          <v-list-tile v-else :to="item.href" router="router" ripple="ripple" v-bind:disabled="item.disabled" :title="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.subAction">
              <v-icon class="success--text">{{ item.subAction }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="darken-1" fixed="fixed" dark="dark" :class="theme" app> 
      <v-toolbar-side-icon dark="dark" @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y="offset-y">
        <v-btn icon="icon" dark="dark" slot="activator" @click="changetheme()">
          <v-icon dark="dark" v-if="!dark" >brightness_3</v-icon>
          <v-icon dark="dark" v-if="dark" >wb_sunny</v-icon>
        </v-btn>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container class="pa-4" fluid="fluid">
        <v-alert v-bind="message" v-model="message.body" dismissible="dismissible">{{message.body}}</v-alert>
        <div class="py-2">
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      dark: false,
      theme: 'error',
      mini: false,
      drawer: true,
    }
  },
  computed: {
    ...mapState(['message', 'menu', 'pageTitle','user'])
  },
  methods: {
    changetheme() {
      this.dark=!this.dark
    },
    checkAdmin(role) {
      if(role) {
        if(this.user.role == "Admin")
          return true
        else
          return false
      } else {
        return true
      }
    }
  }
}
</script>

