import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Dropdown, Space } from "antd";


const client = axios.create({
   baseURL: "http://localhost:3000/api/pilotos" 
});

function DropdownEscuderia({escuderia}){
const items = Object.entries(escuderia).map(([key, value], index) => ({
    label: (
      <p>{key}:{value}</p>
    ),
    key: index.toString(),
  }));
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button>
        <Space>
          Ver escudería
        </Space>
      </Button>
    </Dropdown>
  );
}
function Pilotos() {
  const [posts,setPosts] = useState([]);
  
   useEffect(() => {
      const fetchPost = async () => {
         let response = await client.get();
         setPosts(response.data.data);
      };

      fetchPost();
   }, []);

  return (
    <>
    <h1>CONSUMIENDO API</h1>
      <section>
      <h2>Posts</h2>
      {console.log('Datos recibidos en cuerpo:', posts)}
      {posts.map((p) => (
        <div key={p.id}>
          <h2>PILOTO</h2>
          {p.name} ; {p.num} ; {p.nationality} ; {p.role} ;
          <DropdownEscuderia escuderia={p.escuderia}/>

        </div>
      ))}

      </section>
   </>
  );
}

export default Pilotos;