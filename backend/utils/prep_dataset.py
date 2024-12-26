import csv
import random

# For scraping course picture
# pip ininstall selenium 
# pip ininstall webdriver-manager

# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from webdriver_manager.chrome import ChromeDriverManager

not_included_fieldnames = [
    'Rating',
    'Number of Review',
    # 'Course Url',
    'Schedule'
]

fieldnames_to_include = [
    'Price',
    'Course Picture Url',
]

communities = [
    {
        'name': 'University of Pennsylvania', # 1
        'description': 'The University of Pennsylvania (commonly referred to as Penn) is a private university, located in Philadelphia, Pennsylvania, United States. A member of the Ivy League, Penn is the fourth-oldest institution of higher education in the United States, and considers itself to be the first university in the United States with both undergraduate and graduate studies.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/a2/66aaaad14d426fa9798ed714b3d0e5/UniversityofPennsylvania_Vertical_RGB_coursera-cert.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.upenn.edu/'
    },
    {
        'name': 'University of Michigan', # 2
        'description': 'The mission of the University of Michigan is to serve the people of Michigan and the world through preeminence in creating, communicating, preserving and applying knowledge, art, and academic values, and in developing leaders and citizens who will challenge the present and enrich the future.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-university-assets.s3.amazonaws.com/70/de505d47be7d3a063b51b6f856a6e2/New-Block-M-Stacked-Blue-295C_600x600.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.umich.edu/'
    },
    {
        'name': 'Johns Hopkins University', # 3
        'description': 'The mission of The Johns Hopkins University is to educate its students and cultivate their capacity for life-long learning, to foster independent and original research, and to bring the benefits of discovery to the world.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-university-assets.s3.amazonaws.com/74/7ae340ec6911e5b395490a2a565172/JHU-Logo-Square-Mini_180px.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.jhu.edu/'
    },
    {
        'name': 'Imperial College London', # 4
        'description': 'Imperial College London is a world top ten university with an international reputation for excellence in science, engineering, medicine and business. located in the heart of London. Imperial is a multidisciplinary space for education, research, translation and commercialisation, harnessing science and innovation to tackle global challenges. Imperial students benefit from a world-leading, inclusive educational experience, rooted in the College’s world-leading research. Our online courses are designed to promote interactivity, learning and the development of core skills, through the use of cutting-edge digital technology.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/b1/f66aa00aa811e8b14d27d7114bc00b/ImperialCollegeLondon_BLUE_500x500px.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.imperial.ac.uk/'
    },
    {
        'name': 'Vanderbilt University', # 5
        'description': 'Vanderbilt University, located in Nashville, Tenn., is a private research university and medical center offering a full-range of undergraduate, graduate and professional degrees.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/89/63fef0315140268d5c0f66eee8e85e/VU_360x360.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.vanderbilt.edu/'
    },
    {
        'name': 'Columbia University', # 6
        'description': 'For more than 250 years, Columbia has been a leader in higher education in the nation and around the world. At the core of our wide range of academic inquiry is the commitment to attract and engage the best minds in pursuit of greater human understanding, pioneering new discoveries and service to society.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/2f/8bf130459a11e78f3f93ee93db5719/cu_collegiate_blue.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.columbia.edu/'
    },
    {
        'name': 'Arizona State University', # 7
        'description': 'Arizona State University has developed a new model for the American Research University, creating an institution that is committed to excellence, access and impact. ASU measures itself by those it includes, not by those it excludes. ASU pursues research that contributes to the public good, and ASU assumes major responsibility for the economic, social and cultural vitality of the communities that surround it.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-university-assets.s3.amazonaws.com/be/bf4290646811e5b6de89a29eb8ebc3/ASUlogo.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.asu.edu/'
    },
    {
        'name': 'University of Glasgow', # 8
        'description': 'The University of Glasgow has been changing the world since 1451. It is a world top 100 university (THE, QS) with one of the largest research bases in the UK. We are a member of the prestigious Russell Group of leading UK Universities with annual research income of more than £179m. The University’s #TeamUofG community is truly international with over 8000 staff and 28,0000 students from more than 140 countries. A 2019 Time Out survey placed Glasgow in the top ten cities in the world. Ranked between Berlin and Paris, Glasgow was voted number one for both friendliness and affordability. Right now our dedicated community of staff, students and alumni is working to address the challenges of Covid-19 and understand how we can make life safer for everyone.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/9e/afa5721489422cb3af99f23653baa1/UofG_square_colour180x180.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.gla.ac.uk/'
    },
    {
        'name': 'University of Colorado Boulder', # 9
        'description': 'CU Boulder is a dynamic community of scholars and learners on one of the most spectacular college campuses in the country. As one of 34 U.S. public institutions in the prestigious Association of American Universities (AAU), we have a proud tradition of academic excellence, with five Nobel laureates and more than 50 members of prestigious academic academies.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/a6/7035b7e00b401383be4e5856b8bdaa/Boulder-FL-VERT-B---cropped.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.colorado.edu/'
    },
    {
        'name': 'The Hong Kong University of Science and Technology', # 10
        'description': 'HKUST is a world-class research-intensive university that focuses on science, technology, and business as well as humanities and social science. HKUST offers an international campus, and a holistic and interdisciplinary pedagogy to nurture well-rounded graduates with a global vision, a strong entrepreneurial spirit, and innovative thinking.',
        'logo': "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-university-assets.s3.amazonaws.com/3a/37974779f7ad2a04626183c2f8951b/ustLogo.png?auto=format%2Ccompress&dpr=1&w=180&h=180",
        'website': 'https://www.ust.hk/'
    }
]

