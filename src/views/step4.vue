<template>
  <div class="step4">
    <Select v-model="model" @on-change="changeType" style="width:200px">
      <Option v-for="item in moveType" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Input v-model="hostNum" v-show="showHostNum" placeholder="请输入主机数量,默认10" style="width: 200px" />
    <Button type="primary" @click="parse">解析</Button>
    <Divider />
    <AllHostInfo :data="tableData" :height="tableHeight"/>
  </div>
</template>
<script>
  import AllHostInfo from "../components/AllHostInfo";
  export default {
    components: {AllHostInfo},
    data () {
      return {
        tableHeight: '600',
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
        model: 1,
        tableData: [],
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
      parse() {
        let hosts = this.$store.getters.getAllHosts
        let toMoveHosts = []
        for(let i=0,len=hosts.length;i<len;i++){
          let host = hosts[i]
          if(host.cpu_unalloc_ratio == 1 || host.cpu_unalloc_ratio == 0){
            continue
          }
          toMoveHosts.push(host)
        }
        if (this.model == 1){
          this.tableData = toMoveHosts.sort(this.sortByCpuUnAllocRatio)
        }else if (this.model == 2){
          if (this.hostNum == ''){
            this.hostNum = 10
          }
          this.tableData = toMoveHosts.sort(this.sortByCpuUnAllocRatio).slice(0,this.hostNum)
        }
        this.$store.commit('setToMoveHosts',this.tableData);
        console.log("toMoveHosts: {}" , this.tableData)
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