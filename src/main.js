/* eslint-disable no-unused-vars */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import fileData from "@/localFiles/allData.json";
import Database from "@/services/Database.js";

import "primeicons/primeicons.css";
import "primevue/resources/themes/luna-amber/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import ToastService from "primevue/toastservice";
Vue.use(ToastService);

import Sidebar from "primevue/sidebar";
import PanelMenu from "primevue/panelmenu";
import Card from "primevue/card";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import Carousel from "primevue/carousel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Row from "primevue/row";
import Paginator from "primevue/paginator";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import APICalls from "./services/APICalls";
Vue.component("Sidebar", Sidebar);
Vue.component("PanelMenu", PanelMenu);
Vue.component("Card", Card);
Vue.component("Button", Button);
Vue.component("Toolbar", Toolbar);
Vue.component("Carousel", Carousel);
Vue.component("DataTable", DataTable);
Vue.component("Column", Column);
Vue.component("Paginator", Paginator);
Vue.component("Dropdown", Dropdown);
Vue.component("Checkbox", Checkbox);
Vue.component("Dialog", Dialog);
Vue.component("Row", Row);
Vue.component("Toast", Toast);
Vue.component("OverlayPanel", OverlayPanel);
Vue.component("InputText", InputText);
Vue.component("Calendar", Calendar);

