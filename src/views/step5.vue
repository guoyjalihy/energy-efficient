<template>
  <div class="step5">
    <MoveResultTable :data="tableData"/>
  </div>
</template>
<script>
  import MoveResultTable from "../components/MoveResultTable";
  export default {
    components: {MoveResultTable},
    data () {
      return {
        tableData : []
      }
    },
    created() {
      let allHostInfo = this.$store.getters.getAllHostInfo
      for(let i=0,len=allHostInfo.length;i<len;i++){
        allHostInfo[i].anti_affinity = []
        allHostInfo[i].affinity = []
        allHostInfo[i].after_numa_node1_cpus_unpinned_num = allHostInfo[i].numa_node1_cpus_unpinned_num
        allHostInfo[i].after_numa_node1_mem1 = allHostInfo[i].numa_node1_mem1
        allHostInfo[i].after_numa_node2_cpus_unpinned_num = allHostInfo[i].numa_node2_cpus_unpinned_num
        allHostInfo[i].after_numa_node2_mem1 = allHostInfo[i].numa_node2_mem1
        allHostInfo[i].after_total_cpu = allHostInfo[i].total_cpu
        allHostInfo[i].after_total_mem = allHostInfo[i].total_mem
        allHostInfo[i].numa_node1_VM_Ids = []
        allHostInfo[i].numa_node2_VM_Ids = []
      }
      // let allVms = this.$store.getters.getAllVms
      // let todoHostVms = this.$store.getters.getTodoHostVms
      let todoVms = this.$store.getters.getTodoVms
      let selectedHost = []
      let affinityHost = {}
      for(let i=0,len=todoVms.length;i<len;i++){
        let vm = todoVms[i]
        for(let j=0,len=allHostInfo.length;j<len;j++){
          let host = allHostInfo[j];
          if (vm.type == 'anti-affinity'){
            if (host.anti_affinity.indexOf(vm.name) > -1){
              continue
            }
            if(!this.allowedDeployVmToHost(vm,host)){
              continue
            }
            this.computeAndRecordResource(vm,host,selectedHost)
          }else if(vm.type == 'affinity'){
            if (affinityHost[vm.name] == undefined){
              if(!this.allowedDeployVmToHost(vm,host)){
                continue
              }
              this.computeAndRecordResource(vm,host,selectedHost)
            }else {
              let _host = affinityHost[vm.name]
              if(!this.allowedDeployVmToHost(vm,_host)){
                continue
              }
              this.computeAndRecordResource(vm,_host,selectedHost)
            }
          }else{
            if(!this.allowedDeployVmToHost(vm,host)){
              continue
            }
            this.computeAndRecordResource(vm,host,selectedHost)
          }
          break
        }
      }
      this.tableData = selectedHost
    },
    methods: {
      allowedDeployVmToHost: function(vm,host){
        if (host.after_numa_node1_cpus_unpinned_num < vm.vCpus && host.after_numa_node2_cpus_unpinned_num < vm.vCpus){
          return false
        }
        if (host.after_numa_node1_mem1 < vm.vRams && host.after_numa_node1_mem1 < vm.vRams){
          return false
        }
        return true
      },
      computeAndRecordResource: function(vm,host,selectedHost){
        if (vm.type == 'anti-affinity'){
          host.anti_affinity.push(vm.name)
        }else if(vm.type == 'affinity'){
          host.affinity.push(vm.name)
        }
        if(host.after_numa_node1_cpus_unpinned_num >= vm.vCpus){
          host.after_numa_node1_cpus_unpinned_num -= vm.vCpus
        }else if(host.after_numa_node2_cpus_unpinned_num >= vm.vCpus){
          host.after_numa_node2_cpus_unpinned_num -= vm.vCpus
        }else{
          console.error("resource is not enough,vm:{},host:{}",vm,host)
        }

        if(host.after_numa_node1_mem1 >= vm.vRams){
          host.after_numa_node1_mem1 -= vm.vRams
          host.numa_node1_VM_Ids.push(vm.vm_id)
        }else if(host.after_numa_node1_mem1 >= vm.vRams){
          host.after_numa_node1_mem1 -= vm.vRams
          host.numa_node2_VM_Ids.push(vm.vm_id)
        }else{
          console.error("resource is not enough,vm:{},host:{}",vm,host)
        }
        if(!this.isExistHost(host,selectedHost)){
            selectedHost.push(host)
        }
      },
      isExistHost: function(host,selectedHost) {
        if (selectedHost.length == 0){
          return false
        }
        for(let i=0,len=selectedHost.length;i<len;i++){
          if (host.hostname == selectedHost[i].hostname ){
            return true
          }
        }
        return false
      }
    }
  }
</script>