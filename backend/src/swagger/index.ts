const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title:       'PrepWise AI API',
        version:     '0.1.0',
        description: 'API documentation for PrepWise AI',
    },
    servers: [{ url: '/api/v1' }],
    paths: {
        '/auth/google': {
            get: {
                tags:        ['Authentication'],
                summary:     'Redirect to Google OAuth',
                responses:   { 302: { description: 'Redirect to Google' } },
            },
        },
        '/auth/me': {
            get: {
                tags:      ['Authentication'],
                summary:   'Get current logged in user',
                responses: { 200: { description: 'User data' } },
            },
        },
        '/auth/logout': {
            post: {
                tags:      ['Authentication'],
                summary:   'Logout user',
                responses: { 200: { description: 'Logged out' } },
            },
        },
    },
}

export default swaggerDocument
