import React, { useState } from 'react';

//Aca en componentes agregamos todas nuestras definciones de clases/componentes donde retornamos lo que queremos que se vea 
//SI O SI va un export default al final

function Boton({nombre}){

  const [cont, setContador] = useState(0);
  return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

            <div>El contador de {nombre} es: {cont}</div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px'}}>
              <button onClick={() => setContador((cont) => cont + 1)}>
                Sumar
              </button>
              <button onClick={() => setContador((cont) => cont - 1)}>
                Restar
              </button>
            </div>
            
         </div>);
}
export default Boton;