Component({
  properties: {
  },
  data: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    emptyDays: [],
    curYear: new Date().getFullYear(),
    curMonth: new Date().getMonth() + 1,
    curDay: new Date().getDate(),
    checkedDay: new Date().getDate(),
    fillDays: []
  },
  attached: function () {
    let { curYear, curMonth } = this.data;
    this.loadCalendar(curYear, curMonth)
  },
  methods: {
    loadCalendar(year, month) {
      let days = this.getMonthDays(year, month);
      let fillDays = [];
      for (let i = 0; i < days; i++) {
        fillDays.push(i + 1)
      }
      this.setData({
        curYear: year,
        curMonth: month,
        fillDays: fillDays,
        emptyDays: new Date(`${year}-${month}-1`).getDay()
      })
    },
    getMonthDays(year, month) { // 一个月多少天
      return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] || (this.isLeapYear(year) ? 29 : 28);
    },
    isLeapYear(year) { // 是否是闰年
      year = year >>> 0;  // 参数必须是正整数
      return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
    },
    preToggle() {
      let { curYear, curMonth } = this.data;
      curMonth = (curMonth - 1) % 12;
      if (curMonth === 0) {
        curMonth = 12;
        curYear--;
      }
      this.setData({
        curMonth,
        curYear
      })
      this.loadCalendar(curYear, curMonth)
    },
    nextToggle() {
      let { curYear, curMonth } = this.data;
      curMonth = (curMonth + 1) % 13;
      if (curMonth === 0) {
        curMonth = 1;
        curYear++;
      }
      this.setData({
        curMonth,
        curYear
      })
      this.loadCalendar(curYear, curMonth)
    },
    onselect(e) {
      let { day, index } = e.target.dataset;
      let { curYear, curMonth } = this.data;
      this.setData({
        checkedDay: day
      })
      let eventDetail = {
        year: curYear, 
        month: curMonth, 
        day
      }
      this.triggerEvent('select', eventDetail)
    }
  }
})
