<template>
  <div class="step6">
    <IntegrationTable :height="550" :columns="columns" :tableData="tableData"/>
  </div>
</template>
<script>
  import IntegrationTable from "../components/IntegrationTable"

  export default {
    components: {IntegrationTable},
    data () {
      return {
        tableData : [],
        columns: [
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
            title: '所属HA集合',
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
      }
    },
    created() {
      //获取待迁移主机列表，等价于可下电主机列表（注意保留15%的额外资源，计算原则为服务器总数的15%）
      let moveResultHost = this.$store.getters.getHostMoveResult
      let allowedPowerOffHost = []
      for(let i=0,len=moveResultHost.length;i<len;i++){
        let host = moveResultHost[i]
        if (host.after_total_free_cpu == host.total_cpu){
          allowedPowerOffHost.push(host)
        }
      }

      let reserveNum = Math.ceil(this.$store.getters.getAllHosts.length * 0.15)
      this.tableData = allowedPowerOffHost.slice(0,allowedPowerOffHost.length-reserveNum)
    },
    methods: {

    }
  }
</script>