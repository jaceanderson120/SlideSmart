// This is an example of what gpt-4o would return when a user wants to extract data from a PowerPoint
export const gptData = {
  "1. Relational Model and Schema": {
    summary: [
      "The relational model is a way of structuring data using relations, which are represented as tables. In a relational database, each table is called a relation and consists of rows (tuples) and columns (attributes). A schema is a blueprint that defines the structure of the data, including the tables, their fields, and relationships between them. It's crucial for organizing and storing data efficiently.",
      "Relational Model and Schema in Databases",
    ],
    question:
      "Given the following schema for a university database, determine the primary key for the 'Students' and 'Enrollments' tables.\n\nSchema:\nStudents (StudentID, FirstName, LastName, Major)\nCourses (CourseID, CourseName, Credits)\nEnrollments (StudentID, CourseID, Grade)\n\nWhat are the primary keys for the 'Students' and 'Enrollments' tables?",
    answer:
      "For the 'Students' table, the primary key is 'StudentID'. For the 'Enrollments' table, the primary key is the composite key (StudentID, CourseID).",
    youtubeId: ["Q45sr5p_NmQ"],
  },
  "2. SQL Basics: DDL & DML": {
    summary: [
      "SQL (Structured Query Language) is a standard language used to communicate with and manipulate databases. It includes DDL (Data Definition Language) for defining and modifying database structures (e.g., CREATE, ALTER, DROP tables) and DML (Data Manipulation Language) for managing data within the schema (e.g., INSERT, UPDATE, DELETE). Understanding DDL and DML commands is fundamental for working with databases.",
      "SQL DDL and DML commands tutorial",
    ],
    question:
      "Write an SQL query using DDL to create a new table named 'Books' with the columns 'BookID' (primary key), 'Title', 'Author', and 'PublishedYear'. Then, write a DML query to insert a new row into the 'Books' table with the values (1, '1984', 'George Orwell', 1949).",
    answer:
      "DDL query: \nCREATE TABLE Books (\n  BookID INT PRIMARY KEY,\n  Title VARCHAR(100),\n  Author VARCHAR(100),\n  PublishedYear INT\n);\n\nDML query: \nINSERT INTO Books (BookID, Title, Author, PublishedYear) \nVALUES (1, '1984', 'George Orwell', 1949);",
    youtubeId: ["dVxd5z97878"],
  },
  "3. Formal Query Languages": {
    summary: [
      "Formal query languages in relational databases include relational algebra and relational calculus. Relational algebra is a procedural language that uses operators to manipulate relations, while relational calculus is declarative and describes what results to obtain rather than how to obtain them. Both are foundational for understanding how SQL works behind the scenes.",
      "Relational Algebra and Relational Calculus introduction",
    ],
    question:
      "Using relational algebra, how would you represent the following SQL query: SELECT * FROM Students WHERE Major = 'Computer Science'?",
    answer: "σ_Major = 'Computer Science' (Students)",
    youtubeId: ["76v3gRns28U"],
  },
  "4. Introduction to SQL": {
    summary: [
      "SQL, pronounced either 'S.Q.L.' or 'sequel', is supported by all major commercial database systems and has been standardized with many new features over time. It is a declarative language, meaning you specify what you want to do without needing to describe how to do it. This introduction covers basic features and how SQL has persisted despite the advent of other data management solutions like NoSQL.",
      "SQL Introduction and Basics",
    ],
    question:
      "What is the difference between the SQL commands 'SELECT * FROM Students;' and 'SELECT FirstName, LastName FROM Students WHERE Major = 'Physics';'?",
    answer:
      "'SELECT * FROM Students;' will retrieve all columns and rows from the 'Students' table. 'SELECT FirstName, LastName FROM Students WHERE Major = 'Physics';' will retrieve only the FirstName and LastName columns for students whose Major is 'Physics'.",
    youtubeId: ["h0nxCDiD-zg"],
  },
  "5. SQL Query Basics": {
    summary: [
      "Basic SQL queries involve selecting data from one or more tables using the SELECT, FROM, and WHERE clauses. You need to determine the tables, rows, and columns you're interested in. SQL commands are not case-sensitive, and strings are enclosed in single quotes. Understanding SELECT statements with conditions, such as WHERE clauses and how to handle NULL values, is essential.",
      "Basic SQL Queries tutorial",
    ],
    question:
      "Write an SQL query to select the first and last names of students from the 'Students' table who are majoring in 'Mathematics'.",
    answer:
      "SELECT FirstName, LastName FROM Students WHERE Major = 'Mathematics';",
    youtubeId: ["kbKty5ZVKMY"],
  },
  "6. SQL Set Operations": {
    summary: [
      "SQL supports set operations like UNION, INTERSECT, and EXCEPT (MINUS in some systems) to combine results from multiple queries. These operations require union-compatible tables and can handle duplicates using the ALL keyword. Learning set operations expands your ability to manipulate and query data efficiently across different tables.",
      "SQL Set Operations UNION INTERSECT EXCEPT tutorial",
    ],
    question:
      "Given the following two queries:\nQuery1: SELECT StudentID FROM Enrollments WHERE Grade >= 90;\nQuery2: SELECT StudentID FROM Enrollments WHERE Grade < 60;\n\nWrite an SQL query using a set operation to find StudentIDs who have grades either greater than or equal to 90 or less than 60.",
    answer:
      "SELECT StudentID FROM Enrollments WHERE Grade >= 90\nUNION\nSELECT StudentID FROM Enrollments WHERE Grade < 60;",
    youtubeId: ["krnAfIHqGzI"],
  },
  "7. Handling NULLs in SQL": {
    summary: [
      "In SQL, NULL represents missing or unknown data. NULLs can affect arithmetic operations and comparisons, resulting in null or unknown outcomes. Special operators like IS NULL and IS NOT NULL are used to test for NULL values. Understanding how NULLs work is critical to avoiding unexpected results in queries.",
      "NULL values in SQL tutorial",
    ],
    question:
      "Write an SQL query to select all records from the 'Students' table where the 'Major' field is NULL.",
    answer: "SELECT * FROM Students WHERE Major IS NULL;",
    youtubeId: ["8X6ih2jyfUg"],
  },
  "8. SQL Pattern Matching and Ordering": {
    summary: [
      "SQL provides pattern matching using the LIKE operator with the % (zero or more characters) and _ (single character) symbols. The ORDER BY clause is used to sort query results by one or more columns in ascending (default) or descending order. These features are useful for filtering and organizing data in meaningful ways.",
      "SQL LIKE and ORDER BY tutorial",
    ],
    question:
      "Write an SQL query to find all students whose last name starts with 'S' and then order the results by 'FirstName' in descending order.",
    answer:
      "SELECT * FROM Students WHERE LastName LIKE 'S%' ORDER BY FirstName DESC;",
    youtubeId: ["4Ut4Oxxz8xI"],
  },
  "9. Multi-Table Queries": {
    summary: [
      "Queries involving multiple tables use joins to combine records based on related columns. The Cartesian product (cross join) can be filtered using conditions in the WHERE clause to create meaningful associations between tables. This is key for advanced data retrieval involving relational databases.",
      "SQL Multi-Table Joins tutorial",
    ],
    question:
      "Write an SQL query to retrieve the 'FirstName' and 'LastName' of students who have enrolled in a course with the 'CourseName' 'Algorithms'. Assume the tables are 'Students' and 'Courses' and 'Enrollments', where 'Enrollments' links 'StudentID' and 'CourseID'.",
    answer:
      "SELECT Students.FirstName, Students.LastName \nFROM Students \nJOIN Enrollments ON Students.StudentID = Enrollments.StudentID \nJOIN Courses ON Enrollments.CourseID = Courses.CourseID \nWHERE Courses.CourseName = 'Algorithms';",
    youtubeId: ["G3lJAxg1cy8"],
  },
};

