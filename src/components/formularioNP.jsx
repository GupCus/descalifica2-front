import { useState } from "react";


function formularioNuevoPiloto(){
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const handleEnviar = () => {
        setMostrarMensaje(true);
    };

    return(<div style={{alignContent:'center', marginTop:'8px'}}>
        <div>Nombre:</div>
        <input type="Nombre"/>
        <div>Equipo: </div>
        <input type="Equipo"/>
        <div>Número: </div>
        <input type="Número"/>
        <div>Nacionalidad: </div>
        <input type="Nacionalidad"/>
        <div style={{marginTop:'8px'}}>
            <button onClick={handleEnviar}>Enviar</button> {/* Al clickear boton invoca funcion especificada */}
        </div>
        {mostrarMensaje && <h1>el boton no hace nada :P</h1>} {/* Si mostrar mensaje=true muestra texto*/}
    </div>)
}
export default formularioNuevoPiloto;