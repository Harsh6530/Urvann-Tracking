# Urvann Tracking

Platform to facilitate customers with tracking details of their orders.

## Table of Contents

- [Installation](#installation)
- [Defining environment variables](#defining-environment-variables)
- [Run the development environment](#run-the-development-environment)


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Samya-S/Urvann-Tracking.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Urvann-Tracking
    ```

3. Install dependencies:
   
   ```bash
   npm install
   ```
   or alternatively
   ```bash
   npm i
   ```
   
   `Make sure to have nodejs and npm installed`

## Defining environment variables

  ```bash
  MONGODB_URI="<mongo db url of Urvann Seller Panel>"
  STOREHIPPODB_URI="<mongo db url of store hippo>"
  JWT_SECRET="<jwt secret>"
  ```

## Run the development environment

  ```bash
  npm run dev
  ```
