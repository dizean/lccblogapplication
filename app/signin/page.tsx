import Link from "next/link";

export default function SignIn() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/lcc header.webp"
            alt="LCCB Logo"
            className="h-16 md:h-20 w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#0441B1] mb-6">
          Sign In
        </h1>

        {/* Form */}
        <form className="space-y-6">
          {/* Username / Email */}
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Username / Email
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] text-lg"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0441B1] text-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-xl font-bold bg-[#0441B1] text-white rounded-lg hover:bg-blue-900 transition"
          >
            Sign In
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-6 flex flex-col items-center space-y-4">
          <a
            href="#"
            className="text-[#0441B1] font-semibold hover:underline text-lg"
          >
            Forgot Password?
          </a>

          {/* Back to Home Button */}
          <Link href="/" className="w-full">
            <button className="w-full py-3 text-xl font-bold border-2 border-[#0441B1] text-[#0441B1] rounded-lg hover:bg-[#0441B1] hover:text-white transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
