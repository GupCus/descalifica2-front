import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./Login.css";

const Login = () => {
  const { login, errorLogin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    await login(data)
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Ingrese a su cuenta</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email es requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Expresión regular para validar formato de email
                  message: "Formato de email no válido",
                },
              })}
              placeholder="Ej: mail@mail.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              autoComplete="email"
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password es requerido" })}
              placeholder="Password"
              className={`form-input ${errors.password ? 'error' : ''}`} 
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" {...register("remember")} />
              <span>Recordarme </span> <br />
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Olvidé mi password
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>

          {errorLogin && <div className="error-message">{errorLogin}</div>}
        </form>

        <div className="login-footer">
          <p>
            ¿No tiene una cuenta?{" "}
            
            <Link to="/register" className="register-link">
             Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Login;