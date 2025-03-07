import SideBar from "../../Components/SideBar/index";
import Button from "@mui/material/Button";
import { IoMenu } from "react-icons/io5";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { SiNextra } from "react-icons/si";
import { FaAngleDown } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect, useContext } from "react";
import HomeProducts from "../../Components/HomeBanner/Homeproducts/index";
import Grow from "@mui/material/Grow";
import Pagination from "@mui/material/Pagination";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { Mycontext } from "../../App";

const Listing = () => {
  const { id } = useParams();
  const context = useContext(Mycontext);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState(true);
  const [view, setView] = useState("four");
  const [val, setVal] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  useEffect(() => {
    window.scrollTo(0,0);
    let url = window.location.href;
    let apiEndPoint ="";


    if(url.includes("subCat")){
      apiEndPoint=`/api/product?subCat=${id}`
    }
    if(url.includes("category")){
      apiEndPoint = `/api/product?category=${id}`
      console.log("the Endpoint:",apiEndPoint);
    }
    console.log("Api:",apiEndPoint);

    fetchDataFromApi(`${apiEndPoint}`).then((res) => {
      setProducts(res.product);
      console.log(res);
    });
  }, [id]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (view) => {
    setChecked(false); // Trigger the transition out
    setTimeout(() => {
      setView(view);
      setChecked(true); // Trigger the transition in after layout change
    }, 300); // Adjust timeout to match animation duration
  };

  const handleClick1 = (val) => {
    setVal(val);
    handleClose();
  };

  const filterProducts = (priceRange,catId, subCatId) => {
    let url = "/api/product";

    // Build query string based on parameters
    const params = new URLSearchParams();
    if (priceRange) {
      params.append("perPage", 8);
      params.append("minPrice", priceRange[0]);
      params.append("maxPrice", priceRange[1]);
    }
    if (subCatId !=="") {
      console.log("the Real SubCatid:",subCatId);
      params.append("subCat", subCatId);
    }
    else{
      params.append("category", catId);

    }

    fetchDataFromApi(`${url}?${params.toString()}`)
      .then((res) => {
        setProducts(res.product);
      })
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
      });
  };

  const filterByRating = (rating, catId, subCatId) => {
    if(subCatId !==""){
      return fetchDataFromApi(`/api/product?rating=${rating}&subCat=${subCatId}`)
      .then((res) => {
        setProducts(res.product);
      })
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
      });

    }
    else{
      return fetchDataFromApi(`/api/product?rating=${rating}&category=${catId}`)
      .then((res) => {
        setProducts(res.product);
      })
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
      });

    }
    return 
 
  };

  return (
    <>
      <div className="product-Listing-Page">
        <div className="container1">
          <div className="productListing d-flex mt-3">
            <SideBar
              filterProducts={filterProducts}
              filterByRating={filterByRating}
            />

            <div className="content-right pr-5">
              {/* <img
                src="https://cmsimages.shoppersstop.com/main_banner_web_Fossil_michael_kors_and_more_a12056fe6e/main_banner_web_Fossil_michael_kors_and_more_a12056fe6e.png"
                alt=""
                className="w-100 bann1"
                style={{ borderRadius: "10px" }}
              /> */}

              <div className="showby  d-flex mt-4 mb-4 align-items-center">
                <div className="buttonwrapper d-flex align-items-center">
                  <Button
                    onClick={() => handleViewChange("one")}
                    className={`one ${view === "one" ? "act" : ""}`}
                  >
                    <IoMenu />
                  </Button>

                  <Button
                    onClick={() => handleViewChange("three")}
                    className={`three ${view === "three" ? "act" : ""}`}
                  >
                    <BsFillGrid3X3GapFill />
                  </Button>

                  <Button
                    onClick={() => handleViewChange("four")}
                    className={`four ${view === "four" ? "act" : ""}`}
                  >
                    <SiNextra />
                  </Button>
                </div>
                <div className="ml-auto showbyfilter">
                  <Button onClick={handleClick}>
                    Show {val}
                    <FaAngleDown className="ml-2" />
                  </Button>
                  <Menu
                    id="basic-menu"
                    className="w-100 productpagemenu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handleClick1(10)}>10</MenuItem>
                    <MenuItem onClick={() => handleClick1(20)}>20</MenuItem>
                    <MenuItem onClick={() => handleClick1(30)}>30</MenuItem>
                    <MenuItem onClick={() => handleClick1(40)}>40</MenuItem>
                    <MenuItem onClick={() => handleClick1(50)}>50</MenuItem>
                    <MenuItem onClick={() => handleClick1(60)}>60</MenuItem>
                  </Menu>
                </div>
              </div>

              {/* Product List with a single Grow transition */}
              <Grow in={checked}>
                <div className={`productList ${view}`}>
                  {products?.length !== 0 &&
                    products?.map((item, index) => (
                      <HomeProducts data={item} />
                    ))}
                </div>
              </Grow>
              <div className="pageno mt-4">
                <Pagination
                  count={10}
                  color="primary"
                  size="large"
                  className="w-100"
                  style={{ marginLeft: "290px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
