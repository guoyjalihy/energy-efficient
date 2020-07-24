import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {

    //这里放全局参数

    allHostInfo:[],
    allVms: [],
    hostVM: [],
    todoHostVms: [],
    todoVms: []
  },

  mutations: {
    //这里是set方法
    setAllHostInfo(state,allHostInfo){
      state.allHostInfo = allHostInfo
    },
    setAllVms(state,allVms){
      state.allVms = allVms
    },
    setHostVM(state,hostVM){
      state.hostVM = hostVM
    },
    setTodoHostVms(state,todoHostVms){
      state.todoHostVms = todoHostVms
    },
    setTodoVms(state,todoVms){
      state.todoVms = todoVms
    },

  },

  getters: {

    //get方法
    getAllHostInfo: state => state.allHostInfo,
    getAllVms: state => state.allVms,
    getHostVM: state => state.hostVM,
    getTodoHostVms: state => state.todoHostVms,
    getTodoVms: state => state.todoVms

  },

  actions: {

    //这个部分我暂时用不上

  },

  modules: {

//这里是我自己理解的是为了给全局变量分组，所以需要写提前声明其他store文件，然后引入这里

  }

})