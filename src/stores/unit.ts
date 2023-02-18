import type { Database } from '../types/schema'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { supabase } from '../supabase'

interface UnitState {
  unit: Database['public']['Tables']['unit']['Row'] | null;
  units: Database['public']['Tables']['unit']['Row'][];
  courseID: number | null;
  courseName: string | null;
  count: number;
  listPulled: boolean;
}

export const useUnitStore = defineStore('unit', {
  state: (): UnitState => ({
    unit: {
      created_at: null,
      id: 0,
      name: "",
      content: "",
      image: null,
      live: false,
      main_key: null,
      course: 0,
      updated_at: null,
    },
    units: [],
    courseID: null,
    courseName: null,
    count: 0,
    listPulled: false,
  }),
  getters: {
    getUnitList(state) {
      return state.units;
    }
  },
  actions: {
    async addUnit() {
      const newUnit: Database['public']['Tables']['unit']['Row'] = {
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
      this.units.push(newUnit);
    },
    increment() {
      this.count++
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
        this.courseID = unit.course.id;
        this.courseName = unit.course.name;
        delete unit.course
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