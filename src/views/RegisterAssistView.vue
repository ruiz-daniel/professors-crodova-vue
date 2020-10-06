/* eslint-disable no-unused-vars */

<template>
  <div id="p-formgroup-inline">
    <div class="p-grid p-justify-center"></div>
    <div class="p-col-12">
      <h3>Registrar Asistencia</h3>
      <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
    </div>
    <div class="p-grid">
      <div class="p-col-6">
        <Calendar
          placeholder="Fecha"
          v-model="date"
          dateFormat="dd/mm/yy"
          style="width:200px; padding-right:20px"
          v-on:date-select="loadAssists()"
        />
        <Dropdown
          v-model="activity_type"
          :options="getActivityTypesNames()"
          placeholder="Actividad"
          style="margin-top:1rem; width:180px"
          v-on:change="loadAssists()"
          id="inputActType"
        />
      </div>
      <div class="p-col-6">
        <Dropdown
          v-model="week"
          :options="listWeeks()"
          placeholder="Semana"
          style="margin-top:1rem"
          v-on:change="loadAssists()"
          id="inputWeek"
        />
      </div>
    </div>
    <div class="p-field">
      <Button
        icon="pi pi-save"
        label="Guardar Cambios"
        v-on:click="
          if (assistLoaded) {
            updateAssist();
          } else {
            saveAssist();
          }
        "
      />
      <h4 v-if="assistLoaded">Cargado registro de asistencia existente</h4>
    </div>
    <div>
      <DataTable :value="assists" :paginator="true" :rows="4">
        <Column field="student" header="Estudiante">
          <template #body="slotProps">
            {{ slotProps.data.StudentName }}
          </template>
        </Column>
        <Column field="firstTurn" header="1er Turno">
          <template #body="slotProps">
            <Checkbox :binary="true" v-model="slotProps.data.First_Turn" />
          </template>
        </Column>
        <Column field="secondTurn" header="2do Turno">
          <template #body="slotProps">
            <Checkbox :binary="true" v-model="slotProps.data.Second_Turn" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
var moment = require("moment");
export default {
  name: "RegisterAssist",
  data() {
    return {
      assists: [],
      loadedAssistsOld: [],
      assistLoaded: false,
      activity_type: "",
      week: {},
      date: new Date(),
      selectActivityDialog: false
    };
  },
  computed: {
    parsedDate() {
      return moment(this.date).format("dddd, MMMM Do YYYY");
    },
    fieldsSelected() {
      return this.activity_type != "" && this.week > 0 && this.date != null;
    }
  },
  methods: {
    getActivityTypes() {
      var store = this.$store;
      this.$root.Database.getActivityTypes(function(results) {
        store.commit("LOAD_ACTIVITY_TYPES", results);
      });
    },
    getActivityTypesNames() {
      var names = [];
      this.$store.state.activityTypes.forEach(element => {
        names.push(element.Name);
      });
      return names;
    },
    createAssists() {
      var students = this.$store.state.students;
      this.assists = [];
      students.forEach(element => {
        this.assists.push({
          Date: new Date(),
          Week: 1,
          Activity_Type: {},
          Student: element.StudentID,
          StudentName: element.StudentName,
          Grupo: this.$store.state.groupID,
          Teacher: this.$store.state.teacher_id,
          Subject: this.$store.state.subjectID,
          First_Turn: true,
          Second_Turn: true,
          updated: false
        });
      });
    },
    loadAssists() {
      var loadedAssists = [];
      var setAssists = this.setAssists;
      var selectedDate = this.date;
      var loaded = this.setLoadedAssists;
      var createAssists = this.createAssists;
      if (this.fieldsSelected) {
        this.$root.Database.getAssistRecordFromGroup(
          this.week,
          this.$store.getters.getActivityTypeIDFromName(this.activity_type),
          this.$store.state.subjectID,
          this.$store.state.groupID,
          function(assists) {
            assists.forEach(element => {
              if (
                moment(element.Date).format("dddd, MMMM Do YYYY") ===
                moment(selectedDate).format("dddd, MMMM Do YYYY")
              ) {
                loadedAssists.push(element);
              }
            });
            if (loadedAssists.length > 0) {
              setAssists(loadedAssists);
              loaded(true);
            } else {
              createAssists();
              loaded(false);
            }
          }
        );
      }
    },
    setAssists(assists) {
      this.assists = assists;
      assists.forEach(element => {
        this.loadedAssistsOld.push({
          Date: element.Date,
          First_Turn: element.First_Turn,
          Second_Turn: element.Second_Turn,
          Updated: element.Updated,
          Student: element.Student,
          StudentName: element.StudentName
        });
      });
    },
    setLoadedAssists(loaded) {
      this.assistLoaded = loaded;
    },
    listWeeks() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    },
    saveAssist() {
      var toast = this.$toast;
      if (this.fieldsSelected) {
        this.assists.forEach(element => {
          element.Week = this.week;
          element.Date = this.date;
          element.Activity_Type = this.$store.getters.getActivityTypeIDFromName(
            this.activity_type
          );
        });
        this.$root.Database.insertAssists(
          this.assists,
          this.$store.state.groupPlanningID,
          this.$store.state.subjectHours,
          function(index, size) {
            if (index === size - 1)
              toast.add({
                severity: "success",
                summary: "Exito",
                detail: "Se han insertado las asistencias",
                life: 3000
              });
          }
        );
      } else
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Campos vacíos",
          life: 3000
        });
    },
    updateAssist() {
      var toast = this.$toast;
      var assistsForUpdate = [];
      for (let i = 0; i < this.assists.length; i++) {
        if (
          this.assists[i].First_Turn !== this.loadedAssistsOld[i].First_Turn ||
          this.assists[i].Second_Turn !== this.loadedAssistsOld[i].Second_Turn
        ) {
          assistsForUpdate.push({
            FirstTurn: this.assists[i].First_Turn,
            SecondTurn: this.assists[i].Second_Turn,
            Updated: false,
            Modified: true,
            StudentID: this.assists[i].Student,
            SubjectID: this.$store.state.subjectID,
            Date: this.date,
            ActivityType: this.$store.getters.getActivityTypeIDFromName(
              this.activity_type
            )
          });
        }
      }
      this.$root.Database.updateMultipleAssists(assistsForUpdate, function() {
        toast.add({
          severity: "success",
          summary: "Éxito",
          detail: "Se ha actualizado el registro de asistencia",
          life: 7000
        });
      });
    }
  }
};
</script>

<style scoped>
.p-button {
  margin-right: 0.5rem;
}
</style>
