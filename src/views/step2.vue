<template>
  <div class="step2">
    <Input v-model="vnfvm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VNF-VM接口返回的结果" />
    <Input v-model="vimcm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VIM_CM接口返回的结果" />
    <Input v-model="vmpm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VM_PM接口返回的结果" />
    <Input v-model="queryVNFResource" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入QueryVNFResource接口的返回结果" />
    <Button type="primary" @click="parse">解析</Button>
    <Divider />
    <AllVms :data="tableData"/>
  </div>
</template>

<script>
  import AllVms from "../components/AllVms";
  export default {
    components: {AllVms},
    data() {
      return {
        width: 25,
        vnfvm: '',
        vimcm: '',
        vmpm: '',
        queryVNFResource: '',
        tableData: this.$store.getters.getAllVms.slice(0,50)
      }
    },
    methods: {
      parse() {
        let _tableData = this.parseVimCM()
        this.parseVnfVM(_tableData)
        this.parseVMPM(_tableData)
        this.parseQueryVNFResource(_tableData)
        this.tableData = _tableData.sort(this.sortBy).slice(0,50)
        this.$store.commit('setAllVms', _tableData.sort(this.sortBy));
        console.log("allVms:{}" , _tableData.sort(this.sortBy))
      },
      parseVnfVM(tableData) {
        //解析VNFVM
        let vnfsJson = JSON.parse(this.vnfvm);
        let vnfs = vnfsJson.vnfs
        let vmAndVnf = {}
        for (let i=0,len=vnfs.length; i<len; i++){
          let vnf = vnfs[i]
          let vms = vnf.vmIdList;
          for (let j=0,len=vms.length; j<len; j++){
            let _vm = vms[j]
            vmAndVnf[_vm.VMID] = vnf
          }
        }
        for (let i=0,len=tableData.length;i<len;i++){
          let vm = tableData[i]
          vm.vnf_name = vmAndVnf[vm.vm_id]?vmAndVnf[vm.vm_id].vnfName:''
          vm.vnf_type = vmAndVnf[vm.vm_id]?vmAndVnf[vm.vm_id].vnfType:''
        }

      },
      parseVimCM() {
        let vimsJSON = JSON.parse(this.vimcm)
        let _tableData = []
        for(let i=0,len=vimsJSON.length;i<len;i++){
          let vms = vimsJSON[i].vms.vm
          for(let j=0,len=vms.length;j<len;j++) {
            let vm = vms[j]
            let _vm = {}
            _vm.vm_id = vm.vmId
            _vm.vm_name = vm.name
            _vm.pwrStatus = vm.pwrStatus
            _vm.cHost = vm.cHost
            _vm.vCpus = vm.vCpus
            _vm.vRams = vm.vRams
            _tableData.push(_vm)
          }
        }
        return _tableData
      },

      parseVMPM(tableData) {
        let vms = JSON.parse(this.vmpm)
        let vmInfo = {}
        for(let i=0,len=vms.length;i<len;i++){
          let vm = vms[i]
          vmInfo[vm.vmid] = vm
        }
        for (let i=0,len=tableData.length;i<len;i++){
          let _vm = tableData[i]
          _vm.vramutil = vmInfo[_vm.vm_id]?vmInfo[_vm.vm_id].vramutil:''
          _vm.vcpuutil = vmInfo[_vm.vm_id]?vmInfo[_vm.vm_id].vcpuutil:''
        }
      },
      parseQueryVNFResource(tableData) {
        let queryVNFResource = JSON.parse(this.queryVNFResource)
        let vdus = queryVNFResource.VMList
        let vduIdVms = {}
        for(let i=0,len=vdus.length;i<len;i++){
          let vdu = vdus[i]
          if (vdu.vdu_id != ""){
            vduIdVms[vdu.vdu_id] = vdu
          }
        }
        for (let i=0,len=tableData.length;i<len;i++){
          let vm = tableData[i]
          for(let vduId in vduIdVms){
            let vduIdAndName = vduId.split('-VDU-');
            let vdu_id = vduIdAndName[0]
            let vdu_name = vduIdAndName[1]
            if(vm.vm_name.indexOf(vdu_id) != -1 && vm.vm_name.indexOf(vdu_name) != -1){
              vm.vdu_id = vduIdVms[vduId].vdu_id
              vm.type = vduIdVms[vduId].vmgroup.type
              vm.name = vduIdVms[vduId].vmgroup.name
              let direction = vduIdVms[vduId]?vduIdVms[vduId].vnics[0].qos?vduIdVms[vduId].vnics[0].qos[0].direction:'':''
              if (direction != '' && direction == 'egress'){
                vm.egress_max_kbps = vduIdVms[vduId]?vduIdVms[vduId].vnics[0].qos[0].max_kbps:''
              }else if (direction != '' && direction == 'ingress'){
                vm.ingress_max_kbps = vduIdVms[vduId]?vduIdVms[vduId].vnics[0].qos[0].max_kbps:''
              }
            }
          }
        }
      },
      sortBy: function (a, b) {//比较函数
        return a.name==undefined?1:b.name==undefined?-1:a.name>b.name?1:-1
      }
    }
  }
</script>