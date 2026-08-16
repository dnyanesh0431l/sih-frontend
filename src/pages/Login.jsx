const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <p className="text-center text-gray-600 mt-2">Access your account</p>
        <form className="mt-6 space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" />
          <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700">
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account? <a href="/register" className="text-teal-600">Register</a>
        </p>
      </div>
    </div>
  );
};
export default Login;