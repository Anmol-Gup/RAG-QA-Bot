import 'dotenv/config'
import { storeVector, createIndex } from './utils/pinecone.js';
import express from 'express'
import { router as Routes } from './routes/index.js';
import cors from 'cors'

const app = express()
const PINECONE_INDEX = process.env.PINECONE_INDEX
const PORT = process.env.PORT || 3000

async function setup() {
    const pdf = '<your_pdf_file>'
    try {
        // const documentRes = await embeddings.embedDocuments(splittedDocs.map(doc => doc.pageContent)) // extract text

        // ✅ Create index only once
        // const pineconeIndex = await createIndex(PINECONE_INDEX)

        // ✅ Store vectors
        // await storeVector(pdf)

        console.log("🚀 Setup complete successfully...")
    }
    catch (err) {
        if (err.name === "PineconeConflictError") {
            console.log("❌ Index already exists, skipping creation");
        }
        else {
            console.error("❌ Setup failed:", err)
            throw err;
        }
    }
}

app.use(express.json()); // for parsing JSON
app.use(cors({
    origin: 'http://localhost:5173' 
}))
app.use('/api', Routes)

app.listen(PORT, () => {
    console.log(`🚀 Server started successfully at port no. ${PORT}...`)
    setup()
})