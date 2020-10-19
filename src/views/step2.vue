<template>
  <div class="step2">
    <Input v-model="vnfvm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VNF-VM接口返回的结果" />
    <Input v-model="vimcm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VIM_CM接口返回的结果" />
    <Input v-model="vmpm" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入VM_PM接口返回的结果" />
    <Input v-model="queryVNFResource" type="textarea" :rows="4" :style="{width:width+'%'}" placeholder="请输入QueryVNFResource接口的返回结果" />
    <Button type="primary" @click="parse">解析</Button>
    <IntegrationTable :showVnf=true :selectedVNFs="allVnfs" :columns="columns" :tableData="tableData"/>
  </div>
</template>

<script>
  import IntegrationTable from "../components/IntegrationTable"
  export default {
    components: {IntegrationTable},
    data() {
      return {
        width: 25,
        vnfvm: '',
        vimcm: '',
        vmpm: '',
        queryVNFResource: '',
        allVnfs: [],
        tableData: this.$store.getters.getAllVms,
        columns: [
          {
            type: 'index',
            width: 100,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '虚拟机ID',
            key: 'vm_id',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: '虚拟机名称',
            key: 'name',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: '所属主机名',
            key: 'cHost',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: '主机所属HA',
            key: 'cHAs',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'CPU数',
            key: 'vCpus',
            align: 'center',
            width: 100,
          },
          {
            title: '内存(M)',
            key: 'vRams',
            align: 'center',
            width: 100,
          },
          // {
          //   title: '内存利用率',
          //   key: 'vramutil',
          //   align: 'center',
          //   width: 100,
          // },
          {
            title: 'CPU利用率',
            key: 'vcpuutil',
            align: 'center',
            width: 100,
          },
          {
            title: '亲和组',
            align: 'center',
            children: [
              {
                title: '类型',
                key: 'type',
                align: 'center',
                width: 100,
                sortable: true
              },
              {
                title: '名称',
                key: 'affinity_name',
                align: 'center',
                width: 200,
                sortable: true
              }
            ]
          },
          // {
          //   title: 'numa_nodes',
          //   key: 'numa_nodes',
          //   align: 'center',
          //   width: 200,
          // },
          {
            title: '出口带宽',
            key: 'egress_max_kbps',
            align: 'center',
            width: 150,
          },
          {
            title: '入口带宽',
            key: 'ingress_max_kbps',
            align: 'center',
            width: 150,
          },
          {
            title: '运行状态',
            key: 'pwrStatus',
            align: 'center',
            width: 150,
          },
          {
            title: '所属VNF',
            key: 'vnf_name',
            align: 'center',
            width: 150,
            fixed: 'right'
          },
          {
            title: '所属VNF类型',
            key: 'vnf_type',
            align: 'center',
            width: 120,
            fixed: 'right'
          },
          {
            title: '所属VDU',
            key: 'vdu_id',
            align: 'center',
            width: 150,
            fixed: 'right'
          }
        ],
      }
    },
    methods: {
      parse() {
        let _tableData = this.parseVimCM()
        this.parseVnfVM(_tableData)
        this.parseVMPM(_tableData)
        this.parseQueryVNFResource(_tableData)
        this.parseHA(_tableData)
        this.parseVNFs(_tableData)
        this.tableData = _tableData.sort(this.sortBy)
        this.$store.commit('setAllVms', _tableData.sort(this.sortBy));
        console.log("allVms:{}" , _tableData.sort(this.sortBy))
      },
      parseVnfVM(tableData) {
        //解析VNFVM
        if (this.vnfvm == ''){
          return
        }
        let vnfs = JSON.parse(this.vnfvm);
        let vmAndVnf = {}
        for (let i=0,len=vnfs.length; i<len; i++){
          let vnf = vnfs[i]
          let vms = vnf.vmIdList;
          for (let j=0,len=vms.length; j<len; j++){
            let _vm = vms[j]
            vmAndVnf[_vm.vMID] = vnf
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
            _vm.name = vm.name
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
          _vm.vcpuutil = vmInfo[_vm.vm_id]?vmInfo[_vm.vm_id].vcpuutil:''
        }
      },
      parseQueryVNFResource(tableData) {
        if (this.queryVNFResource == ''){
          return
        }
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
            if(vm.name.indexOf(vduId) != -1){
              vm.vdu_id = vduIdVms[vduId].vdu_id
              vm.type = vduIdVms[vduId].VMGroup.type
              vm.affinity_name = vduIdVms[vduId].VMGroup.name
              // let direction = vduIdVms[vduId]?vduIdVms[vduId].vnics[0].qos?vduIdVms[vduId].vnics[0].qos[0].direction:'':''
              // if (direction != '' && direction == 'egress'){
              //   vm.egress_max_kbps = vduIdVms[vduId]?vduIdVms[vduId].vnics[0].qos[0].max_kbps:''
              // }else if (direction != '' && direction == 'ingress'){
              //   vm.ingress_max_kbps = vduIdVms[vduId]?vduIdVms[vduId].vnics[0].qos[0].max_kbps:''
              // }
            }
          }
        }
      },
      parseHA(tableData) {
        let hosts = this.$store.getters.getAllHosts
        let hostNameAndHost = {}
        for(let i=0,len=hosts.length;i<len;i++){
          let host = hosts[i]
          hostNameAndHost[host.name] = host
        }
        for (let i=0,len=tableData.length;i<len;i++){
          let vm = tableData[i]
          vm.cHAs = hostNameAndHost[vm.cHost]?hostNameAndHost[vm.cHost].cHAs:""
        }
      },
      parseVNFs(tableData) {
        for (let i=0,len=tableData.length; i<len; i++){
          let vm = tableData[i]
          if(vm.vnf_name != ""){
            let vnfSelect = {}
            vnfSelect.label = vm.vnf_name
            vnfSelect.value = vm.vnf_name
            if(this.allVnfs.length==0 || JSON.stringify(this.allVnfs).indexOf(JSON.stringify(vnfSelect)) == -1){
              this.allVnfs.push(vnfSelect)
            }
          }
        }
        this.$store.commit('setAllVNFs', this.allVnfs);
        console.log("allVNFs:{}",this.allVnfs)
      },
      sortBy: function (a, b) {//比较函数
        return a.name==undefined?1:b.name==undefined?-1:a.name>b.name?1:-1
      }
    }
  }
</script>