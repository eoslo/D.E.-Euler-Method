(function(document, window) {

    // Variables Globales
    var metodoSeleccionado = getById('de_method');
    var finalX = getById('xfinal');
    var calculateBtn = getById('calculate');
    var impresionTabla = "";
    var myChart;

    // Inicialización del Calculo 
    calculate.onclick = function() {
        var y = parseFloat(getById("yzero").value);
        var x = parseFloat(getById("xzero").value);
        var h = parseFloat(getById("h").value);
        var funcion = getById("mainEquation").value;
        impresionTabla = "";

        // Array con resultados
        var eulerArray = euler(funcion, finalX.value, x, y, h)
        var eulerMejArray = eulerMejorado(funcion, finalX.value, x, y, h)
        var rungeKutta = r4(funcion, finalX.value, x, y, h)
        var n = eulerArray.length

        // Rendering de Gráfico y Tabla:
        renderizar(eulerArray, eulerMejArray, rungeKutta);
        
        for (var i = 0; i < n; i++) {
            impresionTabla += "<tr><td>" + (i + 1) + "</td><td>" + Math.round(eulerArray[i].x * 100) / 100 + "</td><td>" + Math.round(eulerArray[i].y * 1000) / 1000 + "</td><td>" + Math.round(eulerMejArray[i].x * 100) / 100 + "</td><td>" + Math.round(eulerMejArray[i].y * 1000) / 1000 + "</td><td>"  + Math.round(rungeKutta[i].x * 100) / 100 + "</td><td>" + Math.round(rungeKutta[i].y * 1000) / 1000 + "</td></tr>";
        }
        getById("tableBody").innerHTML = impresionTabla;
    };

    // Función de Euler
    function  euler(funcion, xfinal, xinicial, yinicial, h) {
        var valores = [];
        var y = yinicial;
        var x = xinicial;
        valores.push({ x : x, y : y });
        while (x < xfinal) {
            y = y + h * evaluar(y, x, funcion);
            x = x + h;
        valores.push({ x : x, y : y });
        }
        return valores;
    }
    
    // Función de Euler Mejorado
    function eulerMejorado(funcion, xfinal, xinicial, yinicial, h) {
        var valores = [];
        var y = yinicial;
        var x = xinicial;
        var predictor;
        valores.push({ x : x, y : y });
        while (x < xfinal) {
            predictor = y + h * evaluar(y, x, funcion);
            y = y + (0.5) * (evaluar(y, x, funcion) + evaluar(predictor, x + h, funcion)) * h;
            x = x + h;
        valores.push({ x : x, y : y });
        }
        return valores;
    }

    // Función de Runge Kutta
    function r4(funcion, finalX, x, y, h){
        var fX = finalX;
        console.log(finalX, x, x < fX)
        var i = 0;
        var valores = [];
        valores.push({x : x, y : y});
        while (x < fX) {
            m1 = evaluar(y, x, funcion);
            m2 = evaluar((y + m1 * h / 2), (x + h / 2), funcion);
            m3 = evaluar((y + m2 * h / 2), (x + h / 2), funcion);
            m4 = evaluar((y + m3 * h), (x + h),funcion);
            m = ((m1 + 2 * m2 + 2 * m3 + m4) / 6);
            y = y + m * h;
            x = x + h;
            i++;
            valores.push({x : x, y : y});
        }
        return valores;
    }
    
    function  evaluar(y, x, funcion) {
        
        while(funcion.includes("sin")){
            let sin = funcion.match(/sin\((.)\)/)[1] === "x" ? Math.sin(x) : Math.sin(y);
            let variable = funcion.match(/sin\((.)\)/)[1];
            funcion = funcion.replace("sin("+variable+")",sin);
        }
        while(funcion.includes("cos")){
            let cos = funcion.match(/cos\((.)\)/)[1] === "x" ? Math.cos(x) : Math.cos(y);
            let variable = funcion.match(/cos\((.)\)/)[1];
            funcion = funcion.replace("cos("+variable+")",cos);
        }
        while(funcion.includes("sqrt")){
            let sqrt = funcion.match(/sqrt\((.)\)/)[1] === "x" ? Math.sqrt(x) : Math.sqrt(y);
            let variable = funcion.match(/sqrt\((.)\)/)[1];
            funcion = funcion.replace("sqrt("+variable+")",sqrt);
        }
        return eval(funcion);
    }

    function getById(id) {
        return document.getElementById(id);
    }

    // Función para Renderizar
    function renderizar(puntosEuler, puntosMejorado, puntosR4) {
        var ctx = document.getElementById('grafico').getContext('2d');
        let data ={
                                    datasets: [
                                    {
                                        label: "Euler",  
                                        data: puntosEuler,
                                        borderColor: 'red',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'red'
                                    },
                                    {
                                        label: "Euler Mejorado",  
                                        data: puntosMejorado,
                                        borderColor: 'orange',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'orange'
                                    },
                                    {
                                        label: "R4",  
                                        data: puntosR4,
                                        borderColor: 'green',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'green'
                                    }],     
                                };
        if(myChart){
            myChart.data = data
            myChart.update();
        }
        else{
            myChart = new Chart(ctx, {
                                options: {
                                    scales: {
                                        xAxes: [{
                                            type: 'linear',
                                            position: 'bottom',
                                            display: true,
                                            gridLines: {
                                            zeroLineColor: '#333'
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'x'
                                          }
                                        }],
                                        yAxes: [{
                                            type: 'linear',
                                            display: true,
                                            position: 'left',
                                            gridLines: {
                                            zeroLineColor: '#333'
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'y'
                                        }
                                        }],
                                    },
                                    plugins: {
                                        zoom: {
                                            pan: {
                                              enabled: true,
                                              mode: "xy",
                                              speed: 5,
                                              threshold: 10
                                            },
                                            zoom: {
                                              enabled: true,
                                              drag: false,
                                              mode: "xy",
                                              speed: 0.1,
                                              limits: {
                                                max: 5,
                                                min: 0.5
                                              }
                                            }
                                        }
                                    }
                                },
                                data: data,
                                type: 'scatter',

                            });
        }        
    }

})(document, window);
