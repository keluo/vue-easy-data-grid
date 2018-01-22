<template>
<div>
  <div class="block"  style="width: 80%;">
    <span class="demonstration">不带操作</span>
    <code>
      
    </code>
    <vue-data-grid 
      :list-data="listData"
      :columns="columns"
      :zebra="true"
      :is-key-value="true"
      :has-operation="false">
    </vue-data-grid>
  </div>

  <div class="block"  style="width: 80%;">
    <span class="demonstration">带操作</span>
    <vue-data-grid 
      :list-data="listData"
      :columns="columns"
      :zebra="true"
      :is-key-value="true"
      :has-operation="true">
      <template slot-scope="props">
        <a href="" v-text="'编辑'"></a>
        &nbsp;
        <a href="javascript:void(0);" @click="deleteData(props.data['name'])">删除</a>
      </template>
    </vue-data-grid>
  </div>

  <div class="block"  style="width: 80%;">
    <span class="demonstration">自定义列和操作</span>
    <vue-data-grid 
      :list-data="listData"
      :columns="columnsForEdit"
      :zebra="true"
      :is-key-value="true"
      :has-operation="true">
      <template slot-scope="props">
        <a href="" v-text="'编辑'"></a>
        &nbsp;
        <a href="javascript:void(0);" @click="deleteData(props.data['name'])">删除</a>
      </template>
    </vue-data-grid>
  </div>
  <div class="block"  style="width: 80%;">
    <span class="demonstration">多选</span>
    <vue-data-grid 
      :list-data="listData"
      :columns="columnsForEdit"
      :zebra="true"
      :is-key-value="true"
      :has-operation="true"
      :selection="true"
      @on-selection-change="onSelectionChange"
      >
      <template slot-scope="props">
        <a href="" v-text="'编辑'"></a>
        &nbsp;
        <a href="javascript:void(0);" @click="deleteData(props.data['name'])">删除</a>
      </template>
    </vue-data-grid>
  </div>
  <div class="block"  style="width: 80%;">
    <span class="demonstration">显示加载中</span>
    <code>
      
    </code>
    <vue-data-grid 
      :list-data="listData"
      :columns="columns"
      :zebra="true"
      :is-key-value="true"
      :has-operation="false"
      :is-loading="isLoading">
    </vue-data-grid>
    <div class="">
      <a href="javascript:void(0);" @click="showloading">加载数据</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      listData:[{
        id:1,
        name:'张三',
        age:'18'
      },{
        id:2,
        name:'李四',
        age:'20'
      },{
        id:3,
        name:'王五',
        age:'20'
      }],
      columns:{
        id:'学号',
        name:'姓名',
        age:'年龄'
      },
      columnsForEdit:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          callback(data){
            return '<a href="javascript:void(0);">' + data['age']+'岁</a>';
          },
          click(data){
            alert(data['age']);
          }
        }
      },
      isLoading:true
    }
  },
  mounted(){
    let that = this;
    setTimeout(()=>{
      that.isLoading = false;
    },5000);
  },
  watch: {
  },
  methods: {
    deleteData(value){
      alert('删除'+value+'!');
    },
    onSelectionChange(value){
      alert(value);
    },
    showloading(){
      this.isLoading = true;
      let that = this;
      setTimeout(()=>{
        that.isLoading = false;
      },5000);
      }
  }
}
</script>
<style>
a {
  color: #5b9bd1;
  text-shadow: none;
  text-decoration: none;
  cursor: pointer;
}
a:hover{
  color: #3175af;
}
.demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
.block {
    padding: 30px 0;
    text-align: center;
    -ms-flex: 1;
    flex: 1;
}
</style>
