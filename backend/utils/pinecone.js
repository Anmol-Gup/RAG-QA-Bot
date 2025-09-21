import { Pinecone } from "@pinecone-database/pinecone";
import 'dotenv/config'
import { PineconeStore } from "@langchain/pinecone";
import { loadData, splitData, llm, embeddings } from "./helper.js";
import { StringOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

let client = null

const getPineconeClient = () => {
    if (!client) {
        client = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }
    return client;
}

const getIndex = () => {
    const client = getPineconeClient()
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    return pineconeIndex
}

const createIndex = async (name) => {
    const pc = getPineconeClient()
    // await pc.deleteIndex(process.env.PINECONE_INDEX)
    const pineconeIndex = await pc.createIndex({
        name,
        vectorType: 'dense',
        dimension: 3072,
        metric: 'cosine', // cosine distance metric compares different documents for similarity. This is often used to find similarities between different documents. The advantage is that the scores are normalized to [-1,1] range.
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1'
            }
        },
        deletionProtection: 'disabled',
        tags: { environment: 'development' },
    })
    console.log('✅ Index created successfully...')
    return pineconeIndex
}

const storeVector = async (file, extension) => {
    const docs = await loadData(file, extension)
    const splittedDocs = await splitData(docs)
    const pineconeIndex = getIndex()
    // const stats = await pineconeIndex.describeIndexStats();
    // console.log(JSON.stringify(stats, null, 2));
    await pineconeIndex.namespace(process.env.PINECONE_NAMESPACE).deleteAll()
    const vectorStore = await PineconeStore.fromDocuments(splittedDocs, embeddings, {
        pineconeIndex,
        namespace: process.env.PINECONE_NAMESPACE,
    })
    console.log('✅ Vectors stored successfully...')
}

const retrieveVector = async (userQuery) => {
    const pineconeIndex = getIndex()
    // const stats = await pineconeIndex.describeIndexStats();
    // console.log('📈 Index stats:', JSON.stringify(stats, null, 2));

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: process.env.PINECONE_NAMESPACE,
    })

    const retriever = vectorStore.asRetriever({
        k: 3,
    })

    const customTemplate = `
        Use the following context to answer the user's question concisely.

        Context:
        {context}

        Question:
        {question}

        Instructions:
        - Always respond in the same language or style as the user's question.
        - If you don't know the answer, say you don't know. - If the context doesn't contain enough information to answer the question, say "I don't have enough information in the document to answer this question"
        - Keep the answer concise.
        - If the user says a greeting (hi, hello, good morning, etc.), respond with a greeting in the same language or style.
    `;

    const customRagPrompt = PromptTemplate.fromTemplate(customTemplate);

    const customRagChain = await createStuffDocumentsChain({
        llm,
        prompt: customRagPrompt,
        outputParser: new StringOutputParser(), // output result as string
    });

    const context = await retriever.invoke(userQuery);

    const response = await customRagChain.invoke({
        question: userQuery,
        context,
    });

    return response
}

export { createIndex, storeVector, getPineconeClient, getIndex, retrieveVector };
