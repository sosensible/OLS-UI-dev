// import type { Session, User } from '@supabase/supabase-js'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { supabase } from "../supabase";
import { createToast } from "mosha-vue-toastify";
import router from "../router";

interface olsUser {
  email: string,
  id: string | null,
  changedLoginAt: Date
}
interface UserState {
  user: olsUser;
  isLoading: boolean;
  error: string | null;
  eventBus: Object | null;
}

const get_blank_user = (): olsUser => {
  const newDate = new Date()
  return {
    email: '',
    id: null,
    // @ts-ignore
    changedLoginAt: newDate.toDateString
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    // @ts-ignore
    user: useStorage('ols_user', get_blank_user()),
    isLoading: false,
    error: null,
    eventBus: null
  }),
  getters: {
    getError: (state) => state.error,
    isLoggedIn: (state) => state.user.email?.length ? true : false,
    getChangedLoginAt: (state) => new Date(state.user.changedLoginAt)
  },
  actions: {
    async login(email: string, password: string) {
      try {
        this.isLoading = true;
        const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (user) this.user = { email: user.email, id: user.id } as olsUser
        if (error) {
          this.error = error.message;
          createToast(this.error, {
            showIcon: true,
            position: "top-center",
            type: "danger",
            transition: "slide",
          });
          this.user = get_blank_user()
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
        this.user.changedLoginAt = new Date()
      }
    },
    async logout() {
      try {
        await supabase.auth.signOut();
        // @ts-ignore
        this.user = get_blank_user()
        createToast("Logged out successfully!", {
          showIcon: true,
          position: "top-center",
          type: "success",
          transition: "slide",
          hideProgressBar: true,
        });
        router.push('/')
      } catch (err) {
        this.error = (err as Error).message;
        createToast(this.error, {
          showIcon: true,
          position: "top-center",
          type: "danger",
          transition: "slide",
        });
      }
    },
    async refreshSession() {
      const { data, error } = await supabase.auth.getUser();
      if (!data.user?.id) {
        this.user = get_blank_user();
      }
      if (error) console.log(error);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
