const express = require('express')
const bodyParser = require('body-parser')
const {WebhookClient} = require('dialogflow-fulfillment');
var axios = require('axios')
const { setUncaughtExceptionCaptureCallback } = require('process');

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 3000

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response)
    
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const dialogflowFulfillment = (request, response) => {
    const agent = new WebhookClient({request, response})

    function sayHello(agent){
        agent.add("안녕안녕안녕안녕~~")
    }

    function sayName(agent){
        
        var name = agent.request_.body.queryResult.outputContexts[0].parameters['name.original']; 
        
        agent.add("[heroku]아하, 당신의 이름은 <" + name + "> 군요!!");
    }

    function getweather() {
        //아래줄 추가
        var city = "서울특별시";
        city = agent.request_.body.queryResult.outputContexts[0].parameters['city'];
        var date1 = NaN;
        var date2 = NaN;
        var date2 = agent.request_.body.queryResult.outputContexts[0].parameters['date'];
        date2 = Date.parse(date2); // dialogflow에서 넘어온 시간 in 숫자
        date1 = Date.parse(date1); // 현재 시간 in 숫자

        // 내일, 다음주 토요일등 물어본 날짜의 문자열
        var dateOriginal = agent.request_.body.queryResult.outputContexts[0].parameters['date.original'];

        if(isNaN(date2)){

            // 따로 날짜 데이터가 들어오지 않았을때 현재 날씨를 불러온다.
            var url2 = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&lang=kr&appid=aca3d57df145ee10c372ff22aefdaa56";
            url2 = encodeURI(url2);

            return axios({
                method: "GET",
                url: url2,
                data: "",
              })
                .then((response) => {
                  console.log("======================second======================")
                  var temperature = String((response.data.main.temp - 272).toFixed(1));
                  var descrip = String(response.data.weather.description)
                  console.log("=============if문 NaN감지성공===============")
                  console.log(descrip)
                  console.log(date2)
                  console.log("============================================")
                  agent.add("현재 " + city + "의 날씨는 섭씨"+ temperature + "도 이고 현재" + descrip + "입니다!"); // city 추가
                })
                .catch((error) => {
                  console.log(error);
                });
        }else{
            // 날짜 데이터가 parameter로 들어온 경우
            // forecast로 5일간 3시간 간격으로 시간을 받아온다.
            // dialogflow에서 받아오는 내일, 오늘등에서 기준이 되는 시간은 12:00임
            // 만일 현재 날씨를 알려달라고 하면 얘가 현재 시간 12:35이렇게 알려줌 - 이부분에 대한 예외처리 필요
            var url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&lang=kr&appid=aca3d57df145ee10c372ff22aefdaa56";
            url2 = encodeURI(url2);

            return axios({
                method: "GET",
                url: url2,
                data: "",
              })
                .then((response) => {
                  console.log("======================second======================")
                  var temperature = String((response.data.list[0].main.temp - 272).toFixed(1));
                  var dt = String(response.data.list[0].dt)
                  console.log("===========else문=============")
                  console.log(date1)
                  console.log(date2)
                  console.log("============================================")
                  agent.add("현재 " + city + "의 날씨는 섭씨"+ temperature + "도 입니다 !"); // city 추가
                })
                .catch((error) => {
                  console.log(error);
                });
        }

        

        // 2번째시도 axios => DEADLINE EXCEED error
        
    }

    // 인텐트와 함수를 1대1 대응 시키는 객체 intentMap
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", sayHello)
    //intentMap.set("Lecture", sayHello)
    //intentMap.set("askEmail", sayName)
    intentMap.set("Getweather-city", getweather)
    agent.handleRequest(intentMap);
}