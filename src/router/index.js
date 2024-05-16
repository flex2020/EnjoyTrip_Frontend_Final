import { createRouter, createWebHistory } from 'vue-router'
import MainView from "@/views/MainView.vue"
import ReviewView from "@/views/ReviewView.vue"
import ChatView from "@/views/ChatView.vue"
import MatchView from "@/views/MatchView.vue"
import PlanView from "@/views/PlanView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView 
    },
    {
      path: '/match',
      name: 'match',
      component: MatchView
    },
    {
      path: '/plan',
      name: 'plan',
      component: PlanView
    },
  ]
})

export default router
