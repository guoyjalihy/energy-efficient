<template>
  <div class="step6">
    <MoveResultTable :data="tableData"/>
    <span style="font-size: 18px">迁移前总功耗：{{allPowerBefore}} KW</span>
    <span style="float:right;font-size: 18px">迁移后总功耗：{{allPower}} KW</span>
  </div>
</template>
<script>
  import MoveResultTable from "../components/MoveResultTable";
  // import {predictPower} from "../js/predictPower.js";

  export default {
    components: {MoveResultTable},
    data () {
      return {
        allPowerBefore: this.$store.getters.getAllPowerBefore,
        allPower: this.$store.getters.getAllPowerAfter,
        tableData : []
      }
    },
    created() {
      //获取待迁移主机列表，等价于可下电主机列表（注意保留5%的额外资源，计算原则为服务器总数的5%）
      let moveResultHost = this.$store.getters.getMoveResult
      let allowedPowerOffHost = []
      for(let i=0,len=moveResultHost.length;i<len;i++){
        let host = moveResultHost[i]
        if (host.after_total_free_cpu == host.total_cpu){
          allowedPowerOffHost.push(host)
        }
      }

      let reserveNum = Math.ceil(this.$store.getters.getAllHostInfo.length * 0.05)
      this.tableData = allowedPowerOffHost.slice(0,allowedPowerOffHost.length-reserveNum)
    },
    methods: {

    }
  }
</script>