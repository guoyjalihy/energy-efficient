<template>
  <div class="step5">
    <Tabs active-key="key1">
      <Tab-pane label="主机列表" key="key1">
        <IntegrationTable :height="500" :columns="hostColumns" :tableData="hostTableData"/>
      </Tab-pane>
      <Tab-pane label="虚拟机列表" key="key2">
        <IntegrationTable :showVnf=true :height="500" :columns="vmColumns" :tableData="vmTableData"/>
      </Tab-pane>
      <Tab-pane label="拓扑图" key="key3">
        <Tag color="#808080">迁出虚拟机</Tag>
        <Tag color="#ff0000">迁入虚拟机</Tag>
        <Tag color="#0000ff">不动虚拟机</Tag>
        <Tag color="#82b2d2">HA</Tag>
        <Tag color="#0a0a64">HOST</Tag>
          <Select v-model="vnf" style="width:300px" @on-change="changeVnf">
              <Option v-for="item in vnfs" :value="item.value">{{ item.label }}</Option>
          </Select>
        <canvas id="canvas" style="background-color: black"></canvas>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<script>
  import IntegrationTable from "../components/IntegrationTable"
  import * as Topo from  "../js/topo"
  // import {topoTestData} from "../js/topoTestData";

  export default {
    components: {IntegrationTable},
    data () {
      return {
        hostTableData : this.$store.getters.getHostMoveResult,
        vmTableData : this.$store.getters.getVmMoveResult,
        haAndHosts: {},
        haDistance: 400,
        hostXDistance: 200,
        hostYDistance: 0,
        haIndex: 0,
        vnfs: this.$store.getters.getAllVNFs,
        vnf: '',
        vmIdAndVm: {},
        sourceHosts: '',
        hostColumns: [
          {
            type: 'index',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '主机名',
            key: 'name',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: '所属HA',
            key: 'cHAs',
            align: 'center',
            width: 120,
            fixed: 'left',
            sortable: true
          },
          {
            title: '原主机虚拟机集合',
            key: 'vmIdList',
            align: 'center',
            width: 250,
            fixed: 'left',
          },
          {
            title: '迁入虚拟机集合',
            key: 'move_in_vmIdList',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: '迁出虚拟机集合',
            key: 'move_out_vmIdList',
            align: 'center',
            width: 250,
            fixed: 'left',
          },
          {
            title: '可分配CPU数',
            key: 'total_cpu',
            align: 'center',
            width: 120,
          },
          {
            title: '迁移前剩余CPU数',
            key: 'total_free_cpu',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移后剩余CPU数',
            key: 'after_total_free_cpu',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移前CPU碎片率',
            key: 'cpu_unalloc_ratio',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移后CPU碎片率',
            key: 'after_cpu_unalloc_ratio',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移前CPU利用率',
            key: 'cpuutil',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移后CPU利用率',
            key: 'after_cpuutil',
            align: 'center',
            width: 100,
          },
          {
            title: '总内存数(M)',
            key: 'total_mem',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移前剩余内存数(M)',
            key: 'total_free_mem',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移后剩余内存数(M)',
            key: 'after_total_free_mem',
            align: 'center',
            width: 100,
          },
          {
            title: 'NUMA节点1',
            align: 'center',
            children: [
              {
                title: '总CPU数',
                key: 'numa_node1_total_cpus',
                align: 'center',
                width: 100,
              },
              {
                title: '迁移前剩余CPU数',
                key: 'numa_node1_free_cpus',
                align: 'center',
                width: 100,
              },
              {
                title: '迁移后剩余CPU数',
                key: 'after_numa_node1_free_cpus',
                align: 'center',
                width: 100,
              },
              {
                title: '总大页内存数(M)',
                key: 'numa_node1_total_mem',
                align: 'center',
                width: 130,
              },
              {
                title: '迁移前剩余大页内存数(M)',
                key: 'numa_node1_free_mem',
                align: 'center',
                width: 140,
              },
              {
                title: '迁移后剩余大页内存数(M)',
                key: 'after_numa_node1_free_mem',
                align: 'center',
                width: 140,
              },
              {
                title: 'NUMA节点1待迁入虚拟机集合',
                key: 'numa_node1_VM_Ids',
                align: 'center',
                width: 300,
              },
              {
                title: '其他信息',
                key: 'numa_node1_other',
                align: 'center',
                width: 400,
              }
            ]
          },
          {
            title: 'NUMA节点2',
            align: 'center',
            children: [
              {
                title: '总CPU数',
                key: 'numa_node2_total_cpus',
                align: 'center',
                width: 100,
              },
              {
                title: '迁移前剩余CPU数',
                key: 'numa_node2_free_cpus',
                align: 'center',
                width: 100,
              },
              {
                title: '迁移后剩余CPU数',
                key: 'after_numa_node2_free_cpus',
                align: 'center',
                width: 100,
              },
              {
                title: '总大页内存数(M)',
                key: 'numa_node2_total_mem',
                align: 'center',
                width: 140,
              },
              {
                title: '迁移前剩余大页内存数(M)',
                key: 'numa_node2_free_mem',
                align: 'center',
                width: 140,
              },
              {
                title: '迁移后剩余大页内存数(M)',
                key: 'after_numa_node2_free_mem',
                align: 'center',
                width: 140,
              },
              {
                title: 'NUMA节点2待迁入虚拟机集合',
                key: 'numa_node2_VM_Ids',
                align: 'center',
                width: 300,
              },
              {
                title: '其他信息',
                key: 'numa_node2_other',
                align: 'center',
                width: 400,
              }
            ]
          },
          {
            title: '迁移前剩余入口总带宽',
            key: 'total_bandwidths_ingress',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移后剩余入口总带宽',
            key: 'after_total_bandwidths_ingress',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移前剩余出口总带宽',
            key: 'total_bandwidths_egress',
            align: 'center',
            width: 100,
          },
          {
            title: '迁移后剩余出口总带宽',
            key: 'after_total_bandwidths_egress',
            align: 'center',
            width: 100,
          },
          {
            title: '反亲和组名集合',
            key: 'anti_affinity',
            align: 'center',
            width: 100,
            fixed: 'right',
          },
          {
            title: '亲和组名集合',
            key: 'affinity',
            align: 'center',
            width: 100,
            fixed: 'right',
          }
        ],
        vmColumns: [
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
            width: 150,
            fixed: 'left',
          },
          {
            title: '所属主机名',
            key: 'cHost',
            align: 'center',
            width: 150,
            fixed: 'left',
          },
          {
            title: '主机所属HA',
            key: 'cHAs',
            align: 'center',
            width: 150,
            fixed: 'left',
          },
          {
            title: '迁移目标主机名',
            key: 'moveTargetHost',
            align: 'center',
            width: 150,
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
        vmIdAndVm[vm.name] = vm
      }
        this.vmIdAndVm = vmIdAndVm
      let toMoveHosts = this.$store.getters.getToMoveHosts
      let haAndHosts = this.buildHaAndHosts(toMoveHosts,vmIdAndVm)

      for(let ha in haAndHosts){
        let hosts = haAndHosts[ha]
        hosts.sort(this.sortByCpuUnAllocRatio)
        this.doMove(hosts,hostNameAndVMs)
      }
      this.predictCPUUtil(toMoveHosts,vmIdAndVm)

      this.hostTableData = toMoveHosts
      this.haAndHosts = haAndHosts
      this.$store.commit('setHostMoveResult', toMoveHosts);
    },
    mounted() {
      this.drawTopo()
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
              host.anti_affinity.push(vm.affinity_name)
            }else if(vm.type != undefined && vm.type == 'affinity'){
              host.affinity.push(vm.affinity_name)
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
          let vms = hostNameAndVMs[sourceHost.name]
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
              if(sourceHost.name == targetHost.name){
                continue
              }
              if(sourceHost.move_in_vmIdList.length > 0){
                continue
              }
              if(this.allowedDeployVmToHost(vm,targetHost)){
                this.computeAndRecordResource(vm,sourceHost,targetHost)
                this.buildVmTableData(vm,targetHost)
                break;
              }
            }
          }
        }
      },
      buildVmTableData(vm,targetHost) {
        if(this.vmTableData == undefined) {
          this.vmTableData = []
        }
        vm.moveTargetHost = targetHost.name
        this.vmTableData.push(vm)
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
          targetHost.anti_affinity.push(vm.affinity_name)
        }else if(vm.type == 'affinity'){
          targetHost.affinity.push(vm.affinity_name)
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

        targetHost.move_in_vmIdList.push(vm.name)
        targetHost.after_total_free_cpu -= vm.vCpus
        targetHost.after_cpu_unalloc_ratio = targetHost.after_total_free_cpu / targetHost.total_cpu
        targetHost.after_total_free_mem -= vm.vRams

        sourceHost.move_out_vmIdList.push(vm.name)
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
        changeVnf() {
          Topo.clear()
          this.drawTopo()
        },
      drawTopo() {
        let haAndHosts = this.haAndHosts
        // let haAndHosts = topoTestData
        let canvas = document.getElementById('canvas');
        Topo.init(canvas)
        for(let ha in haAndHosts){
          let haContainer = Topo.buildContainer(ha,"Top_Center","130,178,210",10,10,100,100)
          let hosts = haAndHosts[ha]
          hosts.sort(this.sortByCpuUnAllocRatio)
          //源主机列表
          let sourceHosts = this.addHostToSourceContainer(hosts);
          this.sourceHosts = sourceHosts
          //目标主机列表
          let targetHosts = this.addHostToTargetContainer(hosts);
          haContainer.add(sourceHosts)
          haContainer.add(targetHosts)
          this.buildVmLines(sourceHosts,targetHosts)
          this.haIndex++
        }
      },
      addHostToSourceContainer(hosts) {
        let sourceHostIndexY = 0
        let hostsContainer = Topo.buildContainer("源主机","Top_Center","200,200,200",10,10,100,100)
        for (let i = 0, len = hosts.length; i < len; i++) {
          let hostNameArr = hosts[i].name.split("-")
          let hostName =hostNameArr[5] + "-" + hostNameArr[8]
          let vmNum = hosts[i].vmIdList.length
          if(vmNum == 0){
            continue
          }
          let sourceHostHeight = Math.round(vmNum / 2) * 50
          sourceHostIndexY += sourceHostHeight
          let hostContainer = Topo.buildContainer(hostName, "Bottom_Center", "10,10,100", this.haIndex * this.haDistance, sourceHostIndexY + this.hostYDistance, 100, sourceHostHeight)
          let hostLayout = JTopo.layout.GridLayout(Math.round(vmNum / 2), 2);
          hostContainer.layout = hostLayout
          for (let j = 0; j < hosts[i].vmIdList.length; j++) {
            let vmId = hosts[i].vmIdList[j]
            let nodeName = vmId.substr(vmId.length-3, vmId.length)
            let vmNode
            if (hosts[i].move_out_vmIdList.indexOf(vmId) > -1) {
                vmNode = Topo.buildNode(nodeName, "128,128,128")
                // vmNode = Topo.buildNode(vmId.substr(0, 3), "128,128,128",2,'255,255,255')
            } else {
                vmNode = Topo.buildNode(nodeName)
            }
            if(this.vmIdAndVm[vmId].vnf_name == this.vnf){
                vmNode.borderColor = '255,255,255'
                vmNode.borderWidth = 2
            }
            vmNode.fullName = vmId
            hostContainer.add(vmNode)
          }
          hostsContainer.add(hostContainer)
        }
        return hostsContainer
      },
      addHostToTargetContainer(hosts) {
        let targetHostIndexY = 10
        let hostsContainer = Topo.buildContainer("目标主机","Top_Center","200,200,200",10,10,100,100)
        for (let i = hosts.length-1; i >= 0; i--) {
          let hostNameArr = hosts[i].name.split("-")
          let hostName =hostNameArr[5] + "-" + hostNameArr[8]
          // let hostName = hosts[i].hostname.substr(hosts[i].hostname.length - 2, hosts[i].hostname.length)
          let vmNum = hosts[i].vmIdList.length
          if(vmNum == 0){
            continue
          }
          vmNum = hosts[i].vmIdList.length + hosts[i].move_in_vmIdList.length
          let targetHostHeight = Math.round(vmNum/2) * 50
          targetHostIndexY += targetHostHeight
          let hostContainer = Topo.buildContainer(hostName,"Bottom_Center","10,10,100", this.haIndex * this.haDistance + this.hostXDistance,targetHostIndexY+this.hostYDistance,100,targetHostHeight)
          let hostLayout = JTopo.layout.GridLayout(Math.round(vmNum / 2), 2);
          hostContainer.layout = hostLayout
          for (let j = 0; j < hosts[i].vmIdList.length; j++) {
            let vmId = hosts[i].vmIdList[j]
            let nodeName = vmId.substr(vmId.length-3, vmId.length)
            let vmNode
            if (hosts[i].move_out_vmIdList.indexOf(vmId) > -1) {
              vmNode = Topo.buildNode(nodeName, "128,128,128")
            } else {
              vmNode = Topo.buildNode(nodeName)
            }
            vmNode.fullName = vmId
            hostContainer.add(vmNode);
          }

          for(let j=0; j<hosts[i].move_in_vmIdList.length; j++) {
            let vmId = hosts[i].move_in_vmIdList[j]
            let vm = Topo.buildNode(vmId.substr(vmId.length-3, vmId.length),"255,0,0")
            vm.fullName = vmId
            hostContainer.add(vm);
          }
          hostsContainer.add(hostContainer)
        }
        return hostsContainer
      },
      buildVmLines(sourceHosts,targetHosts){
        let sourceHostsChilds = sourceHosts.childs
        let targetHostsChilds = targetHosts.childs
        let tag = false
        for(let i=0,len=sourceHostsChilds.length;i<len;i++){
          let sourceVms = sourceHostsChilds[i].childs
          if(sourceVms.length == 0) {
            continue
          }
          for(let j=0;j<sourceVms.length;j++){
            if(sourceVms[j].fillColor != '128,128,128'){
              continue
            }
            let vmText = sourceVms[j].fullName
            for(let k=0,len=targetHostsChilds.length;k<len;k++){
              let targetVms = targetHostsChilds[k].childs
              if(targetVms.length == 0){
                continue
              }
              for(let l=0;l<targetVms.length;l++){
                if(targetVms[l].fillColor != '255,0,0'){
                  continue
                }
                if(targetVms[l].fullName == vmText){
                  Topo.buildLine(sourceVms[j],targetVms[l])
                  tag = true
                  break
                }
              }
              if(tag){
                tag = false
                break
              }
            }
          }
        }
      }
    }
  }
</script>