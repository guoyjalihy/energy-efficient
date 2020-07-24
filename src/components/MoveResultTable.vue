<template>
  <Table :columns="columns" :data="data" border height="500"></Table>
</template>
<script>
  export default {
    name: 'MoveResultTable',
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
            fixed: 'left',
          },
          {
            title: 'hostname',
            key: 'hostname',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'numa_node1_VM_Ids',
            key: 'numa_node1_VM_Ids',
            align: 'center',
            width: 300,
            fixed: 'left',
          },
          {
            title: 'numa_node2_VM_Ids',
            key: 'numa_node2_VM_Ids',
            align: 'center',
            width: 300,
            fixed: 'left',
          },
          {
            title: 'numa1_cpus',
            key: 'numa_node1_cpus_unpinned_num',
            align: 'center',
            width: 150,
          },
          {
            title: 'after_numa1_cpus',
            key: 'after_numa_node1_cpus_unpinned_num',
            align: 'center',
            width: 180,
          },
          {
            title: 'numa1_mem1',
            key: 'numa_node1_mem1',
            align: 'center',
            width: 150,
          },
          {
            title: 'after_numa1_mem1',
            key: 'after_numa_node1_mem1',
            align: 'center',
            width: 180,
          },
          {
            title: 'numa2_cpus',
            key: 'numa_node2_cpus_unpinned_num',
            align: 'center',
            width: 150,
          },
          {
            title: 'after_numa2_cpus',
            key: 'after_numa_node2_cpus_unpinned_num',
            align: 'center',
            width: 180,
          },
          {
            title: 'numa2_mem1',
            key: 'numa_node2_mem1',
            align: 'center',
            width: 150,
          },
          {
            title: 'after_numa2_mem1',
            key: 'after_numa_node2_mem1',
            align: 'center',
            width: 180,
          },
          {
            title: 'anti_affinity',
            key: 'anti_affinity',
            align: 'center',
            width: 200,
            fixed: 'right',
          },
          {
            title: 'affinity',
            key: 'affinity',
            align: 'center',
            width: 100,
            fixed: 'right',
          }
        ],
      }
    }
  }
</script>