// This is an example of what pages/api/search-google would return

export const googleSearchExample = [
  {
    link: "https://stackoverflow.com/questions/8892465/what-does-object-object-mean-javascript",
    title:
      "jquery - What does [object Object] mean? (JavaScript) - Stack Overflow",
    snippet:
      "Jan 17, 2012 ... 8 Answers 8 · JSON.stringify(JSONobject) · console.log(JSONobject) · or iterate over the object. Basic example. var ...",
  },
  {
    link: "https://www.reddit.com/r/typescript/comments/15xe47m/json_object_always_shows_as_object_object_in_my/",
    title:
      'JSON Object Always Shows As "[Object object]" In My Console? : r ...',
    snippet:
      "Aug 21, 2023 ... Can you show some code? Usually the [object Object] output means you convert an object to string. Are you running this code in firefox? You ...",
  },
  {
    link: "https://stackoverflow.com/questions/4750225/what-does-object-object-mean",
    title: "javascript - What does [object Object] mean? - Stack Overflow",
    snippet:
      'Jan 20, 2011 ... The default conversion from an object to string is "[object Object] ... As you are dealing with jQuery objects, you might want to do ... alert( ...',
  },
];

export const firebaseUrlExample =
  "https://firebasestorage.googleapis.com/v0/b/slidesmart-89016.appspot.com/o/uploads%2F04-SQL-basics.pptx?alt=media&token=3dee5d82-20d8-4371-8a1f-a628464e1bb3";
