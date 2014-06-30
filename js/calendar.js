function layOutDay(events) {
    if(events.length<1){
        throw new Error ("No events passed in");
    }

    //sorting out the array by start time;
    events.sort(function(a,b){
        if( a.start == b.start ) return 0;
        return (a.start > b.start) ? 1 : -1;
    });
    
    //default options
    var _defaults = {
        myDay: new Date(),
        startHour: 9,
        endHour: 21,
        minDuration: 30, //minutes
        classes: {
            timeLineContainer: 'timeline',
            hour: 'time',
            halfHour: 'halfHour',
            meridian: 'meridian'
        },
        html: {
            timeLineContainer: 'ul',
            timeLineItem: 'li'
        }
    };

    var getMiliTime = function(h){
        var tempDay = _defaults.myDay.setHours(h,0,0);
        return tempDay;
    };

    var makeHtml = function(tag){
        return document.createElement(tag);
    };

    var dailyBreakdown = function(){
        var intMili = _defaults.minDuration*60*1000, //interval converted to milliseconds
            i = getMiliTime(_defaults.startHour),
            rangeEnd = getMiliTime(_defaults.endHour),
            hUl = makeHtml(_defaults.html.timeLineContainer),
            timelineContainer = document.getElementsByClassName(_defaults.classes.timeLineContainer)[0],
            totalMinutes = 0,
            d,h,m,
            meridian = 'AM',
            timeLi;

        timelineContainer.appendChild(hUl);
        for(;i<=rangeEnd;i+=intMili){
            d = new Date(i);
            h = d.getHours();
            m = d.getMinutes();
            totalMinutes = (h-9)*60;
            if(m === 30){
                totalMinutes+=30;
            }
            
            meridian = (h < 12) ? 'AM' : 'PM';
            meridian = '<span class="meridian">' + meridian + '</span>';
            
            timeLi = makeHtml(_defaults.html.timeLineItem);
            timeLi.className = _defaults.classes.hour;         
            
            if(m==30){
                timeLi.className = _defaults.classes.hour + ' ' + _defaults.classes.halfHour;            
                meridian = '';
            }

            h = (h > 12 ) ? h-12 : h; //convert hour to single digit
            if(m < 10) m = '0' + m; // add leading 0 to single digit minutes
            
            timeLi.innerHTML =  h + ':' + m + meridian; //set html
            hUl.appendChild(timeLi); //add element to dom.
        }
    };

    var getEvents = function(){
        var e=0, 
            evLength = events.length,
            group = 1,
            start, nextStart, nextEnd;

        for(;e<evLength-1;e++){
            start = events[e].start;
            nextStart = events[e+1].start;
            nextEnd = events[e+1].end;
            
            if( nextStart >= start && nextStart < events[e].end){
                events[e].class = 'group-'+group;
                events[e+1].class = 'group-'+group;
            } else {
                group++;
            }
        }        
    };

    var countMe = function(prop,value){
        var count = 0,
            i = 0;
        for(;i < events.length;i++){
            if(events[i].hasOwnProperty(prop) && events[i][prop] == value){
                count++;
            }
        }
        return count;
    };

    var init = (function(){
        dailyBreakdown();
        getEvents();
        var e=0,
            evLength = events.length,
            lcount = 0,
            ev, evDuration, eDiv, 
            numEvents, divPadding, divWidth, divLeft, divHeight;
        for(;e < evLength;e++){
            ev = events[e];
            evDuration = ev.end - ev.start;
            eDiv = makeHtml('div');
            if(ev.hasOwnProperty('class')){
                //divide them up
                eDiv.className = 'split ';
                numEvents = countMe('class', ev.class);
                divPadding = 20;
                divWidth = Math.floor((600-divPadding) / numEvents);
                divLeft = (lcount > 0) ? (divWidth * lcount) + (10 * lcount) : divWidth * lcount;

                eDiv.style.width = divWidth + "px";
                eDiv.style.left =  divLeft + "px";
                lcount++;
            } else lcount=0;

            divHeight = (evDuration / 30) * 30;

            eDiv.className+= 'event';
            eDiv.style.top = (ev.start / 30 ) * 30 + 'px';
            eDiv.style.height = divHeight + 'px';
            eDiv.innerHTML = '<span class="title">Sample Item</span><span class="location">Sample Location</span>';

            document.getElementsByClassName('events')[0].appendChild(eDiv);
        }
    })();
}   

var eventsInput = [{start:180, end: 190},{start:190, end: 210},{start:210, end:250}, {start: 30, end: 150}, {start: 240, end: 450},{start: 300, end: 450},{start:455, end: 535},{start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
layOutDay(eventsInput);