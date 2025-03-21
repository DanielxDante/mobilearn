import ResetPasswordPage from "@/app/shared/resetPasswordPage";
import PhoneNumberInputField from "@/components/PhoneNumberInputField";
import icons from "@/constants/icons";
import { add, update } from "lodash";

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
      subtitle: "Connect with knowledgeable tutors for personalized guidance.",
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
  invalidCredentialsAlert:
    "Please check your email and password and try again.",
  errorSigningUpAlert: "An error occurred while signing up.",
  unexpectedErrorAlert: "An unexpected error occurred.",
  accountDisabledAlert: "Your account has been disabled.",
  dontHaveAccountText: "New to MobiLearn? ",
  signUpText: "Sign Up",
  inputsEmptyAlert: "Please fill in all fields.",
  forgotPassword: "Forgot password?",
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
  invalidCredentialsAlert:
    "Please check your email and password and try again.",
  accountDisabledAlert: "Your account has been disabled.",
  errorSigningUpAlert: "An error occurred while signing up.",
  unexpectedErrorAlert: "An unexpected error occurred.",
  dontHaveAccountText: "Don't have an account?",
  signUpText: "Sign Up here",
  inputsEmptyAlert: "Please fill in all fields.",
  forgotPassword: "Forgot password?",
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
  inputsEmptyAlert: "Please fill in all fields.",
  passwordMismatchAlert: "Passwords do not match.",
  accountDisabledAlert: "Your account has been disabled.",
  invalidCredentialsAlert:
    "Please check your email and password and try again.",
  errorSigningUpAlert: "An error occurred while signing up.",
  emailInUseAlert: "The email is already in use.",
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
  inputsEmptyAlert: "Please fill in all fields.",
  passwordMismatchAlert: "Passwords do not match.",
  errorSigningUpAlert: "The email is already in use.",
  regButtonText: "Register",
  accountDisabledAlert: "Your account has been disabled.",
  invalidCredentialsAlert:
    "Please check your email and password and try again.",
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
  pageTitle: "Notifications",
};

export const memberGuestHomeConstants = {
  notifBellButton: require("@/assets/images/member_guest_images/notifBell.png"),
  suggestionsSubHeader: "Suggestions for You",
  topCoursesSubHeader: "Top Courses",
  seeAllText: "See All",
};

export const memberGuestAppBarConstants = {
  hamburgerIcon: require("@/assets/images/member_guest_images/hamburger.png"),
  dropDownPlaceholder: "Switch Channel",
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
  loading: "Loading...",
  endText: "No more courses available",
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
  settingsTitle: "Settings",
  donateTitle: "Donate",
  logOutTitle: "Logout",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  normalDisplayName: "Learner",
  memberDisplayName: "Member",
  coreMemberDisplayName: "Senior",
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
        modalDetails: [{ inputTitle: "Gender", options: ["Male", "Female"] }],
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
  merchantDisplayName: "MobiLearn, Inc.",
  free: "Free",
  paymentCancelled: "Payment cancelled, You have cancelled payment.",
  courseEnrollmentNotificationTitle: "Course enrollment completed.",
  courseEnrollmentNotificationSubTitle:
    "You have successfully enrolled in a course!",
  error: "Error",
  storeError: "An error occured in the store.",
  donationError:
    "An error occurred while processing your donation. Please try again later.",
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
  noLessonsAvailable: "No lessons available",
  backButton: require("@/assets/images/notifications/backButton.png"),
  editCourseTitle: "Edit Course",
  reviewButton: "Reviews",
};

export const instructorHomePageConstants = {
  pageTitle: "Home",
};

