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
          path: "update/:viewid",
          name: "review-update",
          component: () => import("@/components/review/VReviewUpdate.vue"),
        },
        {
          path: "view/:viewid",
          name: "review-view",
          component: () => import("@/components/review/VReviewView.vue"),
        },
      ],
    },
    {
      path: "/member",
      name: "member",
      component: () => import("@/views/MemberView.vue"),
      redirect: { name: "member-signin" },  
      children: [
        {
          path: "signin",
          name: "member-signin",
          component: () => import("@/components/member/MemberSignin.vue"),
        },
        {
          path: "signup",
          name: "member-signup",
          component: () => import("@/components/member/MemberSignup.vue"),
        },
        {
          path: "signout",
          name: "member-signout",
          component: () => import("@/components/member/MemberSignout.vue"),
        },
        {
          path: "update",
          name: "member-update",
          component: () => import("@/components/member/MemberUpdate.vue"),
        },
        {
          path: "delete",
          name: "member-delete",
          component: () => import("@/components/member/MemberDelete.vue"),
        },
        {
          path: "mypage",
          name: "member-mypage",
          component: () => import("@/components/member/MemberMypage.vue"),
        },
        {
          path: "findpassword",
          name: "member-findpassword",
          component: () => import("@/components/member/MemberFindPassword.vue"),
        },
      ],
    },
  ]
})

export default router
