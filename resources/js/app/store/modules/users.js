export default {
    state: {
        users: [],
        userGroups: []
    },
    getters: {
        getUsers: (state) => {
            return state.users;
        },
        getUserGroups: (state) => {
            return state.userGroups;
        }
    },
    mutations: {
        setUsers: (state, users) => {
            state.users = users;
        },
        setUserGroups: (state, userGroups) => {
            state.userGroups = userGroups;
        },
        addUserGroup: (state, group) => {
            state.userGroups.unshift(group);
        }
    },
    actions: {
        users: async (context) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/users`)
                .then(resp => {
                    context.commit('setUsers', resp.data.users);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Обновить права доступа
         * @param context
         * @param user
         * @returns {Promise<void>}
         */
        updateUser: async (context, user) => {
            context.dispatch('setLoaderBar', true);
            const frmData = new FormData();
            frmData.append('is_admin', user.is_admin);
            frmData.append('is_handler', user.is_handler);
            frmData.append("_method", "PUT");

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/users/${ user.id }`, frmData)
                .then(resp => {

                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Добавить группу в пользователя
         * @param context
         * @param userId
         * @param groupId
         */
        addUserGroup: (context, {userId, groupId}) => {
            context.dispatch('setLoaderBar', true);
            axios.post(`/api/users/${ userId }/add-group/${ groupId }`)
                .then(response => {
                    if(response.data.success){
                        context.commit('addUserGroup', response.data.userGroup);
                    }
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Получить группы пользователя
         * @param context
         * @param userId
         */
        userGroups: (context, userId) => {
            context.dispatch('setLoaderBar', true);
            axios.get(`/api/users/${ userId }/groups`)
                .then(response => {
                    context.commit('setUserGroups', response.data.userGroups);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Удалить группу у пользователя
         * @param context
         * @param pivotId
         * @param index
         */
        destroyUserGroup: (context, {pivotId, index}) => {
            context.dispatch('setLoaderBar', true);
            axios.delete(`/api/users/groups/${ pivotId }`)
                .then(response => {
                    if (response.data.success) {
                        const userGroups = context.getters.getUserGroups;
                        userGroups.splice(index, 1);
                    }
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        }
    }
}
