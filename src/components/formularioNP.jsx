import { useState } from "react";


function formularioNuevoPiloto(){
    const [nombre, setNombre] = useState("") // 'nombre' es la variable, setNombre es una función invocada para actualizar el valor de nombre.
    const [equipo, setEquipo] = useState("") //abajo hay ejemplos
    const [numero, setNumero] = useState("")
    const [nacionalidad, setNacionalidad] = useState("")
    const [rol, setRol] = useState("")
    const [mostrarMsg, setMostrarMsg] = useState(false)


    const handleEnviar = async () => {
        const nuevoPiloto = {
            name: nombre,
            team: equipo,
            nro: parseInt(numero,10), //nos aseguramos que sea un entero, es el tipo de dato que espera la api
            nationality: nacionalidad,
            role: rol
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/pilotos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoPiloto) //convierte el objeto java a JSON, es lo que nuestra API espera.
            })
            if(response.ok){ //'response.ok' devuelve true si el código http que devuelve está entre 200 y 299
                setMostrarMsg(true) //EJEMPLO: actualizo estado de 'mostrarMsg' a TRUE ;)
            } else {
                alert("ERROR AL ENVIAR EL PILOTO")
            }
        } catch (error) {
            alert("Error de conexión")
            console.log(error.message) //muestra error en la consola (del navegador)
        }
    };

    return(<div>
        <div>Nombre:</div>
        <input value={nombre} onChange={e => setNombre(e.target.value)}/>
        <div>Equipo: </div>
        <input value={equipo} onChange={e => setEquipo(e.target.value)}/>
        <div>Número: </div>
        <input value={numero} onChange={e => setNumero(e.target.value)}/>
        <div>Nacionalidad: </div>
        <input value={nacionalidad} onChange={e => setNacionalidad(e.target.value)}/>
        <div>Rol (Ej: piloto reserva): </div>
        <input value={rol} onChange={e => setRol(e.target.value)}/>
        <div style={{marginTop:'8px'}}>
            <button onClick={handleEnviar}>Enviar</button> {/* Al clickear boton invoca funcion especificada */}
        </div>
        {mostrarMsg && <h3 color="green">PILOTO ENVIADO CORRECTAMENTE</h3>}
    </div>)
}
export default formularioNuevoPiloto;