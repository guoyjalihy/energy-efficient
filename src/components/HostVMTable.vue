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
          },
          {
            title: 'hostName',
            key: 'hostName',
            align: 'center',
            width: 250,
          },
          {
            title: 'vmIdList',
            key: 'vmIdList',
            align: 'center',
            width: 580,
          },
          {
            title: 'cpuutil',
            key: 'cpuutil',
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
            title: 'cpu_unalloc_ratio',
            key: 'cpu_unalloc_ratio',
            align: 'center',
            width: 200,
            sortable: true
          },
          {
            title: 'power',
            key: 'power',
            align: 'center',
            width: 200,
          }
        ],
      }
    }
  }
</script>
