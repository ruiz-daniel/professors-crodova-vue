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
import Message from "primevue/message";
import ProgressBar from "primevue/progressbar";
import AutoComplete from "primevue/autocomplete";
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
Vue.component("Message", Message);
Vue.component("ProgressBar", ProgressBar);
Vue.component("AutoComplete", AutoComplete);

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
    controlData: {
      inserted: 0,
      updated: 0,
      loadingRequest: false,
      configUserForServer: false, // flag to know when the user has been sent to configuration view from attempting to connect to the server without setting credentials
      connectionFailed: function() {
        alert("Conexión fallida");
      },
      databaseStatusOk: true
    }
  },
  computed: {
    loading() {
      return this.controlData.inserted > 0 && this.controlData.inserted < 10;
    }
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
      var control = this.controlData;
      control.inserted = 0;
      Database.resetDatabase();
      Database.insertTeacherData(data.teacher_data, function() {
        control.inserted++;
      });
      Database.insertGroups(data.teacher_data.Grupos, function() {
        control.inserted++;
      });
      Database.insertGroupPlannings(data.teacher_data.Grupos, function() {
        control.inserted++;
      });
      this.populateDBStudents(data, control);
      Database.insertSubjects(data.teacher_data.Subjects, function() {
        control.inserted++;
      });
      this.populateDBAssists(data, control);
      this.populateDBEndEvaluations(data, control);
      this.populateDBPeriodicEvaluations(data, control);
      this.populateDBEvaluativeCuts(data, control);
      this.populateDBCodifiers(data, control);
    },
    populateDBCodifiers(data, control) {
      Database.insertCodifiers(
        data.codifiers.Activity_Type,
        data.codifiers.Evaluation_Values,
        data.codifiers.Periodic_Evaluation_Type,
        data.codifiers.Cualitative_Evaluation,
        control,
        this.getCodifiers
      );
    },
    populateDBStudents(data, control) {
      var studentData = [];
      data.teacher_data.Grupos.forEach(element => {
        element.Students.forEach(studentElement => {
          studentData.push({
            student: studentElement,
            groupID: element.ID_SIGENU
          });
        });
      });
      Database.insertStudents(studentData, function() {
        control.inserted += 1;
      });
    },
    populateDBAssists(data, control) {
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
      Database.insertAssists(assistsData, "", "", function() {
        control.inserted++;
      });
    },
    verifyExistingGroup(array, group) {
      var exist = false;
      array.forEach(element => {
        if (element === group) exist = true;
      });
      return exist;
    },
    populateDBEvaluativeCuts(data, control) {
      var cutsData = [];
      data.evaluative_cuts.forEach(elementCut => {
        if (
          elementCut.cuts != null &&
          elementCut.cuts.studentsCuts.length > 0
        ) {
          elementCut.cuts.studentsCuts.forEach(elementStudentCut => {
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
      Database.insertEvaluativeCuts(cutsData, function() {
        control.inserted += 1;
      });
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
    populateDBEndEvaluations(data, control) {
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
            Set_Evaluation_Available:
              elementEvaluation.Set_Evaluation_Available,
            Updated: true
          });
        });
      });
      Database.insertEndEvaluations(evaluationsData, function() {
        control.inserted += 1;
      });
    },
    populateDBPeriodicEvaluations(data, control) {
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
      Database.insertPeriodicEvaluations(evaluationsData, function() {
        control.inserted += 1;
      });
    },
    //............................................................................................

    getAllDataFromServer() {
      APICalls.getAllData(this.controlData, this.populateDB);
    },

    updateToServer() {
      var assist = this.updateAssistToServer;
      var finals = this.updateEndEvaluationsToServer;
      var cuts = this.updateEvaluativeCutsToServer;
      var periodic = this.updatePeriodicEvaluationsToServer;
      APICalls.updateAllData(this.controlData, function() {
        assist();
        finals();
        cuts();
        periodic();
      });
    },

    updateAssistToServer() {
      var control = this.controlData;
      Database.getAssistsForUpdate(function(assists) {
        APICalls.updateAssistToServer(assists, 0, assists.length, function() {
          control.updated++;
        });
      });
    },
    updateEndEvaluationsToServer() {
      var control = this.controlData;
      Database.getEndEvaluationsForUpdate(function(evaluations) {
        APICalls.updateEndEvaluationsToServer(
          evaluations,
          0,
          evaluations.length,
          function() {
            control.updated++;
          }
        );
      });
    },
    updateEvaluativeCutsToServer() {
      var control = this.controlData;
      Database.getEvaluativeCutsForUpdate(function(cuts) {
        APICalls.updateEvaluativeCutsToServer(cuts, 0, cuts.length, function() {
          control.updated++;
        });
      });
    },
    updatePeriodicEvaluationsToServer() {
      var control = this.controlData;
      Database.getPeriodicdEvaluationsForUpdate(function(evaluations) {
        APICalls.updatePeriodicEvaluationsToServer(
          evaluations,
          0,
          evaluations.length,
          function() {
            control.updated++;
          }
        );
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
    },

    checkDatabase() {
      var codifiers = this.getCodifiers;
      var control = this.controlData;
      var router = this.$router;
      Database.isDatabasePopulated(function(status) {
        if (!status) {
          control.databaseStatusOk = false;
          router.push("/");
        } else {
          codifiers();
          Database.getPlanifications(function(planifications) {
            store.commit("PLANIFICATIONS", planifications);
            store.commit("STATE_ACTION", "nothingSelected");
            router.push({ name: "planifications" });
          });
        }
      });
    }
  },

  mounted() {
    Database.initDatabase();
    this.checkDatabase();
    Database.getLoginData(function(username, password) {
      if (
        username != "" &&
        username != "undefined" &&
        password != "" &&
        password != "undefined"
      ) {
        console.log(username);
        APICalls.createHeaders(username, password);
      }
    });
    Database.setToastService(this.$toast);
    router.push("/blank");
  },
  render: h => h(App)
}).$mount("#app");
