var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535)

function limpiar() {
    document.getElementById("programa").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("creacion").value = "";

}

//funcion de botones
//Eliminar Registro
function eliminarRegistro() {
    $(document).one('click', 'button[type="button"]', function (event) {
        let id = this.id;
        var lista = [];
        $('#listaprograma').each(function () {
            var celdas = $(this).find('tr.Reg_' + id);
            celdas.each(function () {
                var registros = $(this).find('span.mid');
                registros.each(function () {
                    lista.push($(this).html())
                });
            });
        });
        nuevoId = lista[0].substr(1);
        db.transaction(function (transaction) {
            var sql = "DELETE FROM programa WHERE id=" + nuevoId + ";"
            transaction.executeSql(sql, undefined, function () {
                alert("Registro borrado satisfactoriamente, por favor actualice la tabla.")
            }, function (transaction, err) {
                alert(err.message)
            })
        })
    })
}

//Editar registro
function editar() {
    $(document).one('click', 'button[type="button"]', function (event) {
        let id = this.id;
        var lista = [];
        $('#listaprograma').each(function () {
            var celdas = $(this).find('tr.Reg_' + id);
            celdas.each(function () {
                var registros = $(this).find('span');
                registros.each(function () {
                    lista.push($(this).html())
                });
            });
        });
        document.getElementById("programa").value = lista[1];
        document.getElementById("descripcion").value = lista[2];
        document.getElementById("creacion").value = lista[3];
        nuevoId = lista[0].substr(1);
    })
}

$(function () {
    //crear la tabla
    $("#crearpro").click(function () {
        db.transaction(function (transaction) {
            var sql = "CREATE TABLE programa" +
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "programa VARCHAR(100) NOT NULL," +
                "descripcion VARCHAR(100) NOT NULL," +
                "creacion DATA(100) NOT NULL)";
            transaction.executeSql(sql, undefined, function () {
                alert("tabla creada satisfactoriamente");
            }, function (transaction, err) {
                alert(err.message);
            })
        });
    });

    $("#listarpro").click(function () {
        cargarDatos();
    })

    //cargar lista 
    function cargarDatos() {
        //funcion para listarpro y pintar tabla de programa en la pagina web
        $("#listaprograma").children().remove();
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM programa ORDER BY id DESC";
            transaction.executeSql(sql, undefined, function (transaction, result) {
                if (result.rows.length) {
                    $("#listaprograma").append('<tr><th>Id</th><th>programa</th><th>descripcion</th><th>creacion</th><th></th><th></th></tr>');
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var programa = row.programa;
                        var id = row.id;
                        var descripcion = row.descripcion;
                        var creacion = row.creacion;
                        $("#listaprograma").append('<tr id="fila' + id + '"class="Reg_A' + id + '"><td><span class="mid">A' +
                            id + '</span></td><td><span>' + programa + '</span></td><td><span>' + descripcion + '</span></td><td><span>' + creacion + '</span></td><td><button type="button" id="A' + id + '" class="btn btn-success" onclick="editar()"><img src="libs/img/edit.png"></button></td><td><button type="button" id="A' + id + '" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png"></button></td></tr>');
                    }
                } else {
                    $("#listaprograma").append('<tr><td colspan="5" align="center">No existen registros</td></tr>');
                }
            }, function (transaction, err) {
                alert(err.message);
            })
        })
    }

    //insertarpro registros(
    $("#insertarpro").click(function () {
        var programa = $("#programa").val();
        var descripcion = $("#descripcion").val();
        var creacion = $("#creacion").val();
        db.transaction(function (transaction) {
            var sql = "INSERT INTO programa(programa,descripcion,creacion) Values(?,?,?)";
            transaction.executeSql(sql, [programa, descripcion, creacion], function () {
            }, function (transaction, err) {
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })


    //Modificar registro
    $("#modificarpro").click(function () {
        var nprograma = $("#programa").val();
        var ndescripcion = $("#descripcion").val();
        var ncreacion = $("#creacion").val();
        db.transaction(function (transaction) {
            var sql = "UPDATE programa Set programa='" + nprograma + "', descripcion ='" + ndescripcion + "', creacion ='" + ncreacion + "'WHERE id=" + nuevoId + ";"
            transaction.executeSql(sql, undefined, function () {
                cargarDatos();
                limpiar();
            }, function (transaction, err) {
                alert(err.message);
            })
        })
    })

    //borrar toda la lista de registros
    $("#borrarTodopro").click(function () {
        if (!confirm("Esta seguro de borrar toda la tabla? los datos se perderan permanentemente.", ""))
            return;
        db.transaction(function (transaction) {
            var sql = "DROP TABLE programa";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla borrada satisfactoriamente, por favor actualiza la pagina.")
            }, function (transaction, err) {
                alert(err.message);
            })
        })

    })


})