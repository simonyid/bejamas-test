**# 🧪 Playwright Test Suite**  
  
This repository contains end-to-end tests written with [Playwright](https://playwright.dev). It supports environment variables via a `.env` file.  

  

**## 🚀 Setup Instructions**  
  
**### 1. Clone the Repository**  
  
git clone https://github.com/simonyid/bejamas-test.git  
cd bejamas-test  
  
  
**### 2. Install Dependencies**  
npm install  
  
**### 3. ⚙️ Environment Configuration**  
To configure environment variables (Home URL, test e-mail address etc), create a .env file in the root of the project  
  
**Example .env file:**  
TEST_EMAIL_VALID=test@example-valid.com  
TEST_EMAIL_INVALID=invalid-email  
USER_EMAIL=registered.user@email.com  
USER_PASSWORD=registerd.user.password  
HOME_URL=https://www.mywebsite.com/  
SITEMAP_URL=https://www.mywebsite.com/sitemap.xml  
  
**### 4. 🧪 Running the Tests**  
npx playwright test  
npx playwright test --headed  
npx playwright test tests/example.spec.ts  
  
**### 🔐 Best Practices**  
Don't commit .env files — add .env to .gitignore.  
Use test IDs or stable selectors for element targeting.  
Use tags to group and filter tests (e.g., @smoke, @regression).  
