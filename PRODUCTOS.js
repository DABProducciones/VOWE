var app = angular.module("app", ['agGrid','ngDialog']);


app.controller ('Formulario' , function ($scope,$http,ngDialog){
    var bl=0;
    $scope.logID = localStorage.getItem("logID"); //recupera ID del user logueado


    // AJAX CON ANGULAR  DE ALEX buscar productos.

    $scope.ACC ={ACC:"3"};
    $scope.ACC.ID= localStorage.getItem("logID");

    dd='datos='+JSON.stringify($scope.ACC);
    //console.log($scope.ACC);
    //console.log(dd);
    $http.post('acciones.php',dd,{"headers":{"Content-Type": "application/x-www-form-urlencoded"}})
     .then(
     function(DATA){
        //console.log("LLEGO LA INFO BIEN!, PUEDE ESTAR VACIA PERO PHP NO TIRO ERROR");
        //console.log(DATA.data);
        $scope.DATA = DATA.data;
        $scope.llenargrilla();
     },
     function(DATA){
        //ERRROR!!!
        console.log(DATA.data);
     });


    //esta funcion llena la grilla cabecera dinamica y datos
    $scope.llenargrilla = function() {
        var obj = {};

        // cuando esten los datos se llena la grilla.
        if ($scope.DATA===undefined){
            return;
        }else{
            if (bl==0){                //blanquea por unica vez
                $scope.rowData=[];
                $scope.columnDefs=[];
                bl=1;
            }

        }


        //carga de la cabecera

        $scope.columnDefs.push({headerName: 'ID',
            field: 'ID'
            //pinned:'left',
            //width:110,
            //suppressMovable:true,
            //cellStyle: {color: 'black', 'background-color': 'lightgrey'}
        });

        $scope.columnDefs.push({headerName: 'Imagen',
            field: 'img'
            //pinned:'left',
            //width:110,
            //suppressMovable:true,
            //cellStyle: {color: 'black', 'background-color': 'lightgrey'}
        });

        $scope.columnDefs.push({headerName: 'Descripcion',
            field: 'desc'
            //pinned:'left',
            //width:110,
            //suppressMovable:true,
            //cellStyle: {color: 'black', 'background-color': 'lightgrey'}
        });

        $scope.columnDefs.push({headerName: 'Precio',
            field: 'Precio'
            //pinned:'left',
            //width:110,
            //suppressMovable:true,
            //cellStyle: {color: 'black', 'background-color': 'lightgrey'}
        });

        $scope.columnDefs.push({headerName: 'Activo',
            field: 'Act'
            //pinned:'left',
            //width:110,
            //suppressMovable:true,
            //cellStyle: {color: 'black', 'background-color': 'lightgrey'}
        });

        //console.log($scope.columnDefs);




        //generando las filas de los productor
        for (var i=0;i<$scope.DATA.length;i++){
            imagen = $scope.DATA[i].B64.replace(/~/g, "\+");
            console.log('<img src=\'' + imagen + '\' alt="image" border="0">');
            obj = JSON.parse('{"ID":"' + $scope.DATA[i].ID +
                            '","img":"' + '<img src=\'' + imagen + '\' alt="image" border="0">' +
                            '","desc":"' + $scope.DATA[i].DES +
                            '","Precio":"' + $scope.DATA[i].PRECIO +
                            '","Act":"' + $scope.DATA[i].BAJA +

                            '"}');
            $scope.rowData.push(obj);

        }
        console.log($scope.rowData);



        $scope.G.api.setRowData($scope.rowData);
        $scope.G.api.setColumnDefs($scope.columnDefs);

    };

    //esta funcion completa los colores de las celdas
    function numberParser(params) {
        var newValue = params.newValue;
        var valueAsNumber;
        if (newValue === null || newValue === undefined || newValue === '') {
            valueAsNumber = null;
        } else {
            valueAsNumber = parseFloat(params.newValue);
        }
        return valueAsNumber;
    }


    //esta funcion guarda el formulario
    $scope.GUA = function(){
        //if(!$("#FRM").valid()){ //si no esta validado sale de la funcion
        //    return;
        //}

        //todo VALIDACIONES!

        if((!$scope.INS.FECH | !$scope.INS.HH) && $scope.FRM.$valid) { //si no estan llenas las variables da alerta y sale de la funcion

            //todo Tirale una alerta o lo que queiras
            //alert("Complete el paso numero 4");
            ngDialog.openConfirm({
                template:
                        '<h2>Complete el paso Número 5:</h2>' +
                        '<h3>Elija la fecha de instalación.</h3>' +
                        '<div class="ngdialog-buttons">' +
                        '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm()">OK' +
                        '</button>' +
                        '</div>',
                plain: true
            });

            return;
        }
        if((!$scope.INS.FECH || !$scope.INS.HH) && $scope.INS.OK){ //si no estan llenas las variables da alerta y sale de la funcion
            //todo Tirale una alerta o lo que queiras
            //alert("Seleccione una fecha valida!");
            ngDialog.openConfirm({
                template:
                '<h2>Seleccione una fecha valida!</h2>' +
                '<div class="ngdialog-buttons">' +
                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm()">OK' +
                '</button>' +
                '</div>',
                plain: true
            });
            return;
        }

        if (!$scope.FRM.$valid){return;}

        if ($scope.INS.SUC !== undefined){$scope.INS.EMP+= " " + $scope.INS.SUC;}

        //TODO SI TODO ok gUARDAMOS!
        dd='datos='+JSON.stringify($scope.INS);
        $http.post('instalaciones.php',dd,{"headers":{"Content-Type": "application/x-www-form-urlencoded"}})
            .then(
                function(DATA){
                    //LLEGO LA INFO BIEN (PUEDE ESTAR VACIA PERO PHP NO TIRO ERROR)

                    //alert("GUADADO CON EXITO!!!! TU NUMERO DE INSTALACION ES: " + DATA.data);


                    /*ngDialog.openConfirm({
                        template:
                    '<h2>Formulario de instalacion creado con exito!</h2>' +
                    '<h3>Su numero de Guia es :</h3><h2>'+DATA.data+'</h2>',
                        plain:true });
                        */
                    console.log(DATA.data.length);
                    CUERPO='<h2>Formulario de instalacion creado con exito!</h2>' +
                        '<h3>Su numero de Guia es :</h3><h2>'+DATA.data[0]+'</h2>' +
                        '<h2>Datos del Turno tomado:</h2>'+
                        '<h4>Empresa: '+DATA.data[1]+'</h4>'+
                        '<h4>Contacto: '+DATA.data[2]+'</h4>'+
                        '<h4>Telefono: '+DATA.data[3]+'</h4>'+
                        '<h4>Mail: '+DATA.data[4]+'</h4>'+
                        '<h4>Fecha: '+DATA.data[11]+'/'+DATA.data[12]+'/'+DATA.data[13]+'</h4>'+
                        '<h4>Turno: '+DATA.data[14]+'Hs.</h4>';
                    CUERPO1='<P>Se enviarán a su email los datos del formulario. y el día de su turno será contactado por el Personal de OTECNO para realizar la instalación.</br></P>';
                    CUERPO2= '<P>Verifique que: El PC donde se realizará la instalación este encendido, tenga servicio de internet y TeamViewer esté abierto. Muchas Gracias</P>';

                    if (DATA.data.length<50){ //cuando el array de devolucion no viene sano posee mas de 15 registros 615 normalmente. esto es por algun error en la escritura del SQL.
                        ngDialog.openConfirm({template:CUERPO+CUERPO1+CUERPO2+
                        '<div class="ngdialog-buttons">' +
                        '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK' +
                        '</button>' +
                        '</div>',
                            plain: true,
                            closeByDocument: false,
                            closeByEscape: false
                        }).then(function (confirm) {
                            //alert("Enviar mail a:"+DATA.data[4]);

                            $scope.MAIL = {PARA:DATA.data[4]};
                            console.log($scope.MAIL.PARA);
                            $scope.MAIL.NPARA = DATA.data[1];
                            console.log($scope.MAIL.NPARA);
                            $scope.MAIL.DE = "soporte@otecno.com";
                            $scope.MAIL.NDE = "Soporte Técnico Otecno";
                            $scope.MAIL.RESP = "soporte@otecno.com";
                            $scope.MAIL.NRESP = "Soporte Otecno";
                            $scope.MAIL.TITULO = 'Turno ' + DATA.data[0] + ' instalación Otecno';
                            $scope.MAIL.TEXTO = "Texto del cuerpo del mensaje";
                            $scope.MAIL.HTML =CUERPO+CUERPO2;
                            //$scope.MAIL.FILE = $scope.PAG.ADJUNTO;
                            //$scope.MAIL.B64 = $scope.PAG.B64;
                            //console.log($scope.PAG.ADJUNTO);
                            //console.log($scope.PAG.B64);

                            dd = 'datos=' + JSON.stringify($scope.MAIL);
                            $http.post('envmail.php', dd, {"headers": {"Content-Type": "application/x-www-form-urlencoded"}})
                                .then(
                                    function (DATA) {
                                        console.log("Envio del E-Mail:"+DATA.statusText);
                                        //if(DATA.statusText!="OK"){alert("falla al enviar el E-mail")}else{alert("mail enviado con exito")}
                                        window.close();
                                    },
                                    function (DATA) {
                                        //ERRROR!!!
                                        console.log(DATA.data);
                                        alert("error : " + DATA.data);
                                    })
                            window.close();

                        }, function(reject) {
                            //alert('El turno ya fue tomado y guardado en la base de datos, desde este punto no puede rechazar el turno. Si desea cancelarlo o realizar alguna otra accion por favor comuniquese con oporte tecnoco al 011 5368 5892 Gracias.')
                            ngDialog.openConfirm({
                                template:
                                '<h2>El turno ya fue tomado y guardado en la base de datos, desde este punto no puede rechazar el turno. Si desea cancelarlo o realizar alguna otra acción por favor comuniquese con soporte tecnico al 011 5368 5892 Gracias.</h2>' +
                                '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm()">OK' +
                                '</button>' +
                                '</div>',
                                plain: true,
                                closeByDocument: false,
                                closeByEscape: false
                            }).then(function (confirm) {
                                    //alert("el turno fue tomado acept");
                                    window.close();
                                },
                                function(reject) {
                                    //alert("el  turno fue tomado reject");
                                    window.close();
                                }
                            );

                        });
                    }else{
                        //alert('Array de retorno roto')
                        ngDialog.openConfirm({
                            template:
                            '<h2>Error Break Array return!.#'+DATA.data.length+'</h2>' +
                            '<div class="ngdialog-buttons">' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm()">OK' +
                            '</button>' +
                            '</div>',
                            plain: true,
                            closeByDocument: false,
                            closeByEscape: false
                        }).then(function (confirm) {
                                //alert("el turno fue tomado acept");
                                window.close();
                            },
                            function(reject) {
                                //alert("el  turno fue tomado reject");
                                window.close();
                            }
                        );
                    }



                    //blanqueo del formulario
                    $scope.rowData[xrow[0].data.ID][fechasel]=1;
                    $scope.G.api.setRowData($scope.rowData);

                    $scope.INS={};
                    $scope.F742=false;
                    fant="";
                    cant="";
                    fechasel="";
                    dant="";
                    celldato="";
                    //todo cerrar esta pagina y abrir index.


                },
                function(DATA){
                    //ERRROR!!!
                    console.log(DATA.data);
                });


    }

    var row_sel = function (g, xpos) {
        g.api.forEachNode(function (node) {
            if (node.childIndex === xpos) {node.setSelected(true, true);}
        });
    };

/*
    //esta funcion devuelve el turno y fecha seleccionadas.
    $scope.SEL = function(){

        //guarda datos de selecciona anterior
        if (fechasel !== undefined){

            fant=xrow[0].data.ID;
            cant=fechasel;
            dant=celldato;


            //escribe el dato original de la celda ante nuevo click
            $scope.rowData[fant][cant]=dant;
        }

        //seleccion de celda
        xrow=$scope.G.api.getSelectedNodes();   //fila seleccionada
        if (xrow.length!==0){  // exepcion no se puede seleccionar el titulo
            fechasel=$scope.G.api.getFocusedCell().column.colDef.field;     //fecha completa seleccionada o columna
            if (fechasel!=="turno"){ //exepcion no se puede seleccionar la primer columna
                horario=xrow[0].data.turno;             //turno seleccionado
                nfechsel=$scope.G.api.getFocusedCell().column.colDef.headerName;//cabecera de fecha seleccionada
                celldato=$scope.rowData[xrow[0].data.ID][fechasel]  //dato de la fecha seleccionada
                oldxrow=xrow;
                oldfechasel=fechasel;
            }else{
                fechasel=oldfechasel;
                xrow=oldxrow;
            }

        }else{
            xrow=oldxrow;

        }



        if(dant!==celldato){$scope.INS.OK="";}

        $scope.INS.FECH = fechasel;
        $scope.INS.HH = horario;
        $scope.PRECIO=P[0];

        switch (celldato) {
            case undefined:
                $scope.mensaje="";
                break;

            case 0: //selecciono Domingo
                $scope.mensaje="Los turnos de domingo tienen costo extra";
                $scope.PRECIO=P[1];

                break;

            case 6: //selecciono Sabado
                $scope.mensaje="Los turnos de Sabado tienen costo extra";
                $scope.PRECIO=P[2];
                break;

            case 7: //selecciono Feriado
                $scope.mensaje="Los turnos de Feriado tienen costo extra";
                $scope.PRECIO=P[3];
                break;

            case 1: //selecciono ya Utilizado.
            case 2: //fecha utilizada falsa.
            case 4: //fecha utilizada falza forzada.
                $scope.mensaje="La fecha esta ocupada, seleccione otra fecha";
                //$scope.PRECIO="";
                $scope.PRECIO=P[4];
                fechasel = "";  //blanqueo las fechas para que no se valide esa opcion
                horario = "";
                nfechsel= $scope.mensaje;
                break;

            default: //caso no ponderado
                $scope.mensaje="Caso no ponderado Error "+celldato;
                fechasel = "";  //blanqueo las fechas para que no se valide esa opcion
                horario = "";
                nfechsel="";
        }
        $scope.INS.FECH = fechasel;
        $scope.INS.HH = horario;



        $scope.rowData[xrow[0].data.ID][fechasel]=3;
        $scope.G.api.setRowData($scope.rowData);
        //$scope.G.api.setColumnDefs($scope.columnDefs);

        $scope.fechsel= nfechsel + ". " + horario;




    }//fin de la funcion SEL()
*/
    //funcion de grilla filas
    $scope.rows = function (g) {
        return g.api.getDisplayedRowCount();
        //return g.api.getRowNode($scope.rowData);
    };

    //funcion de grilla fila
    $scope.row = function (g) {
        if (g.api.getSelectedNodes().length === 0) {
            return $scope.rows(g);
            //return "si";
        } else {
            var xrow = g.api.getSelectedNodes();
            return parseInt(xrow[0].childIndex);
            //return "no";
        }
    };

    //parametrizacion de grilla
    $scope.G = {
        columnDefs:null,
        rowData: null,
        rowSelection: 'single'
        //enableColResize:true,
        //onGridReady: function(){$scope.G.api.setRowData($scope.rowData)}
    };

});// fin controlador




