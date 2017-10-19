// examReport.js
const wxCharts = require('../../utils/wxcharts.js');
const { fetchReport } = require("../../utils/api.js");
const { errMsg } = require("../../utils/static.js");
const app = getApp();
let self;
let windowWidth = 320;
try {
  var res = wx.getSystemInfoSync();
  windowWidth = res.windowWidth;
} catch (e) {
  console.error('getSystemInfoSync failed!');
}
let canvas1 = new wxCharts({
  canvasId: 'canvas1',
  type: 'column',
  animation: true,
  categories: ["0-10", "10-20", "20-30", "30-40"],
  series: [{
    name: '人数',
    data: [10, 20, 30, 60],
    format: function (val, name) {
      return val + '人';
    }
  }],
  yAxis: {
    format: function (val) {
      return val + '人';
    },
    min: 0
  },
  xAxis: {
    disableGrid: true,
    type: 'calibration'
  },
  extra: {
    column: {
      width: 15
    }
  },
  width: windowWidth,
  height: 200,
});

let canvas2 = new wxCharts({
  animation: true,
  canvasId: 'canvas2',
  type: 'ring',
  extra: {
    ringWidth: 25,
    pie: {
      offsetAngle: -45
    }
  },
  title: {
    name: '100%',
    color: '#7cb5ec',
    fontSize: 25
  },
  subtitle: {
    name: '及格率',
    color: '#666666',
    fontSize: 15
  },
  series: [{
    name: '及格人数',
    data: 7,
    stroke: false
  }, {
    name: '不及格人数',
    data: 3,
    stroke: false
  }],
  disablePieStroke: true,
  width: windowWidth,
  height: 200,
  dataLabel: false,
  legend: false,
  padding: 0
});
canvas2.addEventListener('renderComplete', () => {
});
setTimeout(() => {
  canvas2.stopAnimation();
}, 500);

Page({
  data: {
    uploadid: "",//报表id
    pageState: "",//页面状态
    report: {},//报表数据
    ranges: [],//分数段范围
    rangesCount: [],//分数段人数
    passCount: 0,//及格人数
    totalCount: 0,//总人数
    chart1:null,
  },
  onLoad: function (options) {
    self = this;
    // if (options.uploadid){
    //   this.setData ({
    //     uploadid: options.uploadid,
    //   });
    // }else{
    //   wx.navigateBack({});
    //   return ;
    // }
    // this.getReport();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getReport () {
    fetchReport ({
      data: {
        uuid: app.globalData.uuid,
        uploadid: self.data.uploadid,
      },
      success (res) {
        console.log(res);
        if(res.ok){
          self.analysisData(res.report);
        } else {
          let errContent = '报表数据请求失败!';
          if (res.lang && errMsg[res.lang]) {
            errContent = errMsg[res.lang];
          }
          wx.showModal({
            title: '提示',
            content: errContent,
            showCancel: false,
            success: function (res) {
              if (res) {
                self.setData ({
                  pageState: "error",
                });
              }
            }
          })
        }
      }
    });
  },
  //数据分析
  analysisData (data) {
    //设置分数范围
    let ranges = data.range_reference.ranges;
    let scores = data.scores_ordered;
    console.log(scores);
    let rangesCount = new Array(ranges.length);
    let passCount = 0;
    for (let i = 0; i < rangesCount.length; i++) {
      rangesCount[i] = [];
    }
    for (let i = 0; i < scores.length; i++){
      if (scores[i].score >= data.fullscores * 0.6){
        passCount ++ ;
      }
      for (let j = 0; j < ranges.length;j++){
        if (scores[i].score >= ranges[j][0] && scores[i].score <= ranges[j][1]) {
          rangesCount[j].push(scores[i]);
          break;
        }
      }
    }
    //设置数据
    self.setData({
      ranges: ranges,
      rangesCount: rangesCount,
      passCount: passCount,
      totalCount: data.total,
    });
    self.uploadReportData(canvas1, self.data, "column");
    self.uploadReportData(canvas2, self.data, "ring");
  },
  //更新数据
  uploadReportData (report,data,type) {
    switch (type) {
      case "column" :
        report.updateData({
          categories: data.ranges.map(item => {
            return item.join("-");
          }),
          series: [{
            name: '分数段',
            data: data.rangesCount.map(item => {
              return item.length;
            }),
            format: function (val, name) {
              return val + '人';
            }
          }]
        });
        break;
      case "ring":
        report.updateData({
          title: {
            title: parseFloat(data.passCount / data.totalCount).toFixed(2) + "%",
          },
          series: [{
            name: '及格人数',
            data: data.passCount,
            stroke: false
          }, {
            name: '不及格人数',
            data: data.totalCount - data.passCount,
            stroke: false
          }],
        });
        break;
      default :
        break;
    }
  }
})