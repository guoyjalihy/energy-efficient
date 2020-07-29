<template>
  <Table :columns="columns" :data="data" border height="500"></Table>
</template>
<script>
  export default {
    name: 'HostVMTable',
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
            title: 'hostName',
            key: 'hostName',
            align: 'center',
            width: 200,
            fixed: 'left',
          },
          {
            title: 'vmIdList',
            key: 'vmIdList',
            align: 'center',
            width: 500,
            fixed: 'left',
          },
          {
            title: 'cputotal',
            key: 'cputotal',
            align: 'center',
            width: 100,
          },
          {
            title: 'cpu_used',
            key: 'cpu_used',
            align: 'center',
            width: 100,
          },
          {
            title: 'cpuutil',
            key: 'cpuutil',
            align: 'center',
            width: 100,
          },
          {
            title: 'cpu_unalloc_ratio',
            key: 'cpu_unalloc_ratio',
            align: 'center',
            width: 200,
            sortable: true
          },
          {
            title: 'ramtotal',
            key: 'ramtotal',
            align: 'center',
            width: 100,
          },
          {
            title: 'mem_used',
            key: 'mem_used',
            align: 'center',
            width: 100,
          },
          {
            title: 'ramutil',
            key: 'ramutil',
            align: 'center',
            width: 100,
          },
          {
            title: 'power',
            key: 'power',
            align: 'center',
            width: 200,
            fixed: 'right',
          }
        ],
      }
    }
  }
</script>
