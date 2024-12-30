import PhoneNumberInputField from "@/components/PhoneNumberInputField";
import icons from "@/constants/icons";

export const carouselPageConstants = {
    slides: [
        //THE IMAGE PATHS WORK FROM HERE!!!
        {
            id: "1",
            image: require("../assets/images/slide1.png"),
            title: "Enter the World of E-Learning",
            subtitle:
                "Begin Your Educational Journey With Access To A Diverse Range Of Courses.",
        },
        {
            id: "2",
            image: require("../assets/images/slide2.png"),
            title: "Embark on Your Learning Adventure",
            subtitle:
                "Explore interactive lessons, quizzes, and multimedia content to enhance your understanding.",
        },
        {
            id: "3",
            image: require("../assets/images/slide3.png"),
            title: "Engage with Expert Instructors",
            subtitle:
                "Connect with knowledgeable tutors for personalized guidance.",
        },
        {
            id: "4",
            image: require("../assets/images/slide4.png"),
            title: "Personalize Your Learning Path",
            subtitle:
                "Customize your learning with progress tracking, and interactive activities.",
        },
    ],
    contButtonText: "CONTINUE",
};

export const signUpSelectionConstants = {
    pageTitle: "I am a...",
    roles: [
        {
            image: require("../assets/images/Instructor.png"),
            buttonText: "INSTRUCTOR",
        },
        {
            image: require("../assets/images/Students.png"),
            buttonText: "STUDENT",
        },
    ],
    pageSubTitle: "Endless Opportunities. For Anyone.",
};

export const memberSignInUpPageConstants = {
    signUpPageTitle: "Unlock Your Learning Potential",
    signUpPageSubtitle:
        "Your Gateway To Personalized Courses, And Guidance For Success.",
    signInButtonText: "SIGN IN",
    signUpButtonText: "SIGN UP",
    homepageButtonText: "HOMEPAGE",
    adminButtonText: "ADMIN",
};

export const instructorSignInUpPageConstants = {
    signUpPageTitle: "Share your knowledge",
    signUpPageSubtitle: "Your Gateway To Empower And Guide Others.",
    signInButtonText: "SIGN IN",
    signUpButtonText: "SIGN UP",
    homepageButtonText: "HOMEPAGE",
    adminButtonText: "ADMIN",
};

export const memberLoginPageConstants = {
    pageTitle: "SIGN IN",
    pageSubTitle: "Sign In To Access Your Personalized Learning Journey",
    fields: [
        {
            inputTitle: "Email",
            placeHolder: "Email",
        },
        { inputTitle: "Password", placeHolder: "Password" },
        { inputTitle: "Domain", options: ["Member", "Instructor"] },
    ],
    signInButtonText: "Sign In",
};

export const instructorLoginPageConstants = {
    pageTitle: "SIGN IN",
    pageSubTitle: "Sign In To Begin Your Journey Of Empowering Others.",
    fields: [
        {
            inputTitle: "Email",
            placeHolder: "Email",
        },
        { inputTitle: "Password", placeHolder: "Password" },
        { inputTitle: "Domain", options: ["Member", "Instructor"] },
    ],
    signInButtonText: "Sign In",
};

export const signUpPageConstants = {
    pageTitle: "SIGN UP",
    pageSubTitle: "Create Your Account To Embark On A Journey Of Learning.",
    fields: [
        {
            inputTitle: "Username",
            placeHolder: "John Cena",
        },
        {
            inputTitle: "Email",
            placeHolder: "youremail@gmail.com",
        },
        {
            inputTitle: "Gender",
            options: ["Male", "Female"],
        },
        { inputTitle: "Password", placeHolder: "Password" },
        {
            inputTitle: "Confirm Password",
            placeHolder: "Password",
        },
    ],
    regButtonText: "Register",
};

export const instructorSignUpPageConstants = {
    pageTitle: "SIGN UP",
    pageSubTitle:
        "Create your account to embark on a Mission to illuminate minds.",
    fields: [
        {
            inputTitle: "Username",
            placeHolder: "John Cena",
        },
        {
            inputTitle: "Email",
            placeHolder: "youremail@gmail.com",
        },
        {
            inputTitle: "Gender",
            options: ["Male", "Female"],
        },
        {
            inputTitle: "Phone number",
            placeHolder: "+6591825901",
        },
        {
            inputTitle: "Company",
            placeHolder: "DanielDantePteLtd",
        },
        {
            inputTitle: "Position in Company",
            placeHolder: "Chief Tech Officer",
        },
        { inputTitle: "Password", placeHolder: "Password" },
        {
            inputTitle: "Confirm Password",
            placeHolder: "Password",
        },
    ],
    areaCodes: [
        "+1 USA",
        "+65 Singapore",
        "+86 China",
        "+44 United Kingdom",
        "+49 Germany",
        "+33 France",
        "+61 Australia",
        "+62 Indonesia",
        "+64 New Zealand",
        "+91 India",
        "+52 Mexico",
        "+81 Japan",
        "+82 South Korea",
        "+7 Russia",
        "+55 Brazil",
        "+234 Nigeria",
        "+351 Portugal",
        "+46 Sweden",
        "+48 Poland",
        "+971 United Arab Emirates",
        "+94 Sri Lanka",
        "+27 South Africa",
        "+39 Italy",
        "+34 Spain",
        "+93 Afghanistan",
    ],
    regButtonText: "Register",
};

