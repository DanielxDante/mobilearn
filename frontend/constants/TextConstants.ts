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
            placeHolder: "Email",
        },
        { inputTitle: "Password", placeHolder: "Password" },
        { inputTitle: "Domain", options: ["Member", "Instructor"] },
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
    regButtonText: "Register",
};

export const registrationSuccessMember = {
    pageTitle: "MobiLearn",
    blueSubTitle: "You have registered as a",
    role: "Student",
    subTitle: "Welcome to A Lifelong Of Learning.",
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
    logOutTitle: "Log out",
};

export const memberGuestEditProfilePage = {
    appBarTitle: "Edit Profile",
    editProfilePicture: require("@/assets/images/icons/editProfilePicture.png"),
    fields: [
        {
            inputTitle: "Username",
        },
        {
            inputTitle: "Email",
        },
        {
            inputTitle: "Gender",
            options: ["Male", "Female"],
        },
        {
            inputTitle: "Password",
            placeholder: "******",
        },
        {
            inputTitle: "Confirm Password",
            placeholder: "******",
        },
    ],
    saveChanges: "Save",
};
