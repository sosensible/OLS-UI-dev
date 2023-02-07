import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from "../supabase";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    session: {}
  }),
  getters: {
    loggedIn(state) {
      return state.user?.id ? true : false
    }
  },
  actions: {
    async login(email, password) {
      // console.log("logging in with email " & email & " and password" & password)
      console.log({ email: email, password: password })
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) {
        alert(error.message)
      }
      if (data) {
        this.session = data.session
        this.user = data.user
        console.log({ meta: { altUser: data.user, user: this.user, session: data.session } })
      }

    },
    async logout() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        alert(error.message)
      }

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        alert(sessionError.message)
      }
      if (data) {
        this.session = data.session
        this.user = data.user
      }
    }
  }
});

export const xuseUserStore = defineStore('user', () => {
  const session = ref()
  const user = ref(defaultUser())

  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
    userChange(user, data.session);
    console.log({ user_session: data.session });
    console.log({ user_session: session.value });
    // user.value = data.session?.user;
    // console.log({ user_meta: data.session.user });
    console.log({ user_meta: user.value });
  });
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
    // user.value = supabase.auth.getUser()

  });
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { user }
})

function userChange(user, _session) {
  console.log({ user_check: _session.user });
  user.value = _session.user;
}

function defaultUser() {
  return {
    name: 'visitor',
    email: ''
  }
}