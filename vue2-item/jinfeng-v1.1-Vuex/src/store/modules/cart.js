export default {
    /*
        * state：购物车数据
        * getters : 总数量、总价格
        * mutations: 增删改查
        * actions:ajax请求(增删改查)
    */
    state: {//[{},{}]
        cartList: []
    },

    mutations: {
        //功能：初始化
        init(state, data) {
            state.cartList = data;
        },

        //功能:删除state的一条数据
        del(state, gid) {
            // state.cartList.splice(index, 1);
            state.cartList = state.cartList.filter(item => item.gid != gid);
        }
    },

    actions: {
        //功能：获取购物车数据:在App.vue 里面获取(created(){})
        getList({ commit }) {
            cartApi.getList(uid).then(res => {
                commit.init(res.data);
            })
        },

        //功能：删除一个商品
        delGood({ commit }, { uid, gid }) {
            cartApi.delItem(uid, gid).then(res => {//删除数据库的数据
                if (res.data.flag) {
                    //删除成功
                    //弹窗
                    commit('del', gid)
                }
            })
        },

        //功能：新增，加入购物车
        addGood({ commit },{uid, gid}) {

        },

        //功能：删除多条商品(清空购物车)
        removeAll() {

        },

        //功能:修改数量
        editNum() {
            
        }
    }
}