<template>
  <div class="step1">
    <Input v-model="value" type="textarea" :rows="4"  :style="{width:width+'%'}" placeholder="请输入NFV VIM北向接口ListResourcesMap接口返回的结果" />
    <Input v-model="vimcm" type="textarea" :rows="4"  :style="{width:width+'%'}" placeholder="请输入VIM_CM接口返回的结果" />
    <Input v-model="hostPM" type="textarea" :rows="4"  :style="{width:width+'%'}" placeholder="请输入HOST_PM接口返回的结果" />
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
        width: 33,
        value: '',
        vimcm: '',
        hostPM: '',
        tableData: this.$store.getters.getAllHosts.slice(0,50)
      }
    },
    methods: {
      parse() {
        let tableData = this.parseListResourceMap()
        this.parseVimCM(tableData)
        this.parseHostPM(tableData)
        console.log("allHosts:{}",tableData)
        this.tableData = tableData.sort(this.sortBy).slice(0,50)
        this.$store.commit('setAllHosts', tableData);
      },
      parseListResourceMap(){
        let hostJson = JSON.parse(this.value);
        const hosts = hostJson.hypervisors
        let _tableData = []
        for(let i=0; i<hosts.length ; i++){
          if(hosts[i].service_host == undefined){
            continue
          }
          let _host = {}
          _host.hostname = hosts[i].service_host
          _host.total_free_cpu = hosts[i].vcpus - hosts[i].vcpus_used
          _host.total_cpu = parseInt(hosts[i].vcpus)
          _host.cpu_unalloc_ratio = (hosts[i].vcpus - hosts[i].vcpus_used) / hosts[i].vcpus
          _host.total_mem = hosts[i].memory_mb
          _host.total_free_mem = hosts[i].memory_mb - hosts[i].memory_mb_used
          _host.numa_node1_total_cpus = hosts[i].numa_topology[0].cpuset.length
          _host.numa_node1_free_cpus = hosts[i].numa_topology[0].cpuset.length - hosts[i].numa_topology[0].cpu_usage
          let node1Info = hosts[i].numa_topology[0].mempages[1];
          _host.numa_node1_total_mem = node1Info.total  * node1Info.size_kb /1024
          _host.numa_node1_free_mem = (node1Info.total - node1Info.used - node1Info.reserved) * node1Info.size_kb /1024
          _host.numa_node1_other = JSON.stringify(hosts[i].numa_topology[0])
          _host.numa_node2_total_cpus = hosts[i].numa_topology[1].cpuset.length
          _host.numa_node2_free_cpus = hosts[i].numa_topology[1].cpuset.length - hosts[i].numa_topology[1].cpu_usage
          let node2Info = hosts[i].numa_topology[1].mempages[1];
          _host.numa_node2_total_mem =node2Info.total  * node2Info.size_kb /1024
          _host.numa_node2_free_mem =(node2Info.total - node2Info.used - node2Info.reserved) * node2Info.size_kb /1024
          _host.numa_node2_other = JSON.stringify(hosts[i].numa_topology[1])
          _host.total_bandwidths_ingress = hosts[i].host_bandwidth_ingress_ovs_default_all_avalible_bandwidth - hosts[i].host_bandwidth_ingress_ovs_default_allocated_bandwidth
          _host.total_bandwidths_egress = hosts[i].host_bandwidth_egress_ovs_default_all_avalible_bandwidth - hosts[i].host_bandwidth_egress_ovs_default_allocated_bandwidth
          _tableData.push(_host)
        }
        return _tableData
      },
      parseVimCM(tableData) {
        let vimCMJson = JSON.parse(this.vimcm);
        let hostNameAndHost = {}
        for(let i=0,len=vimCMJson.length;i<len;i++) {
          let hosts = vimCMJson[i].hosts.host
          for (let j = 0, len = hosts.length; j < len; j++) {
            let host = hosts[j]
            hostNameAndHost[host.hostname] = host
          }
        }
        for(let i=0; i<tableData.length ; i++){
          let _host = tableData[i]
          _host.cHAs = hostNameAndHost[_host.hostname].cHAs ? hostNameAndHost[_host.hostname].cHAs[0] : ''
        }
      },
      parseHostPM(tableData) {
        let hostPMJson = JSON.parse(this.hostPM);
        let hostNameAndHostPM = {}
        for(let i=0,len=hostPMJson.length;i<len;i++) {
          let hostPM = hostPMJson[i]
          hostNameAndHostPM[hostPM.hostname] = hostPM
        }
        for(let i=0; i<tableData.length ; i++){
          let _host = tableData[i]
          _host.cpuutil = hostNameAndHostPM[_host.hostname].cpuutil
        }
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
      },
    }
  }
</script>