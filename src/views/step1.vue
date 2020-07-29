<template>
  <div class="step1">
    <Input v-model="value" type="textarea" :rows="4" placeholder="请输入NFV VIM北向接口ListResourcesMap接口返回的结果" />
    <Button type="primary" @click="parse">解析</Button>
    <Divider />
    <AllHostInfo :data="tableData"/>
  </div>
</template>
<script>
  import AllHostInfo from "../components/AllHostInfo";
  export default {
    components: {AllHostInfo},
    data () {
      return {
        value: '',
        tableData: this.$store.getters.getAllHostInfo.slice(0,50)
      }
    },
    methods: {
      parse() {
        let hostJson = JSON.parse(this.value);
        const hosts = hostJson.hypervisors
        let _tableData = []
        for(let i=0; i<hosts.length ; i++){
          let _host = {};
          _host.hostname = hosts[i].hostname
          _host.cAZ = hosts[i].cAZ
          _host.cHAs = hosts[i].cHAs[0]?hosts[i].cHAs[0].name:''
          _host.cRegion = hosts[i].cRegion
          _host.total_cpu = hosts[i].numa_topology.cells[0].cpus_unpinned_num + hosts[i].numa_topology.cells[1].cpus_unpinned_num
          _host.numa_node1_cpus_unpinned_num = hosts[i].numa_topology.cells[0].cpus_unpinned_num
          _host.numa_node1_mem1 = (hosts[i].numa_topology.cells[0].mempages[1].total - hosts[i].numa_topology.cells[0].mempages[1].used) * hosts[i].numa_topology.cells[0].mempages[1].size_kb
          _host.numa_node1_other = JSON.stringify(hosts[i].numa_topology.cells[0])
          _host.numa_node2_cpus_unpinned_num = hosts[i].numa_topology.cells[1].cpus_unpinned_num
          _host.numa_node2_mem1 = (hosts[i].numa_topology.cells[1].mempages[1].total - hosts[i].numa_topology.cells[0].mempages[1].used) * hosts[i].numa_topology.cells[0].mempages[1].size_kb
          _host.numa_node2_other = JSON.stringify(hosts[i].numa_topology.cells[1])
          _host.total_bandwidths_ingress_vsw = hosts[i].bandwidths[0]?hosts[i].bandwidths[0].total_bandwidths_ingress_vsw:''
          _host.total_bandwidths_egress_vsw = hosts[i].bandwidths[0]?hosts[i].bandwidths[0].total_bandwidths_egress_vsw:''
          _host.total_mem = _host.numa_node1_mem1 + _host.numa_node2_mem1
          _tableData.push(_host)
        }
        console.log("hosts:{}",_tableData)
        this.tableData = _tableData.sort(this.sortBy).slice(0,50)
        this.$store.commit('setAllHostInfo', _tableData);
      },
      sortBy: function (obj1, obj2) {//比较函数
        if (obj1.total_cpu > obj2.total_cpu) {
          if (obj1.total_mem > obj2.total_mem){
            return -1
          } else if (obj1.total_mem < obj2.total_mem) {
            return 1;
          }else{
            return 0
          }
        }else if (obj1.total_cpu < obj2.total_cpu){
          return 1;
        }else{
          return 0;
        }
      }
    }
  }
</script>