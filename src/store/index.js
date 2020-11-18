import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {

    //这里放全局参数
    allHosts: [],
    allVms: [],
    allVNFs: [],
    vnfAndVmIds: {},
    allHAs: [],
    currentVNF: "",
    toMoveHosts: [],
    hostMoveResult: [],
    vmMoveResult: [],
    statisticsInfo: {},
  },

  mutations: {
    //这里是set方法
    setAllHosts(state, allHosts) {
      state.allHosts = allHosts
    },
    setAllVms(state, allVms) {
      state.allVms = allVms
    },
    setAllVNFs(state, allVNFs) {
      state.allVNFs = allVNFs
    },
    setVNFAndVmIds(state, vnfAndVmIds) {
      state.vnfAndVmIds = vnfAndVmIds
    },
    setCurrentVNF(state, currentVNF) {
      state.currentVNF = currentVNF
    },
    setAllHAs(state, allHAs) {
      state.allHAs = allHAs
    },
    setToMoveHosts(state, toMoveHosts) {
      state.toMoveHosts = toMoveHosts
    },
    setHostMoveResult(state, hostMoveResult) {
      state.hostMoveResult = hostMoveResult
    },
    setVmMoveResult(state, vmMoveResult) {
      state.vmMoveResult = vmMoveResult
    },
    setStatisticsInfo(state, statisticsInfo) {
      state.statisticsInfo = statisticsInfo
    },
  },

  getters: {

    //get方法
    getAllHosts: state => state.allHosts,
    getAllVms: state => state.allVms,
    getAllVNFs: state => state.allVNFs,
    getVNFAndVmIds: state => state.vnfAndVmIds,
    getCurrentVNF: state => state.currentVNF,
    getAllHAs: state => state.allHAs,
    getToMoveHosts: state => state.toMoveHosts,
    getHostMoveResult: state => state.hostMoveResult,
    getVmMoveResult: state => state.vmMoveResult,
    getStatisticsInfo: state => state.statisticsInfo,
  },

  actions: {

    //这个部分我暂时用不上

  },

  modules: {

    //这里是我自己理解的是为了给全局变量分组，所以需要写提前声明其他store文件，然后引入这里

  }

})
