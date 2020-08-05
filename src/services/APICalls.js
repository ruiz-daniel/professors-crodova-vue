/* eslint-disable no-unused-vars */
import axios from "axios";

//const AUTH_CREDENTIALS = `${username}:${password}`;
var baseURL = "http://localhost";
var AUTH_CREDENTIALS = {};
var headers = {};

export default {
  createHeaders(username, password) {
    AUTH_CREDENTIALS = username + ":" + password;
    headers = {
      Authorization: `Basic ${btoa(AUTH_CREDENTIALS)}`,
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "*",
      // "Access-Control-Allow-Headers": "*",
      // "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json"
    };
    console.log(headers);
  },
  stateBaseURL(url) {
    baseURL = url;
  },
  getBaseURL() {
    return baseURL;
  },
  getAllData(control, fn) {
    var allData = {};
    control.loadingRequest = true;
    // fetch(baseURL + "/sigenu-rest/teachers/getAllData", {
    //   method: "GET",
    //   headers: headers
    // })
    axios
      .request({
        method: "get",
        url: baseURL + "/sigenu-rest/teachers/getAllData",
        auth: {
          username: 'drg',
          password: '123'
        }
        //headers: headers,
        //withCredentials: true,
      })
      .then(response => {
        allData = response.data;
        control.loadingRequest = false;
        fn(allData);
      });
  },

  updateAssistToServer(assistsData, index, size) {
    if (index === size) {
      console.log("finished");
      return "finished";
    } else {
      var element = assistsData[index];
      console.log(element);
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
            Modified: element.Modified
          },
          //headers: headers
          withCredentials: true
        })
        .then(response => {
          this.updateAssistToServer(assistsData, index + 1, size);
        });
    }
  },
  updateEndEvaluationsToServer(evaluationsData) {
    evaluationsData.forEach(element => {
      axios.request({
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
        //headers: headers
        withCredentials: true
      });
    });
  },
  updateEvaluativeCutsToServer(cutsData, index, size) {
    if (index === size) {
      console.log("finished");
      return "finished";
    } else {
      var element = cutsData[index];
      console.log(element);
      axios
        .request({
          method: "get",
          url: baseURL + "/sigenu-rest/teachers/registerEvaluativeCut",
          params: {
            GroupPlanning: element.GroupPlanningID,
            Teacher_Name: element.Teacher_name,
            Cut: element.Cut,
            Student_ID: element.Student_ID,
            Student_Name: element.Student_Name,
            AssistPercent: element.AssistPercent,
            Evaluation: element.Evaluation,
            FirstHeader: element.FirstHeader,
            SecondHeader: element.SecondHeader
          },
          //headers: headers
          withCredentials: true
        })
        .then(response => {
          this.updateEvaluativeCutsToServer(cutsData, index + 1, size);
        });
    }
  },
  updatePeriodicEvaluationsToServer(evaluationsdata) {
    evaluationsdata.forEach(element => {
      axios.request({
        method: "get",
        url: baseURL + "/sigenu-rest/teachers/registerPeriodicEvaluation",
        params: {
          Student_ID: element.Student_ID,
          Evaluation_Value: element.Evaluation_Value,
          Type: element.Type,
          Date: element.Date,
          Subject_ID: element.Subject_ID,
          Group_ID: element.Group_ID,
          Week: element.Week,
          Teacher_ID: element.Teacher_ID,
          Teacher_Name: element.Teacher_Name
        },
        //headers: headers
        withCredentials: true
      });
    });
  }
};
