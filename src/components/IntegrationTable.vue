<template>
  <div>
    <Divider />
    <Input v-model="name" placeholder="请输入名称（支持模糊查询）" style="width: 300px" clearable />&nbsp;
    <Select
      v-model="ha"
      :selectedHAs="selectedHAs"
      style="width:300px"
      placeholder="请选择HA"
      clearable
    >
      <Option v-for="item in has" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>&nbsp;
    <Select
      v-model="vnf"
      v-show="showVnf"
      :selectedVNFs="selectedVNFs"
      style="width:300px"
      placeholder="请选择VNF"
      clearable
    >
      <Option v-for="item in vnfs" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>&nbsp;
    <Button type="primary" @click="query">查询</Button>&nbsp;
    <Button type="primary" @click="exportData()">
      <Icon type="ios-download-outline"></Icon>导出全部数据
    </Button>
    <Table ref="table" size="small" :columns="columns" :data="tData" border :height="height"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" @on-change="changePage" show-total show-elevator></Page>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "IntegrationTable",
  props: {
    columns: Array,
    tableData: Array,
    selectedHAs: Array,
    selectedVNFs: Array,
    showVnfSelected: Boolean,
    showVnf: Boolean,
    height: {
      type: [Number, String],
      default() {
        return "425";
      }
    }
  },
  created() {
    this.query();
  },
  data() {
    return {
      name: "",
      ha: "",
      vnf: "",
      has: this.$store.getters.getAllHAs,
      vnfs: this.$store.getters.getAllVNFs,
      tData: this.tableData.slice(0, 10),
      total: this.tableData ? this.tableData.length : 0,
      queryData: []
      // showVnf: false
    };
  },
  watch: {
    tableData: function(val) {
      this.tData = val.slice(0, 10);
      this.queryData = val;
      this.total = val.length;
    },
    selectedHAs: function(val) {
      this.has = val;
    },
    selectedVNFs: function(val) {
      this.vnfs = val;
    },
    showVnfSelected: function(val) {
      this.showVnf = val;
    }
  },
  methods: {
    query() {
      if (
        this.name == "" &&
        (this.ha == "" || this.ha == undefined) &&
        (this.vnf == "" || this.vnf == undefined)
      ) {
        this.tData = this.tableData.slice(0, 10);
        this.total = this.tableData.length;
        return;
      }
      this.queryData = this.tableData;
      let ha = this.ha;
      if (this.ha != "" && this.ha != undefined) {
        this.queryData = this.queryData.filter(function(item) {
          return item.cHAs == ha;
        });
      }
      let name = this.name;
      if (this.name != "" && this.name != undefined) {
        this.queryData = this.queryData.filter(function(item) {
          return item.name.indexOf(name) > -1;
        });
      }
      let vnf = this.vnf;
      if (this.vnf != "" && this.vnf != undefined) {
        this.$store.commit("setCurrentVNF", vnf);
        this.queryData = this.queryData.filter(function(item) {
          return item.vnf_name.indexOf(vnf) >= 0;
        });
      }

      this.tData = this.queryData.slice(0, 10);
      this.total = this.queryData.length;
    },
    changePage(page) {
      let currentData = this.tableData;
      if (
        this.name != "" ||
        this.ha != "" ||
        this.ha != undefined ||
        this.vnf != "" ||
        this.vnf != undefined
      ) {
        currentData = this.queryData;
      }
      this.tData = currentData.slice((page - 1) * 10, (page - 1) * 10 + 10);
    },
    exportData() {
      let currentData = this.tableData;
      if (
        this.name != "" ||
        this.ha != "" ||
        this.ha == undefined ||
        this.vnf != "" ||
        this.vnf == undefined
      ) {
        currentData = this.queryData;
      }
      this.$refs.table.exportCsv({
        filename: "资源池节能迁移策略",
        columns: this.columns,
        data: currentData
      });
    }
  }
};
</script>
