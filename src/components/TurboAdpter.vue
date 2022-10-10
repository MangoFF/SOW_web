<template>
  <div class="logic-flow-view">
    <h3 class="demo-title">LogicFlow Turbo Adpter</h3>
    <!-- 辅助工具栏 -->
    <Control 
      class="demo-control"
      v-if="lf"
      :lf="lf"
      catTurboData=true
      @catData="$_catData"
      @catTurboData="$_catTurboData"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- 画布 -->
    <div id="LF-Turbo" ref="container"></div>
    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
    </el-dialog>
    <h4>更多示例：
      <el-button type="text" @click="goto">LogicFlow</el-button>
    </h4>
    <button  v-on:click="send_data()">发送数据处理</button>
    <button v-on:click="get_data()">得到数据</button>
    <button v-on:click="json_test()">Json通信测试</button>
    <button v-on:click="json_get()">Json接收测试</button>
    <button v-on:click="download_test()">下载测试</button>
    <li>
      <h3>添加新图：</h3>
      <input type="file" id="saveImage" name="myphoto" accept="image/png,image/gif,image/jpeg"
             ref="new_image">
      <button v-on:click="addImage">确认添加</button>
    </li>
  </div>
</template>
<script>
import LogicFlow from '@logicflow/core'
import { Snapshot, BpmnElement } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import NodePanel from './LFComponents/NodePanel'
import Control from './LFComponents/Control'
import DataDialog from './LFComponents/DataDialog'
import { toTurboData, toLogicflowData } from '../Util/AdpterForTurbo';
import { BpmnNode } from './config'
const demoData = require('./dataTurbo.json')

export default {
  name: 'LF',
   components: { NodePanel, Control, DataDialog },
  data () {
    return {
      lf: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        grid: true,
        background: {
          color: '#f7f9ff'
        },
        keyboard: {
          enabled: true
        },
      },
      nodeList: BpmnNode,
      jsonMessage:[]
    }
  },
  mounted () {
    this.$_initLf()
  },
  methods: {
    $_initLf () {
      // 画布配置
      LogicFlow.use(Snapshot)
      // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
      LogicFlow.use(BpmnElement)
      const lf = new LogicFlow({
        ...this.config,
        container: this.$refs.container
      })
      this.lf = lf
      // 设置边类型bpmn:sequenceFlow为默认类型
      lf.setDefaultEdgeType('bpmn:sequenceFlow')
      this.$_render()
    },
    $_render () {
      // Turbo数据转换为LogicFlow内部识别的数据结构
      const lFData = toLogicflowData(demoData)
      this.lf.render(lFData)
    },
    closeDialog () {
      this.$data.dialogVisible = false
    },
    $_catData(){
      this.$data.graphData = this.$data.lf.getGraphData();
      this.$data.dataVisible = true;
    },
    $_catTurboData(){
      const graphData = this.$data.lf.getGraphData();
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData)
      this.$data.dataVisible = true;
    },
    goto () {
      this.$router.push('/')
    },
    get_data:function () {
      this.$axios.get(" http://localhost:8080/hello?name=mango")
          .then(function (response)
          {
            console.log(response)
          }).catch(function (response)
      {
        console.log(response)
      })
      alert("get_data button click")
    },
    send_data:function () {
      this.$axios.post(" http://localhost:8080/hello?name=mango")
          .then(function (response)
          {
            console.log(response)
          }).catch(function (response)
      {
        console.log(response)
      })
      alert("send_data button click")
    },
    json_test:function () {

      console.log(this.$data.lf.getGraphData())
      this.JsonTest(this.$data.lf.getGraphData()).then(console.log("Json transport success"));
    },
    json_get:function(){
      console.log('开始接收JSON')
      var that = this;
      this.$axios.get(" http://localhost:8080/GetJson").then(function(res){
        that.jsonMessage = res.data;
        console.log('从后台获取的数字是'+that.jsonMessage.Number)
        console.log('从后台获取的文字是'+that.jsonMessage.Text)
      })
    },
    addImage: function () {
      let self = this;
      if (self.$refs.new_image.files.length !== 0) {
        var formData = new FormData()
        formData.append('image_data', self.$refs.new_image.files[0]);
        //单个文件进行上传
        self.$axios.post('http://localhost:8080/addImage', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(console.log('pic trans suc'))
      }
    },
    download_test(){
      const config = {
        method: 'get',
        url: 'http://localhost:8080/download',
        headers: {
          //和后端设置的一样
          'Content-Type': 'application/octet-stream;charset=UTF-8'
        },
        responseType: 'blob'
      };
      this.$axios(config).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'xxxx.zip');
        document.body.appendChild(link);
        link.click();
      })
    }

  }
}
</script>
<style>
.logic-flow-view {
  height: 100vh;
  position: relative;
}
.demo-title{
  text-align: center;
  margin: 20px;
}
.demo-control{
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 2;
}
#LF-Turbo{
  width: calc(100% - 100px);
  height: 80%;
  outline: none;
  margin-left: 50px;
}
.time-plus{
  cursor: pointer;
}
.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}
.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}
</style>

