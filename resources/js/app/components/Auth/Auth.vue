<template>
    <div class="auth">
        <div class="form-auth p-4">
            <!-- Форма авторизации-->
            <div v-if="!user.auth">
                <form action="post" @submit.prevent="submit">
                    <div class="offset-2 col-8">
                        <div class="form-group">
                            <label for="">Учетная запись</label>
                            <input class="form-control" type="text" v-model="login">
                        </div>
                        <div class="form-group">
                            <label for="">Пароль</label>
                            <input class="form-control" type="password" v-model="password">
                        </div>
                    </div>

                    <div class="form-group text-center">
                        <button class="btn btn-lg btn-secondary">Авторизоваться</button>
                    </div>
                </form>
            </div>
            <!-- Навигация-->
            <p class="mb-0 text-center"><span v-if="user.auth">Вы авторизовались!</span>&nbsp;Вертуться на <router-link to="/"><i>главную страницу</i></router-link>.</p>
        </div>
        <ApiError />
    </div>
</template>

<script>
    import ApiError from "../../modules/MessageError/ApiError";
    export default {
        components:{
            ApiError
        },
        computed: {
            user(){
                const user = this.$store.getters.getUser;
                if(user.auth)
                    this.$router.push('/');
                return user;
            }
        },
        data() {
            return {
                login: null,
                password: null
            }
        },
        methods: {
            submit() {
                if(this.login == null || this.password == null){
                    const text = 'Заполните все поля и попробуйте снова.';
                    this.$store.dispatch('setErrorTitleAndText', {title: 'Ошибка заполнения', text: text});
                    return;
                }
                // Убрать введеный домен
                const pattern = /([A-Za-z]+)(-)?([A-Za-z]+)?\\/;
                this.login = this.login.replace(pattern, '');

                this.$store.dispatch('auth',{'login': this.login, 'password': this.password});
            }
        }
    }
</script>
<style lang="scss" scoped>
    .auth{
        width: 100%;
        height: 100%;
        color: white;
        display: flex;
        .form-auth{
            font-size: 1.2em;
            width: 100%;
            max-width: 700px;
            min-height: 300px;
            background: #656768;
            margin: 0 auto;
            line-height: 70px;
            align-self: center;
            border-radius: 10px;
            overflow: hidden;
        }
    }

</style>
