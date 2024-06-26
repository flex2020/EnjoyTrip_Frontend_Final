import { createRouter, createWebHistory, useRoute } from "vue-router";
import MainView from "@/views/MainView.vue";
import ReviewView from "@/views/ReviewView.vue";
import ChatView from "@/views/ChatView.vue";
import MatchView from "@/views/MatchView.vue";
import PlanView from "@/views/PlanView.vue";
import MyPageView from "@/views/MyPageView.vue";
import { getMatchesByMemberId } from "@/api/match";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    {
      path: "/chat/:matchId",
      name: "chat",
      component: ChatView,
      beforeEnter: canEnterChat,
    },
    {
      path: "/match",
      name: "match",
      component: MatchView,
    },
    {
      path: "/plan",
      name: "plan",
      component: PlanView,
      beforeEnter: login,
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
          beforeEnter: login,
          component: () => import("@/components/review/VReviewWrite.vue"),
        },
        {
          path: "update/:viewid",
          name: "review-update",
          beforeEnter: login,
          component: () => import("@/components/review/VReviewUpdate.vue"),
        },
        {
          path: "view/:viewid",
          name: "review-view",
          beforeEnter: login,
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
          beforeEnter: login,
          component: () => import("@/components/member/MemberSignout.vue"),
        },
        {
          path: "update",
          name: "member-update",
          beforeEnter: login,
          component: () => import("@/components/member/MemberUpdate.vue"),
        },
        {
          path: "delete",
          name: "member-delete",
          beforeEnter: login,
          component: () => import("@/components/member/MemberDelete.vue"),
        },
        {
          path: "mypage",
          name: "member-mypage",
          beforeEnter: login,
          component: () => import("@/components/member/MemberMypage.vue"),
        },
        {
          path: "findpassword",
          name: "member-findpassword",
          component: () => import("@/components/member/MemberFindPassword.vue"),
        },
        {
          path: "resetpassword",
          name: "member-resetpassword",
          component: () => import("@/components/member/MemberResetPassword.vue"),
        },
      ],
    },
    {
      path: "/mypage/:memberId",
      name: "mypage",
      component: () => import("@/views/MyPageView.vue"),
      beforeEnter: login,
      redirect: { name: "mypage-profile" },
      children: [
        {
          path: "profile",
          name: "mypage-profile",
          component: () => import("@/components/mypage/MyProfile.vue"),
        },
        {
          path: "reviews",
          name: "mypage-reviews",
          component: () => import("@/components/mypage/MyReviews.vue"),
        },
        {
          path: "matches",
          name: "mypage-matches",
          component: () => import("@/components/mypage/MyMatches.vue"),
        },
        {
          path: "profileupdate",
          name: "mypage-profileupdate",
          component: () => import("@/components/mypage/MyProfileUpdate.vue"),
        },
        {
          path: "withdraw",
          name: "mypage-withdraw",
          component: () => import("@/components/mypage/MyWithdraw.vue"),
        },
      ],
    },
    {
      path: "/match",
      name: "match",
      beforeEnter: login,
      component: () => import("@/views/MatchView.vue"),
      redirect: { name: "match-list" },
      children: [
        {
          path: "list",
          name: "match-list",
          component: () => import("@/components/match/MatchList.vue"),
        },
        {
          path: "write",
          name: "match-write",
          component: () => import("@/components/match/MatchWrite.vue"),
        },
        {
          path: "update/:matchid",
          name: "match-update",
          component: () => import("@/components/match/MatchUpdate.vue"),
        },
        {
          path: "view/:matchid",
          name: "match-view",
          component: () => import("@/components/match/MatchView.vue"),
        },
      ],
    },
  ],
});

async function canEnterChat(to, from, next) {
  const authStore = useAuthStore();
  const matchId = to.params.matchId;
  const memberId = authStore.getMemberId;
  const chatList = await getMatchesByMemberId(memberId);
  console.log(matchId);
  console.log(chatList);
  let flag = false;
  for (let i = 0; i < chatList.length; i++) {
    if (chatList[i].matchId == matchId) {
      flag = true;
      next();
      return;
    }
  }
  if (!flag) {
    alert("입장할 수 없는 채팅방입니다.");
    router.push({ name: "main" });
  }
}

function login(to, from, next) {
  const authStore = useAuthStore();
  const memberId = authStore.getMemberId;
  if (!memberId) {
    alert('로그인 후 이용하실 수 있습니다.');
    router.push({ name: 'member-signin'})
    return;
  }
  next();
}
export default router;
