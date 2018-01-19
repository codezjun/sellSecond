<template>
  <div>
		<!--<div class="header">
			<v-header></v-header>
		</div>-->
		<v-header :seller="seller"></v-header>
		<div class="tab border-1px">
			<div class="tab-item">
				<router-link to="/goods">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/ratings">评论</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/seller">商家</router-link>
			</div>
		</div>
		<router-view :seller="seller"></router-view>
  </div>
</template>

<script>

import header from './components/header/header'
import axios from 'axios'

const ERR_OK = 200
export default {
  name: 'app',
  data() {
  	return {
  		seller:{}
  	}
  },
  created() {
    axios.get('../static/data.json')
    .then(response=>{
      //console.log(response);
      if(response.status == ERR_OK){
      	this.seller=response.data.seller;
      	console.log(this.seller);
      }
    })
    .catch(error=>{
        console.log(error);
        alert('网络错误，不能访问');
    })	
  },
  components:{
  	'v-header':header
 	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "./common/stylus/mixin.styl"
	.tab
		display:flex
		width:100%
		height:40px
		line-height:40px
		border-1px(rgba(7,17,27,0.1))
		.tab-item
			flex:1
			text-align:center
			& > a
				display:block
				font-size:14px
				color:rgb(77,85,93)
				&.router-link-active
					color:rgb(240,20,20)
</style>