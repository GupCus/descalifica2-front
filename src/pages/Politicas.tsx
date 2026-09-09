const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

      <p className="mb-4">
        Última actualización: {new Date().toLocaleDateString('es-ES')}
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Información que recopilamos
        </h2>
        <p className="mb-4">
          Cuando utilizas nuestra aplicación, ya sea directamente o a través de
          Google OAuth, podemos recopilar la siguiente información:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Información de la cuenta de Google:</strong> Tu nombre,
            dirección de correo electrónico y foto de perfil proporcionados por
            Google al iniciar sesión.
          </li>
          <li>
            <strong>Información de uso:</strong> Datos sobre cómo interactúas
            con nuestra aplicación, incluyendo tus preferencias, publicaciones
            en el foro y otras actividades dentro de la plataforma.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. Cómo utilizamos tu información
        </h2>
        <p className="mb-4">Utilizamos la información recopilada para:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Crear y gestionar tu cuenta de usuario.</li>
          <li>Proporcionar, mantener y mejorar nuestros servicios.</li>
          <li>
            Permitir tu participación en el foro y otras funciones comunitarias
            de la aplicación.
          </li>
          <li>Personalizar tu experiencia dentro de la aplicación.</li>
          <li>
            Comunicarnos contigo, incluyendo el envío de notificaciones y
            actualizaciones importantes.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          3. Cómo compartimos tu información
        </h2>
        <p className="mb-4">
          No vendemos, alquilamos ni compartimos tu información personal con
          terceros para fines comerciales. Tu información solo podrá ser
          compartida en los siguientes casos:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Con tu consentimiento:</strong> Cuando nos autorices
            explícitamente a hacerlo.
          </li>
          <li>
            <strong>Por requerimiento legal:</strong> Si estamos obligados a
            divulgar tu información para cumplir con una ley, regulación o
            proceso legal válido.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          4. Seguridad de los datos
        </h2>
        <p className="mb-4">
          Implementamos medidas de seguridad razonables para proteger tu
          información personal contra acceso no autorizado, alteración,
          divulgación o destrucción. Sin embargo, ten en cuenta que ningún
          método de transmisión por Internet o almacenamiento electrónico es
          100% seguro.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Tus derechos</h2>
        <p className="mb-4">
          Tienes derecho a acceder, corregir, actualizar o solicitar la
          eliminación de tu información personal. Si deseas ejercer alguno de
          estos derechos, por favor contáctanos directamente.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          6. Cambios en esta política
        </h2>
        <p className="mb-4">
          Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te
          notificaremos cualquier cambio publicando la nueva Política de
          Privacidad en esta página.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">7. Contacto</h2>
        <p className="mb-4">
          Si tienes alguna pregunta o sugerencia sobre nuestra Política de
          Privacidad, no dudes en contactarnos.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
