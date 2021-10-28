<template>
    <div class="about">
        <div class="title mb-4">

        </div>
        <h2 class="text-center">О проекте</h2>
        <div class="text-center offset-1 col-10 p-4 mt-4">
            <p>ПАО "ДЕК" САХАЛИНЭНЕРГОСБЫТ</p>
            <p>Разработчик: <span>Поплавский А. А.</span></p>
            <p>Перейти на главную <router-link to="/">страницу</router-link></p>
            <div class="figure mt-4 mb-4 logo">
                <a href="https://www.dvec.ru/sakhalin/" target="_blank">
                    <img src="img/logo_2019_dek_ses.png" alt="PAODEC">
                </a>
            </div>
            <p>©, 2021г. <span v-if="year">- {{ year }}</span></p>
        </div>
    </div>
</template>

<script>
    export default {
        computed:{
            year (){
                const y = new Date().getFullYear();
                if(y > 2021)
                    return y +'г.';
                else null;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .about{
        background: #585858;
        height: 100%;
        .title{
            background: #43434c;
            height: 150px;
            border-bottom: solid 3px #fffaf2;
        }
        .logo{
            background: white;
            padding: 40px;
            border-radius: 15px;
        }
    }
</style>
