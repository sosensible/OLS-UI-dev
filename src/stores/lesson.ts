import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'

export type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonState {
  lesson: Lesson | null;
  lessons: Lesson[];
  unitID: number | null;
  unitName: string,
  courseID: number | null;
  courseName: string,
  count: number;
  listPulled: boolean;
}

export const useLessonStore = defineStore('lesson', {
  state: (): LessonState => ({
    lesson: {
      created_at: null,
      id: 0,
      name: "",
      content: "",
      main_key: null,
      unit: 0,
      type: null,
      updated_at: null,
    },
    lessons: [],
    unitID: null,
    unitName: "",
    courseID: null,
    courseName: "",
    count: 0,
    listPulled: false,
  }),
  getters: {
    getLesson(state) {
      return state.lesson;
    },
    getLessonList(state) {
      return state.lessons;
    }
  },
  actions: {
    async addLesson() {
      const newLesson: Lesson = {
        created_at: null,
        id: 11,
        name: "CC 4",
        content: "After Learning CC",
        main_key: null,
        type: null,
        unit: null,
        updated_at: null,
      };
      this.lessons.push(newLesson);
    },
    increment() {
      this.count++
    },
    async pullLessonList(searchText: string) {
      const { data: lessons, error } = await supabase.from('lessons').select().ilike("name", `%${searchText}%`);
      if (lessons) {
        this.lessons.length = 0;
        lessons.forEach((item) => {
          this.lessons.push(item);
          this.listPulled = true;
        });
      }
      if (error) {
        console.log(error);
      }
    },
    async save() {
      this.lesson?.id
    },
    async load(id: number) {
      const { data: lesson, error } = await supabase.from('lessons').select(`
        id, name,
        units( id, name, courses ( id, name ))
        `).eq('id', id).single();
      if (lesson) {
        this.unitID = lesson.units.id;
        this.unitName = lesson.units.name;
        this.courseID = lesson.units.courses.id;
        this.courseName = lesson.units.courses.name;
        delete lesson.units;
        this.lesson = lesson;
      }
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
  import.meta.hot.accept(acceptHMRUpdate(useLessonStore, import.meta.hot))
}