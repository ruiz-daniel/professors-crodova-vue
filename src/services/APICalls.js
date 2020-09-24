/* eslint-disable no-unused-vars */
import axios from "axios";

var baseURL = "";
var user = "";
var pass = "";

export default {
  createHeaders(username, password) {
    user = username;
    pass = password;
  },
  stateBaseURL(url) {
    baseURL = url;
  },
  getBaseURL() {
    return baseURL;
  },
  getUser() {
    return user;
  },
  getPass() {
    return pass;
  },
  getAllData(control, fn) {
    var allData = {};
    control.loadingRequest = true;
    axios
      .request({
        method: "get",
        url: "http://" + baseURL + "/sigenu-rest/teachers/getAllData",
        auth: {
          username: user,
          password: pass
        }
      })
      .then(response => {
        allData = response.data;
        control.loadingRequest = false;
        fn(allData);
      })
      .catch(error => {
        control.loadingRequest = false;
        control.connectionFailed();
      });
  },

  updateAllData(control, fn) {
    control.loadingRequest = true;
    axios
      .request({
        method: "get",
        url: "http://" + baseURL + "/sigenu-rest/teachers/test",
        auth: {
          username: user,
          password: pass
        }
      })
      .then(response => {
        control.loadingRequest = false;
        fn();
      })
      .catch(error => {
        control.loadingRequest = false;
        control.connectionFailed();
      });
  },

  updateAssistToServer(assistsData, index, size, fn) {
    if (index === size) {
      fn();
      return "finished";
    } else {
      var element = assistsData[index];
      axios
        .request({
          method: "get",
          url: "http://" + baseURL + "/sigenu-rest/teachers/updateAssists",
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
          auth: {
            username: user,
            password: pass
          }
        })
        .then(response => {
          this.updateAssistToServer(assistsData, index + 1, size, fn);
        });
    }
  },
  updateEndEvaluationsToServer(evaluationsData, index, size, fn) {
    if (index === size) {
      fn();
      return "finished";
    } else {
      var element = evaluationsData[index];
      axios
        .request({
          method: "get",
          url:
            "http://" + baseURL + "/sigenu-rest/teachers/registerEndEvaluation",
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
          auth: {
            username: user,
            password: pass
          }
        })
        .then(
          this.updateEndEvaluationsToServer(
            evaluationsData,
            index + 1,
            size,
            fn
          )
        );
    }
  },
  updateEvaluativeCutsToServer(cutsData, index, size, fn) {
    if (index === size) {
      fn();
      return "finished";
    } else {
      var element = cutsData[index];
      console.log(element);
      axios
        .request({
          method: "get",
          url:
            "http://" + baseURL + "/sigenu-rest/teachers/registerEvaluativeCut",
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
          auth: {
            username: user,
            password: pass
          }
        })
        .then(response => {
          this.updateEvaluativeCutsToServer(cutsData, index + 1, size, fn);
        });
    }
  },
  updatePeriodicEvaluationsToServer(evaluationsdata, index, size, fn) {
    if (index === size) {
      fn();
      return "finished";
    } else {
      var element = evaluationsdata[index];
      console.log(element);
      axios
        .request({
          method: "get",
          url:
            "http://" +
            baseURL +
            "/sigenu-rest/teachers/registerPeriodicEvaluation",
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
          auth: {
            username: user,
            password: pass
          }
        })
        .then(response => {
          this.updatePeriodicEvaluationsToServer(
            evaluationsdata,
            index + 1,
            size,
            fn
          );
        });
    }
  },

  updateClosedEvaluationsToServer(evaluationsdata, index, size, fn) {
    if (index === size) {
      fn();
      return "finished";
    } else {
      var element = evaluationsdata[index];
      axios
        .request({
          method: "get",
          url: "http://" + baseURL + "/sigenu-rest/teachers/closeEndEvaluation",
          params: {
            subjectID: element.subjectID,
            groupID: element.groupID,
            convocatoria: element.convocatoria
          },
          auth: {
            username: user,
            password: pass
          }
        })
        .then(response => {
          this.updatePeriodicEvaluationsToServer(
            evaluationsdata,
            index + 1,
            size,
            fn
          );
        });
    }
  }
};
