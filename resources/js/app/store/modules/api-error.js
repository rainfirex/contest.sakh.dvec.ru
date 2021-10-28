export default {
    state: {
        error: {
            title: null,
            text: null
        }
    },
    getters: {
        getError(state) {
            return state.error;
        }
    },
    mutations: {
        setError: (state, error) => {
            state.error = { title: error.response.statusText, text: error.response.data.message };
        },
        setErrorTitleAndText: (state, {title, text}) => {
            state.error.title = title;
            state.error.text = text;
        }
    },
    actions: {
        setError: (context, error) => {
            context.commit('setError', error);
        },
        setErrorTitleAndText: (context, data) => {
            context.commit('setErrorTitleAndText', data);
        }
    }
}
