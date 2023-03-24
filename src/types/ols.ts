import type { Database } from "./schema";

type LessonContent = Database['public']['Tables']['lesson_content']['Row']

type Lesson = Database['public']['Tables']['lessons']['Row'] & {
  lesson_content: Database['public']['Tables']['lesson_content']['Row'][] | null
}

type Unit = Database['public']['Tables']['units']['Row'] & {
  lessons: Database['public']['Tables']['lessons']['Row'][] | null
}

type Course = Database['public']['Tables']['courses']['Row'] & {
  units: Database['public']['Tables']['units']['Row'][] | null
}

// export interface OLS2 extends Database {
//   course: {
//     units: Database['public']['Tables']['units']['Row'][]
//   }
// }

export interface OLS {
  Store: {
    Course: Course,
    Unit: Unit,
    Lesson: Lesson,
    LessonContent: LessonContent,
  },
  StoreInsert: {
    Course: Database['public']['Tables']['courses']['Insert'],
    Unit: Database['public']['Tables']['courses']['Insert'],
    Lesson: Database['public']['Tables']['courses']['Insert'],
    LessonContent: Database['public']['Tables']['courses']['Insert'],
  },
  StoreUpdate: {
    Course: Database['public']['Tables']['courses']['Update'],
    Unit: Database['public']['Tables']['courses']['Update'],
    Lesson: Database['public']['Tables']['courses']['Update'],
    LessonContent: Database['public']['Tables']['courses']['Update'],
  },
  shared: {
    comment: {
      comment_target_id: Number,
      comment_time: Date,
      detail: String,
      position: Number,
      target_type: String,
      content_type: String,
    }
  }
}