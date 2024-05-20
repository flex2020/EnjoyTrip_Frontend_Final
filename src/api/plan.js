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

export {
  getCourseListByMember,
  getCourseByCourseId,
};