<template>
    <transition name="fade">
        <div class="loader-bar" v-show="getLoaderBar">
            <div class="loader-bar-content text-center">
                <img src="/img/Loading.gif" alt="loading">

                <div>
                    <p class="mb-0">Обработка данных</p>
                    <p class="mb-0">Подождите...</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "LoaderBar",

        computed: {
            ...mapGetters(['getLoaderBar'])
        }
    }
</script>

<style lang="scss" scoped>
    .loader-bar{
        color: white;
        background: rgba(21, 22, 22, 0.9);
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 9999991;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        .loader-bar-content{
            width: 300px;
            height: 180px;
            font-size: 1.4em;
            padding: 20px 30px;
            background: #464646;
            border: solid 2px #8d8d8d;
            box-shadow: 1px 1px 25px 3px #0e0d0d;
            border-radius: 5px;
            overflow: hidden;
            img {
                width: 40px;
            }
        }
    }

    .fade-enter-active {
        animation: fadeIn .1s ease-in;;
    }
    .fade-leave-active{
        transition: opacity .1s;
    }
    @keyframes fadeIn{
        0%{
            opacity: 0;
        }
        50%{
            opacity: 0.5;
        }
        100%{
            opacity: 1;
        }
    }
</style>
