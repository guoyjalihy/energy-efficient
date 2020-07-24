<template>
  <div class="step4">
    <Select v-model="model" style="width:200px">
      <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Input v-model="hostNum" placeholder="请输入主机数量,默认10" style="width: 300px" />
    <Button type="primary" @click="parse">解析</Button>
    <Button type="primary" @click="tab">切换</Button>
    <Divider />
    <HostVMTable v-show="showHostVmsTable" :data="tableData"/>
    <AllVms v-show="showVmsTable" :data="vmsData"/>
  </div>
</template>
<script>
  import HostVMTable from "../components/HostVMTable";
  import AllVms from "../components/AllVms";
  export default {
    components: {AllVms, HostVMTable},
    data () {
      return {
        type: [
          {
            value: 1,
            label: '按CPU利用率最小'
          },
          {
            value: 2,
            label: '按内存利用率最小'
          },
          {
            value: 3,
            label: '按碎片率最大'
          }
        ],
        model: 3,
        showHostVmsTable: true,
        showVmsTable: false,
        tableData: [],
        vmsData: [],
        hostNum: ''
      }
    },
    created() {
      this.parse()
    },
    methods: {
      tab() {
        if (this.showHostVmsTable){
          this.showVmsTable = true
          this.showHostVmsTable = false
        }else {
          this.showHostVmsTable = true
          this.showVmsTable = false
        }
      },
      parse() {
        if (this.hostNum == ''){
          this.hostNum = 10
        }
        let hostVM = this.$store.getters.getHostVM
        if (this.model == 1) {
          this.tableData = hostVM.slice(0,this.hostNum)
        }else if(this.model == 2){
          this.tableData = hostVM.sort(this.sortByRamUtil).slice(0,this.hostNum)
        }else if(this.model == 3){
          this.tableData = hostVM.sort(this.sortByCpuUnAllocRatio).slice(0,this.hostNum)
        }
        this.$store.commit('setTodoHostVms', this.tableData);
        this.parseVmsData()
      },
      parseVmsData() {
        let allVms = this.$store.getters.getAllVms
        let vmIdAndVM = {}
        for(let i=0,len=allVms.length;i<len;i++){
          let vm = allVms[i]
          vmIdAndVM[vm.vm_id] = vm
        }
        let vmsData = []
        for(let i=0,len=this.tableData.length;i<len;i++) {
          let hostVM = this.tableData[i]
          let vmIds = hostVM.vmIdList
          for(let j=0;j<vmIds.length;j++){
            vmsData.push(vmIdAndVM[vmIds[j]])
          }
        }
        this.vmsData = this.sortByAntiName(vmsData).sort(this.sortByAntiType)
        this.$store.commit('setTodoVms', this.vmsData)
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