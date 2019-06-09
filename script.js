(function(document, window) {

    // Variables Globales
    var metodoSeleccionado = getById('de_method');
    var finalX = getById('final_valueX');
    var calculateBtn = getById('calculate');
    var myChart;
    // Display según metodo seleccionado
    metodoSeleccionado.onchange = function() {
        if (this.value == 1 || this.value == 2 || this.value == 3) {
            finalX.style.display = "block";
        } else {
            finalX.style.display = "none";
        }
    };

    // Inicialización del Calculo 
    calculate.onclick = function() {
        var y = parseFloat(getById("yzero").value);
        var x = parseFloat(getById("xzero").value);
        var h = parseFloat(getById("h").value);
        var funcion = getById("mainEquation").value;
        var impresionTabla = "";

        // Si se selecciona Método de Euler:
        if (metodoSeleccionado.value == 1) {
            renderizar(euler(funcion, finalX.value, x, y, h), eulerMejorado(funcion, finalX.value, x, y, h));
        }

        // Si se selecciona Método de Euler (Mejorado):
        if (metodoSeleccionado.value == 2) {
            renderizar(eulerMejorado(funcion, finalX.value, x, y, h));
        }

        // Si se selecciona el método Runge Kutta
        if (metodoSeleccionado.value == 3) {
            var fX = finalX.value;
            var i = 0;
            let valores = [];
            while (x < fX) {
                m1 = funcionEuler(x, y);
                m2 = funcionEuler((x + h / 2), (y + m1 * h / 2));
                m3 = funcionEuler((x + h / 2), (y + m2 * h / 2));
                m4 = funcionEuler((x + h), (y + m3 * h));
                m = ((m1 + 2 * m2 + 2 * m3 + m4) / 6);
                y = y + m * h;
                x = x + h;
                i++;
                valores.push({x:x,y:y});
                impresionTabla += "<tr><td>" + i + "</td><td>" + Math.round(x * 100) / 100 + "</td><td>" + Math.round(y * 1000) / 1000 + "</td></tr>";
            }
            renderizar(valores)
        }

        getById("tableBody").innerHTML = impresionTabla;
    };

    // Función de Euler individual:
    function funcionEuler(x, y) {
        result = (x - y) / (x + y);
        return result;
    }

    function calcSlope(a, b) {
        var c;
        c = a * a + b;
        return c;
    }

    function getById(id) {
        return document.getElementById(id);
    }

    // Función para renderizar
    function renderizarR4(valores){
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
                                    datasets: [{
                                        label: "R4",  
                                        data: valores,
                                        borderColor: 'red',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'red'
                                    }],     
                                },
                                type: 'scatter'
                            });
    }

    function renderizar(puntosMejorado, puntosEuler) {
        
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
                                    datasets: [{
                                        label: "Euler Mejorado",  
                                        data: puntosMejorado,
                                        borderColor: 'red',
                                        borderWidth: 2,
                                        fill: false,
                                        showLine: true,
                                        pointBackgroundColor: 'red'
                                    },
                                    {
                                        label: "Euler",  
                                        data: puntosEuler,
                                        borderColor: 'blue',
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
        while (x < xfinal)
        {
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
