<template>
	<div v-show="value" :class="$style.contain">
		<transition v-on:after-leave="afterLeave" :name="!show?'transTop':'transBottom'">
			<div v-show="show" :class="$style.sku">
				<header :class="$style.header">
					<img :class="$style.img" :src="skuImage" alt="">
					<div :class="$style.info">
						<h5>{{product.name}}</h5>
						<h6 v-if="!_(product,'productOptions.length')">￥{{product.price/100}}</h6>
						<h6 v-else>￥{{product.productOptions[sel].price/100}}</h6>
					</div>
					<div @click="show=false" :class="$style.close">
						<van-icon name="close" />
					</div>
				</header>
				<div v-if="_(product,'productOptions.length')" :class="$style.skuRow">
					<h5>选项:</h5>
					<span @click="select(index)" v-for="(o,index) in product.productOptions" :key="o.id" :class="[$style.btn,index===sel?'active':'']">{{o.name}}</span>
				</div>
				<div :class="$style.skuRow">
					<div :class="$style.step">
						<div :class="$style.left">我要买</div>
						<div :class="$style.right">
							<span @click="minus">-</span>
							<span>{{num}}</span>
							<span @click="plus">+</span>
						</div>
					</div>
					<h6 v-if="!_(product,'productOptions.length')">
						{{_inventoryPolicy(product.maxQuantity,product.inventoryPolicy)}}
					</h6>
					<h6 v-else>
						{{_inventoryPolicy(product.productOptions[sel].maxQuantity,product.productOptions[sel].inventoryPolicy)}}
					</h6>
				</div>

			</div>
		</transition>
		<footer :class="$style.footer">
			<div @click="addToCart">加入购物车</div>
			<div @click="buyNow">我要购买</div>
		</footer>

	</div>
</template>

<script>
import { Toast } from "vant";

export default {


	watch: {
		value(val) {
			this.show = val;
		},
	},
	computed: {
		skuImage() {
			if (this._(this.product, 'productOptions.length')) {
				return this._(this.product.productOptions[this.sel], 'image.url') || 'https://s3.cn-north-1.amazonaws.com.cn/guzzu-cn-assets-1/images/29f8068f-f9e5-4c7e-934c-7c076e34a413-thumb.jpg';
			} else {
				return this._(this.product, 'image.url') || 'https://s3.cn-north-1.amazonaws.com.cn/guzzu-cn-assets-1/images/29f8068f-f9e5-4c7e-934c-7c076e34a413-thumb.jpg'
			}
		}
	},
	props: {
		value: {
			type: Boolean,
		},
		product: {
			type: Object
		},

	},
	data() {
		return {
			num: 1,
			sel: 0,
			show: this.value
		}
	},
	methods: {
		_(value, path) {
			return (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path).reduce((o, k) => (o || {})[k], value) || undefined;
		},
		_inventoryPolicy(val, l) {
			if (l === 'unlimited') {
				return '不限制'
			} else {
				return '限制' + ' ' + val
			}
		},
		afterLeave() {
			this.$emit('input', false);
		},
		buyNow() {
			let good = this.goodMaker();
			this.$emit('buyNow', good);
			this.show = false;

		},
		addToCart() {
			let good = this.goodMaker();
			this.$emit('addToCart', good);
			this.show = false;

		},
		goodMaker() {
			let good;
			if (this._(this.product, 'productOptions.length')) {
				const options = this.product.productOptions[this.sel];
				good = {
					id: options._id,
					goodsId: this.product._id,
					store: this.product.store,
					title: this.product.name,
					desc: options.name,
					price: options.price,
					num: this.num,
					thumb: this._(options, 'image.url') || this._(this.product, 'image.url')
				};
			} else {
				good = {
					id: this.product._id,
					goodsId: this.product._id,
					store: this.product.store,
					title: this.product.name,
					desc: this.product.name,
					price: this.product.price,
					num: this.num,
					thumb: this._(this.product, 'image.url')
				};
			}
			return good;
		},
		select(index) {
			this.sel = index;
			this.num = 1;
		},
		plus() {
			let productObj = {}
			if (this.product.productOptions.length) {
				productObj = this.product.productOptions[this.sel]
			} else {
				productObj = this.product
			}
			if (productObj.inventoryPolicy === 'unlimited') {
				this.num++;
			} else {
				this.num = productObj.maxQuantity > this.num ? this.num + 1 : productObj.maxQuantity;
				if (this.num >= productObj.maxQuantity) {
					Toast('PRODUCT_IN_SHORT_INVENTORY');
				}
			}
		},
		minus() {
			if (this.num > 1) {
				this.num--;
			} else {
				Toast('PRODUCT_AT_LEAST_ONE');
			}
		},
	}
}
</script>

<style scoped>
.active {
  background: red;
  color: white;
}
</style>


<style lang="scss" module>
.contain {
  color: #111;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  font-size: 14px;
  .sku {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    max-width: 700px;
    // height: 50%;
    margin: 0 auto 50px;
    box-sizing: border-box;
    padding: 0 10px;

    .header {
      border-bottom: 1px solid #ddd;
      .img {
        position: relative;
        margin-top: -10px;
        width: 80px;
        height: 80px;
        float: left;
      }
      .info {
        padding: 10px 60px 10px 10px;
        min-height: 82px;
        overflow: hidden;
        box-sizing: border-box;
        h5 {
          font-size: 16px;
        }
        h6 {
          color: red;
        }
      }
      .close {
        position: absolute;
        font-size: 18px;
        right: 20px;
        top: 10px;
      }
    }
    .skuRow {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      text-align: left;
      h5 {
        margin-bottom: 8px;
      }
      .btn {
        display: inline-block;
        min-width: 50px;
        margin-right: 5px;
        margin-bottom: 5px;
        padding: 0 3px;
        line-height: 26px;
        border: 1px solid #aaa;
        border-radius: 5px;
        text-align: center;
      }
      .step {
        height: 30px;
        margin-right: 20px;
        line-height: 30px;
        display: block;
        overflow: hidden;
        width: 100%;
        .left {
          float: left;
        }
        .right {
          float: right;
          span {
            display: block;
            float: left;
            min-width: 26px;
            line-height: 26px;
            border: 1px solid #aaa;
            // border-radius: 5px;
            text-align: center;
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    color: white;
    max-width: 700px;

    // height: 50%;
    margin: 0 auto;
    div {
      background: #f44;
      flex: 1;
      &:nth-child(1) {
        background: #f85;
      }
    }
  }
}
.popup-enter-active {
  animation: popup 0.5s;
}
.popup-leave {
  animation: popup 0.5s reverse;
}
</style>