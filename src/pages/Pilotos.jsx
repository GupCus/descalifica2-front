import { Link } from 'react-router-dom';
import NotFound from './NotFound';
import axios from 'axios';
import { useEffect, useState } from 'react';

const client = axios.create({
   baseURL: "http://localhost:3000/api/pilotos" 
});

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
    <main>
    <h1>CONSUMIENDO API</h1>

      <section className="posts-container">
      <h2>Posts</h2>
      {console.log('Datos recibidos en cuerpo:', posts)}
      {posts.map((p) => (
        <div key={p.id}>
          <h2>PILOTO</h2>
          {p.name} ; {p.num} ; {p.nationality} ; {p.role}
          <h3>Escuderia</h3>
          {p.escuderia.name} ; {p.escuderia.nationality} ; {p.escuderia.fundation} ; {p.escuderia.engine}
        </div>
      ))}

      </section>
   </main>
  );
}

export default Pilotos;