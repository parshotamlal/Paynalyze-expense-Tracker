import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

import NavBar from "../components/NavBar";

import dashboard from "../assets/dashboard.png";
import { StartNow, ThreeDots } from "../utils/Icons";

const Home = () => {
  const navigate = useNavigate();
  const userIsVerified = useSelector((state) => state.auth?.user?.verified);

  useEffect(() => {
    if (userIsVerified) {
      navigate("/dashboard");
    }
  }, [userIsVerified]);

  
  return (
    <main className={`${userIsVerified ? "hidden" : ""} w-full h-full`}>
      <NavBar />
      <div className="bg-primary-50 pb-4 pt-12 sm:pt-0 gap-y-12 flex flex-col sm:block h-[90vh] sm:h-full">
        <div className="w-full sm:h-[65vh] flex flex-col justify-center items-center order-2 sm:order-1">
          <h2 className="text-4xl md:text-5xl xl:text-7xl">
            Track your{" "}
            <TypeAnimation
              sequence={["Finances", 1000, "Expenses", 1000, "Incomes", 1000]}
              wrapper="span"
              speed={20}
              className="text-primary inline-block"
              repeat={Infinity}
            />{" "}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg my-8 text-balance text-center w-[90%] xl:w-[60%]">
            Welcome to{" "}
            <span className="text-primary font-calSans">Paynalyze</span>, your
            ultimate solution for smart financial analysis and expense
            management. With Paynalyze, you can easily track your expenses,
            analyze your spending patterns, monitor your income, and stay in
            control of your financial goals.
          </p>
          <Button
            color="primary"
            className="text-sm sm:text-base lg:text-lg lg:w-[14rem] px-6 py-6"
            radius="sm"
            startContent={<StartNow />}
            onPress={() => navigate("/register")}
          >
            Start using Now!
          </Button>
          <ThreeDots
            className="text-primary size-[2.5rem] mt-4 cursor-pointer"
            onClick={() => navigate("/login")}
          />
        </div>

        <div>

        </div>
      </div>


      {/* 💡 FEATURES */}
 <section className="py-16 bg-white text-center">
  <h2 className="text-4xl font-bold mb-4">Features</h2>
  <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
    Everything you need to manage your financial life in one place.
  </p>

  <div className="grid md:grid-cols-4 gap-8 px-6 xl:px-20">
    {[
      {
        title: "Expense Tracking",
        desc: "Categorize and track daily spending with ease.",
      },
      {
        title: "Income Management",
        desc: "Monitor multiple income sources in real time.",
      },
      {
        title: "Investment Analysis",
        desc: "Track ROI and analyze your investment growth.",
      },
      {
        title: "Real-time Reports",
        desc: "Get instant reports with charts and insights.",
      },
      {
        title: "Budget Planning",
        desc: "Set monthly budgets and control overspending.",
      },
      {
        title: "Secure Data",
        desc: "Your data is encrypted and fully protected.",
      },
      {
        title: "Multi-device Sync",
        desc: "Access your data anytime, anywhere.",
      },
      {
        title: "AI Insights",
        desc: "Smart suggestions to improve your savings.",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="p-6 shadow-md rounded-xl hover:scale-105 transition"
      >
        <h3 className="text-lg font-semibold text-primary mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

      {/* 📊 ANALYTICS */}
  <section className="py-20 bg-primary-50 flex flex-col xl:flex-row items-center px-6 xl:px-20 gap-10">
  <img
    src={dashboard}
    className="w-full xl:w-1/2 rounded-xl shadow-lg"
  />

  <div className="text-center xl:text-left max-w-xl">
    <h2 className="text-4xl font-bold mb-4">
      Powerful Analytics Dashboard
    </h2>

    <p className="text-gray-600 mb-6">
      Visualize your financial journey with interactive charts, track trends,
      identify spending patterns, and make smarter financial decisions.
    </p>

    <ul className="text-gray-600 space-y-2 mb-6">
      <li>✔ Monthly & yearly reports</li>
      <li>✔ Category-wise expense breakdown</li>
      <li>✔ Investment growth tracking</li>
      <li>✔ Real-time updates</li>
    </ul>

    <Button color="primary">Explore Dashboard</Button>
  </div>
</section>

      {/* ⚙️ HOW IT WORKS */}
  <section className="py-20 text-center bg-white">
  <h2 className="text-4xl font-bold mb-4">How It Works</h2>
  <p className="text-gray-600 mb-12">
    Start managing your finances in just 3 simple steps.
  </p>

  <div className="grid md:grid-cols-3 gap-10 px-6 xl:px-20">
    {[
      {
        title: "Create Account",
        desc: "Sign up in seconds with secure authentication.",
      },
      {
        title: "Add Transactions",
        desc: "Record your income, expenses, and investments.",
      },
      {
        title: "Analyze Growth",
        desc: "View insights and improve your financial habits.",
      },
    ].map((step, i) => (
      <div key={i} className="p-6 rounded-xl shadow hover:shadow-lg">
        <div className="text-5xl text-primary font-bold mb-4">
          {i + 1}
        </div>
        <h3 className="font-semibold text-lg">{step.title}</h3>
        <p className="text-gray-600 mt-2">{step.desc}</p>
      </div>
    ))}
  </div>
</section>
      {/* 🔥 STATS */}
   <section className="py-20 bg-primary text-white text-center">
  <h2 className="text-3xl font-bold mb-10">
    Trusted by Thousands of Users
  </h2>

  <div className="grid md:grid-cols-4 gap-10">
    <div>
      <h3 className="text-4xl font-bold">10K+</h3>
      <p>Active Users</p>
    </div>
    <div>
      <h3 className="text-4xl font-bold">1M+</h3>
      <p>Transactions</p>
    </div>
    <div>
      <h3 className="text-4xl font-bold">99%</h3>
      <p>Data Accuracy</p>
    </div>
    <div>
      <h3 className="text-4xl font-bold">24/7</h3>
      <p>Support</p>
    </div>
  </div>
</section>

      {/* ⭐ TESTIMONIALS */}
    <section className="py-20 bg-white text-center">
  <h2 className="text-4xl font-bold mb-12">What Users Say</h2>

  <div className="grid md:grid-cols-3 gap-8 px-6 xl:px-20">
    {[
      {
        name: "Rahul Sharma",
        review: "Paynalyze completely changed how I manage money!",
      },
      {
        name: "Anjali Verma",
        review: "Super clean UI and very helpful insights.",
      },
      {
        name: "Amit Patel",
        review: "Best finance tracker I’ve ever used.",
      },
    ].map((item, i) => (
      <div key={i} className="p-6 shadow rounded-xl">
        <p className="mb-4">"{item.review}"</p>
        <h4 className="font-semibold text-primary">{item.name}</h4>
      </div>
    ))}
  </div>
</section>

      {/* 💰 PRICING */}
<section className="py-20 bg-primary-50 text-center">
  <h2 className="text-4xl font-bold mb-12">Pricing</h2>

  <div className="grid md:grid-cols-3 gap-8 px-6 xl:px-20">
    {[
      {
        plan: "Free",
        price: "₹0",
        features: ["Basic Tracking", "Limited Reports"],
      },
      {
        plan: "Pro",
        price: "₹299/mo",
        features: ["Advanced Analytics", "Unlimited Tracking"],
      },
      {
        plan: "Premium",
        price: "₹599/mo",
        features: ["AI Insights", "Priority Support"],
      },
    ].map((item, i) => (
      <div key={i} className="p-8 bg-white rounded-xl shadow">
        <h3 className="text-2xl font-bold">{item.plan}</h3>
        <p className="text-3xl text-primary my-4">{item.price}</p>

        <ul className="text-gray-600 mb-6">
          {item.features.map((f, idx) => (
            <li key={idx}>✔ {f}</li>
          ))}
        </ul>

        <Button color="primary">Choose Plan</Button>
      </div>
    ))}
  </div>
</section>

      {/* 🚀 CTA */}
  <section className="py-20 text-center bg-primary text-white">
  <h2 className="text-4xl font-bold mb-4">
    Ready to Take Control of Your Finances?
  </h2>

  <p className="mb-6">
    Join thousands of users who trust Paynalyze.
  </p>

  <Button
    className="bg-white text-primary px-8 py-4"
    onPress={() => navigate("/register")}
  >
    Get Started Now
  </Button>
</section>

      <div>
        
      </div>
    </main>
  );
};

export default Home;