<template>
  <div class="step3">
<!--    <Input v-model="vimcm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VIM_CM接口返回的结果" />-->
<!--    <Input v-model="hostpm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入HOST_PM接口返回的结果" />-->
<!--    <Button type="primary" @click="parse">解析</Button>-->
    <span style="float:right;font-size: 18px">总功耗：{{allPower}} KW</span>
    <Divider />
    <HostVMTable :data="tableData"/>
  </div>
</template>
<script>
  import HostVMTable from "../components/HostVMTable";
  // import {predictPower} from "../js/predictPower.js";

  export default {
    components: {HostVMTable},
    data() {
      return {
        // width: 50,
        // vimcm: '',
        // hostpm: '',
        allPower: this.$store.getters.getAllPowerBefore,
        tableData: this.$store.getters.getHostVM.slice(0,50)
      }
    },
    created() {
      this.parse()
    },
    methods: {
      parse() {
        let hosts = this.$store.getters.getAllHostInfo
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
        }
        this.tableData = hosts.slice(0,50)
        this.$store.commit('setAllHostInfo', hosts);
      },

      sortBy: function (obj1, obj2) {//比较函数
        if (obj1.cpuutil > obj2.cpuutil) {
          if (obj1.ramutil > obj2.ramutil){
            return -1
          } else if (obj1.ramutil < obj2.ramutil) {
            return 1;
          }else{
            return 0
          }
        }else if (obj1.cpuutil < obj2.cpuutil){
          return 1;
        }else{
          return 0;
        }
      },

    }
  }
</script>