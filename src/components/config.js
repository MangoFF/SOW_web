export const nodeList = [
  {
    text: '输入源头',
    type: 'start',
    class: 'node-start'
  },
  {
    text: '图像滤波',
    type: 'rect',
    class: 'node-rect'
  },
  {
    type: 'user',
    text: '目标检测',
    class: 'node-user'
  },
  {
    type: 'push',
    text: '圆检测',
    class: 'node-push'
  },
  {
    type: 'download',
    text: '交互框',
    class: 'node-download'
  },
  {
    type: 'connect',
    text: 'Html',
    class: 'node-push'
  },
  {
    type: 'end',
    text: '输出源',
    class: 'node-end'
  },
];

export const BpmnNode = [
  {
    type: 'bpmn:startEvent',
    text: '输入图片',
    class: 'bpmn-start'
  },
  {
    type: 'bpmn:endEvent',
    text: '图像滤波',
    class: 'bpmn-end'
  },
  {
    type: 'bpmn:exclusiveGateway',
    text: '模型识别',
    class: 'bpmn-exclusiveGateway'
  },
  {
    type: 'bpmn:userTask',
    text: '输出',
    class: 'bpmn-user'
  },
]
