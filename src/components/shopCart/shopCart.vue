<template>
	<div class="shopcart">
		<div class="content">
			<div class="content-left">
				<div class="logo-wrapper" @click="toggleList">
					<div class="logo" :class="{'highLight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highLight':totalCount>0}">￥{{totalPrice}}</div>
				<div class="desc">
					另需配送费￥{{deliveryPrice}}元
				</div>
			</div>
			<div class="content-right">
				<div class="pay" :class="{'enough':payDesc=='去结算'}" @click="pay">
					{{payDesc}}
				</div>
			</div>
		</div>
		<div class="ball-content">
			<div v-for="ball in balls" >				
				<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
					<div v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>
		<!-- 购物车详情 -->
		<transition name="fold">		
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="emptyFun">清空</span>
				</div>
				<div class="list-content" ref="listContentWrapper">
					<ul>
						<li class="food border-1px" v-for="selectFood in selectFoods" >
							<span class="name">{{selectFood.name}}</span>
							<div class="price">
								<span>￥{{selectFood.price*selectFood.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="selectFood"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">		
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>
<script>
import axios from "axios";
import BScroll from "better-scroll";
import bus from '../../assets/eventBus'
import cartcontrol from 'components/cartcontrol/cartcontrol'

export default {
	props: {
		// 被选择的食物，即购物车中的食物
		selectFoods:{
			type:Array,
			default(){
				return [
					{
						price:10,
						count:2
					}

				];
			}
		},
		deliveryPrice: {
			type: Number,
			default: 0
		},
		minPrice: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			balls:[
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				}
			],
			//已经下落的小球
			dropBalls:[

			],
			fold:true
		};
	},
	computed: {
		totalPrice(){
			let total=0;
			this.selectFoods.forEach((food)=>{
				total += food.price * food.count;
			});
			return total;
		},
		totalCount(){
			let count=0;
			this.selectFoods.forEach((food)=>{
				count += food.count;
			});
			return count;
		},
		payDesc(){
			if(this.totalPrice === 0){
				return  `￥${this.minPrice}元起送`;
			}else if(this.totalPrice<this.minPrice){
				let diff=this.minPrice-this.totalPrice;
				return  `还差￥${diff}元起送`;
			}else{
				return '去结算' ;
			}
		},
		listShow(){
			if(this.totalCount==0){
				this.fold=true;//折叠状态
				return false;//购物车详情不显示
			}
			let show=!this.fold;
			if(show){//当购物车展开的时候，初始化betterscroll
				this.$nextTick(()=>{
					if(!this.listContentScroll){
						this.listContentScroll = new BScroll(this.$refs.listContentWrapper,{
							scrollY: true,
							click: true//设置了true才可以点击
						})
					}else{
						this.listContentScroll.refresh();
					}
				});
			}

			return show;
		}
	},
	created() {},
	methods: {
		drop(el){
			for(let i=0;i<this.balls.length;i++){
				let ball=this.balls[i];
				if(!ball.show){
					ball.show=true;
					ball.el=el;
					this.dropBalls.push(ball);
					return;
				}
			}
		},
		beforeDrop(el) {
        	let count = this.balls.length;
        	while (count--) {
          		let ball = this.balls[count];
          		if (ball.show) {
            		let rect = ball.el.getBoundingClientRect();//或得元素相当于视口的位置
            		let x = rect.left - 32;
					let y = -(window.innerHeight - rect.top - 22);//window.innerHeight窗口的高度
					el.style.display = '';
					el.style.webkitTransform = `translate3d(0,${y}px,0)`;
					el.style.transform = `translate3d(0,${y}px,0)`;
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
					inner.style.transform = `translate3d(${x}px,0,0)`;
          		}
       		}
      	},
        dropping(el, done) {
        /* eslint-disable no-unused-vars */   //如果使用了ESLint，这个变量没有用到会报错，加上这句不会报错。
        	let rf = el.offsetHeight;
       		 this.$nextTick(() => {
				el.style.webkitTransform = 'translate3d(0,0,0)';
				el.style.transform = 'translate3d(0,0,0)';
				let inner = el.getElementsByClassName('inner-hook')[0];
				inner.style.webkitTransform = 'translate3d(0,0,0)';
				inner.style.transform = 'translate3d(0,0,0)';
				el.addEventListener('transitionend', done);
        	});
        },
        afterDrop(el) {
        	let ball = this.dropBalls.shift();
        	if (ball) {
				ball.show = false;
				el.style.display = 'none';
       		}
		},
		toggleList(){
			if(this.totalCount>0){
				this.fold=!this.fold;
			}
		},
		emptyFun(){
			//遍历，把所有选择的食物的数量都置为0
			this.selectFoods.forEach((food)=>{
				food.count=0;
			})
		},
		hideList(){
			this.fold=true;
		},
		pay(){
			if(this.totalPrice<this.minPrice){
				return;
			}			
			alert("支付"+(parseInt(this.totalPrice)+parseInt(this.deliveryPrice))+"元");
		}
	},
	mounted(){
		var self=this;
		bus.$on("cart_add",function(msg){
			//msg就是在组件cartcontrol中点击的加号的dom对象
			//console.log(msg);
			self.drop(msg);
		})
	},
	components:{
		cartcontrol
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.shopcart 
	position: fixed
	left: 0
	bottom: 0
	width: 100%
	height: 48px
	z-index: 50

	.content 
		display: flex
		background: #141d27
		color: rgba(255, 255, 255, 0.4)

		.content-left 
			flex: 1
			font-size: 0
			.logo-wrapper 
				display: inline-block
				vertical-align: top
				position: relative
				top: -10px
				margin: 0 12px
				padding: 6px
				width: 56px
				height: 56px
				box-sizing: border-box
				border-radius: 50%
				background: #141d27
				.logo 
					width: 100%
					height: 100%
					background: #2b343c
					border-radius: 50%
					text-align: center
					&.highLight
						background:rgb(0,160,220)
					.icon-shopping_cart 
						line-height: 44px
						font-size: 24px
						color: #80858a
						&.highLight
							color:#fff
				.num
					position :absolute
					top:0
					right:0	
					width:24px
					height:16px
					line-height :16px
					text-align :center
					border-radius :16px
					font-size :9px
					font-weight :700
					color:#fff
					background:rgb(240,20,20,)
					box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
			.price 
				display: inline-block
				vertical-align: top
				margin-top: 12px
				font-size: 16px
				line-height: 24px
				box-sizing: border-box
				padding-right: 12px
				border-right: 1px solid rgba(255, 255, 255, 0.1)
				font-weight: 700
				&.highLight
					color:#fff

			.desc 
				display: inline-block
				vertical-align: top
				margin: 12px 0 0 12px
				line-height: 24px
				font-size: 10px

		.content-right 
			flex: 0 0 105px
			width: 105px

			.pay 
				height: 48px
				line-height: 48px
				font-size: 12px
				text-align: center
				font-weight: 700
				background: #2B333B				
				&.enough
					color:#fff
					background:#00b43c
	.ball-content
		.ball
			position:fixed
			left :32px
			bottom:22px
			z-index :200
			transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
			.inner
				width:16px
				height:16px
				background:rgb(0,160,220)
				border-radius :50%
				transition: all 0.4s linear
	.shopcart-list
		position:absolute
		top:0
		left:0
		width:100%
		z-index:-1
		transform:translate3d(0,-100%,0)
		&.fold-enter-active,&.fold-leave-active
			transition:all 0.5s linear
			transform:translate3d(0,-100%,0)
		&.fold-enter,&.fold-leave-to
			transform:translate3d(0,0,0)
		.list-header
			height:40px
			line-height:40px
			padding: 0 18px
			background :#f3f5f7
			border-bottom :1px solid rgba(7,17,27,0.1)
			.title
				float:left
				font-size:14px
				color:rgb(7,17,27)
			.empty
				float:right
				font-size:12px
				color:rgb(0,160,220)
		.list-content
			padding: 0 18px
			max-height:217px
			overflow:hidden
			background:#fff
			.food
				position:relative
				padding:12px 0
				box-sizing :border-box
				border-1px(rgba(7,17,27,0.1))
				.name
					display:inline-block
					line-height:24px
					font-size:14px
					color:rgb(7,17,27)
				.price
					position:absolute
					right:90px
					bottom:12px
					line-height:24px
					font-size :14px
					font-weight:700
					color:rgb(240,20,20)
				.cartcontrol-wrapper
					position:absolute
					right:-7px
					bottom:6px
	.list-mask
		position:fixed
		top:0
		left:0
		width:100%
		height:100%
		z-index:-2
		background:rgba(7,17,27,0.6)
		backdrop-filter:blur(10px)	
		&.fade-enter-active,&.fade-leave-active
			opacity:1
			transition :all 0.5s
		&.fade-enter,&.fade-leave-to
			opacity:0
</style>