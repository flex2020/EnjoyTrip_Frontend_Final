<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Axios } from "/src/api/http-common";

const http = Axios();
const authStore = useAuthStore();
const emit = defineEmits(["getComment"]);

const router = useRouter();
const route = useRoute();

const props = defineProps({ viewId: String, comments: Array });

const newComment = ref({
  reviewId: props.viewId,
  content: "",
  memberId: authStore.memberId,
});

const newReply = ref({
  reviewId: props.viewId,
  depth: -1,
  content: "",
  commentGroup: -1,
  replyTo: -1,
  replyParentId: -1,
  memberId: authStore.memberId,
});

const updateComment = ref({
  commentId: -1,
  content: "",
});

const isToggle = ref(false);

const addComment = async () => {
  await http.post("review/comments", newComment.value);
  newComment.value.content = "";
  emit("getComment");
};

const setCurrentReply = (commentGroup, depth, index, commentId) => {
  if (index != newReply.value.replyTo) {
    newReply.value.commentGroup = commentGroup;
    newReply.value.depth = depth;
    newReply.value.replyTo = index;
    newReply.value.replyParentId = commentId;
  } else {
    newReply.value.commentGroup = -1;
    newReply.value.depth = -1;
    newReply.value.replyTo = -1;
    newReply.value.content = "";
    newReply.value.replyParentId = -1;
  }
};

const addReply = async () => {
  await http.post(`review/comments-reply`, {
    reviewId: props.viewId,
    depth: newReply.value.depth,
    content: newReply.value.content,
    commentGroup: newReply.value.commentGroup,
    commentId: newReply.value.replyParentId,
    memberId: newReply.value.memberId,
  });
  newReply.value.depth = -1;
  newReply.value.replyTo = -1;
  newReply.value.content = "";
  newReply.value.commentGroup = -1;
  newReply.value.replyParentId = -1;
  emit("getComment");
};

const setUpdateComment = (commentId, content) => {
  if (updateComment.value.commentId != commentId) {
    updateComment.value.commentId = commentId;
    updateComment.value.content = content;
  } else {
    updateComment.value.commentId = -1;
    updateComment.value.content = "";
  }
};

const commentUpdate = async () => {
  await http.put("review/comments", updateComment.value);
  updateComment.value.commentId = -1;
  updateComment.value.content = "";
  emit("getComment");
};

const commentDelete = async (commentId) => {
  await http.delete(`/review/comments/${commentId}`);
  emit("getComment");
};

const cancelReply = () => {
  newReply.value.commentGroup = -1;
  newReply.value.depth = -1;
  newReply.value.replyTo = -1;
  newReply.value.content = "";
  newReply.value.replyParentId = -1;
  isToggle.value = !isToggle.value;
};

// const cancelUpdate = () => {
//   newReply.value.commentGroup = -1;
//   newReply.value.depth = -1;
//   newReply.value.replyTo = -1;
//   newReply.value.content = "";
//   newReply.value.replyParentId = -1;
//   isToggle.value = !isToggle.value;
// };

const toggleFunc = () => {
  isToggle.value = !isToggle.value;
};
</script>

<template>
  <div id="comment-title">댓글</div>
  <form @submit.prevent="addComment" id="review-comment-input-container">
    <textarea v-model="newComment.content" type="text" placeholder="댓글을 입력하세요"></textarea>
    <button type="submit" class="btn comment-submit-btn">댓글 작성</button>
  </form>
  <div>
    <div
      class="comment"
      v-for="(comment, index) in comments"
      :key="comment.commentId"
      :style="{ marginLeft: Number(comment.depth) > 0 ? '20px' : '0' }"
    >
      <div v-if="comment.deleted == 0" id="comment-container">
        <div id="comment-nickname">{{ comment.nickName }}</div>
        <div class="comment-content-container">
          <span id="comment-replyParentName">
            {{ comment.replyParentName == null ? "" : "@" + comment.replyParentName }}
          </span>
          {{ comment.content }}
        </div>
        <div class="comment-anchor-container">
          <a
            v-if="!isToggle"
            @click="
              setCurrentReply(
                comment.commentGroup,
                Number(comment.depth) + 1,
                index,
                comment.commentId
              );
              toggleFunc();
            "
            class="anchor-link"
          >
            답글작성
          </a>
          <a
            v-if="!isToggle"
            v-show="comment.memberId === authStore.memberId"
            @click="commentDelete(comment.commentId)"
            class="anchor-link"
          >
            삭제
          </a>
          <a
            v-if="!isToggle"
            v-show="comment.memberId === authStore.memberId"
            @click="
              setUpdateComment(comment.commentId, comment.content);
              toggleFunc();
            "
            class="anchor-link"
          >
            댓글수정
          </a>
        </div>
        <div v-show="updateComment.commentId == comment.commentId">
          <form @submit.prevent="commentUpdate" id="comment-update-form">
            <div>
              <textarea rows="2" v-model="updateComment.content" required></textarea>
            </div>
            <div id="comment-update-btns">
              <button type="submit" class="btn update-btn" @click="toggleFunc()">댓글 수정</button>
              <button
                type="button"
                class="btn cancel-btn"
                @click="
                  updateComment.commentId = -1;
                  toggleFunc();
                "
              >
                취소
              </button>
            </div>
          </form>
        </div>
        <!-- 대댓글 작성 -->
        <div
          :id="`comment${comment.commentId}`"
          :style="{ display: index === newReply.replyTo ? 'block' : 'none' }"
        >
          <form @submit.prevent="addReply" id="comment-reply-form">
            <div class="form-group">
              <textarea
                id="commentContent"
                name="content"
                rows="2"
                v-model="newReply.content"
                required
              ></textarea>
            </div>
            <div id="comment-reply-btns">
              <button type="submit" class="btn reply-btn" @click="toggleFunc">답글 작성</button>
              <button type="button" class="btn cancel-btn" @click="cancelReply">취소</button>
            </div>
          </form>
        </div>
      </div>

      <div class="comment-content-container" v-if="comment.deleted == 1">
        <p>삭제된 댓글입니다.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#comment-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

