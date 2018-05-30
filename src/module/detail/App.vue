<template>
	<div id="app">
		<div @click="showSku" class="btn">加入购物车</div>
		<sku v-model="show" @addToCart="skuAddToCart" @buyNow="skuBuyNow" :product="product" />

	</div>
</template>

<script>
function deepGet(value, path) {
	return (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path).reduce((o, k) => (o || {})[k], value) || undefined;
};
import sku from './sku'

export default {
	name: 'App',
	mounted() {
		this.product = deepGet(window, 'BRIDGE_DATA.product') || {};
		console.log(this.product);
	},
	data() {
		return {
			product: {},
			show: false,
		}
	}, methods: {

		showSku() {
			this.product = deepGet(window, 'BRIDGE_DATA.product') || {};
			this.show = true;
			// this.$refs.sku.showSku();
		},
		skuAddToCart(data) {
			console.log(data);
		},
		skuBuyNow(data) {
			console.log(data);
		},

	},
	components: {
		// guzzuSku,
		sku,


	}
}
</script>

<style lang="scss" scoped>
#app {
  text-align: center;
  // color:red;
  .btn {
    // padding:10px;
  }
}
</style>
