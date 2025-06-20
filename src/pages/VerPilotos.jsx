//PRUEBA MÉTODO GET PARA LOS PILOTOS

import { useEffect, useState } from "react";

function VerPilotos(){
    const [pilotos, setPilotos] = useState([])
    useEffect(() => {
        fetch('http://localhost:3000/api/pilotos')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setPilotos(data)
        })
        .catch((err) => {
            console.log(err.message)
        })
    }, [])

    return(
        <div className="pilotos-container">
            <h1>HOLA</h1>
            {pilotos.map((piloto) => {
                return (
                    <div className="piloto" key={piloto.id}>
                        <h2 className="nombre-piloto">{piloto.name}</h2>
                        <a className="escuderia-piloto">{piloto.team}</a>
                        <h5 className="nro-piloto">{piloto.nro}</h5>
                        <h5 className="nacionalidad-piloto">{piloto.nationality}</h5>
                        <h5 className="rol-piloto">{piloto.role}</h5>
                    </div>
                )
            })}
        </div>
    )
}

export default VerPilotos