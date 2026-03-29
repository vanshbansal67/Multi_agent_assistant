const { VertexAI } = require('@google-cloud/vertexai');
const db = require('./database');

const vertex_ai = new VertexAI({ project: 'multi-agent-assessment', location: 'us-central1' });
const model = vertex_ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

// 1. Tool Declaration (Gemini ko batana ki wo kya kar sakta hai)
const taskTool = {
    functionDeclarations: [
        {
            name: "addNewTask",
            description: "Saves a new task to Firestore",
            parameters: {
                type: "object",
                properties: {
                    taskName: { type: "string" },
                    priority: { type: "string", enum: ["High", "Medium", "Low"] }
                },
                required: ["taskName", "priority"],
            },
        },
        {
            name: "getTasks",
            description: "Retrieves all tasks from the database",
            parameters: { type: "object", properties: {} } // No params needed
        }
    ],
};

// 2. Real Logic (Actual database operations)
const functions = {
    addNewTask: async (args) => {
        const docRef = db.collection('tasks').doc();
        await docRef.set({
            title: args.taskName, // FIX: args use karo
            priority: args.priority,
            status: 'pending',
            createdAt: new Date()
        });
        return { response: `Bhai, '${args.taskName}' task save ho gaya!` };
    },
    getTasks: async () => {
        const snapshot = await db.collection('tasks').get();
        let tasks = [];
        snapshot.forEach(doc => tasks.push(doc.data().title));
        return { response: tasks.length > 0 ? tasks.join(", ") : "Bhai, koi task nahi mila." };
    }
};

// 3. Main Chat Function
async function startAssistant(userQuery) {
    const chat = model.startChat({ tools: [taskTool] });
    let result = await chat.sendMessage(userQuery);

    // Loop isliye taaki agar agent ko multiple tools call karne ho toh kar sake
    let responsePart = result.response.candidates[0].content.parts[0];

    if (responsePart.functionCall) {
        const call = responsePart.functionCall;
        console.log("🤖 Tool Call:", call.name);

        // Execute the real function
        const apiResponse = await functions[call.name](call.args);

        // Send tool output back to Gemini
        const finalResult = await chat.sendMessage([{
            functionResponse: { name: call.name, response: apiResponse }
        }]);

        const finalOutput = finalResult.response.candidates[0].content.parts[0].text;
        console.log("✅ Final Response:", finalOutput);
        return finalOutput;
    }

    console.log("🤖 Response:", responsePart.text);
    return responsePart.text;
}

module.exports = { startAssistant };