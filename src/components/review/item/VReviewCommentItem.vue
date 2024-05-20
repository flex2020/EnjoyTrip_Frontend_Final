<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Axios } from "/src/api/http-common";

const http = Axios();

const router = useRouter();
const route = useRoute();

const props = defineProps({ viewId: String, comments: Array });
const isDepth = ref(false);

const newComment = ref({
  reviewId: props.viewId,
  content: "",
});

const newReply = ref({
  reviewId: props.viewId,
  depth: -1,
  content: "",
  commentGroup: -1,
  replyTo: -1,
  replyParentId: -1,
});

const updateComment = ref({
  commentId: -1,
  content: "",
});

const addComment = async () => {
  // console.log(props.viewId);
  await http.post("review/comments", newComment.value);
  newComment.value.content = "";
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
  });
  newReply.value.depth = -1;
  newReply.value.replyTo = -1;
  newReply.value.content = "";
  newReply.value.commentGroup = -1;
  newReply.value.replyParentId = -1;
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
  alert("댓글 수정 완료");
};

const commentDelete = async (commentId) => {
  await http.delete(`/review/comments/${commentId}`);
  alert("댓글 삭제 완료");
  // getBoard();
};
</script>

<template>
  <div>
    <div>댓글</div>
    <form @submit.prevent="addComment" id="review-comment-input-container">
      <textarea v-model="newComment.content" type="text" placeholder="댓글을 입력하세요"></textarea>
      <button type="submit">댓글 작성</button>
    </form>
    <div
      class="comment"
      v-for="(comment, index) in comments"
      :key="comment.commentId"
      :style="{
        marginLeft: Number(comment.depth) > 0 ? '20px' : '0',
      }"
    >
      <div>{{ comment.replyParentName == null ? "" : "@" + comment.replyParentName }}</div>
      <div>{{ comment.memberName }}</div>
      <div>{{ comment.content }}</div>
      <a
        @click="
          setCurrentReply(comment.commentGroup, Number(comment.depth) + 1, index, comment.commentId)
        "
      >
        {{ newReply.replyTo == index ? "취소" : "답글작성" }}</a
      >
      <a style="margin-left: 7px" @click="commentDelete(comment.commentId)">삭제</a>
      <a style="margin-left: 7px" @click="setUpdateComment(comment.commentId, comment.content)">{{
        updateComment.commentId != comment.commentId ? "댓글수정" : "취소"
      }}</a>
      <div v-show="updateComment.commentId == comment.commentId">
        <form @submit.prevent="commentUpdate">
          <div>
            <textarea rows="2" v-model="updateComment.content" required></textarea>
          </div>
          <button type="submit">댓글 수정</button>
          <button type="button">취소</button>
        </form>
      </div>
      <!-- 대댓글 작성 -->
      <div
        :id="`comment${comment.commentId}`"
        :style="{
          display: index === newReply.replyTo ? 'block' : 'none',
        }"
      >
        <form @submit.prevent="addReply">
          <div class="form-group">
            <textarea
              id="commentContent"
              name="content"
              rows="2"
              v-model="newReply.content"
              required
            ></textarea>
          </div>
          <button type="submit">답글 작성</button>
        </form>
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

.comment {
  margin-bottom: 10px;
}
</style>
