# 📦 Article Management System (Artikelverwaltung)

This is a complete guide on how to install, run, and use the inventory management system.

## 🚀 How to Start the Project

### 1. Prerequisites
Make sure you have **Node.js** installed on your computer.

### 2. Installation
Open the terminal in the project folder and install the dependencies:
```bash
npm install
```

### 3. Running the Server (Backend)
The system requires the server (API) to be running to save and fetch data.
In the terminal, execute:
```bash
npm start
```
*You will see the message: "API rodando em http://localhost:3001"*

### 4. Opening the Application (Frontend)
Go to the `front-end` folder and open the `index.html` file in your browser (or use the "Live Server" extension in VS Code).

---

## 📖 How to Use the Program

### 1. Add a New Article
In the top panel "Article Management":
- **Article Name**: Enter the product name.
- **Quantity**: Enter the stock quantity.
- **Article Price**: Enter the unit price.
- **Category**: Select a category (e.g., Elektronik, Haushalt, etc).
- Click the **Add** button to save.

### 2. View the List
Added articles will automatically appear in the list below.
- **Total Articles**: Shows the total number of items (rows).
- **Total Price**: Shows the sum of the total value of the entire stock (Quantity × Price).

### 3. View Details and Options (Edit/Delete)
Click on any row in the product list. The item will expand showing:
- **Left Side**: **Edit** (✏️) and **Delete** (🗑️) buttons.
- **Right Side**: Date/Time added and the original Unit Price.

### 4. Edit or Delete (Restricted Area 🔒)
To ensure security, edit and delete functions are protected.
1. Click the Edit or Delete button.
2. An **Administrator Password** will be requested.
3. The default password is:
   > **admin123**

- **Edit**: Opens a form to change name, price, or quantity.
- **Delete**: Permanently removes the item from the database.

---

## 🛠️ Technologies
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Backend**: Node.js, Express.
- **Database**: MongoDB Atlas (Cloud).
