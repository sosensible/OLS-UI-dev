import type { Database } from "./schema";
import User from '@supabase/supabase-js';
export interface ols extends Database {
  course: {
    units: Database['public']['Tables']['unit']['Row'][]
  }
}

const course: Database['public']['Tables']['course']['Row'];
const courses: Database['public']['Tables']['course']['Row'][];

// interface myCourse {
//   id: Database.pu
// }
export declare interface Stuff {
  id?: number | undefined;
  name?: string | undefined;
}