export const registrationSuccessMember = {
    pageTitle: "MobiLearn",
    blueSubTitle: "You have registered as a",
    role: "Student",
    subTitle: "Welcome to A Lifelong Of Learning.",
    linkText: "Begin Learning",
    image: require("../assets/images/Students.png"),
};

export const registrationSuccessInstructor = {
    pageTitle: "MobiLearn",
    blueSubTitle: "You have registered as a",
    role: "Instructor",
    subTitle: "Welcome to A Lifelong Of Cultivating Minds.",
    linkText: "Sign In",
    image: require("../assets/images/Instructor.png"),
};

export const waitingPageInstructor = {
    pageTitle: "MobiLearn",
    blueSubTitle: "Your account is",
    status: "Pending Approval",
    subTitle: "An administrator will review your account shortly.",
    linkText: "Sign In",
    image: require("../assets/images/Instructor.png"),
};

export const notificationsConstants = {
    pageTitle: "Notification",
};

export const memberGuestHomeConstants = {
    notifBellButton: require("@/assets/images/member_guest_images/notifBell.png"),
    suggestionsSubHeader: "Suggestions for You",
    topCoursesSubHeader: "Top Courses",
    seeAllText: "See All",
};

export const memberGuestAppBarConstants = {
    hamburgerIcon: require("@/assets/images/member_guest_images/hamburger.png"),
    dropDownPlaceholder: "Select item",
    searchPlaceholder: "Search...",
};

export const memberGuestSearchConstants = {
    inputPlaceholder: "Search",
};

export const memberGuestContinueWatchingConstants = {
    starIcon: require("@/assets/images/member_guest_images/starRating.png"),
    completionRateText: "% completed",
    continueWatchingSubtitle: "Continue Watching",
};

export const memberGuestSuggestionsSectionConstants = {
    starIcon: require("@/assets/images/member_guest_images/starRating.png"),
};

export const memberGuestTopCoursesSectionConstants = {
    starIcon: require("@/assets/images/member_guest_images/starRating.png"),
};

export const memberGuestSuggestionsSeeAll = {
    backButton: require("@/assets/images/notifications/backButton.png"),
    appBarTitle: "Suggestions for You",
};

export const memberGuestTopCoursesSeeAll = {
    backButton: require("@/assets/images/notifications/backButton.png"),
    appBarTitle: "Top Courses",
};

export const memberGuestCoursePage = {
    appBarTitle: "My Courses",
    notifBellButton: require("@/assets/images/member_guest_images/notifBell.png"),
    savedCoursesTitle: "Saved Courses",
    inProgressCoursesTitle: "In Progress",
    completedCoursesTitle: "Completed",
};

export const memberGuestProfilePage = {
    appBarTitle: "My Profile",
    editIcon: require("@/assets/images/icons/edit.png"),
    paymentMethodTitle: "Payment Method",
    donateTitle: "Donate",
    logOutTitle: "Logout",
    default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
};

export const memberGuestEditProfilePage = {
    appBarTitle: "Edit Profile",
    editProfilePicture: require("@/assets/images/icons/editProfilePicture.png"),
    fields: [
        {
            name: {
                inputTitle: "Your username",
                modalDetails: [
                    {
                        inputTitle: "Username",
                        placeholder: "Please enter username",
                    },
                ],
            },
        },
        {
            email: {
                inputTitle: "Email",
                modalDetails: [
                    { inputTitle: "Email", placeholder: "Please enter email" },
                ],
            },
        },
        {
            gender: {
                inputTitle: "Gender",
                modalDetails: [
                    { inputTitle: "Gender", options: ["Male", "Female"] },
                ],
            },
        },
        {
            password: {
                inputTitle: "Password",
                modalDetails: [
                    { inputTitle: "Old Password", placeholder: "******" },
                    { inputTitle: "New Password", placeholder: "******" },
                ],
            },
        },
    ],
    saveChanges: "Save",
    default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
};

