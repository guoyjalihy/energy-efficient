<template>
  <Table :columns="columns" :data="data" border height="660"></Table>
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
            title: '主机名',
            key: 'hostname',
            width: 150,
            align: 'center',
          },
          {
            title: '虚拟机集合',
            key: 'vmIdList',
            align: 'center',
          },
          {
            title: '碎片率',
            key: 'cpu_unalloc_ratio',
            width: 100,
            align: 'center',
            sortable: true
          },
          {
            title: 'power',
            key: 'power',
            width: 150,
            align: 'center',
          }
        ],
      }
    }
  }
</script>
