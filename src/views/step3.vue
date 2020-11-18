<template>
  <div class="step3">
    <IntegrationTable :height="550" :columns="columns" :tableData="tableData" />
  </div>
</template>
<script>
import IntegrationTable from "../components/IntegrationTable";
export default {
  components: { IntegrationTable },
  data() {
    return {
      tableData: this.$store.getters.getAllHosts,
      columns: [
        {
          type: "index",
          width: 100,
          align: "center"
        },
        {
          title: "主机名称",
          key: "name",
          align: "center",
          width: 150
        },
        {
          title: "所属HA",
          key: "cHAs",
          align: "center",
          width: 150
        },
        {
          title: "虚拟机集合",
          key: "vmIdList",
          align: "center"
        },
        {
          title: "碎片率",
          key: "cpu_unalloc_ratio",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "power",
          key: "power",
          width: 150,
          align: "center"
        }
      ]
    };
  },
  created() {
    this.parse();
  },
  methods: {
    parse() {
      let hosts = this.$store.getters.getAllHosts;
      let vms = this.$store.getters.getAllVms;
      let hostNameAndVmIds = {};
      let hostNameAndVNFs = {};
      for (let i = 0, len = vms.length; i < len; i++) {
        let vm = vms[i];
        if (hostNameAndVmIds[vm.cHost] == undefined) {
          let vmIds = [];
          vmIds.push(vm.name);
          hostNameAndVmIds[vm.cHost] = vmIds;
        } else {
          hostNameAndVmIds[vm.cHost].push(vm.name);
        }
        if (vm.vnf_name != "" && vm.vnf_name != undefined) {
          hostNameAndVNFs[vm.cHost] = hostNameAndVNFs[vm.cHost]
            ? hostNameAndVNFs[vm.cHost] + "|" + vm.vnf_name
            : vm.vnf_name;
        }
      }
      for (let j = 0, len = hosts.length; j < len; j++) {
        let host = hosts[j];
        host.vmIdList = hostNameAndVmIds[host.name];
        if (hostNameAndVmIds[host.name] == undefined) {
          host.vmIdList = [];
        }
        host.vnf_name = hostNameAndVNFs[host.name]
          ? hostNameAndVNFs[host.name]
          : "";
      }
      this.tableData = hosts;
      this.$store.commit("setAllHosts", hosts);
    }
  }
};
</script>