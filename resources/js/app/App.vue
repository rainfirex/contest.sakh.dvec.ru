<template>
    <div class="wrapper">
        <div class="content">
            <router-view/>
            <loaderBar/>
        </div>
    </div>
</template>
<script>
    import LoaderBar from "./modules/LoaderBar";
    import User from "./assets/js/User";
    export default {
        name:"app",
        components:{
            LoaderBar
        },
        methods: {
            // Обновление пользователя
            verificationUser(){
                setInterval(() => {
                    if (localStorage.getItem('api_token')){
                        this.$store.dispatch('verification');
                    }
                }, 75000);
            }
        },
        mounted(){
            this.verificationUser();
        },
        created(){
            this.$store.dispatch('loadUser', User.load());
        }
    };
</script>
