<template>
  <Table :columns="columns" :data="data" border :height="height"></Table>
</template>
<script>
  export default {
    name: 'AllHostInfo',
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      height: {
        type: [Number, String],
        default() {
          return "500"
        }
      }
    },
    data () {
      return {
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '主机名',
            key: 'hostname',
            align: 'center',
            width: 120,
            fixed: 'left',
          },
          {
            title: '所属HA集合',
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
        // data: this.props.data
      }
    },
  }
</script>
