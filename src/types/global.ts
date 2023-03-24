import type { Database } from "./schema";
import User from '@supabase/supabase-js';
export interface OLS2 extends Database {
  course: {
    units: Database['public']['Tables']['units']['Row'][]
  }
}

// const course: Database['public']['Tables']['courses']['Row'];
// const courses: Database['public']['Tables']['courses']['Row'][];

// interface myCourse {
//   id: Database.pu
// }
export declare interface Stuff {
  id?: number | undefined;
  name?: string | undefined;
}