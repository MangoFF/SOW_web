<template>
  <div class="logic-flow-view">
    <h3 class="demo-title">LogicFlow Vue demo</h3>
    <!-- 辅助工具栏 -->
    <Control
      class="demo-control"
      v-if="lf"
      :lf="lf"
      @catData="$_catData"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel v-if="lf" :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- 画布 -->
    <div id="LF-view" ref="container"></div>
    <!-- 用户节点自定义操作面板 -->
    <AddPanel
      v-if="showAddPanel"
      class="add-panel"
      :style="addPanelStyle"
      :lf="lf"
      :nodeData="addClickNode"
      @addNodeFinish="hideAddPanel"
      >
    </AddPanel>
    <!-- 属性面板 -->
    <el-drawer
      title="设置节点属性"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="500px"
      :before-close="closeDialog">
      <PropertyDialog
        v-if="dialogVisible"
        :nodeData="clickNode"
        :lf="lf"
        @setPropertiesFinish="closeDialog"
      ></PropertyDialog>
    </el-drawer>
    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
    </el-dialog>
    <div>
      <h4>更多示例：
        <el-button type="text" @click="goto">BpmnElement & TurboAdpter</el-button>
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

  </div>
</template>
<script>
import LogicFlow from '@logicflow/core'
// const LogicFlow = window.LogicFlow
import { Menu, Snapshot, MiniMap } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import NodePanel from './LFComponents/NodePanel'
import AddPanel from './LFComponents/AddPanel'
import Control from './LFComponents/Control'
import PropertyDialog from './PropertySetting/PropertyDialog'
import DataDialog from './LFComponents/DataDialog'
import { nodeList } from './config'

import {
  registerStart,
  registerUser,
  registerEnd,
  registerPush,
  registerDownload,
  registerPolyline,
  registerTask,
  registerConnect,
} from './registerNode'
const demoData = require('./data.json')

export default {
  name: 'LF',
   components: { NodePanel, AddPanel, Control, PropertyDialog, DataDialog },
  data () {
    return {
      lf: null,
      showAddPanel: false,
      addPanelStyle: {
        top: 0,
        left: 0
      },
      nodeData: null,
      addClickNode: null,
      clickNode: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        background: {
          backgroundColor: '#f7f9ff',
        },
        grid: {
          size: 10,
          visible: false
        },
        keyboard: {
          enabled: true
        },
        edgeTextDraggable: true,
        hoverOutline: false,
      },
      moveData: {},
      nodeList,
      jsonMessage:[]
    }
  },
  mounted () {
    this.$_initLf()
  },
  methods: {
    $_initLf () {
      // 画布配置
      const lf = new LogicFlow({
        ...this.config,
        plugins: [
          Menu,
          MiniMap,
          Snapshot
        ],
        container: this.$refs.container,
      })
      this.lf = lf
      // 设置主题
      lf.setTheme({
        circle: {
          stroke: '#000000',
          strokeWidth: 1,
          outlineColor: '#88f',
        },
        rect: {
          outlineColor: '#88f',
          strokeWidth: 1
        },
        polygon: {
          strokeWidth: 1
        },
        polyline: {
          stroke: '#000000',
          hoverStroke: '#000000',
          selectedStroke: '#000000',
          outlineColor: '#88f',
          strokeWidth: 1
        },
        nodeText: {
          color: '#000000'
        },
        edgeText: {
          color: '#000000',
          background: {
            fill: '#f7f9ff'
          }
        },
      })
      this.$_registerNode()
    },
    // 自定义
    $_registerNode () {
      registerStart(this.lf)
      registerUser(this.lf)
      registerEnd(this.lf)
      registerPush(this.lf, this.clickPlus, this.mouseDownPlus)
      registerDownload(this.lf)
      registerPolyline(this.lf)
      registerTask(this.lf)
      registerConnect(this.lf)
      this.$_render()
    },
    $_render () {
      this.lf.render(demoData)
      this.$_LfEvent()
    },
    $_getData () {
      const data = this.lf.getGraphData()
      console.log(JSON.stringify(data))
    },
    $_LfEvent () {
      this.lf.on('node:click', ({data}) => {
        console.log('node:click', data)
        this.$data.clickNode = data
        this.$data.dialogVisible = true
      })
      this.lf.on('edge:click', ({data}) => {
        console.log('edge:click', data)
         this.$data.clickNode = data
          this.$data.dialogVisible = true
      })
      this.lf.on('element:click', () => {
        this.hideAddPanel()
      })
      this.lf.on('edge:add', ({data}) => {
        console.log('edge:add', data)
      })
      this.lf.on('node:mousemove', ({data}) => {
        console.log('node:mousemove')
        this.moveData = data
      })
      this.lf.on('blank:click', () => {
        this.hideAddPanel()
      })
      this.lf.on('connection:not-allowed', (data) => {
        this.$message({
          type: 'error',
          message: data.msg
        })
      })
      this.lf.on('node:mousemove', () => {
        console.log('on mousemove')
      })
    },
    clickPlus (e, attributes) {
      e.stopPropagation()
      console.log('clickPlus', e, attributes)
      const { clientX, clientY } = e
      console.log(clientX, clientY)
      this.$data.addPanelStyle.top = (clientY - 40) + 'px'
      this.$data.addPanelStyle.left = clientX + 'px'
      this.$data.showAddPanel = true
      this.$data.addClickNode = attributes
    },
    mouseDownPlus (e, attributes) {
      e.stopPropagation()
      console.log('mouseDownPlus', e, attributes)
    },
    hideAddPanel () {
      this.$data.showAddPanel = false
      this.$data.addPanelStyle.top = 0
      this.$data.addPanelStyle.left = 0
      this.$data.addClickNode = null
    },
    closeDialog () {
      this.$data.dialogVisible = false
    },
    $_catData(){
      this.$data.graphData = this.$data.lf.getGraphData();
      this.$data.dataVisible = true;
    },
    goto () {
      this.$router.push('/TurboAdpter')
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
#LF-view{
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

