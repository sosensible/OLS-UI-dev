import type { Database } from '../../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../../supabase'
import { useUserStore } from '../user';
import { unref } from 'vue'

export type Course = Database['public']['Tables']['courses']['Row'];

interface CourseState {
  course: Course | null;
  courses: Course[];
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
} as Course;

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    course: courseDefault,
    courses: [],
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
    async insertCourse(): Promise<number> {
      const userStore = useUserStore();
      const { data: course, error } = await supabase.from('courses').insert({
        name: this.course?.name,
        detail: this.course?.detail,
        live: this.course?.live,
        owner: userStore.user.id,
      }).select().single();
      if (course) {
        // @ts-ignore
        this.course.id = course.id
        console.log(course);
        this.courses.length = 0;
      }
      if (error) { console.log(error) }
      // @ts-ignore
      return this.course.id;
    },
    async updateCourse(): Promise<number> {
      const { data: course, error } = await supabase.from('courses').update({
        name: this.course?.name,
        detail: this.course?.detail,
        live: this.course?.live,
      })
        .eq('id', this.course?.id)
        .select().single();
      if (course) {
        // @ts-ignore
        this.course.id = course.id;
        console.log(course);
        this.courses.length = 0;
      }
      if (error) { console.log(error) }
      // @ts-ignore
      return this.course.id;
    },
    async deleteCourse() {
      const { data, error } = await supabase.from('courses').delete().eq('id', this.course.id);
      if (data) {
        this.newCourse();
        this.courses.length = 0;
      }
      if (error) {
        alert(error.details);
      }
    },
    newCourse() {
      this.course = {
        created_at: null,
        id: 0,
        name: "",
        detail: "",
        image: null,
        live: false,
        main_key: null,
        owner: null,
        updated_at: null,
      } as Course;
    },
    async pullCourseList(searchText: string) {
      const { data: courses, error } = await supabase.from('courses').select(`
        id, name, detail,
        owner ( id, full_name )
      `).ilike("name", `%${searchText}%`);
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
    activeUnitList(mode: string = "") {
      if (["add", "edit"].includes(mode)) {
        return this.course?.units;
      } else {
        const userStore = useUserStore();
        const units = this.course.units ? this.course.units : [];
        const my = this;
        return units.filter((unit) => {
          const isLive = unit.live ? unit.live : false;
          return isLive || my.course?.owner?.id == userStore.user.id;
        });
      }
    },
    async load(id: number) {
      const { data: course, error } = await supabase.from('courses').select(`
        id, name, detail, live,
        units ( id, name, live ),
        owner ( id, full_name )
        `).eq('id', id).single();
      // @ts-ignore
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