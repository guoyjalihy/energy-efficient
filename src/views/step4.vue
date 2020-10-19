<template>
  <div class="step4">
    <Select v-model="model" @on-change="changeType" style="width:200px">
      <Option v-for="item in moveType" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Input v-model="hostNum" v-show="showHostNum" placeholder="请输入主机数量,默认10" style="width: 200px" />
    <Button type="primary" @click="parse">解析</Button>
    <IntegrationTable :height="500" :columns="columns" :tableData="tableData"/>
  </div>
</template>
<script>
  import IntegrationTable from "../components/IntegrationTable"
  export default {
    components: {IntegrationTable},
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
        showHostNum: false,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '主机名称',
            key: 'name',
            align: 'center',
            width: 120,
            fixed: 'left',
          },
          {
            title: '所属HA',
            key: 'cHAs',
            align: 'center',
            width: 120,
            fixed: 'left',
          },
          {
            title: '可分配CPU数',
            key: 'total_cpu',
            align: 'center',
            width: 120,
            fixed: 'left',
          },
          {
            title: '剩余CPU数',
            key: 'total_free_cpu',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: 'CPU碎片率',
            key: 'cpu_unalloc_ratio',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: 'CPU利用率',
            key: 'cpuutil',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: '总内存数(M)',
            key: 'total_mem',
            align: 'center',
            width: 120,
            fixed: 'left',
          },
          {
            title: '剩余内存数(M)',
            key: 'total_free_mem',
            align: 'center',
            width: 120,
            fixed: 'left',
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
                title: '剩余CPU数',
                key: 'numa_node1_free_cpus',
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
                title: '剩余大页内存数(M)',
                key: 'numa_node1_free_mem',
                align: 'center',
                width: 140,
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
                title: '剩余CPU数',
                key: 'numa_node2_free_cpus',
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
                title: '剩余大页内存数(M)',
                key: 'numa_node2_free_mem',
                align: 'center',
                width: 140,
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
            title: '剩余入口总带宽',
            key: 'total_bandwidths_ingress',
            align: 'center',
            width: 100,
            fixed: 'right'
          },
          {
            title: '剩余出口总带宽',
            key: 'total_bandwidths_egress',
            align: 'center',
            width: 100,
            fixed: 'right'
          }
        ],
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