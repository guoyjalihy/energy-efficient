<template>
  <div class="step3">
    <Input v-model="vimcm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VIM_CM接口返回的结果" />
    <Input v-model="hostpm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入HOST_PM接口返回的结果" />
    <Button type="primary" @click="parse">解析</Button>
    <span style="float:right;font-size: 18px">总功耗：{{allPower}} KW</span>
    <Divider />
    <HostVMTable :data="tableData"/>
  </div>
</template>
<script>
  import HostVMTable from "../components/HostVMTable";
  import {predictPower} from "../js/predictPower.js";

  export default {
    components: {HostVMTable},
    data() {
      return {
        width: 50,
        vimcm: '',
        hostpm: '',
        allPower: this.$store.getters.getAllPowerBefore,
        tableData: this.$store.getters.getHostVM.slice(0,50)
      }
    },
    methods: {
      parse() {
        let hosts = this.parseVIMCM()
        this.parseHostPM(hosts)
        predictPower(hosts).then(hosts => {
          this.tableData = hosts.sort(this.sortBy).slice(0, 50)
          console.log("hostVms:{}", hosts)
          for (let i = 0, len = hosts.length; i < len; i++) {
            let host = hosts[i]
            this.allPower += host.power
          }
          this.$store.commit('setHostVM', hosts.sort(this.sortBy));
          this.$store.commit('setAllPowerBefore', this.allPower);
        })
      },
      parseVIMCM() {
        let vimCMJson = JSON.parse(this.vimcm)
        let hostVMIds = {}
        for(let i=0,len=vimCMJson.length;i<len;i++) {
          let vms = vimCMJson[i].vms.vm
          for (let j = 0, len = vms.length; j < len; j++) {
            let vm = vms[j]
            hostVMIds[vm.cHost] = []
          }
          for(let j=0,len=vms.length;j<len;j++){
            let vm = vms[j]
            hostVMIds[vm.cHost].push(vm.vmId)
          }

          // let hosts = vimCMJson[i].hosts.host
          // for(let j=0,len=hosts.length;j<len;j++){
          //   let host = hosts[j]
          //   hostNameHost[host.hostname] = host
          // }
        }
        let allVms = this.$store.getters.getAllVms
        let vmIdAndVM = {}
        for(let i=0,len=allVms.length;i<len;i++){
          let vm = allVms[i]
          vmIdAndVM[vm.vm_id] = vm
        }
        let hostsResult = []
        for (let hostName in hostVMIds){
          let host = {}
          host.hostName = hostName
          host.vmIdList = hostVMIds[hostName]
          host.mem_used = 0
          host.cpu_used = 0
          for(let i=0,len=host.vmIdList.length;i<len;i++){
            let vmId = host.vmIdList[i]
            host.mem_used += vmIdAndVM[vmId].vRams
            host.cpu_used += vmIdAndVM[vmId].vCpus
          }
          let cpuAllocNum = 0
          for(let i=0,len=vimCMJson.length;i<len;i++) {
            let vms = vimCMJson[i].vms.vm
            for (let j = 0, len = vms.length; j < len; j++) {
              let vm = vms[j]
              if (vm.cHost == hostName){
                cpuAllocNum += vm.vCpus
              }
            }
          }
          host.cpuAllocNum = cpuAllocNum
          hostsResult.push(host)
        }
        return hostsResult
      },
      parseHostPM(hosts) {
        let hostPms = JSON.parse(this.hostpm)
        let hostNamePM = {}
        for(let i=0,len=hostPms.length; i<len; i++){
          hostNamePM[hostPms[i].hostname] = hostPms[i]
        }
        let vimCMJson = JSON.parse(this.vimcm)
        let hostNameHost = {}
        for(let i=0,len=vimCMJson.length;i<len;i++) {
          let _hosts = vimCMJson[i].hosts.host
          for(let j=0,len=_hosts.length;j<len;j++){
            let _host = _hosts[j]
            hostNameHost[_host.hostname] = _host
          }
        }
        for (let i=0,len=hosts.length; i<len; i++){
          let host = hosts[i]
          host.cpuutil = hostNamePM[host.hostName]?hostNamePM[host.hostName].cpuutil:''
          host.ramutil = hostNamePM[host.hostName]?hostNamePM[host.hostName].ramutil:''
          host.ramtotal = hostNamePM[host.hostName]?hostNamePM[host.hostName].ramtotal:''
          //CPU碎片率=未分配vCPU数/可分配CPU数
          //CPU碎片率=(CpuTotal-(vCPU+(CpuTotal-vCpuTotal)))/vCpuTotal=(vCpuTotal-vCPU)/vCpuTotal

          //未分配vCPU数=总vCPU数-已分配vCPU数
          host.cputotal = hostNamePM[host.hostName]?hostNamePM[host.hostName].cputotal:0//总vCPU数
            //已分配vCPU数=分配给vm的vCPU数+系统占用vCPU数
          let cpuAllocNum = host.cpuAllocNum + (host.cputotal - hostNameHost[host.hostName].vCpuTotal)
          let unAllocvCpuNum = host.cputotal - cpuAllocNum

          // 可分配vCPU数=总vCPU数-系统占用vCPU数=CpuTotal-(CpuTotal-vCpuTotal)=vCpuTotal，即文件VIM_CM中的字段hosts/host/vCpuTotal
          let availableCpuNum = host.cputotal - ((host.cputotal - hostNameHost[host.hostName].vCpuTotal))
          host.cpu_unalloc_ratio = unAllocvCpuNum / availableCpuNum * 100
        }
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