Vue.prototype.$http = axios;
Vue.use(APICalls);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  data: {
    //local variables...............................
    Database,
    APICalls,
    fileData,
    sideMenuVisible: false,
    sideInfoVisible: false,
    loading: false
  },
  methods: {
    saveResponseToLocalFile(filename, jsonData) {
      let blob = new Blob([jsonData], {
        type: "text/plain;charset=utf-8;"
      });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        let link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    updateAll() {
      router.push("/");
      //Test the server and ask for all the update functions
    },
    //Populate Database Functions................................................................
    populateDB(data) {
      Database.insertTeacherData(data.teacher_data);
      Database.insertGroups(data.teacher_data.Grupos);
      Database.insertGroupPlannings(data.teacher_data.Grupos);
      this.populateDBStudents(data);
      Database.insertSubjects(data.teacher_data.Subjects);
      this.populateDBAssists(data);
      this.populateDBEndEvaluations(data);
      this.populateDBPeriodicEvaluations(data);
      this.populateDBEvaluativeCuts(data);
      this.populateDBCodifiers(data);
    },
    populateDBCodifiers(data) {
      Database.insertActivityTypes(data.codifiers.Activity_Type);
      Database.insertEvaluationValues(data.codifiers.Evaluation_Values);
      Database.insertPeriodicEvaluationTypes(
        data.codifiers.Periodic_Evaluation_Type
      );
      Database.insertCualitativeEvaluations(
        data.codifiers.Cualitative_Evaluation
      );
    },
    populateDBStudents(data) {
      var studentData = [];
      data.teacher_data.Grupos.forEach(element => {
        element.Students.forEach(studentElement => {
          studentData.push({
            student: studentElement,
            groupID: element.ID_SIGENU
          });
        });
      });
      Database.insertStudents(studentData);
    },
    populateDBAssists(data) {
      var verifiedGroups = [];
      var assistsData = [];
      data.teacher_data.Grupos.forEach(elementGroup => {
        if (!this.verifyExistingGroup(verifiedGroups, elementGroup.ID_SIGENU))
          elementGroup.Students.forEach(elementStudent => {
            elementStudent.Assist.forEach(elementAssist => {
              assistsData.push(elementAssist);
            });
          });
        verifiedGroups.push(elementGroup.ID_SIGENU);
      });
      Database.insertAssists(assistsData, "", "");
    },
    verifyExistingGroup(array, group) {
      var exist = false;
      array.forEach(element => {
        if (element === group) exist = true;
      });
      return exist;
    },
    populateDBEvaluativeCuts(data) {
      var cutsData = [];
      data.evaluative_cuts.forEach(elementCut => {
        if (
          elementCut.cuts != null &&
          elementCut.cuts.studentsCuts.length > 0
        ) {
          elementCut.cuts.studentsCuts.forEach(elementStudentCut => {
            console.log(elementCut.Second_Delivered);
            cutsData.push({
              groupPlanningID: elementCut.ID,
              firstCourtHeader: elementCut.cuts.First_Court_HeaderID,
              secondCourtHeader: elementCut.cuts.Second_Court_HeaderID,
              firstDelivered: elementCut.cuts.First_Delivered,
              secondDelivered: elementCut.cuts.Second_Delivered,
              Abscense_Hours_Court1: elementStudentCut.Abscense_Hours_Court1,
              Abscense_Hours_Court2: elementStudentCut.Abscense_Hours_Court2,
              Assistance_Percent: elementStudentCut.Assistance_Percent,
              Cualitative_Evaluation_C1:
                elementStudentCut.Cualitative_Evaluation_C1,
              Cualitative_Evaluation_C2:
                elementStudentCut.Cualitative_Evaluation_C2,
              Student_ID: this.getStudentIdFromName(
                data,
                elementStudentCut.Student_Name
              ),
              Updated: true
            });
          });
        } else {
          var students = this.getStudentsFromGroup(data, elementCut.ID);
          students.forEach(element => {
            cutsData.push({
              groupPlanningID: elementCut.ID,
              firstDelivered: false,
              secondDelivered: false,
              Student_ID: element.ID_SIGENU,
              Updated: true
            });
          });
        }
      });
      Database.insertEvaluativeCuts(cutsData);
    },
    getStudentIdFromName(data, name) {
      var id = {};
      data.teacher_data.Grupos.forEach(elementGroup => {
        elementGroup.Students.forEach(element => {
          if (element.Name === name) {
            id = element.ID_SIGENU;
          }
        });
      });
      return id;
    },
    getStudentsFromGroup(data, groupPlanningID) {
      var students = [];
      data.teacher_data.Grupos.forEach(elementGroup => {
        if (elementGroup.GrupoPlanningID === groupPlanningID)
          elementGroup.Students.forEach(element => {
            students.push(element);
          });
      });
      return students;
    },
    populateDBEndEvaluations(data) {
      var evaluationsData = [];
      data.end_evaluations.forEach(elementEvaluation => {
        elementEvaluation.evaluations.forEach(element => {
          evaluationsData.push({
            groupPlanningID: elementEvaluation.ID,
            ID_Acta1: element.ID_Acta1,
            ID_Acta2: element.ID_Acta2,
            ID_Acta3: element.ID_Acta3,
            Student_ID: element.Student_ID,
            Student_Name: element.Student_Name,
            List_Number: element.List_Number,
            Subject_ID: element.Subject_ID,
            Group_ID: element.Group_ID,
            Matriculated_Subject_ID: element.Matriculated_Subject_ID,
            Matriculated_Subject_Situation_ID:
              element.Matriculated_Subject_Situation_ID,
            Ordinal_Exam_Evaluation_Value_ID:
              element.Ordinal_Exam_Evaluation_Value_ID,
            Rev_Exam_Evaluation_Value_ID: element.Rev_Exam_Evaluation_Value_ID,
            Extra_Exam_Evaluation_Value_ID:
              element.Extra_Exam_Evaluation_Value_ID,
            Final_Evaluation_Value_ID: element.Final_Evaluation_Value_ID,
            Ordinal_Evaluation_ID: element.Ordinal_Evaluation_ID,
            Rev_Evaluation_ID: element.Rev_Evaluation_ID,
            Extra_Evaluation_ID: element.Extra_Evaluation_ID,
            Updated: true
          });
        });
      });
      Database.insertEndEvaluations(evaluationsData);
    },
    populateDBPeriodicEvaluations(data) {
      var evaluationsData = [];
      data.teacher_data.Grupos.forEach(elementGroup => {
        elementGroup.Students.forEach(studentElement => {
          studentElement.Periodic_Evaluation.forEach(element => {
            evaluationsData.push({
              Student: studentElement.ID_SIGENU,
              ID_SIGENU: element.ID_SIGENU,
              Periodic_Evaluation_Type: element.Periodic_Evaluation_Type,
              User_Name: element.User_Name,
              Host: element.Host,
              Cancelled: element.Cancelled,
              Evaluation_Value: element.Evaluation_Value,
              Date: element.Date,
              Subject: element.Subject,
              Grupo: element.Grupo,
              Week: element.Week,
              Deleted: element.Deleted,
              Updated: element.Updated,
              Modified: false
            });
          });
        });
      });
      Database.insertPeriodicEvaluations(evaluationsData);
    },
    //............................................................................................

    getAllDataFromServer(loading) {
      APICalls.getAllData(false, this.populateDB);
    },

    updateToServer() {
      this.updateAssistToServer();
      this.updateEndEvaluationsToServer();
      this.updateEvaluativeCutsToServer();
      this.updatePeriodicEvaluationsToServer();
    },

    updateAssistToServer() {
      Database.getAssistsForUpdate(function(assists) {
        APICalls.updateAssistToServer(assists, 0, assists.length);
      });
    },
    updateEndEvaluationsToServer() {
      Database.getEndEvaluationsForUpdate(function(evaluations) {
        APICalls.updateEndEvaluationsToServer(evaluations);
      });
    },
    updateEvaluativeCutsToServer() {
      Database.getEvaluativeCutsForUpdate(function(cuts) {
        APICalls.updateEvaluativeCutsToServer(cuts, 0, cuts.length);
      });
    },
    updatePeriodicEvaluationsToServer() {
      Database.getPeriodicdEvaluationsForUpdate(function(evaluations) {
        APICalls.updatePeriodicEvaluationsToServer(evaluations);
      });
    },
    getCodifiers() {
      Database.getTeacherData(function(data) {
        store.commit("SET_TEACHER_DATA", data);
      });
      Database.getActivityTypes(function(results) {
        store.commit("LOAD_ACTIVITY_TYPES", results);
      });
      Database.getPeriodicEvaluationTypes(function(results) {
        store.commit("LOAD_PERIODIC_EVALUATION_TYPES", results);
      });
      Database.getEvaluationValues(function(results) {
        store.commit("LOAD_EVALUATION_VALUES", results);
      });
    }
  },

  mounted() {
    Database.initDatabase();
    this.getCodifiers();
    Database.setToastService(this.$toast);
    router.push("/");
  },
  render: h => h(App)
}).$mount("#app");
