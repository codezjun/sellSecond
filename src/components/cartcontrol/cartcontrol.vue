<template>
	<div class="cartcontrol">
        <div class="cart-decrease" v-show="food.count>0">
            
        </div>
        <div class="count" v-show="food.count>0">
            {{food.count}}
        </div>
        <div class="cart-add">
            
        </div>
	</div>
</template>

<script>
import axios from "axios";
import BScroll from "better-scroll";

export default {
	props: {
		food:{
            type:Object
        }
	},
	data() {
		return {};
	},
	computed: {

	},
	created() {},
	methods: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';


</style>