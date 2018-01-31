Component({
  properties: {
  },
  data: {
    tabType: 'month',
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    emptyDays: 0,
    curYear: new Date().getFullYear(),
    curMonth: new Date().getMonth() + 1,
    curDay: new Date().getDate(),
    curWeek: 1,
    checkedDay: new Date().getDate(),
    fillDays: []
  },
  attached: function () {
    let { curYear, curMonth, curDay, checkedDay } = this.data;
    this.setData({
      curWeek: this.getDayWeeks(curYear, curMonth, curDay)
    })
    this.loadCalendar(curYear, curMonth)
  },
  methods: {
    toggleTab(e) {
      let { curYear, curMonth, curWeek } = this.data;
      this.setData({
        tabType: e.currentTarget.dataset.type
      })
      if (e.currentTarget.dataset.type === 'month') {
        this.loadCalendar(curYear, curMonth)
      } else if (e.currentTarget.dataset.type === 'week') {
        this.loadCalendarByWeek(curYear, curWeek)
      }
    },
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
    loadCalendarByWeek(year, week) {
      let date = new Date(`${year}-1-1`);
      let weekday_of_fistDay = date.getDay();
      let curday = date.setDate(7 * week - 6 - weekday_of_fistDay);
      curday = new Date(curday);
      this.setData({
        curWeek: week,
        curMonth: curday.getMonth() + 1,
        fillDays: this.getDaysOfWeek(year, week),
        emptyDays: []
      });
    },
    getMonthDays(year, month) { // 一个月多少天
      return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] || (this.isLeapYear(year) ? 29 : 28);
    },
    getDayNumber(year, month, day) { // 一个日期是这一年的第几天（001-366）
      day = day >>> 0;
      for (let i = 1; i < month; i++) {
        day += this.getMonthDays(year, i);
      }
      return day;
    },
    getDayWeeks(year, month, day) { // 当前天是第几周
      return Math.ceil(this.getDayNumber(year, month, day) / 7);
    },
    getDaysOfWeek(year, n) { // 获取第n周的七天
      let date = new Date(`${year}-1-1`);  // 今年第一天
      let weekday_of_fistDay = date.getDay();
      let curday = date.setDate(7 * n - 6 - weekday_of_fistDay);  // 第n周后的那一天
      curday = new Date(curday);
      let curDate = curday.getDate();  // 几号
      let curMonth = curday.getMonth() + 1; // 几月
      let days_curMonth = this.getMonthDays(year, curMonth);  // 当前月有几天
      let weekDays_array = [];
      let d;
      for (let i = 0; i < 7; i++) {
        d = curDate + i;
        if (d > days_curMonth) {
          d = d % days_curMonth;
        }
        weekDays_array.push(d)
      }
      return weekDays_array;
    },
    getWeeks_of_year(year) { // 获取一年有多少周
      year = year >>> 0;
      let day = 0;
      for (let i = 1; i < 13; i++) {
        day += this.getMonthDays(year, i);
      }
      return Math.ceil(day / 7);
    },
    isLeapYear(year) { // 是否是闰年
      year = year >>> 0;  // 参数必须是正整数
      return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
    },
    preToggle() {
      let { tabType, curYear, curMonth, curWeek } = this.data;
      if (tabType === "month") {
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
      } else if (tabType === "week") {
        curWeek = curWeek - 1;
        if (curWeek <= 0) {
          curYear = curYear - 1;
          curWeek = this.getWeeks_of_year(curYear)
        }
        this.setData({
          curYear,
          curWeek
        })
        this.loadCalendarByWeek(curYear, curWeek)
      }
    },
    nextToggle() {
      let { tabType, curYear, curMonth, curWeek } = this.data;
      if (tabType === "month") {
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
      } else if (tabType === "week") {
        curWeek = curWeek + 1;
        let maxWeek = this.getWeeks_of_year(curYear)
        if (curWeek > maxWeek) {
          curWeek = 1;
          curYear = curYear + 1;
        }
        this.setData({
          curYear,
          curWeek
        })
        this.loadCalendarByWeek(curYear, curWeek)
      }
    },
    onselect(e) {
      let { day, index } = e.target.dataset;
      let { tabType, curYear, curMonth, curWeek } = this.data;
      this.setData({
        checkedDay: day
      })
      if (tabType === 'month') {
        let eventDetail = {
          year: curYear, 
          month: curMonth, 
          day
        }
        this.triggerEvent('select', eventDetail)
      } else if (tabType === 'week') {
        let date = new Date(`${curYear}-1-1`);
        let weekday_of_fistDay = date.getDay();
        let curday = date.setDate(7 * curWeek - 6 - weekday_of_fistDay + index);
        curday = new Date(curday);
        let eventDetail = {
          year: curday.getFullYear(),
          month: curday.getMonth() + 1,
          day,
          week: curWeek
        }
        this.triggerEvent('select', eventDetail)
      }
    }
  }
})
