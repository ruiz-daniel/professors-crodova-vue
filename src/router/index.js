import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Planifications from "../views/PlanificationsView";
import RegisterAssist from "../views/RegisterAssistView";
import StudentsView from "../views/StudentsView";
import InsertEndEvaluations from "../views/InsertEndEvaluationsView";
import InsertPeriodicEvaluation from "../views/InsertPeriodicEvaluationView";
import RegisterCutView from "../views/RegisterCutView";
import ActivitiesView from "../views/ActivitiesView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/Planifications",
    name: "planifications",
    component: Planifications
  },
  {
    path: "/StudentsView",
    name: "StudentsView",
    component: StudentsView
  },
  {
    path: "/RegisterAssist",
    name: "RegisterAssist",
    component: RegisterAssist
  },
  {
    path: "/InsertEndEvaluations",
    name: "InsertEndEvaluations",
    component: InsertEndEvaluations,
    props: true
  },
  {
    path: "/RegisterCut",
    name: "RegisterCut",
    component: RegisterCutView,
  },
  {
    path: "/InsertPeriodicEvaluation",
    name: "InsertPeriodicEvaluation",
    component: InsertPeriodicEvaluation
  },
  {
    path: "/Tasks",
    name: "Tasks",
    component: ActivitiesView
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