def is_english(string):
    return all(ord(char) < 128 for char in string)

def shorten_dataset():
    """ Shorten the dataset to 500 rows """
    with open('data/coursera_original.csv', 'r', encoding='utf-8') as in_file, \
        open('data/coursera_cleaned.csv', 'w', encoding='utf-8', newline='') as out_file:
        reader = csv.DictReader(in_file)
        fieldnames = [col for col in reader.fieldnames if col not in not_included_fieldnames]

        writer = csv.DictWriter(out_file, fieldnames=fieldnames)
        writer.writeheader()

        rows = []
        for row in reader:
            if any(
                not row[col] or
                row[col] == 'Not specified' or
                not is_english(row[col]) for col in fieldnames
            ):
                continue
            rows.append(row)

        random.shuffle(rows)

        for row in rows[:500]:
            row = {col: row[col] for col in fieldnames}
            writer.writerow(row)

def extract_communities():
    """ Extract 10 communities """
    with open('data/communities.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Name', 'Type', 'Description', 'Logo Url', 'Website Url'])
        for community in communities:
            writer.writerow([
                community["name"],
                "university",
                community["description"],
                community["logo"],
                community["website"]
            ])

def extract_instructors():
    """ Extract 200 instructors """
    community_names = [community['name'] for community in communities]
    instructors = set()

    with open('data/coursera_original.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Offered By'] not in community_names:
                continue
            for instructor in row['Instructor'].split(','):
                if len(instructor.split()) == 1:
                    continue
                if "Freddie Page" in instructor or "MacMillan" in instructor:
                    print(instructor)
                    continue
                if not is_english(instructor):
                    continue
                instructors.add(instructor.strip())
            if len(instructors) >= 200:
                break

    with open('data/instructors.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Name',
            'Email',
            'Password',
            'Gender',
            'Phone Number',
            'Company',
            'Position'
        ])
        for instructor in instructors:
            writer.writerow([
                instructor,
                instructor.replace('.', '').replace('(', '').replace(')', '').replace(' ', '_').lower() + "@edu.com",
                instructor.replace('.', '').replace('(', '').replace(')', '').replace(' ', '_'),
                random.choice(["male", "female"]),
                '+65' + str(random.choice([8, 9])) + ''.join([str(random.randint(0, 9)) for _ in range(7)]),
                random.choice(community_names),
                "Professor"
            ])

