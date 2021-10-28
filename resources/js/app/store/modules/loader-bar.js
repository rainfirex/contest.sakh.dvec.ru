export default {
    state: {
        loaderBar: false,
    },
    getters: {
        getLoaderBar(state){
            return state.loaderBar;
        }
    },
    mutations: {
        setLoaderBar(state, isVisible) {
            if (isVisible === true) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }

            state.loaderBar = isVisible
        },
    },
    actions: {
        setLoaderBar({ commit }, isVisible) {
            commit('setLoaderBar', isVisible)
        },
    }
}
