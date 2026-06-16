const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title:       'PrepWise AI API',
        version:     '0.1.0',
        description: 'API documentation for PrepWise AI',
    },
    servers: [{ url: '/api/v1' }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type:         'http',
                scheme:       'bearer',
                bearerFormat: 'JWT',
                description:  'Paste your JWT here. Get it from the browser after Google OAuth login: DevTools → Application → Cookies → copy the "token" value.',
            },
        },
        schemas: {
            ResumeUploadResponse: {
                type: 'object',
                properties: {
                    status: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            _id:          { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
                            valid:        { type: 'boolean', example: true },
                            ats_score:    { type: 'number', example: 78 },
                            strengths:    { type: 'array', items: { type: 'string' }, example: ['Strong technical skills'] },
                            improvements: { type: 'array', items: { type: 'string' }, example: ['Add quantified achievements'] },
                        },
                    },
                },
            },
            InterviewScores: {
                type: 'object',
                properties: {
                    overAll:       { type: 'number', example: 80 },
                    communication: { type: 'number', example: 70 },
                    technical:     { type: 'number', example: 85 },
                },
            },
            InterviewEntry: {
                type: 'object',
                properties: {
                    _id:          { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
                    scores:       { $ref: '#/components/schemas/InterviewScores' },
                    strengths:    { type: 'array', items: { type: 'string' } },
                    improvements: { type: 'array', items: { type: 'string' } },
                    feedback:     { type: 'string', example: 'Good overall performance.' },
                    status: {
                        type: 'integer',
                        enum: [0, 1, 2, 3],
                        description: '0=Pending, 1=In Progress, 2=Completed, 3=Absconded',
                        example: 2,
                    },
                    created_at: { type: 'string', format: 'date-time' },
                },
            },
            PastAnalysisEntry: {
                type: 'object',
                properties: {
                    _id:          { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
                    valid:        { type: 'boolean', example: true },
                    ats_score:    { type: 'number', example: 78 },
                    strengths:    { type: 'array', items: { type: 'string' } },
                    improvements: { type: 'array', items: { type: 'string' } },
                    created_at:   { type: 'string', format: 'date-time' },
                    interviews:   { type: 'array', items: { $ref: '#/components/schemas/InterviewEntry' } },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'boolean', example: false },
                    error:  { type: 'string', example: 'Unauthorized' },
                },
            },
        },
    },
    paths: {
        '/dev/seed/interviews': {
            get: {
                tags:    ['Dev'],
                summary: 'Seed dummy interview documents into the database (dev only)',
                responses: {
                    200: {
                        description: 'Interviews seeded successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status:  { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Interviews seeded' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/resume/upload': {
            post: {
                tags:     ['Resume'],
                summary:  'Upload a resume (PDF or DOCX) — extracts text and runs ATS scoring',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['resume'],
                                properties: {
                                    resume: {
                                        type:        'string',
                                        format:      'binary',
                                        description: 'PDF or DOCX file, max 5MB',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Resume analysed successfully',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ResumeUploadResponse' } } },
                    },
                    400: { description: 'No file uploaded or file unreadable', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
        },
        '/resume/past-analyses': {
            get: {
                tags:     ['Resume'],
                summary:  'Get all past resume analyses for the logged-in user, each with its interview records',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of resume analyses with nested interviews',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'boolean', example: true },
                                        data: {
                                            type:  'array',
                                            items: { $ref: '#/components/schemas/PastAnalysisEntry' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
        },
    },
}

export default swaggerDocument
