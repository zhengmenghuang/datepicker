function Datepicker() {
    var monthDate, $wrapper, that = this;
    this.getMonthDate = function (year, month) {
        var ret = [];
        //如果没有传入年月，则获取当前年月
        if(!year || !month){
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }
        //获取本月的第一天所在的年份月份日期
        var firstDay = new Date(year, month - 1, 1);
        year = firstDay.getFullYear();
        month = firstDay.getMonth() + 1;
        //判断当天是周几
        var firstDayWeekDay = firstDay.getDay();
        //修正星期天显示为0
        if(firstDayWeekDay === 0) firstDayWeekDay = 7;
        //获取上个月的最后一天
        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();
        //获取上个月应该显示的天数
        var preMonthDayCount = firstDayWeekDay - 1;
        //获取当月的最后一天
        var lastDay = new Date(year, month, 0);
        var lastDate = lastDay.getDate();
        //循环获取当前月的每一天
        for(var i=0; i<42; i++){
            //算出真实日期是多少(只看day 不考虑month)
            var date = i - preMonthDayCount +1;
            var showDate = date;
            //指定当前月
            var thisMonth = month;
            //处理上一月与下一月
            if(date <= 0){
                //上一月
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            }else if(date > lastDate){
                //下一月
                thisMonth = month + 1;
                showDate = showDate - lastDate;
            }
            //修正月显示
            if(thisMonth === 0) thisMonth =12;
            if(thisMonth === 13) thisMonth = 1;
            //返回相关数据
            ret.push({
                month:thisMonth,
                date:date,
                showDate:showDate
            });
        }
        return {
            year:year,
            month:month,
            days:ret
        };
    };
    this.buildUi = function (year, month) {
        monthDate = this.getMonthDate(year, month);
        var html = '<div class="ui-datepicker-header">' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
            '<span class="ui-datepicker-curr-month">'+ monthDate.year + '-' + monthDate.month + '</span>' +
            '</div>' +
            '<div class="ui-datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for(var i=0; i<42; i++){
            var date = monthDate.days[i];
            if(i%7 === 0){
                html += '<tr>';
            }
            var nowMonth, className;
            if(Number(date.showDate) > Number(date.date)){
                nowMonth = monthDate.month - 1;
                className = "ui-datepicker-bggary";
            }else if(date.showDate === date.date){
                nowMonth = monthDate.month;
                if((new Date()).getDate() === date.date && (new Date()).getMonth() + 1 === monthDate.month && (new Date()).getFullYear() === monthDate.year){
                    className = "ui-datepicker-bgnow";
                }else {
                    className = "ui-datepicker-bgdefault";
                }
            }else {
                nowMonth = monthDate.month + 1;
                className = "ui-datepicker-bggary";
            }
            html += '<td class="'+ className +'" data-date="' + monthDate.year + '-' + nowMonth + '-' + date.showDate + '">' + date.showDate + '</td>';
            if(i%7 === 6){
                html += '</tr>';
            }
        }
        html += '</tbody></table></div>';
        return html;
    };
    this.render = function (year, month) {
        var html = this.buildUi(year, month);
        if(!$wrapper){
            $wrapper = document.createElement("div");
            $wrapper.className = "ui-datepicker-wrapper";
            document.body.appendChild($wrapper);
        }
        $wrapper.innerHTML = html;
    };
    this.init = function (input, year, month) {
        this.render(year, month);
        var $input = document.querySelector(input);
        $input.addEventListener("click",function () {
            if($wrapper.classList.contains("ui-datepicker-wrapper-show")){
                $wrapper.classList.remove("ui-datepicker-wrapper-show");
            }else {
                $wrapper.classList.add("ui-datepicker-wrapper-show");
                var left = $input.offsetLeft,
                    top = $input.offsetTop,
                    height = $input.offsetHeight;
                $wrapper.style.top = top +height + 2 + "px";
                $wrapper.style.left = left + "px";
            }
        },false);
        $wrapper.addEventListener("click",function (e) {
            var $target = e.target;
            if(!$target.classList.contains("ui-datepicker-btn")){return false}
            if($target.classList.contains("ui-datepicker-prev-btn")){
                //上一月
                if(monthDate.month === 1){
                    year = monthDate.year - 1;
                    month = 12;
                }else {
                    year = monthDate.year;
                    month = monthDate.month - 1;
                }
                that.render(year, month);
            }else {
                //下一月
                if(monthDate.month === 12){
                    year = monthDate.year + 1;
                    month = 1;
                }else {
                    year = monthDate.year;
                    month = monthDate.month + 1;
                }
                that.render(year, month);
            }
        });
        $wrapper.addEventListener("click",function (e) {
            var $target = e.target;
            if($target.tagName.toLowerCase() !== "td"){return false}
            if($target.classList.contains("ui-datepicker-bggary")){return false}
            $input.value = $target.getAttribute("data-date");
            $wrapper.classList.remove("ui-datepicker-wrapper-show");
        })
    }
}
