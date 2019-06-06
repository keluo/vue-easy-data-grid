<template>
<div class="vue-table-wrap" :class="isLoading?'loading':''">
  <table class="vue-table">
    <thead>
      <tr v-if="!isKeyValue">
        <th v-if="selection && currentListData && currentListData.length > 0">
          <label class="checkbox-wrap">
            <input type="checkbox" class="checkbox-input" id="selectionAll" v-model="selectionAllVal"/>
            <label class="checkbox-inner" for="selectionAll"></label>
          </label>
        </th>
        <th v-for="value in columns" v-text="value"></th>
        <th v-if="hasOperation">操作</th>
      </tr>
      <tr v-if="isKeyValue">
        <th v-if="selection && currentListData && currentListData.length > 0">
          <label class="checkbox-wrap">
            <input type="checkbox" class="checkbox-input" id="selectionAll" v-model="selectionAllVal"/>
            <label class="checkbox-inner" for="selectionAll"></label>
          </label>
        </th>
        <th v-for="(item,key) in columns" :style="item.style ? item.style : '' ">
          <span v-text="typeof item == 'object' ? item.name : item" class="head-name"></span>
          <div class="sort-wrap" v-if="typeof item == 'object' && item.sort">
            <span class="sort-up" :class="item.sort.type === 'up'?'on':''" @click="sort('up',key)" v-if="!item.sort.support || item.sort.support === 'up'">
              <i class="icon-sort-up"></i>
            </span>
            <span class="sort-down" :class="item.sort.type === 'down'?'on':''" @click="sort('down',key)" v-if="!item.sort.support || item.sort.support === 'down'">
              <i class="icon-sort-down"></i>
            </span>
          </div>
          <div class="filter-wrap" v-if="typeof item == 'object' && item.filter" @click="showFilter(key)">
            <i class="icon-filter" :class="(columns[key].filterValue && columns[key].filterValue.length > 0) ? 'current' : ''"></i>
            <div class="filter-ext-wrap"  v-show="filter[key]">
              <div class="filter-content">
                <div class="filter-item" v-for="(value,index)  in item.filter">
                  <label class="checkbox-wrap">
                    <input type="checkbox" class="checkbox-input" :id="'filterName'+index" :value="index" v-model="columns[key].filterValue"/>
                    <label class="checkbox-inner" :for="'filterName'+index"></label>
                  </label>
                  <span class="filter-item-txt" v-text="value"></span>
                </div>
              </div>
              <div class="filter-options">
                <a class="confirm" @click="filterSubmit(key)">确定</a>
                <a class="reset">重置</a>
              </div>
            </div>
          </div>
        </th>
        <th v-if="hasOperation">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!isKeyValue" v-for = "(data,index) in currentListData" :class="zebra && index % 2 == 1 ?  'zebra-line' : '' ">
        <td v-if="selection" style="min-width:0px;width: 45px;">
          <label class="checkbox-wrap">
            <input :id="'selection_'+index" type="checkbox" class="checkbox-input" v-model="selectionVal[index]"/>
            <label :for="'selection_'+index" class="checkbox-inner" ></label>
          </label>
        </td>
        <td v-for="(value,index) in data"  track-by="$index" v-text="value"></td>
        <td v-if="hasOperation" class="options">
          <slot :data="data" :index="index"></slot>
        </td>
      </tr>
      <tr v-if="isKeyValue" v-for = "(data,index) in currentListData" :class="zebra && index % 2 == 1 ?  'zebra-line' : '' ">
        <td v-if="selection" style="min-width:0px;width: 45px;">
          <label class="checkbox-wrap">
            <input :id="'selection_'+index" type="checkbox" class="checkbox-input" v-model="selectionVal[index]"/>
            <label :for="'selection_'+index" class="checkbox-inner" ></label>
          </label>
        </td>
        <td v-for="(value,key) in columns">
          <span v-if="typeof value == 'object' && !value.isSlot" v-html="formatter(value,currentListData[index],key)" v-on:click="click(value,currentListData[index],key)"></span>
          <span v-if="typeof value != 'object'" v-text="data[key]"></span>

          <slot v-if="typeof value == 'object' && value.isSlot" :data="data" :index="index" :name="'slot-'+key"></slot>
        </td>
        <td v-if="hasOperation" class="options">
          <slot :data="data" :index="index"></slot>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="vue-table-loading " v-if="isLoading">
    <div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'vue-data-grid',
  props: {
    'selection':{
      default:() => {
        return false;
      },
      type: Boolean
    },
    'listData':{
      default:() => {
        return [];
      },
      type: Array
    },
    'columns':{
      default:() => {
        return {};
      },
      type: Object
    },
    'zebra':{
      default:() => {
        return true;
      },
      type: Boolean
    },
    'hasOperation':{
      default:() => {
        return false;
      },
      type: Boolean
    },
    'isKeyValue':{
      default:() => {
        return true;
      },
      type: Boolean
    },
    'isLoading':{
      default:() => {
        return false;
      },
      type: Boolean
    }
  },
  data () {
    return {
      filter:{},
      selectionVal:[]
    };
  },
  mounted () {
    if(this.columns){
      for(const key in this.columns){
        if(this.columns.hasOwnProperty(key)){
          let item = this.columns[key];
          if(item.sort && typeof item.sort.type !== 'undefined'){
            this.sort(item.sort.type,key);
          }
        }
      }
    }
  },
  computed: {
    currentListData : function(){
      let that = this;
      return JSON.parse(JSON.stringify(that.listData));
    },
    selectionAllVal :{
      get(){
        var total = 0;
        for(var i=0; i < this.selectionVal.length; i++){
          if(this.selectionVal[i] !== 'undefined' && this.selectionVal[i]){
            total++;
          }
        }
        return total === this.currentListData.length ? true : false;
      },
      set(){
        if(this.selectionAllVal){
          this.selectionVal = [];
        }else{
          this.selectionVal = [];
          for(var i=0; i < this.currentListData.length ; i++){
            this.selectionVal.push(true);
          }
        }
      }
    }
  },
  watch: {
    selectionVal(value){
      this.$emit('on-selection-change',value) ;
    }
  },
  methods: {
    sort(type,key){
      //清空之前的排序
      let currentType = null;
      if(typeof this.columns[key].sort == 'object' && typeof this.columns[key].sort.type === 'string') {
        currentType = this.columns[key].sort.type;
      }
      this.clearSort();
      if(typeof this.columns[key].sort === 'boolean'){
        this.columns[key].sort = {};
      }
      if(typeof this.columns[key].sort.type === 'undefined'){
        this.$set(this.columns[key].sort, 'type', '');
      }
      if(type === 'up'){
        this.columns[key].sort.type = 'up';
      }else if(type === 'down'){
        this.columns[key].sort.type = 'down';
      }
      //判断是否为自定义
      if(this.columns[key].sort.custom && typeof this.columns[key].sort.custom == 'function'){
        if(currentType === type){
          this.columns[key].sort.type = '';
        }
        this.columns[key].sort.custom(type,key,currentType);
      }else{
        //取消排序
        if(currentType === type){
          this.currentListData = JSON.parse(JSON.stringify(this.listData));
          this.columns[key].sort.type = '';
        }else{
          this.currentListData.sort(this.sortBy(key,type === 'up'?true:false));
        }
      }
    },
    clearSort(){
      for(let key in this.columns){
        if(this.columns.hasOwnProperty(key)){
          if(this.columns[key].sort && this.columns[key].sort.type){
            this.columns[key].sort.type = '';
          }
        }
      }
    },
    sortBy: function(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    },
    clearSelection(){
      this.selectionVal = [];
    },
    selectionAllChange(){
      if(this.selectionAllVal){
        this.selectionVal = [];
      }else{
        this.selectionVal = [];
        for(var i=0; i < this.currentListData.length ; i++){
          this.selectionVal.push(true);
        }
      }
    },
    formatter(value,data,key){
      if(value.formatter && typeof value.formatter === 'function'){
        return value.formatter(data);
      }else{
        return data[key];
      }
    },
    click(value,data,key){
      if(value.click){
        return value.click(data);
      }else{
        return data[key];
      }
    },
    showFilter(key){
      if(this.filter[key]){
        this.filter[key] = 0;
      }else{
        this.$set(this.filter,key,1);
      }
    },
    filterSubmit(key){
      this.$emit('filter-option',key);
      this.filter[key] = 0;
    }
  }
}
</script>

