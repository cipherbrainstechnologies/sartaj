import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import CategoryProduct2 from "../ecommerce/Filter/CategoryProduct2";
import CategoryProduct3 from "../ecommerce/Filter/CategoryProduct3";
import Search from "../ecommerce/Search";
import { useAuth } from "../context/AuthContext";
import { ApiCall } from "../../lib/other/other";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";
import { useLanguage } from "../context/LanguageContext";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { clearCart } from "../../redux/action/cart";
const Header = ({
  totalCartItems,
  totalCompareItems,
  toggleClick,
  totalWishlistItems,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isToggled, setToggled] = useState(false);
  const [scroll, setScroll] = useState(0);
  const { logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [DLang, setDLang] = useState(intl.locale);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { language, switchLanguage } = useLanguage();
  const router = useRouter();
  const [isLoggin, setIsLoggin] = useState(false);
  const handleLanguageSwitch = (newLanguage) => {
    switchLanguage(newLanguage);
    setDLang(newLanguage);

    const pathWithoutLanguage = router.pathname;

    const newUrl = `/${newLanguage}/${pathWithoutLanguage
      .replace("/eng", "")
      .replace("/jp", "")
      .replace("/[slug]", "")}`;
    const currentToken = router.query.token || "";
    const slug = router.query?.slug;
    if (router.pathname.includes("page-reset-password")) {
      window.location.replace(
        `/${newLanguage}/page-reset-password?token=${currentToken}`
      );
    } else if (slug) {
      window.location.replace(`${newUrl}/${slug}`);
    } else {
      window.location.replace(newUrl);
    }
  };

  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;
    setCategories(allCategories?.data);
  };
  function splitArray(arr) {
    const midpoint = Math.floor(categories?.length / 2);
    const firstHalf = arr?.slice(0, midpoint);
    const secondHalf = arr?.slice(midpoint);
    return [firstHalf, secondHalf];
  }
  const [firstPart, secondPart] = splitArray(categories);
  const getCartsItem = async (token) => {
    const response = await axios
      .get(`${API_BASE_URL}customer/cart`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCartItemsCount(response?.data?.cartProducts?.length);
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  const Jsonhandler = (data) => {
    try {
      JSON.parse(data);
    } catch (e) {
      console.log("JSON parse error");
    }
    return JSON.parse(data);
  };
  const getCartItemsCount = (flag, data) => {
    if (flag === "login") {
      getCartsItem(data);
    } else {
      setCartItemsCount(Jsonhandler(data)?.length);
    }
  };
  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY >= 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      getCartItemsCount("login", token);
      setIsLoggin(true);
    } else {
      let Cart = localStorage.getItem("dokani_cart");
      getCartItemsCount("notLogin", Cart);
      setIsLoggin(false);
    }
    getAllCategories();
  }, []);

  useEffect(() => {
    if (
      !window.location.pathname.includes("eng/") &&
      !window.location.pathname.includes("jp/") &&
      router.query.slug
    ) {
      let currentSlug = router.query.slug || "";
      let pathWithoutLanguage = currentSlug.replace(/^\/[a-z]{2}\//, "");
      router.push(`/${"eng"}/${pathWithoutLanguage}`);
    } else {
      if (router.pathname.includes("shop-compare")) {
        router.push(`/${intl.locale}/${router.pathname}`);
      } else if (router.pathname.includes("shop-wishlist")) {
        router.push(`/${intl.locale}/${router.pathname}`);
      }
    }
  }, []);
  const handleToggle = () => setToggled(!isToggled);

  return (
    <header className={
      scroll
        ? "header-area header-style-1 header-height-2 stick"
        : "header-area header-style-1 header-height-2"
    }>
      <div className="mobile-promotion" >
        <label htmlFor="languageDropdown" className="sr-only">
          {intl.formatMessage({ id: "Select Language" })}
        </label>
        <select
          id="languageDropdown"
          onChange={(e) => handleLanguageSwitch(e.target.value)}
          value={DLang}
        >
          <option value="eng">English</option>
          <option value="jp">日本語</option>
        </select>
      </div>
      <div className="header-top header-top-ptb-1 d-none d-lg-block">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="header-info">
                <ul>
                  <li>
                    <Link href="/page-account">
                      {intl.formatMessage({ id: "My Account" })}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${intl.locale}/shop-wishlist`}>
                      {intl.formatMessage({ id: "Wishlist" })}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6">
              <div className="header-info header-info-right">
                <ul>
                  <li>
                    {intl.formatMessage({ id: "Need help? Call Us" })}:&nbsp;
                    <a href="tel:0727511975">
                      <strong className="text-brand">072-751-1975</strong>
                    </a>
                  </li>
                  {/* <li>
                      <Link
                        href="/"
                        onClick={() => handleLanguageSwitch("eng")}
                        className="language-dropdown-active"
                      >
                        <i className="fi-rs-world"></i>
                        English
                        <i className="fi-rs-angle-small-down"></i>
                      </Link>
                      <ul className="language-dropdown">
                        <Link
                          href="/jp"
                          onClick={() => handleLanguageSwitch("jp")}
                        >
                          <img
                            src="/assets/imgs/theme/flag-jp.png"
                            alt="japan"
                          />
                          日本語
                        </Link>
                      </ul>
                    </li> */}
                  <li>
                    <label htmlFor="languageDropdown" className="sr-only">
                      {intl.formatMessage({ id: "Select Language" })}
                    </label>
                    <select
                      id="languageDropdown"
                      onChange={(e) => handleLanguageSwitch(e.target.value)}
                      value={DLang}
                    >
                      <option value="eng">English</option>
                      <option value="jp">日本語</option>
                    </select>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
        <div className="container">
          <div className="header-wrap">
            <div className="logo logo-width-1">
              <Link href="/">
                <img src="/assets/imgs/theme/logo.svg" alt="logo" />
              </Link>
            </div>
            <div className="header-right">
              <div className="search-style-2">
                <Search />
              </div>
              <div className="header-action-right">
                <div className="header-action-2">
                  <div className="header-action-icon-2">
                    <Link href={`/${intl?.locale}/shop-compare`}>
                      <img
                        className="svgInject"
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-compare.svg"
                      />
                      <span className="pro-count blue">
                        {totalCompareItems}
                      </span>
                    </Link>
                    <Link href={`/${intl?.locale}/shop-compare`}>
                      <span className="lable ml-0">
                        {intl.formatMessage({ id: "Compare" })}
                      </span>
                    </Link>
                  </div>
                  <div className="header-action-icon-2">
                    <Link href={`/${intl.locale}/shop-wishlist`}>
                      <img
                        className="svgInject"
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-heart.svg"
                      />
                      <span className="pro-count blue">
                        {totalWishlistItems}
                      </span>
                    </Link>
                    <Link href={`/${intl.locale}/shop-wishlist`}>
                      <span className="lable">
                        {intl.formatMessage({ id: "Wishlist" })}
                      </span>
                    </Link>
                  </div>
                  <div className="header-action-icon-2">
                    <Link
                      href={`/${intl.locale}/shop-cart`}
                      className="mini-cart-icon"
                    >
                      <img
                        alt="Evara"
                        src="/assets/imgs/theme/icons/icon-cart.svg"
                      />
                      <span className="pro-count blue">{totalCartItems}</span>
                    </Link>
                    <Link href={`/${intl.locale}/shop-cart`}>
                      <span className="lable">
                        {intl.formatMessage({ id: "Cart" })}
                      </span>
                    </Link>
                  </div>

                  <div className="header-action-icon-2">
                    <Link href="/">
                      <img
                        className="svgInject"
                        alt="Nest"
                        src="/assets/imgs/theme/icons/icon-user.svg"
                      />
                    </Link>
                    <Link href="/">
                      <span className="lable ml-0">
                        {intl.formatMessage({ id: "Account" })}
                      </span>
                    </Link>
                    <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                      <ul>
                        <li>
                          <Link href="/page-account">
                            <i className="fi fi-rs-user mr-10"></i>
                            {intl.formatMessage({ id: "My Account" })}
                          </Link>
                        </li>

                        <li>
                          <Link href={`/${intl.locale}/shop-wishlist`}>
                            <i className="fi fi-rs-heart mr-10"></i>
                            {intl.formatMessage({ id: "My Wishlist" })}
                          </Link>
                        </li>

                        {isLoggin ? (
                          <li>
                            <Link
                              href="/page-login"
                              onClick={() => {
                                localStorage.removeItem("token");
                                logout();
                                dispatch(clearCart());
                              }}
                            >
                              <i className="fi fi-rs-sign-out mr-10"></i>
                              {intl.formatMessage({ id: "Sign out" })}
                            </Link>
                          </li>
                        ) : (
                          <li>
                            <Link href="/page-login">
                              <i className="fi fi-rs-sign-out mr-10"></i>
                              {intl.formatMessage({ id: "Sign In" })}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          scroll
            ? "header-bottom header-bottom-bg-color sticky-bar stick"
            : "header-bottom header-bottom-bg-color sticky-bar"
        }
      >
        <div className="container">
          <div className="header-wrap header-space-between position-relative">
            <div className="logo logo-width-1 d-block d-lg-none">
              <Link href="/">
                <img src="/assets/imgs/theme/logo.svg" alt="logo" />
              </Link>
            </div>
            <div className="header-nav d-none d-lg-flex">
              <div className="main-categori-wrap d-none d-lg-block">
                <a className="categories-button-active" onClick={handleToggle}>
                  <span className="fi-rs-apps"></span>
                  <span className="et">
                    {intl.formatMessage({ id: "Browse" })}
                  </span>{" "}
                  {intl.formatMessage({ id: "All Categories" })}
                  <i className="fi-rs-angle-down"></i>
                </a>

                <div
                  className={
                    isToggled
                      ? "categories-dropdown-wrap categories-dropdown-active-large font-heading open"
                      : "categories-dropdown-wrap categories-dropdown-active-large font-heading"
                  }
                >
                  <div className="d-flex categori-dropdown-inner">
                    <CategoryProduct2 data={secondPart} />
                    <CategoryProduct3 data={firstPart} />
                  </div>
                </div>
              </div>
              <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block  font-heading">
                <nav>
                  <ul>
                    <li>
                      <Link href="/" className="active">
                        {intl.formatMessage({ id: "Home" })}
                      </Link>
                    </li>
                    <li>
                      <Link href="/page-about">
                        {intl.formatMessage({ id: "About" })}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${intl.locale}/shop-fullwidth`}>
                        {intl.formatMessage({ id: "Shop" })}
                      </Link>
                    </li>
                    <li>
                      <Link href="/page-contact">
                        {intl.formatMessage({ id: "Contact" })}
                      </Link>
                    </li>
                    <li>
                      <Link href="/page-purchase-guide">
                        {intl.formatMessage({ id: "Delivery Information" })}
                      </Link>
                    </li>
                    <li>
                      <Link href="/page-faqs">
                        {intl.formatMessage({ id: "FAQs" })}
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="hotline d-none d-lg-flex">
              <img
                src="/assets/imgs/theme/icons/icon-headphone.svg"
                alt="hotline"
              />

              <p>
                <a href="tel:0727511975">
                  <strong className="text-brand">072-751-1975</strong>
                </a>
                <span>{intl.formatMessage({ id: "Support Center" })}</span>
              </p>
            </div>

            <div className="header-action-icon-2 d-block d-lg-none">
              <div
                className="burger-icon burger-icon-white"
                onClick={toggleClick}
              >
                <span className="burger-icon-top"></span>
                <span className="burger-icon-mid"></span>
                <span className="burger-icon-bottom"></span>
              </div>
            </div>

            <div className="header-action-right d-block d-lg-none">
              <div className="header-action-2">
                <div className="header-action-icon-2">
                  <Link href={`/${intl.locale}/shop-wishlist`}>
                    <img
                      alt="Evara"
                      src="/assets/imgs/theme/icons/icon-heart.svg"
                    />
                    <span className="pro-count white">
                      {totalWishlistItems}
                    </span>
                  </Link>
                </div>
                <div className="header-action-icon-2">
                  <Link
                    href={`/${intl.locale}/shop-cart`}
                    className="mini-cart-icon"
                  >
                    <img
                      alt="Evara"
                      src="/assets/imgs/theme/icons/icon-cart.svg"
                    />
                    <span className="pro-count white">{totalCartItems}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  totalCartItems: state.cart?.length,
  totalCompareItems: state.compare.items?.length,
  totalWishlistItems: state.wishlist.items?.length,
});

export default connect(mapStateToProps, null)(Header);
