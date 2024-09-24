This is a **CRUD (Create, Read, Update, Delete)** application implemented using HTML, CSS, and JavaScript. The application allows users to perform CRUD operations on a collection of items, where each item has properties like name, age, and movie.

![Screenshot](https://github.com/afrah10shabbeer/CRUD-Application/assets/50787871/7760d775-a454-48e0-b069-8de47949cac0)

Here's a brief description of the application's features:

**HTML Structure:** The HTML markup defines the structure of the application, including a table for displaying the items, input fields for adding new items, and icons for actions like deletion and update.

**Styling:** The CSS file (api_hit.css) styles the elements to provide a visually pleasing interface.

**Scripting:** The JavaScript file (api_hit.js) contains the logic for interacting with the API endpoints to perform CRUD operations.

**API Interaction:** The application interacts with a RESTful API hosted at http://localhost:8000/items. It fetches data from this API to populate the table and sends requests for creating, updating, and deleting items.

Developed a FastAPI application that interacts with a MySQL database to perform CRUD operations. Here's a brief overview of what each part of your code does.

Functionality:

**Create Record:** Users can add new items to the collection by entering values in the input fields and clicking the "ADD CHARACTER" button.
**Read Record:** Upon loading the page, the application fetches data from the API and displays it in the table.
**Update Record:** Users can update existing items by clicking on the update icon, which replaces the text with input fields. After modifying the values, users can save the changes by clicking the save icon.
**Delete Record:** Users can delete items by clicking on the trash icon associated with each row.
**Dynamic UI:** The application dynamically updates the UI based on user actions. For example, when updating a record, it replaces text with input fields, and when saving changes, it reverts to displaying text.
