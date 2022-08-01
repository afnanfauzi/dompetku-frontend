<template>
   <v-app id="inspire">
      <v-main>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Hai, silahkan login terlebih dahulu</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              prepend-icon="mdi-account"
                              name="email"
                              label="Email"
                              type="email"
                              v-model="user.email"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              label="Password"
                              type="password"
                              v-model="user.password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" type="submit">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
import axios from 'axios'
export default {
   name: 'Login',

   data() {
            return {
                //state loggedIn with localStorage
                loggedIn: localStorage.getItem('loggedIn'),
                //state token
                token: localStorage.getItem('token'),
                 //state loggedIn with localStorage
                id_user: localStorage.getItem('id_user'),
                //state token
                name: localStorage.getItem('name'),
                //state user
                user: [],
                //state validation
                validation: [],
                //state login failed
                loginFailed: null
            }
        },
        methods: {
            login() {
                if (this.user.email && this.user.password) {
                    axios.get('http://localhost:8000/sanctum/csrf-cookie')
                        .then(response => {
                            //debug cookie
                            console.log(response)
                            axios.post('http://localhost:8000/api/login', {
                                email: this.user.email,
                                password: this.user.password
                            }).then(res => {
                                //debug user login
                                console.log(res)
                                if (res.data.success) {
                                    //set localStorage
                                    localStorage.setItem("loggedIn", "true")
                                    //set localStorage Token
                                    localStorage.setItem("token", res.data.data.token)
                                    //set localStorage
                                    localStorage.setItem("id_user", res.data.data.id_user)
                                    // console.log(response.data.data.id_user)
                                    //set localStorage Token
                                    localStorage.setItem("name", res.data.data.name)
                                    //change state
                                    this.loggedIn = true
                                    //redirect dashboard
                                    return this.$router.push({ name: 'dashboard' })
									
                                } else {
                                    //set state login failed
                                    this.loginFailed = true
                                }
                            }).catch(error => {
                                console.log(error)
                            })
                        })
                }
                this.validation = []
                if (!this.user.email) {
                    this.validation.email = true
                }
                if (!this.user.password) {
                    this.validation.password = true
                }
            }
        },
        //check user already logged in
        mounted() {
            if (this.loggedIn) {
                return this.$router.push({ name: 'dashboard' })
            }
        }
};
</script>

<style></style>
