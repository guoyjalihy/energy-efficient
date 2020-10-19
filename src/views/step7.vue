<template>
  <div class="step7">
      <Row>
          <i-col>
              <Card>
                <div id="hostPie" style="height:280px;"></div>
              </Card>
          </i-col>
      </Row>
      <Row style="padding-top:1%">
          <i-col span="12">
              <Card>
                <div id="hostBar" style="height:280px;"></div>
              </Card>
          </i-col>
          <i-col span="11" offset="1">
              <Card>
                <div id="other" style="height:280px;">
                    预计节省
                    <p style="font-size: 64px;text-align: center;padding-top: 10%">{{this.statisticsInfo.money}}元/月</p>
                    <p style="text-align: right;padding-top: 11%">
                        计算公式：休眠主机数*功率*每度电费*PUE*每月小时数 <br/>
                        其中：电费为0.8元/度，PUE为1.2
                    </p>
                </div>
              </Card>
          </i-col>
      </Row>
  </div>
</template>
<style>
    .step7{
        background:#eee;
        padding: 20px
    }
</style>
<script>
  export default {
    data () {
      return {
          statisticsInfo: this.$store.getters.getStatisticsInfo
      }
    },
    created() {
      let allHosts = this.$store.getters.getAllHosts
      let allVms = this.$store.getters.getAllVms
      let moveResult = this.$store.getters.getHostMoveResult
      let statisticsInfo = {}
      statisticsInfo.hostsNum = allHosts.length
      statisticsInfo.vmsNum = allVms.length
      statisticsInfo.toMoveHostsNum = moveResult.length
      let beforeFreeHostsNum = 0
      let beforeFullHostsNum = 0
      for (let i = 0, len = allHosts.length; i < len; i++) {
        let host = allHosts[i]
        if (host.total_free_cpu == host.total_cpu) {
          beforeFreeHostsNum ++
        }
        if (host.total_free_cpu == 0) {
          beforeFullHostsNum ++
        }
      }
      statisticsInfo.beforeFreeHostsNum = beforeFreeHostsNum
      statisticsInfo.beforeFullHostsNum = beforeFullHostsNum

      let toMoveVmsNum = 0
      let moveVmsNum = 0
      let afterFreeHostsNum = 0
      let afterFullHostsNum = 0

      let beforeTotalCPUs = 0
      let beforeTotalFreeCpus = 0
      let afterTotalFreeCpus = 0
      let afterTotalCPUs = 0
      let beforeTotalCpuUtil = 0
      let afterTotalCpuUtil = 0
      let afterHostsNum = 0
      for (let i = 0, len = moveResult.length; i < len; i++) {
        let host = moveResult[i]
        toMoveVmsNum += host.vmIdList.length
        if (host.after_total_free_cpu == host.total_cpu) {
          afterFreeHostsNum++
        }else {
          afterTotalCPUs += parseInt(host.total_cpu)
          if (host.after_total_free_cpu != undefined) {
            afterTotalFreeCpus += host.after_total_free_cpu
          }
          afterTotalCpuUtil += Math.round(host.after_cpuutil * 100) / 100
          afterHostsNum++
        }

        beforeTotalCPUs += parseInt(host.total_cpu)
        beforeTotalFreeCpus += host.total_free_cpu
        beforeTotalCpuUtil += Math.round(host.cpuutil * 100) / 100
        if (host.move_out_vmIdList != undefined) {
          moveVmsNum += host.move_out_vmIdList.length
        }

        if (host.after_total_free_cpu == 0) {
          afterFullHostsNum++
        }
      }
      statisticsInfo.totalToMoveVmsNum = toMoveVmsNum
      statisticsInfo.totalMoveVmsNum = moveVmsNum
      statisticsInfo.afterFreeHostsNum = afterFreeHostsNum
      statisticsInfo.afterFullHostsNum = afterFullHostsNum


      let reserveHostsNum = Math.ceil((allHosts.length - beforeFreeHostsNum - afterFreeHostsNum) * 0.15)
      statisticsInfo.reserveHostsNum = reserveHostsNum
      // statisticsInfo.afterRemainderHostsNum = moveResult.length - afterFreeHostsNum - reserveHostsNum -afterFullHostsNum + beforeFullHostsNum
      //电费/每小时=休眠服务器数 * 功率 * 每度电费 * PUE
      let money = Math.round((beforeFreeHostsNum + afterFreeHostsNum - reserveHostsNum) * 0.2 * 24 * 30 * 0.8 * 1.2)
      statisticsInfo.money = money
      statisticsInfo.beforeAvgCpuUtil = Math.round((beforeTotalCpuUtil / moveResult.length ) * 100) /100
      statisticsInfo.afterAvgCpuUtil = Math.round((afterTotalCpuUtil / afterHostsNum ) * 100) /100
      statisticsInfo.beforeAvgCpuUnallocRatio = Math.round((beforeTotalFreeCpus / beforeTotalCPUs) * 100)
      statisticsInfo.afterAvgCpuUnallocRatio = Math.round((afterTotalFreeCpus / afterTotalCPUs) * 100)
      statisticsInfo.beforeHostAllocRatio = Math.round(((allHosts.length - beforeFreeHostsNum )/ allHosts.length) * 100)
      statisticsInfo.afterHostAllocRatio = Math.round(((allHosts.length - beforeFreeHostsNum - afterFreeHostsNum - reserveHostsNum)/ (allHosts.length - beforeFreeHostsNum - afterFreeHostsNum )) * 100)
      this.statisticsInfo = statisticsInfo
      console.log("统计结果：{}", statisticsInfo)
    },
    mounted() {
      this.drawHostPie()
      this.drawHostBar()
    },
    methods: {
        drawHostPie() {
            var myChart = this.$echarts.init(document.getElementById('hostPie'));
            myChart.setOption({
                title: {
                    text: '迁移前后主机数据对比',
                    // subtext: '迁移前',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                        dataView: {},
                    }
                },
                legend: {
                    orient: 'horizontal',
                    top: '10%',
                    data: ['空闲主机', '满载主机', '可迁移主机','剩余主机','预留主机']
                },
                series: [
                    {
                        name: '迁移前主机',
                        type: 'pie',
                        radius: '55%',
                        center: ['20%', '60%'],
                        label:{
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine :{show:true},
                        data: [
                            {value: this.statisticsInfo.toMoveHostsNum, name: '可迁移主机'},
                            {value: this.statisticsInfo.beforeFreeHostsNum, name: '空闲主机'},
                            {value: this.statisticsInfo.beforeFullHostsNum, name: '满载主机'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    {
                        name: '可迁移主机迁移后',
                        type: 'pie',
                        radius: '30%',
                        center: ['50%', '70%'],
                        label:{
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        data: [
                            {value: this.statisticsInfo.afterFreeHostsNum, name: '空闲主机'},
                            {value: this.statisticsInfo.afterFullHostsNum, name: '满载主机'},
                            {value: this.statisticsInfo.toMoveHostsNum - this.statisticsInfo.afterFreeHostsNum - this.statisticsInfo.afterFullHostsNum, name: '剩余主机'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    {
                        name: '迁移后主机',
                        type: 'pie',
                        radius: '50%',
                        center: ['80%', '60%'],
                        label:{
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        data: [
                            {value: this.statisticsInfo.beforeFreeHostsNum + this.statisticsInfo.afterFreeHostsNum - this.statisticsInfo.reserveHostsNum, name: '空闲主机'},
                            {value: this.statisticsInfo.beforeFullHostsNum + this.statisticsInfo.afterFullHostsNum, name: '满载主机'},
                            {value: this.statisticsInfo.reserveHostsNum, name: '预留主机'},
                            {value: this.statisticsInfo.toMoveHostsNum - this.statisticsInfo.afterFreeHostsNum - this.statisticsInfo.afterFullHostsNum, name: '剩余主机'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        },
        drawHostBar() {
            var myChart = this.$echarts.init(document.getElementById('hostBar'));
            myChart.setOption({
                title: {
                    text: '迁移前后CPU碎片率、利用率及主机分配率对比',
                    // subtext: '迁移前',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                        dataView: {},
                    }
                },
                legend: {
                    top: '10%',
                },
                dataset: {
                    source: [
                        ['product', '迁移前', '迁移后'],
                        ['CPU碎片率', this.statisticsInfo.beforeAvgCpuUnallocRatio,  this.statisticsInfo.afterAvgCpuUnallocRatio],
                        ['CPU利用率', this.statisticsInfo.beforeAvgCpuUtil, this.statisticsInfo.afterAvgCpuUtil],
                        ['主机分配率', this.statisticsInfo.beforeHostAllocRatio, this.statisticsInfo.afterHostAllocRatio]
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                    },
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                    }
                ]
            });
        }
    }
  }
</script>