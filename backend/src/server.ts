
// dev only — bypasses Kaspersky SSL inspection in Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import envs from '@/config/env'
import { connectDb } from '@/config/database'
import '@/config/llm'
import app from '@/app'

const startServers = async () => {
    try {

        await connectDb()

        app.listen(envs.port, () => {
            console.log(`🚀 App is running at http://127.0.0.1:${envs.port}`)
        })

    } catch (error) {
        console.error('Error While Starting the server:', error)
        process.exit(1)
    }
}

startServers()