export const instructorStatisticsConstants = {
  pageTitle: "Statistics",
  dropdown: ["Weekly", "Monthly", "Yearly"],
  totalLessons: "Total Lessons",
  totalEnrollments: "Total Enrollments",
  averageCourseProgress: "Avg Course Progress",
  totalReviews: "Total Reviews",
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
  courseName: "Course Title",
  courseDescription: "Course Description",
  courseType: "Course Type",
  courseType_options: ["Academic", "Professional", "Specialization", "Project"],
  courseDuration: "Course Duration",
  coursePicture: "Course Picture",
  coursePicturePlaceholder: "Upload a picture",
  coursePictureUploadedPlaceholder: "Picture uploaded",
  coursePrice: "Course Price",
  coursePricePlaceholder: "Enter course price",
  courseDifficulty: "Course Difficulty",
  courseDifficulty_options: ["Beginner", "Intermediate", "Advanced"],
  courseSkills: "Course Skills",
  courseSkillsPlaceholder: "Python, Java, C++",
  courseSchoolName: "School Name",
  courseSchoolNamePlaceholder: "Enter school name",
  programType: "Program Type",
  major: "Major",
  majorPlaceholder: "Computer Science",
  department: "Department",
  departmentPlaceholder: "Engineering",
  subject: "Subject",
  subjectPlaceholder: "Mathematics",
  platform: "Platform",
  field: "Field of Study",
  field_options: ["Engineering", "Mathematics", "Physics", "Biology"],
  field_placeholder: "Select a field",
  manageChapters: "Manage Chapters",
  addChapter: "Add Chapter",
  chapter_placeholder: "Chapter",
  chapterPageTitle: "Edit Chapter",
  editChapterTitle: "Chapter Title",
  editLessonTitle: "Edit Lesson",
  chapterInfo: "Chapter Information",
  manageLessons: "Manage Lessons",
  lesson_options: [
    "1 Lesson",
    "2 Lessons",
    "3 Lessons",
    "4 Lessons",
    "5 Lessons",
  ],
  numberOfLessons: "Number of Lessons",
  numberOfLessonsOptions: ["1", "2", "3", "4", "5"],
  lesson_placeholder: "Lesson",
  lessonTypePlaceholder: "Select lesson type",
  placeholder: "Lorem ipsum",
  duration_placeholder: "10",
  homework: "Upload homework",
  homework_placeholder: "Upload homework",
  video: "Upload video",
  video_placeholder: "Upload video",
  asyncLoadMessage: "Loaded course data from AsyncStorage",
  asyncFailLoadMessage: "Failed to load course data from AsyncStorage",
  asyncFailSaveMessage: "Failed to save course data to AsyncStorage",
  asyncFailClearMessage: "Failed to clear course data from AsyncStorage",
  // title_key: "title",
  // lessonType_key: "lesson_type",
  // order_key: "order",
  // content_key: "content",
  // video_key: "video_key",
  // homework_key: "homework_key",
  profilePictureUploadAlert: "Profile picture has been updated.",
  fileUndefinedAlert: "File is undefined.",
  handleEditProfilePictureError: "Error in handleEditProfilePicture:",
  videoUploadedAlert: "Video has been uploaded.",
  handleUploadVideoError: "Error in handleUploadVideo:",
  pdfUploadedAlert: "PDF has been uploaded.",
  noFileSelectedError: "No file selected.",
  handleUploadPdfError: "Error in handleUploadPdf:",
  checkingPermissionError: "Error in checking permission:",
  permissionDeniedAlert:
    "Sorry, we need camera roll permissions to make this work!",
  nextButtonText: "Next",
  saveButtonText: "Save",
  updateButtonText: "Update",
  createButtonText: "Create Course",
  minus: "-",
  plus: "+",
  lessonTypeTitle: "Lesson Type",
  lessonTypeOptions: ["Text", "Video", "Homework"],
  noUriReturnedError: "No uri returned from document picker.",
  fillAllFieldsAlert: "Please fill all fields.",
  courseCreatedAlert: "Course has been created.",
  emptyLessonAlert:
    "You have a lesson with no content. Remove it, or add content.",
  courseCreationFailedAlert: "Failed to create course.",
  emptyChapterAlert: "You need to make at least one chapter!",
  courseUpdatedAlert: "Course has been updated.",
  chapterRemovalDenial: "Existing chapters cannot be removed.",
};

export const instructorEditProfilePage = {
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
        modalDetails: [{ inputTitle: "Gender", options: ["Male", "Female"] }],
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
    {
      phone_number: {
        inputTitle: "Phone Number",
        modalDetails: [
          {
            inputTitle: "Phone Number",
            placeholder: "+11234567890",
          },
        ],
      },
    },
    {
      company: {
        inputTitle: "Company",
        modalDetails: [{ inputTitle: "Company" }],
      },
    },
    {
      position: {
        inputTitle: "Position",
        modalDetails: [
          {
            inputTitle: "Position",
            placeholder: "Please enter position",
          },
        ],
      },
    },
  ],
  saveChanges: "Save",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
};

export const memberChannelSignUpPage = {
  pageTitle: "Channel Registration",
  noChannelsAvailable: "No channels available",
  dropDownTitle: "Select a channel",
  inviteCodeTitle1: "Please enter an invite code",
  inviteCodeTitle2: "Or enter an invite code",
  inviteCodePlaceholder: "Enter invite code",
  inviteCodeTitle: "Or enter an invite code",
};

export const memberDonatePage = {
  appBarTitle: "Support Us",
  donateText1:
    "Your donations help us provide valuable content to learners worldwide.",
  donateText2: "Thank you for your support!",
  donateButtonText: "Donate",
  merchantDisplayName: "MobiLearn, Inc.",
  paymentCancelledAlert: "Payment cancelled. You have cancelled the donation.",
  paymentSuccessAlert: "Payment successful. Thank you for your donation!",
  donationSuccessful: "Donation successful.",
  yourDonationMessage: "You have donated $",
  error: "Error",
  donationErrorMessage:
    "An error occurred while processing your donation. Please try again later.",
};

