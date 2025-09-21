import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from 'langchain/document_loaders/fs/text';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Embeddings
export const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: GEMINI_API_KEY, modelName: "gemini-embedding-001" });
// LLM for RAG
export const llm = new ChatGoogleGenerativeAI({
    model: 'models/gemini-2.5-flash',
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: GEMINI_API_KEY,
})

// Load data
const loadData = async (file, extension) => {
    let loader
    switch (extension) {
        case '.pdf':
            loader = new PDFLoader(file)
            break;
        case '.csv':
            loader = new CSVLoader(file)
            break
        case '.txt':
            loader = new TextLoader(file)
            break
        default:
            throw Error('Unsupported file type')
    }
    // const loader = new PDFLoader(file);
    const documents = await loader.load()
    // console.log(documents)
    return documents
}

// Split PDF text into chunks
const splitData = async (docs) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splittedDocs = await textSplitter.splitDocuments(docs);
    return splittedDocs
}

const fileFilter = (req, file, cb) => {
    // Accept PDF, CSV and TXT
    const allowedTypes = ['application/pdf', 'text/csv', 'text/plain'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, TXT, or CSV files are allowed.'), false);
    }
}

export const HTTP_STATUS_CODE = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    CREATED: 201,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    SERVICE_UNAVAILABLE: 503,
}
export {
    loadData,
    splitData,
    fileFilter,
}
