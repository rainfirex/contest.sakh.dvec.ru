export default {
    state: {
        operatorGroups: [],
        currentOperatorGroup: {},
        currentIndex: null
    },
    getters: {
        getOperatorGroups: (state) => {
            return state.operatorGroups;
        },
        getCurrentOperatorGroup: (state) => {
            return state.currentOperatorGroup;
        },
        getCurrentIndex: (state) => {
            return state.currentIndex;
        }
    },
    mutations: {
        setOperatorGroups: (state, operatorGroups) => {
            state.operatorGroups = operatorGroups;
        },
        setCurrentOperatorGroup: (state, currentOperatorGroup) => {
            state.currentOperatorGroup = currentOperatorGroup;
        },
        addOperatorGroup: (state, operation) => {
            state.operatorGroups.unshift(operation);
        },
        setCurrentIndex: (state, index) => {
            state.currentIndex = index;
        }
    },
    actions: {
        setCurrentIndex: ({commit}, index) => {
            commit('setCurrentIndex', index);
        },
        /**
         * Получить группы
         * @param context
         * @returns {Promise<void>}
         */
        getOperationGroups: async (context) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/operation-group`)
                .then(response => {
                    context.commit('setOperatorGroups', response.data.operations);
                    context.commit('setCurrentIndex', null);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Создать группу
         * @param context
         * @param title
         * @param description
         * @returns {Promise<void>}
         */
        createOperationGroup: async (context, { title, description}) => {
            const frmData = new FormData();
            frmData.append('title', title);
            frmData.append('description', description);

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/operation-group/create`, frmData)
                .then(response => {
                    context.commit('addOperatorGroup', response.data.operation);
                    context.commit('setCurrentIndex', null);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false))
        },
        /**
         * Удалить группу
         * @param context
         * @param id
         * @param index
         * @returns {Promise<void>}
         */
        destroyOperationGroup: async (context, { id, index}) => {
            context.dispatch('setLoaderBar', true);
            await axios.delete(`/api/operation-group/remove/${ id }`)
                .then(response => {
                    if (response.data.success){
                        const operations = context.getters.getOperatorGroups;
                        operations.splice(index, 1);
                        context.commit('setCurrentIndex', null);
                    }
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         *
         * @param context
         * @returns {Promise<void>}
         */
        updateOperationGroup: async (context, {id, title, description}) => {
            const frmData = new FormData();
            frmData.append('title', title);
            frmData.append('description', description);
            frmData.append("_method", "PUT");

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/operation-group/${ id }`, frmData)
                .then(response => {
                    if(response.data.success) {
                        const groups = context.getters.getOperatorGroups;
                        const currGroup = groups.find(g => g.id === id);
                        currGroup.title = title;
                        currGroup.description = description;
                        context.commit('setCurrentIndex', null);
                    }
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false))
        }
    }
}
