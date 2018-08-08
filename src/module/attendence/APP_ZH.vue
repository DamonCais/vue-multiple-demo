<template>
  <div ref="table" id="attendence">
    <el-row>
      <el-col :span="8">
        <div class="flex-input">
          <span>选择日期:</span>
          <el-date-picker @change="dateChange" :default-value="new Date()" format="yyyy-MM-dd" v-model="date" type="date" :picker-options="pickerBefore" placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-col>

    </el-row>
    <el-row class="mt-4">
      <my-table class="text-align:center;" :showData="showData" :gridData="gridData">
        <el-table-column width="500px" label="Operate">
          <template slot-scope="scope">
            <div class="absentBtn" v-if="scope.$index===0">
              <el-button type="success" size="small" @click="setAllStatus('present')">全部出席</el-button>
              <el-button type="warning" size="small" @click="setAllStatus('late')">全部迟到</el-button>
              <el-button type="primary" size="small" @click="setAllStatus('leave')">全部请假</el-button>
              <el-button type="danger" size="small" @click="setAllStatus('absence')">全部缺席</el-button>
            </div>
            <div class="absentBtn" v-else>
              <el-button :plain="scope.row.type!=='present'" type="success" size="small" @click="setStatus(scope.row.user_id,'present')">出席</el-button>
              <el-button :plain="scope.row.type!=='late'" type="warning" size="small" @click="setStatus(scope.row.user_id,'late')">迟到</el-button>
              <el-button :plain="scope.row.type!=='leave'" type="primary" size="small" @click="setStatus(scope.row.user_id,'leave')">请假</el-button>
              <el-button :plain="scope.row.type!=='absence'" type="danger" size="small" @click="setStatus(scope.row.user_id,'absence')">缺席</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Operate">
          <template slot-scope="scope">
            <div v-if="scope.$index===0">
              <span>备注</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.remark" autosize type="textarea"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Operate">
          <template slot-scope="scope">
            <div v-if="scope.$index===0">
              <span>附件</span>
            </div>
            <div v-else>
              <input multiple="multiple" style="position:absolute;left:-9999px;" :id="'imginput'+scope.$index" :ref="'imginput'+scope.$index" type="file" @change="imgChange(scope.$index)">
              <label class="el-button" :for="'imginput'+scope.$index">添加</label>
              <!-- <el-button @click="postAcceptor(scope.row.user_id)">添加</el-button> -->
              <el-button v-show="scope.row.attachments.length" @click="showAttachments(scope.$index)" type="success" icon="el-icon-document" circle></el-button>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-row>
    <el-row class="flex-end mt-5">

    </el-row>
    <div class="mt-4">
      共 {{gridData.length-1}} 位学生,出席人数:{{getNumByType('present')}},迟到人数:{{getNumByType('late')}},请假人数:{{getNumByType('leave')}},缺席人数{{getNumByType('absence')}}
    </div>
    <div class="mt-2 flex-end">
      <el-button @click="updateAttendances('')" :type="editing?'success':'info'">保存</el-button>
    </div>

    <!-- 查看附件 -->
    <el-dialog :close-on-click-modal="false" title="查看附件" :visible.sync="dialogVisible" width="40%">
      <p v-for="(a,i) in attachments" :key="i" class="flex-between">
        <a target="_blank" :href="a.url">{{a.name}}</a>
        <el-button @click="delAttachments(i)" type="danger" size="small" icon="el-icon-delete" circle></el-button>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delAttachmentsCancel">取 消</el-button>
        <el-button type="primary" @click="delAttachmentsConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

