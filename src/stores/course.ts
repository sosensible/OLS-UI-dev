import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'

interface CourseState {
  course: Database['public']['Tables']['course']['Row'] | null;
  courses: Database['public']['Tables']['course']['Row'][];
  count: number;
  listPulled: boolean;
}

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    course: {
      created_at: null,
      id: 0,
      name: "",
      detail: "",
      image: null,
      live: false,
      main_key: null,
      owner: null,
      updated_at: null,
    },
    courses: [],
    count: 0,
    listPulled: false,
  }),
  getters: {
    getCourseList(state) {
      return state.courses;
    },
    getCourse(state) {
      return state.course;
    }
  },
  actions: {
    async addCourse() {
      const newCourse: Database['public']['Tables']['course']['Row'] = {
        created_at: null,
        id: 11,
        name: "CC 4",
        detail: "After Learning CC",
        image: null,
        live: false,
        main_key: null,
        owner: null,
        updated_at: null,
      };
      this.courses.push(newCourse);
    },
    increment() {
      this.count++
    },
    async pullCourseList(searchText: string) {
      const { data: courses, error } = await supabase.from('courses').select().ilike("name", `%${searchText}%`);
      if (courses) {
        this.courses.length = 0;
        courses.forEach((item) => {
          this.courses.push(item);
          this.listPulled = true;
        });
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
        id, name,
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