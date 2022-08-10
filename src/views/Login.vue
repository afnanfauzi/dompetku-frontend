<template>
   <v-app id="inspire">
      <v-main>
         <v-container fluid fill-height>
            <!-- <v-overlay :value="overlay">
                <v-progress-circular
                    indeterminate
                    color="secondary"
                ></v-progress-circular>
            </v-overlay> -->
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Hai, silahkan login terlebih dahulu</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                            @submit.prevent="login"
                        >
                           <v-text-field
                              prepend-icon="mdi-account"
                              name="email"
                              label="E-mail"
                              v-model="email"
                              :rules="emailRules"
                           ></v-text-field>
                           <v-text-field
                              prepend-icon="mdi-lock"
                              name="password"
                              label="Password"
                              hint="Minimal 8 karakter"
                              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPass ? 'text' : 'password'"
                              v-model="password"
                              :rules="passwordRules"
                              @click:append="showPass = !showPass"
                           ></v-text-field>
                          <v-alert
                            v-model="alertLogin"
                            class="mt-3"
                            dense
                            elevation="2"
                            type="error"
                            >Email atau password salah.</v-alert>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <!-- <v-btn color="primary" type="submit">Login</v-btn> -->
                        <v-btn
                        :disabled="!valid"
                        color="primary"
                        class="mr-4"
                        @click="login"
                        >
                        Login
                        </v-btn>
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
                valid: true,
                email: '',
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
                password: '',
                passwordRules: [
                    v => !!v || 'Password is required',
                ],
                showPass: false,
                //state login failed
                loginFailed: null,
                alertLogin: false,
                // overlay: false,
            }
        },
        methods: {
            login() {
                // this.overlay = !this.overlay
                this.alertLogin = false
                this.$refs.form.validate()
                if (this.email && this.password) {
                    axios.get('https://dompetku-api.herokuapp.com/sanctum/csrf-cookie')
                        .then(response => {
                            //debug cookie
                            console.log(response)
                            axios.post('https://dompetku-api.herokuapp.com/api/login', {
                                email: this.email,
                                password: this.password
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
                                this.alertLogin = true
                            })
                        })
                }
            },
        },
        //check user already logged in
        mounted() {
            if (this.loggedIn) {
                return this.$router.push({ name: 'dashboard' })
            }else{
                return this.$router.push({ name: 'login' })
            }
        },
        
        // watch: {
        //     overlay (val) {
        //         val && setTimeout(() => {
        //         this.overlay = false
        //     }, 3000)
        //     },
        // },
};
</script>

<style></style>
