<template>
    <div class="admin">
        <nav class="mb-3">
            <router-link to="/"><i>На главную</i></router-link>
            <router-link to="/admin/question" v-if="user.is_handler"><i>Вопросы</i></router-link>
            <router-link to="/admin/test-result" v-if="user.is_handler"><i>Результаты тестирования</i></router-link>
            <router-link to="/admin/users" v-if="user.is_admin"><i>Пользователи</i></router-link>
            <router-link to="/admin/groups" v-if="user.is_admin"><i>Группы</i></router-link>
            <router-link to="/about"><i>О проекте</i></router-link>
        </nav>
        <div class="p-4 m-3 bg-light text-secondary">
            <p class="mb-0">Это <b>админка</b> - закрытая часть системы.</p>
            <p class="mb-0">Меню "Вопросы" - здесь создаються новые тесты, редактируються вопросы.</p>
            <p class="mb-0">Меню "Пользователи" - назначение доступа пользователям.</p>
        </div>
        <router-view @initResponseError="initResponseError" />
        <MessageError :error="error"/>
        <ApiError/>
    </div>
</template>
<script>
    import MessageError from "../../modules/MessageError/MessageError";
    import ApiError from "../../modules/MessageError/ApiError";
    export default {
       name: 'Admin',
        components:{
            MessageError,
            ApiError
        },
        computed:{
          user() {
              return this.$store.getters.getUser;
          }
        },
        data(){
           return {
               error: { title: null, text: null }
           }
        },
        methods: {
            // отобразить ошибку
            initResponseError(error){
                if(error.response){
                    this.error.title = error.response.statusText;
                    this.error.text = error.response.data.message;
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    nav{
        /*background: #1a202c;*/
        background: linear-gradient(to right, #525252, #505050, #242121);
        z-index: 1;
        position: sticky;
        top: 0;
        a{
            color: white;
            padding: 18px;
            display: inline-block;
        }
    }
</style>
<style lang="scss">
    .admin{
        color: #6b7280;
    }
</style>
