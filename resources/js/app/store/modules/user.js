import User from "../../assets/js/User";

export default {
    state: {
        user: {
            auth: false,
            id: null,
            api_token: null,
            name: null,
            email: null,
            phone: null,
            mobile: null,
            department: null,
            title: null,
            is_handler: null,
            is_admin: null,
            othertelephone: null,
            created_at: null,
            updated_at: null,
            user_agent: null
        }
    },
    getters: {
        getUser: state => {
            return state.user;
        }
    },
    mutations: {
        setUser: (state, user) => {
            state.user = user;
        }
    },
    actions: {
        auth: async (context, data) => {
            const frmData = new FormData();
            frmData.append('login', data.login);
            frmData.append('password', data.password);

            context.dispatch('setLoaderBar', true);

            await axios.post(`/api/auth`, frmData)
                .then(response => {
                    if (response.data.success) {
                        User.save(response.data.user);
                        const user = User.load();
                        context.commit('setUser', user);
                    } else {
                        const data = {title: "Отказано в доступе", text: response.data.message};
                        context.commit('setErrorTitleAndText', data);
                    }
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        loadUser(context, user) {
            context.commit('setUser', user);
        },
        logout: async (context) => {
            context.dispatch('setLoaderBar', true);
            await axios.put(`/api/logout`)
                .then(resp => {
                    if (resp.data.success) {
                        context.commit('setUser', {
                            auth: false,
                            id: null,
                            api_token: null,
                            name: null,
                            email: null,
                            phone: null,
                            mobile: null,
                            department: null,
                            title: null,
                            is_handler: null,
                            is_admin: null,
                            othertelephone: null,
                            created_at: null,
                            updated_at: null,
                            user_agent: null
                        });
                        User.remove();
                    }
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                })
        },
        verification: async (context) => {
            await axios.get(`/api/auth-user`)
                .then(response => {
                    User.save(response.data.user);
                    const user = User.load();
                    context.commit('setUser', user);
                })
                .catch(error => {
                    context.commit('setUser', {
                        auth: false,
                        id: null,
                        api_token: null,
                        name: null,
                        email: null,
                        phone: null,
                        mobile: null,
                        department: null,
                        title: null,
                        is_handler: null,
                        is_admin: null,
                        othertelephone: null,
                        created_at: null,
                        updated_at: null,
                        user_agent: null
                    });
                    User.remove();
                });
        }
    }
}
