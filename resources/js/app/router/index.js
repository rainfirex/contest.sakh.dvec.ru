import VueRouter from 'vue-router';
import Home from "../components/Home/Home";
import Auth from "../components/Auth/Auth";
import NotFound from "../components/NotFound/NotFound";
import Admin from "../components/Admin/Admin";
import Question from "../components/Admin/Question/Question";
import Answer from "../components/Admin/Answer/Answer";
import About from "../components/About/About";
import MainTest from "../components/Home/Test/MainTest/MainTest";
import OtherTest from "../components/Home/Test/OtherTest/OtherTest";
import ResultMainTest from "../components/Home/Test/ResultMainTest/ResultMainTest";
import Results from "../components/Home/Test/Results/Results";
import Users from "../components/Admin/Users/Users";
import Result from "../components/Admin/Result/Result";
import GroupOperator from "../components/Admin/GroupOperator/GroupOperator";

export default new VueRouter({
    routes: [
        {
            path: '/', component: Home, name: 'home', children:[
                {
                    path: 'main-test', component: MainTest, name: 'main-test'
                },
                {
                    path: 'other-test', component: OtherTest, name: 'other-test'
                },
                {
                    path: 'result-test/user/:userId/main-test/:testId', component: ResultMainTest, name: 'result-test'
                },
                {
                    path: 'results', component: Results, name: 'results'
                }
            ]
        },
        {
            path: '/auth', component: Auth, name: 'auth'
        },
        {
            path: '/admin', component: Admin, name: 'admin', children: [
                {
                    path: 'question', component: Question, name: 'question'
                },
                {
                    path: 'answer/:id', component: Answer, name: 'answer'
                },
                {
                    path: 'test-result', component: Result, name: 'test-result'
                },
                {
                    path: 'users', component: Users, name: 'users'
                },
                {
                    path: 'groups', component: GroupOperator, name: 'groups'
                }
            ]
        },
        {
            path: '/about', component: About, name: 'about'
        },
        {
            path: '*', component: NotFound, name: 'not-found', meta: {
                requestAuth: false
            }
        }
    ], mode: 'history'
});
