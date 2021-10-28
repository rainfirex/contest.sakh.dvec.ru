<template>
    <div class="home">
        <header>
            <h3 class="text-center">Добро пожаловать на <router-link class="home-link" to="/">contest.sakh.dvec.ru</router-link></h3>
            <div class="user-auth p-2 mb-4">
                <div v-if="user.auth">
                    <p class="mb-0">Вы авторизовались как <span class="username">{{ user.name }}</span>&nbsp;<span class="logout" @click="$store.dispatch('logout')">Выход из приложения</span><p>
                    <p class="mb-0">{{ user.title }},&nbsp;{{ user.department }},&nbsp;{{ user.email }}&nbsp</p>
                </div>
                <p class="mb-0" v-else>Для прохождения курсов необходимо пройти
                    <router-link to="/auth"><i>авторизацию</i></router-link>
                </p>
            </div>
            <div v-if="user.auth">
                <nav class="text-center">
                    <router-link v-if="user.auth" to="/"><i>Главная</i></router-link>
                    <router-link v-if="user.auth" to="/main-test"><i>Основной тест</i></router-link>
                    <router-link v-if="user.auth" to="/results"><i>Результаты</i></router-link>
                    <router-link v-if="user.auth" to="/about"><i>О проекте</i></router-link>
                </nav>
            </div>
        </header>
        <div class="info">
            <div v-if="$route.path == '/'">
                <p class="text-center p-2">Данный портал создан для проверки знаний по разным категориям....</p>
                <div class="text-warning p-2 offset-3 col-7" v-if="user.auth && (user.is_admin || user.is_handler)">
                    <p>Вам доступны следующие разделы:</p>
                    <ul>
                        <li v-if="user.is_handler"><router-link to="/admin/question"><i>"Редактор тестов"</i></router-link></li>
                        <li v-if="user.is_handler"><router-link to="/admin/test-result"><i>"Результаты тестирования"</i></router-link></li>
                        <li v-if="user.is_admin"><router-link to="/admin/users"><i>"Управление учетными записями"</i></router-link></li>
                        <li v-if="user.is_admin"><router-link to="/admin/groups"><i>"Управление Группами"</i></router-link></li>
                    </ul>
                </div>
            </div>
            <div v-else>
                <router-view @showError="showError"/>
            </div>
        </div>
        <MessageError :error="error"/>
        <ApiError/>
    </div>
</template>
<script>
    import MessageError from "../../modules/MessageError/MessageError";
    import ApiError from "../../modules/MessageError/ApiError";
    export default {
        components: {
            MessageError,
            ApiError
        },
        computed: {
            user() {
                return this.$store.getters.getUser;
            }
        },
        data(){
            return {
                error: {
                    title: null,
                    text: null
                }
            }
        },
        methods: {
            showError({title, text}){
                if(title != null && text != null){
                    this.error = {
                        title,
                        text
                    };
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    .home {
        width: 100%;
        height: 100%;
        background: #585858;
    .home-link{
            text-decoration: none;
            color: white;
            font-weight: bold;
        }
        .user-auth {
            text-align: center;
            font-size: 0.9em;
            .username {
                color: red;
            }
            .logout {
                cursor: pointer;
                border: solid 1px #dc3545;
                color: #dc3545;
                font-size: 12px;
                padding: 4px;
                border-radius: 6px;
            }
        }
        header {
            padding: 10px;
            color: white;
            /*background: #525252;*/
            background: linear-gradient(to right, #525252, #505050, #242121);
            a {
                color: #8fbcff;
                padding: 8px;
                transition: 0.5s;
                &:hover{
                    background: #606060;
                }
            }
            nav {
                /*background: #717578;*/
                background: linear-gradient(to right, #555656, #56595a, #2b2e30);
                padding: 10px 40px;
            }
        }
        .info {
            padding: 35px;
            max-width: 990px;
            min-height: 700px;
            margin: 30px auto;
            color: #d5d5d5;
            font-size: 1.2em;
            background: #656768;
            border-radius: 10px;
            a{
                color: #8fbcff;
                &:hover{
                    color: #78adff;
                }
            }
        }
    }
</style>
