<template>
    <div class="results">
        <div class="form-content">
            <div class="tabs">
                <input type="radio" name="tab-btn" id="tab-btn-1" value="" checked>
                <label for="tab-btn-1">Краткая информация</label>
                <input type="radio" name="tab-btn" id="tab-btn-2" value="">
                <label for="tab-btn-2">Подробно</label>

                <div id="content-1">
                    <IntervalFilter/>
                </div>
                <div id="content-2">
                    <UserFilter/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import UserFilter from "./UserFilter/UserFilter";
    import IntervalFilter from "./IntervalFilter/IntervalFilter";
    export default {
        components:{
            UserFilter,
            IntervalFilter
        }
    };
</script>
<style lang="scss" scoped>
    .form-content{

    }
    @import "../../../assets/css/tabs.css";
</style>
