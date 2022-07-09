var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535)

function limpiar() {
    document.getElementById("cedula").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("fecha").value = "";
}

//funcion de botones
//Eliminar Registro
function eliminarRegistro() {
    $(document).one('click', 'button[type="button"]', function (event) {
        let id = this.id;
        var lista = [];
        $('#listaestudiantes').each(function () {
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
            var sql = "DELETE FROM estudiantes WHERE id=" + nuevoId + ";"
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
        $('#listaestudiantes').each(function () {
            var celdas = $(this).find('tr.Reg_' + id);
            celdas.each(function () {
                var registros = $(this).find('span');
                registros.each(function () {
                    lista.push($(this).html())
                });
            });
        });
        document.getElementById("cedula").value = lista[1];
        document.getElementById("nombre").value = lista[2];
        document.getElementById("email").value = lista[3];
        document.getElementById("telefono").value = lista[4];
        document.getElementById("fecha").value = lista[5];
        nuevoId = lista[0].substr(1);
    })
}

$(function () {
    //crear la tabla
    $("#crear").click(function () {
        db.transaction(function (transaction) {
            var sql = "CREATE TABLE estudiantes" +
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "cedula DECIMAL(5,2) NOT NULL," +
                "nombre VARCHAR(100) NOT NULL," +
                "email VARCHAR(100) NOT NULL," +
                "telefono DECIMAL(5,2) NOT NULL," +
                "fecha DATA(100) NOT NULL)";
            transaction.executeSql(sql, undefined, function () {
                alert("tabla creada satisfactoriamente");
            }, function (transaction, err) {
                alert(err.message);
            })
        });
    });

    $("#listar").click(function () {
        cargarDatos();
    })

    //cargar lista 
    function cargarDatos() {
        //funcion para listar y pintar tabla de estudiantes en la pagina web
        $("#listaestudiantes").children().remove();
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM estudiantes ORDER BY id DESC";
            transaction.executeSql(sql, undefined, function (transaction, result) {
                if (result.rows.length) {
                    $("#listaestudiantes").append('<tr><th>Id</th><th>Cedula</th><th>Nombre</th><th>Email</th><th>Telefono</th><th>Fecha</th><th></th><th></th></tr>');
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var cedula = row.cedula;
                        var id = row.id;
                        var nombre = row.nombre;
                        var email = row.email;
                        var telefono = row.telefono;
                        var fecha = row.fecha;
                        $("#listaestudiantes").append('<tr id="fila' + id + '"class="Reg_A' + id + '"><td><span class="mid">A' +
                            id + '</span></td><td><span>' + cedula + '</span></td><td><span>' + nombre + '</span></td><td><span>' + email + '</span></td><td><span>' + telefono + '</span></td><td><span>' + fecha + '</span></td><td><button type="button" id="A' + id + '" class="btn btn-success" onclick="editar()"><img src="libs/img/edit.png"></button></td><td><button type="button" id="A' + id + '" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png"></button></td></tr>');
                    }
                } else {
                    $("#listaestudiantes").append('<tr><td colspan="8" align="center">No existen registros</td></tr>');
                }
            }, function (transaction, err) {
                alert(err.message);
            })
        })
    }

    //insertar registros(
    $("#insertar").click(function () {
        var cedula = $("#cedula").val();
        var nombre = $("#nombre").val();
        var email = $("#email").val();
        var telefono = $("#telefono").val();
        var fecha = $("#fecha").val();
        db.transaction(function (transaction) {
            var sql = "INSERT INTO estudiantes(cedula,nombre,email,telefono,fecha) Values(?,?,?,?,?)";
            transaction.executeSql(sql, [cedula, nombre, email, telefono, fecha], function () {
            }, function (transaction, err) {
                alert(err.message);
            })
        })
        limpiar();
        cargarDatos();
    })


    //Modificar registro
    $("#modificar").click(function () {
        var ncedula = $("#cedula").val();
        var nnombre = $("#nombre").val();
        var nemail = $("#email").val();
        var ntelefono = $("#telefono").val();
        var nfecha = $("#fecha").val();
        db.transaction(function (transaction) {
            var sql = "UPDATE estudiantes Set cedula='" + ncedula + "', nombre ='" + nnombre + "', email ='" + nemail + "', telefono ='" + ntelefono + "', fecha ='" + nfecha + "'WHERE id=" + nuevoId + ";"
            transaction.executeSql(sql, undefined, function () {
                cargarDatos();
                limpiar();
            }, function (transaction, err) {
                alert(err.message);
            })
        })
    })

    //borrar toda la lista de registros
    $("#borrarTodo").click(function () {
        if (!confirm("Esta seguro de borrar toda la tabla? los datos se perderan permanentemente.", ""))
            return;
        db.transaction(function (transaction) {
            var sql = "DROP TABLE estudiantes";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla borrada satisfactoriamente, por favor actualiza la pagina.")
            }, function (transaction, err) {
                alert(err.message);
            })
        })

    })


})

