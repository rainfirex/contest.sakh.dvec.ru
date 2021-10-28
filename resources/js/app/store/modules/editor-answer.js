export default {
    state: {
        question: {},
        answers: [],
        newAnswer: {
            title: null,
            score: 0,
            number: 1,
        }
    },
    getters: {
        getQuestion: (state) => state.question,
        getAnswers: (state) => state.answers,
        getNewAnswer: (state) => state.newAnswer
    },
    mutations: {
        setQuestion: (state, question) => {
            state.question = question;
        },
        setAnswers: (state, answers) => {
            state.answers = answers;
        },
        addAnswer: (state, answer) => {
            state.answers.unshift(answer);
        },
        setNewAnswer: (state, newAnswer) => {
            state.newAnswer = newAnswer;
        }
    },
    actions: {
        /**
         * Получить вопрос и ответы
         * @param context
         * @param questionId
         * @returns {Promise<void>}
         */
        getQuestionAndAnswers: async (context, questionId) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/questions/get/${ questionId }`)
                .then(response => {
                    context.commit('setQuestion', response.data.question);
                    context.commit('setAnswers', response.data.answers);
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Создать ответ
         * @param context
         * @param questionId
         * @returns {Promise<void>}
         */
        createAnswer: async (context, questionId) => {
            let newAnswer = context.getters.getNewAnswer;

            const frmData = new FormData();
            frmData.append('questionId', questionId);
            frmData.append('number', newAnswer.number);
            frmData.append('title', newAnswer.title);
            frmData.append('score', newAnswer.score);

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/answers/create`, frmData)
                .then(response => {
                    let n = parseInt(newAnswer.number) + 1;
                    context.commit('addAnswer', response.data.answer);
                    context.commit('setNewAnswer', {title: null, score: 0, number: n});
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Установить знач. для создание нового ответа
         * @param commit
         * @param newAnswer
         */
        setNewAnswer: ({commit}, newAnswer) => {
            commit('setNewAnswer', newAnswer);
        },
        /**
         * Удалить ответ
         * @param context
         * @param id
         * @param index
         * @returns {Promise<void>}
         */
        destroyAnswer: async (context, { id, index }) => {
            context.dispatch('setLoaderBar', true);
            await axios.delete(`/api/answers/remove/${ id }`)
                .then(response => {
                    if (response.data.success) {
                        const answers = context.getters.getAnswers;
                        answers.splice(index, 1);
                    }
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /***/
        updateAnswer: async (context, answer) => {
            const frmData = new FormData();
            frmData.append('id', answer.id);
            frmData.append('number', answer.number);
            frmData.append('title', answer.title);
            frmData.append('score', answer.score);
            frmData.append("_method", "PUT");

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/answers/update`, frmData)
                .then(response => {
                    if(response.data.success) {
                        const answers = context.getters.getAnswers;
                        const currAnswer = answers.find(a => a.id === answer.id);
                        currAnswer.number = answer.number;
                        currAnswer.title = answer.title;
                        currAnswer.score = answer.score;
                    }
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        }
    }
}
