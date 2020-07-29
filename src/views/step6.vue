<template>
  <div class="step6">
    <HostVMTable :data="tableData"/>
    <span style="font-size: 18px">迁移前总功耗：{{allPowerBefore}} KW</span>
    <span style="float:right;font-size: 18px">迁移后总功耗：{{allPower}} KW</span>
  </div>
</template>
<script>
  import HostVMTable from "../components/HostVMTable";
  import {predictPower} from "../js/predictPower.js";

  export default {
    components: {HostVMTable},
    data () {
      return {
        allPowerBefore: this.$store.getters.getAllPowerBefore,
        allPower: this.$store.getters.getAllPowerAfter,
        tableData : []
      }
    },
    created() {
      //获取待迁移主机列表，等价于可下电主机列表（注意保留5%的额外资源，计算原则为服务器总数的5%）
      let todoHosts = this.$store.getters.getTodoHostVms
      this.tableData = todoHosts
      let hostNameAndTodoHost = {}
      for (let i=0,len=todoHosts.length;i<len;i++){
        let todoHost = todoHosts[i]
        hostNameAndTodoHost[todoHost.hostName] = todoHost
      }
      //获取迁移目标所有主机信息
      let moveResult = this.$store.getters.getMoveResult
      let hostNameAndMoveResult = {}
      for(let i=0,len=moveResult.length;i<len;i++){
        let moveHost = moveResult[i]
        hostNameAndMoveResult[moveHost.hostname] = moveHost
      }
      //获取所有主机列表
      let hostVM = this.$store.getters.getHostVM
      //整合为新主机列表并计算总功耗
      let resultHost = []
      for(let i=0,len=hostVM.length;i<len;i++){
        let host = hostVM[i]
        if(hostNameAndTodoHost[host.hostName] != undefined){
          continue
        }
        if(hostNameAndMoveResult[host.hostName] != undefined){
          let moveHost = hostNameAndMoveResult[host.hostName]
          let _host = {}
          _host.hostName = moveHost.hostname
          _host.vmIdList = moveHost.numa_node1_VM_Ids
          _host.vmIdList.push(moveHost.numa_node2_VM_Ids)
          _host.cputotal = moveHost.after_numa_node1_cpus_unpinned_num + moveHost.numa_node2_cpus_unpinned_num
          _host.cpu_used = moveHost.numa_node1_cpus_unpinned_num + moveHost.numa_node2_cpus_unpinned_num - _host.cputotal
          _host.ramtotal = moveHost.after_numa_node1_mem1 + moveHost.after_numa_node2_mem1
          _host.mem_used = moveHost.after_numa_node1_mem1 + moveHost.after_numa_node2_mem1 - _host.ramtotal
          _host.power = 0
          resultHost.push(_host)
          continue
        }
        resultHost.push(host)
      }
      predictPower(resultHost).then(hosts => {
        console.log("afterMoveHosts:{}", hosts)
        for (let i = 0, len = hosts.length; i < len; i++) {
          let host = hosts[i]
          this.allPower += host.power
        }
        this.$store.commit('setAllPowerAfter', this.allPower);
      })
    },
    methods: {

    }
  }
</script>