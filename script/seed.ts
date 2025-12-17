import "dotenv/config";
import { db } from "../server/db";
import { learningPaths, lessons, scenarios, exercises, userProgress } from "../shared/schema";
import { BookOpen, BarChart3, Code, Layers, ShoppingCart, Building2, GraduationCap, Landmark, Users } from "lucide-react";

async function seed() {
    console.log("Seeding database...");

    // --- CLEANUP ---
    console.log("Cleaning up existing data...");
    await db.delete(userProgress);
    await db.delete(exercises);
    await db.delete(scenarios);
    await db.delete(lessons);
    await db.delete(learningPaths);

    // --- Learning Paths & Lessons ---
    const pathsData = [
        {
            title: "Beginner SQL",
            description: "Start from scratch. Learn the fundamentals of querying databases with SQL.",
            icon: "BookOpen",
            difficulty: "Beginner",
            totalLessons: 24,
            estimatedHours: 8,
            orderIndex: 0,
            lessons: [
                {
                    title: "What is a Database?",
                    description: "Understanding data storage",
                    content: `# What is a Database?

A **database** is an organized collection of data, generally stored and accessed electronically from a computer system. Where databases are more complex they are often developed using formal design and modeling techniques.

### Key Concepts

*   **Table**: A collection of related data held in a structured format within a database. It consists of columns and rows.
*   **Row (Record)**: A single, implicitly structured data item in a table.
*   **Column (Field)**: A set of data values of a particular simple type, one value for each row of the database.

### Visual Representation

Imagine a 'Customers' table:

| CustomerID | Name        | Country |
| :--------- | :---------- | :------ |
| 1          | John Doe    | USA     |
| 2          | Jane Smith  | Canada  |
| 3          | Bob Johnson | UK      |

*   **Columns**: CustomerID, Name, Country
*   **Rows**: Each horizontal line representing a person.
`,
                    type: "concept",
                    orderIndex: 0
                },
                {
                    title: "Your First SELECT",
                    description: "Retrieving data from tables",
                    content: `# The SELECT Statement

The \`SELECT\` statement is used to select data from a database. The data returned is stored in a result table, called the result-set.

### Syntax

\`\`\`sql
SELECT column1, column2, ...
FROM table_name;
\`\`\`

### Example

**Table: Employees**

| ID | Name  | Role      |
| :- | :---- | :-------- |
| 1  | Alice | Manager   |
| 2  | Bob   | Developer |
| 3  | Carol | Designer  |

**Query:**
\`\`\`sql
SELECT Name, Role FROM Employees;
\`\`\`

**Result:**

| Name  | Role      |
| :---- | :-------- |
| Alice | Manager   |
| Bob   | Developer |
| Carol | Designer  |
`,
                    type: "practice",
                    orderIndex: 1
                },
                {
                    title: "Filtering with WHERE",
                    description: "Finding specific data",
                    content: `# The WHERE Clause

The \`WHERE\` clause is used to filter records.

### Syntax

\`\`\`sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
\`\`\`

### Common Operators

| Operator | Description |
| :--- | :--- |
| \`=\` | Equal |
| \`>\` | Greater than |
| \`<\` | Less than |

### Example

**Query:** Get 'Developer's.

\`\`\`sql
SELECT * FROM Employees WHERE Role = 'Developer';
\`\`\`

**Result:**

| ID | Name | Role      |
| :- | :--- | :-------- |
| 2  | Bob  | Developer |
`,
                    type: "practice",
                    orderIndex: 2
                },
                {
                    title: "Sorting Results",
                    description: "ORDER BY explained",
                    content: `# The ORDER BY Keyword

The \`ORDER BY\` keyword is used to sort the result-set.

### Syntax

\`\`\`sql
SELECT * FROM table_name ORDER BY column ASC|DESC;
\`\`\`

### Example

**Table: Products**

| Product | Price |
| :------ | :---- |
| Apple   | 1.20  |
| Banana  | 0.50  |
| Cherry  | 2.00  |

**Query:** Sort by price (cheapest first).

\`\`\`sql
SELECT Product, Price FROM Products ORDER BY Price ASC;
\`\`\`

**Result:**

| Product | Price |
| :------ | :---- |
| Banana  | 0.50  |
| Apple   | 1.20  |
| Cherry  | 2.00  |
`,
                    type: "concept",
                    orderIndex: 3
                },
                {
                    title: "Practice Challenge",
                    description: "Apply what you've learned",
                    content: `# Beginner Challenge

### Task
Select **Title** and **Author** from \`Books\` table where **Year** > 2000, ordered by **Year** descending.

**Expected Output:**

| Title | Author |
| :--- | :--- |
| ...   | ...    |
`,
                    type: "challenge",
                    orderIndex: 4
                },
            ],
        },
        {
            title: "SQL for Data Analysts",
            description: "Master aggregations, window functions, and analytical queries.",
            icon: "BarChart3",
            difficulty: "Intermediate",
            totalLessons: 32,
            estimatedHours: 12,
            orderIndex: 1,
            lessons: [
                { title: "Aggregation Functions", description: "COUNT, SUM, AVG", content: `# Aggregate Functions\n\n- \`COUNT()\`: Row count\n- \`SUM()\`: Total sum\n- \`AVG()\`: Average value\n\n### Example\n\n\`\`\`sql\nSELECT SUM(Amount) FROM Sales;\n\`\`\``, type: "concept", orderIndex: 0 },
                { title: "GROUP BY Mastery", description: "Grouping data", content: `# GROUP BY\n\nGroup rows that have the same values.\n\n### Example\n\n\`\`\`sql\nSELECT Customer, SUM(Amount) FROM Order GROUP BY Customer;\n\`\`\``, type: "practice", orderIndex: 1 },
                { title: "HAVING Clause", description: "Filtering groups", content: `# HAVING\n\nFilter groups **after** aggregation.\n\n### Example\n\n\`\`\`sql\nSELECT Customer, SUM(Amount) \nFROM Orders \nGROUP BY Customer \nHAVING SUM(Amount) > 1000;\n\`\`\``, type: "practice", orderIndex: 2 },
                { title: "Window Functions", description: "ROW_NUMBER, RANK", content: `# Window Functions\n\nCalculate across a set of rows related to the current row.\n\n### Example\n\n\`\`\`sql\nSELECT Name, RANK() OVER (ORDER BY Score DESC) FROM Players;\n\`\`\``, type: "concept", orderIndex: 3 },
                { title: "Analysis Project", description: "Real-world analysis", content: `# Challenge\n\nAnalyze sales data to find top performing stores.`, type: "challenge", orderIndex: 4 },
            ],
        },
        {
            title: "SQL for Backend Devs",
            description: "Learn database design, optimization, and integration patterns.",
            icon: "Code",
            difficulty: "Intermediate",
            totalLessons: 28,
            estimatedHours: 10,
            orderIndex: 2,
            lessons: [
                {
                    title: "Transactions & ACID",
                    description: "Atomicity, Consistency, Isolation, Durability",
                    content: `# Transactions & ACID

A **transaction** is a single logical unit of work. **ACID** properties ensure data validity.

### ACID Properties

*   **Atomicity**: All or nothing. If one part fails, the entire transaction fails.
*   **Consistency**: Transforming data from one valid state to another.
*   **Isolation**: Transactions occur independently without interference.
*   **Durability**: Committed changes are permanent.

### SQL Commands

*   \`BEGIN TRANSACTION\`: Start a new transaction.
*   \`COMMIT\`: Save changes.
*   \`ROLLBACK\`: Undo changes.

### Example: Bank Transfer

Transfer $100 from Account A to Account B.

\`\`\`sql
BEGIN TRANSACTION;

UPDATE Accounts SET Balance = Balance - 100 WHERE ID = 'A';
UPDATE Accounts SET Balance = Balance + 100 WHERE ID = 'B';

-- If everything is okay:
COMMIT;

-- If error occurs:
-- ROLLBACK;
\`\`\`
`,
                    type: "concept",
                    orderIndex: 0
                },
                {
                    title: "Index Fundamentals",
                    description: "B-Tree, Clustered vs Non-Clustered",
                    content: `# Database Indexing

Indexes speed up data retrieval operations on a database table (like a book index).

### Types of Indexes

| Type | Description |
| :--- | :--- |
| **Clustered** | Determines the **physical order** of data. Only one per table (usually Primary Key). |
| **Non-Clustered** | A separate structure with pointers to the data. Can have multiple per table. |

### Visualizing B-Trees

Most indexes use a **B-Tree** structure. It keeps data sorted and allows for searches, sequential access, insertions, and deletions in logarithmic time.

### Syntax

\`\`\`sql
CREATE INDEX idx_lastname ON Employees (LastName);
\`\`\`
`,
                    type: "concept",
                    orderIndex: 1
                },
                {
                    title: "Query Performance",
                    description: "Scans vs Seeks",
                    content: `# Query Performance Tuning

Understanding how the database executes your query is key to performance.

### Scan vs Seek

| Operation | Concept | Efficiency |
| :--- | :--- | :--- |
| **Index Seek** | Jump directly to specific rows using the index tree. | **High** (like looking up a word in a dictionary). |
| **Index Scan** | Read the entire index structure. | **Medium/Low** (reading the whole index). |
| **Table Scan** | Read every row in the table. | **Low** (reading the whole book page by page). |

### EXPLAIN

Use the \`EXPLAIN\` command to see the execution plan.

\`\`\`sql
EXPLAIN SELECT * FROM Users WHERE ID = 5;
-- Output might show: "Index Scan using users_pkey on users"
\`\`\`
`,
                    type: "practice",
                    orderIndex: 2
                },
                {
                    title: "Database Design - Normalization",
                    description: "1NF, 2NF, 3NF",
                    content: `# Normalization

The process of organizing data to reduce redundancy and improve data integrity.

### Normal Forms

1.  **1NF (First Normal Form)**:
    *   Atomic values (no lists in a single cell).
    *   Unique column names.
    *   Primary Key.

2.  **2NF (Second Normal Form)**:
    *   Must be in 1NF.
    *   No partial dependencies (non-key attributes depend on the *whole* primary key).

3.  **3NF (Third Normal Form)**:
    *   Must be in 2NF.
    *   No transitive dependencies (non-key attributes depend *only* on the primary key, not other non-key attributes).

### Example: 1NF Violation

| Student | Classes |
| :--- | :--- |
| Alice | Math, Science |

**Fix:** Split into rows.

| Student | Class |
| :--- | :--- |
| Alice | Math |
| Alice | Science |
`,
                    type: "practice",
                    orderIndex: 3
                },
                {
                    title: "Backend Project",
                    description: "Design an Auth Schema",
                    content: `# Challenge: Auth System Schema

Design a database schema for a user authentication and permission system.

### Requirements

1.  **Users**: Store username, email, password hash.
2.  **Roles**: Admin, Editor, Viewer.
3.  **Permissions**: create_post, delete_post, view_stats.
4.  **Relationships**:
    *   A User has one Role (1:N or N:M depending on design - let's say 1 User has many roles for flexibility).
    *   A Role has many Permissions.

### Task

Write the \`CREATE TABLE\` statements for:
*   \`users\`
*   \`roles\`
*   \`permissions\`
*   \`user_roles\` (junction table)
*   \`role_permissions\` (junction table)
`,
                    type: "challenge",
                    orderIndex: 4
                },
            ],
        },
        {
            title: "Database Design",
            description: "Master entity relationships, normalization, and schema patterns.",
            icon: "Layers",
            difficulty: "Beginner",
            totalLessons: 20,
            estimatedHours: 8,
            orderIndex: 3,
            lessons: [
                {
                    title: "Entities & Attributes",
                    description: "Modeling real-world data",
                    content: `# ER Design: Entities & Attributes

**Entity-Relationship (ER) Diagrams** help visualize database structure before building it.

### Basics

*   **Entity** (Noun): Represents a real-world object (e.g., Customer, Product, Order). Drawn as a **Rectangle**.
*   **Attribute** (Adjective): Describes an entity (e.g., Name, Price, Date). Drawn as an **Oval**.

### Example: Student System

*   **Entities**: Student, Course.
*   **Attributes**: 
    *   Student: ID, Name, Email.
    *   Course: Code, Title, Credits.
`,
                    type: "concept",
                    orderIndex: 0
                },
                {
                    title: "Primary Keys",
                    description: "Natural vs Surrogate Keys",
                    content: `# Primary Keys

A **Primary Key (PK)** uniquely identifies every record in a table. It cannot be NULL.

### Types of Keys

1.  **Natural Key**: Uses existing data unique to the entity.
    *   *Example*: Social Security Number, Email Address.
    *   *Pros*: Meaningful.
    *   *Cons*: Can change (e.g., email), might be long strings.

2.  **Surrogate Key**: Artificially generated unique identifier.
    *   *Example*: Auto-increment Integer (1, 2, 3...) or UUID.
    *   *Pros*: Never changes, efficient.
    *   *Cons*: No business meaning.

### Recommendation
Use **Surrogate Keys** (UUID or Integer) for internal database relationships (Foreign Keys).
`,
                    type: "concept",
                    orderIndex: 1
                },
                {
                    title: "Relationships & Cardinality",
                    description: "1:1, 1:N, N:M",
                    content: `# Database Relationships

How records in one table relate to records in another.

### 1. One-to-One (1:1)
*   Each row in Table A links to one row in Table B.
*   *Example*: Person <-> Passport.

### 2. One-to-Many (1:N)
*   Each row in Table A links to many rows in Table B.
*   *Example*: Author -> Books (One author writes many books).
*   **Implementation**: Put the \`AuthorID\` (FK) in the \`Books\` table.

### 3. Many-to-Many (N:M)
*   Many rows in Table A link to many rows in Table B.
*   *Example*: Student <-> Course (Student takes many courses; Course has many students).
*   **Implementation**: Requires a **Junction Table** (e.g., \`Enrollments\`) containing \`StudentID\` and \`CourseID\`.

### ER Diagram Notation
*   **1:1**: Line with single dash.
*   **1:N**: Line splitting into "Crow's Foot".
`,
                    type: "practice",
                    orderIndex: 2
                },
                {
                    title: "Normalization Process",
                    description: "Step-by-Step Guide",
                    content: `# Normalization Walkthrough

Let's normalize a messy "Orders" spreadsheet.

**Unnormalized Data (UNF):**

| Order | Customer | Items |
| :--- | :--- | :--- |
| 1 | John | Apple, Banana |

### Step 1: 1NF (Atomic Values)
Split lists into rows.

| Order | Customer | Item |
| :--- | :--- | :--- |
| 1 | John | Apple |
| 1 | John | Banana |

(Problem: Duplicate Order/Customer info)

### Step 2: 2NF (No Partial Dependencies)
Split tables based on Primary Key.

**Table: Orders**
| OrderID | Customer |
| :--- | :--- |
| 1 | John |

**Table: OrderItems**
| OrderID | Item |
| :--- | :--- |
| 1 | Apple |
| 1 | Banana |

### Step 3: 3NF (No Transitive Dependencies)
If "Customer" has details like "City", move Customer to its own table.
`,
                    type: "concept",
                    orderIndex: 3
                },
                {
                    title: "Design a Database",
                    description: "Project: Instagram Clone",
                    content: `# Challenge: Instagram Schema

Design a simplified schema for a photo-sharing app.

### Core Features

1.  **Users** can sign up.
2.  **Users** can post **Photos** (Caption, ImageURL).
3.  **Users** can **Comment** on photos.
4.  **Users** can **Like** photos.

### Requirements

*   Handle the **1:N** relationship between User and Photos.
*   Handle the **1:N** relationship between Photo and Comments.
*   Handle the **N:M** relationship for Likes (User likes Photo).

### Task
Draw the ER Diagram or write the \`CREATE TABLE\` statements. Ensure you include Foreign Keys!
`,
                    type: "challenge",
                    orderIndex: 4
                },
            ],
        },
    ];

    for (const path of pathsData) {
        const [insertedPath] = await db.insert(learningPaths).values({
            title: path.title,
            description: path.description,
            icon: path.icon,
            difficulty: path.difficulty,
            totalLessons: path.totalLessons,
            estimatedHours: path.estimatedHours,
            orderIndex: path.orderIndex,
        }).returning();

        console.log(`Inserted path: ${path.title}`);

        for (const lesson of path.lessons) {
            await db.insert(lessons).values({
                pathId: insertedPath.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                type: lesson.type,
                orderIndex: lesson.orderIndex,
            });
        }
    }

    // --- Scenarios & Exercises ---
    const scenariosData = [
        {
            id: "ecommerce",
            title: "E-Commerce Platform",
            description: "Build the database for an online store with products, customers, orders, and reviews.",
            icon: "ShoppingCart",
            category: "ecommerce",
            sampleData: {}, // Placeholder
            schema: {}, // Placeholder
            exercises: [
                { title: "List all products", description: "Write a query to get all products from the catalog", difficulty: "Easy", expectedQuery: "SELECT * FROM products;", orderIndex: 0 },
                { title: "Products by category", description: "Get products filtered by a specific category", difficulty: "Easy", expectedQuery: "SELECT * FROM products WHERE category = 'Electronics';", orderIndex: 1 },
                { title: "Top selling products", description: "Find the 10 most ordered products", difficulty: "Medium", expectedQuery: "SELECT product_id, COUNT(*) as count FROM order_items GROUP BY product_id ORDER BY count DESC LIMIT 10;", orderIndex: 2 },
                { title: "Customer order history", description: "Get all orders for a specific customer with details", difficulty: "Medium", expectedQuery: "SELECT * FROM orders WHERE customer_id = 1;", orderIndex: 3 },
                { title: "Revenue by category", description: "Calculate total revenue grouped by product category", difficulty: "Medium", expectedQuery: "SELECT category, SUM(price) FROM products JOIN order_items ON products.id = order_items.product_id GROUP BY category;", orderIndex: 4 },
                { title: "Average order value", description: "Find the average order value per customer", difficulty: "Hard", expectedQuery: "SELECT customer_id, AVG(total) FROM orders GROUP BY customer_id;", orderIndex: 5 },
            ]
        },
        {
            id: "hospital",
            title: "Hospital Management",
            description: "Design a system for patients, doctors, appointments, and medical records.",
            icon: "Building2",
            category: "hospital",
            sampleData: {},
            schema: {},
            exercises: []
        },
        {
            id: "college",
            title: "College Database",
            description: "Create a university system with students, courses, enrollments, and grades.",
            icon: "GraduationCap",
            category: "college",
            sampleData: {},
            schema: {},
            exercises: []
        },
        {
            id: "banking",
            title: "Banking System",
            description: "Build a banking database with accounts, transactions, and customer management.",
            icon: "Landmark",
            category: "banking",
            sampleData: {},
            schema: {},
            exercises: []
        },
        {
            id: "social",
            title: "Social Media App",
            description: "Design a social platform with users, posts, comments, likes, and followers.",
            icon: "Users",
            category: "social",
            sampleData: {},
            schema: {},
            exercises: []
        }
    ];

    for (const scenario of scenariosData) {
        const [insertedScenario] = await db.insert(scenarios).values({
            title: scenario.title,
            description: scenario.description,
            icon: scenario.icon,
            category: scenario.category,
            schema: scenario.schema,
            sampleData: scenario.sampleData,
        }).returning();

        console.log(`Inserted scenario: ${scenario.title}`);

        for (const exercise of scenario.exercises) {
            await db.insert(exercises).values({
                scenarioId: insertedScenario.id,
                title: exercise.title,
                description: exercise.description,
                difficulty: exercise.difficulty,
                expectedQuery: exercise.expectedQuery,
                orderIndex: exercise.orderIndex,
            });
        }
    }

    console.log("Seeding completed successfully.");
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
