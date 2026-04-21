import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Menu, X, Key } from "lucide-react";
import { navbarStyles } from "../../assets/dummyStyles";

const DOCTOR_TOKEN_KEY = "doctorToken_v1";
const PATIENT_TOKEN_KEY = "patientToken_v1";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return Boolean(
        localStorage.getItem(DOCTOR_TOKEN_KEY) ||
          localStorage.getItem(PATIENT_TOKEN_KEY)
      );
    } catch {
      return false;
    }
  });

  const location = useLocation();
  const navRef = useRef(null);
  const navigate = useNavigate();

  /* Hide / show navbar on scroll */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* Sync login state */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === DOCTOR_TOKEN_KEY || e.key === PATIENT_TOKEN_KEY) {
        setIsLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Close mobile menu on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  function handleLogout() {
    localStorage.removeItem(DOCTOR_TOKEN_KEY);
    localStorage.removeItem(PATIENT_TOKEN_KEY);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <>
      <div className={navbarStyles.navbarBorder} />

      <nav
        ref={navRef}
        className={`${navbarStyles.navbarContainer} ${
          showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
        }`}
      >
        <div className={navbarStyles.contentWrapper}>
          <div className={navbarStyles.flexContainer}>
            {/* Logo */}
            <Link to="/" className={navbarStyles.logoLink}>
              <div className={navbarStyles.logoContainer}>
                <div className={navbarStyles.logoImageWrapper}>
                  <img
                    src={logo}
                    alt="MedBook logo"
                    className={navbarStyles.logoImage}
                  />
                </div>
              </div>
              <div className={navbarStyles.logoTextContainer}>
                <h1 className={navbarStyles.logoTitle}>
                  MediCare
                </h1>
                <p className={navbarStyles.logoSubtitle}>
                  Healthcare Solutions
                </p>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className={navbarStyles.desktopNav}>
              <div className={navbarStyles.navItemsContainer}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`${navbarStyles.navItem} ${
                        isActive
                          ? navbarStyles.navItemActive
                          : navbarStyles.navItemInactive
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className={navbarStyles.rightContainer}>
              {/* ================= LOGIN / LOGOUT BUTTON ================= */}
              {!isLoggedIn ? (
                <Link
                  to="/doctor-admin/login"
                  className={navbarStyles.loginButton}
                >
                  <Key className={navbarStyles.loginIcon} />
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className={navbarStyles.loginButton}
                  style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                >
                  <Key className={navbarStyles.loginIcon} />
                  Logout
                </button>
              )}

              {/* Mobile/Tablet toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={navbarStyles.mobileToggle}
                aria-expanded={isOpen}
                aria-label="Open menu"
              >
                {isOpen ? (
                  <X className={navbarStyles.toggleIcon} />
                ) : (
                  <Menu className={navbarStyles.toggleIcon} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet menu */}
          {isOpen && (
            <div className={navbarStyles.mobileMenu}>
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`${navbarStyles.mobileMenuItem} ${
                      isActive
                        ? navbarStyles.mobileMenuItemActive
                        : navbarStyles.mobileMenuItemInactive
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {/* Login/Logout button in mobile menu */}
              {!isLoggedIn && (
                <Link
                  to="/doctor-admin/login"
                  onClick={() => setIsOpen(false)}
                  className={navbarStyles.mobileLoginButton}
                >
                  Login
                </Link>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className={navbarStyles.mobileLoginButton}
                  style={{ backgroundColor: "#ef4444" }}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
        {/* Animations */}
        <style>{navbarStyles.animationStyles}</style>
      </nav>
    </>
  );
}