<template>
  <div class="step4">
    <Select v-model="model" @on-change="changeType" style="width:200px">
      <Option v-for="item in moveType" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Input v-model="hostNum" v-show="showHostNum" placeholder="请输入主机数量,默认10" style="width: 200px" />
    <Button type="primary" @click="parse">解析</Button>
    <Select v-model="tableType" @on-change="changeType" style="width:200px">
      <Option v-for="item in tableTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button type="primary" @click="tab">切换</Button>
    <Divider />
    <HostVMTable v-show="showHostVmsTable" :data="tableData"/>
    <AllHostInfo v-show="showHostTable" :data="hostData"/>
    <AllVms v-show="showVmsTable" :data="vmsData"/>
  </div>
</template>
<script>
  import HostVMTable from "../components/HostVMTable";
  import AllHostInfo from "../components/AllHostInfo";
  import AllVms from "../components/AllVms";
  export default {
    components: {AllVms, HostVMTable,AllHostInfo},
    data () {
      return {
        moveType: [
          {
            value: 1,
            label: '极限迁移'
          },
          {
            value: 2,
            label: '分批迁移'
          }
        ],
        tableTypes: [
          {
            value: 1,
            label: '主机与虚拟机关系列表'
          },
          {
            value: 2,
            label: '主机列表'
          },
          {
            value: 3,
            label: '虚拟机列表'
          }
        ],
        tableType: 1,
        model: 1,
        showHostVmsTable: true,
        showHostTable: false,
        showVmsTable: false,
        tableData: [],
        hostData: [],
        vmsData: [],
        hostNum: '',
        showHostNum: false
      }
    },
    created() {
      this.parse()
    },
    methods: {
      changeType(){
        if (this.model == 1){
          this.showHostNum = false
        }else if (this.model == 2) {
          this.showHostNum = true
        }
      },
      tab() {
        // let todoMoveHostVms = this.$store.getters.getTodoHostVms
        if (this.tableType == 1){
          this.showHostVmsTable = true
          this.showVmsTable = false
          this.showHostTable = false
        }else if (this.tableType == 2){
          // this.parseHostData(todoMoveHostVms)
          this.showHostVmsTable = false
          this.showVmsTable = false
          this.showHostTable = true
        }else if (this.tableType == 3){
          // this.parseVmsData(todoMoveHostVms)
          this.showHostVmsTable = false
          this.showVmsTable = true
          this.showHostTable = false
        }
      },
      parse() {
        let hosts = this.$store.getters.getAllHostInfo
        let cpu_unalloc_ratio_1 = []
        let cpu_unalloc_ratio_0 = []
        let todoMoveHostVms = []
        for(let i=0,len=hosts.length;i<len;i++){
          let host = hosts[i]
          if (host.cpu_unalloc_ratio == 1){
            cpu_unalloc_ratio_1.push(host.hostname)
          }else if(host.cpu_unalloc_ratio == 0){
            cpu_unalloc_ratio_0.push(host.hostname)
          }else{
            todoMoveHostVms.push(host)
          }
        }
        if (this.model == 1){
          this.tableData = todoMoveHostVms.sort(this.sortByCpuUnAllocRatio)
        }else if (this.model == 2){
          if (this.hostNum == ''){
            this.hostNum = 10
          }
          this.tableData = todoMoveHostVms.sort(this.sortByCpuUnAllocRatio).slice(0,this.hostNum)
        }
        this.$store.commit('setTodoHostVms',this.tableData);
        this.$store.commit('setOtherAllowedPowerOffHostNum',cpu_unalloc_ratio_1.length);
        console.log("todoMoveHosts: {}" , this.tableData)
        this.parseHostData(this.tableData)
        this.parseVmsData(this.tableData)
      },
      parseHostData(todoMoveHosts) {
        // let allHosts = this.$store.getters.getAllHostInfo
        // let hostNameAndHost = {}
        // for(let i=0,len=allHosts.length;i<len;i++){
        //   let host = allHosts[i]
        //   hostNameAndHost[host.hostname] = host
        // }
        // let hostData = []
        // for(let j=0,len=todoMoveHosts.length;j<len;j++){
        //   let _host = todoMoveHosts[j]
        //   hostData.push(hostNameAndHost[_host.hostname])
        // }
        this.hostData = todoMoveHosts.slice(0,50)
        // this.$store.commit('setTodoHost', hostData)
        // console.log("TodoHost: {}" , hostData)
      },
      parseVmsData(todoMoveHosts) {
        let allVms = this.$store.getters.getAllVms
        let vmIdAndVM = {}
        for(let i=0,len=allVms.length;i<len;i++){
          let vm = allVms[i]
          vmIdAndVM[vm.vm_id] = vm
        }
        let vmsData = []
        for(let i=0,len=todoMoveHosts.length;i<len;i++) {
          let hostVM = todoMoveHosts[i]
          let vmIds = hostVM.vmIdList
          if (vmIds == undefined){
            continue;
          }
          for(let j=0;j<vmIds.length;j++){
            vmsData.push(vmIdAndVM[vmIds[j]])
          }
        }
        this.vmsData = vmsData.slice(0,50)
        this.$store.commit('setTodoVms', vmsData)
        console.log("TodoVms: {}" , vmsData)
      },
      sortByRamUtil: function (obj1, obj2) {//比较函数
        if (obj1.ramutil > obj2.ramutil) {
          return 1
        }else if (obj1.ramutil < obj2.ramutil){
          return -1;
        }else{
          return 0;
        }
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
      sortByAntiName: function(todoVms){
        let nameAndNum = {}
        for(let i=0,len=todoVms.length;i<len;i++){
          let vm = todoVms[i]
          if(nameAndNum[vm.name]  == undefined){
            nameAndNum[vm.name] = 1
          }else{
            nameAndNum[vm.name] = ++nameAndNum[vm.name]
          }
        }
        nameAndNum = this.sortJson(nameAndNum)
        console.log(nameAndNum)
        let todoVmsSorted = []
        let nameIsNullVMs = {}
        for(let name in nameAndNum){
          for(let i=0,len=todoVms.length;i<len;i++){
            let vm = todoVms[i]
            if(vm.name == name){
              todoVmsSorted.push(vm)
            }else if(vm.name == undefined ){
              nameIsNullVMs[vm.vm_name] = vm
            }
          }
        }
        for(let vmName in nameIsNullVMs){
          todoVmsSorted.push(nameIsNullVMs[vmName])
        }
        return todoVmsSorted
      },
      sortByAntiType: function(a,b){
        return a.type==undefined?1:b.type==undefined?1:a.type>b.type?-1:1
      },
      sortJson: function (obj) {
        const keys = Object.keys(obj).sort(function(a, b) {   return obj[b] - obj[a] })
        let newObj = {}
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          newObj[key] = obj[key]
        }
        return newObj;
      }
    }
  }
</script>