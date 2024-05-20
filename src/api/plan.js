import { Axios } from "@/api/http-common.js";
import { usePlanStore } from "@/stores/plan";

const http = Axios();

async function getCourseListByMember(memberId) {
  const response = await http.get(`/course/member-course/${memberId}`);
  const data = await response.data;
  console.log(data)
  return data;
}

async function getCourseByCourseId(courseId) {
  const response = await http.get(`/course/${courseId}`);
  const data = await response.data;
  console.log(data)
  return data; 
}

async function savePlan(courseId, courseName, memberId, plan) {
  const courseDetail = [];
  for (let i = 0; i < plan.length; i++) {
    courseDetail.push({
      courseId: courseId,
      attractionId: plan[i].contentId,
      order: i + 1,
    });
  }
  

  const data = {
    courseId: courseId,
    memberId: memberId,
    courseName: courseName,
    plan: courseDetail,
  }
  console.log(data);
  await http.post(`/course`, data);
}

async function removeCourseByCourseId(courseId) {
  await http.delete(`/course/${courseId}`);
}

export {
  getCourseListByMember,
  getCourseByCourseId,
  savePlan,
  removeCourseByCourseId,
};