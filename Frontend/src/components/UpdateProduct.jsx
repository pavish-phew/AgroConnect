import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../axiosProduct";
const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `/api/product/${id}`
        );

        setProduct(response.data);
        console.log(response.data)
        const responseImage = await axios.get(
          `/api/product/${id}/image`,
          { responseType: "blob" }
        );
       const imageFile = await converUrlToFile(responseImage.data,response.data.imageName)
        setImage(imageFile);     
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);



  const converUrlToFile = async(blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
  
    const productData = {
      ...updateProduct,
      stockQuantity: Number(updateProduct.stockQuantity),
    };
  
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
  
    const userid = localStorage.getItem('currentuser');
    updatedProduct.append("currentuserid", userid);
  
    const token = localStorage.getItem('jwt');
    
    try {
      const response = await axios.put(`/api/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: 'Bearer ' + token,
        },
      });
      console.log("Product updated successfully:", response.data);
      console.log(productData);
      alert("Product updated successfully!");
      navigate(`/product/${id}`)
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  
  // const handleSubmit = async(e) => {
  //   e.preventDefault();
  //   console.log("images", image)
  //   console.log("productsdfsfsf", updateProduct)
  //   const updatedProduct = new FormData();
  //   updatedProduct.append("imageFile", image);
  //   updatedProduct.append(
  //     "product",
  //     new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
  //   );
  //   var userid = localStorage.getItem('currentuser')
  //   updatedProduct.append("currentuserid",userid);
  

    
  //   var token = localStorage.getItem('jwt')
  // console.log("formData : ", updatedProduct)
  //   axios
  //     .put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         'Authorization': 'Bearer ' + token,
  //       },
  //     })
  //     .then((response) => {
  //       console.log("Product updated successfully:", updatedProduct);
  //       alert("Product updated successfully!");
  //     })
  //     .catch((error) => {
  //       console.error("Error updating product:", error);
  //       console.log("product unsuccessfull update",updateProduct)
  //       alert("Failed to update product. Please try again.");
  //     });
  // };
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  

  return (
    <div className="update-product-container" >
      <div className="center-container"style={{marginTop:"7rem"}}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.name}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder={product.brand}
              value={updateProduct.brand}
              onChange={handleChange}
              id="brand"
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.description}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
              id="description"
            />
          </div>
          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price}
              name="price"
              id="price"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category}
              onChange={handleChange}
              name="category"
              id="category"
            >
              <option value="">Select category</option>
              <option value="Seed">Seed</option>
              <option value="Equipment">Equipment</option>
              <option value="Tools">Tools</option>
              <option value="Machinary">Machinary</option>
              <option value="Herbisite">Herbisite</option>
              <option value="Pesticides">Pesticides</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              placeholder={product.stockQuantity}
              value={updateProduct.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <img
              src={image ? URL.createObjectURL(image) : "Image unavailable"}
              alt={product.imageName}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                padding: "5px",
                margin: "0",
              }}
            />
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              placeholder="Upload image"
              name="imageUrl"
              id="imageUrl"
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;