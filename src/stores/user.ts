// import type { Session, User } from '@supabase/supabase-js'
import { unref } from 'vue';
import { useStorage, useTimeoutFn, type RemovableRef, type Stoppable } from '@vueuse/core';
import { defineStore, acceptHMRUpdate } from 'pinia'
import { supabase } from "../supabase";
import { createToast } from "mosha-vue-toastify";
import router from "../router";

interface olsUser {
  email: string,
  id: string | null,
  changedLoginAt: Date
}
interface olsSession {
  expires_at: Number,
  expires_in: Number,
  refresh_token: String,
  token_type: String
}
interface UserState {
  user: olsUser | RemovableRef<olsUser>;
  session: olsSession | RemovableRef<olsSession>,
  isLoading: boolean;
  error: string | null;
  eventBus: Object | null;
  sessionMgr: Stoppable | null;
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

const get_blank_session = (): olsSession => {
  return {
    expires_at: 0,
    expires_in: 0,
    refresh_token: '',
    token_type: ''
  }
}





export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: useStorage('ols_user', get_blank_user()),
    session: useStorage('ols_session', get_blank_session()),
    isLoading: false,
    error: null,
    eventBus: null,
    sessionMgr: null,
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
        if (session) {
          console.log('session', session)
          this.session = {
            expires_at: session.expires_at ?? 0,
            expires_in: session.expires_in,
            refresh_token: session.refresh_token,
            token_type: session.token_type
          }
          const start = unref(this.session.expires_at);
          const sessionMgr = useTimeoutFn(() => {
            if (start === this.session.expires_at) this.makeGuest()
          }, (session.expires_in) * 1000);
        }
        if (error) {
          this.error = error.message;
          createToast(this.error, {
            showIcon: true,
            position: "top-center",
            type: "danger",
            transition: "slide",
          });
          this.makeGuest()
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
    makeGuest() {
      this.user = get_blank_user()
      this.session = get_blank_session()
      try {
        this.sessionMgr?.stop()
      } catch (err) {
        console.log(err)
      }
    },
    async logout() {
      try {
        await supabase.auth.signOut();
        // @ts-ignore
        this.makeGuest();
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
        this.makeGuest();
      }
      if (error) console.log(error);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
