import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const category = selectedCategory;
    const name = inputSearch;
    getProducts(category, name, currentPage);
  }, [selectedCategory, inputSearch]);

  const getProducts = async (category, name, currentPage) => {
    try {
      setIsError(false);
      setIsLoading(true);

      const results = await axios(
        `http://localhost:4001/products?category=${category}&name=${name}&page=${currentPage}`
      );

      setProducts(results.data.data);
      setTotalPage(results.data.totalPages);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      getProducts(selectedCategory, inputSearch, nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      getProducts(selectedCategory, inputSearch, previousPage);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4001/products/${productId}`);
    const newProducts = products.filter((product) => product._id !== productId);
    setProducts(newProducts);
  };

  const handleSelectCategory = async (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearch = async (e) => {
    setInputSearch(e.target.value);
  };

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button
          onClick={() => {
            navigate("/product/create");
          }}
        >
          Create Product
        </button>
      </div>
      <div className="search-box-container">
        <div className="search-box">
          <label>
            Search product
            <input
              type="text"
              placeholder="Search by name"
              value={inputSearch}
              onChange={handleSearch}
            />
          </label>
        </div>
        <div className="category-filter">
          <label>
            View Category
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={handleSelectCategory}
            >
              <option disabled value="">
                -- Select a category --
              </option>
              <option value="it">IT</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
              <option value="">See all</option>
            </select>
          </label>
        </div>
      </div>
      <div className="product-list">
        {!products.length && !isError && (
          <div className="no-blog-posts-container">
            <h1>No Products</h1>
          </div>
        )}
        {products.map((product) => {
          return (
            <div className="product" key={product._id}>
              <div className="product-preview">
                <img
                  src={product.image}
                  alt="some product"
                  width="250"
                  height="250"
                />
              </div>
              <div className="product-detail">
                <h1>Product name: {product.name} </h1>
                <h2>Product price: {product.price}</h2>
                <h3>Category: IT</h3>
                <h3>Created Time: {product.created}</h3>
                <p>Product description: {product.description} </p>
                <div className="product-actions">
                  <button
                    className="view-button"
                    onClick={() => {
                      navigate(`/product/view/${product._id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate(`/product/edit/${product._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                className="delete-button"
                onClick={() => {
                  deleteProduct(product._id);
                }}
              >
                x
              </button>
            </div>
          );
        })}
        {isError ? <h1>Request failed</h1> : null}
        {isLoading ? <h1>Loading ....</h1> : null}
      </div>

      <div className="pagination">
        <button className="previous-button" onClick={handlePreviousPage}>
          Previous
        </button>
        <button className="next-button" onClick={handleNextPage}>
          Next
        </button>
      </div>
      <div className="pages">
        {currentPage}/ {totalPage}
      </div>
    </div>
  );
}

export default HomePage;
