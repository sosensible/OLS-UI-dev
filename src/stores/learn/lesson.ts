import type { OLS } from '../../types/ols'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../../supabase'
import { useUserStore } from '../user';

interface LessonState {
  lesson: OLS['Store']['Lesson'] | null;
  lessons: OLS['Store']['Lesson'][];
  lesson_content: OLS['Store']['LessonContent'][];
  lesson_comments: OLS['Store']['Comment'][];
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
      lesson_content: []
    },
    lessons: [],
    lesson_content: [],
    lesson_comments: [],
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
      return item?.content ? item?.content : "";
    },
    getActiveContentType(state): string {
      let item = { type: "" };
      if (state.lesson?.lesson_content?.length) {
        // @ts-ignore
        item = state.lesson.lesson_content.find(o => o.id === state.activeLessonContent);
      }
      return item?.type ? item?.type : "";
    },
    getActiveContent(state): Object {
      let item: OLS['Store']['LessonContent'] | {} = {};
      if (state.lesson_content?.length) {
        // @ts-ignore
        item = state.lesson_content.find(o => o.id === state.activeLessonContent);
      }
      return item;
    },
    getActiveComments(state): OLS['Store']['Comment'][] {
      // @ts-ignore
      return state.lesson_comments.filter(comment => comment.target_id === state.getActiveContent.id);
    }
  },
  actions: {
    async insertLesson(unitID: number): Promise<number> {
      const { data: lesson, error } = await supabase.from('lessons').insert({
        name: this.lesson?.name,
        shortDesc: this.lesson?.shortDesc,
        live: this.lesson?.live,
        unit: unitID,
      }).select().single();
      if (lesson) {
        // @ts-ignore
        this.lesson.id = lesson.id;
        this.storeLessonContent();
      }
      if (error) console.log(error);
      return this.lesson.id;
    },
    async updateLesson(): Promise<number> {
      console.log('updating lesson');
      const { data: lesson, error } = await supabase.from('lessons').update({
        name: this.lesson?.name,
        shortDesc: this.lesson?.shortDesc,
        live: this.lesson?.live,
      })
        .eq('id', this.lesson?.id)
        .select().single();
      if (lesson) {
        console.log('lesson updated:', lesson)
        if (this.lesson?.id === lesson.id && this.lesson_content.length) await this.storeLessonContent();
        this.lessons.length = 0;
      }
      if (error) console.log(error);
      // @ts-ignore
      return this.lesson?.id;
    },
    async storeLessonContent() {
      this.lesson_content.forEach((lc) => {
        if (lc.id > 0) {
          this.updateLessonContent(lc);
        } else {
          this.insertLessonContent(lc);
        }
      });
    },
    async insertLessonContent(lc: OLS['StoreInsert']['LessonContent']) {
      console.log('inserting lesson content');
      const { data: lesson_content, error } = await supabase.from('lesson_content').insert({
        alt_name: lc.alt_name,
        content: lc.content,
        tags: lc.tags,
        type: lc.type,
        lesson: this.lesson?.id,
      }).select().single();
      if (lesson_content) lc.id = lesson_content.id;
      if (error) console.log(error);
    },
    async updateLessonContent(lc) {
      console.log('updating lesson content');
      const { data: lesson_content, error } = await supabase.from('lesson_content').update({
        alt_name: lc.alt_name,
        content: lc.content,
        tags: lc.tags,
        type: lc.type,
        lesson: this.lesson?.id,
      }).eq('id', lc.id).select().single();
      if (lesson_content) lc.id = lesson_content.id;
      if (error) console.log(error);
    },
    async deleteLessonContent(id) {
      const { data, error } = await supabase.from('lesson_content').delete().eq('id', id);
      if (data) {
        // shift to first remaining lesson, if one exists
      }
      if (error) alert(error.details);
    },
    async deleteLesson() {
      const { data, error } = await supabase.from('lessons').delete().eq('id', this.lesson.id);
      if (data) {
        this.newLesson();
        this.lessons.length = 0;
        this.lesson_comments.length = 0;
      }
      if (error) alert(error.details);
    },
    addLessonContentSection(): Number {
      const newContent = {
        "id": --this.content_id,
        "alt_name": "Rename" + this.content_id,
        "content": "",
        "type": "markdown",
        "tags": null
      };
      this.lesson_content.push(newContent);
      return this.content_id;
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
      this.lesson_content.length = 0;
      this.lesson_comments.length = 0;
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
      const userStore = useUserStore();
      this.activeLessonContent = 0;
      this.lesson_comments.length = 0;
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
        if (lesson?.lesson_content?.length) {
          this.activeLessonContent = lesson.lesson_content[0].id;
          const { data: comments, error: c_error } = await supabase.from('comments').select(`
            *
          `)
            .eq('course', this.courseID)
            .eq('commentor', userStore.user.id)
            .eq('target_type', 'lesson_content')
            .in('target_id', lesson.lesson_content.map(lc => lc.id));
          if (comments) {
            this.lesson_comments.length = 0;
            comments.forEach((comment) => {
              console.log('comment', comment);
              this.lesson_comments.push(comment);
            })
          }
          if (c_error) console.log(c_error);
        }
      }
      if (error) console.log(error);
    },
    async import() {
      // stuff
    },
    async export() {
      // stuff
    },
    // lesson content comment handlers
    async loadComments() {
      // refactor out of load lesson
    },
    async deleteComment(xcomment: OLS['Store']['Comment']) {
      const removeID = this.lesson_comments.findIndex((comment) => comment.id === xcomment.id);
      if (removeID > -1) this.lesson_comments.splice(removeID, 1);
      const { error } = await supabase.from('comments').delete().eq('id', xcomment.id);
      if (error) console.log(error);
    },
    async saveComment(newComment: OLS['StoreInsert']['Comment']): Promise<number> {
      const userStore = useUserStore();
      const { data: comment, error } = await supabase.from('comments').insert({
        commentor: userStore.user?.id,
        course: newComment.course,
        content_type: newComment.content_type,
        detail: newComment.detail,
        position: newComment.position,
        target_id: newComment.target_id,
        target_type: 'lesson_content',
      }).select().single();
      if (comment) {
        newComment.id = comment.id;
      }
      if (error) { console.log(error) }
      return newComment.id ? newComment.id : 0;
    },
    async exportComments() {
      // stuff
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLessonStore, import.meta.hot))
}