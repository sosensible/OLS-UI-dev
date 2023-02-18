import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import LearnView from '../views/learn/OLSView.vue'
import CourseListView from '../views/learn/CourseListView.vue'
import CourseView from '../views/learn/CourseView.vue'
import UnitView from '../views/learn/UnitView.vue'
import LessonView from '../views/learn/LessonView.vue'
import NewsView from '../views/NewsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/learn',
      component: LearnView,
      children: [
        {
          path: '',
          name: 'olsMain',
          component: CourseListView
        },
        {
          path: 'course/:id/:action?',
          name: 'olsCourse',
          component: CourseView,
          props: true,
        },
        {
          path: 'unit/:id/:action?/:course_id?',
          name: 'olsUnit',
          component: UnitView,
          props: true,
        },
        {
          path: 'lesson/:id/:action?/:lesson_id?',
          name: 'olsLesson',
          component: LessonView,
          props: true,
        },
      ]
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
