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

export const SignInUpPageConstants = {
    signUpPageTitle: "Unlock Your Learning Potential",
    signUpPageSubtitle:
        "Your Gateway To Personalized Courses, And Guidance For Success.",
    signInButtonText: "SIGN IN",
    signUpButtonText: "SIGN UP",
    homepageButtonText: "HOMEPAGE",
    adminButtonText: "ADMIN",
};

export const loginPageConstants = {
    pageTitle: "SIGN IN",
    pageSubTitle: "Sign In To Access Your Personalized Learning Journey",
    fields: [
        {
            inputTitle: "Email",
            placeHolder: "youremail@gmail.com",
        },
        { inputTitle: "Password", placeHolder: "Password" },
    ],
    signInButtonText: "Sign In",
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
