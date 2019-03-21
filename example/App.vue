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
      :is-key-value="true">
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
    <span class="demonstration">自定义列（只可以格式化列和为列添加一个click）</span>
    <vue-data-grid 
      :list-data="listData"
      :columns="columnsForEdit"
      :zebra="true"
      :is-key-value="true">
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
  <div class="block"  style="width: 80%;">
    <span class="demonstration">排序</span>
    <code>
      
    </code>
    <vue-data-grid 
      :list-data="listData"
      :columns="columnsForSort"
      :zebra="true"
      :is-key-value="true"
      >
    </vue-data-grid>
  </div>
  <div class="block"  style="width: 80%;">
    <span class="demonstration">自定义列（增强版）</span>
    <vue-data-grid 
      :list-data="listData"
      :columns="columnsForSlot"
      :zebra="true"
      :is-key-value="true">
      <template slot-scope="props" slot="slot-age">
        <a href="javascript:void(0);" v-text="props.data['age'] + '岁'"></a>
        <a href="javascript:void(0);" @click="showAge(props.data['age'])">点我</a>
      </template>
    </vue-data-grid>
  </div>
  <div class="block"  style="width: 80%;">
    <span class="demonstration">字段的过滤</span>
    <vue-data-grid 
      :list-data="listData"
      :columns="columnsForFilter"
      :zebra="true"
      :is-key-value="true">
    </vue-data-grid>
  </div>
  <div class="block"  style="width: 80%;">
    <span class="demonstration">显示加载中</span>
    <code>
      
    </code>
    <vue-data-grid 
      :list-data="moveData"
      :columns="columns"
      :zebra="true"
      :is-key-value="true"
      :has-operation="true"
      style="float:left;width: 45%;">
      <template slot-scope="props">
        <a href="javascript:void(0);" @click="moveToData(props.data)">左移</a>
      </template>
    </vue-data-grid>
    <vue-data-grid 
      :list-data="moveNewData"
      :columns="columns"
      :zebra="true"
      :is-key-value="true"
      :has-operation="true"  style="float:right;width: 45%;">
      <template slot-scope="props">
        <a href="javascript:void(0);" @click="deleteToData(props.data,props.index)">移除</a>
      </template>
    </vue-data-grid>
  </div>
</div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      moveData:[{
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
      moveNewData:[],
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
        age:{
          name:'年龄'
        }
      },
      columnsForEdit:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          formatter(data){
            return '<a href="javascript:void(0);">' + data['age']+'岁</a>';
          },
          click(data){
            alert(data['age']);
          }
        }
      },
      columnsForSort:{
        id:{
          name:'学号',
          sort:{
            support:'down',
            custom:function(type,key,currentType){
              console.log(key,type,currentType);
            }
          }
        },
        name:{
          name:'姓名',
          sort:true,
        },
        age:{
          name:'年龄',
          sort:{
            type:'down',
            custom:function(type,key,currentType){
              console.log(key,type,currentType);
            }
          }
        }
      },
      columnsForSlot:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          isSlot:true
        }
      },
      columnsForFilter:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          'filter':['18','20'],
          'filterValue':[]
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
      console.log(value);
    },
    showloading(){
      this.isLoading = true;
      let that = this;
      setTimeout(()=>{
        that.isLoading = false;
      },5000);
      },
    moveToData(data){
      this.moveNewData.push(data);
    },
    deleteToData(data,index){
      this.moveNewData.splice(index,1);

    },
    showAge(age){
      alert(age);
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
