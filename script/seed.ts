import "dotenv/config";
import { db } from "../server/db";
import { learningPaths, lessons, scenarios, exercises } from "../shared/schema";
import { BookOpen, BarChart3, Code, Layers, ShoppingCart, Building2, GraduationCap, Landmark, Users } from "lucide-react";

async function seed() {
    console.log("Seeding database...");

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
                { title: "What is a Database?", description: "Understanding data storage", content: "Concept content placeholder", type: "concept", orderIndex: 0 },
                { title: "Your First SELECT", description: "Retrieving data from tables", content: "Practice content placeholder", type: "practice", orderIndex: 1 },
                { title: "Filtering with WHERE", description: "Finding specific data", content: "Practice content placeholder", type: "practice", orderIndex: 2 },
                { title: "Sorting Results", description: "ORDER BY explained", content: "Concept content placeholder", type: "concept", orderIndex: 3 },
                { title: "Practice Challenge", description: "Apply what you've learned", content: "Challenge content placeholder", type: "challenge", orderIndex: 4 },
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
                { title: "Aggregation Functions", description: "COUNT, SUM, AVG, and more", content: "Concept content placeholder", type: "concept", orderIndex: 0 },
                { title: "GROUP BY Mastery", description: "Grouping data effectively", content: "Practice content placeholder", type: "practice", orderIndex: 1 },
                { title: "HAVING Clause", description: "Filtering grouped data", content: "Practice content placeholder", type: "practice", orderIndex: 2 },
                { title: "Window Functions", description: "Advanced analytics", content: "Concept content placeholder", type: "concept", orderIndex: 3 },
                { title: "Analysis Project", description: "Real-world data analysis", content: "Challenge content placeholder", type: "challenge", orderIndex: 4 },
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
                { title: "Transactions", description: "ACID properties and safety", content: "Concept content placeholder", type: "concept", orderIndex: 0 },
                { title: "Index Fundamentals", description: "Query optimization basics", content: "Concept content placeholder", type: "concept", orderIndex: 1 },
                { title: "Query Performance", description: "Reading execution plans", content: "Practice content placeholder", type: "practice", orderIndex: 2 },
                { title: "Database Design", description: "Normalization in practice", content: "Practice content placeholder", type: "practice", orderIndex: 3 },
                { title: "Backend Project", description: "Design a complete schema", content: "Challenge content placeholder", type: "challenge", orderIndex: 4 },
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
                { title: "Entities & Attributes", description: "Modeling real-world data", content: "Concept content placeholder", type: "concept", orderIndex: 0 },
                { title: "Primary Keys", description: "Unique identification", content: "Concept content placeholder", type: "concept", orderIndex: 1 },
                { title: "Relationships", description: "Connecting tables", content: "Practice content placeholder", type: "practice", orderIndex: 2 },
                { title: "Normalization", description: "1NF, 2NF, 3NF explained", content: "Concept content placeholder", type: "concept", orderIndex: 3 },
                { title: "Design a Database", description: "Complete schema project", content: "Challenge content placeholder", type: "challenge", orderIndex: 4 },
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
