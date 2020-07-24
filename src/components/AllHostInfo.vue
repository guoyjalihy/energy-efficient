<template>
  <Table :columns="columns" :data="data" border height="500"></Table>
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
            title: 'hostname',
            key: 'hostname',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'cAZ',
            key: 'cAZ',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: 'cHAs',
            key: 'cHAs',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: 'cRegion',
            key: 'cRegion',
            align: 'center',
            width: 100,
            fixed: 'left',
          },
          {
            title: 'total_cpu',
            key: 'total_cpu',
            align: 'center',
            width: 100,
            fixed: 'left',
            
          },
          {
            title: 'total_mem',
            key: 'total_mem',
            align: 'center',
            width: 100,
            fixed: 'left',
            
          },
          {
            title: 'numa_node1',
            align: 'center',
            children: [
              {
                title: 'cpus_unpinned_num',
                key: 'numa_node1_cpus_unpinned_num',
                align: 'center',
                width: 100,
                
              },
              {
                title: 'mem1((total-used)*size_kb)',
                key: 'numa_node1_mem1',
                align: 'center',
                width: 100,
                
              },
              {
                title: 'other',
                key: 'numa_node1_other',
                align: 'center',
                width: 400,
                
              }
            ]
          },
          {
            title: 'numa_node2',
            align: 'center',
            children: [
              {
                title: 'cpus_unpinned_num',
                key: 'numa_node2_cpus_unpinned_num',
                align: 'center',
                width: 100,
                
              },
              {
                title: 'mem1((total-used)*size_kb)',
                key: 'numa_node2_mem1',
                align: 'center',
                width: 100,
                
              },
              {
                title: 'other',
                key: 'numa_node2_other',
                align: 'center',
                width: 400,
                
              }
            ]
          },
          {
            title: 'total_bandwidths_ingress_vsw',
            key: 'total_bandwidths_ingress_vsw',
            align: 'center',
            width: 100,
            fixed: 'right'
          },
          {
            title: 'total_bandwidths_egress_vsw',
            key: 'total_bandwidths_egress_vsw',
            align: 'center',
            width: 100,
            fixed: 'right'
          }
        ],
        // data: this.props.data
      }
    }
  }
</script>