<style scoped>
  *, *:after, *:before {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .vue-table-wrap {
    position: relative;
    width: 100%;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    overflow: hidden;
    overflow-x: auto;
    font-family: Helvetica Neue For Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serifsans-serif;
    font-size: 12px;
  }
  .vue-table-wrap a {
    color: #5b9bd1;
    text-shadow: none;
    text-decoration: none;
    cursor: pointer;
  }
  .vue-table-wrap a:hover{
    color: #3175af;
  }
  .vue-table {
    width: 100%;
    font-size: 12px;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: left;
  }
  .vue-table thead {
  }
  .vue-table thead tr {
    background-color: #dadee3;
  }
  .vue-table tbody tr.zebra-line{
    background-color:#edf0f5;
  }
  .vue-table thead tr th {
    color: rgba(0,0,0,.85);
    font-size: 14px;
    font-weight: 400;
    height: 40px;
    padding: 12px 15px;
    white-space: nowrap;
    position: relative;
    color: #333;
    text-align: left;
  }
  .vue-table thead tr th .head-name{
    float: left;
  }
  .vue-table thead tr th  .fa{
    cursor: pointer;
    padding:  0 4px;
  }
  .vue-table thead tr th  .fa.current{
    color: #5b9bd1;
  }
  .vue-table tbody tr {
    line-height: 40px;
  }
  .vue-table tbody tr td {
    color: rgba(0,0,0,.65);
    font-weight: 400;
    padding: 12px 15px;
    word-break: break-all;
    min-width: 80px;
    max-width: 500px;
    line-height: 20px;
  }
  .vue-table tbody tr td.options {
    white-space: nowrap;
    max-width: auto;
  }
  .vue-table tbody tr td a{
  }
  .vue-table tbody tr td.nowrap{
    white-space: nowrap;
  }
  .vue-table .filter-wrap{
    position: absolute;
    top: 0px;
    width: 14px;
    height: 100%;
    display: inline-flex;
    margin-left: 5px;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  .vue-table .filter-wrap .icon-filter {
    width: 6px;
    height: 6px;
    display: inline-block;
    border-top: 1px solid #999;
    border-right: 1px solid #999;
    transform: rotate(135deg);
    position: absolute;
    top: 50%;
    margin-top: -4px;
  }
  .vue-table .filter-wrap .filter-ext-wrap{
    position: absolute;
    min-width: 96px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    z-index: 999;
    top: 30px;
    left: 0px;
    cursor: initial;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-content {
    max-width: 500px;
    max-height: 300px;
    overflow: auto;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-item {
    padding: 8px 16px;
    margin: 0;
    clear: both;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0,0,0,.65);
    white-space: nowrap;
    -webkit-transition: all .3s;
    transition: all .3s;
    line-height: 18px;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-item .filter-item-txt{
    margin-left: 5px;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-options {
    overflow: hidden;
    padding: 7px 16px;
    border-top: 1px solid #e9e9e9;
    font-size: 12px;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-options a{
    color: #108ee9;
    cursor: pointer;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-options a.confirm{
    float: right;
    color: #fff;
    border-radius: 2px;
    color: #666;
    margin-left: 10px;
  }
  .vue-table .filter-wrap .filter-ext-wrap .filter-options a.reset{
    color: #999;
    float: right;
  }

  .vue-table-wrap.loading{
    min-height: 100px;
  }
  .vue-table-loading {
    height: 100%;
    min-height: 100px;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: #fff;
    filter:alpha(opacity=80); /*IE滤镜，透明度50%*/
    -moz-opacity:0.8; /*Firefox私有，透明度50%*/
    opacity:0.8;/*其他，透明度50%*/
  }
  .loadEffect{
    width: 100px;
    height: 100px;
    position: relative;
    margin: 0 auto;
    margin-top: 80px;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    top: 50%;
    margin-top: -50px;
  }
  .loadEffect span{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #5b9bd1;
    position: absolute;
    -webkit-animation: load 1.04s ease infinite;
    animation: load 1.04s ease infinite;
    -webkit-transform: scale(0.3);
    transform: scale(0.3);
  }
  @-webkit-keyframes load{
    0%{
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
      opacity: 1;
    }
    100%{
      -webkit-transform: scale(.3);
      transform: scale(.3);
      opacity: 0.5;
    }
  }
  .loadEffect span:nth-child(1){
    left: 0;
    top: 50%;
    margin-top:-10px;
    -webkit-animation-delay:0.13s;
    animation-delay:0.13s;
  }
  .loadEffect span:nth-child(2){
    left: 14px;
    top: 14px;
    -webkit-animation-delay:0.26s;
    animation-delay:0.26s;
  }
  .loadEffect span:nth-child(3){
    left: 50%;
    top: 0;
    margin-left: -10px;
    -webkit-animation-delay:0.39s;
    animation-delay:0.39s;
  }
  .loadEffect span:nth-child(4){
    top: 14px;
    right:14px;
    -webkit-animation-delay:0.52s;
    animation-delay:0.52s;
  }
  .loadEffect span:nth-child(5){
    right: 0;
    top: 50%;
    margin-top:-10px;
    -webkit-animation-delay:0.65s;
    animation-delay:0.65s;
  }
  .loadEffect span:nth-child(6){
    right: 14px;
    bottom:14px;
    -webkit-animation-delay:0.78s;
    animation-delay:0.78s;
  }
  .loadEffect span:nth-child(7){
    bottom: 0;
    left: 50%;
    margin-left: -10px;
    -webkit-animation-delay:0.91s;
    animation-delay:0.91s;
  }
  .loadEffect span:nth-child(8){
    bottom: 14px;
    left: 14px;
    -webkit-animation-delay:1.04s;
    animation-delay:1.04s;
  }

  .vue-table .sort-wrap {
    position: absolute;
    top: 0px;
    width: 14px;
    height: 100%;
    display: inline-flex;
    margin-left: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .vue-table .sort-wrap .sort-up,.vue-table .sort-wrap .sort-down{
    width: 14px;
    height: 26%;
    cursor: pointer;
    position: relative;
    justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .vue-table .sort-wrap .icon-sort-up,.vue-table .sort-wrap .icon-sort-down {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }  
  .vue-table .sort-wrap .sort-up.on .icon-sort-up {
    border-bottom-color: #409eff;
  }
  .vue-table .sort-wrap .sort-down.on .icon-sort-down {
    border-top-color: #409eff;
  }
  .vue-table .sort-wrap .sort-up .icon-sort-up {
    border-bottom: 6px solid #c0c4cc;
  }
  .vue-table .sort-wrap .sort-down .icon-sort-down {
    border-top: 6px solid #c0c4cc;
  }
  @-webkit-keyframes antSlideDownIn {
      0% {
          opacity: 0;
          -webkit-transform-origin: 100% 100%;
          transform-origin: 100% 100%;
          -webkit-transform: scaleY(.8);
          transform: scaleY(.8)
      }

      to {
          opacity: 1;
          -webkit-transform-origin: 100% 100%;
          transform-origin: 100% 100%;
          -webkit-transform: scaleY(1);
          transform: scaleY(1)
      }
  }
  @media screen and (max-width: 720px) {
    .vue-table,.vue-table th {
      text-align: center;
    }
    .vue-table tbody tr td,.vue-table tbody tr th{
      border: 1px solid #dddddd;
    }
    .vue-table tbody tr th{
        background-color: #f1f1f1;
    }
    .vue-table tbody tr td {
      min-width: 110px;
    }
  }
  /*checkbox css new*/
  .checkbox-wrap{
      white-space: nowrap;
      display: inline-block;
      line-height: 1;
      position: relative;
      vertical-align: text-bottom;
  }
  .checkbox-wrap .checkbox-input{
      position:absolute;
      top:0px;
      left:0px;
  }
  .checkbox-wrap .checkbox-inner{
      position: relative;
      top: 0;
      left: 0;
      display: block;
      width: 14px;
      height: 14px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      background-color: #fff;
      -webkit-transition: all .3s;
      transition: all .3s;
      cursor: pointer;
  }
  .checkbox-wrap .checkbox-inner:after{
      -webkit-transform: rotate(45deg) scale(0);
      -ms-transform: rotate(45deg) scale(0);
      transform: rotate(45deg) scale(0);
      position: absolute;
      left: 4px;
      top: 1px;
      display: table;
      width: 5px;
      height: 8px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      content: " ";
      -webkit-transition: all .2s cubic-bezier(.12,.4,.29,1.46) .1s;
      transition: all .2s cubic-bezier(.12,.4,.29,1.46) .1s;
      
  }
  .checkbox-wrap .checkbox-input:checked + .checkbox-inner{
      background-color: #108ee9;
      border-color: #108ee9;
  }
  .checkbox-wrap .checkbox-input:checked + .checkbox-inner:after{
      -webkit-transform: rotate(45deg) scale(1);
      -ms-transform: rotate(45deg) scale(1);
      transform: rotate(45deg) scale(1);
  }
  /*checkbox css new*/
</style>

