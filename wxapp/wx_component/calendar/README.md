### 基于微信小程序的日历组件

> 可以以每月或者每周的方式呈现日历

#### 快速上手

- mkdir calendar

- cd calendar

- git init

- git remote add -f origin https://github.com/luyuchen627/vins.git

- git config core.sparsecheckout true // 设置允许克隆子目录

- echo '/wxapp/wx_component/calendar' >> .git/info/sparse-checkout // 设置要克隆的仓库的子目录路径

- git pull origin master

#### 页面中使用

1. 在需要的页面（例如index）的json文件中引入组件

```
  {
    "usingComponents": {
      "calendar": "/components/calendar/calendar"
    },
  }
```

2. 在页面载入日历组件,同时监听日历选中事件（index.wxml）

```
<calendar bind:select="onselect"></calendar>
```

3. 实现选中事件（index.js）

```
Page({
  data: {
  },
  // 事件处理函数
  onLoad: function () {
  },
  // 监听选中事件
  onselect(e) {
    let { year, month, day, week} = e.detail;
    let showContent = `${year}-${month}-${day}`;
    if (week) {
      showContent += ` | 第${week}周`
    }
    wx.showModal({
      title: '选择的时间',
      content: showContent,
    })
  }
})
```
