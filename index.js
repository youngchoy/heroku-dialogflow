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
/*
    function getweather() {

        var city = "서울특별시";
        city = agent.request_.body.queryResult.outputContexts[0].parameters['city.original'];
        var date = new Date();
        var dateString = agent.request_.body.queryResult.outputContexts[0].parameters['date'];
        date = Date(dateString);

        // 2번째시도 axios => sucess
        return axios({
          method: "GET",
          url: "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=aca3d57df145ee10c372ff22aefdaa56",
          data: "",
        })
          .then((response) => {
            console.log("======================second======================")
            console.log(response.data.main.temp - 272); //Hello World
            var temperature = String(response.data.main.temp - 272)
            console.log("============================================")
            agent.add("오늘" + city + "의 날씨는 현재 섭씨"+ temperature + "입니다 !"); 
          })
          .catch((error) => {
            console.log(error);
          });
        
    }
*/
    function getweather() {
        //아래줄 추가
        var city = "서울특별시";
        city = agent.request_.body.queryResult.outputContexts[0].parameters['city'];
        var date = new Date();
        var dateString = agent.request_.body.queryResult.outputContexts[0].parameters['date'];
        var dateOriginal = agent.request_.body.queryResult.outputContexts[0].parameters['date.original'];
        date = Date(dateString);
        
        var url2 = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=aca3d57df145ee10c372ff22aefdaa56";

        url2 = encodeURI(url2)

        // 2번째시도 axios => DEADLINE EXCEED error
        return axios({
            method: "GET",
            url: url2,
            data: "",
          })
            .then((response) => {
              console.log("======================second======================")
              var temperature = String((response.data.main.temp - 272).toFixed(1));
              console.log(dateOriginal)
              console.log("============================================")
              agent.add(dateOriginal + "의 " + city + "날씨는 섭씨"+ temperature + "입니다 !"); // city 추가
            })
            .catch((error) => {
              console.log(error);
            });
    }

    // 인텐트와 함수를 1대1 대응 시키는 객체 intentMap
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", sayHello)
    //intentMap.set("Lecture", sayHello)
    //intentMap.set("askEmail", sayName)
    intentMap.set("Getweather-city", getweather)
    agent.handleRequest(intentMap);
}