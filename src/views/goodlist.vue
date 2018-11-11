<template>
    <div>
        <!-- header组件 -->
        <NavHeader></NavHeader>
        <!-- 面包屑 -->
        <NavBread>
            <!-- 多个插槽的使用 -->
            <span slot="a">Goods</span>
            <span slot="b">测试一下</span>
        </NavBread>

        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" @click="sortGoods()">Price 
                        <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop()">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}" >
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:void(0)" :class="{'cur': priceChecked == 'all'}" @click="setPriceFilter('all')">All</a></dd>
                            <dd v-for="(item,index) in priceFilter" :key="index">
                                <a href="javascript:void(0)" :class="{'cur':priceChecked == index}" @click="setPriceFilter(index)">{{item.startPrice}} - {{item.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                           
                            <ul>
                                <li v-for="(item,index) in goodList" :key="index">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'static/' + item.productImage" alt="" :key="item.productImage"></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                                <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show = "loading">
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop()"></div>
        <!-- footer -->
        <NavFooter></NavFooter>
    </div>
</template>
<script>
    import "../assets/css/base.css";
    import "../assets/css/login.css";
    import "../assets/css/product.css";

    import NavHeader from '../components/navheader';
    import NavFooter from '../components/navfooter';
    import NavBread from '../components/navbread';
    import axios from 'axios';


    export default {
        data() {
            // 不允许组件之间进行状态共享  宝石数据独立
            return {
                goodList:[], // 数据
                priceFilter:[ // 价格区间
                    {
                        startPrice: '0.00',
                        endPrice:'500.00'
                    },
                    {
                        startPrice: '500.00',
                        endPrice:'1000.00'
                    },
                    {
                        startPrice: '1000.00',
                        endPrice:'2000.00'
                    },
                    {
                        startPrice: '2000.00',
                        endPrice:'5000.00'
                    }
                ],
                priceChecked:'all', // 默认选中价格区间
                filterBy:false, // 弹窗
                overLayFlag:false, //遮罩 
                sortFlag:true, // 升序
                page:1, // 第一页
                pageSize: 8 ,// 每页8条
                busy:false,  // 滚动加载  
                loading:false // loading
            };
        },
        mounted(){
            this.getGoodList(false);
        },
        methods:{
            loadMore(){
                
                this.busy = true; // 滚动加载失效
                setTimeout(()=>{
                    this.page++;
                    this.getGoodList(true);
                },500)
            },
            // 数据的获取
            getGoodList(flag){
                let param = {
                    page:this.page,
                    pageSize:this.pageSize,
                    sort:this.sortFlag ? 1 : -1,
                    priceLevel:this.priceChecked
                }
                this.loading = true;
                axios.get("/goods",{
                    params:param
                }).then( (res) => {
                    this.loading = false;
                    // console.log(res)
                    if(res.data.status == "0"){
                        if(flag){
                            this.goodList =this.goodList.concat(res.data.result.list);
                            if(res.data.result.count == 0){
                                this.busy = true; // 禁用
                            }else{
                                this.busy = false; // 启用
                            }
                        }else{
                            this.busy = false; 
                            this.goodList = res.data.result.list;
                        }
                        
                    }else{
                        this.goodList = [];
                    }
                })
            },
            sortGoods(){ // 排序
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodList(false)
            },
            showFilterPop(){
                this.filterBy = true
                this.overLayFlag = true
            },
            closePop(){
                this.filterBy = false
                this.overLayFlag = false
            },
            setPriceFilter(index){ // 价格点击事件
                this.priceChecked = index;
                this.closePop();

                // 过滤
                this.page = 1;
                this.getGoodList(false)
            },
            addCart(productId){ // 加入购物车
                // console.log(productId);
                axios.post("/goods/addCart",{
                    productId:productId
                }).then((res)=>{
                    console.log(res);
                    alert("添加成功");
                })

            }
        },
        components:{
            'NavHeader': NavHeader,
            'NavFooter': NavFooter,
            'NavBread': NavBread,
           
        }
    };
</script>

