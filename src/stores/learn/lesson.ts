import type { Database } from '../../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../../supabase'
import { useUserStore } from '../user';

export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonContent = Database['public']['Tables']['lesson_content']['Row']

interface LessonState {
  lesson: Lesson | null;
  lessons: Lesson[];
  lesson_content: LessonContent[];
  content_id: number;
  unitID: number | null;
  unitName: string;
  courseID: number | null;
  courseName: string;
  courseOwner: string;
  listPulled: boolean;
  activeLessonContent: number | null;
}

export const useLessonStore = defineStore('lesson', {
  state: (): LessonState => ({
    lesson: {
      created_at: null,
      id: 0,
      name: "",
      shortDesc: "",
      live: false,
      main_key: null,
      order: 0,
      tag: [],
      unit: 0,
      type: null,
      updated_at: null,
    },
    lessons: [],
    lesson_content: [],
    content_id: 0,
    unitID: null,
    unitName: "",
    courseID: null,
    courseName: "",
    courseOwner: "",
    listPulled: false,
    activeLessonContent: 0,
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
    },
    getActiveLessonContent(state): string {
      let item = { content: "" };
      if (state.lesson?.lesson_content?.length) {
        // @ts-ignore
        item = state.lesson.lesson_content.find(o => o.id === state.activeLessonContent);
      }
      console.log('lesson', state.lesson);
      console.log('lesson_content/length', state.lesson.lesson_content);
      console.log('item', item);
      return item.content ? item.content : "";
    }
  },
  actions: {
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
    addLessonContentSection() {
      const newContent = {
        "id": --this.content_id,
        "alt_name": "Rename" + this.content_id,
        "content": "",
        "type": "markdown",
        "tags": null
      };
      this.lesson_content.push(newContent);
    },
    async deleteLessonContent(lessonContent) {
      const { data, error } = await supabase.from('lesson-content').delete().eq('id', this.lesson.id);
      if (data) {
        // this.newLesson();
        // this.lessons.length = 0;
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
        shortDesc: "",
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
      this.activeLessonContent = 0;
      const { data: lesson, error } = await supabase.from('lessons').select(`
        id, name, shortDesc, live,
        lesson_content( id, alt_name, content, type, tags ),
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
        this.lesson_content = lesson.lesson_content;
        if (lesson?.lesson_content?.length) this.activeLessonContent = lesson.lesson_content[0].id;
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