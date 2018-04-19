# vue.dataGrid
> dataGrid for Vue.js

## install
```javascript
npm install vue-easy-data-grid
```

## 初始化插件
```javascript
import Vue from 'vue'
import VueDataGrid from 'VueDataGrid'
Vue.use(VueDataGrid)
```

## 使用
#### 1。基本表格
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true">
</vue-data-grid>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{ id:'学号',name:'姓名',age:'年龄' },
    }
  }
}
```
#### 2、带操作
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true"
  :has-operation="true">
  <template slot-scope="props">
    <a href="javascript:void(0);" @click="deleteData(props)">删除</a>
  </template>
</vue-data-grid>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{ id:'学号',name:'姓名',age:'年龄' },
    }
  }，
  methods:{
    deleteData(data){
      console.log(data);
    }
  }
}
```
#### 3、自定义列（只可以格式化列和为列添加一个click）
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true">
</vue-data-grid>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          //自定义时，格式化回掉函数
          formatter(data){
            return '<a href="javascript:void(0);">' + data['age']+'岁</a>';
          },
          //自定义时，点击回掉函数
          click(data){
            alert(data['age']);
          }
        }
      },
    }
  }，
  methods:{
  }
}
```
#### 4、自定义列（增强版）
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true">
  <template slot-scope="props" slot="slot-age">
    <a href="javascript:void(0);" v-text="props.data['age'] + '岁'"></a>
    <a href="javascript:void(0);" @click="showAge(props.data['age'])">点我</a>
  </template>
</vue-data-grid>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          isSlot:true
        }
      },
    }
  }，
  methods:{
    showAge(age){
      alert(age);
    }
  }
}
```
#### 5、多选
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true"
  :selection="true"
  @on-selection-change="onSelectionChange">
</vue-data-grid>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{ id:'学号',name:'姓名',age:'年龄' },
    }
  },
  methods:{
    onSelectionChange(value){
      //输出为数组，数组内对应的index选中为true，不选中为false或者没有值
      console.log(value);
    },
  }
}
``` 
#### 6、显示加载中
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true"
  :is-loading="isLoading">
</vue-data-grid>
<a href="javascript:void(0);" @click="showloading">加载数据</a>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{ id:'学号',name:'姓名',age:'年龄' },
      isLoading:true
    }
  },
  mounted(){
    let that = this;
    setTimeout(()=>{
      that.isLoading = false;
    },5000);
  },
  methods:{
    showloading(){
      this.isLoading = true;
      let that = this;
      setTimeout(()=>{
        that.isLoading = false;
      },5000);
    }
  },
}
```
#### 7、排序
##### HTML Template
```html
<vue-data-grid 
  :list-data="listData"
  :columns="columns"
  :zebra="true"
  :is-key-value="true">
</vue-data-grid>
```
##### javascript 
```javascript
export default {
  name: 'App',
  data () {
    return {
      listData:[{ id:1,name:'张三',age:'18'},{id:2,name:'李四',age:'18' }],
      columns:{
        id:'学号',
        name:'姓名',
        age:{
          name:'年龄',
          //sort:true sort亦可直接传true
          sort:{
            /*
            非必需，数组初始化时的排序，
            参数：up（正序）down（倒序）
            */
            type:'up',
            /*
            非必需，自定义排序规则，ajax调用后端，
            参数：type（同上面的参数type）key（当前的字段的key，这个是'age'）
            注意：当custom存在时，上面的type不起作用
            */
            custom(type,key){
              console.log(type,key);
            }
          }
        }
      },
    }
  }
}
```