<template>
  <Table :columns="columns" :data="data" border height="500"></Table>
</template>
<script>
  export default {
    name: 'AllVms',
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
    },
    data () {
      return {
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
            width: 200,
            fixed: 'left',
          },
          {
            title: '虚拟机名称',
            key: 'vm_name',
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
                key: 'name',
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
    }
  }
</script>
