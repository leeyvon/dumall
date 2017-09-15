<template lang="html">
    <div>
        <button type="button" @click="increment">+</button>
        <button type="button" @click="decresment">-</button>
        <p><span>{{num}}</span></p>
    </div>
</template>

<script>
export default {
    props:["num"],
    data(){
        return {
            
        }
    },
    methods:{
        increment(){
            this.$emit("incre")
        },
        decresment(){
            this.$emit("decre")
        }
    }
}
</script>

<style lang="css">
</style>
