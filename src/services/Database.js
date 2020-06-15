/* eslint-disable no-unused-vars */
var database = {};
//Queries......................................................................................
const queryPlanifications =
  "SELECT group_planning_id, subject_name, group_name " +
  "FROM student_group " +
  "JOIN group_planning ON student_group.group_id = group_planning.group_fk " +
  "JOIN subject ON subject.subject_id = group_planning.subject_fk";

const queryStudentsFromPlanification =
  "SELECT student_id, student_name " +
  "FROM student " +
  "JOIN student_group ON student_group.group_id = student.student_group_fk " +
  "JOIN group_planning ON group_planning.group_fk = student_group.group_id " +
  "WHERE group_planning.group_planning_id = ?";

const querySelectGroup =
  "SELECT group_planning_id, group_id, group_name, subject_id, subject_name " +
  "FROM group_planning " +
  "JOIN student_group ON student_group.group_id = group_planning.group_fk " +
  "JOIN subject ON subject.subject_id = group_planning.subject_fk " +
  "WHERE group_planning_id = ?";

const queryTeacherData = "SELECT teacher_name, teacher_id FROM teacher_data";

const queryAssistFromStudentAndSubject =
  "SELECT DISTINCT assist_week, assist_date, activity_type_name, assist_first_turn, assist_second_turn, assist_id, assist_activity_type_fk, assist_updated " +
  "FROM assist " +
  "JOIN student ON assist.assist_student_fk = student.student_id " +
  "JOIN subject ON subject.subject_id = assist.assist_subject_fk " +
  "JOIN activity_type ON activity_type.activity_type_id = assist.assist_activity_type_fk " +
  "WHERE student_id = ? AND subject_id = ?";

const queryPeriodicEvaluationsFromStudentAndSubject =
  "SELECT DISTINCT periodic_evaluation_type_code, periodic_evaluation_id, periodic_evaluation_type_fk," +
  "periodic_evaluation_username, periodic_evaluation_host, periodic_evaluation_canceled, periodic_evaluation_value," +
  "periodic_evaluation_date, periodic_evaluation_week," +
  "periodic_evaluation_deleted, periodic_evaluation_updated " +
  "FROM periodic_evaluation " +
  "JOIN periodic_evaluation_type ON periodic_evaluation_type.periodic_evaluation_type_id = periodic_evaluation.periodic_evaluation_type_fk " +
  "JOIN student ON student.student_id = periodic_evaluation.periodic_evaluation_student_fk " +
  "JOIN subject ON subject.subject_id = periodic_evaluation.periodic_evaluation_subject_fk " +
  "WHERE student_id = ? AND subject_id = ?";

const queryEndEvaluationsFromPlanification =
  "SELECT * FROM end_evaluation WHERE end_evaluation_group_planning_id = ?";

const queryUpdateEndEvaluations =
  "UPDATE end_evaluation " +
  "SET ordinal_exam_evaluation_value_id = ?, rev_exam_evaluation_value_id = ?, extra_exam_evaluation_value_id = ?, final_evaluation_id = ?, end_evaluation_updated = ? " +
  "WHERE end_evaluation_group_planning_id = ? AND end_evaluation_student_id = ?";

const queryUpdateEvaluativeCuts =
  "UPDATE student_cut SET " +
  "student_cut_cualitative_evaluation1 = ?, student_cut_cualitative_evaluation2 = ? " +
  "WHERE student_cut_evaluative_cut_fk = ? AND student_cut_student_fk = ?";

const queryUpdateAssist =
  "UPDATE assist " +
  "SET assist_first_turn = ?, assist_second_turn = ?, assist_updated = ? " +
  "WHERE assist_student_fk = ? AND assist_subject_fk = ? AND assist_date = ? AND assist_activity_type_fk = ? ";

const queryUpdatePeriodicEvaluation =
  "UPDATE periodic_evaluation " +
  "SET periodic_evaluation_value = ?, periodic_evaluation_updated = ?" +
  "WHERE periodic_evaluation_student_fk = ? AND periodic_evaluation_subject_fk = ? AND periodic_evaluation_date = ? AND periodic_evaluation_type_fk = ?";

