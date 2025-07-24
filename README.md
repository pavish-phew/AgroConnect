# 🌐 AgroConnect 

AgroConnect is an e-commerce platform designed to help users post and sell their products, while others can browse, filter, and purchase items. It provides a robust system with features like carts, wishlists, and profile management.

## 🚀 Features

1. **🛒 Huge Collections of Products**  
   Explore a variety of products posted by different users.

2. **🔍 Search and Filters**  
   Quickly find products using search and filtering options based on category, price, and more.

3. **🛍️ Cart**  
   Easily add products to your cart and proceed to checkout.

4. **💖 Wishlist**  
   Save products to your wishlist for future reference or purchase.

5. **🖥️ Interactive UI**  
   Enjoy a smooth and responsive user interface designed for ease of navigation.

6. **👤 Profile Maintenance**  
   Manage your personal profile, view order history, and update details with ease.
   
7. **🔒 Google OAuth Login**  
   Securely log in to your account using Google OAuth, providing a seamless authentication experience.

## 🛠️ Getting Started

### ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **React.js**: Frontend framework
- **Java Spring Boot**: Backend services and API
- **Node.js**: JavaScript runtime environment
- **Maven**: Dependency management for Spring Boot

### 🔑 Google OAuth Configuration

To enable Google OAuth login, follow these steps to set up your Google Cloud project and obtain your client ID and secret. This configuration is essential for allowing users to securely log in with their Google accounts.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "Credentials" and create OAuth 2.0 credentials.
4. Set the redirect URI to match your backend application's endpoint.
5. Add your client ID and secret to the application properties of your Spring Boot backend.

### 📥 Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   https://github.com/lokesh-kumaravel/AgroConnect.git

2. Navigate into the project directory:
   ```bash
   cd AgroConnect

3. Navigate into the Frontend directory:
   ```bash
   npm install

4. Navigate into the Backend directory:
   ```bash
   mvn install

5. Run the frontend:
   ```bash
   npm run dev

6. Run the backend:
   ```bash
   mvn spring-boot:run

### 🗂️ Project Structure
      ```bash
      /AgroConnect
      │
      ├── /frontend              # Frontend source files
      │   ├── /src               # Main source files
      │   ├── /components        # React components
      │   ├── /pages             # Pages of the application
      │   └── index.js           # Entry point for the frontend
      │
      └── /backend               # Backend source files
          ├── /src               # Main source files
          ├── /controllers       # Controllers for handling requests
          ├── /models            # JPA models for database entities
          ├── /repositories      # MongoDB repositories for data access
          └── Application.java    # Spring Boot application entry point

### 📜 License
This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for details.

### 📞 Contact

For any inquiries or feedback, feel free to reach out:

- **Name**: Lokesh K
- **Email**: [lokeshkumaravel29@gmail.com](mailto:lokeshkumaravel29@gmail.com)
- **GitHub**: [lokesh-kumaravel](https://github.com/lokesh-kumaravel)
- **LinkedIn**: [Lokesh K](https://www.linkedin.com/in/lokesh-k-5b7513276)

