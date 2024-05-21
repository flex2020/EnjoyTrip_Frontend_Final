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
  // console.log(updateComment.value);
  await http.put("review/comments", updateComment.value);
  updateComment.value.commentId = -1;
  updateComment.value.content = "";
  emit("getComment");
};

const commentDelete = async (commentId) => {
  await http.delete(`/review/comments/${commentId}`);

  emit("getComment");
};
</script>

<template>
  <div>댓글</div>
  <form @submit.prevent="addComment" id="review-comment-input-container">
    <textarea v-model="newComment.content" type="text" placeholder="댓글을 입력하세요"></textarea>
    <button type="submit" class="reply-btn">댓글 작성</button>
  </form>
  <div>
    <div
      class="comment"
      v-for="(comment, index) in comments"
      :key="comment.commentId"
      :style="{
        marginLeft: Number(comment.depth) > 0 ? '20px' : '0',
      }"
    >
      <div v-if="comment.deleted == 0" id="comment-container">
        <div id="comment-nickname">{{ comment.nickName }}</div>
        <div class="comment-content-container">
          <span id="comment-replyParentName">{{
            comment.replyParentName == null ? "" : "@" + comment.replyParentName
          }}</span>
          {{ comment.content }}
        </div>
        <div class="comment-anchor-container">
          <a
            @click="
              setCurrentReply(
                comment.commentGroup,
                Number(comment.depth) + 1,
                index,
                comment.commentId
              )
            "
          >
            {{ newReply.replyTo == index ? "취소" : "답글작성" }}</a
          >
          <a
            v-show="comment.memberId === authStore.memberId ? true : false"
            style="margin-left: 7px"
            @click="commentDelete(comment.commentId)"
            >삭제</a
          >
          <a
            v-show="comment.memberId === authStore.memberId ? true : false"
            style="margin-left: 7px"
            @click="setUpdateComment(comment.commentId, comment.content)"
            >{{ updateComment.commentId != comment.commentId ? "댓글수정" : "취소" }}</a
          >
        </div>
        <div v-show="updateComment.commentId == comment.commentId">
          <form @submit.prevent="commentUpdate" id="comment-update-form">
            <div>
              <textarea rows="2" v-model="updateComment.content" required></textarea>
            </div>
            <div id="comment-update-btns">
              <button type="submit">댓글 수정</button>
              <button type="button">취소</button>
            </div>
          </form>
        </div>
        <!-- 대댓글 작성 -->
        <div
          :id="`comment${comment.commentId}`"
          :style="{
            display: index === newReply.replyTo ? 'block' : 'none',
          }"
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
              <button type="submit">답글 작성</button>
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
#review-comment-input-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 10px;
}

#review-comment-input-container textarea {
  width: 100%;
  height: 100px;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
}

#review-comment-input-container button {
  width: 15%;
  height: 30px;
}

.reply-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  background-color: black;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.comment {
  margin-bottom: 10px;
}

.comment-content-container {
  background-color: gainsboro;
  height: 60px;
  border-radius: 5px;
  padding-left: 5px;
  padding-top: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
}

.comment-anchor-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}

.comment-anchor-container a {
  border: 1px solid gray;
  border-radius: 3px;
  background-color: gray;
  padding: 3px;
  font-size: 14px;
  color: white;
  cursor: pointer;
}

#comment-nickname {
  font-weight: bold;
}

#comment-replyParentName {
  color: rgb(0, 2, 150);
  font-weight: bold;
  margin-right: 5px;
}

#comment-update-form {
  display: flex;
  flex-direction: column;
}

#comment-update-form textarea {
  width: 100%;
  height: 50px;
}
#comment-update-btns {
  display: flex;
  justify-content: flex-end;
}

#comment-update-btns button {
  border: 1px solid gray;
  border-radius: 3px;
  background-color: gray;
  padding: 3px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  margin-left: 3px;
}

#comment-reply-form {
  display: flex;
  flex-direction: column;
}

#comment-reply-form textarea {
  width: 100%;
  height: 50px;
}

#comment-reply-btns {
  display: flex;
  justify-content: flex-end;
}

#comment-reply-form button {
  border: 1px solid gray;
  border-radius: 3px;
  background-color: gray;
  padding: 3px;
  font-size: 14px;
  color: white;
  cursor: pointer;
}
</style>
