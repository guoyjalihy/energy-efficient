<template>
  <div class="step3">
    <HostVMTable :data="tableData"/>
  </div>
</template>
<script>
  import HostVMTable from "../components/HostVMTable";

  export default {
    components: {HostVMTable},
    data() {
      return {
        tableData: this.$store.getters.getAllHosts.slice(0,50)
      }
    },
    created() {
      this.parse()
    },
    methods: {
      parse() {
        let hosts = this.$store.getters.getAllHosts
        let vms = this.$store.getters.getAllVms
        let hostNameAndVmIds = {}
        for (let i=0,len=vms.length;i<len;i++){
          let vm = vms[i]
          if(hostNameAndVmIds[vm.cHost] == undefined){
            let vmIds =  []
            vmIds.push(vm.vm_id)
            hostNameAndVmIds[vm.cHost] = vmIds
          }else{
            hostNameAndVmIds[vm.cHost].push(vm.vm_id)
          }
        }
        for(let j=0,len=hosts.length;j<len;j++){
            let host = hosts[j]
            host.vmIdList = hostNameAndVmIds[host.hostname]
            if(hostNameAndVmIds[host.hostname] == undefined){
                host.vmIdList = []
            }
        }
        this.tableData = hosts.slice(0,50)
        this.$store.commit('setAllHosts', hosts);
      },
    }
  }
</script>