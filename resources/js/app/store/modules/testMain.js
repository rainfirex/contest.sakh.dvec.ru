export default {
    state: {
        test: [],
        currentTest: {},
        resultsMainTest: [],
        resultTest: null
    },
    getters: {
        getTests:           (state) => state.test,
        getCurrentTest:     (state) => state.currentTest,
        getResultsMainTest: (state) => state.resultsMainTest,
        getResultTest:      (state) => state.resultTest
    },
    mutations: {
        setTests:       (state, test)       => state.test = test,
        setCurrentTest: (state, test)       => state.currentTest = test,
        addResultMainTest: (state, result)  => state.resultsMainTest.unshift(result),
        setResultMainTest: (state, results) => state.resultsMainTest = results,
        setResultTest: (state, resultTest)  => state.resultTest = resultTest,
        removeResultInStorage: (state, index) => state.resultsMainTest.splice(index, 1)
    },
    actions: {
        setResultMainTest: (context, results) => {
            context.commit('setResultMainTest', results);
        },
        addResultMainTest(context, result){
            context.commit('addResultMainTest', result);
        },
        /**
         * Установить текущий тест
         * @param context
         * @param testId
         */
        selectTestById(context, testId){
            const testIndex = context.getters.getTests.findIndex((test, index) => {
                return +test.id === +testId;
            });
            if (testIndex !== -1) {
                const test = context.getters.getTests[testIndex];
                context.commit('setCurrentTest', test);
            }
        },
        /**
         * Получить тесты с вопросами
         * @param context
         * @returns {Promise<void>}
         */
        tests: async (context) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/main-test`)
                .then(resp => {
                    context.commit('setTests', resp.data.categories);
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Сохранить в базу
         * @param context
         * @param user_id
         * @param jsonTest
         * @param result
         * @returns {Promise<void>}
         */
        storeResultTest: async (context, { user_id, category_id, jsonTest, result }) => {

            const shortResult = {
                'date' : result.date,
                'fails': result.fails,
                'success'  : result.success,
                'timeStart': result.timeStart,
                'timeStop' : result.timeStop,
                'timeInterval': result.timeInterval,
                'result' : result.result,
                'timeout': result.timeout,
                'stoped' : result.stoped
            };

            const frmData = new FormData();
            frmData.append('user_id', user_id);
            frmData.append('category_id', category_id);
            frmData.append('jsonTest', jsonTest);
            frmData.append('result', JSON.stringify(shortResult));
            await axios.post(`/api/main-test`, frmData)
                .then(resp => {
                    if(resp.data.success){
                        result.testId = resp.data.testId;
                        context.commit('addResultMainTest', result);
                        const jsString = JSON.stringify(context.getters.getResultsMainTest);
                        localStorage.setItem("test-result", jsString);
                    }
                })
                .catch(error => context.commit('setError', error))
                .finally(() => context.dispatch('setLoaderBar', false));
        },
        /**
         * Получить резутьсята
         * @param context
         * @param userId
         * @param testId
         */
        getTestResult(context, testId){
            context.dispatch('setLoaderBar', true);
            axios.get(`/api/main-test/result/test-id/${ testId }`)
                .then(resp => {
                    const data = resp.data.testResult;
                    context.commit('setResultTest', JSON.parse(data.jsonTest));
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Удалить результат из хранилища браузера
         * @param commit
         * @param index
         */
        removeResultInStorage: ({ commit, getters }, index) => {
            commit('removeResultInStorage', index);
            const jsString = JSON.stringify(getters.getResultsMainTest);
            localStorage.setItem("test-result", jsString);
        }
    }
}
