<template>
  <div class="step5">
    <span style="float:right;font-size: 18px">
      迁移前碎片率： {{beforeCpuUnallocRatio}}
      迁移后碎片率： {{afterCpuUnallocRatio}}
      迁移后CPU碎片率为0主机数：{{afterCpuUnallocRatio0Num}}台
      迁移前分配率： {{beforeAllocRatio}}
      迁移后分配率： {{afterAllocRatio}}
      迁移前CPU平均利用率： {{beforeCpuUtil}}
      迁移后CPU平均利用率： {{afterCpuUtil}}
      资源池主机总数：{{allHostNum}}台
      参与迁移主机总数：{{moveHostNum}}台
      迁移后可下电主机数：{{allowedPowerOffHostNum}}台
      未参与迁移可下电主机数：{{otherAllowedPowerOffHostNum}}台
      参与迁移虚拟机总数： {{moveVmsNum}}台
    </span>
    <Divider />
    <MoveResultTable :data="tableData"/>
  </div>
</template>
<script>
  import MoveResultTable from "../components/MoveResultTable";
  export default {
    components: {MoveResultTable},
    data () {
      return {
        beforeCpuUnallocRatio: '',
        afterCpuUnallocRatio: '',
        afterCpuUnallocRatio0Num: 0,
        beforeAllocRatio: '',
        afterAllocRatio: '',
        beforeCpuUtil: '',
        afterCpuUtil: '',
        moveVmsNum: 0,
        allHostNum: this.$store.getters.getAllHostInfo.length,
        moveHostNum: this.$store.getters.getTodoHostVms.length,
        allowedPowerOffHostNum: this.$store.getters.getAllowedPowerOffHostNum,
        otherAllowedPowerOffHostNum: this.$store.getters.getOtherAllowedPowerOffHostNum,
        tableData : this.$store.getters.getMoveResult
      }
    },
    created() {
      // let moveResult = this.$store.getters.getMoveResult
      // if(moveResult.length > 0){
      //   return
      // }
      let todoVms = this.$store.getters.getTodoVms
      let hostNameAndVMs = {}
      for(let j=0,len=todoVms.length;j<len;j++){
        let vm = todoVms[j]
        if (hostNameAndVMs[vm.cHost] == undefined){
          hostNameAndVMs[vm.cHost] = []
        }
        hostNameAndVMs[vm.cHost].push(vm)
      }
      let vmIdAndVm = {}
      for(let j=0,len=todoVms.length;j<len;j++){
        let vm = todoVms[j]
        vmIdAndVm[vm.vm_id] = vm
      }
      let todoHosts = this.$store.getters.getTodoHostVms
      let haAndHosts = this.buildHaAndHosts(todoHosts,vmIdAndVm)

      for(let ha in haAndHosts){
        let hosts = haAndHosts[ha]
        hosts.sort(this.sortByCpuUnAllocRatio)
        this.doMove(hosts,hostNameAndVMs)
      }
      this.predictCPUUtil(todoHosts,vmIdAndVm)

      this.tableData = todoHosts

      this.computeIndicator(todoHosts)
      this.$store.commit('setAllowedPowerOffHostNum',this.allowedPowerOffHostNum.length);
      this.$store.commit('setMoveResult', todoHosts);
    },
    methods: {
      predictCPUUtil(todoHosts,vmIdAndVm) {
        for(let i=0,len=todoHosts.length;i<len;i++) {
          // let allVmsId = []
          let host = todoHosts[i]
          // let vmIdList = host.vmIdList
          let moveInIdList = host.move_in_vmIdList
          let moveOutIdList = host.move_out_vmIdList
          // if(vmIdList != undefined && vmIdList.length >0){
          //   allVmsId.push.apply(allVmsId,vmIdList)
          // }
          // if(moveInIdList != undefined && moveInIdList.length >0){
          //   allVmsId.push.apply(allVmsId,moveInIdList)
          // }
          // if(moveOutIdList != undefined && moveOutIdList.length >0){
          //   for(let i=0,len=allVmsId.length;i<len;i++){
          //     for(let j=0,len=moveOutIdList.length;j<len;j++){
          //
          //       if (allVmsId[i] == moveOutIdList[j]){
          //         allVmsId.splice(i,1)
          //       }
          //     }
          //   }
          // }
          // let after_cpuutil = 0
          // if (allVmsId.length == 0) {
          //   host.after_cpuutil = after_cpuutil
          //   continue
          // }
          // for(let i=0,len=allVmsId.length;i<len;i++){
          //   let vmId = allVmsId[i]
          //   let vm = vmIdAndVm[vmId]
          //   if(vm == undefined) {
          //     continue
          //   }
          //   after_cpuutil += Math.round((((vm.vCpus * vm.vcpuutil) / parseInt(host.total_cpu))* 100)) /100
          // }
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
      computeIndicator(todoHosts) {
        let totalCPUs = 0
        let totalFreeCpus = 0
        let afterTotalFreeCpus = 0
        let afterTotalCPUs = 0
        let sumBeforeCpuUtil = 0
        let sumBeforeHostNum = 0
        let sumAfterCpuUtil = 0
        let sumAfterHostNum = 0
        for(let i=0,len=todoHosts.length;i<len;i++){
          let host = todoHosts[i]
          if(host.after_total_free_cpu == host.total_cpu){
            this.allowedPowerOffHostNum ++
          }else {
            afterTotalCPUs += parseInt(host.total_cpu)
            if (host.after_total_free_cpu != undefined){
              afterTotalFreeCpus += host.after_total_free_cpu
            }
            sumAfterCpuUtil += Math.round(host.after_cpuutil * 100) /100
            sumAfterHostNum ++
          }

          totalCPUs += parseInt(host.total_cpu)
          totalFreeCpus += host.total_free_cpu
          sumBeforeCpuUtil += Math.round(host.cpuutil * 100) /100
          sumBeforeHostNum ++
          if(host.move_out_vmIdList != undefined){
            this.moveVmsNum += host.move_out_vmIdList.length
          }

          if(host.after_total_free_cpu == 0){
            this.afterCpuUnallocRatio0Num ++
          }
        }
        this.beforeCpuUtil = Math.round((sumBeforeCpuUtil / sumBeforeHostNum ) * 100) /100
        this.afterCpuUtil = Math.round((sumAfterCpuUtil / sumAfterHostNum ) * 100) /100
        this.beforeCpuUnallocRatio = (totalFreeCpus / totalCPUs).toFixed(2)
        this.afterCpuUnallocRatio = (afterTotalFreeCpus / afterTotalCPUs).toFixed(2)
      },
      buildHaAndHosts(todoHosts,vmIdAndVm) {
        let haAndHosts = {}
        for(let i=0,len=todoHosts.length;i<len;i++){
          let host = todoHosts[i]
          host.anti_affinity = []
          host.affinity = []
          let vmIds = host.vmIdList
          if(vmIds == undefined){
            continue
          }
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