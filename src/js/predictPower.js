import axios from 'axios'
axios.defaults.baseURL = '/api'

export async function predictPower(hosts) {
    let hostNameAndHost = {}
    for(let i=0,len=hosts.length;i<len;i++){
        let host = hosts[i]
        hostNameAndHost[host.hostName] = host
    }

    let ids = []
    let num_vm = []
    let cpu_total = []
    let mem_total = []
    let mem_used = []
    let cpu_used = []

    for(let i=0,len=hosts.length;i<len;i++){
        let host = hosts[i]
        ids.push(host.hostName)
        num_vm.push(host.vmIdList.length)
        cpu_total.push(host.cputotal)
        mem_total.push(host.ramtotal)
        mem_used.push(host.mem_used)
        cpu_used.push(host.cpu_used)
    }
    let params = {}
    params.id = ids
    params.num_vm = num_vm
    params.cpu_total = cpu_total
    params.mem_total = mem_total
    params.mem_used = mem_used
    params.cpu_used = cpu_used
    const url = '/api/powercons_predict'
    //params = {"id": [1, 2], "num_vm": [3, 5], "cpu_total": [48, 48], "mem_total": [384, 384], "mem_used": [36.526396484375, 65.364794921875], "cpu_used": [2.45, 0.09]}
    return await axios.post(url,params)
        .then(response => {
            let result = eval(response.data)
            console.log("powercons_predict size:{}",result.length);
            for (let i=0,len=result.length;i<len;i++){
                let data = result[i]
                hostNameAndHost[data.id].power = data.predict_value
            }
            return hosts
        })
        .catch(function (error) {
            console.log(error);
        })
}
