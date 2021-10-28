export default {
    state: {
        testUsers: [],
        tests: [],
        testCurrentUser: {},
        currentTests: [],
        testCurrentTest: {},
        testResults: [],
        testInterval: []
    },
    getters: {
        getTestUsers: (state) => state.testUsers,
        getTestCurrentUser: (state) => state.testCurrentUser,
        getCurrentTests: (state) => state.currentTests,
        getTestResults: (state) => state.testResults,
        getTestInterval: (state) => state.testInterval//.sort((a, b) => parseInt(a.result.success) > parseInt(b.result.success))
    },
    mutations: {
        setTestUsers: (state, users) => state.testUsers = users,
        setTestCurrentUser: (state, user) => state.testCurrentUser = user,
        setCurrentTests: (state, tests) => state.currentTests = tests,
        setTestCurrentTest: (state, test) => state.testCurrentTest = test,
        setTestResults: (state, result) => state.testResults = result,
        setTestInterval: (state, tests) => state.testInterval = tests
    },
    actions: {
        /**
         * Пользователи которые проходили тестирование
         * @param context
         * @returns {Promise<void>}
         */
        getUsersTest: async (context) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/results/users`)
                .then(response => {
                    context.commit('setTestUsers', response.data.users);
                })
                .catch(error => context.commit('setError', error))
                .finally(() =>  context.dispatch('setLoaderBar', false));
        },
        /**
         * Установить выбранного пользователя
         * @param commit
         * @param getters
         * @param userId
         */
        setCurrentUserById: ({commit, getters, dispatch}, userId) => {
            const users = getters.getTestUsers;
            const item = users.find(item => item.user.id === parseInt(userId));
            commit('setTestCurrentUser', item.user);
            commit('setTestResults', []);
            dispatch('getCurrentUserTest', userId);
        },
        /**
         * Тесты выбраного пользователя
         * @param context
         * @param userId
         * @returns {Promise<void>}
         */
        getCurrentUserTest: async (context, userId) => {
            context.commit('setCurrentTests', null);
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/results/users/${ userId }/tests`)
                .then(response => {
                    context.commit('setCurrentTests', response.data.tests);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Установить выбранный тест
         * @param commit
         * @param getters
         * @param dispatch
         * @param testId
         */
        setCurrentTestById: ({commit, getters, dispatch}, testId)=> {
            const tests = getters.getCurrentTests;
            const item = tests.find(item => item.test.id === parseInt(testId));
            commit('setTestCurrentTest', item.test);
            commit('setTestResults', []);
            dispatch('getCurrentTestResult', testId);
        },
        /**
         * Установить массивы с результатами
         * @param context
         * @param testId
         * @returns {Promise<void>}
         */
        getCurrentTestResult: async (context, testId) => {
            const currUser = context.getters.getTestCurrentUser;
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/results/users/${ currUser.id }/tests/${ testId }`)
                .then(response => {
                    context.commit('setTestResults', response.data.results);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Получить тесты по интервалу
         * @param context
         * @param dateStart
         * @param dateEnd
         * @returns {Promise<void>}
         */
        getTestInterval: async (context, { dateStart, dateEnd }) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/results/interval/${ dateStart }/${ dateEnd }`)
                .then(response => {
                    // this.results = response.data.results;
                    context.commit('setTestInterval', response.data.results);
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false))
        }
    }
}
