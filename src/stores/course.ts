import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'
import { useUserStore } from './user';
import { unref } from 'vue'

interface CourseState {
  course: Database['public']['Tables']['course']['Row'] | null;
  courses: Database['public']['Tables']['course']['Row'][];
  count: number;
  listPulledAt: Date | null;
  lastUserChange: Date | null;
}

const flipTrue = (oldBool: boolean, newBool: boolean) => {
  return oldBool == true ? newBool == true ? true : false : false
}

const courseDefault = {
  created_at: null,
  id: 0,
  name: "",
  detail: "",
  image: null,
  live: false,
  main_key: null,
  owner: null,
  updated_at: null,
}

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    course: courseDefault,
    courses: [],
    count: 0,
    listPulledAt: new Date(),
    lastUserChange: null,
  }),
  getters: {
    getCourseList(state) {
      return state.courses;
    },
    getCourse(state) {
      return state.course;
    },
    freshCourses(state) {
      const userStore = useUserStore();
      if (userStore.isLoggedIn) {
        // @ts-ignore
        if (this.listPulledAt < userStore.getChangedLoginAt) {
          return false;
        }
      }
    }
  },
  actions: {
    async insertCourse() {
      // const newCourse: Database['public']['Tables']['course']['Row'] = {
      //   created_at: null,
      //   id: 11,
      //   name: "CC 4",
      //   detail: "After Learning CC",
      //   image: null,
      //   live: false,
      //   main_key: null,
      //   owner: null,
      //   updated_at: null,
      // };
      const userStore = useUserStore();
      const { data: course, error } = await supabase.from('courses').insert({
        name: this.course.name,
        detail: this.course.detail,
        live: this.course.live,
        owner: userStore.user.id,
      }).select().single();
      if (course) {
        // @ts-ignore
        this.course.id = course.id
        console.log(course);
      }
      if (error) { console.log(error) }
    },
    increment() {
      this.count++
    },
    newCourse() {
      this.course = courseDefault;
    },
    async pullCourseList(searchText: string) {
      const { data: courses, error } = await supabase.from('courses').select().ilike("name", `%${searchText}%`);
      if (courses) {
        this.courses.length = 0;
        courses.forEach((course) => {
          this.courses.push(course);
        });
        this.listPulledAt = new Date();
        const userStore = useUserStore();
        this.lastUserChange = unref(userStore.getChangedLoginAt)
      }
      if (error) {
        console.log(error);
      }
    },
    async save() {
      this.course?.id
    },
    async load(id: number) {
      const { data: course, error } = await supabase.from('courses').select(`
        id, name, detail, live,
        units ( id, name )
        `).eq('id', id).single();
      if (course) this.course = course
      if (error) console.log(error);
    },
    async import() {
      // stuff
    },
    async export() {
      // stuff
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCourseStore, import.meta.hot))
}