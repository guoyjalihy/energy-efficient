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
            title: 'vm_id',
            key: 'vm_id',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'vm_name',
            key: 'vm_name',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'cHost',
            key: 'cHost',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'vCpus',
            key: 'vCpus',
            align: 'center',
            width: 100,
          },
          {
            title: 'vRams',
            key: 'vRams',
            align: 'center',
            width: 100,
          },
          {
            title: 'vramutil',
            key: 'vramutil',
            align: 'center',
            width: 100,
          },
          {
            title: 'vcpuutil',
            key: 'vcpuutil',
            align: 'center',
            width: 100,
          },
          {
            title: 'vmgroup',
            align: 'center',
            children: [
              {
                title: 'type',
                key: 'type',
                align: 'center',
                width: 100,
                sortable: true
              },
              {
                title: 'name',
                key: 'name',
                align: 'center',
                width: 100,
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
            title: 'egress_max_kbps',
            key: 'egress_max_kbps',
            align: 'center',
            width: 200,
          },
          {
            title: 'ingress_max_kbps',
            key: 'ingress_max_kbps',
            align: 'center',
            width: 200,
          },
          {
            title: 'vnf_name',
            key: 'vnf_name',
            align: 'center',
            width: 150,
            fixed: 'right'
          },
          {
            title: 'vnf_type',
            key: 'vnf_type',
            align: 'center',
            width: 100,
            fixed: 'right'
          },
          {
            title: 'vdu_id',
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
