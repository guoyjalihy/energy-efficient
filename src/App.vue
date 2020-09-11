<template>
    <div>
        <div>
            <p>当前正在进行第 {{ current + 1 }} 步</p>
            <Steps :current="current">
                <Step title="全部主机规格信息解析"></Step>
                <Step title="已部署虚拟机列表解析"></Step>
                <Step title="虚拟机与主机对应关系"></Step>
                <Step title="可迁移主机列表"></Step>
                <Step title="迁移方案产出"></Step>
                <Step title="可下电主机列表"></Step>
                <Step title="报表统计"></Step>
            </Steps>
            <router-link to="" @click.native="back">上一步</router-link> |
            <router-link to="" @click.native="next">下一步</router-link>
        </div>
        <router-view/>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                current: 0
            }
        },
        methods: {
            next () {
                if (this.current == 6) {
                    this.current = 0;
                } else {
                    this.current += 1;
                }
                if (this.current == 0){
                    this.$router.push("/step1")
                }else if(this.current == 1){
                    this.$router.push("/step2")
                }else if(this.current == 2){
                    this.$router.push("/step3")
                }else if(this.current == 3){
                    this.$router.push("/step4")
                }else if(this.current == 4){
                    this.$router.push("/step5")
                }else if(this.current == 5){
                    this.$router.push("/step6")
                }else if(this.current == 6){
                    this.$router.push("/step7")
                }
            },
            back () {
                if (this.current == 0) {
                    this.current = 6;
                } else {
                    this.current -= 1;
                }
                if (this.current == 0){
                    this.$router.push("/step1")
                }else if(this.current == 1){
                    this.$router.push("/step2")
                }else if(this.current == 2){
                    this.$router.push("/step3")
                }else if(this.current == 3){
                    this.$router.push("/step4")
                }else if(this.current == 4){
                    this.$router.push("/step5")
                }else if(this.current == 5){
                    this.$router.push("/step6")
                }else if(this.current == 6){
                    this.$router.push("/step7")
                }
            }
        }
    }
</script>
