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
        tableData : this.$store.getters.getMoveResult
      }
    },
    created() {
      let allVms = this.$store.getters.getAllVms
      let hostNameAndVMs = {}
      let vmIdAndVm = {}
      for(let j=0,len=allVms.length;j<len;j++){
        let vm = allVms[j]
        if (hostNameAndVMs[vm.cHost] == undefined){
          hostNameAndVMs[vm.cHost] = []
        }
        hostNameAndVMs[vm.cHost].push(vm)
        vmIdAndVm[vm.vm_id] = vm
      }

      let toMoveHosts = this.$store.getters.getToMoveHosts
      let haAndHosts = this.buildHaAndHosts(toMoveHosts,vmIdAndVm)

      for(let ha in haAndHosts){
        let hosts = haAndHosts[ha]
        hosts.sort(this.sortByCpuUnAllocRatio)
        this.doMove(hosts,hostNameAndVMs)
      }
      this.predictCPUUtil(toMoveHosts,vmIdAndVm)

      this.tableData = toMoveHosts

      this.$store.commit('setMoveResult', toMoveHosts);
    },
    methods: {
      predictCPUUtil(todoHosts,vmIdAndVm) {
        for(let i=0,len=todoHosts.length;i<len;i++) {
          let host = todoHosts[i]
          let moveInIdList = host.move_in_vmIdList
          let moveOutIdList = host.move_out_vmIdList
          let after_cpuutil = host.cpuutil
          if(moveInIdList != undefined && moveInIdList.length > 0){
            for(let i=0,len=moveInIdList.length;i<len;i++){
              let vmId = moveInIdList[i]
              let vm = vmIdAndVm[vmId]
              after_cpuutil += Math.round((((vm.vCpus * vm.vcpuutil) / parseInt(host.total_cpu))* 100)) /100
            }
          }
          if(moveOutIdList != undefined && moveOutIdList.length > 0){
            for(let i=0,len=moveOutIdList.length;i<len;i++){
              let vmId = moveOutIdList[i]
              let vm = vmIdAndVm[vmId]
              after_cpuutil -= Math.round((((vm.vCpus * vm.vcpuutil) / parseInt(host.total_cpu))* 100)) /100
            }
          }
          host.after_cpuutil = Math.round(after_cpuutil * 100) /100
        }
      },
      buildHaAndHosts(todoHosts,vmIdAndVm) {
        let haAndHosts = {}
        for(let i=0,len=todoHosts.length;i<len;i++){
          let host = todoHosts[i]
          host.anti_affinity = []
          host.affinity = []
          let vmIds = host.vmIdList
          for(let j=0,len=vmIds.length;j<len;j++){
            let vm = vmIdAndVm[vmIds[j]]
            if(vm.type != undefined && vm.type == 'anti-affinity'){
              host.anti_affinity.push(vm.name)
            }else if(vm.type != undefined && vm.type == 'affinity'){
              host.affinity.push(vm.name)
            }
          }
          host.move_in_vmIdList = []
          host.move_out_vmIdList = []
          host.after_total_free_cpu = host.total_free_cpu
          host.after_total_free_mem = host.total_free_mem
          host.after_numa_node1_free_cpus = host.numa_node1_free_cpus
          host.after_numa_node1_free_mem = host.numa_node1_free_mem
          host.numa_node1_VM_Ids = []
          host.after_numa_node2_free_cpus = host.numa_node2_free_cpus
          host.after_numa_node2_free_mem = host.numa_node2_free_mem
          host.numa_node2_VM_Ids = []
          host.after_total_bandwidths_ingress = host.total_bandwidths_ingress
          host.after_total_bandwidths_egress = host.total_bandwidths_egress
          if (haAndHosts[host.cHAs] == undefined){
            haAndHosts[host.cHAs] = []
          }
          haAndHosts[host.cHAs].push(host)
        }
        return haAndHosts
      },
      doMove(hosts,hostNameAndVMs) {
        if (hosts == undefined){
          return
        }
        if(hosts.length < 3){
          return
        }
        for(let i=0,len=hosts.length;i<len;i++){
          let sourceHost = hosts[i]
          if(sourceHost.after_total_free_cpu == sourceHost.total_cpu || sourceHost.after_total_free_cpu == 0){
            continue
          }
          let vms = hostNameAndVMs[sourceHost.hostname]
          if (vms == undefined){
            continue
          }
          for(let j=0,len=vms.length;j<len;j++){
            let vm = vms[j]
            for (let k=hosts.length-1;k>0;k--){
              let targetHost = hosts[k]
              if(targetHost.after_total_free_cpu == targetHost.total_cpu || targetHost.after_total_free_cpu == 0){
                continue
              }
              if(sourceHost.hostname == targetHost.hostname){
                continue
              }
              if(sourceHost.move_in_vmIdList.length > 0){
                continue
              }
              if(this.allowedDeployVmToHost(vm,targetHost)){
                this.computeAndRecordResource(vm,sourceHost,targetHost)
                break;
              }
            }
          }
        }
      },
      allowedDeployVmToHost: function(vm,host){
        if (host.after_numa_node1_free_cpus < vm.vCpus && host.after_numa_node2_free_cpus < vm.vCpus){
          return false
        }
        if (host.after_numa_node1_free_mem < vm.vRams && host.after_numa_node2_free_mem < vm.vRams){
          return false
        }
        if (host.after_numa_node1_free_cpus < vm.vCpus && host.after_numa_node1_free_mem < vm.vRams
          && host.after_numa_node2_free_cpus < vm.vCpus && host.after_numa_node2_free_mem < vm.vRams){
          return false
        }
        // if (vm.ingress_max_kbps != undefined && host.after_total_bandwidths_ingress < vm.ingress_max_kbps){
        //   return false
        // }
        // if (vm.egress_max_kbps != undefined && host.after_total_bandwidths_egress < vm.egress_max_kbps){
        //   return false
        // }
        if (vm.type != undefined && vm.type == 'anti_affinity' && vm.name != undefined && host.anti_affinity.index(vm.name) > -1){
          return false
        }
        return true
      },
      computeAndRecordResource: function(vm,sourceHost,targetHost){
        if (vm.type == 'anti-affinity'){
          targetHost.anti_affinity.push(vm.name)
        }else if(vm.type == 'affinity'){
          targetHost.affinity.push(vm.name)
        }

        if(targetHost.after_numa_node1_free_cpus >= vm.vCpus && targetHost.after_numa_node1_free_mem >= vm.vRams){
          targetHost.after_numa_node1_free_cpus -= vm.vCpus
          targetHost.after_numa_node1_free_mem -= vm.vRams
          // targetHost.after_total_bandwidths_ingress -= vm.ingress_max_kbps
          // targetHost.after_total_bandwidths_egress -= vm.egress_max_kbps
          targetHost.numa_node1_VM_Ids.push(vm.vm_id)
        }else if(targetHost.after_numa_node2_free_cpus >= vm.vCpus && targetHost.after_numa_node2_free_mem >= vm.vRams){
          targetHost.after_numa_node2_free_cpus -= vm.vCpus
          targetHost.after_numa_node2_free_mem -= vm.vRams
          // targetHost.after_total_bandwidths_ingress -= vm.ingress_max_kbps
          // targetHost.after_total_bandwidths_egress -= vm.egress_max_kbps
          targetHost.numa_node2_VM_Ids.push(vm.vm_id)
        }else{
          console.error("CPU OR MEM is not enough,vm:{},targetHost:{}",vm,targetHost)
          return
        }

        targetHost.move_in_vmIdList.push(vm.vm_id)
        targetHost.after_total_free_cpu -= vm.vCpus
        targetHost.after_cpu_unalloc_ratio = targetHost.after_total_free_cpu / targetHost.total_cpu
        targetHost.after_total_free_mem -= vm.vRams

        sourceHost.move_out_vmIdList.push(vm.vm_id)
        sourceHost.after_total_free_cpu += vm.vCpus
        sourceHost.after_total_free_mem += vm.vRams
        sourceHost.after_cpu_unalloc_ratio = sourceHost.after_total_free_cpu / sourceHost.total_cpu
        // sourceHost.after_total_bandwidths_ingress += vm.ingress_max_kbps
        // sourceHost.after_total_bandwidths_egress += vm.egress_max_kbps
      },

      sortByCpuUnAllocRatio: function (obj1, obj2) {//比较函数
        if (obj1.cpu_unalloc_ratio > obj2.cpu_unalloc_ratio) {
          return -1
        }else if (obj1.cpu_unalloc_ratio < obj2.cpu_unalloc_ratio){
          return 1;
        }else{
          return 0;
        }
      },
    }
  }
</script>