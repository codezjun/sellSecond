<template>
  <div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,$index) in goods" class="menu-item" :class="{'current':currentIndex==$index}" @click="selectMenu($index,$event)">
					<span class="text border-1px">
						<i v-show="item.type>0" class="icon" :class="classMap[item.type]"></i>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper"  ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px" @click="selectFoodFun(food)">
							<div class="icon">
								<img :src="food.icon" alt="" width="57" height="57"/>
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>			
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice !== ''">￥{{food.oldPrice}}</span>									
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>						
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<food :food="selectFood" ref="food"></food>
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from 'better-scroll'
import shopcart from 'components/shopCart/shopCart'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'

const ERR_OK = 200
export default {
  props:{
		seller:{
			type:Object
		}
  },
  data(){
  	return {
  		goods:[],
  		//存右侧每个li到外层ul的顶部的高度的区间。
  		listHeight:[],
		scrollY:0,
		selectFood:{}//点击食物列表的时候点击的food
  	}
  },
  computed:{
  	//计算属性，监控滚动距离和各个li到外层ul的顶部的高度的区间的关系，得到索引
  	currentIndex(){
  		for(let i=0;i<this.listHeight.length;i++){
  			let height1=this.listHeight[i];
  			let height2=this.listHeight[i+1];
  			if(!height2||(this.scrollY>=height1&&this.scrollY<height2)){
  				return i;
  			}
  		}
  		return 0;
	},
	selectFoods(){
		let foods=[];
			this.goods.forEach((good)=>{
				good.foods.forEach((food)=>{
					//有count说明被选择，即把当前food放入foods
					if(food.count){
						foods.push(food);
					}
				})
			})
			return foods;
	}
  },
  created(){
  	this.classMap=['decrease','discount','special','invoice','guarantee'];
  	
    axios.get('../../../static/data.json')
    .then(response=>{
      if(response.status == ERR_OK){
      	this.goods=response.data.goods;
      	console.log(response.data.goods);
      	
      	this.$nextTick(()=>{
			this._initScroll();
			this._calculateHeight();
		});
      	
      }
    })
    .catch(error=>{
        console.log(error);
        alert('网络错误，不能访问2');
    })	
	},
	methods:{
		_initScroll(){
			this.meunScroll = new BScroll(this.$refs.menuWrapper,{
				scrollY: true,
				click: true//设置了true才可以点击
			})
			this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
				scrollY: true,
				click: true,//设置了true才可以点击
				probeType:3//此设置可以让scroll滚动的时候，实时监听到滚动的位置。
			})
			//监听foods-wrapper的滚动事件
			this.foodsScroll.on('scroll',(pos)=>{
				this.scrollY=Math.abs(Math.round(pos.y));
			})
		},
		//计算高度
		_calculateHeight(){
			//得到右侧每一类商品的对象
			let foodList=this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
			let height=0;
			this.listHeight.push(height);
			for(let i=0;i<foodList.length;i++){
				let item=foodList[i];
				//得到右侧每个li到外层ul的顶部的高度的区间，然后放入数组
				height+=item.clientHeight;
				this.listHeight.push(height);
			}
			//console.log(this.listHeight)
		},
		selectMenu(index,event){			
			//pc上原生点击也能监听到，防止pc出现了两次点击（最新可以不加判断了）
			//浏览器原生事件没有属性constructed,如果不是better-scroll派生的事件，就return掉。
			if(!event._constructed){
				return;
			}
			console.log(index);
			let foodList=this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
			let el=foodList[index];//左侧menu点击，右侧要滚动到的dom
			//scrollToElement是better-scroll插件的接口，跳到对应的dom，动画时间设置为300ms
			this.foodsScroll.scrollToElement(el,300);
		},
		selectFoodFun(food){
			this.selectFood=food;
			//调用子组件food组件中的show方法
			this.$refs.food.show();
			//console.log(JSON.stringify(food));
		}
	},
	components:{
		shopcart,cartcontrol,food
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.goods
		display:flex
		position:absolute
		top:174px
		bottom:46px
		width:100%
		overflow:hidden
		.menu-wrapper
			/*第一个对额外空间的占据量  第二个是空间不足的缩放情况  第三个的占位空间*/
			flex:0 0 80px
			width:80px
			height:100%
			background:#f3f5f7
			.menu-item
				display:table
				margin:0 auto
				width:56px
				padding:0 12px
				height:54px
				line-height:14px
				&.current
					position:relative
					z-index:10
					margin-top:-1px
					background:#fff
					font-weight:700
					.text::after
						border:none
			.text
				display:table-cell
				vertical-align:middle
				width:56px
				border-1px(rgba(7,17,27,0.1))
				font-size:12px
				.icon
					display:inline-block
					vertical-align:top
					width:12px
					height:12px
					margin-right:2px
					background-size:12px 12px
					background-repeat:no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')	
					
		.foods-wrapper
			flex:1
			.title
				padding-left:14px
				height:26px
				line-height:26px
				border-left:2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background:#f3f5f7
			.food-item
				display:flex
				margin:0 18px
				padding:18px 0 
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border:none
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					position:relative
					flex:1
					.name
						margin:2px 0 8px 0
						height:14px
						line-height:14px
						font-size:14px
						color:rgb(7,17,27)
					.desc,.extra
						line-height:10px
						font-size:10px
						color:rgb(147,153,159)
					.desc				
						margin-bottom:8px
						line-height:12px
					.extra
						.count
							margin-right:12px	
					.price
						font-weight:700
						line-height:24px
						.now
							margin-right:8px
							font-size:14px
							color:rgb(240,20,20)
						.old
							text-decoration:line-through
							font-size:10px
							color:rgb(147,153,159)
					.cartcontrol-wrapper
						position:absolute
						right:-10px
						bottom:-6px
						
</style>