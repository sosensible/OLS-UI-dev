import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'
import { useUserStore } from './user';

export type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonState {
  lesson: Lesson | null;
  lessons: Lesson[];
  unitID: number | null;
  unitName: string,
  courseID: number | null;
  courseName: string,
  courseOwner: string,
  listPulled: boolean;
}

export const useLessonStore = defineStore('lesson', {
  state: (): LessonState => ({
    lesson: {
      created_at: null,
      id: 0,
      name: "",
      content: "",
      live: false,
      main_key: null,
      order: 0,
      tag: [],
      unit: 0,
      type: null,
      updated_at: null,
    },
    lessons: [],
    unitID: null,
    unitName: "",
    courseID: null,
    courseName: "",
    courseOwner: "",
    listPulled: false,
  }),
  getters: {
    getCourseID(state) {
      return state.courseID ? state.courseID : 0;
    },
    getUnitID(state) {
      return state.unitID ? state.unitID : 0;
    },
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
        live: false,
        order: 0,
        tag: [],
        main_key: null,
        type: null,
        unit: null,
        updated_at: null,
      };
      this.lessons.push(newLesson);
    },
    async insertLesson(unitID: number): Promise<number> {
      console.log('unit insertLesson run');
      const { data: lesson, error } = await supabase.from('lessons').insert({
        name: this.lesson?.name,
        content: this.lesson?.content,
        live: this.lesson?.live,
        unit: unitID,
      }).select().single();
      if (lesson) {
        // @ts-ignore
        this.lesson.id = lesson.id;
        console.log(lesson);
      }
      if (error) console.log(error);
      return this.lesson.id;
    },
    async updateLesson(): Promise<number> {
      const { data: lesson, error } = await supabase.from('lessons').update({
        name: this.lesson?.name,
        content: this.lesson?.content,
        live: this.lesson?.live,
      })
        .eq('id', this.lesson?.id)
        .select().single();
      if (lesson) {
        // @ts-ignore
        this.lesson.id = lesson.id;
        this.lessons.length = 0;
      }
      if (error) console.log(error);
      // @ts-ignore
      return this.lesson?.id;
    },
    async deleteLesson() {
      const { data, error } = await supabase.from('lessons').delete().eq('id', this.lesson.id);
      if (data) {
        this.newLesson();
        this.lessons.length = 0;
      }
      if (error) alert(error.details);
    },
    newLesson() {
      this.lesson = {
        created_at: null,
        id: 0,
        name: "",
        content: "",
        main_key: 0,
        live: false,
        order: 0,
        tag: [],
        type: "",
        unit: 0,
        updated_at: null,
      } as Lesson;
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
        id, name, content,
        units( id, name, courses ( id, name, owner ))
        `).eq('id', id).single();
      if (lesson) {
        this.unitID = lesson.units.id;
        this.unitName = lesson.units.name;
        this.courseID = lesson.units.courses.id;
        this.courseName = lesson.units.courses.name;
        this.courseOwner = lesson.units.courses.owner;
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