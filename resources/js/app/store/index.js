import Vue from 'vue';
import Vuex from 'vuex';
import user from "./modules/user";
import loaderBar from "./modules/loader-bar";
import editorQuestion from "./modules/editor-question";
import editorAnswer from "./modules/editor-answer";
import apiError from "./modules/api-error";
import testMain from "./modules/testMain";
import users from "./modules/users";
import groupOperation from "./modules/group-operator";
import resultTest from "./modules/result-test";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        loaderBar,
        editorQuestion,
        editorAnswer,
        apiError,
        testMain,
        users,
        groupOperation,
        resultTest
    }
});
export default store;
