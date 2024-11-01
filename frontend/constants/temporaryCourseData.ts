import temporaryImages from "@/constants/temporaryImages";
import Course from "@/types/shared/Course/Course";

// placeholder for channels
export const channelData = [
    { label: "Channel 1", value: "1" },
    { label: "Channel 2", value: "2" },
    { label: "Channel 3", value: "3" },
    { label: "Channel 4", value: "4" },
    { label: "Channel 5", value: "5" },
    { label: "Channel 6", value: "6" },
    { label: "Channel 7", value: "7" },
    { label: "Channel 8", value: "8" },
];
// placeholder for list of search data returned
export const courseListData: Course[] = [
    {
        id: 1,
        title: "UI/UX Design Essentials",
        school: "Tech Innovations University",
        description:
            "This comprehensive program covers the fundamentals of user interface and user experience design, equipping you with the skills to create intuitive, user-centered digital products. Learn key principles of design, wireframing, prototyping, and usability testing through hands-on projects and expert guidance. Ideal for beginners and aspiring designers, this course will help you transform ideas into impactful user experiences. Join us to elevate your design skills and build a portfolio that stands out!",
        rating: "4.9",
        completionRate: 0.79,
        image: temporaryImages.course1,
        enrolledCount: 3479,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 1,
                title: "Introduction to UI/UX",
                completionRate: 0,
                lectures: [
                    {
                        id: 1,
                        title: "What is UI/UX?",
                        completionRate: 0,
                        topics: [
                            {
                                id: 1,
                                title: "Introduction to UI",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "This topic introduces the concept of User Interface (UI) design, focusing on the visual elements that users interact with in digital products.",
                                completionStatus: false
                            },
                            {
                                id: 2,
                                title: "Introduction to UX",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Explore the fundamentals of User Experience (UX) design, emphasizing the importance of user satisfaction and usability in digital products.",
                                completionStatus: false
                            },
                        ],
                    },
                    {
                        id: 2,
                        title: "Key UI Principles",
                        completionRate: 0,
                        topics: [
                            {
                                id: 3,
                                title: "Color Theory",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn the basics of color theory and its application in UI design to create visually appealing interfaces that resonate with users.",
                                completionStatus: false
                            },
                            {
                                id: 4,
                                title: "Typography Basics",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Understand the role of typography in design, including font selection and hierarchy, to enhance readability and user experience.",
                                completionStatus: false
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: "Wireframing and Prototyping",
                completionRate: 0,
                lectures: [
                    {
                        id: 3,
                        title: "Creating Wireframes",
                        completionRate: 0,
                        topics: [
                            {
                                id: 5,
                                title: "Low-Fidelity Wireframes",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Discover the process of creating low-fidelity wireframes to outline the basic structure and layout of digital products.",
                                completionStatus: false
                            },
                            {
                                id: 6,
                                title: "High-Fidelity Wireframes",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn how to develop high-fidelity wireframes that provide a detailed representation of the final product, including design elements and interactions.",
                                completionStatus: false
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Graphic Design Fundamentals",
        school: "Creative Arts Institute",
        description: "Discover design principles like color theory, typography, and composition through hands-on projects. This course is designed to build a solid foundation in graphic design, encouraging creativity and technical skills. You will engage in practical assignments that reinforce your understanding of how to effectively communicate ideas visually.",
        rating: "4.7",
        completionRate: 0.35,
        image: temporaryImages.course2,
        enrolledCount: 1457,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 3,
                title: "Basics of Graphic Design",
                completionRate: 0,
                lectures: [
                    {
                        id: 4,
                        title: "Understanding Color Theory",
                        completionRate: 0,
                        topics: [
                            {
                                id: 7,
                                title: "Primary and Secondary Colors",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn about primary and secondary colors, their significance in design, and how they can be combined to create a vibrant color palette. This topic covers the color wheel, the relationships between colors, and practical applications in your designs.",
                                completionStatus: false
                            },
                            {
                                id: 8,
                                title: "Color Harmony",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Explore the principles of color harmony to create visually appealing designs. Understand concepts like complementary, analogous, and triadic color schemes, and learn how to apply these harmonies to enhance the emotional impact of your work.",
                                completionStatus: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 4,
                title: "Typography Essentials",
                completionRate: 0,
                lectures: [
                    {
                        id: 5,
                        title: "Types of Fonts",
                        completionRate: 0,
                        topics: [
                            {
                                id: 9,
                                title: "Serif vs Sans-Serif",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Understand the differences between serif and sans-serif fonts and their applications in various design contexts. This topic will cover the history and characteristics of both font types and guide you on when to use each for maximum effectiveness.",
                                completionStatus: false
                            },
                            {
                                id: 10,
                                title: "Decorative Fonts",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Discover the use of decorative fonts in graphic design. This topic explores how decorative fonts can convey personality and style in your designs while also addressing best practices for their use to maintain readability.",
                                completionStatus: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Product Design and Innovation",
        school: "Innovation Institute",
        description: "Explore the intersection of creativity and technology in product design. Learn how to develop innovative solutions and create products that meet both user needs and market demands. This course emphasizes hands-on learning and real-world applications, preparing you to tackle complex design challenges in dynamic environments.",
        rating: "4.9",
        completionRate: 0.78,
        image: temporaryImages.course3,
        enrolledCount: 623,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 5,
                title: "Introduction to Product Design",
                completionRate: 0,
                lectures: [
                    {
                        id: 6,
                        title: "What is Product Design?",
                        completionRate: 0,
                        topics: [
                            {
                                id: 11,
                                title: "Understanding Product Design",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Gain insights into the fundamentals of product design and its importance in various industries. This topic covers the key components of product design, including user experience, functionality, and aesthetics, highlighting the role of a designer in creating effective solutions.",
                                completionStatus: false
                            },
                            {
                                id: 12,
                                title: "History and Evolution",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Explore the historical development of product design and key milestones. This topic will examine influential design movements and their impact on contemporary practices, helping you understand how past innovations shape today's products.",
                                completionStatus: false
                            }
                        ]
                    },
                    {
                        id: 7,
                        title: "Core Principles of Product Design",
                        completionRate: 0,
                        topics: [
                            {
                                id: 13,
                                title: "User-Centered Design",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn the principles of user-centered design and its application in product development. This topic emphasizes the importance of understanding user needs and behaviors to create products that enhance user satisfaction and engagement.",
                                completionStatus: false
                            },
                            {
                                id: 14,
                                title: "Functionality and Aesthetics",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Understand the balance between functionality and aesthetics in product design. This topic explores how to create visually appealing products that also serve practical purposes, discussing design choices that impact usability and user experience.",
                                completionStatus: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 6,
                title: "Innovation and Creativity in Design",
                completionRate: 0,
                lectures: [
                    {
                        id: 8,
                        title: "Fostering Creativity",
                        completionRate: 0,
                        topics: [
                            {
                                id: 15,
                                title: "Brainstorming Techniques",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Discover effective brainstorming techniques to generate innovative ideas. This topic covers various strategies for enhancing creativity within teams, promoting collaboration, and developing a culture of innovation.",
                                completionStatus: false
                            },
                            {
                                id: 16,
                                title: "Thinking Outside the Box",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn strategies for thinking outside the box to foster creativity in design. This topic encourages unconventional thinking and the exploration of unique perspectives that can lead to groundbreaking design solutions.",
                                completionStatus: false
                            }
                        ]
                    },
                    {
                        id: 9,
                        title: "Designing for Innovation",
                        completionRate: 0,
                        topics: [
                            {
                                id: 17,
                                title: "Identifying Market Gaps",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn how to identify market gaps to inform your design process. This topic will guide you in conducting market research, analyzing competitor products, and recognizing opportunities for innovation.",
                                completionStatus: false
                            },
                            {
                                id: 18,
                                title: "Prototyping and Testing",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Understand the importance of prototyping and testing in product design. This topic explores various prototyping methods and testing techniques, emphasizing iterative design processes that refine ideas based on user feedback.",
                                completionStatus: false
                            }
                        ]
                    }
                ]
            }
        ]
    },     
    {
        id: 4,
        title: "Typography and Layout Design",
        school: "Creative Arts Academy",
        description: "Master the art of typography and learn effective layout design to create visually engaging content. This course covers essential principles of design, typography hierarchies, and grid systems, enabling you to design compelling and organized visual communication.",
        rating: "4.7",
        completionRate: 0,
        image: temporaryImages.course4,
        enrolledCount: 512,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 7,
                title: "Introduction to Typography",
                completionRate: 0,
                lectures: [
                    {
                        id: 10,
                        title: "Basics of Typography",
                        completionRate: 0,
                        topics: [
                            {
                                id: 19,
                                title: "Typography Terminology",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "In this topic, you'll learn the fundamental terminology used in typography, including terms like baseline, x-height, and kerning. Understanding these terms is crucial for communicating effectively in the design world and for creating precise typography in your projects.",
                                completionStatus: false
                            },
                            {
                                id: 20,
                                title: "Typefaces and Fonts",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "This topic explores the distinction between typefaces and fonts, discussing how different typefaces convey various emotions and messages. You'll examine examples of serif, sans-serif, display, and script typefaces, gaining insight into when and how to use them effectively in your designs.",
                                completionStatus: false
                            }
                        ]
                    },
                    {
                        id: 11,
                        title: "Typography Hierarchies",
                        completionRate: 0,
                        topics: [
                            {
                                id: 21,
                                title: "Establishing Visual Hierarchies",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn the principles of establishing visual hierarchies in your designs to guide the viewer's eye and emphasize key information. This topic will cover techniques such as size variation, font weight, and color contrast to create effective hierarchies that enhance readability.",
                                completionStatus: false
                            },
                            {
                                id: 22,
                                title: "Using Contrast and Size",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Discover how contrast and size play crucial roles in typography. This topic examines how to use contrasting type sizes and weights to create a dynamic visual experience while maintaining clarity and coherence in your design.",
                                completionStatus: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 8,
                title: "Effective Layout Design",
                completionRate: 0,
                lectures: [
                    {
                        id: 12,
                        title: "Understanding Grid Systems",
                        completionRate: 0,
                        topics: [
                            {
                                id: 23,
                                title: "Building with Grids",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "This topic introduces grid systems as a foundational tool for layout design. You'll learn how to create balanced and organized layouts by structuring your content within grids, which help maintain consistency and improve user experience.",
                                completionStatus: false
                            },
                            {
                                id: 24,
                                title: "Using Columns and Rows",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Explore the application of columns and rows in layout design. This topic covers how to effectively use columns to organize text and images, as well as how rows can create a sense of order and flow in your designs.",
                                completionStatus: false
                            }
                        ]
                    },
                    {
                        id: 13,
                        title: "Alignments and Spacing",
                        completionRate: 0,
                        topics: [
                            {
                                id: 25,
                                title: "Creating Balance",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Learn techniques for creating visual balance in your layouts through proper alignment and spacing. This topic will discuss how to position elements harmoniously to enhance the overall aesthetic and functionality of your designs.",
                                completionStatus: false
                            },
                            {
                                id: 26,
                                title: "Spacing Techniques",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                description: "Discover various spacing techniques that can significantly impact readability and aesthetics. This topic will guide you on how to use white space effectively, create breathing room around text and images, and develop a visually appealing composition.",
                                completionStatus: false
                            }
                        ]
                    }
                ]
            }
        ]
    },            
    {
        id: 5,
        title: "Branding and Identity Design",
        school: "Visual Arts School",
        description: "Learn the principles of branding and identity design to create memorable and impactful brands. This course covers logo creation, brand strategy, and building a cohesive visual identity.",
        rating: "4.8",
        completionRate: 0,
        image: temporaryImages.course5,
        enrolledCount: 748,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 11,
                title: "Introduction to Branding",
                completionRate: 0,
                lectures: [
                    {
                        id: 18,
                        title: "What is Branding?",
                        completionRate: 0,
                        topics: [
                            {
                                id: 35,
                                title: "Understanding Brand Identity",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "In this topic, you will explore the concept of brand identity and its significance in creating a memorable brand. Understanding brand identity involves recognizing how visual elements, messaging, and consumer perception combine to form a cohesive representation of a brand."
                            },
                            {
                                id: 36,
                                title: "Brand Personality and Tone",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic delves into the personality of a brand and how tone plays a critical role in communication. You'll learn how to define and articulate brand personality traits that resonate with target audiences, ensuring a consistent and engaging brand voice."
                            }
                        ]
                    },
                    {
                        id: 19,
                        title: "Building a Brand Strategy",
                        completionRate: 0,
                        topics: [
                            {
                                id: 37,
                                title: "Market Research",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "In this topic, you'll learn about the importance of market research in developing a successful brand strategy. Understanding your target market, competitors, and industry trends is crucial for positioning your brand effectively and meeting consumer needs."
                            },
                            {
                                id: 38,
                                title: "Positioning and Messaging",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic focuses on the strategies for positioning your brand in the market. You'll discover how to craft compelling messaging that communicates your brand’s value proposition and differentiates it from competitors."
                            }
                        ]
                    }
                ]
            },
            {
                id: 12,
                title: "Creating Visual Identity",
                completionRate: 0,
                lectures: [
                    {
                        id: 20,
                        title: "Designing a Logo",
                        completionRate: 0,
                        topics: [
                            {
                                id: 39,
                                title: "Logo Types and Styles",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic examines various types and styles of logos, exploring their unique characteristics and applications. You will learn how different logo designs can evoke specific emotions and convey the essence of a brand."
                            },
                            {
                                id: 40,
                                title: "Color and Typography in Logos",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic discusses the critical role of color and typography in logo design. You'll gain insights into how these elements affect brand recognition and influence consumer perceptions."
                            }
                        ]
                    },
                    {
                        id: 21,
                        title: "Consistency Across Media",
                        completionRate: 0,
                        topics: [
                            {
                                id: 41,
                                title: "Maintaining Brand Consistency",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "In this topic, you'll explore the importance of maintaining consistency in branding across different media. Consistent branding reinforces brand identity and builds trust with consumers."
                            },
                            {
                                id: 42,
                                title: "Application on Digital Platforms",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic focuses on how to apply your branding effectively on digital platforms. You'll learn about the challenges and strategies for maintaining brand consistency in online environments."
                            }
                        ]
                    }
                ]
            }
        ]
    }, 
    {
        id: 6,
        title: "Game Design and Development",
        school: "Tech Creators Institute",
        description: "Dive into the world of game design and development. This course teaches the fundamentals of game mechanics, storytelling, and coding, empowering you to build immersive and engaging games.",
        rating: "4.6",
        completionRate: 1,
        image: temporaryImages.course6,
        enrolledCount: 892,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 13,
                title: "Introduction to Game Design",
                completionRate: 1,
                lectures: [
                    {
                        id: 22,
                        title: "Understanding Game Mechanics",
                        completionRate: 1,
                        topics: [
                            {
                                id: 43,
                                title: "Core Game Mechanics",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "This topic introduces core game mechanics such as rules, goals, and player feedback, which are essential for designing engaging gameplay."
                            },
                            {
                                id: 44,
                                title: "Game Balance and Fairness",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "Explore the principles of balancing gameplay to ensure fairness and an enjoyable experience for players. Learn techniques to adjust difficulty levels and create rewarding challenges."
                            }
                        ]
                    },
                    {
                        id: 23,
                        title: "Storytelling in Games",
                        completionRate: 1,
                        topics: [
                            {
                                id: 45,
                                title: "Creating a Compelling Narrative",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "Learn the basics of storytelling in game design, including how to craft narratives that engage players and add depth to gameplay."
                            },
                            {
                                id: 46,
                                title: "Character Development",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "Understand how to create relatable and memorable characters that enhance the story and engage players emotionally."
                            }
                        ]
                    }
                ]
            },
            {
                id: 14,
                title: "Game Development Basics",
                completionRate: 0,
                lectures: [
                    {
                        id: 24,
                        title: "Coding for Games",
                        completionRate: 0,
                        topics: [
                            {
                                id: 47,
                                title: "Introduction to Game Programming",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic covers the fundamentals of coding for game development, including basic programming concepts and languages commonly used in game creation."
                            },
                            {
                                id: 48,
                                title: "Using Game Engines",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "Learn about popular game engines like Unity and Unreal Engine, and how they can simplify the game development process."
                            }
                        ]
                    },
                    {
                        id: 25,
                        title: "Testing and Debugging",
                        completionRate: 0,
                        topics: [
                            {
                                id: 49,
                                title: "Finding and Fixing Bugs",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "Explore techniques for testing games and identifying bugs, ensuring a smooth and enjoyable experience for players."
                            },
                            {
                                id: 50,
                                title: "Polishing the Game",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: false,
                                description: "This topic covers how to refine and polish your game, improving the user experience and enhancing gameplay elements."
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        title: "Web Design Fundamentals",
        school: "Digital Design Academy",
        description: "Learn the core principles of web design, including layout, color theory, typography, and user experience. This course covers the essential skills needed to build visually appealing and user-friendly websites.",
        rating: "4.7",
        completionRate: 1,
        image: temporaryImages.course7,
        enrolledCount: 1054,
        program: "Bachelor of Engineering in Computer Science",
        enabled: true,
        chapters: [
            {
                id: 13,
                title: "Introduction to Web Design",
                completionRate: 1,
                lectures: [
                    {
                        id: 22,
                        title: "Basics of Web Design",
                        completionRate: 1,
                        topics: [
                            {
                                id: 43,
                                title: "Understanding Layouts",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "This topic covers the fundamental principles of layout in web design. You'll learn about different types of layouts, how to structure web pages effectively, and the impact of layout on user engagement."
                            },
                            {
                                id: 44,
                                title: "Color Theory Basics",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "In this topic, you will explore the basics of color theory and its application in web design. Understand how color choices can influence mood, perception, and overall user experience."
                            }
                        ]
                    },
                    {
                        id: 23,
                        title: "User Experience Design",
                        completionRate: 1,
                        topics: [
                            {
                                id: 45,
                                title: "Principles of UX Design",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "This topic introduces the key principles of user experience (UX) design. Learn about usability, user-centered design, and how to create intuitive and effective user interfaces."
                            },
                            {
                                id: 46,
                                title: "Designing for Usability",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "In this topic, you will learn how to design websites that prioritize usability. Explore techniques for improving navigation, readability, and overall user satisfaction."
                            }
                        ]
                    }
                ]
            },
            {
                id: 14,
                title: "Advanced Web Design Techniques",
                completionRate: 1,
                lectures: [
                    {
                        id: 24,
                        title: "Responsive Web Design",
                        completionRate: 1,
                        topics: [
                            {
                                id: 47,
                                title: "Fluid Layouts",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "This topic discusses the concept of fluid layouts in web design. Learn how to create layouts that adapt to different screen sizes and enhance the user experience across devices."
                            },
                            {
                                id: 48,
                                title: "Media Queries",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "In this topic, you'll explore media queries and how they are used in responsive web design. Understand how to apply CSS techniques that tailor the presentation of content to various devices."
                            }
                        ]
                    },
                    {
                        id: 25,
                        title: "Typography in Web Design",
                        completionRate: 1,
                        topics: [
                            {
                                id: 49,
                                title: "Choosing Fonts",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "This topic covers the importance of font selection in web design. You'll learn how to choose fonts that align with your brand and enhance readability for users."
                            },
                            {
                                id: 50,
                                title: "Implementing Web Typography",
                                contentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                                completionStatus: true,
                                description: "In this topic, you'll explore techniques for effectively implementing typography in web design. Discover how to use font sizes, weights, and styles to create visually appealing and accessible web content."
                            }
                        ]
                    }
                ]
            }
        ]
    }
    
];
// placeholder for list of Continue Watching courses
const continueWatchingIndices = [1, 2];
export const continueWatchingData: Course[] = courseListData.filter((_, index) => continueWatchingIndices.includes(index+1));

// placeholder for list of SuggestionsSection courses
const suggestionsDataIndices = [3, 5, 6]
export const suggestionsData: Course[] = courseListData.filter((_, index) => suggestionsDataIndices.includes(index+1));

// placeholder for list of Top Courses courses
const topCoursesIndices = [4, 7, 2]
export const topCourseData: Course[] = courseListData.filter((_, index) => topCoursesIndices.includes(index+1));
