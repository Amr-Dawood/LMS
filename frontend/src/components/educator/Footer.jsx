import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const links = [
    {
      title: "Company",
      items: ["About Us", "Careers", "Blog", "Press"]
    },
    {
      title: "Resources",
      items: ["Courses", "Tutorials", "Webinars", "Free resources"]
    },
    {
      title: "Support",
      items: ["Help Center", "Contact Us", "Feedback", "Accessibility"]
    },
    {
      title: "Legal",
      items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Licenses"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Logo and description */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold text-white mb-1">EduPath</h2>
            <p className="text-gray-400 text-xs mb-2">
              Empowering learners worldwide.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-400 hover:text-white text-xs">
                <FaFacebook className="h-3 w-3" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs">
                <FaTwitter className="h-3 w-3" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs">
                <FaLinkedin className="h-3 w-3" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs">
                <FaInstagram className="h-3 w-3" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs">
                <FaYoutube className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Footer links */}
          {links.map((section, index) => (
            <div key={index}>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href="#" className="text-gray-400 hover:text-white text-xxs">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Newsletter
            </h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-2 py-1 text-xxs border border-gray-700 bg-gray-800 rounded-l-md focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-2 py-1 text-xxs rounded-r-md hover:bg-blue-700"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-3 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xxs">
            &copy; {currentYear} EduPath, Inc. All rights reserved.
          </p>
          <div className="mt-1 md:mt-0 flex space-x-3">
            <a href="#" className="text-gray-400 hover:text-white text-xxs">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xxs">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xxs">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;