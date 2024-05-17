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
      path: '/chat/:matchId',
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
    {
      path: "/review",
      name: "review",
      component: () => import("@/views/ReviewView.vue"),
      redirect: { name: "review-list" },  
      children: [
        {
          path: "list",
          name: "review-list",
          component: () => import("@/components/review/VReviewList.vue"),
        },
        {
          path: "write",
          name: "review-write",
          component: () => import("@/components/review/VReviewWrite.vue"),
        },
        {
          path: "update",
          name: "review-update",
          component: () => import("@/components/review/VReviewUpdate.vue"),
        },
      ],
    },
  ]
})

export default router