#review-comment-input-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 10px;
  font-family: inherit;
}

#review-comment-input-container textarea {
  width: 100%;
  height: 120px;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-family: inherit;
  resize: none; /* 크기 조정 막기 */
  border: 1px solid #ddd;
}

#review-comment-input-container button {
  width: 15%;
  height: 35px;
  font-family: inherit;
  font-weight: bold;
  border-radius: 5px;
}

.comment-submit-btn {
  background-color: #000;
  color: white;
  border: 2px solid #000;
}

.comment-submit-btn:hover {
  background-color: #333;
  color: white;
}

.comment {
  margin-bottom: 10px;
  font-family: inherit;
}

.comment-content-container {
  background-color: gainsboro;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: inherit;
}

.comment-anchor-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  font-family: inherit;
}

.comment-anchor-container .anchor-link {
  border: 2px solid #000;
  border-radius: 5px;
  background-color: #fff;
  padding: 5px 10px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  margin-left: 5px;
  font-family: inherit;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.comment-anchor-container .anchor-link:hover {
  background-color: #ddd;
  color: #000;
}

#comment-nickname {
  font-weight: bold;
  font-family: inherit;
}

#comment-replyParentName {
  color: rgb(0, 2, 150);
  font-weight: bold;
  margin-right: 5px;
  font-family: inherit;
}

#comment-update-form {
  display: flex;
  flex-direction: column;
  font-family: inherit;
}

#comment-update-form textarea {
  width: 100%;
  height: 80px;
  font-family: inherit;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  resize: none; /* 크기 조정 막기 */
}

#comment-update-btns {
  display: flex;
  justify-content: flex-end;
  font-family: inherit;
  margin: 10px 0px;
}

#comment-update-btns .btn {
  border: 2px solid #000;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  margin-left: 5px;
  font-family: inherit;
  font-weight: bold;
}

#comment-update-btns .cancel-btn {
  background-color: #fff;
  color: #000;
}

#comment-update-btns .cancel-btn:hover {
  background-color: #ddd;
  color: #000;
}

#comment-update-btns .update-btn {
  background-color: #000;
  color: #fff;
}

#comment-update-btns .update-btn:hover {
  background-color: #333;
  color: #fff;
}

#comment-reply-form {
  display: flex;
  flex-direction: column;
  font-family: inherit;
}

#comment-reply-form textarea {
  width: 100%;
  height: 80px;
  font-family: inherit;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  resize: none; /* 크기 조정 막기 */
}

#comment-reply-btns {
  display: flex;
  justify-content: flex-end;
  font-family: inherit;
  margin: 10px 0px;
}

#comment-reply-btns .btn {
  border: 2px solid #000;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  margin-left: 5px;
  font-family: inherit;
  font-weight: bold;
}

#comment-reply-btns .cancel-btn {
  background-color: #fff;
  color: #000;
}

#comment-reply-btns .cancel-btn:hover {
  background-color: #ddd;
  color: #000;
}

#comment-reply-btns .reply-btn {
  background-color: #000;
  color: #fff;
}

#comment-reply-btns .reply-btn:hover {
  background-color: #333;
  color: #fff;
}
</style>
