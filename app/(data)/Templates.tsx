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
    },
    {
        name: 'Code Snippet Generator',
        desc: 'Generate code snippets for common programming tasks in various languages.',
        category: 'Coding',
        icon: '/code.png',
        aiPrompt: 'Generate a code snippet for the given task in the specified programming language.',
        slug: 'code-snippet-generator',
        form: [
            {
                label: 'Enter the programming language',
                field: 'input',
                name: 'language',
                required: true
            },
            {
                label: 'Describe the task or function',
                field: 'textarea',
                name: 'task',
                required: true
            }
        ]
    },{
        name: 'Math Problem Solver',
        desc: 'Solve complex math problems and show step-by-step solutions.',
        category: 'Math',
        icon: '/math.png',
        aiPrompt: 'Solve the given math problem and explain the steps.',
        slug: 'math-problem-solver',
        form: [
            {
                label: 'Enter math problem',
                field: 'textarea',
                name: 'problem',
                required: true
            }
        ]
    },
    {
        name: 'Social Media Caption Generator',
        desc: 'Generate creative captions for your social media posts.',
        category: 'Social Media',
        icon: '/social-media.png',
        aiPrompt: 'Generate 5 creative captions for the provided topic or image.',
        slug: 'social-media-caption',
        form: [
            {
                label: 'Enter topic or image description',
                field: 'textarea',
                name: 'topic',
                required: true
            }
        ]
    },
    {
        name: 'Geography Quiz Generator',
        desc: 'Create custom geography quizzes with questions and answers.',
        category: 'Geography',
        icon: '/geography.png',
        aiPrompt: 'Generate a set of geography quiz questions based on the provided topic.',
        slug: 'geography-quiz',
        form: [
            {
                label: 'Enter geography topic',
                field: 'input',
                name: 'topic',
                required: true
            }
        ]
    },
    {
        name: 'Business Name Generator',
        desc: 'Generate creative names for your business based on your niche.',
        category: 'Business',
        icon: '/business.png',
        aiPrompt: 'Suggest 5 business name ideas for the given niche.',
        slug: 'business-name-generator',
        form: [
            {
                label: 'Enter business niche',
                field: 'input',
                name: 'niche',
                required: true
            }
        ]
    },
    {
        name: 'Product Description Generator',
        desc: 'Generate engaging product descriptions for e-commerce.',
        category: 'E-commerce',
        icon: '/ecommerce.png',
        aiPrompt: 'Generate a compelling product description based on the provided features.',
        slug: 'product-description-generator',
        form: [
            {
                label: 'Enter product features',
                field: 'textarea',
                name: 'features',
                required: true
            }
        ]
    },
    {
        name: 'Website Domain Name Generator',
        desc: 'Generate unique domain names for your website.',
        category: 'Business',
        icon: '/domain.png',
        aiPrompt: 'Suggest 5 available domain names based on the given business idea.',
        slug: 'domain-name-generator',
        form: [
            {
                label: 'Enter business idea or keyword',
                field: 'input',
                name: 'keyword',
                required: true
            }
        ]
    },
    {
        name: 'Travel Itinerary Generator',
        desc: 'Create personalized travel itineraries based on your destination and preferences.',
        category: 'Travel',
        icon: '/travel.png',
        aiPrompt: 'Generate a 3-day travel itinerary based on the given destination and preferences.',
        slug: 'travel-itinerary-generator',
        form: [
            {
                label: 'Enter destination',
                field: 'input',
                name: 'destination',
                required: true
            },
            {
                label: 'Enter travel preferences',
                field: 'textarea',
                name: 'preferences',
            }
        ]
    },
    {
        name: 'Fitness Plan Generator',
        desc: 'Generate personalized fitness plans based on goals and fitness level.',
        category: 'Fitness',
        icon: '/fitness.png',
        aiPrompt: 'Create a fitness plan based on the provided fitness goals and current level.',
        slug: 'fitness-plan-generator',
        form: [
            {
                label: 'Enter fitness goal',
                field: 'input',
                name: 'goal',
                required: true
            },
            {
                label: 'Enter fitness level',
                field: 'input',
                name: 'level',
            }
        ]
    },
    {
        name: 'Coding Tutorial Generator',
        desc: 'Generate coding tutorials based on the programming language and topic.',
        category: 'Coding',
        icon: '/tutorial.png',
        aiPrompt: 'Generate a coding tutorial for the provided topic and programming language.',
        slug: 'coding-tutorial-generator',
        form: [
            {
                label: 'Enter programming language',
                field: 'input',
                name: 'language',
                required: true
            },
            {
                label: 'Enter tutorial topic',
                field: 'textarea',
                name: 'topic',
                required: true
            }
        ]
    },
    {
        name: 'Health Advice Generator',
        desc: 'Get personalized health advice based on your symptoms and lifestyle.',
        category: 'Health',
        icon: '/health.png',
        aiPrompt: 'Provide health advice based on the given symptoms and lifestyle habits.',
        slug: 'health-advice-generator',
        form: [
            {
                label: 'Enter symptoms',
                field: 'textarea',
                name: 'symptoms',
                required: true
            },
            {
                label: 'Enter lifestyle habits',
                field: 'textarea',
                name: 'lifestyle',
            }
        ]
    },
    {
        name: 'Story Plot Generator',
        desc: 'Generate creative story plots based on genre and inspiration.',
        category: 'Story',
        icon: '/plot.png',
        aiPrompt: 'Generate a creative story plot based on the provided genre and inspiration.',
        slug: 'story-plot-generator',
        form: [
            {
                label: 'Enter genre',
                field: 'input',
                name: 'genre',
                required: true
            },
            {
                label: 'Enter inspiration',
                field: 'textarea',
                name: 'inspiration',
            }
        ]
    },
    {
        name: 'Job Description Generator',
        desc: 'Generate detailed job descriptions for various roles.',
        category: 'Business',
        icon: '/job.png',
        aiPrompt: 'Generate a job description for the given role and responsibilities.',
        slug: 'job-description-generator',
        form: [
            {
                label: 'Enter job title',
                field: 'input',
                name: 'title',
                required: true
            },
            {
                label: 'Enter job responsibilities',
                field: 'textarea',
                name: 'responsibilities',
            }
        ]
    },
    {
        name: 'Interview Question Generator',
        desc: 'Generate common interview questions based on job role and requirements.',
        category: 'Business',
        icon: '/interview.png',
        aiPrompt: 'Generate a list of interview questions for the given job role.',
        slug: 'interview-question-generator',
        form: [
            {
                label: 'Enter job role',
                field: 'input',
                name: 'role',
                required: true
            }
        ]
    },
    {
        name: 'Event Planning Checklist',
        desc: 'Create a custom event planning checklist for your upcoming event.',
        category: 'Event',
        icon: '/event.png',
        aiPrompt: 'Generate a comprehensive event planning checklist based on the provided event details.',
        slug: 'event-planning-checklist',
        form: [
            {
                label: 'Enter event type',
                field: 'input',
                name: 'eventType',
                required: true
            },
            {
                label: 'Enter event date',
                field: 'input',
                name: 'eventDate',
            }
        ]
    },
    {
        name: 'Daily Routine Generator',
        desc: 'Create personalized daily routines based on your lifestyle and goals.',
        category: 'Lifestyle',
        icon: '/routine.png',
        aiPrompt: 'Create a daily routine based on the provided lifestyle and goals.',
        slug: 'daily-routine-generator',
        form: [
            {
                label: 'Enter lifestyle',
                field: 'textarea',
                name: 'lifestyle',
                required: true
            },
            {
                label: 'Enter goals',
                field: 'textarea',
                name: 'goals',
            }
        ]
    },
    {
        name: 'Budget Planner Generator',
        desc: 'Generate a personalized budget plan based on income and expenses.',
        category: 'Finance',
        icon: '/budget.png',
        aiPrompt: 'Generate a budget plan based on the given income and expenses.',
        slug: 'budget-planner-generator',
        form: [
            {
                label: 'Enter monthly income',
                field: 'input',
                name: 'income',
                required: true
            },
            {
                label: 'Enter monthly expenses',
                field: 'textarea',
                name: 'expenses',
            }
        ]
    },
    {
        name: 'Resume Builder',
        desc: 'Create a professional resume with customizable sections.',
        category: 'Career',
        icon: '/resume.png',
        aiPrompt: 'Generate a professional resume based on the provided details.',
        slug: 'resume-builder',
        form: [
            {
                label: 'Enter your personal details',
                field: 'textarea',
                name: 'details',
                required: true
            }
        ]
    },
    {
        name: 'Book Recommendation Generator',
        desc: 'Get personalized book recommendations based on your interests.',
        category: 'Books',
        icon: '/book.png',
        aiPrompt: 'Recommend 5 books based on the given interests or genres.',
        slug: 'book-recommendation-generator',
        form: [
            {
                label: 'Enter your interests or favorite genres',
                field: 'textarea',
                name: 'interests',
                required: true
            }
        ]
    },
    {
        name: 'Art Idea Generator',
        desc: 'Generate unique art ideas based on themes and mediums.',
        category: 'Art',
        icon: '/art.png',
        aiPrompt: 'Generate 5 unique art ideas based on the provided theme and medium.',
        slug: 'art-idea-generator',
        form: [
            {
                label: 'Enter theme',
                field: 'input',
                name: 'theme',
                required: true
            },
            {
                label: 'Enter medium',
                field: 'input',
                name: 'medium',
            }
        ]
    },
    {
        name: 'Marketing Campaign Generator',
        desc: 'Generate creative marketing campaigns based on your product and target audience.',
        category: 'Marketing',
        icon: '/marketing.png',
        aiPrompt: 'Generate a marketing campaign for the provided product and target audience.',
        slug: 'marketing-campaign-generator',
        form: [
            {
                label: 'Enter product',
                field: 'input',
                name: 'product',
                required: true
            },
            {
                label: 'Enter target audience',
                field: 'input',
                name: 'audience',
            }
        ]
    },
    {
        name: 'Social Media Strategy Generator',
        desc: 'Create a custom social media strategy based on your goals and platform.',
        category: 'Social Media',
        icon: '/strategy.png',
        aiPrompt: 'Generate a social media strategy based on the provided goals and platform.',
        slug: 'social-media-strategy-generator',
        form: [
            {
                label: 'Enter social media platform',
                field: 'input',
                name: 'platform',
                required: true
            },
            {
                label: 'Enter your goals',
                field: 'textarea',
                name: 'goals',
            }
        ]
    },
    {
        name: 'Essay Topic Generator',
        desc: 'Generate interesting essay topics for students.',
        category: 'Education',
        icon: '/essay.png',
        aiPrompt: 'Generate 5 essay topics based on the provided subject or theme.',
        slug: 'essay-topic-generator',
        form: [
            {
                label: 'Enter subject or theme',
                field: 'input',
                name: 'subject',
                required: true
            }
        ]
    },
    {
        name: 'Social Media Hashtag Generator',
        desc: 'Generate relevant and trending hashtags for your posts.',
        category: 'Social Media',
        icon: '/hashtag.png',
        aiPrompt: 'Generate 10 trending hashtags based on the given topic.',
        slug: 'social-media-hashtag-generator',
        form: [
            {
                label: 'Enter topic',
                field: 'input',
                name: 'topic',
                required: true
            }
        ]
    },
    {
        name: 'Recipe Ingredient Substitution Guide',
        desc: 'Find ingredient substitutions for your recipe.',
        category: 'Lifestyle',
        icon: '/substitution.png',
        aiPrompt: 'Suggest alternative ingredients for the given recipe item.',
        slug: 'ingredient-substitution-guide',
        form: [
            {
                label: 'Enter ingredient',
                field: 'input',
                name: 'ingredient',
                required: true
            }
        ]
    },
    {
        name: 'Home Workout Plan Generator',
        desc: 'Generate a home workout plan based on available equipment.',
        category: 'Fitness',
        icon: '/workout.png',
        aiPrompt: 'Generate a 7-day workout plan for home using available equipment.',
        slug: 'home-workout-plan-generator',
        form: [
            {
                label: 'Enter available equipment',
                field: 'input',
                name: 'equipment',
                required: true
            }
        ]
    },
    {
        name: 'Instagram Story Idea Generator',
        desc: 'Get creative ideas for Instagram Stories.',
        category: 'Social Media',
        icon: '/story.png',
        aiPrompt: 'Generate 5 Instagram story ideas based on the provided niche.',
        slug: 'instagram-story-idea-generator',
        form: [
            {
                label: 'Enter niche',
                field: 'input',
                name: 'niche',
                required: true
            }
        ]
    },
    {
        name: 'Project Timeline Generator',
        desc: 'Create a timeline for your project with key milestones.',
        category: 'Productivity',
        icon: '/timeline.png',
        aiPrompt: 'Generate a project timeline with milestones based on project details.',
        slug: 'project-timeline-generator',
        form: [
            {
                label: 'Enter project details',
                field: 'textarea',
                name: 'projectDetails',
                required: true
            }
        ]
    },
    {
        name: 'Holiday Gift Guide Generator',
        desc: 'Generate personalized gift ideas based on the recipient\'s interests.',
        category: 'Lifestyle',
        icon: '/gift.png',
        aiPrompt: 'Suggest 5 unique gift ideas based on the recipient\'s preferences.',
        slug: 'holiday-gift-guide-generator',
        form: [
            {
                label: 'Enter recipient\'s interests',
                field: 'textarea',
                name: 'interests',
                required: true
            }
        ]
    },
    {
        name: 'Interview Preparation Checklist',
        desc: 'Generate a checklist to prepare for a job interview.',
        category: 'Career',
        icon: '/interview.png',
        aiPrompt: 'Generate a comprehensive checklist for interview preparation.',
        slug: 'interview-preparation-checklist',
        form: [
            {
                label: 'Enter job role',
                field: 'input',
                name: 'role',
                required: true
            }
        ]
    },
    {
        name: 'Digital Marketing Strategy Generator',
        desc: 'Generate a tailored digital marketing strategy for your brand.',
        category: 'Marketing',
        icon: '/marketing-strategy.png',
        aiPrompt: 'Generate a digital marketing strategy based on the provided product and target audience.',
        slug: 'digital-marketing-strategy-generator',
        form: [
            {
                label: 'Enter product',
                field: 'input',
                name: 'product',
                required: true
            },
            {
                label: 'Enter target audience',
                field: 'input',
                name: 'audience',
            }
        ]
    },
    {
        name: 'Blog Post Idea Generator',
        desc: 'Generate creative blog post ideas based on niche and trends.',
        category: 'Blogging',
        icon: '/blog.png',
        aiPrompt: 'Generate 5 blog post ideas based on the given niche and current trends.',
        slug: 'blog-post-idea-generator',
        form: [
            {
                label: 'Enter niche',
                field: 'input',
                name: 'niche',
                required: true
            }
        ]
    },
    {
        name: 'Book Club Discussion Questions',
        desc: 'Generate engaging discussion questions for book clubs.',
        category: 'Books',
        icon: '/discussion.png',
        aiPrompt: 'Generate 5 book discussion questions based on the provided book title.',
        slug: 'book-club-discussion-questions',
        form: [
            {
                label: 'Enter book title',
                field: 'input',
                name: 'bookTitle',
                required: true
            }
        ]
    },
    {
        name: 'Personalized Learning Path Generator',
        desc: 'Create a personalized learning path for students.',
        category: 'Education',
        icon: '/learning.png',
        aiPrompt: 'Generate a learning path based on the student\'s subject interests and goals.',
        slug: 'personalized-learning-path-generator',
        form: [
            {
                label: 'Enter subject interests',
                field: 'textarea',
                name: 'interests',
                required: true
            },
            {
                label: 'Enter learning goals',
                field: 'textarea',
                name: 'goals',
            }
        ]
    },
    {
        name: 'Public Speaking Speech Generator',
        desc: 'Generate a speech for public speaking events based on topic and audience.',
        category: 'Communication',
        icon: '/speech.png',
        aiPrompt: 'Generate a speech based on the provided topic and target audience.',
        slug: 'public-speaking-speech-generator',
        form: [
            {
                label: 'Enter speech topic',
                field: 'input',
                name: 'topic',
                required: true
            },
            {
                label: 'Enter target audience',
                field: 'input',
                name: 'audience',
            }
        ]
    },
    {
        name: 'Task Management Dashboard Generator',
        desc: 'Generate a custom task management dashboard based on team size and project scope.',
        category: 'Productivity',
        icon: '/dashboard.png',
        aiPrompt: 'Generate a task management dashboard based on team size and project details.',
        slug: 'task-management-dashboard-generator',
        form: [
            {
                label: 'Enter team size',
                field: 'input',
                name: 'teamSize',
                required: true
            },
            {
                label: 'Enter project scope',
                field: 'textarea',
                name: 'projectScope',
            }
        ]
    },
    {
        name: 'Meal Prep Plan Generator',
        desc: 'Generate a weekly meal prep plan based on dietary needs.',
        category: 'Lifestyle',
        icon: '/mealprep.png',
        aiPrompt: 'Generate a weekly meal prep plan based on dietary preferences and restrictions.',
        slug: 'meal-prep-plan-generator',
        form: [
            {
                label: 'Enter dietary preferences',
                field: 'input',
                name: 'preferences',
                required: true
            }
        ]
    },
    {
        name: 'Daily Journal Prompt Generator',
        desc: 'Get personalized journal prompts based on mood and experiences.',
        category: 'Lifestyle',
        icon: '/journal.png',
        aiPrompt: 'Generate 5 personalized journal prompts based on the given mood and experiences.',
        slug: 'daily-journal-prompt-generator',
        form: [
            {
                label: 'Enter mood',
                field: 'input',
                name: 'mood',
                required: true
            }
        ]
    },
    {
        name: 'Startup Pitch Generator',
        desc: 'Generate a concise startup pitch based on the business model and target market.',
        category: 'Business',
        icon: '/pitch.png',
        aiPrompt: 'Generate a concise startup pitch based on the business idea and market details.',
        slug: 'startup-pitch-generator',
        form: [
            {
                label: 'Enter business model',
                field: 'textarea',
                name: 'model',
                required: true
            },
            {
                label: 'Enter target market',
                field: 'textarea',
                name: 'market',
            }
        ]
    },
    {
        name: 'Social Media Analytics Tracker',
        desc: 'Track and analyze the performance of your social media campaigns.',
        category: 'Analytics',
        icon: '/analytics.png',
        aiPrompt: 'Analyze the provided social media campaign data and suggest improvements.',
        slug: 'social-media-analytics-tracker',
        form: [
            {
                label: 'Enter campaign data',
                field: 'textarea',
                name: 'data',
                required: true
            }
        ]
    },
    {
        name: 'Fashion Style Guide Generator',
        desc: 'Generate personalized fashion style guides based on body type and preferences.',
        category: 'Fashion',
        icon: '/fashion.png',
        aiPrompt: 'Generate a personalized style guide based on body type and fashion preferences.',
        slug: 'fashion-style-guide-generator',
        form: [
            {
                label: 'Enter body type',
                field: 'input',
                name: 'bodyType',
                required: true
            },
            {
                label: 'Enter fashion preferences',
                field: 'textarea',
                name: 'preferences',
            }
        ]
    },
    {
        name: 'Business Plan Generator',
        desc: 'Create a detailed business plan based on market analysis and business model.',
        category: 'Business',
        icon: '/plan.png',
        aiPrompt: 'Generate a comprehensive business plan based on the given market and business model.',
        slug: 'business-plan-generator',
        form: [
            {
                label: 'Enter business model',
                field: 'textarea',
                name: 'model',
                required: true
            },
            {
                label: 'Enter market analysis',
                field: 'textarea',
                name: 'marketAnalysis',
            }
        ]
    },
    {
        name: 'LinkedIn Profile Summary Generator',
        desc: 'Create an optimized LinkedIn profile summary for job seekers.',
        category: 'Career',
        icon: '/linkedin.png',
        aiPrompt: 'Generate a LinkedIn profile summary based on your experience and career goals.',
        slug: 'linkedin-profile-summary-generator',
        form: [
            {
                label: 'Enter career goals',
                field: 'textarea',
                name: 'careerGoals',
                required: true
            }
        ]
    },
    {
        name: 'Mood Board Generator',
        desc: 'Generate mood boards for projects based on color schemes and themes.',
        category: 'Design',
        icon: '/moodboard.png',
        aiPrompt: 'Generate a mood board based on the provided color scheme and project theme.',
        slug: 'mood-board-generator',
        form: [
            {
                label: 'Enter color scheme',
                field: 'input',
                name: 'colorScheme',
                required: true
            },
            {
                label: 'Enter project theme',
                field: 'textarea',
                name: 'theme',
            }
        ]
    }


    
];
