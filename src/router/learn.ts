import LearnView from '../views/learn/OLSView.vue'
import CourseListView from '../views/learn/CourseListView.vue'
import CourseEdit from '../views/learn/CourseEdit.vue'
import CourseView from '../views/learn/CourseView.vue'
import UnitEdit from '../views/learn/UnitEdit.vue'
import UnitView from '../views/learn/UnitView.vue'
import LessonEdit from '../views/learn/LessonEdit.vue'
import LessonView from '../views/learn/LessonView.vue'

export const learnRoutes = {
  path: '/learn',
  component: LearnView,
  children: [
    {
      path: '',
      name: 'olsMain',
      component: CourseListView,
      meta: {
        reload: true,
      }
    },
    {
      path: 'course/:id/:action',
      name: 'olsCourseEdit',
      component: CourseEdit,
      props: true,
      meta: {
        reload: true,
      }
    },
    {
      path: 'course/:id/',
      name: 'olsCourse',
      component: CourseView,
      props: true,
      meta: {
        reload: true,
      }
    },
    {
      path: 'unit/:id/:action/:course_id',
      name: 'olsUnitEdit',
      component: UnitEdit,
      props: true,
      meta: {
        reload: true,
      }
    },
    {
      path: 'unit/:id',
      name: 'olsUnit',
      component: UnitView,
      props: true,
      meta: {
        reload: true,
      }
    },
    {
      path: 'lesson/:id/:action/:unit_id',
      name: 'olsLessonEdit',
      component: LessonEdit,
      props: true,
      meta: {
        reload: true,
      }
    },
    {
      path: 'lesson/:id',
      name: 'olsLesson',
      component: LessonView,
      props: true,
      meta: {
        reload: true,
      }
    },
  ]
};

export default learnRoutes;