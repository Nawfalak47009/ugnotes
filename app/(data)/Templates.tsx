export default [
    {
        name: 'Creative Blog Title Generator',
        desc: 'Generate unique and catchy blog titles based on your niche and outline.',
        category: 'Blog',
        icon: '/blog.png',
        aiPrompt: 'Provide 5 creative blog title ideas in bullet points based on the given topic, niche, and outline.',
        slug: 'creative-blog-title',
        form: [
            {
                label: 'Enter your blog niche',
                field: 'input',
                name: 'niche',
                required: true
            },
            {
                label: 'Enter blog outline',
                field: 'textarea',
                name: 'outline',
            }
        ]
    },
    {
        name: 'Recipe Suggestion',
        desc: 'Get personalized recipe ideas based on ingredients you have.',
        category: 'Lifestyle',
        icon: '/cook-book.png',
        aiPrompt: 'Suggest 3 recipes using the given list of ingredients.',
        slug: 'recipe-suggestion',
        form: [
            {
                label: 'Enter available ingredients',
                field: 'textarea',
                name: 'ingredients',
                required: true
            }
        ]
    },
    {
        name: 'Instagram Blog Topic Ideas',
        desc: 'Generate fresh and relevant blog topic ideas for any niche.',
        category: 'Blog',
        icon: '/instagram.png',
        aiPrompt: 'Suggest 5 engaging blog topics in bullet points based on the provided niche.',
        slug: 'blog-topic-ideas',
        form: [
            {
                label: 'Enter your blog niche',
                field: 'input',
                name: 'niche',
                required: true
            }
        ]
    },
    {
        name: 'YouTube SEO Title Optimizer',
        desc: 'Craft optimized YouTube video titles to boost search visibility.',
        category: 'YouTube',
        icon: '/youtube.png',
        aiPrompt: 'Generate 5 SEO-friendly YouTube video titles based on the provided niche and video content.',
        slug: 'youtube-seo-title',
        form: [
            {
                label: 'Enter your video niche',
                field: 'input',
                name: 'niche',
                required: true
            },
            {
                label: 'Enter video description',
                field: 'textarea',
                name: 'description',
            }
        ]
    },
    {
        name: 'YouTube Description Enhancer',
        desc: 'Create engaging and optimized YouTube descriptions for your videos.',
        category: 'YouTube',
        icon: '/youtube2.png',
        aiPrompt: 'Generate an engaging YouTube description based on the given content.',
        slug: 'youtube-description',
        form: [
            {
                label: 'Enter video details',
                field: 'textarea',
                name: 'details',
                required: true
            }
        ]
    },
    {
        name: 'Emoji Text Enhancer',
        desc: 'Add expressive emojis to enhance your text’s engagement.',
        category: 'Text',
        icon: '/emoji.png',
        aiPrompt: 'Enhance the given text with relevant emojis to make it more engaging.',
        slug: 'emoji-text-enhancer',
        form: [
            {
                label: 'Enter text',
                field: 'textarea',
                name: 'text',
                required: true
            }
        ]
    },
    {
        name: 'Article Generator',
        desc: 'Generate detailed articles from ideas and outlines.',
        category: 'Article',
        icon: '/article.png',
        aiPrompt: 'Create a comprehensive article based on the provided niche and outline.',
        slug: 'article-generator',
        form: [
            {
                label: 'Enter your article niche',
                field: 'input',
                name: 'niche',
                required: true
            },
            {
                label: 'Enter article outline',
                field: 'textarea',
                name: 'outline',
            }
        ]
    },
    {
        name: 'Story Title Creator',
        desc: 'Generate compelling titles for your stories.',
        category: 'Story',
        icon: '/growth.png',
        aiPrompt: 'Provide 5 story title ideas based on the provided genre and outline.',
        slug: 'story-title-creator',
        form: [
            {
                label: 'Enter story genre',
                field: 'input',
                name: 'genre',
                required: true
            },
            {
                label: 'Enter story outline',
                field: 'textarea',
                name: 'outline',
            }
        ]
    },
    {
        name: 'Poem Title Generator',
        desc: 'Create evocative titles for your poems.',
        category: 'Poem',
        icon: '/poem.png',
        aiPrompt: 'Suggest 5 poetic title ideas based on the given theme and inspiration.',
        slug: 'poem-title-generator',
        form: [
            {
                label: 'Enter poem theme',
                field: 'input',
                name: 'theme',
                required: true
            },
            {
                label: 'Enter inspiration or outline',
                field: 'textarea',
                name: 'inspiration',
            }
        ]
    }
];
