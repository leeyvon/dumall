<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
          <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a @click="sortGoods" :class="{'sort-up':sortFlag}"  href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="/static/svg.svg#icon-arrow-short" :class="{'sort-up':!sortFlag}"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd>
                  <a :class="{cur:priceChecked=='all'}" href="javascript:void(0)" @click="priceChecked='all'">All</a>
                </dd>
                <dd v-for="(price,index) in priceFilter">
                  <a :class="{cur:priceChecked==index}" href="javascript:void(0)" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div style="text-align:center;" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                    <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from '@/components/Header';
    import NavFooter from '@/components/Footer';
    import NavBread from '@/components/NavBread';
    import axios from 'axios';
    export default{
        data(){
            return {
              goodsList:[],
              priceFilter:[
                {
                  startPrice:0,
                  endPrice:100
                },
                {
                  startPrice:100,
                  endPrice:500
                },
                {
                  startPrice:500,
                  endPrice:1000
                },
                {
                  startPrice:1000,
                  endPrice:2000
                }
              ],
              priceChecked:'all',
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:true,
              loading:false
            }
        },
        mounted(){
            this.getGoodsList();
        },
        methods:{
            getGoodsList(flag){
              var param = {
                page:this.page,
                pageSize:this.pageSize,
                sort:this.sortFlag ? 1 : -1,
                priceLevel:this.priceChecked
              };
              axios.get('/goods/list',{
                  params:param
              }).then((response)=>{
                  let res  = response.data;
                  this.loading = false
                  if(res.status == '0'){
                      if(flag){
                          this.goodsList = this.goodsList.concat(res.result.list);
                          //没有数据则禁止滚动
                          if(res.result.count === 0){
                              this.busy = true;
                          }else{
                              this.busy = false;
                          }
                      }else{
                          this.goodsList = res.result.list;
                          this.busy = false;
                      }
                  }else{
                    // 错误处理
                  }
              })
            },
            showFilterPop(){
              this.filterBy = true;
              this.overLayFlag = true;
            },
            setPriceFilter(index){
               this.priceChecked=index;
               this.closePop();
            },
            closePop(){
              this.filterBy = false;
              this.overLayFlag = false;
            },
            sortGoods(){
                this.sortFlag = !this.sortFlag;
                this.page=1;
                this.getGoodsList();
            },
            loadMore(){
                this.busy = true
                setTimeout(() => {
                  this.page++;
                  this.getGoodsList(true);
                }, 500)
            }
        },
        components:{
            NavHeader,
            NavFooter,
            NavBread
        }
    }
</script>

<style lang="scss">
    @import './../assets/css/base.css';
    @import './../assets/css/product.css';
    @import './../assets/css/login.css';
</style>
