import type { Session, User } from '@supabase/supabase-js'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { supabase } from "../supabase";
import { createToast } from "mosha-vue-toastify";
// sbp_61492580d002882ea03b6af805eb1a279a6fa412  Access Token
// n9N2QZhdJ73SZnrY DB Password
// postgres://postgres:n9N2QZhdJ73SZnrY@db.hcdprxdewjvgcicmskja.supabase.co:6543/postgres DB URL
interface UserState {
  user: User | any | null;
  session: Session | any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    // user: null,
    // session: null,
    user: useStorage('ols_user', null),
    session: useStorage('ols_session', null),
    isLoggedIn: useStorage('ols_user', false) == false ? false : true,
    isLoading: false,
    error: null
  }),
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getIsLoading: (state) => state.isLoading,
    getUser: (state) => state.user,
    getError: (state) => state.error
  },
  actions: {
    async login(email: string, password: string) {
      try {
        this.isLoading = true;
        const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (session) {
          // const { data: { session } } = await supabase.auth.getSession()
          // const { data: { user } } = await supabase.auth.getUser()
          this.session = session
          this.user = user
          this.isLoggedIn = true
          console.log(user.id)
          console.log(session.token_type)
        }
        if (error) {
          this.error = error.message;
          createToast(this.error, {
            showIcon: true,
            position: "top-center",
            type: "danger",
            transition: "slide",
          });
        }
        createToast("You are now logged in.", {
          showIcon: true,
          position: "top-center",
          type: "success",
          transition: "slide",
        });
      } catch (err) {
        this.isLoading = false;
        this.error = (err as Error).message;
        createToast(this.error, {
          showIcon: true,
          position: "top-center",
          type: "danger",
          transition: "slide",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      try {
        await supabase.auth.signOut();
        this.user = null;
        this.session = null;
        this.isLoggedIn = false;
        createToast("Logged out successfully!", {
          showIcon: true,
          position: "top-center",
          type: "success",
          transition: "slide",
          hideProgressBar: true,
        });
      } catch (err) {
        this.error = (err as Error).message;
        createToast(this.error, {
          showIcon: true,
          position: "top-center",
          type: "danger",
          transition: "slide",
        });
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
