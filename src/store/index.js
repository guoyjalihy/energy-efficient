import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {

    //这里放全局参数

    allHosts:[],
    allVms: [],
    toMoveHosts: [],
    moveResult: [],
    statisticsInfo: {},
  },

  mutations: {
    //这里是set方法
    setAllHosts(state,allHosts){
      state.allHosts = allHosts
    },
    setAllVms(state,allVms){
      state.allVms = allVms
    },
    setToMoveHosts(state,toMoveHosts){
      state.toMoveHosts = toMoveHosts
    },
    setMoveResult(state,moveResult){
      state.moveResult = moveResult
    },
    setStatisticsInfo(state,statisticsInfo){
      state.statisticsInfo = statisticsInfo
    },
  },

  getters: {

    //get方法
    getAllHosts: state => state.allHosts,
    getAllVms: state => state.allVms,
    getToMoveHosts: state => state.toMoveHosts,
    getMoveResult: state => state.moveResult,
    getStatisticsInfo: state => state.statisticsInfo,
  },

  actions: {

    //这个部分我暂时用不上

  },

  modules: {

//这里是我自己理解的是为了给全局变量分组，所以需要写提前声明其他store文件，然后引入这里

  }

})