def optimise_dataset():
    """ 500 courses, 200 instructors, 10 communities """
    community_instructor = {}
    with open('data/instructors.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Company'] not in community_instructor:
                community_instructor[row['Company']] = []
            community_instructor[row['Company']].append(row['Name'])
    
    for community, instructors in community_instructor.items():
        print(f"{community}: {len(instructors)}")

    with open('data/coursera_cleaned.csv', 'r', encoding='utf-8') as read_file:
        reader = csv.reader(read_file)
        headers = next(reader)

        instructor_index = headers.index("Instructor")
        offered_by_index = headers.index("Offered By")
        
        for fieldname in fieldnames_to_include:
            headers.append(fieldname)

        modified_rows = [headers]
        for row in reader:
            community = random.choice(list(community_instructor.keys()))

            row[instructor_index] = ', '.join(random.sample(community_instructor[community], random.randint(1, 5)))
            row[offered_by_index] = community

            price = 0 if random.random() < 0.9 else round(random.uniform(1.00, 50.00), 2)
            if price != 0:
                price = round(price) + random.choice([0.00, 0.50, 0.99])
            row.extend([
                price,
                "https://www.google.com"
            ])

            modified_rows.append(row)
        
        with open('data/coursera_cleaned.csv', 'w', encoding='utf-8', newline='') as write_file:
            writer = csv.writer(write_file)
            writer.writerows(modified_rows)

def scrape_course_picture():
    """ Scrape the course picture of a Coursera course """
    # Set up Chrome options
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    chrome_options.add_argument("--start-maximized")

    # Set up the Chrome driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Open a webpage
    url = "https://www.coursera.com"
    driver.get(url)

    def loop_courses(course_url):
        # Go to the course page
        driver.get(course_url)

        # Wait for the course page to load
        driver.implicitly_wait(20)

        try:
            # Go back to main page
            home_button = driver.find_element(By.XPATH, "//a[@aria-label='Home']")
            home_button.click()
        except Exception as e:
            print(f"Home button not found for {course_url}: {e}")
            return None

        # Wait for the home page to load
        driver.implicitly_wait(10)

        # Locate the course picture
        course_picture_div = driver.find_element(By.XPATH, "//div[contains(@class, 'cds-CommonCard-previewImage')]")
        course_picture = course_picture_div.find_element(By.TAG_NAME, "img")
        course_picture_url = course_picture.get_attribute("src")

        return course_picture_url

    try:
        driver.implicitly_wait(10)
        # Locate and click the login button
        login_button = driver.find_element(By.XPATH, "//a[@data-e2e='header-login-button']")
        login_button.click()

        # Wait for the login page to load
        driver.implicitly_wait(10)

        # Enter the username
        username_field = driver.find_element(By.XPATH, "//input[@data-e2e='login-email-input']")
        username_field.send_keys("*****") # Replace with your email

        # Enter the password
        password_field = driver.find_element(By.XPATH, "//input[@data-e2e='login-password-input']")
        password_field.send_keys("*******") # Replace with your password

        # Click the login button
        submit_button = driver.find_element(By.XPATH, "//button[@data-e2e='login-form-submit-button']")
        submit_button.click()

        # Wait for the login process to complete
        driver.implicitly_wait(10)

        # Wait for an element that appears after login to ensure login is complete
        driver.find_element(By.XPATH, "//button[@data-e2e='header-profile']")

        with open('data/coursera_cleaned.csv', 'r', encoding='utf-8') as read_file:
            reader = csv.reader(read_file)
            headers = next(reader)

            course_url_index = headers.index("Course Url")
            course_picture_index = headers.index("Course Picture Url")

            modified_rows = [headers]
            for row in reader:
                course_url = row[course_url_index]
                course_picture = loop_courses(course_url)
                if not course_picture:
                    continue
                print(course_picture)
                row[course_picture_index] = course_picture
                modified_rows.append(row)

            with open('data/coursera_cleaned.csv', 'w', encoding='utf-8', newline='') as write_file:
                writer = csv.writer(write_file)
                writer.writerows(modified_rows)
        
    except Exception as e:
        print(e)

if __name__ == '__main__':
    # shorten_dataset()
    # extract_communities()
    # extract_instructors()
    optimise_dataset()
    # scrape_course_picture()