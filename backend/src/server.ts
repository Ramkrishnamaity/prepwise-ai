import envs from '@/config/env'
import { connectDb } from '@/config/database'
import app from '@/app'

connectDb()

app.listen(envs.port, () => {
    console.log(`🚀 App is running at http://127.0.0.1:${envs.port}`)
})