const queryEvaluativeCutsFromGroup =
  "SELECT cut_group_planning_id, cut_first_delivered, cut_second_delivered, " +
  "student_cut_cualitative_evaluation1, student_cut_cualitative_evaluation2, student_id, student_name " +
  "FROM student_cut " +
  "JOIN evaluative_cut ON evaluative_cut.cut_group_planning_id = student_cut.student_cut_evaluative_cut_fk " +
  "JOIN student ON student.student_id = student_cut.student_cut_student_fk WHERE cut_group_planning_id = ?";

export default {
  initDatabase() {
    database = window.openDatabase(
      "professorsDB",
      "1.0",
      "Professors DB",
      2000000
    );
  },
  // Success and Error Functions..............................................................
  txError(error) {
    console.log("Transaction ERROR: " + error.message);
  },
  createdTablesSuccess() {
    console.log("Created tables OK");
  },
  txSuccess() {
    console.log("Transaction completed OK");
  },
  //..........................................................................................
  createTables() {
    database.transaction(
      this.queryTables,
      this.txError,
      this.createdTablesSuccess
    );
  },
  queryTables(tx) {
    tx.executeSql("DROP TABLE IF EXISTS teacher_data");
    tx.executeSql("DROP TABLE IF EXISTS student_group");
    tx.executeSql("DROP TABLE IF EXISTS group_planning");
    tx.executeSql("DROP TABLE IF EXISTS subject");
    tx.executeSql("DROP TABLE IF EXISTS student");
    tx.executeSql("DROP TABLE IF EXISTS assist");
    tx.executeSql("DROP TABLE IF EXISTS end_evaluation");
    tx.executeSql("DROP TABLE IF EXISTS periodic_evaluation");
    tx.executeSql("DROP TABLE IF EXISTS evaluative_cut");
    tx.executeSql("DROP TABLE IF EXISTS student_cut");
    tx.executeSql("DROP TABLE IF EXISTS activity_type");
    tx.executeSql("DROP TABLE IF EXISTS evaluation_value");
    tx.executeSql("DROP TABLE IF EXISTS cualitative_evaluation");
    tx.executeSql("DROP TABLE IF EXISTS periodic_evaluation_type");

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS teacher_data (teacher_id unique, teacher_name)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS student_group (group_id unique, group_name unique)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS group_planning (group_planning_id unique, group_fk, subject_fk)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS subject (subject_id unique, subject_name)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS student (student_id unique, student_name, student_last_name, student_second_last_name, student_group_fk)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS assist (assist_id, assist_date, assist_week, assist_activity_type_fk, assist_student_fk, assist_group_fk," +
        "assist_teacher_fk, assist_subject_fk, assist_first_turn, assist_second_turn, assist_updated)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS end_evaluation (end_evaluation_group_planning_id, examination_acta_ordinal_id, examination_acta_reval_id, examination_acta_extra_id," +
        "end_evaluation_student_id, end_evaluation_student_name, end_evaluation_list_number, end_evaluation_subject_fk, end_evaluation_group_fk," +
        "matriculated_subject_id, matriculated_subject_situation_id, ordinal_exam_evaluation_value_id," +
        "rev_exam_evaluation_value_id, extra_exam_evaluation_value_id," +
        "final_evaluation_id, ordinal_evaluation_id, rev_evaluation_id, extra_evaluation_id, end_evaluation_updated)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS periodic_evaluation (periodic_evaluation_id, periodic_evaluation_type_fk," +
        "periodic_evaluation_username, periodic_evaluation_host, periodic_evaluation_canceled, periodic_evaluation_value," +
        "periodic_evaluation_date, periodic_evaluation_subject_fk, periodic_evaluation_group_fk, periodic_evaluation_week," +
        "periodic_evaluation_student_fk, periodic_evaluation_deleted, periodic_evaluation_updated)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS evaluative_cut (cut_group_planning_id unique, cut_first_court_header_id, cut_second_court_header_id, cut_first_delivered, cut_second_delivered)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS student_cut (student_cut_abscent_hours_cut1, student_cut_abscent_hours_cut2, student_cut_assist_percent," +
        "student_cut_cualitative_evaluation1, student_cut_cualitative_evaluation2, student_cut_student_fk," +
        "student_cut_evaluative_cut_fk, student_cut_updated)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS activity_type (activity_type_id unique, activity_type_code unique, activity_type_name, activity_type_canceled)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS evaluation_value (evaluation_value_id unique, evaluation_value unique, evaluation_value_canceled)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS cualitative_evaluation (cualitative_evaluation_id unique, cualitative_evaluation_name, cualitative_evaluation_canceled)"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS periodic_evaluation_type (periodic_evaluation_type_id unique, periodic_evaluation_type_name," +
        "periodic_evaluation_type_code, periodic_evaluation_type_priority, periodic_evaluation_type_canceled)"
    );
  },
  insertTeacherData(data) {
    database.transaction(
      function(tx) {
        tx.executeSql(
          "INSERT INTO teacher_data (teacher_id, teacher_name) VALUES (?, ?)",
          [data.ID_SIGENU, data.Name]
        );
      },
      this.txError,
      this.txSuccess
    );
  },

  insertGroups(groupsData) {
    groupsData.forEach(element => {
      database.transaction(
        function(tx) {
          tx.executeSql(
            "INSERT INTO student_group (group_id, group_name) VALUES (?, ?)",
            [element.ID_SIGENU, element.Grupo]
          );
        },
        this.txError,
        this.txSuccess
      );
    });
  },
  insertStudents(studentsData) {
    studentsData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO student (student_id, student_name, student_last_name, student_second_last_name, student_group_fk) VALUES (?, ?, ?, ?, ?)",
          [
            element.student.ID_SIGENU,
            element.student.Name,
            element.student.Last_Name,
            element.student.Second_Last_Name,
            element.groupID
          ]
        );
      }, this.txError);
    });
  },
  insertGroupPlannings(planningData) {
    planningData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO group_planning (group_planning_id, group_fk, subject_fk) VALUES (?, ?, ?) ",
          [element.GrupoPlanningID, element.ID_SIGENU, element.SubjectID]
        );
      }, this.txError);
    });
  },
  insertSubjects(subjectsData) {
    subjectsData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO subject (subject_id , subject_name) VALUES (?, ?) ",
          [element.ID_SIGENU, element.Name]
        );
      }, this.txError);
    });
  },
  insertAssists(assistsData, fn) {
    assistsData.forEach((element, index) => {
      database.transaction(
        function(tx) {
          tx.executeSql(
            "INSERT INTO assist (assist_id, assist_date, assist_week, assist_activity_type_fk, assist_student_fk, assist_group_fk," +
              "assist_teacher_fk, assist_subject_fk, assist_first_turn, assist_second_turn, assist_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ",
            [
              element.ID_SIGENU,
              element.Date,
              element.Week,
              element.Activity_Type,
              element.Student,
              element.Grupo,
              element.Teacher,
              element.Subject,
              element.First_Turn,
              element.Second_Turn,
              element.updated
            ]
          );
        },
        this.txError,
        function() {
          fn(index, assistsData.length);
        }
      );
    });
  },
  insertEndEvaluations(evaluationsData) {
    evaluationsData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO end_evaluation (end_evaluation_group_planning_id, examination_acta_ordinal_id, examination_acta_reval_id, examination_acta_extra_id," +
            "end_evaluation_student_id, end_evaluation_student_name, end_evaluation_list_number, end_evaluation_subject_fk, end_evaluation_group_fk," +
            "matriculated_subject_id, matriculated_subject_situation_id, ordinal_exam_evaluation_value_id," +
            "rev_exam_evaluation_value_id, extra_exam_evaluation_value_id," +
            "final_evaluation_id, ordinal_evaluation_id, rev_evaluation_id, extra_evaluation_id, end_evaluation_updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
          [
            element.groupPlanningID,
            element.ID_Acta1,
            element.ID_Acta2,
            element.ID_Acta3,
            element.Student_ID,
            element.Student_Name,
            element.List_Number,
            element.Subject_ID,
            element.Group_ID,
            element.Matriculated_Subject_ID,
            element.Matriculated_Subject_Situation_ID,
            element.Ordinal_Exam_Evaluation_Value_ID,
            element.Rev_Exam_Evaluation_Value_ID,
            element.Extra_Exam_Evaluation_Value_ID,
            element.Final_Evaluation_Value_ID,
            element.Ordinal_Evaluation_ID,
            element.Rev_Evaluation_ID,
            element.Extra_Evaluation_ID,
            element.Updated
          ]
        );
      }, this.txError);
    });
  },
  insertPeriodicEvaluations(evaluationsData) {
    evaluationsData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO periodic_evaluation (periodic_evaluation_id, periodic_evaluation_type_fk," +
            "periodic_evaluation_username, periodic_evaluation_host, periodic_evaluation_canceled, periodic_evaluation_value," +
            "periodic_evaluation_date, periodic_evaluation_subject_fk, periodic_evaluation_group_fk, periodic_evaluation_week," +
            "periodic_evaluation_student_fk, periodic_evaluation_deleted, periodic_evaluation_updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            element.ID_SIGENU,
            element.Periodic_Evaluation_Type,
            element.User_Name,
            element.Host,
            element.Cancelled,
            element.Evaluation_Value,
            element.Date,
            element.Subject,
            element.Grupo,
            element.Week,
            element.Student,
            element.Deleted,
            element.Updated
          ]
        );
      }, this.txError);
    });
  },
  insertEvaluativeCuts(cutsData) {
    cutsData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO evaluative_cut (cut_group_planning_id, cut_first_court_header_id, cut_second_court_header_id, cut_first_delivered, cut_second_delivered) VALUES (?,?,?,?,?)",
          [
            element.groupPlanningID,
            element.firstCourtHeader,
            element.secondCourtHeader,
            element.firstDelivered,
            element.secondDelivered
          ]
        );
      }, this.txError);
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO student_cut (student_cut_abscent_hours_cut1, student_cut_abscent_hours_cut2, student_cut_assist_percent," +
            "student_cut_cualitative_evaluation1, student_cut_cualitative_evaluation2, student_cut_student_fk," +
            "student_cut_evaluative_cut_fk, student_cut_updated) VALUES (?,?,?,?,?,?,?,?) ",
          [
            element.Abscense_Hours_Court1,
            element.Abscense_Hours_Court2,
            element.Assistance_Percent,
            element.Cualitative_Evaluation_C1,
            element.Cualitative_Evaluation_C2,
            element.Student_ID,
            element.groupPlanningID,
            element.Updated
          ]
        );
      }, this.txError);
    });
  },
  insertActivityTypes(activityData) {
    activityData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO activity_type (activity_type_id, activity_type_code, activity_type_name, activity_type_canceled) VALUES (?,?,?,?) ",
          [element.ID_SIGENU, element.Code, element.Name, element.Cancelled]
        );
      }, this.txError);
    });
  },
  insertEvaluationValues(valuesData) {
    valuesData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO evaluation_value (evaluation_value_id, evaluation_value, evaluation_value_canceled) VALUES (?,?,?) ",
          [element.ID_SIGENU, element.Value, element.Cancelled]
        );
      }, this.txError);
    });
  },
  insertCualitativeEvaluations(cualitativeData) {
    cualitativeData.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO cualitative_evaluation (cualitative_evaluation_id, cualitative_evaluation_name, cualitative_evaluation_canceled) VALUES (?,?,?) ",
          [element.ID_SIGENU, element.Name, element.Cancelled]
        );
      }, this.txError);
    });
  },
  insertPeriodicEvaluationTypes(types) {
    types.forEach(element => {
      database.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO periodic_evaluation_type (periodic_evaluation_type_id, periodic_evaluation_type_name," +
            "periodic_evaluation_type_code, periodic_evaluation_type_priority, periodic_evaluation_type_canceled) VALUES (?,?,?,?,?) ",
          [
            element.ID_SIGENU,
            element.Name,
            element.Code,
            element.Priority,
            element.Cancelled
          ]
        );
      }, this.txError);
    });
  },

  //Database Queries...............................................................................................................................................

  getPlanifications(fn) {
    database.transaction(function(tx) {
      tx.executeSql(queryPlanifications, [], function(tx, results) {
        var planifications = [];
        for (var i = 0; i < results.rows.length; i++) {
          planifications.push({
            GroupPlanningID: results.rows.item(i).group_planning_id,
            GroupName: results.rows.item(i).group_name,
            SubjectName: results.rows.item(i).subject_name
          });
        }
        fn(planifications);
      });
    });
  },
  getStudentsFromPlanification(groupPlanningID, fn) {
    database.transaction(function(tx) {
      tx.executeSql(queryStudentsFromPlanification, [groupPlanningID], function(
        tx,
        results
      ) {
        var students = [];
        for (let i = 0; i < results.rows.length; i++) {
          students.push({
            StudentID: results.rows.item(i).student_id,
            StudentName: results.rows.item(i).student_name
          });
        }
        fn(students);
      });
    });
  },
  selectGroup(groupPlanningID, fn) {
    database.transaction(function(tx) {
      tx.executeSql(querySelectGroup, [groupPlanningID], function(tx, results) {
        var info = {
          GroupPlanningID: results.rows.item(0).group_planning_id,
          GroupID: results.rows.item(0).group_id,
          SubjectID: results.rows.item(0).subject_id,
          GroupName: results.rows.item(0).group_name,
          SubjectName: results.rows.item(0).subject_name
        };
        fn(info);
      });
    });
  },
  getTeacherData(fn) {
    database.transaction(function(tx) {
      tx.executeSql(queryTeacherData, [], function(tx, results) {
        var data = {
          TeacherName: results.rows.item(0).teacher_name,
          TeacherID: results.rows.item(0).teacher_id
        };
        fn(data);
      });
    });
  },
  getAssistFromStudent(studentID, subjectID, fn) {
    var assists = [];
    database.transaction(function(tx) {
      tx.executeSql(
        queryAssistFromStudentAndSubject,
        [studentID, subjectID],
        function(tx, results) {
          for (let i = 0; i < results.rows.length; i++) {
            var turn1;
            var turn2;
            if (results.rows.item(i).assist_first_turn === "true")
              turn1 = "Presente";
            else turn1 = "Ausente";
            if (results.rows.item(i).assist_second_turn === "true")
              turn2 = "Presente";
            else turn2 = "Ausente";
            assists.push({
              ActivityTypeName: results.rows.item(i).activity_type_name,
              Week: results.rows.item(i).assist_week,
              Date: results.rows.item(i).assist_date,
              FirstTurn: turn1,
              SecondTurn: turn2,
              ID: results.rows.item(i).assist_id,
              ActivityType: results.rows.item(i).assist_activity_type_fk,
              Updated: results.rows.item(i).assist_updated,
              StudentID: studentID,
              SubjectID: subjectID
            });
          }
          fn(assists);
        },
        function(error) {
          console.log("Transaction ERROR: " + error.message);
        }
      );
    });
  },
  getPeriodicEvaluationsFromStudent(studentID, subjectID, fn) {
    var evaluations = [];
    database.transaction(function(tx) {
      tx.executeSql(
        queryPeriodicEvaluationsFromStudentAndSubject,
        [studentID, subjectID],
        function(tx, results) {
          for (let i = 0; i < results.rows.length; i++) {
            evaluations.push({
              EvaluationTypeCode: results.rows.item(i)
                .periodic_evaluation_type_code,
              ID: results.rows.item(i).periodic_evaluation_id,
              EvaluationType: results.rows.item(i).periodic_evaluation_type_fk,
              EvaluationValue: results.rows.item(i).periodic_evaluation_value,
              Week: results.rows.item(i).periodic_evaluation_week,
              Date: results.rows.item(i).periodic_evaluation_date,
              Deleted: results.rows.item(i).periodic_evaluation_deleted,
              Updated: results.rows.item(i).periodic_evaluation_updated,
              StudentID: studentID,
              SubjectID: subjectID
            });
          }
          fn(evaluations);
        }
      );
    });
  },
  getEndEvaluationsFromPlanification(groupPlanningID, fn) {
    var evaluations = [];
    database.transaction(function(tx) {
      tx.executeSql(
        queryEndEvaluationsFromPlanification,
        [groupPlanningID],
        function(tx, results) {
          for (let i = 0; i < results.rows.length; i++) {
            evaluations.push({
              GroupPlanningID: results.rows.item(i)
                .end_evaluation_group_planning_id,
              StudentID: results.rows.item(i).end_evaluation_student_id,
              StudentName: results.rows.item(i).end_evaluation_student_name,
              OrdinalEvaluationValueID: results.rows.item(i)
                .ordinal_exam_evaluation_value_id,
              RevEvaluationValueID: results.rows.item(i)
                .rev_exam_evaluation_value_id,
              ExtraEvaluationValueID: results.rows.item(i)
                .extra_exam_evaluation_value_id,
              FinalEvaluationID: results.rows.item(i).final_evaluation_id
            });
          }
          fn(evaluations);
        }
      );
    });
  },
  getEvaluativeCutsFromGroup(groupPlanningID, fn) {
    var cuts = [];
    database.transaction(function(tx) {
      tx.executeSql(queryEvaluativeCutsFromGroup, [groupPlanningID], function(
        tx,
        results
      ) {
        for (let i = 0; i < results.rows.length; i++) {
          cuts.push({
            GroupPlanningID: results.rows.item(i).cut_group_planning_id,
            FirstDelivered: results.rows.item(i).cut_first_delivered,
            SecondDelivered: results.rows.item(i).cut_second_delivered,
            CualitativeEvaluation1: results.rows.item(i)
              .student_cut_cualitative_evaluation1,
            CualitativeEvaluation2: results.rows.item(i)
              .student_cut_cualitative_evaluation2,
            StudentID: results.rows.item(i).student_id,
            StudentName: results.rows.item(i).student_name
          });
        }
        fn(cuts);
      });
    });
  },
  getActivityTypes(fn) {
    var activityTypes = [];
    database.transaction(function(tx) {
      tx.executeSql("SELECT * FROM activity_type ", [], function(tx, results) {
        for (let i = 0; i < results.rows.length; i++) {
          activityTypes.push({
            ID: results.rows.item(i).activity_type_id,
            Code: results.rows.item(i).activity_type_code,
            Name: results.rows.item(i).activity_type_name
          });
        }
        fn(activityTypes);
      });
    });
  },
  getPeriodicEvaluationTypes(fn) {
    var evaluationTypes = [];
    database.transaction(function(tx) {
      tx.executeSql("SELECT * FROM periodic_evaluation_type", [], function(
        tx,
        results
      ) {
        for (let i = 0; i < results.rows.length; i++) {
          evaluationTypes.push({
            ID: results.rows.item(i).periodic_evaluation_type_id,
            Name: results.rows.item(i).periodic_evaluation_type_name,
            Code: results.rows.item(i).periodic_evaluation_type_code
          });
        }
        fn(evaluationTypes);
      });
    });
  },
  getEvaluationValues(fn) {
    var values = [];
    database.transaction(function(tx) {
      tx.executeSql("SELECT * FROM evaluation_value", [], function(
        tx,
        results
      ) {
        for (let i = 0; i < results.rows.length; i++) {
          values.push({
            ID: results.rows.item(i).evaluation_value_id,
            Value: results.rows.item(i).evaluation_value
          });
        }
        fn(values);
      });
    });
  },
  //Update Queries.....................................................................
  updateEndEvaluations(evaluation, fn) {
    database.transaction(function(tx) {
      tx.executeSql(
        queryUpdateEndEvaluations,
        [
          evaluation.OrdinalEvaluationValueID,
          evaluation.RevEvaluationValueID,
          evaluation.ExtraEvaluationValueID,
          evaluation.FinalEvaluationID,
          evaluation.Updated,
          evaluation.GroupPlanningID,
          evaluation.StudentID
        ],
        function(tx, results) {
          fn();
        }
      );
    });
  },
  updateEvaluativeCut(cut) {
    database.transaction(function(tx) {
      tx.executeSql(queryUpdateEvaluativeCuts, [
        cut.CualitativeEvaluation1,
        cut.CualitativeEvaluation2,
        cut.GroupPlanningID,
        cut.StudentID
      ]);
    });
  },
  updateAssist(assist, fn) {
    database.transaction(function(tx) {
      tx.executeSql(
        queryUpdateAssist,
        [
          assist.FirstTurn,
          assist.SecondTurn,
          assist.Updated,
          assist.StudentID,
          assist.SubjectID,
          assist.Date,
          assist.ActivityType
        ],
        function(tx, results) {
          fn();
        }
      );
    });
  },
  updatePeriodicEvaluation(evaluation, fn) {
    database.transaction(function(tx) {
      tx.executeSql(
        queryUpdatePeriodicEvaluation,
        [
          evaluation.EvaluationValue,
          evaluation.Updated,
          evaluation.StudentID,
          evaluation.SubjectID,
          evaluation.Date,
          evaluation.EvaluationType
        ],
        function(tx, results) {
          fn();
        }
      );
    });
  }
};
