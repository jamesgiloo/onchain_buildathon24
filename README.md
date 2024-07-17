# onchain_buildathon24

Our platform creates an ecosystem where filmmakers, curators, and audiences collaborate around impactful stories. Onchain Points and Proof of Watch credentials reward engagement, providing tangible measures of participation and exclusive opportunities for content and experiences. Additionally, our Drop and Gift feature leverages onchain data to foster stronger relationships between filmmakers, curators, and their audiences. This holistic approach not only solves the pressing issues in the entertainment industry but also creates a vibrant, engaged community where every member's contribution is valued and recognized.

## Introduction
This project is a React-based web application that interacts with Web3 functionalities, leveraging various libraries and APIs.

This is just the first version, and there are still many places that are not rigorous enough. It is expected to be more complete in the future.

## Demo Page
Profile page: https://react-with-cloudrun-hwarpj473a-uc.a.run.app/movie-profile/0xB23D78c22d0d28Decb681f7000B0AE90ED44bBc7
Filter page: https://react-with-cloudrun-hwarpj473a-uc.a.run.app/airdrop

## Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.x or higher)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```


## Running the Application

### Change your address in address map
In order to cultivate loyalty, we have specially set up an address map so that users can see their own names and their own profile pictures, which increases users’ uniqueness and sense of identity here.

in src/data/userAddressMap.js add:
```sh
const userList = [
    {
        name: "name",
        address: "address",
        Icon: "icon link"
    },
]
```

### React server
To run the application with frontend, execute the following command:
```sh
npm start
# or
yarn start
```

### API server
To run the application with frontend, execute the following command:
```sh
cd backend
node server.js
```
