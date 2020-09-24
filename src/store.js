/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //TEACHER DATA............................................................................
    teacher_name: {},
    teacher_id: {},
    //PLANIFICATIONS AND STATIC CODIFIERS.....................................................
    planifications: {},
    activityTypes: {},
    evaluationValues: {},
    periodicEvaluationTypes: {},
    cualitativeEvaluations: {},
    //CURRENT INFO (GROUP, SUBJECT, STUDENTS, ETC)............................................
    groupPlanningID: {},
    groupID: {},
    subjectID: {},
    groupName: {},
    subjectName: {},
    subjectHours: {},
    students: {},
    closedEvaluationsInfo: {},
    //.......................................................................................
    selectedStudent: {}, //selected student Name for individual student info
    info: {}, // assist, evaluations, cuts, ethe current info that's being displayed
    infoType: {} //specify the type of info thats being shown (assists or periodic evaluation)
  },
  getters: {
    getActivityTypeIDFromName: state => name => {
      var result = {};
      state.activityTypes.forEach(element => {
        if (element.Name === name) result = element.ID;
      });
      return result;
    },
    getPeriodicEvaluationTypeIDFromName: state => name => {
      var result = {};
      state.periodicEvaluationTypes.forEach(element => {
        if (element.Name === name) result = element.ID;
      });
      return result;
    },
    getEvaluationValueFromID: state => id => {
      var result = "undefined";
      state.evaluationValues.forEach(element => {
        if (element.ID === id) result = element.Value;
      });
      return result;
    },
    getEvaluationValueIDFromValue: state => value => {
      var result = "undefined";
      state.evaluationValues.forEach(element => {
        if (element.Value === value) result = element.ID;
      });
      return result;
    },
    getEvalPermittedFromPlanning: state => planningID => {
      var result = "false";
      state.planifications.forEach(element=>{
        if (element.GroupPlanningID === planningID){
          result = element.SetEvaluationAvailable;
        }
      });
      return result;
    }
  },
  mutations: {
    PLANIFICATIONS(state, planifications) {
      state.planifications = planifications;
    },
    SELECT_GROUP(state, groupData) {
      state.groupPlanningID = groupData.GroupPlanningID;
      state.groupID = groupData.GroupID;
      state.subjectID = groupData.SubjectID;
      state.groupName = groupData.GroupName;
      state.subjectName = groupData.SubjectName;
      state.subjectHours = groupData.SubjectHours;
    },
    STUDENTS(state, students) {
      state.students = students;
    },
    SELECT_STUDENT(state, student) {
      state.selectedStudent = student;
    },
    SAVE_INFO(state, info) {
      state.info = info;
    },
    SAVE_CLOSED_EVALUATIONS_INFO(state, data){
      state.closedEvaluationsInfo = data;
    },
    STATE_INFO_TYPE(state, type) {
      state.infoType = type;
    },
    SET_TEACHER_DATA(state, data) {
      state.teacher_name = data.TeacherName;
      state.teacher_id = data.TeacherID;
    },
    LOAD_ACTIVITY_TYPES(state, activityTypes) {
      state.activityTypes = activityTypes;
    },
    LOAD_CUALITATIVE_EVALUATIONS(state, evaluations) {
      state.cualitativeEvaluations = evaluations;
    },
    LOAD_EVALUATION_VALUES(state, values) {
      state.evaluationValues = values;
    },
    LOAD_PERIODIC_EVALUATION_TYPES(state, evaluationTypes) {
      state.periodicEvaluationTypes = evaluationTypes;
    }
  },
  actions: {}
});
