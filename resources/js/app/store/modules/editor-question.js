export default {
    state: {
        categories: [],
        category: {
            title: null,
            timer: null,
            is_enabled: false,
            operator_group_id: null
        },
        newQuestion: {
            title: null,
            score: 1,
            number: 1,
        },
         questionUserGroups: []
    },
    getters: {
        getCategory:    (state) => state.category,
        getCategories:  (state) => state.categories,
        getNewQuestion: (state) => state.newQuestion,
        getQuestionUserGroups:  (state) => state.questionUserGroups
    },
    mutations: {
        setCategory:    (state, category)    => state.category = category,
        setCategories:  (state, categories)  => state.categories = categories,
        setQuestionUserGroups:  (state, userGroups)  => state.questionUserGroups = userGroups,
        addCategory:    (state, category)    => state.categories.unshift(category),
        setNewQuestion: (state, newQuestion) => state.newQuestion = newQuestion
    },
    actions: {
        /**
         * Установить тек. категорию
         * @param context
         * @param categoryId
         */
        setCategoryById: (context, categoryId) => {
            const categoryIndex = context.getters.getCategories.findIndex((category, index) => {
                return +category.id === +categoryId;
            });
            if (categoryIndex !== -1) {
                const category = context.getters.getCategories[categoryIndex];
                context.commit('setCategory', category);
            }
        },
        /**
         * Получить категории
         * @param context
         * @returns {Promise<void>}
         */
        categories: async (context) => {
            context.dispatch('setLoaderBar', true);
            await axios.get(`/api/categories`)
                .then(response => {
                    context.commit('setCategories', response.data.categories);
                    context.commit('setQuestionUserGroups', response.data.userGroups);
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false)
                });
        },
        /**
         * Создать категорию
         * @param context
         * @param newCategory
         * @returns {Promise<void>}
         */
        createCategory: async (context, newCategory) => {
            const frmData = new FormData();
            frmData.append('title', newCategory.title);
            frmData.append('timer', newCategory.timer);
            frmData.append('is_enabled', newCategory.is_enabled);
            frmData.append('operator_group_id', newCategory.operator_group_id);

            context.dispatch('setLoaderBar', true);
            axios.post(`/api/categories/create`, frmData)
                .then(response => {
                    context.commit('addCategory', response.data.category);
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false)
                });
        },
        /**
         * Обновление категории
         * @param context
         * @param categoryId
         * @param title
         * @param timer
         * @returns {Promise<void>}
         */
        updateCategory: async (context, {categoryId, title,  timer, is_enabled, operator_group_id}) => {
            const frmData = new FormData();
            frmData.append('categoryId', categoryId);
            frmData.append('title', title);
            frmData.append('timer', timer);
            frmData.append('is_enabled', is_enabled);
            frmData.append('operator_group_id', operator_group_id);
            frmData.append("_method", "PUT");

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/categories/update`, frmData)
                .then(resp => {
                    const catUpdate = resp.data.category;

                    const category = context.getters.getCategory;
                    category.title = catUpdate.title;
                    category.timer = catUpdate.timer;
                    category.operator_group_id = catUpdate.operator_group_id;
                    category.is_enabled = catUpdate.is_enabled;
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                })
        },
        /**
         * Удалить категорию
         * @param context
         * @returns {Promise<void>}
         */
        destroyCategory: async (context) => {
            const category = context.getters.getCategory;
            if(category == null) return;

            context.dispatch('setLoaderBar', true);
            await axios.delete(`/api/categories/remove/${ category.id }`)
                .then(response => {
                    if (response.data.success) {
                        const categories = context.getters.getCategories;
                        const index = categories.findIndex(c => c.id === category.id);
                        categories.splice(index, 1);
                        context.commit('setCategory',  {title: null, timer: null});
                    }
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Установить знач. для создание нового вопроса
         * @param context
         * @param newQuestion
         */
        setNewQuestion: (context, newQuestion) => {
            context.commit('setNewQuestion', newQuestion);
        },
        /**
         * Создать вопрос
         * @param context
         * @returns {Promise<void>}
         */
        createQuestion: async (context) => {
            const category = context.getters.getCategory;
            let newQuestion = context.getters.getNewQuestion;

            const frmData = new FormData();
            frmData.append('categoryId', category.id);
            frmData.append('title', newQuestion.title);
            frmData.append('number', newQuestion.number);
            frmData.append('score', newQuestion.score);

            context.dispatch('setLoaderBar', true);
            await axios.post(`/api/questions/create`, frmData)
                .then(response => {
                    category.questions.unshift(response.data.question);
                    let n = parseInt(newQuestion.number) + 1;
                    context.commit('setNewQuestion', {title: null, score: 1, number: n});
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Удалить вопрос
         * @param context
         * @param id
         * @param index
         * @returns {Promise<void>}
         */
        destroyQuestion: async (context , {id, index}) => {
            context.dispatch('setLoaderBar', true);
            await axios.delete(`/api/questions/remove/${id}`)
                .then(response => {
                    if (response.data.success) {
                        const category = context.getters.getCategory;
                        category.questions.splice(index, 1);
                    }
                })
                .catch(error => {
                    context.commit('setError', error);
                })
                .finally(() => {
                    context.dispatch('setLoaderBar', false);
                });
        },
        /**
         * Обновить вопрос
         * @param context
         * @param question
         * @returns {Promise<void>}
         */
        updateQuestion: async (context, question) => {
            const frmData = new FormData();
            frmData.append('id', question.id);
            frmData.append('number', question.number);
            frmData.append('title', question.title);
            frmData.append('score', question.score);
            frmData.append("_method", "PUT");

            context.dispatch('setLoaderBar', true);
            axios.post(`/api/questions/update`, frmData)
                .then(response => {
                    if (response.data.success)
                    {
                        const category = context.getters.getCategory;
                        const currQuestion = category.questions.find(c => c.id === question.id);
                        currQuestion.number = question.number;
                        currQuestion.title = question.title;
                        currQuestion.score = question.score;
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
