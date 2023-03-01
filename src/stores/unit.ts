import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'
import { useCourseStore } from './course';
import { useUserStore } from './user';

interface UnitState {
  unit: Database['public']['Tables']['units']['Row'] | null;
  units: Database['public']['Tables']['units']['Row'][];
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
} as Database['public']['Tables']['units']['Row']

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
    }
  },
  actions: {
    async insertUnit() {
      const userStore = useUserStore();
      const { data: unit, error } = await supabase.from('units').insert({
        name: this.unit?.name,
        content: this.unit?.content,
        live: this.unit?.live,
        owner: userStore.user.id,
      }).select().single();
      if (unit) {
        // @ts-ignore
        this.unit.id = unit.id
        console.log(unit);
      }
      if (error) { console.log(error) }
    },
    async updateCourse() {
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
      }
      if (error) { console.log(error) }
    },
    newUnit() {
      this.unit = unitDefault;
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
    async save() {
      this.unit?.id
    },
    async load(id: number) {
      const { data: unit, error } = await supabase.from('units').select(`
        id,name,
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