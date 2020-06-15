import axios from "axios";

//const AUTH_CREDENTIALS = `${username}:${password}`;
var baseURL = "http://localhost";
var AUTH_CREDENTIALS = {};
var headers = {};

export default {
  createHeaders(username, password) {
    AUTH_CREDENTIALS = username + password;
    headers = {
      Authorization: `Basic ${btoa(AUTH_CREDENTIALS)}`,
      "Content-Type": "application/json"
    };
  },
  stateBaseURL(url) {
    baseURL = url;
  },
  getAllData() {
    var allData = {};
    axios
      .request({
        method: "get",
        url: baseURL + "/sigenu-rest/teachers/getAllData",
        headers: headers
      })
      .then(response => {
        allData = response.data;
        return allData;
      });
  },

  updateAssistToServer(assistsData) {
    assistsData.forEach(element => {
      axios
        .request({
          method: "get",
          url: baseURL + "/sigenu-rest/teachers/updateAssists",
          params: {
            Date: element.Date,
            Week: element.Week,
            Activity_Type: element.Activity_Type,
            Student: element.Student,
            Group: element.Group,
            Teacher: element.Teacher,
            Teacher_Name: element.Teacher_Name,
            Subject: element.Subject,
            First_Turn: element.First_Turn,
            Second_Turn: element.Second_Turn,
            Updated: true
          },
          headers: headers
        })
        .then(
          //Update on local db
          alert("Se han actualizado las asistencias")
        );
    });
  },
  updateEndEvaluationsToServer(evaluationsData) {
    evaluationsData.forEach(element => {
      axios
        .request({
          method: "get",
          url: baseURL + "/sigenu-rest/teachers/registerEndEvaluation",
          params: {
            Group_ID: element.Group_ID,
            Subject_ID: element.Subject_ID,
            ID_Acta: element.ID_Acta,
            Convocatoria: element.Convocatoria,
            Exam_Evaluation: element.Exam_Evaluation,
            Final_Evaluation: element.Final_Evaluation,
            Student_ID: element.Student_ID,
            Matriculated_Subject_ID: element.Matriculated_Subject_ID,
            Teacher_Name: element.Teacher_Name,
            Update: element.Update
          },
          headers: headers
        })
        .then(
          //Update on local db
          alert("Se han actualizado las evaluaciones finales")
        );
    });
  },
  updateEvaluativeCutsToServer(cutsData) {
    cutsData.forEach(element => {
      axios
        .request({
          method: "get",
          url: baseURL + "/sigenu-rest/teachers/registerEvaluativeCut",
          params: {
            GroupPlanning: element.GroupPlanning,
            Subject: element.SubjectID,
            Teacher_Name: element.Teacher_name,
            Cut: element.Cut,
            Student_ID: element.Student_ID,
            Student_Name: element.Student_Name,
            AssistPercent: element.AssistPercent,
            Evaluation: element.Evaluation
          },
          headers: headers
        })
        .then(
          //Update on local db
          alert("Se han actualizado los cortes evaluativos")
        );
    });
  },
  updatePeriodicEvaluationsToServer(evaluationsdata) {
    evaluationsdata.forEach(element => {
      axios
        .request({
          method: "get",
          url: baseURL + "/sigenu-rest/teachers/registerPeriodicEvaluation",
          params: {
            Student_ID: element.Student_ID,
            Evaluation_Value: element.Evaluation_Value,
            Periodic_Evaluation_Type_ID: element.Periodic_Evaluation_Type,
            Date: element.Date,
            Subject_ID: element.Subject_ID,
            Group_ID: element.Group_ID,
            Week: element.Week,
            Teacher_ID: element.Teacher_ID,
            Teacher_Name: element.Teacher_Name
          },
          headers: headers
        })
        .then(
          //Update on local db
          alert("Se han actualizado las evaluaciones periodicas")
        );
    });
  }
};
