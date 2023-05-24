import { setToken, setUser, getToken, getUser, logOut } from '@/utils/auth';
import usersApi from "@/api/usersApi"; //引入接口
import { Message } from 'element-ui';
import router from '@/router/index';
export default {
    /*
        需求：把用户登录状态(token/uid/username)存储到vuex，用的时候直接调用即可
            * token/uid/username：存(登录的时候:ajax)
            * token/uid/username：取(显示用户名username；修改密码：username和uid;路由守卫：token)
            * token/uid/username：删(退出的时候)
    */
    //状态库
    state: {
        //功能：进入页面马上获取用户信息，防止刷新丢失数据
        token: getToken(),//获取token值，调用:this.$store.state.user.token
        uid: getUser() ? JSON.parse(getUser()).uid : '',
        username: getUser() ? JSON.parse(getUser()).username : ''
    },

    mutations: {
        //功能：设置本地state
        update(state) {//mutations里面方法的第一个形参默认就是state对象:调用的时候，系统会自动转入该对象
            state.token = getToken();//获取token值，调用:this.$store.state.user.token
            state.uid = getUser() ? JSON.parse(getUser()).uid : '';
            state.username = getUser() ? JSON.parse(getUser()).username : '';
        },

        //功能：清除本地state
        logsout(state) {
            state.token = '';//获取token值，调用:this.$store.state.user.token
            state.uid = '';
            state.username = '';
        }
    },

    actions: {
        //功能：登录功能
        login(context, { username, password, keep }) {
            return new Promise((resolve, reject) => {
                usersApi.login(username, password).then(res => {
                    //成功回调
                    if (res.data.flag) {
                        let userinf = {
                            username,
                            uid: res.data.uid
                        };
                        if (keep) {
                            //保留7天   
                            setToken(res.data.token, 7);
                            setUser(JSON.stringify(userinf), 7);
                        } else {
                            //存成会话级别:关掉浏览器就删除
                            setToken(res.data.token);
                            setUser(JSON.stringify(userinf));
                        }

                        Message({
                            message: "登陆成功",
                            type: "success"
                        });
                        //跳转到首页
                        router.push("/");

                        //更新state数据：所有使用的地方都被更新
                        context.commit('update');
                    } else {
                        //登陆失败
                        Message({
                            message: "登陆失败",
                            type: "error"
                        });
                    }
                    resolve(res);
                }).catch(err => {
                    //出错了
                    reject(err);
                })
            })

        },

        //功能：退出功能
        logOuts({ commit }) {
            logOut(); //删除本地cookie的数据
            Message({
                message: "退出成功",
                type: "success",
                duration: 2000
            });

            //跳转到登陆页
            router.push("/login");

            //清空本地状态
            commit('logsout');
        },

        //功能：验证token
        verify({ conmit }, token) {
            return new Promise((resolve, reject) => {
                usersApi.checkToken(token).then(res => {
                    resolve(res);
                }).catch(err => {
                    //请求失败
                    reject(err);
                })
            })
        }
    }
}