import myTable from "./myTable";
import { doGet, doPost, doPatch, upLoadImg } from "@/api/api";
export default {
  components: {
    myTable
  },
  mounted() {
    this.date = new Date();
    let reg = /class\/(\d+)/;
    let arr = window.location.href.match(reg);
    if (arr) {
      this.classId = arr[1];
      console.log(this.classId);
    }
    this.fetchAttendances();
  },
  computed: {
    ...mapGetters(["laravel_session"])
  },
  data() {
    return {
      classId: 1,
      attendances: [],
      showData: [
        { type: "string", prop: "user_id", label: "user_id" },
        { type: "string", prop: "user_name", label: "user_id" }
      ],
      gridData: [
        {
          user_id: "#",
          user_name: "姓名"
        }
      ],
      date: null,
      dialogVisible: false,
      attachments: [],
      attachmentsIndex: 0,
      editing: false,
      pickerBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    setEdit(bool) {
      this.editing = bool;
    },
    delAttachmentsConfirm() {
      this.dialogVisible = false;
      this.gridData[this.attachmentsIndex].attachments = this.attachments;
    },
    delAttachmentsCancel() {
      this.dialogVisible = false;
      this.attachments = this.gridData[this.attachmentsIndex].attachments;
    },
    delAttachments(i) {
      this.attachments.splice(i, 1);
      this.setEdit(true);
      // this.gridData[this.attachmentsIndex].attachments = this.attachments;
    },
    showAttachments(index) {
      this.attachments = JSON.parse(
        JSON.stringify(this.gridData[index].attachments)
      );
      this.attachmentsIndex = index;
      this.dialogVisible = true;
    },
    imgChange(index) {
      let inputDOM = this.$refs["imginput" + index];
      if (!inputDOM.files[0]) return;
      const formData = new FormData();
      for (var i = 0; i < inputDOM.files.length; i++) {
        formData.append("files[]", inputDOM.files[i]);
      }
      this.upimg(formData, index);
    },
    upimg(formData, index) {
      upLoadImg("/attachments/postAcceptor/attendance", formData).then(res => {
        this.setEdit(true);

        let ids = res.files;
        if (this.gridData[index].attachments) {
          this.gridData[index].attachments.push(...ids);
        } else {
          this.gridData[index].attachments = ids;
        }
      });
    },
    dateChange() {
      this.fetchAttendances();
    },
    getNumByType(type) {
      return this.gridData.filter(item => item.type === type).length;
    },
    absent(id) {
      if (id) {
        let index = this.gridData.findIndex(item => item.id === id);
        this.gridData[index].status = "absent";
      } else {
        this.gridData.forEach(element => {
          element.status = "absent";
        });
      }
    },
    fetchAttendances() {
      const loading = this.$loading({
        target: this.$refs.table,
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 1)"
      });
      doGet(`/groups/group/${this.classId}/attendances/fetch`, {
        date: this.formatDateTime(this.date, "yyyy-MM-dd")
      }).then(res => {
        console.log(res);
        this.gridData = [this.gridData[0]].concat(...res.data);
        this.setEdit(false);
        loading.close();
      });
    },
    setStatus(id, type) {
      let index = this.gridData.findIndex(item => item.user_id === id);
      if (this.gridData[index].type) {
        this.$confirm("是否修改该学生的考勤?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.gridData[index].type = type;
            this.gridData[index].time = this.formatDateTime(this.date);
            // this.updateAttendances([this.gridData[index]]);
            this.setEdit(true);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消修改"
            });
          });
      } else {
        this.gridData[index].type = type;
        this.gridData[index].time = this.formatDateTime(this.date);
        this.setEdit(true);
      }
    },
    setAllStatus(type) {
      let arr = this.gridData.filter(item => !item.type);
      arr.forEach((element, index) => {
        if (!index) return;
        element.type = type;
        element.time = this.formatDateTime(this.date);
        this.setEdit(true);
      });
    },
    updateAttendances(arr) {
      if (!this.editing) {
        return;
      }
      let attendances = arr || this.gridData.filter(item => item.type);
      let d = this.formatDateTime(this.date, "yyyy-MM-dd");
      doPatch(`/groups/group/${this.classId}/attendances?date=${d}`, {
        attendances
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.setEdit(false);
          // this.fetchAttendances();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "发生错误"
          });
          // location.reload();
        });
    },
    formatDateTime(date, format) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      if (!format) {
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      } else {
        return y + "-" + m + "-" + d;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
#attendence {
  padding: 40px;
}
.absentBtn {
  .el-button {
    width: 80px;
  }
}
</style>
