<template>
	<div class="cartcontrol">
		<transition name="move">		
			<div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
        <div class="cart-count" v-show="food.count>0">
            {{food.count}}
        </div>
        <div class="cart-add icon-add_circle" @click.stop="addCart">
            
        </div>
	</div>
</template>

<script>
import Vue from "vue";
import bus from '../../assets/eventBus';
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
	methods: {
		addCart(){
			if(!this.food.count){
				//this.food.count=1;
				//count这个字段在food这个观测对象中原先是不存在的，为了能够添加成功并且被观测到，要用Vue.set（）
				//这里增加了一个count字段，并且把值设为1。（Vue要全局引入一下）
				Vue.set(this.food,'count',1);
			}else{
				this.food.count++;
			}
			console.log(this.food);
			//派发一个事件cart_add，同时把event.target这个dom对象作为参数传入 这是vue1.0的，vue2.0无效
			//this.$dispatch('cart_add',event.target);

			bus.$emit("cart_add",event.target);
		},
		decreaseCart(){
			if(this.food.count){
				this.food.count--;
			}
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
	.cartcontrol
		font-szie:0
		.cart-decrease
			display:inline-block
			vertical-align:middle				
			.inner
				display:inline-block
				padding:6px
				line-height:24px
				font-size:24px
				color:rgb(0,160,220)
			//动画进入完成后
			&.move-enter-active,&.move-leave-active
				opacity:1
				transform:translate3d(0,0,0)
				transition:all 0.5s linear
				.inner
					transform:rotate(0)
					transition:all 0.5s linear
			&.move-enter,&.move-leave-to
				opacity :0
				transform:translate3d(24px,0,0)
				.inner
					transform:rotate(180deg)
		.cart-count
			display:inline-block
			vertical-align:middle
			width:12px
			tedxt-align:center
			font-size:10px
			color:rgb(147,153,159)
		.cart-add
			display:inline-block
			padding:6px
			vertical-align:middle
			line-height:24px
			font-size:24px
			color:rgb(0,160,220)

</style>