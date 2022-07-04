# learn redux

## redux应用场景

- 随着JavaScript单页应用开发日趋复杂,管理不断变化的state 非常困难
- Redux的出现就是为了解决state里的数据问题
- 在React中，数据在组件中是单向流动的
- 数据从一个方向父组件流向子组件(通过props)，由于这个特征，两个非父子关系的组件(或者称作兄弟组件)之间的通信就比较麻烦



## redux设计思想

- Redux是将整个应用状态存储到到一个地方，称为store
- 里面保存一棵状态树state tree

- 组件可以派发dispatch行为action给store,而不是直接通知其它组件
- 其它组件可以通过订阅store中的状态(state)来刷新自己的视图







