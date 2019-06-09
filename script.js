(function(document, window) {

    // Variables Globales
    var metodoSeleccionado = getById('de_method');
    var finalX = getById('final_valueX');
    var calculateBtn = getById('calculate');
    var myChart;

    // Inicialización del Calculo 
    calculate.onclick = function() {
        var y = parseFloat(getById("yzero").value);
        var x = parseFloat(getById("xzero").value);
        var h = parseFloat(getById("h").value);
        var funcion = getById("mainEquation").value;
        var impresionTabla = "";

        // Si se selecciona Método de Euler:
        renderizar(euler(funcion, finalX.value, x, y, h), eulerMejorado(funcion, finalX.value, x, y, h), r4(finalX.value, x, y, h, funcion));

        getById("tableBody").innerHTML = impresionTabla;
    };

    function r4(finalX, x, y, h, funcion){
        var fX = finalX;
        console.log(finalX, x, x < fX)
        var i = 0;
        var valores = [];
        while (x < fX) {
            m1 = evaluar(y, x, funcion);
            m2 = evaluar((y + m1 * h / 2), (x + h / 2), funcion);
            m3 = evaluar((y + m2 * h / 2), (x + h / 2), funcion);
            m4 = evaluar((y + m3 * h), (x + h),funcion);
            m = ((m1 + 2 * m2 + 2 * m3 + m4) / 6);
            y = y + m * h;
            x = x + h;
            i++;
            console.log(m1, m2, m3, m4, m, y, x)
            valores.push({x:x, y:y});
        }
        return valores;
    }

    function getById(id) {
        return document.getElementById(id);
    }

    // Función para renderizar
    function renderizar(puntosEuler, puntosMejorado, puntosR4) {
        console.log(puntosMejorado, puntosEuler, puntosR4)
        var ctx = document.getElementById('grafico').getContext('2d');
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
                                    }
                                },
                                data: {
                                    datasets: [

                                    {
                                        label: "Euler",  
                                        data: puntosEuler,
                                        borderColor: 'blue',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'blue'
                                    },
                                    {
                                        label: "Euler Mejorado",  
                                        data: puntosMejorado,
                                        borderColor: 'red',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'red'
                                    },
                                    {
                                        label: "R4",  
                                        data: puntosR4,
                                        borderColor: 'orange',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'blue'
                                    }],     
                                },
                                type: 'scatter'
                            });
    }

    function eulerMejorado(funcion, xfinal, xinicial, yinicial, h) {
        var list = [];
        var y = yinicial;
        var x = xinicial;
        var predictor;
        console.log("Cuando x es: "+x+" / y es: "+y);
        list.push({ x : x, y : y });
        while (x < xfinal) {
            predictor = y + h * evaluar(y, x, funcion);
            y = y + (0.5) * (evaluar(y, x, funcion) + evaluar(predictor, x + h, funcion)) * h;
            x = x + h;
        console.log("Cuando x es: "+x+" / y es: "+y);
            list.push({ x : x, y : y });
        }
        return list;
    }

    function  euler(funcion, xfinal, xinicial, yinicial, h) {
        var list = [];
        var y = yinicial;
        var x = xinicial;
        list.push({ x : x, y : y });
        while (x < xfinal) {
            y = y + h * evaluar(y, x, funcion);
            x = x + h;
        console.log("Cuando x es: "+x+" / y es: "+y);
            list.push({ x : x, y : y });
        }
        return list;
    }

    function  evaluar(y, x, funcion) {
        return eval(funcion);
    }

})(document, window);
