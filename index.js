const express = require('express')
const bodyParser = require('body-parser')
const {WebhookClient} = require('dialogflow-fulfillment');
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

    function getwe(agetn){
        const getJSON = function(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function(){
                //접속이 성공이면 null 반환, 그 외에는 status값 반환
                const status = xhr.status;
                if(status == 200){
                    callback(null, xhr.response);
                }else {
                    callback(status, xhr.response);
                }
            };
            xhr.send
        };

        getJSON("http://api.openweathermap.org/data/2.5/forecast?q="+city+"&APPID=25a0d91f0eda1fe617efca8571041caf",
            function(err, data){
                // null값이 아니면 err
                if(err !== null){
                    alert('예기치 못한 오류 발생!' + err);
                }else{
                    agent.add("현재 온도는 ${data.main.temp)도 입니다");
                }
            }
        );
    }

    /*
    function getweathercity(agent){
        var request = require('request');
        var city = "서울특별시";
        city = agent.request_.body.queryResult.outputContexts[0].parameters['city.original'];
        var dateString = agent.request_.body.queryResult.outputContexts[0].parameters['date.original'];
        var date = new Date(dateString);
        var month = date.getMonth();
        var day = date.getDate();

        if (city == null){
            city = "Seoul"
        }
 
        request("http://api.openweathermap.org/data/2.5/forecast?q="+city+"&APPID=25a0d91f0eda1fe617efca8571041caf",function(error, reponse, body){
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body)
            var obj = JSON.parse(body);
            var list = obj.list[0];console.log("total length: "+obj.list.length);
            var tempDate = new Date("2021-05-09T12:00:00+08:00");
            console.log('tempdate month is ' + tempDate.getMonth());

            var s = ""
            var description = "none found";
            for (var i = 0;i<obj.list.length;i++){
                var date = new Date(obj.list[i].dt * 1000);
                var s = ""
                var description = "none found";
                for (var i = 0;i<obj.list.length;i++){
                    var date = new Date(obj.list[i].dt);
                    var weather = obj.list[i].weather[0].description;
                    if(date.getMonth() == month && date.getDate() == day)
                    {
                        description = weather;
                        description = description + " " + date.toString();
                    }
                }
                // s = s + date + " " + weather;
            }
            agent.add("날씨는 다음과 같다: " + description);
        });
    }
    */

    // 인텐트와 함수를 1대1 대응 시키는 객체 intentMap
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", sayHello)
    //intentMap.set("Lecture", sayHello)
    //intentMap.set("askEmail", sayName)
    intentMap.set("Getweather-city", getwe)
    agent.handleRequest(intentMap);
}