export const memberGuestEditProfileFields = {
    edit: "Edit",
    notAdded: "Not added",
    maskedPassword: "******",
};

export const memberGuestEditProfilePopUp = {
    save: "SAVE",
};

export const memberGuestPaymentMethodPage = {
    appBarTitle: "Payment Method",
    title: "Select Payment Method",
};

export const inputDropDownFieldConstants = {
    selectOption: "Please select an option",
};

export const phoneNumberInputFieldConstants = {
    search: "Search...",
    enterPhone: "Enter your phone number",
    seachAreaCode: "Search area codes",
};

export const courseDetailsConstants = {
    enrolledCountText: " students already enrolled",
    courseDetails: "Course Details",
    lecture: "Lecture",
    learningTime: "Learning Time",
    certification: "Certification",
    numLectures: "+ Lectures",
    skillsTitle: "Skills",
    enrollNowButton: "ENROLL NOW",
};

export const paymentProgressBarConstants = {
    stepText: [1, 2, 3],
    stepLabel: ["Overview", "Payment Method", "Completed"],
};

export const paymentOverviewConstants = {
    title: "Overview",
    courseNameSubtitle: "Course Name: ",
    numLectures: "+ Lectures",
    skillsTitle: "Skills",
    totalPrice: "Total Price",
    dollar: "$",
    continueButton: "CONTINUE",
    dollarIcon: icons.dollar,
    currency: "$",
};

export const paymentMethodConstants = {
    title: "Select Payment Method",
    dollarIcon: icons.dollar,
    totalPrice: "Total Price",
    currency: "$",
    continueButton: "CONTINUE",
};

export const paymentCardDetailsConstants = {
    title: "Add Card Details",
    cardNumberPlaceholder: "Card Number",
    cvvNumberPlaceholder: "CVV Number",
    expiryDatePlaceholder: "Expiry Date",
    namePlaceholder: "Name on Card",
    dollarIcon: icons.dollar,
    totalPrice: "Total Price",
    currency: "$",
    continueButton: "CONTINUE",
    disclaimer:
        "We will store and use your card details for smooth and secure future purchases.",
};

export const paymentCompletedConstants = {
    completePurchase: require("@/assets/images/member_guest_images/completePurchase.png"),
    completePurchaseSlide: require("@/assets/images/member_guest_images/completePurchaseSlide.png"),
    congratulations: "Congratulations!",
    congratulationSubtext: "Start Your Learning Today",
    continueButton: "CONTINUE",
};

export const courseContentConstants = {
    chapter: "Chap",
    pickerPlaceholder: "Select a chapter",
    courseContents: "Course Contents",
    lesson: "Lesson",
    tick: require("@/assets/images/icons/tick.png"),
};

export const instructorHomePageConstants = {
    pageTitle: "Home",
};

export const instructorStatisticsConstants = {
    pageTitle: "Statistics",
    dropdown: ["Week", "Month", "Year"],
};

export const instructorNewsConstants = {
    pageTitle: "Latest News",
    seeAll: "See All",
};

export const instructorCoursePageConstants = {
    appBarTitle: "My Courses",
    createCourseText: "Create Course",
    searchBarPlaceholder: "Search for a course",
};

export const instructorCourseListItemsConstants = {
    viewCourse: "View Course",
};

export const instructorCreateCoursePageConstants = {
    createCoursePageTitle: "Create Course",
    editCoursePageTitle: "Edit Course",
    courseTitle: "Course Title",
    courseInfo: "Course Information",
    field: "Field of Study",
    field_options: ["Engineering", "Mathematics", "Physics", "Biology"],
    field_placeholder: "Select a field",
    chapters: "Manage Chapters",
    chapter_placeholder: "Chapter",
    chapterPageTitle: "Edit Chapter",
    chapter: "Chapter",
    chapterInfo: "Chapter Information",
    lessons: "Manage Lessons",
    lesson_options: [
        "1 Lesson",
        "2 Lessons",
        "3 Lessons",
        "4 Lessons",
        "5 Lessons",
    ],
    lesson_placeholder: "Lesson",
    placeholder: "Lorem ipsum",
};

export const memberChannelSignUpPage = {
    pageTitle: "Channel Registration",
    dropDownTitle: "Select a channel",
    inviteCodeTitle: "Or enter an invite code",
    inviteCodePlaceholder: "Enter invite code",
};

export const memberDonatePage = {
    appBarTitle: "Support Us",
    donateText1: "Your donations help us provide valuable content to learners worldwide.",
    donateText2: "Thank you for your support!",
    donateButtonText: "Donate",
    merchantDisplayName: "MobiLearn, Inc."
};