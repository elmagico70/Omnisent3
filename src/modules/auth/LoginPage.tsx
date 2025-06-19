import React from "react";

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="p-6 rounded-xl shadow-lg bg-zinc-900 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Correo"
            className="w-full rounded-md px-3 py-2 bg-zinc-800 text-white border border-zinc-700"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-md px-3 py-2 bg-zinc-800 text-white border border-zinc-700"
          />
          <button
            type="submit"
            className="w-full bg-omni-cyan hover:bg-cyan-700 text-white font-semibold py-2 rounded-md"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;