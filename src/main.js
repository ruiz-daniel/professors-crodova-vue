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

/*PRIMEVUE COMPONENTS......................................................
/
*/
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
//....................................................................................
Vue.prototype.$http = axios;
Vue.use(APICalls);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  data: {
    //LOCAL VARIABLES...................................................................
    Database,
    APICalls,
    fileData,
    sideMenuVisible: false, // controls when the left sidebar is visible
    sideInfoVisible: false, // controls when the right side bar is visible
    controlData: {
      inserted: 0, //data succesfully inserted in the database when downloading planifications(for progress bar and flow control)

      updated: 0, //data succesfully uploaded to the server (for progress bar and flow control)

      loadingRequest: false, //state in which the app is connecting to the server

      saveLogin: false, // flag to know when the user is just changing credentials or login into the server

      connectionFailed: function() {
        alert("Conexión fallida");
      },
      databaseStatusOk: true
    }
  },
  computed: {
    loading() {
      return this.controlData.inserted > 0 && this.controlData.inserted < 10;
    },
    loadingUpdate() {
      return this.controlData.updated > 0 && this.controlData.updated < 5;
    }
  },
  methods: {
    //POPULATE DATABASE METHODS............................................................................
    populateDB(data) {
      /*Call all the populate database functions
      // Each time one finishes upgrades the inserted counter by 1 until 10
      // Data must follow certain structure. If someone is altered in the ejb so should be here
      */
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
      var evaluationsClosed = [];
      data.end_evaluations.forEach(elementEvaluation => {
        evaluationsClosed.push({
          GroupPlanningID: elementEvaluation.ID,
          OrdinalClosed: elementEvaluation.OrdinalActaClosed,
          RevClosed: elementEvaluation.RevActaClosed,
          ExtraClosed: elementEvaluation.ExtraActaClosed
        });
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
      Database.insertEndEvaluationsClosed(evaluationsClosed);
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
    //................................................................................................

    getAllDataFromServer() {
      APICalls.getAllData(this.controlData, this.populateDB);
    },

    //UPDATE TO SERVER METHODS........................................................................
    updateToServer() {
      /*Call all the update methods
      //Each time one finishes increases the updated counter by 1 until 5
      */
      var assist = this.updateAssistToServer;
      var finals = this.updateEndEvaluationsToServer;
      var cuts = this.updateEvaluativeCutsToServer;
      var periodic = this.updatePeriodicEvaluationsToServer;
      var closed = this.updateClosedEvaluationsToServer;
      APICalls.updateAllData(this.controlData, function() {
        assist();
        finals();
        cuts();
        periodic();
        closed();
      });
    },

    updateClosedEvaluationsToServer() {
      var control = this.controlData;
      Database.getClosedEvaluationsForUpdate(function(evaluations) {
        APICalls.updateClosedEvaluationsToServer(
          evaluations,
          0,
          evaluations.length,
          function() {
            control.updated++;
          }
        );
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
    //..........................................................................................

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
      /*Check if database has planifications
      //If it does send the user to the planifications view
      //If it doesn't send them to the configuration view for user and password
      */
      var codifiers = this.getCodifiers;
      var control = this.controlData;
      var router = this.$router;
      Database.isDatabasePopulated(function(status) {
        if (!status) {
          control.databaseStatusOk = false;
          control.saveLogin = false;
          router.push({ name: "Configuration" });
        } else {
          control.databaseStatusOk = true;
          control.saveLogin = false;
          codifiers();
          Database.getPlanifications(function(planifications) {
            store.commit("PLANIFICATIONS", planifications);
            router.push({ name: "planifications" });
          });
        }
      });
    }
  },

  mounted() {
    Database.initDatabase();
    router.push("/blank"); //To avoid double navigation from the checkdatabase method
    this.checkDatabase();
    Database.getLoginData(function(username, password, domain) {
      if (
        username != "" &&
        username != "undefined" &&
        password != "" &&
        password != "undefined"
      ) {
        console.log(username);
        APICalls.createHeaders(username, password);
        APICalls.stateBaseURL(domain);
      }
    });
    Database.setToastService(this.$toast);
  },
  render: h => h(App)
}).$mount("#app");
