# **SATI Job Junction**

SATI Job Junction is a platform where students can share their interview experiences, helping others prepare effectively for placements.

## **Project Setup**

### **Prerequisites**
Ensure you have the following installed:
- Node.js (latest LTS version recommended)
- MongoDB (local or cloud instance)
- Git

---

## **Installation & Setup**

### **1. Clone the Repository**
```sh
git clone https://github.com/panditpankaj21/SATI-Job-Junction.git
cd SATI-Job-Junction
```

### **2. Backend Setup**
Navigate to the backend directory:
```sh
cd backend
```

#### **Configure Environment Variables**
Create a `.env` file in the `backend` directory and add the following variables:
```plaintext
MONGO_URI=<your_mongodb_uri>
ACCESS_TOKEN_SECRET=<your_secret_key>
ACCESS_TOKEN_EXPIRY=<your_expiry_duration>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>

# cloudinay
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_secret_key>
```

#### **Install Dependencies & Run the Server**
```sh
npm install
npm run dev
```
This starts the backend server in development mode.

### **3. Frontend Setup**
Navigate to the frontend directory:
```sh
cd ../frontend
```

#### **Configure Environment Variables**
Create a `.env` file in the `frontend` directory and add the following variable:
```plaintext
VITE_BACKEND_URI=<your_backend_uri>
```

#### **Install Dependencies & Start the Frontend**
```sh
npm install
npm run dev
```
This starts the frontend in development mode.

---

## **Contribution Guidelines**
- Follow best practices for writing clean and maintainable code.
- Ensure proper commit messages (e.g., `feat: add job listing feature`).
- Before submitting a pull request, test your changes thoroughly.
- Open an issue for discussions, suggestions, or feature requests.