export const chat = {
  appBarTitle: "Chats",
  addChat: require("@/assets/images/addChat.png"),
  searchChat: require("@/assets/images/searchChat.png"),
  noChatText: "No chats available. Start a conversation!",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
};

export const chatChannel = {
  backButton: require("@/assets/images/notifications/backButton.png"),
  clipIcon: require("@/assets/images/icons/clipIcon.png"),
  msgInputPlaceholder: "Write a message...",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  WAchatBackgroundEdited: require("@/assets/images/WAchatbackgroundEdited.jpg"),
  sendMsgButton: require("@/assets/images/icons/sendMsgButton.png"),
};

export const lessonContentPage = {
  pageHeader: "Lesson Content",
  homework: "Homework",
  download: "Click to Download",
  upload: "Submit Homework",
};

export const communityPage = {
  instructors: "Instructors",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
};

export const reviewPageConstants = {
  backButton: require("@/assets/images/notifications/backButton.png"),
  title: "Leave a Review",
  submit: "Submit",
  placeholder: "Leave a review",
};

export const notificationUtility = {
  pushTokenRequiredError: "Expo Push Token is required to send notifications.",
  failedSendNotification: "Failed to send notification: ",
  notificationSuccess: "Notification sent successfully!",
  errorSendingNotification: "Error sending notification:",
};

export const lessonContentConstants = {
  complete: "COMPLETE",
  noUriReturnedError: "No uri returned from document picker.",
  pdfUploadedAlert: "PDF has been uploaded.",
  noFileSelectedError: "No file selected.",
  handleUploadPdfError: "Error in handleUploadPDF:",
};

export const resetPasswordPage = {
  backButton: require("@/assets/images/notifications/backButton.png"),
  title: "Forgot your password",
  subtitle:
    "Enter the email associated with your account and we'll send you password reset instructions.",
  emailFieldHeader: "Your email",
  emailButton: "Send reset instructions",
  invalidEmail: "Please enter a valid email.",
};

export const resetPasswordAwait = {
  backButton: require("@/assets/images/notifications/backButton.png"),
  title: "Check your email",
  subtitle1: "Please check the email address ",
  subtitle2: " for instructions to reset your password.",
};

export const newPasswordPage = {
  backButton: require("@/assets/images/notifications/backButton.png"),
  emptyPassword: "Please enter a password",
  differentPassword: "Passwords do not match",
  title: "Reset Password",
  placeholder1: "New Password",
  placeholder2: "Confirm Password",
  submitButton: "Reset Password",
};

export const privateChatDetails = {
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  backButton: require("@/assets/images/notifications/backButton.png"),
  email: "Email: ",
};

export const groupChatDetails = {
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  backButton: require("@/assets/images/notifications/backButton.png"),
  editProfilePicture: require("@/assets/images/icons/editProfilePicture.png"),
  edit: "Edit",
  save: "Save",
  leave: "EXIT GROUP",
  admin: "Admin",
  undefinedFile: "File is undefined.",
  handleEditProfilePictureError: "Error in handleEditProfilePicture:",
  checkPermissionError: "Error in checking permission:",
  requestPermissionFail:
    "Sorry, we need camera roll permissions to make this work!",
  deleteGroup: "Delete Group",
  deleteGroupConfirmation: "Are you sure you want to delete this group?",
  cancel: "Cancel",
  loadImageError: "Error loading image: ",
};

export const searchChat = {
  backButton: require("@/assets/images/notifications/backButton.png"),
  title: "Search",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  searchBar: "Search...",
};

export const reviewsPageConstants = {
  title: "Reviews",
  noReviewsText: "No reviews",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  sorts: ["Recent", "5 stars", "4 stars", "3 stars", "2 stars", "1 star"],
};

export const chatDetailsPopUp = {
  promote: "Promote To Admin",
  remove: "Remove from group",
  error: "Error",
  participantNotElevated: "Participant not elevated to admin",
  participantNotRemoved: "Participant not removed",
  ok: "Ok",
};

export const groupCreationPage = {
  createGroupAlertCheck: "Please enter a group name and select participants.",
  groupChatCreated: "Group chat created successfully!",
  failedGroupChatCreation: "Failed to create group chat.",
  backButton: require("@/assets/images/notifications/backButton.png"),
  createGroup: "Create Group",
  groupNameInputTitle: "Group Name",
  groupNamePlaceholder: "Enter Group Name",
  default_profile_picture: require("@/assets/images/member_guest_images/blank_profile_pic.jpg"),
  noUsersSelected: "No users selected",
  done: "Done",
};
