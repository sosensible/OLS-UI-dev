import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'
import { useCourseStore } from './course';
import { useUserStore } from './user';

export type Unit = Database['public']['Tables']['units']['Row'];

interface UnitState {
  unit: Unit | null;
  units: Unit[];
  courseID: number | null;
  courseName: string | null;
  listPulled: boolean;
}

// const courseStore = useCourseStore();

const unitDefault = {
  created_at: null,
  id: 0,
  name: "",
  content: "",
  image: null,
  live: false,
  main_key: null,
  course: 0,
  updated_at: null,
} as Unit

export const useUnitStore = defineStore('unit', {
  state: (): UnitState => ({
    unit: unitDefault,
    units: [],
    courseID: null,
    courseName: null,
    listPulled: false,
  }),
  getters: {
    getUnitList(state) {
      return state.units;
    },
    getCourseId(state) {
      return state.courseID ? state.courseID : 0;
    }
  },
  actions: {
    async insertUnit(courseID) {
      console.log('unit insertUnit run')
      const { data: unit, error } = await supabase.from('units').insert({
        name: this.unit?.name,
        content: this.unit?.content,
        live: this.unit?.live,
        course: courseID,
      }).select().single();
      if (unit) {
        // @ts-ignore
        this.unit.id = unit.id
        console.log(unit);
      }
      if (error) { console.log(error) }
      return this.unit?.id;
    },
    async updateUnit(): Promise<number> {
      const { data: unit, error } = await supabase.from('units').update({
        name: this.unit?.name,
        content: this.unit?.content,
        live: this.unit?.live,
      })
        .eq('id', this.unit?.id)
        .select().single();
      if (unit) {
        // @ts-ignore
        this.unit.id = unit.id
        console.log(unit);
        this.units.length = 0;
      }
      if (error) { console.log(error) }
      // @ts-ignore
      return this.unit?.id;
    },
    async deleteUnit() {
      const { data, error } = await supabase.from('units').delete().eq('id', this.unit.id);
      if (data) {
        this.newUnit();
        this.units.length = 0;
      }
      if (error) {
        alert(error.details);
      }
    },
    newUnit() {
      this.unit = {
        created_at: null,
        id: 0,
        name: "",
        content: "",
        image: null,
        live: false,
        main_key: null,
        course: 0,
        updated_at: null,
      } as Unit;
    },
    async pullUnitList(searchText: string) {
      const { data: units, error } = await supabase.from('units').select().ilike("name", `%${searchText}%`);
      if (units) {
        this.units.length = 0;
        units.forEach((item) => {
          this.units.push(item);
          this.listPulled = true;
        });
      }
      if (error) {
        console.log(error);
      }
    },
    async load(id: number) {
      const { data: unit, error } = await supabase.from('units').select(`
        id,name,content,
        lessons ( * ),
        course ( id, name )
        `).eq('id', id).single();
      if (unit) {
        this.courseID = unit.course?.id;
        this.courseName = unit.course?.name;
        delete unit.course;
        this.unit = unit;
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
  import.meta.hot.accept(acceptHMRUpdate(useUnitStore, import.meta.hot))
}